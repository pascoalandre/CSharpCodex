import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose, theme }) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;

  if (!isOpen) return null;

  const SHORTCUTS = [
    { key: 'Ctrl + Enter', action: 'Compilar e Executar C#' },
    { key: 'Ctrl + S', action: 'Salvar Projeto Atual' },
    { key: 'F11', action: 'Ativar / Desativar Ecrã Inteiro' },
    { key: 'Esc', action: 'Sair do Modo Ecrã Inteiro' },
    { key: 'Shift + Alt + F', action: 'Formatar Documento C#' },
    { key: 'Ctrl + F', action: 'Localizar no Editor' },
    { key: 'Ctrl + H', action: 'Localizar e Substituir' },
    { key: 'Ctrl + /', action: 'Comentar / Descomentar Linha' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden flex flex-col ${styles.cardBg} ${styles.borderColor}`}
      >
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isLight ? 'bg-white border-neutral-300' : `${styles.headerBg} ${styles.borderColor}`
          }`}
        >
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-[#007acc]" />
            <h3 className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
              Atalhos de Teclado — C# Codex
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-full transition-colors ${
              isLight ? 'text-black hover:bg-neutral-100' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
          {SHORTCUTS.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between py-2 border-b text-xs ${
                isLight ? 'border-neutral-200' : 'border-neutral-800'
              }`}
            >
              <span className={`font-medium ${isLight ? 'text-black' : 'text-neutral-200'}`}>
                {s.action}
              </span>
              <kbd
                className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold ${
                  isLight
                    ? 'bg-neutral-100 border-neutral-300 text-black'
                    : 'bg-black/50 border-neutral-700 text-neutral-200'
                }`}
              >
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
