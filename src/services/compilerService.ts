import { ExecutionResult } from '../types';

export class CompilerService {
  /**
   * Compiles and executes C# code via the backend Mono compiler service.
   * Includes automatic fallback endpoints, retry logic for transient network glitches,
   * and safe error decoding.
   */
  static async compileAndRun(
    code: string,
    stdin: string = '',
    timeoutMs: number = 8000
  ): Promise<ExecutionResult> {
    const endpoints = ['/api/compile-run', '/api/compile', '/api/run'];
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < 2; attempt++) {
      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeoutMs + 4000);

          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify({
              code,
              stdin,
              timeoutMs,
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          let data: any = null;
          try {
            data = await response.json();
          } catch {
            const rawText = await response.text().catch(() => '');
            if (rawText) {
              data = { stderr: rawText };
            }
          }

          if (data && typeof data === 'object') {
            return {
              success: Boolean(data.success),
              phase: data.phase || (data.success ? 'run' : 'compile'),
              compileTimeMs: data.compileTimeMs,
              executionTimeMs: data.executionTimeMs,
              stdout: data.stdout ?? '',
              stderr: data.stderr ?? (data.error || data.message || ''),
              exitCode: typeof data.exitCode === 'number' ? data.exitCode : (data.success ? 0 : 1),
              timedOut: Boolean(data.timedOut),
              errors: Array.isArray(data.errors) ? data.errors : [],
              message: data.message,
            };
          }

          if (!response.ok) {
            throw new Error(`Servidor retornou status HTTP ${response.status} (${response.statusText})`);
          }
        } catch (err: any) {
          lastError = err;
          // If aborted due to timeout
          if (err.name === 'AbortError') {
            return {
              success: false,
              phase: 'run',
              stdout: '',
              stderr: `[Tempo Limite] A execução excedeu o tempo máximo permitido (${timeoutMs / 1000}s).`,
              exitCode: -1,
              timedOut: true,
            };
          }
          // Continue to next endpoint or attempt
        }
      }

      // Small pause before retry
      if (attempt === 0) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    // If server is totally unreachable (e.g. offline dev server), provide clean diagnostic
    return {
      success: false,
      phase: 'run',
      stdout: '',
      stderr: `Falha na comunicação com o servidor de compilação: ${lastError?.message || 'Conexão recusada'}\n\nO servidor Mono está reiniciando ou indisponível temporariamente. Tente executar novamente.`,
      exitCode: 1,
      errors: [],
    };
  }

  /**
   * Healthcheck to verify Mono compiler readiness
   */
  static async checkHealth(): Promise<{ online: boolean; compiler?: string }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        return { online: true, compiler: data.compiler };
      }
    } catch {
      // ignore
    }
    return { online: false };
  }
}
