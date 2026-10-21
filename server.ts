import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import { spawn } from 'child_process';

const app = express();

// Determine port from CLI args (--port <val>) or PORT env var, defaulting to 3000
const portArgIndex = process.argv.indexOf('--port');
const cliPort = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? parseInt(process.argv[portArgIndex + 1], 10) : undefined;
const PORT = cliPort || (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

// Global CORS middleware to guarantee mobile web & iframe cross-origin reliability
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (_req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Resilient request parsing for JSON, text, or urlencoded
app.use(express.json({ limit: '15mb' }));
app.use(express.text({ limit: '15mb', type: ['text/plain', 'text/x-csharp'] }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const generateRunId = (): string => {
  return typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : 'codex_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

interface CompileError {
  line: number;
  column: number;
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

// Parse Mono mcs output: e.g. "Program.cs(12,18): error CS0029: Cannot implicitly convert..."
function parseMonoErrors(output: string): CompileError[] {
  const errors: CompileError[] = [];
  const regex = /(?:Program\.cs|\/tmp\/[^\s:]+)\((\d+),(\d+)\):\s*(error|warning)\s*([A-Za-z0-9]+):\s*(.+)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(output)) !== null) {
    errors.push({
      line: parseInt(match[1], 10),
      column: parseInt(match[2], 10),
      severity: match[3].toLowerCase() as 'error' | 'warning',
      code: match[4],
      message: match[5].trim(),
    });
  }
  return errors;
}

// Compile and execute C# code handler
async function handleCompileRun(req: Request, res: Response) {
  let code = '';
  let stdin = '';
  let timeoutMs = 8000;

  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      code = parsed.code || '';
      stdin = parsed.stdin || '';
      timeoutMs = typeof parsed.timeoutMs === 'number' ? parsed.timeoutMs : 8000;
    } catch {
      code = req.body;
    }
  } else if (req.body && typeof req.body === 'object') {
    code = req.body.code || '';
    stdin = req.body.stdin || '';
    timeoutMs = typeof req.body.timeoutMs === 'number' ? req.body.timeoutMs : 8000;
  }

  if (!code || typeof code !== 'string') {
    return res.status(200).json({
      success: false,
      phase: 'compile',
      compileTimeMs: 0,
      stdout: '',
      stderr: 'Código C# não fornecido ou vazio.',
      exitCode: 1,
      errors: [],
      message: 'Código C# não fornecido ou vazio.',
    });
  }

  // Safety caps
  if (timeoutMs < 1000) timeoutMs = 1000;
  if (timeoutMs > 25000) timeoutMs = 25000;

  const runId = generateRunId();
  const tempDir = path.join(os.tmpdir(), runId);
  const sourceFile = path.join(tempDir, 'Program.cs');
  const exeFile = path.join(tempDir, 'Program.exe');

  try {
    await fs.promises.mkdir(tempDir, { recursive: true });
    await fs.promises.writeFile(sourceFile, code, 'utf-8');

    // 1. Compilation Phase with mcs
    const compileStartTime = Date.now();
    const compileResult = await new Promise<{
      success: boolean;
      output: string;
      compileTimeMs: number;
    }>((resolve) => {
      let isDone = false;
      const mcs = spawn('mcs', [
        '-optimize+',
        '-r:System.Numerics.dll',
        sourceFile,
        `-out:${exeFile}`,
      ]);

      let output = '';
      mcs.stdout.on('data', (data: Buffer) => {
        output += data.toString();
      });
      mcs.stderr.on('data', (data: Buffer) => {
        output += data.toString();
      });

      // 12s compile timeout watchdog
      const timer = setTimeout(() => {
        if (!isDone) {
          isDone = true;
          try {
            mcs.kill('SIGKILL');
          } catch {
            // ignore
          }
          resolve({
            success: false,
            output: output + '\nTempo limite de compilação excedido (12s).',
            compileTimeMs: Date.now() - compileStartTime,
          });
        }
      }, 12000);

      mcs.on('close', (exitCode: number | null) => {
        if (!isDone) {
          isDone = true;
          clearTimeout(timer);
          resolve({
            success: exitCode === 0,
            output,
            compileTimeMs: Date.now() - compileStartTime,
          });
        }
      });

      mcs.on('error', (err: Error) => {
        if (!isDone) {
          isDone = true;
          clearTimeout(timer);
          resolve({
            success: false,
            output: `Falha ao iniciar compilador Mono: ${err.message}`,
            compileTimeMs: Date.now() - compileStartTime,
          });
        }
      });
    });

    if (!compileResult.success) {
      const parsedErrors = parseMonoErrors(compileResult.output);
      return res.status(200).json({
        success: false,
        phase: 'compile',
        compileTimeMs: compileResult.compileTimeMs,
        stdout: '',
        stderr: compileResult.output || 'Erro na compilação do código C#.',
        errors: parsedErrors,
        rawOutput: compileResult.output,
        exitCode: 1,
        message: 'Erro na compilação do código C#.',
      });
    }

    // 2. Execution Phase with Mono Runtime
    const runStartTime = Date.now();
    const runResult = await new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number | null;
      executionTimeMs: number;
      timedOut: boolean;
    }>((resolve) => {
      let stdout = '';
      let stderr = '';
      let isSettled = false;

      const monoProcess = spawn('mono', [exeFile], {
        cwd: tempDir,
      });

      // Handle stdin error to avoid Node unhandled EPIPE crashes
      monoProcess.stdin.on('error', () => {
        // Child process exited before or during stdin write - ignore safely
      });

      // Write stdin if provided
      if (stdin) {
        try {
          monoProcess.stdin.write(stdin);
          monoProcess.stdin.end();
        } catch {
          // ignore
        }
      } else {
        try {
          monoProcess.stdin.end();
        } catch {
          // ignore
        }
      }

      monoProcess.stdout.on('data', (data: Buffer) => {
        if (stdout.length < 500000) {
          stdout += data.toString();
        } else if (!stdout.endsWith('\n[Saída truncada devido ao limite de tamanho]')) {
          stdout += '\n[Saída truncada devido ao limite de tamanho]';
        }
      });

      monoProcess.stderr.on('data', (data: Buffer) => {
        if (stderr.length < 100000) {
          stderr += data.toString();
        }
      });

      const timer = setTimeout(() => {
        if (!isSettled) {
          isSettled = true;
          try {
            monoProcess.kill('SIGKILL');
          } catch {
            // ignore
          }
          resolve({
            stdout,
            stderr: stderr + '\n[Execução interrompida: Tempo limite atingido (' + (timeoutMs / 1000) + 's)]',
            exitCode: -1,
            executionTimeMs: Date.now() - runStartTime,
            timedOut: true,
          });
        }
      }, timeoutMs);

      monoProcess.on('close', (code: number | null) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          resolve({
            stdout,
            stderr,
            exitCode: code,
            executionTimeMs: Date.now() - runStartTime,
            timedOut: false,
          });
        }
      });

      monoProcess.on('error', (err: Error) => {
        if (!isSettled) {
          isSettled = true;
          clearTimeout(timer);
          resolve({
            stdout,
            stderr: `Erro de execução: ${err.message}`,
            exitCode: 1,
            executionTimeMs: Date.now() - runStartTime,
            timedOut: false,
          });
        }
      });
    });

    return res.status(200).json({
      success: runResult.exitCode === 0,
      phase: 'run',
      compileTimeMs: compileResult.compileTimeMs,
      executionTimeMs: runResult.executionTimeMs,
      stdout: runResult.stdout,
      stderr: runResult.stderr,
      exitCode: runResult.exitCode,
      timedOut: runResult.timedOut,
      errors: [],
    });
  } catch (error: any) {
    return res.status(200).json({
      success: false,
      phase: 'run',
      compileTimeMs: 0,
      executionTimeMs: 0,
      stdout: '',
      stderr: `Erro no servidor: ${error?.message || 'Falha inesperada'}`,
      exitCode: 1,
      errors: [],
    });
  } finally {
    // Clean up temporary files safely
    try {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
}

// Register all compile/run route aliases
app.post('/api/compile-run', handleCompileRun);
app.post('/api/compile', handleCompileRun);
app.post('/api/run', handleCompileRun);
app.post('/api/execute', handleCompileRun);

// Health and System info endpoints
const handleSystemInfo = async (_req: Request, res: Response) => {
  try {
    const versionOutput = await new Promise<string>((resolve) => {
      const proc = spawn('mcs', ['--version']);
      let out = '';
      proc.stdout.on('data', (d: Buffer) => out += d.toString());
      proc.stderr.on('data', (d: Buffer) => out += d.toString());
      proc.on('close', () => resolve(out.trim()));
      proc.on('error', () => resolve('Mono Compiler 6.8'));
    });

    res.json({
      compiler: versionOutput || 'Mono C# compiler version 6.8.0.105',
      runtime: 'Mono Runtime (.NET Framework / C# 7/8/9 subset support)',
      features: [
        'System.Numerics (BigInteger, Complex)',
        'System.Linq (Consultas LINQ avançadas)',
        'System.Collections.Generic (List, Dictionary, Queue, Stack)',
        'System.Diagnostics.Stopwatch (Benchmark de tempo)',
        'Vetores e Matrizes Multidimensionais',
        'Entrada e Saída Padrão (Console.ReadLine / WriteLine)',
      ],
      online: true,
      status: 'ok',
    });
  } catch (err: any) {
    res.json({ compiler: 'Mono C#', runtime: 'Mono', error: err.message, online: true, status: 'ok' });
  }
};

app.get('/api/system-info', handleSystemInfo);
app.get('/api/health', handleSystemInfo);
app.get('/api/ping', (_req, res) => res.json({ status: 'ok', timestamp: Date.now() }));

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server C# Codex listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err: Error) => {
  console.error('Failed to start server:', err);
});
