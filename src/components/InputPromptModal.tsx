import React, { useState, useEffect } from 'react';
import { Play, X, Keyboard } from 'lucide-react';
import { ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

interface InputPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: string) => void;
  initialValue: string;
  theme: ThemeMode;
}

export const InputPromptModal: React.FC<InputPromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValue,
  theme,
}) => {
  const styles = THEMES[theme];
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(inputValue);
  };

  const isLight = styles.isLight;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs select-none animate-fadeIn">
      <div
        className={`w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] ${styles.cardBg} ${styles.borderColor}`}
      >
        {/* Android Sheet Drag Handle */}
        <div className="w-12 h-1.5 bg-neutral-500/40 rounded-full mx-auto mt-2.5 mb-1 sm:hidden" />

        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${styles.headerBg} ${styles.borderColor}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#007acc]/20 text-[#007acc] flex items-center justify-center">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-bold font-['Plus_Jakarta_Sans'] ${isLight ? 'text-black' : 'text-white'}`}>
                Entrada de Dados (Console.ReadLine)
              </h3>
              <p className={`text-[11px] ${styles.textMuted}`}>
                Digite os dados para o programa
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-neutral-500/10 transition-colors ${isLight ? 'text-black' : 'text-neutral-400 hover:text-white'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Clean and Direct (No suggestions, no warning banners, no placeholder) */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`text-xs font-semibold ${isLight ? 'text-neutral-900 font-bold' : 'text-neutral-200'}`}>
                Entrada:
              </label>
              <span className={`text-[11px] font-mono ${styles.textMuted}`}>
                {inputValue.split('\n').filter(Boolean).length} linha(s)
              </span>
            </div>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              rows={5}
              autoFocus
              className={`w-full p-3 border rounded-xl font-mono text-xs outline-none resize-none transition-colors ${
                isLight
                  ? 'bg-white border-neutral-300 text-black focus:border-[#007acc]'
                  : 'bg-black/60 border-neutral-700 text-white focus:border-emerald-500'
              }`}
            />
          </div>

          {/* Footer Actions */}
          <div className={`flex items-center gap-2 pt-2 border-t ${styles.borderColor} mt-1`}>
            <button
              type="button"
              onClick={() => onSubmit('')}
              className={`flex-1 py-3 px-3 rounded-xl text-xs font-semibold border transition-colors ${
                isLight
                  ? 'border-neutral-300 text-neutral-800 hover:bg-neutral-100'
                  : 'border-neutral-700 text-neutral-300 hover:bg-white/5'
              }`}
            >
              Executar Vazio
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Executar com Entrada</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
