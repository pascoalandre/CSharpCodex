import React from 'react';
import {
  Play,
  Maximize,
  Minimize,
  Download,
  Share2,
  Save,
  Moon,
  Sun,
  Palette,
  Check,
  User as UserIcon,
  HelpCircle,
  FolderOpen
} from 'lucide-react';
import { Project, ThemeMode, User } from '../types';
import { THEMES } from '../styles/themes';

interface HeaderProps {
  currentProject: Project;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  isRunning: boolean;
  onRunCode: () => void;
  onSaveProject: () => void;
  isSaved: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onExportCode: () => void;
  currentUser: User;
  onOpenUserModal: () => void;
  onOpenShortcutsModal: () => void;
  onProjectNameChange: (newName: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentProject,
  theme,
  onThemeChange,
  isRunning,
  onRunCode,
  onSaveProject,
  isSaved,
  isFullscreen,
  onToggleFullscreen,
  onExportCode,
  currentUser,
  onOpenUserModal,
  onOpenShortcutsModal,
  onProjectNameChange,
}) => {
  const styles = THEMES[theme];
  const [isEditingName, setIsEditingName] = React.useState(false);
  const [nameValue, setNameValue] = React.useState(currentProject.name);
  const [themeDropdownOpen, setThemeDropdownOpen] = React.useState(false);

  React.useEffect(() => {
    setNameValue(currentProject.name);
  }, [currentProject.name]);

  const handleNameBlur = () => {
    setIsEditingName(false);
    if (nameValue.trim() && nameValue !== currentProject.name) {
      onProjectNameChange(nameValue.trim());
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameBlur();
    } else if (e.key === 'Escape') {
      setNameValue(currentProject.name);
      setIsEditingName(false);
    }
  };

  return (
    <header
      className={`h-12 border-b flex items-center justify-between px-3 shrink-0 select-none ${styles.headerBg} ${styles.borderColor}`}
    >
      {/* Zone 1: Brand title & Active Project Breadcrumb */}
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-2 shrink-0">
          <img
            src="/src/assets/images/codex_app_icon_1792569766871.jpg"
            alt="C# Codex"
            className="w-6 h-6 rounded object-cover shadow-sm"
          />
          <span className="font-semibold text-sm tracking-tight whitespace-nowrap text-white font-['Plus_Jakarta_Sans']">
            C# Codex
          </span>
        </div>

        <span className="text-neutral-500 text-xs hidden sm:inline" aria-hidden="true">/</span>

        {/* Project Name & Edit */}
        <div className="flex items-center gap-1.5 min-w-0">
          <FolderOpen className="w-3.5 h-3.5 text-neutral-400 shrink-0 hidden sm:inline" />
          {isEditingName ? (
            <input
              type="text"
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleNameBlur}
              onKeyDown={handleNameKeyDown}
              autoFocus
              className={`text-xs px-1.5 py-0.5 rounded border border-[#007acc] outline-none font-mono ${styles.inputBg} ${styles.textPrimary}`}
            />
          ) : (
            <button
              onClick={() => !currentProject.readOnly && setIsEditingName(true)}
              title={currentProject.readOnly ? 'Modelo somente leitura (salve uma cópia para editar)' : 'Clique para renomear'}
              className={`text-xs font-mono font-medium truncate hover:underline text-left max-w-[180px] md:max-w-[260px] ${styles.textPrimary}`}
            >
              {currentProject.name}
            </button>
          )}

          {/* Saved Status Indicator */}
          <span
            className={`text-[10px] px-1.5 py-0.2 rounded font-sans tracking-wide shrink-0 ${
              isSaved
                ? 'text-neutral-400 bg-neutral-800/40'
                : 'text-amber-400 bg-amber-950/40'
            }`}
            title={isSaved ? 'Alterações salvas' : 'Modificado (Ctrl+S para salvar)'}
          >
            {isSaved ? 'Salvo' : 'Não salvo •'}
          </span>
        </div>
      </div>

      {/* Zone 2: Primary Actions (Run, Save, Fullscreen, Theme) */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Run Button */}
        <button
          onClick={onRunCode}
          disabled={isRunning}
          title="Compilar e Executar C# (Ctrl + Enter)"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold text-white transition-all shadow-sm ${
            isRunning
              ? 'bg-emerald-700/70 cursor-wait'
              : 'bg-emerald-600 hover:bg-emerald-500 active:scale-95'
          }`}
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-pulse' : ''}`} />
          <span className="whitespace-nowrap font-['Plus_Jakarta_Sans']">
            {isRunning ? 'Compilando...' : 'Executar'}
          </span>
          <kbd className="hidden lg:inline text-[9px] px-1 py-0.2 bg-emerald-800/80 rounded opacity-80 text-emerald-100 font-mono">
            Ctrl+↵
          </kbd>
        </button>

        {/* Save Button */}
        <button
          onClick={onSaveProject}
          title="Salvar Projeto (Ctrl + S)"
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded text-xs transition-colors border ${styles.borderColor} hover:bg-white/5 ${styles.textPrimary}`}
        >
          <Save className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline text-xs">Salvar</span>
        </button>

        {/* Fullscreen Toggle ("Ecrã Inteiro") */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? 'Sair do Ecrã Inteiro (Esc)' : 'Ecrã Inteiro (F11)'}
          className={`flex items-center gap-1 px-2 py-1.5 rounded text-xs transition-colors border ${styles.borderColor} hover:bg-white/5 ${styles.textPrimary}`}
        >
          {isFullscreen ? (
            <Minimize className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <Maximize className="w-3.5 h-3.5 text-neutral-400" />
          )}
          <span className="hidden md:inline text-xs">
            {isFullscreen ? 'Sair do Ecrã' : 'Ecrã Inteiro'}
          </span>
        </button>

        {/* Theme Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
            title="Alterar Tema do Editor"
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded text-xs border ${styles.borderColor} hover:bg-white/5 transition-colors ${styles.textPrimary}`}
          >
            <Palette className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden lg:inline text-xs capitalize">{THEMES[theme].name}</span>
          </button>

          {themeDropdownOpen && (
            <div
              className={`absolute right-0 mt-1 w-44 rounded-md shadow-xl border py-1 z-50 ${styles.cardBg} ${styles.borderColor}`}
              onMouseLeave={() => setThemeDropdownOpen(false)}
            >
              <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Tema do Editor
              </div>
              <button
                onClick={() => {
                  onThemeChange('vs-dark');
                  setThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-white/10 ${
                  theme === 'vs-dark' ? 'text-blue-400 font-medium' : styles.textPrimary
                }`}
              >
                <div className="flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>VS Code Escuro</span>
                </div>
                {theme === 'vs-dark' && <Check className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => {
                  onThemeChange('dracula');
                  setThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-white/10 ${
                  theme === 'dracula' ? 'text-purple-400 font-medium' : styles.textPrimary
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
                className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-white/10 ${
                  theme === 'vs-light' ? 'text-amber-500 font-medium' : styles.textPrimary
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

        {/* Export / Download */}
        <button
          onClick={onExportCode}
          title="Baixar Arquivo C# (.cs)"
          className={`p-1.5 rounded border ${styles.borderColor} hover:bg-white/5 text-neutral-400 hover:text-white transition-colors`}
        >
          <Download className="w-3.5 h-3.5" />
        </button>

        {/* Shortcuts Help */}
        <button
          onClick={onOpenShortcutsModal}
          title="Atalhos de Teclado"
          className={`p-1.5 rounded border ${styles.borderColor} hover:bg-white/5 text-neutral-400 hover:text-white transition-colors hidden sm:inline-flex`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
        </button>

        {/* Zone 3: User Avatar & Profile Button */}
        <button
          onClick={onOpenUserModal}
          title={`Usuário: ${currentUser.displayName} (${currentUser.username})`}
          className={`flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full border ${styles.borderColor} hover:border-[#007acc] transition-colors`}
        >
          <img
            src="/src/assets/images/avatar_engineer_user_1792569766320.jpg"
            alt={currentUser.displayName}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="text-[11px] font-medium hidden md:inline truncate max-w-[90px]">
            {currentUser.displayName.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
};
