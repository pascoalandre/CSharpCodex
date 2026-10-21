import React, { useState } from 'react';
import {
  Terminal as TerminalIcon,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Copy,
  Trash2,
  CornerDownLeft,
  Keyboard,
  Check,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
} from 'lucide-react';
import { ExecutionResult, CompileError, ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

interface OutputPanelProps {
  executionResult: ExecutionResult | null;
  isRunning: boolean;
  theme: ThemeMode;
  stdinValue: string;
  onStdinChange: (val: string) => void;
  onSendInteractiveInput: (inputLine: string) => void;
  onClearOutput: () => void;
  onErrorClick: (line: number, col: number) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLoadPresetStdin: (preset: string) => void;
  exampleStdinDefault?: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  executionResult,
  isRunning,
  theme,
  stdinValue,
  onStdinChange,
  onSendInteractiveInput,
  onClearOutput,
  onErrorClick,
  isCollapsed,
  onToggleCollapse,
  onLoadPresetStdin,
  exampleStdinDefault,
}) => {
  const styles = THEMES[theme];
  const [activeTab, setActiveTab] = useState<'terminal' | 'stdin' | 'errors'>('terminal');
  const [interactiveInput, setInteractiveInput] = useState('');
  const [copied, setCopied] = useState(false);

  // If new errors occur, switch automatically to errors tab
  React.useEffect(() => {
    if (executionResult && !executionResult.success && executionResult.errors && executionResult.errors.length > 0) {
      setActiveTab('errors');
    } else if (executionResult && executionResult.success) {
      setActiveTab('terminal');
    }
  }, [executionResult]);

  const handleInteractiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interactiveInput) return;
    onSendInteractiveInput(interactiveInput);
    setInteractiveInput('');
  };

  const handleCopyOutput = async () => {
    if (!executionResult) return;
    const text = (executionResult.stdout || '') + '\n' + (executionResult.stderr || '');
    try {
      await navigator.clipboard.writeText(text.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const errorCount = executionResult?.errors?.length || 0;

  return (
    <div
      className={`flex flex-col border-t shrink-0 select-none transition-all ${
        isCollapsed ? 'h-9' : 'h-64 md:h-72 lg:h-80'
      } ${styles.terminalBg} ${styles.borderColor}`}
    >
      {/* Tab Navigation Header */}
      <div
        className={`h-9 px-3 border-b flex items-center justify-between text-xs ${styles.headerBg} ${styles.borderColor}`}
      >
        <div className="flex items-center gap-1">
          {/* Terminal Tab */}
          <button
            onClick={() => {
              setActiveTab('terminal');
              if (isCollapsed) onToggleCollapse();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
              activeTab === 'terminal' && !isCollapsed
                ? `${styles.tabActiveBg} text-white border-b-2 border-[#007acc]`
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>Terminal / Saída</span>
          </button>

          {/* Stdin Tab */}
          <button
            onClick={() => {
              setActiveTab('stdin');
              if (isCollapsed) onToggleCollapse();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t transition-colors relative ${
              activeTab === 'stdin' && !isCollapsed
                ? `${styles.tabActiveBg} text-white border-b-2 border-[#007acc]`
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Entrada (STDIN)</span>
            {stdinValue.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>

          {/* Errors Tab */}
          <button
            onClick={() => {
              setActiveTab('errors');
              if (isCollapsed) onToggleCollapse();
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
              activeTab === 'errors' && !isCollapsed
                ? `${styles.tabActiveBg} text-white border-b-2 border-[#007acc]`
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <AlertCircle className={`w-3.5 h-3.5 ${errorCount > 0 ? 'text-red-400' : ''}`} />
            <span>Problemas</span>
            {errorCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-600 text-white">
                {errorCount}
              </span>
            )}
          </button>
        </div>

        {/* Right side metrics & collapse */}
        <div className="flex items-center gap-3 text-[11px] text-neutral-400">
          {/* Execution Stats */}
          {executionResult && !isCollapsed && (
            <div className="hidden sm:flex items-center gap-3 font-mono text-[11px]">
              {executionResult.compileTimeMs !== undefined && (
                <span className="text-neutral-400" title="Tempo gasto compilando com Mono">
                  Compilação: <strong className="text-neutral-300">{executionResult.compileTimeMs}ms</strong>
                </span>
              )}
              {executionResult.executionTimeMs !== undefined && (
                <span className="text-neutral-400 flex items-center gap-1" title="Tempo de execução do processo C#">
                  <Clock className="w-3 h-3 text-neutral-500" />
                  Execução: <strong className="text-emerald-400">{executionResult.executionTimeMs}ms</strong>
                </span>
              )}
              {executionResult.exitCode !== undefined && (
                <span className="flex items-center gap-1">
                  {executionResult.success ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-red-400" />
                  )}
                  Código: <strong className={executionResult.success ? 'text-emerald-400' : 'text-red-400'}>{executionResult.exitCode}</strong>
                </span>
              )}
            </div>
          )}

          {/* Copy output */}
          <button
            onClick={handleCopyOutput}
            title="Copiar saída do terminal"
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Clear */}
          <button
            onClick={onClearOutput}
            title="Limpar terminal"
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Collapse/Expand Toggle */}
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? 'Expandir painel' : 'Recolher painel'}
            className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Panel Body (when not collapsed) */}
      {!isCollapsed && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* TAB 1: TERMINAL */}
          {activeTab === 'terminal' && (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs leading-relaxed select-text bg-black/40">
                {isRunning ? (
                  <div className="flex items-center gap-2 text-neutral-400 py-2">
                    <div className="w-3 h-3 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                    <span>Compilando código com Mono C# e executando programa...</span>
                  </div>
                ) : !executionResult ? (
                  <div className="text-neutral-500 py-2">
                    <p className="font-semibold text-neutral-400">Terminal C# Codex pronto.</p>
                    <p className="mt-1">Pressione <kbd className="px-1.5 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Executar</kbd> ou o atalho <kbd className="px-1.5 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">Ctrl + Enter</kbd> para compilar e rodar seu programa C#.</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {/* Stdout */}
                    {executionResult.stdout && (
                      <pre className="whitespace-pre-wrap text-emerald-300 font-mono">
                        {executionResult.stdout}
                      </pre>
                    )}

                    {/* Stderr */}
                    {executionResult.stderr && (
                      <pre className="whitespace-pre-wrap text-red-400 font-mono">
                        {executionResult.stderr}
                      </pre>
                    )}

                    {/* Compilation Errors Raw (if not caught) */}
                    {executionResult.phase === 'compile' && !executionResult.success && (
                      <div className="p-2 rounded bg-red-950/40 border border-red-800/40 text-red-300 font-mono text-xs">
                        <p className="font-bold mb-1">Falha de Compilação no C#:</p>
                        <pre className="whitespace-pre-wrap opacity-90">{executionResult.message || 'Verifique a aba Problemas para ver a linha exata dos erros.'}</pre>
                      </div>
                    )}

                    {/* Exit summary line */}
                    <div className="pt-2 text-[11px] text-neutral-500 border-t border-neutral-800/60 flex items-center justify-between">
                      <span>
                        [Processo finalizado com código {executionResult.exitCode ?? 0} em {executionResult.executionTimeMs ?? 0}ms]
                      </span>
                      {executionResult.timedOut && (
                        <span className="text-amber-400 font-bold">
                          Aviso: Processo interrompido por tempo limite.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Interactive Stdin Bar at bottom of Terminal */}
              <form
                onSubmit={handleInteractiveSubmit}
                className="h-9 px-3 border-t border-neutral-800 flex items-center gap-2 bg-neutral-900/80"
              >
                <CornerDownLeft className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Digitar entrada interativa para Console.ReadLine() e pressionar Enter..."
                  value={interactiveInput}
                  onChange={(e) => setInteractiveInput(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-neutral-200 outline-none font-mono placeholder:text-neutral-600"
                />
                <button
                  type="submit"
                  disabled={!interactiveInput}
                  className="px-2.5 py-1 text-[11px] font-medium bg-[#007acc] text-white rounded hover:bg-[#0062a3] disabled:opacity-40 disabled:hover:bg-[#007acc]"
                >
                  Enviar
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: STDIN BUFFER */}
          {activeTab === 'stdin' && (
            <div className="flex-1 flex flex-col p-3 bg-black/40 overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-800 text-xs">
                <div>
                  <span className="font-medium text-neutral-300">Entrada Padrão Pré-carregada (STDIN)</span>
                  <p className="text-[11px] text-neutral-500">
                    Insira cada dado que o programa solicitará via <code>Console.ReadLine()</code> linha por linha.
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  {exampleStdinDefault && (
                    <button
                      onClick={() => onLoadPresetStdin(exampleStdinDefault)}
                      className="px-2 py-1 text-[11px] rounded bg-purple-900/40 text-purple-300 border border-purple-700/50 hover:bg-purple-800/50"
                    >
                      Carregar Dados do Exemplo
                    </button>
                  )}
                  <button
                    onClick={() => onLoadPresetStdin('10\n20\n30\n40\n50')}
                    className="px-2 py-1 text-[11px] rounded bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                  >
                    Vetor (5 números)
                  </button>
                  <button
                    onClick={() => onStdinChange('')}
                    className="px-2 py-1 text-[11px] rounded bg-neutral-800 text-neutral-400 hover:text-white"
                  >
                    Limpar
                  </button>
                </div>
              </div>

              <textarea
                value={stdinValue}
                onChange={(e) => onStdinChange(e.target.value)}
                placeholder="Exemplo de entrada:&#10;Maria Silva&#10;30&#10;1.72&#10;68.0&#10;4"
                className="flex-1 w-full mt-2 p-2.5 bg-black/50 border border-neutral-800 rounded font-mono text-xs text-neutral-200 outline-none resize-none placeholder:text-neutral-600 focus:border-[#007acc]"
              />
            </div>
          )}

          {/* TAB 3: DIAGNOSTICS & ERRORS */}
          {activeTab === 'errors' && (
            <div className="flex-1 p-3 bg-black/40 overflow-y-auto">
              {!executionResult || !executionResult.errors || executionResult.errors.length === 0 ? (
                <div className="text-center py-6 text-neutral-500 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
                  <p className="font-semibold text-neutral-300">Nenhum problema encontrado no código.</p>
                  <p className="text-[11px] mt-0.5">Sua sintaxe C# está em conformidade com as regras do compilador.</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-xs font-semibold text-red-400 mb-2">
                    {executionResult.errors.length} erro(s) de compilação detectados:
                  </div>
                  {executionResult.errors.map((err, index) => (
                    <div
                      key={index}
                      onClick={() => onErrorClick(err.line, err.column)}
                      className="p-2 rounded bg-red-950/20 border border-red-800/40 hover:bg-red-950/40 cursor-pointer transition-colors flex items-start gap-2.5 group"
                    >
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs font-mono">
                          <span className="font-bold text-red-300">
                            Linha {err.line}, Coluna {err.column}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-red-900/60 text-red-200">
                            {err.code}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300 mt-0.5 font-sans">
                          {err.message}
                        </p>
                      </div>
                      <span className="text-[11px] text-neutral-500 group-hover:text-neutral-300 font-mono">
                        Ir para linha &rarr;
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
