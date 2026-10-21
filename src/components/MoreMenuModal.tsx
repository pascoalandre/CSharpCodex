import React from 'react';
import {
  Terminal,
  Maximize2,
  Minimize2,
  Palette,
  Keyboard,
  User as UserIcon,
  BookOpen,
  Download,
  HelpCircle,
  X,
  Check,
  Code,
} from 'lucide-react';
import { ThemeMode, User } from '../types';
import { THEMES } from '../styles/themes';

interface MoreMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTerminal: () => void;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenInputModal: () => void;
  onOpenShortcuts: () => void;
  onOpenUserModal: () => void;
  onOpenDrawerTemplates: () => void;
  onExportAll: () => void;
  currentUser: User;
}

export const MoreMenuModal: React.FC<MoreMenuModalProps> = ({
  isOpen,
  onClose,
  onOpenTerminal,
  theme,
  onThemeChange,
  isFullscreen,
  onToggleFullscreen,
  onOpenInputModal,
  onOpenShortcuts,
  onOpenUserModal,
  onOpenDrawerTemplates,
  onExportAll,
  currentUser,
}) => {
  if (!isOpen) return null;

  const styles = THEMES[theme];
  const isLight = styles.isLight;

  const itemClass = isLight
    ? 'text-black hover:bg-neutral-100 active:bg-neutral-200'
    : 'text-neutral-200 hover:bg-white/10 active:bg-white/15';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Menu Sheet */}
      <div
        className={`relative w-full sm:max-w-sm rounded-t-2xl sm:rounded-2xl border shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-slideUp sm:animate-scaleIn ${
          isLight ? 'bg-white border-neutral-300' : 'bg-[#181a20] border-[#2d313d]'
        }`}
      >
        {/* Header */}
        <div
          className={`h-12 px-4 border-b flex items-center justify-between shrink-0 ${
            isLight ? 'bg-neutral-100 border-neutral-300' : 'bg-[#1e222b] border-[#2d313d]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`font-bold text-sm ${isLight ? 'text-black' : 'text-white'}`}>
              Opções do Editor
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1 rounded-lg ${
              isLight ? 'text-black hover:bg-neutral-200' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Body */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Open Terminal */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenTerminal();
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-colors ${itemClass}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#007acc]/15 text-[#007acc] flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold">Terminal & Saída C#</span>
                <span className={`text-[10px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Visualizar console e resultados
                </span>
              </div>
            </div>
          </button>

          {/* Fullscreen / Ecrã Inteiro */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onToggleFullscreen();
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-colors ${itemClass}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </div>
              <div>
                <span className="block font-bold">
                  {isFullscreen ? 'Sair do Ecrã Inteiro' : 'Ecrã Inteiro'}
                </span>
                <span className={`text-[10px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Maximizar espaço do editor
                </span>
              </div>
            </div>
            <span className={`text-[10px] font-mono ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
              F11
            </span>
          </button>

          {/* Program Input STDIN */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenInputModal();
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-colors ${itemClass}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold">Entrada de Dados (STDIN)</span>
                <span className={`text-[10px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Configurar texto para Console.ReadLine
                </span>
              </div>
            </div>
          </button>

          {/* C# Examples & Templates */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenDrawerTemplates();
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-colors ${itemClass}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold">Modelos e Exemplos C#</span>
                <span className={`text-[10px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Matrizes, Matemática, LINQ, Entrada
                </span>
              </div>
            </div>
          </button>

          {/* Theme Selector Section */}
          <div className="pt-2 pb-1 px-3">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-3.5 h-3.5 text-neutral-400" />
              <span className={`text-[10px] uppercase font-bold tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                Tema do Aplicativo
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'vs-dark', label: 'VS Code' },
                  { id: 'dracula', label: 'Drácula' },
                  { id: 'vs-light', label: 'Claro' },
                ] as const
              ).map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onThemeChange(t.id)}
                    className={`h-8 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'border-[#007acc] bg-[#007acc] text-white shadow-xs'
                        : isLight
                        ? 'border-neutral-300 bg-neutral-100 text-black hover:bg-neutral-200'
                        : 'border-[#323947] bg-[#21242d] text-neutral-300 hover:bg-[#282d38]'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* User Profile */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenUserModal();
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-colors ${itemClass}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold">Usuário ({currentUser.displayName})</span>
                <span className={`text-[10px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Trocar ou criar nova conta
                </span>
              </div>
            </div>
          </button>

          {/* Keyboard Shortcuts */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenShortcuts();
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-colors ${itemClass}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-neutral-500/15 text-neutral-400 flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold">Atalhos de Teclado</span>
                <span className={`text-[10px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Ctrl+Enter, Ctrl+S, F11
                </span>
              </div>
            </div>
          </button>

          {/* Backup Export */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onExportAll();
            }}
            className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between text-left text-xs font-semibold transition-colors ${itemClass}`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-400 flex items-center justify-center">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="block font-bold">Exportar Backup</span>
                <span className={`text-[10px] ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                  Download JSON de todos os projetos
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
