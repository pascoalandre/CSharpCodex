import React from 'react';
import {
  Code2,
  Terminal,
  Layers,
  FolderCode,
  Play,
  RotateCw,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

export type MobileTab = 'editor' | 'terminal' | 'templates' | 'projects';

interface AndroidBottomNavProps {
  activeTab: MobileTab;
  onTabChange: (tab: MobileTab) => void;
  onRunCode: () => void;
  isRunning: boolean;
  theme: ThemeMode;
  errorCount: number;
}

export const AndroidBottomNav: React.FC<AndroidBottomNavProps> = ({
  activeTab,
  onTabChange,
  onRunCode,
  isRunning,
  theme,
  errorCount,
}) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;

  return (
    <nav
      className={`h-16 border-t px-2 flex items-center justify-around select-none shrink-0 relative z-30 ${
        isLight ? 'bg-white border-neutral-300' : `${styles.headerBg} ${styles.borderColor}`
      }`}
      aria-label="Navegação Principal do App Mobile"
    >
      {/* 1. Tab Editor */}
      <button
        onClick={() => onTabChange('editor')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative min-h-[44px] ${
          activeTab === 'editor'
            ? 'text-[#007acc] font-bold'
            : isLight
            ? 'text-neutral-700 hover:text-black'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Code2 className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight mt-1">Editor</span>
        {activeTab === 'editor' && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#007acc] mt-0.5" />
        )}
      </button>

      {/* 2. Tab Terminal */}
      <button
        onClick={() => onTabChange('terminal')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative min-h-[44px] ${
          activeTab === 'terminal'
            ? 'text-[#007acc] font-bold'
            : isLight
            ? 'text-neutral-700 hover:text-black'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <div className="relative">
          <Terminal className="w-5 h-5" />
          {errorCount > 0 && (
            <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full text-[9px] font-bold bg-red-600 text-white">
              {errorCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium tracking-tight mt-1">Terminal</span>
        {activeTab === 'terminal' && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#007acc] mt-0.5" />
        )}
      </button>

      {/* Center Primary Action: Executar C# (Thumb Zone CTA) */}
      <div className="flex-1 flex items-center justify-center -mt-5">
        <button
          onClick={onRunCode}
          disabled={isRunning}
          title="Compilar e Executar C#"
          className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
            isRunning
              ? 'bg-emerald-700 cursor-wait animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60'
          }`}
        >
          {isRunning ? (
            <RotateCw className="w-6 h-6 animate-spin text-white" />
          ) : (
            <Play className="w-6 h-6 fill-current text-white translate-x-0.5" />
          )}
        </button>
      </div>

      {/* 3. Tab Exemplos */}
      <button
        onClick={() => onTabChange('templates')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative min-h-[44px] ${
          activeTab === 'templates'
            ? 'text-[#007acc] font-bold'
            : isLight
            ? 'text-neutral-700 hover:text-black'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight mt-1">Exemplos</span>
        {activeTab === 'templates' && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#007acc] mt-0.5" />
        )}
      </button>

      {/* 4. Tab Projetos */}
      <button
        onClick={() => onTabChange('projects')}
        className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative min-h-[44px] ${
          activeTab === 'projects'
            ? 'text-[#007acc] font-bold'
            : isLight
            ? 'text-neutral-700 hover:text-black'
            : 'text-neutral-400 hover:text-neutral-200'
        }`}
      >
        <FolderCode className="w-5 h-5" />
        <span className="text-[10px] font-medium tracking-tight mt-1">Projetos</span>
        {activeTab === 'projects' && (
          <div className="w-1.5 h-1.5 rounded-full bg-[#007acc] mt-0.5" />
        )}
      </button>
    </nav>
  );
};
