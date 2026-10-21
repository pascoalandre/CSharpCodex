import React, { useState } from 'react';
import {
  Maximize,
  Minimize,
  Save,
  Palette,
  Check,
  Moon,
  Sun,
  User as UserIcon,
} from 'lucide-react';
import { Project, ThemeMode, User } from '../types';
import { THEMES } from '../styles/themes';

interface AndroidHeaderProps {
  currentProject: Project;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  onSaveProject: () => void;
  isSaved: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  currentUser: User;
  onOpenUserModal: () => void;
  onOpenShortcutsModal: () => void;
}

export const AndroidHeader: React.FC<AndroidHeaderProps> = ({
  currentProject,
  theme,
  onThemeChange,
  onSaveProject,
  isSaved,
  isFullscreen,
  onToggleFullscreen,
  currentUser,
  onOpenUserModal,
}) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  return (
    <header
      className={`h-12 px-3 border-b flex items-center justify-between shrink-0 select-none ${
        isLight ? 'bg-white border-neutral-300' : `${styles.headerBg} ${styles.borderColor}`
      }`}
    >
      {/* Brand & Active File */}
      <div className="flex items-center gap-2 min-w-0">
        <img
          src="/src/assets/images/codex_app_icon_1792569766871.jpg"
          alt="C# Codex"
          className="w-7 h-7 rounded-lg object-cover shadow-sm"
        />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold text-xs tracking-tight font-['Plus_Jakarta_Sans'] truncate ${
                isLight ? 'text-black font-extrabold' : 'text-white'
              }`}
            >
              C# Codex
            </span>
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                isSaved ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
              }`}
              title={isSaved ? 'Salvo' : 'Modificado'}
            />
          </div>
          <p
            className={`text-[10px] font-mono truncate max-w-[120px] xs:max-w-[160px] ${
              isLight ? 'text-neutral-700 font-medium' : 'text-neutral-400'
            }`}
          >
            {currentProject.name}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1">
        {/* Save */}
        <button
          onClick={onSaveProject}
          title="Salvar Código"
          className={`p-2 rounded-xl border active:scale-95 transition-colors ${
            isLight
              ? 'border-neutral-300 text-black hover:bg-neutral-100'
              : `${styles.borderColor} text-neutral-300 hover:bg-white/10`
          }`}
        >
          <Save className="w-4 h-4" />
        </button>

        {/* Ecrã Inteiro (Fullscreen) */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Sair do Ecrã Inteiro' : 'Ecrã Inteiro'}
          className={`p-2 rounded-xl border active:scale-95 transition-colors ${
            isFullscreen
              ? 'text-purple-400 bg-purple-500/15 border-purple-500/40'
              : isLight
              ? 'border-neutral-300 text-black hover:bg-neutral-100'
              : `${styles.borderColor} text-neutral-300 hover:bg-white/10`
          }`}
        >
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>

        {/* Theme Picker */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            title="Alterar Tema"
            className={`p-2 rounded-xl border active:scale-95 transition-colors ${
              isLight
                ? 'border-neutral-300 text-black hover:bg-neutral-100'
                : `${styles.borderColor} text-neutral-300 hover:bg-white/10`
            }`}
          >
            <Palette className="w-4 h-4" />
          </button>

          {themeDropdownOpen && (
            <div
              className={`absolute right-0 mt-1 w-44 rounded-2xl shadow-2xl border py-1.5 z-50 ${
                isLight ? 'bg-white border-neutral-300 shadow-xl' : `${styles.cardBg} ${styles.borderColor}`
              }`}
              onMouseLeave={() => setThemeDropdownOpen(false)}
            >
              <div
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-neutral-500' : 'text-neutral-400'
                }`}
              >
                Tema do Editor
              </div>
              <button
                onClick={() => {
                  onThemeChange('vs-dark');
                  setThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${
                  theme === 'vs-dark'
                    ? 'text-blue-500 font-bold bg-blue-50/10'
                    : isLight
                    ? 'text-black hover:bg-neutral-100'
                    : 'text-neutral-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>VS Code Dark</span>
                </div>
                {theme === 'vs-dark' && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  onThemeChange('dracula');
                  setThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${
                  theme === 'dracula'
                    ? 'text-purple-400 font-bold bg-purple-50/10'
                    : isLight
                    ? 'text-black hover:bg-neutral-100'
                    : 'text-neutral-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#bd93f9]" />
                  <span>Drácula</span>
                </div>
                {theme === 'dracula' && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  onThemeChange('vs-light');
                  setThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left ${
                  theme === 'vs-light'
                    ? 'text-[#007acc] font-bold bg-blue-50'
                    : isLight
                    ? 'text-black hover:bg-neutral-100'
                    : 'text-neutral-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>VS Code Claro</span>
                </div>
                {theme === 'vs-light' && <Check className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <button
          onClick={onOpenUserModal}
          title={`Perfil: ${currentUser.displayName}`}
          className="p-1 rounded-full border border-neutral-400/40 active:scale-95"
        >
          <img
            src="/src/assets/images/avatar_engineer_user_1792569766320.jpg"
            alt={currentUser.displayName}
            className="w-7 h-7 rounded-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
