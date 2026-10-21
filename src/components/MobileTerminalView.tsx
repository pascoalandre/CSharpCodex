import React, { useState } from 'react';
import {
  Terminal as TerminalIcon,
  Trash2,
  Copy,
  Check,
  CornerDownLeft,
  Keyboard,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from 'lucide-react';
import { ExecutionResult, ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

interface MobileTerminalViewProps {
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  theme: ThemeMode;
  stdinValue: string;
  onClearOutput: () => void;
  onSendInput: (input: string) => void;
  onOpenInputModal: () => void;
  onSelectErrorLine: (line: number) => void;
  onBackToEditor?: () => void;
}

export const MobileTerminalView: React.FC<MobileTerminalViewProps> = ({
  executionResult,
  isRunning,
  theme,
  stdinValue,
  onClearOutput,
  onSendInput,
  onOpenInputModal,
  onSelectErrorLine,
  onBackToEditor,
}) => {
  const styles = THEMES[theme];
  const [quickInput, setQuickInput] = useState('');
  const [copied, setCopied] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    onSendInput(quickInput);
    setQuickInput('');
  };

  const handleCopy = async () => {
    if (!executionResult) return;
    const txt = (executionResult.stdout || '') + '\n' + (executionResult.stderr || '');
    try {
      await navigator.clipboard.writeText(txt.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const hasErrors = executionResult?.errors && executionResult.errors.length > 0;
  const isLight = styles.isLight;

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-[#0d0f12]">
      {/* Mobile Terminal Top Bar */}
      <div
        className={`h-11 px-3 border-b flex items-center justify-between text-xs select-none ${
          isLight ? 'bg-[#f4f4f5] border-neutral-300' : `${styles.headerBg} ${styles.borderColor}`
        }`}
      >
        <div className="flex items-center gap-2">
          {onBackToEditor && (
            <button
              type="button"
              onClick={onBackToEditor}
              title="Voltar ao Editor"
              className={`p-1 -ml-1 rounded-lg active:scale-95 transition-colors ${
                isLight ? 'text-black hover:bg-neutral-200' : 'text-neutral-300 hover:bg-white/10'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <TerminalIcon className="w-4 h-4 text-[#007acc]" />
          <span className={`font-bold ${isLight ? 'text-black' : 'text-neutral-100'}`}>
            Terminal & Saída
          </span>
          {executionResult && (
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                executionResult.success ? 'bg-emerald-950/80 text-emerald-400' : 'bg-red-950/80 text-red-400'
              }`}
            >
              Exit {executionResult.exitCode ?? 0}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenInputModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#007acc] text-white active:scale-95 shadow-sm"
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Entrada (STDIN)</span>
          </button>

          <button
            onClick={handleCopy}
            title="Copiar texto"
            className={`p-1.5 rounded-lg border active:scale-95 transition-colors ${
              isLight
                ? 'border-neutral-300 text-neutral-800 hover:bg-neutral-200'
                : 'border-neutral-700/60 text-neutral-400 hover:text-white'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onClearOutput}
            title="Limpar console"
            className={`p-1.5 rounded-lg border active:scale-95 transition-colors ${
              isLight
                ? 'border-neutral-300 text-neutral-800 hover:bg-neutral-200'
                : 'border-neutral-700/60 text-neutral-400 hover:text-white'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Content Stream: Text is PURE WHITE as explicitly requested */}
      <div className="flex-1 p-3.5 overflow-y-auto font-mono text-xs leading-relaxed select-text space-y-2 bg-[#0c0d10]">
        {isRunning ? (
          <div className="flex items-center gap-2.5 text-neutral-300 py-4">
            <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-sans text-white font-medium">Compilando e executando programa C#...</span>
          </div>
        ) : !executionResult ? (
          <div className="py-8 text-center font-sans">
            <TerminalIcon className="w-10 h-10 text-neutral-500 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold text-white">Terminal C# pronto</p>
            <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto">
              Toque no botão verde <strong className="text-emerald-400">Executar</strong> para rodar o código.
            </p>
          </div>
        ) : (
          <div>
            {/* Execution timing info */}
            <div className="pb-2 mb-2 border-b border-neutral-800 text-[11px] text-neutral-400 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {executionResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
                <span className="text-neutral-200 font-sans">
                  {executionResult.success ? 'Execução concluída com sucesso' : 'Falha na execução ou compilação'}
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                {executionResult.compileTimeMs !== undefined && (
                  <span className="text-neutral-300">Build: {executionResult.compileTimeMs}ms</span>
                )}
                {executionResult.executionTimeMs !== undefined && (
                  <span className="text-emerald-400 font-bold">Run: {executionResult.executionTimeMs}ms</span>
                )}
              </div>
            </div>

            {/* Standard Output - Crisp PURE WHITE text */}
            {executionResult.stdout && (
              <pre className="whitespace-pre-wrap text-white font-mono text-[13px] bg-[#14161b] p-3 rounded-xl border border-neutral-800 selection:bg-[#007acc] selection:text-white leading-relaxed">
                {executionResult.stdout}
              </pre>
            )}

            {/* Standard Error */}
            {executionResult.stderr && (
              <pre className="whitespace-pre-wrap text-red-300 font-mono text-[12px] bg-red-950/30 p-3 rounded-xl border border-red-900/40 mt-2">
                {executionResult.stderr}
              </pre>
            )}

            {/* Compile Errors with Clickable Navigation */}
            {hasErrors && (
              <div className="mt-3 space-y-1.5 font-sans">
                <div className="text-xs font-bold text-red-400">
                  Erros de Compilação C#:
                </div>
                {executionResult.errors!.map((err, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectErrorLine(err.line)}
                    className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start justify-between gap-2 cursor-pointer active:scale-98 transition-transform"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-300">
                        <span>Linha {err.line}, Coluna {err.column}</span>
                        <span className="px-1.5 py-0.2 rounded bg-red-900 text-[10px] text-white">
                          {err.code}
                        </span>
                      </div>
                      <p className="text-xs text-white mt-1">{err.message}</p>
                    </div>
                    <span className="text-[10px] text-neutral-300 whitespace-nowrap mt-1 underline">
                      Ver no editor &rarr;
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Mobile Input Bar at Bottom (NO placeholder text) */}
      <div
        className={`p-2 border-t select-none ${
          isLight ? 'bg-[#f4f4f5] border-neutral-300' : 'bg-[#121316] border-neutral-800'
        }`}
      >
        <form onSubmit={handleQuickSubmit} className="flex items-center gap-1.5">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            className={`flex-1 h-10 px-3 rounded-xl border text-xs font-mono outline-none ${
              isLight
                ? 'bg-white border-neutral-300 text-black focus:border-[#007acc]'
                : 'bg-black/60 border-neutral-700 text-white focus:border-[#007acc]'
            }`}
          />
          <button
            type="submit"
            disabled={!quickInput.trim()}
            className="h-10 px-4 rounded-xl bg-[#007acc] hover:bg-[#0062a3] disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow-sm"
          >
            <span>Enviar</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
