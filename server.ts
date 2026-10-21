import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import os from 'os';
import crypto from 'crypto';
import { spawn } from 'child_process';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

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

// Compile and execute C# code
app.post('/api/compile-run', async (req: Request, res: Response) => {
  const { code, stdin = '', timeoutMs = 8000 } = req.body;

  if (typeof code !== 'string') {
    return res.status(400).json({ error: 'Código C# não fornecido ou inválido.' });
  }

  const runId = generateRunId();
  const tempDir = path.join(os.tmpdir(), runId);
  const sourceFile = path.join(tempDir, 'Program.cs');
  const exeFile = path.join(tempDir, 'Program.exe');

  try {
    await fs.promises.mkdir(tempDir, { recursive: true });
    await fs.promises.writeFile(sourceFile, code, 'utf-8');

    // 1. Compilation Phase
    const compileStartTime = Date.now();
    const compileResult = await new Promise<{
      success: boolean;
      output: string;
      compileTimeMs: number;
    }>((resolve) => {
      // Compile with Mono mcs, linking System.Numerics for BigInteger/Complex
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

      mcs.on('close', (code: number | null) => {
        const compileTimeMs = Date.now() - compileStartTime;
        resolve({
          success: code === 0,
          output,
          compileTimeMs,
        });
      });

      mcs.on('error', (err: Error) => {
        resolve({
          success: false,
          output: `Falha ao invocar o compilador mcs: ${err.message}`,
          compileTimeMs: Date.now() - compileStartTime,
        });
      });
    });

    if (!compileResult.success) {
      const parsedErrors = parseMonoErrors(compileResult.output);
      return res.json({
        success: false,
        phase: 'compile',
        compileTimeMs: compileResult.compileTimeMs,
        errors: parsedErrors,
        rawOutput: compileResult.output,
        message: 'Erro na compilação do código C#.',
      });
    }

    // 2. Execution Phase
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

      // Handle stdin if provided
      if (stdin) {
        monoProcess.stdin.write(stdin);
        monoProcess.stdin.end();
      } else {
        monoProcess.stdin.end();
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
            // ignore kill error
          }
          resolve({
            stdout,
            stderr: stderr + '\n[Execução interrompida: Tempo limite atingido (Timeout de ' + (timeoutMs / 1000) + 's)]',
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

    return res.json({
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
    return res.status(500).json({
      success: false,
      error: `Erro interno no servidor: ${error.message}`,
    });
  } finally {
    // Clean up temporary files
    try {
      await fs.promises.rm(tempDir, { recursive: true, force: true });
    } catch {
      // ignore cleanup errors
    }
  }
});

// Check system info / compiler support
app.get('/api/system-info', async (_req: Request, res: Response) => {
  try {
    const versionOutput = await new Promise<string>((resolve) => {
      const proc = spawn('mcs', ['--version']);
      let out = '';
      proc.stdout.on('data', (d: Buffer) => out += d.toString());
      proc.stderr.on('data', (d: Buffer) => out += d.toString());
      proc.on('close', () => resolve(out.trim()));
      proc.on('error', () => resolve('Mono Compiler não detectado'));
    });

    res.json({
      compiler: versionOutput || 'Mono C# Compiler 6.8.0',
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
    });
  } catch (err: any) {
    res.json({ compiler: 'Mono C#', runtime: 'Mono', error: err.message, online: true });
  }
});

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
