import React, { useRef, useState } from 'react';
import {
  Folder,
  FileCode,
  Plus,
  Upload,
  Download,
  Trash2,
  Copy,
  Star,
  Layers,
  User as UserIcon,
  X,
  ChevronRight,
  Sliders,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Project, User, ThemeMode } from '../types';
import { CSHARP_TEMPLATES } from '../data/csharpExamples';
import { THEMES } from '../styles/themes';

interface FileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (p: Project) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (p: Project) => void;
  onToggleFavorite: (id: string) => void;
  onSelectTemplate: (t: Project) => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportAllData: () => void;
  currentUser: User;
  onOpenUserModal: () => void;
  theme: ThemeMode;
}

export const FileDrawer: React.FC<FileDrawerProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onToggleFavorite,
  onSelectTemplate,
  onImportFile,
  onExportAllData,
  currentUser,
  onOpenUserModal,
  theme,
}) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'files' | 'templates'>('files');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex select-none animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Surface */}
      <div
        className={`relative w-80 max-w-[85vw] h-full flex flex-col z-10 border-r shadow-2xl overflow-hidden ${
          isLight ? 'bg-white border-neutral-300 text-black' : 'bg-[#181a20] border-[#2c303c] text-neutral-200'
        }`}
      >
        {/* Toast */}
        {toastMessage && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg bg-neutral-900 text-white text-xs font-semibold shadow-xl border border-neutral-700 flex items-center gap-1.5 pointer-events-none">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Drawer Header */}
        <div
          className={`h-12 px-3 border-b flex items-center justify-between shrink-0 ${
            isLight ? 'bg-[#f4f4f5] border-neutral-300' : 'bg-[#1e222b] border-[#2c303c]'
          }`}
        >
          <div className="flex items-center gap-2">
            <img
              src="/src/assets/images/codex_app_icon_1792569766871.jpg"
              alt="C# Codex"
              className="w-6 h-6 rounded-md object-cover"
            />
            <span className={`font-bold text-xs font-['Plus_Jakarta_Sans'] ${isLight ? 'text-black' : 'text-white'}`}>
              C# Codex Explorer
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg active:scale-95 ${
              isLight ? 'text-black hover:bg-neutral-200' : 'text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div
          className={`p-3 border-b flex items-center justify-between ${
            isLight ? 'bg-[#fafafa] border-neutral-200' : 'bg-black/20 border-[#262933]'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/src/assets/images/avatar_engineer_user_1792569766320.jpg"
              alt={currentUser.displayName}
              className="w-8 h-8 rounded-full object-cover border border-[#007acc]"
            />
            <div className="truncate">
              <span className={`text-xs font-bold block truncate ${isLight ? 'text-black' : 'text-white'}`}>
                {currentUser.displayName}
              </span>
              <span className="text-[10px] text-emerald-500 font-mono">
                {currentUser.totalCompilations} runs
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenUserModal();
            }}
            className={`px-2 py-1 text-[11px] rounded-lg border font-semibold ${
              isLight ? 'border-neutral-300 text-black hover:bg-neutral-100' : 'border-neutral-700 text-[#3894df]'
            }`}
          >
            Perfil
          </button>
        </div>

        {/* Tab Toggle: Arquivos vs Modelos */}
        <div
          className={`flex border-b text-xs font-bold ${
            isLight ? 'border-neutral-200 bg-neutral-100' : 'border-[#262933] bg-[#14161c]'
          }`}
        >
          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`flex-1 py-2 text-center transition-colors border-b-2 ${
              activeTab === 'files'
                ? 'border-[#007acc] text-[#007acc]'
                : isLight
                ? 'border-transparent text-neutral-600'
                : 'border-transparent text-neutral-400'
            }`}
          >
            Meus Arquivos ({projects.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-2 text-center transition-colors border-b-2 ${
              activeTab === 'templates'
                ? 'border-[#007acc] text-[#007acc]'
                : isLight
                ? 'border-transparent text-neutral-600'
                : 'border-transparent text-neutral-400'
            }`}
          >
            Modelos C# ({CSHARP_TEMPLATES.length})
          </button>
        </div>

        {/* Main Drawer Body */}
        <div className="flex-1 overflow-y-auto p-2">
          {activeTab === 'files' ? (
            <div className="space-y-1.5">
              {/* Quick Actions Bar */}
              <div className="flex items-center justify-between pb-1 px-1">
                <span className={`text-[10px] uppercase font-bold tracking-wider ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  PROJETOS
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={onCreateProject}
                    title="Novo Arquivo"
                    className="p-1 rounded bg-[#007acc] text-white hover:bg-[#0062a3] active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Importar .cs"
                    className={`p-1 rounded border active:scale-95 ${
                      isLight ? 'border-neutral-300 text-black' : 'border-neutral-700 text-neutral-300'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".cs,.txt"
                    className="hidden"
                    onChange={onImportFile}
                  />
                </div>
              </div>

              {/* Projects List */}
              {projects.map((p) => {
                const isSelected = p.id === currentProjectId;
                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      onClose();
                    }}
                    className={`group p-2 rounded-xl border flex items-center justify-between gap-1.5 cursor-pointer active:scale-98 transition-all ${
                      isLight
                        ? isSelected
                          ? 'bg-blue-50 border-[#007acc]'
                          : 'bg-white border-neutral-200 hover:bg-neutral-50'
                        : isSelected
                        ? 'bg-[#007acc]/20 border-[#007acc]/50'
                        : 'bg-[#21242d] border-[#2e3340] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0 flex-1">
                      <FileCode
                        className={`w-4 h-4 shrink-0 ${
                          isSelected ? 'text-[#007acc]' : isLight ? 'text-neutral-500' : 'text-neutral-400'
                        }`}
                      />
                      <span
                        className={`font-mono text-xs truncate ${
                          isLight ? 'text-black font-semibold' : 'text-neutral-200'
                        }`}
                      >
                        {p.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(p.id);
                          showToast(p.isFavorite ? 'Removido dos favoritos' : 'Favoritado');
                        }}
                        className={`p-1 rounded ${p.isFavorite ? 'text-amber-400' : 'text-neutral-400 hover:text-white'}`}
                      >
                        <Star className={`w-3.5 h-3.5 ${p.isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateProject(p);
                          showToast('Projeto duplicado');
                        }}
                        className="p-1 rounded text-neutral-400 hover:text-white"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(p);
                        }}
                        className="p-1 rounded text-neutral-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Templates List */
            <div className="space-y-2">
              {CSHARP_TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => {
                    onSelectTemplate(tpl);
                    onClose();
                  }}
                  className={`p-2.5 rounded-xl border cursor-pointer active:scale-98 transition-all ${
                    isLight
                      ? 'bg-white border-neutral-200 hover:border-neutral-400'
                      : 'bg-[#21242d] border-[#2e3340] hover:border-[#007acc]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold truncate ${isLight ? 'text-black' : 'text-neutral-100'}`}>
                      {tpl.name}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#007acc] shrink-0" />
                  </div>
                  <p className={`text-[10px] mt-1 line-clamp-2 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    {tpl.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div
          className={`p-2.5 border-t flex items-center justify-between text-xs shrink-0 ${
            isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-[#14161c] border-[#262933] text-neutral-400'
          }`}
        >
          <span className="font-mono text-[11px]">{projects.length} arquivos</span>
          <button
            type="button"
            onClick={onExportAllData}
            className="text-[#007acc] font-bold hover:underline flex items-center gap-1 text-[11px]"
          >
            <Download className="w-3 h-3" />
            Backup Geral
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
          <div
            className={`w-full max-w-xs rounded-2xl shadow-2xl border p-4 flex flex-col gap-3 ${
              isLight ? 'bg-white border-neutral-300' : 'bg-[#1e222b] border-[#2c303c]'
            }`}
          >
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                Excluir Arquivo?
              </h3>
            </div>
            <p className={`text-xs ${isLight ? 'text-neutral-800' : 'text-neutral-300'}`}>
              Deseja apagar <strong className="font-mono">"{projectToDelete.name}"</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-700/30">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  isLight ? 'text-black hover:bg-neutral-100' : 'text-neutral-300 hover:bg-white/10'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteProject(projectToDelete.id);
                  showToast('Arquivo excluído');
                  setProjectToDelete(null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
