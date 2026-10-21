import React, { useState } from 'react';
import {
  Folder,
  Code,
  X,
  Plus,
  ArrowLeft,
  Search,
  Save,
  Play,
  MoreVertical,
  RotateCw,
  FileText,
} from 'lucide-react';
import { Project, ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

interface AcodeHeaderProps {
  currentProject: Project;
  openProjects: Project[];
  onSelectProject: (p: Project) => void;
  onCloseProjectTab: (id: string) => void;
  onOpenDrawer: () => void;
  onNewFile: () => void;
  onSave: () => void;
  onRun: () => void;
  onSearch: () => void;
  onOpenMoreMenu: () => void;
  isRunning: boolean;
  isSaved: boolean;
  theme: ThemeMode;
}

export const AcodeHeader: React.FC<AcodeHeaderProps> = ({
  currentProject,
  openProjects,
  onSelectProject,
  onCloseProjectTab,
  onOpenDrawer,
  onNewFile,
  onSave,
  onRun,
  onSearch,
  onOpenMoreMenu,
  isRunning,
  isSaved,
  theme,
}) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;

  return (
    <header className="flex flex-col select-none shrink-0 border-b border-neutral-700/40">
      {/* Row 1: Folder Drawer Trigger + Tabs + New File Button */}
      <div
        className={`h-11 flex items-center justify-between px-1 gap-1 border-b ${
          isLight ? 'bg-[#eceef1] border-neutral-300' : 'bg-[#1e222b] border-[#2d313d]'
        }`}
      >
        {/* Left: Folder Drawer Button */}
        <button
          type="button"
          onClick={onOpenDrawer}
          title="Abrir Arquivos e Projetos"
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 active:scale-95 transition-colors ${
            isLight ? 'text-neutral-800 hover:bg-neutral-300' : 'text-neutral-300 hover:bg-white/10'
          }`}
        >
          <Folder className="w-5 h-5 fill-current opacity-80" />
        </button>

        {/* Middle: Horizontal Scrolling Tabs (Active Tab with < > icon and X) */}
        <div className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar min-w-0 h-full py-1">
          {openProjects.map((proj) => {
            const isActive = proj.id === currentProject.id;
            return (
              <div
                key={proj.id}
                onClick={() => onSelectProject(proj)}
                className={`h-8 px-2.5 rounded-md flex items-center gap-1.5 cursor-pointer text-xs font-mono transition-colors shrink-0 max-w-[200px] border ${
                  isActive
                    ? isLight
                      ? 'bg-white text-black border-neutral-300 font-bold shadow-xs'
                      : 'bg-[#15171e] text-[#f1f1f1] border-[#383d4c] font-semibold'
                    : isLight
                    ? 'text-neutral-600 border-transparent hover:bg-neutral-200'
                    : 'text-neutral-400 border-transparent hover:bg-white/5'
                }`}
              >
                {/* Code Tag Icon: < > in coral/orange like in the screenshot */}
                <div className="flex items-center text-[#e57373] font-bold text-[11px] shrink-0">
                  <span>&lt;</span>
                  <span className="text-[#64b5f6]">&gt;</span>
                </div>

                <span className="truncate text-[12px]">{proj.name}</span>

                {!isSaved && isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                )}

                {openProjects.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseProjectTab(proj.id);
                    }}
                    className="p-0.5 rounded hover:bg-neutral-500/20 text-neutral-400 hover:text-white shrink-0 ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: New File / Actions */}
        <button
          type="button"
          onClick={onNewFile}
          title="Novo Arquivo C#"
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 active:scale-95 transition-colors ${
            isLight ? 'text-neutral-800 hover:bg-neutral-300' : 'text-neutral-300 hover:bg-white/10'
          }`}
        >
          <FileText className="w-4 h-4 opacity-80" />
        </button>
      </div>

      {/* Row 2: Breadcrumb Path & Tool Buttons: ← [📁 path] [🔍] [💾] [▶] [•••] */}
      <div
        className={`h-10 flex items-center justify-between px-2 gap-2 ${
          isLight ? 'bg-white border-neutral-300 text-black' : 'bg-[#181a20] text-neutral-300 border-[#2a2d36]'
        }`}
      >
        {/* Left: Back Arrow and Breadcrumb Path */}
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <button
            type="button"
            onClick={onOpenDrawer}
            title="Voltar ao explorador"
            className={`p-1 rounded active:scale-95 ${
              isLight ? 'hover:bg-neutral-100 text-neutral-800' : 'hover:bg-white/10 text-neutral-400'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 text-[11px] font-mono truncate text-neutral-400">
            <Folder className="w-3.5 h-3.5 text-[#007acc] shrink-0" />
            <span className="text-neutral-500">&gt;</span>
            <span className={`truncate font-medium ${isLight ? 'text-black' : 'text-neutral-200'}`}>
              {currentProject.name}
            </span>
          </div>
        </div>

        {/* Right Action Icons: Search [🔍], Save [💾], Run [▶], More [•••] */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Search Icon */}
          <button
            type="button"
            onClick={onSearch}
            title="Localizar Código"
            className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-95 transition-colors ${
              isLight ? 'hover:bg-neutral-100 text-neutral-800' : 'hover:bg-white/10 text-neutral-300'
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Save Icon */}
          <button
            type="button"
            onClick={onSave}
            title="Salvar (Ctrl+S)"
            className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-95 transition-colors relative ${
              isLight ? 'hover:bg-neutral-100 text-neutral-800' : 'hover:bg-white/10 text-neutral-300'
            }`}
          >
            <Save className="w-4 h-4" />
            {!isSaved && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          {/* PLAY / RUN ICON: Exact Play Triangle from screenshot */}
          <button
            type="button"
            onClick={onRun}
            disabled={isRunning}
            title="Executar C# (Ctrl+Enter)"
            className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-90 transition-transform ${
              isRunning ? 'text-emerald-400 animate-pulse' : 'text-[#81c784] hover:text-emerald-400 hover:bg-emerald-500/10'
            }`}
          >
            {isRunning ? (
              <RotateCw className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <Play className="w-4 h-4 fill-current translate-x-0.5" />
            )}
          </button>

          {/* More Options [•••] */}
          <button
            type="button"
            onClick={onOpenMoreMenu}
            title="Mais Opções"
            className={`w-8 h-8 rounded-lg flex items-center justify-center active:scale-95 transition-colors ${
              isLight ? 'hover:bg-neutral-100 text-neutral-800' : 'hover:bg-white/10 text-neutral-300'
            }`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
