import React, { useRef, useEffect, useState } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Check } from 'lucide-react';
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
  selectedErrorLine,
  searchTrigger,
}) => {
  const styles = THEMES[theme];
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  useEffect(() => {
    if (searchTrigger && searchTrigger > 0 && editorRef.current) {
      editorRef.current.trigger('acode-header', 'actions.find', null);
      editorRef.current.focus();
    }
  }, [searchTrigger]);

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

  // Update error markers in Monaco editor
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

  // Jump to error line if requested
  useEffect(() => {
    if (selectedErrorLine && editorRef.current) {
      editorRef.current.revealLineInCenter(selectedErrorLine);
      editorRef.current.setPosition({ lineNumber: selectedErrorLine, column: 1 });
      editorRef.current.focus();
    }
  }, [selectedErrorLine]);

  return (
    <div className={`relative flex flex-col h-full w-full overflow-hidden ${styles.appBg}`}>
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-xl border border-neutral-700 pointer-events-none animate-fadeIn flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Monaco Editor Container - Ponta a ponta total, sem barra intermediária */}
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
            minimap: { enabled: false }, // Visualizador direito removido
            lineNumbers: 'on',
            lineNumbersMinChars: 2, // Números de linhas colados no canto
            glyphMargin: false, // Sem espaço de glyphs
            lineDecorationsWidth: 0, // Sem recuo extra
            folding: false, // Sem margem de dobra
            overviewRulerLanes: 0, // Sem barra de visão geral na direita
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
    </div>
  );
};
