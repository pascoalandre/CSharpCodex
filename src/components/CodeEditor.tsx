import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import {
  Maximize,
  Minimize,
  Copy,
  Check,
  AlignLeft,
  FileCode,
  ClipboardPaste,
  CheckSquare,
  Undo2,
  Redo2,
  Trash2,
} from 'lucide-react';
import { CompileError, EditorSettings, ThemeMode } from '../types';
import { THEMES, DRACULA_MONACO_THEME } from '../styles/themes';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  theme: ThemeMode;
  settings: EditorSettings;
  errors: CompileError[];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  selectedErrorLine: number | null;
  searchTrigger?: number;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  theme,
  settings,
  errors,
  isFullscreen,
  onToggleFullscreen,
  selectedErrorLine,
  searchTrigger,
}) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    if (searchTrigger && searchTrigger > 0 && editorRef.current) {
      editorRef.current.trigger('acode-header', 'actions.find', null);
      editorRef.current.focus();
    }
  }, [searchTrigger]);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pasteModalText, setPasteModalText] = useState('');

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2000);
  };

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('dracula', DRACULA_MONACO_THEME);
    monaco.editor.setTheme(styles.monacoTheme);
  };

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(styles.monacoTheme);
    }
  }, [theme, styles.monacoTheme]);

  // Update error markers
  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const model = editorRef.current.getModel();
      if (!model) return;

      const markers = errors.map((err) => ({
        startLineNumber: err.line || 1,
        startColumn: err.column || 1,
        endLineNumber: err.line || 1,
        endColumn: (err.column || 1) + 15,
        message: `[${err.code}] ${err.message}`,
        severity:
          err.severity === 'error'
            ? monacoRef.current.MarkerSeverity.Error
            : monacoRef.current.MarkerSeverity.Warning,
      }));

      monacoRef.current.editor.setModelMarkers(model, 'csharp-compiler', markers);
    }
  }, [errors]);

  // Jump to error line
  useEffect(() => {
    if (selectedErrorLine && editorRef.current) {
      editorRef.current.revealLineInCenter(selectedErrorLine);
      editorRef.current.setPosition({ lineNumber: selectedErrorLine, column: 1 });
      editorRef.current.focus();
    }
  }, [selectedErrorLine]);

  // 1. SELECT ALL
  const handleSelectAll = () => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        editorRef.current.setSelection(model.getFullModelRange());
        editorRef.current.focus();
        triggerToast('Tudo selecionado');
      }
    }
  };

  // 2. COPY
  const handleCopy = async () => {
    if (!editorRef.current) return;
    const selection = editorRef.current.getSelection();
    const model = editorRef.current.getModel();
    let textToCopy = '';

    if (selection && !selection.isEmpty() && model) {
      textToCopy = model.getValueInRange(selection);
    } else {
      textToCopy = code;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      triggerToast('Copiado para a área de transferência');
    } catch {
      triggerToast('Erro ao copiar');
    }
  };

  // 3. PASTE
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        insertTextAtCursor(text);
        triggerToast('Colado com sucesso');
      } else {
        setShowPasteModal(true);
      }
    } catch {
      // If browser clipboard permissions restrict reading in iframe, show paste modal
      setShowPasteModal(true);
    }
  };

  const insertTextAtCursor = (textToInsert: string) => {
    if (!editorRef.current) {
      onChange(code + '\n' + textToInsert);
      return;
    }
    const selection = editorRef.current.getSelection();
    const op = {
      range: selection,
      text: textToInsert,
      forceMoveMarkers: true,
    };
    editorRef.current.executeEdits('clipboard-paste', [op]);
    editorRef.current.focus();
  };

  // 4. UNDO / REDO
  const handleUndo = () => {
    editorRef.current?.trigger('mobile-bar', 'undo', null);
  };

  const handleRedo = () => {
    editorRef.current?.trigger('mobile-bar', 'redo', null);
  };

  // 5. FORMAT
  const handleFormat = () => {
    editorRef.current?.getAction('editor.action.formatDocument')?.run();
    triggerToast('Código formatado');
  };

  return (
    <div className={`relative flex flex-col h-full w-full overflow-hidden ${styles.appBg}`}>
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-xl border border-neutral-700 pointer-events-none animate-fadeIn flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}



      {/* Mobile Clipboard & Selection Quick Action Ribbon */}
      <div
        className={`h-9 px-2 border-b flex items-center gap-1 overflow-x-auto no-scrollbar select-none shrink-0 ${
          isLight ? 'bg-white border-neutral-300' : 'bg-[#181a1f] border-neutral-800'
        }`}
      >
        {/* Selecionar Tudo */}
        <button
          type="button"
          onClick={handleSelectAll}
          className={`h-7 px-2 rounded-lg border text-xs font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all ${
            isLight
              ? 'bg-neutral-100 border-neutral-300 text-black hover:bg-neutral-200'
              : 'bg-white/5 border-neutral-700 text-neutral-200 hover:text-white'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5 text-[#007acc]" />
          <span>Sel. Tudo</span>
        </button>

        {/* Copiar */}
        <button
          type="button"
          onClick={handleCopy}
          className={`h-7 px-2 rounded-lg border text-xs font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all ${
            isLight
              ? 'bg-neutral-100 border-neutral-300 text-black hover:bg-neutral-200'
              : 'bg-white/5 border-neutral-700 text-neutral-200 hover:text-white'
          }`}
        >
          <Copy className="w-3.5 h-3.5 text-[#007acc]" />
          <span>Copiar</span>
        </button>

        {/* Colar */}
        <button
          type="button"
          onClick={handlePaste}
          className={`h-7 px-2.5 rounded-lg border text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-all ${
            isLight
              ? 'bg-emerald-50 border-emerald-400 text-emerald-800 hover:bg-emerald-100'
              : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-900/50'
          }`}
        >
          <ClipboardPaste className="w-3.5 h-3.5" />
          <span>Colar</span>
        </button>

        {/* Desfazer */}
        <button
          type="button"
          onClick={handleUndo}
          title="Desfazer"
          className={`h-7 px-2 rounded-lg border text-xs font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all ${
            isLight
              ? 'bg-neutral-100 border-neutral-300 text-black hover:bg-neutral-200'
              : 'bg-white/5 border-neutral-700 text-neutral-200 hover:text-white'
          }`}
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Desfazer</span>
        </button>

        {/* Refazer */}
        <button
          type="button"
          onClick={handleRedo}
          title="Refazer"
          className={`h-7 px-2 rounded-lg border text-xs font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all ${
            isLight
              ? 'bg-neutral-100 border-neutral-300 text-black hover:bg-neutral-200'
              : 'bg-white/5 border-neutral-700 text-neutral-200 hover:text-white'
          }`}
        >
          <Redo2 className="w-3.5 h-3.5" />
          <span>Refazer</span>
        </button>

        {/* Formatar */}
        <button
          type="button"
          onClick={handleFormat}
          title="Formatar Código"
          className={`h-7 px-2 rounded-lg border text-xs font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all ${
            isLight
              ? 'bg-neutral-100 border-neutral-300 text-black hover:bg-neutral-200'
              : 'bg-white/5 border-neutral-700 text-neutral-200 hover:text-white'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5 text-purple-400" />
          <span>Formatar</span>
        </button>
      </div>

      {/* Monaco Editor Container - Ponta a ponta total */}
      <div className="flex-1 w-full h-full min-h-0 relative">
        <Editor
          height="100%"
          width="100%"
          language="csharp"
          theme={styles.monacoTheme}
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorMount}
          options={{
            fontSize: settings.fontSize || 13,
            tabSize: settings.tabSize || 4,
            wordWrap: 'on',
            minimap: { enabled: false }, // Visualizador da página no lado direito removido
            lineNumbers: 'on',
            lineNumbersMinChars: 2, // Números de linhas colados no canto esquerdo
            glyphMargin: false, // Sem espaço reservado para glyphs
            lineDecorationsWidth: 0, // Sem recuo de decorações
            folding: false, // Sem margem de dobra afastando o código
            overviewRulerLanes: 0, // Sem régua de visualização do lado direito
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              verticalScrollbarSize: 4,
              horizontalScrollbarSize: 4,
              useShadows: false,
            },
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, monospace",
            fontLigatures: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            bracketPairColorization: { enabled: true },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            formatOnPaste: true,
            formatOnType: true,
            padding: { top: 2, bottom: 2 },
            renderLineHighlight: 'line',
          }}
        />
      </div>

      {/* Manual Paste Modal if Clipboard API permission is restricted */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div
            className={`w-full max-w-sm rounded-2xl shadow-2xl border p-4 flex flex-col gap-3 ${styles.cardBg} ${styles.borderColor}`}
          >
            <h3 className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
              Colar Código no Editor
            </h3>
            <p className={`text-xs ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
              Cole o texto abaixo para inserir na posição do cursor:
            </p>
            <textarea
              value={pasteModalText}
              onChange={(e) => setPasteModalText(e.target.value)}
              rows={4}
              autoFocus
              className={`w-full p-2.5 border rounded-xl font-mono text-xs outline-none ${
                isLight ? 'bg-white border-neutral-300 text-black' : 'bg-black/60 border-neutral-700 text-white'
              }`}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasteModal(false);
                  setPasteModalText('');
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-400"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pasteModalText) {
                    insertTextAtCursor(pasteModalText);
                    triggerToast('Texto inserido');
                  }
                  setShowPasteModal(false);
                  setPasteModalText('');
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-[#007acc] text-white"
              >
                Inserir Código
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
