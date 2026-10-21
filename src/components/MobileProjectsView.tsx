import React, { useRef, useState } from 'react';
import {
  FolderCode,
  Plus,
  Upload,
  Download,
  Trash2,
  Copy,
  Star,
  FileCode,
  Sliders,
  Check,
  Search,
  X,
  AlertCircle,
} from 'lucide-react';
import { Project, User, ThemeMode, EditorSettings } from '../types';
import { THEMES } from '../styles/themes';

interface MobileProjectsViewProps {
  projects: Project[];
  currentProjectId: string;
  onSelectProject: (p: Project) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (p: Project) => void;
  onToggleFavorite: (id: string) => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportAllData: () => void;
  currentUser: User;
  onOpenUserModal: () => void;
  theme: ThemeMode;
  settings: EditorSettings;
  onUpdateSettings: (s: EditorSettings) => void;
}

export const MobileProjectsView: React.FC<MobileProjectsViewProps> = ({
  projects,
  currentProjectId,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onToggleFavorite,
  onImportFile,
  onExportAllData,
  currentUser,
  onOpenUserModal,
  theme,
  settings,
  onUpdateSettings,
}) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [search, setSearch] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'files' | 'settings'>('files');

  // Delete confirmation state (NO window.confirm)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDuplicate = (e: React.MouseEvent, p: Project) => {
    e.stopPropagation();
    onDuplicateProject(p);
    showToast(`Cópia criada: ${p.name}`);
  };

  const handleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onToggleFavorite(id);
    const p = projects.find((x) => x.id === id);
    if (p) {
      showToast(p.isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos');
    }
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete.id);
      showToast(`Projeto excluído: ${projectToDelete.name}`);
      setProjectToDelete(null);
    }
  };

  return (
    <div className={`flex-1 flex flex-col h-full w-full overflow-hidden ${styles.appBg}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-semibold shadow-2xl border border-neutral-700 flex items-center gap-2 animate-fadeIn pointer-events-none">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div
        className={`p-3 border-b flex items-center justify-between shrink-0 select-none ${styles.headerBg} ${styles.borderColor}`}
      >
        <div className="flex items-center gap-2">
          <FolderCode className="w-5 h-5 text-[#007acc]" />
          <div>
            <h2 className={`text-sm font-bold font-['Plus_Jakarta_Sans'] ${isLight ? 'text-black' : 'text-white'}`}>
              Meus Projetos & Perfil
            </h2>
            <p className={`text-[10px] font-mono ${styles.textMuted}`}>@{currentUser.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab(activeSubTab === 'files' ? 'settings' : 'files')}
            className={`p-2 rounded-xl border text-xs flex items-center gap-1 transition-colors ${
              activeSubTab === 'settings'
                ? 'bg-[#007acc] text-white border-[#007acc]'
                : isLight
                ? 'border-neutral-300 text-black hover:bg-neutral-100'
                : 'border-neutral-700/60 text-neutral-300 hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button
            onClick={onCreateProject}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'files' ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* User Quick Strip */}
          <div
            className={`p-3 border-b flex items-center justify-between ${
              isLight ? 'bg-white border-neutral-200' : 'bg-black/20 border-neutral-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <img
                src="/src/assets/images/avatar_engineer_user_1792569766320.jpg"
                alt={currentUser.displayName}
                className="w-10 h-10 rounded-full object-cover border border-[#007acc]"
              />
              <div>
                <span className={`text-xs font-bold block ${isLight ? 'text-black' : 'text-white'}`}>
                  {currentUser.displayName}
                </span>
                <span className="text-[10px] text-emerald-500 font-mono font-medium">
                  {currentUser.totalCompilations} compilações
                </span>
              </div>
            </div>

            <button
              onClick={onOpenUserModal}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors ${
                isLight
                  ? 'border-neutral-300 text-black hover:bg-neutral-100'
                  : 'border-neutral-700 text-[#3894df] hover:bg-white/5'
              }`}
            >
              Trocar Usuário
            </button>
          </div>

          {/* Search & Actions */}
          <div
            className={`p-2.5 border-b flex items-center gap-2 ${
              isLight ? 'bg-[#f4f4f5] border-neutral-300' : 'border-neutral-800'
            }`}
          >
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Buscar arquivos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full h-10 px-3 rounded-xl border text-xs outline-none ${
                  isLight
                    ? 'bg-white border-neutral-300 text-black focus:border-[#007acc]'
                    : 'bg-black/40 border-neutral-700 text-white focus:border-[#007acc]'
                }`}
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Importar .cs do celular"
              className={`h-10 px-3 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                isLight
                  ? 'border-neutral-300 text-black bg-white hover:bg-neutral-100'
                  : 'border-neutral-700 text-neutral-200 hover:text-white bg-white/5'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".cs,.txt"
              className="hidden"
              onChange={onImportFile}
            />
          </div>

          {/* Files List */}
          <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-xs">
                <p className={`font-semibold ${isLight ? 'text-black' : 'text-neutral-400'}`}>
                  Nenhum projeto encontrado.
                </p>
                <button
                  onClick={onCreateProject}
                  className="text-[#007acc] font-bold mt-2 inline-block underline"
                >
                  Criar primeiro arquivo .cs
                </button>
              </div>
            ) : (
              filtered.map((p) => {
                const isSelected = p.id === currentProjectId;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 active:scale-98 ${
                      isLight
                        ? isSelected
                          ? 'border-[#007acc] bg-blue-50/80 shadow-xs'
                          : 'border-neutral-300 bg-white hover:border-neutral-400'
                        : isSelected
                        ? 'border-[#007acc] bg-[#007acc]/15 shadow-sm'
                        : 'border-neutral-700/50 bg-[#252526] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#007acc] text-white'
                            : isLight
                            ? 'bg-neutral-100 text-[#007acc]'
                            : 'bg-white/5 text-[#3894df]'
                        }`}
                      >
                        <FileCode className="w-5 h-5" />
                      </div>
                      <div className="truncate">
                        <h4
                          className={`text-xs font-bold font-mono truncate ${
                            isLight ? 'text-black' : 'text-neutral-100'
                          }`}
                        >
                          {p.name}
                        </h4>
                        <span className={`text-[10px] ${styles.textMuted}`}>
                          {new Date(p.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Touch Action Buttons (at least 40px touch zone, no window.confirm) */}
                    <div className="flex items-center gap-1 shrink-0">
                      {/* Favoritar */}
                      <button
                        type="button"
                        onClick={(e) => handleFavorite(e, p.id)}
                        title={p.isFavorite ? 'Desfavoritar' : 'Favoritar'}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform ${
                          p.isFavorite
                            ? 'text-amber-500'
                            : isLight
                            ? 'text-neutral-400 hover:text-black'
                            : 'text-neutral-500 hover:text-white'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${p.isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      {/* Copiar / Duplicar */}
                      <button
                        type="button"
                        onClick={(e) => handleDuplicate(e, p)}
                        title="Duplicar projeto"
                        className={`w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform ${
                          isLight ? 'text-neutral-700 hover:text-black' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Eliminar / Excluir */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setProjectToDelete(p);
                        }}
                        title="Excluir projeto"
                        className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Backup Footer */}
          <div
            className={`p-3 border-t flex items-center justify-between text-xs ${
              isLight ? 'bg-white border-neutral-300 text-neutral-800' : 'bg-black/20 border-neutral-800 text-neutral-400'
            }`}
          >
            <span className="font-medium">{projects.length} arquivo(s) salvos</span>
            <button
              onClick={onExportAllData}
              className="text-[#007acc] font-bold hover:underline flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Backup</span>
            </button>
          </div>
        </div>
      ) : (
        /* Settings Sub-Tab */
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-black' : 'text-neutral-400'}`}>
            Configurações do Editor
          </h3>

          <div>
            <label className={`block mb-2 font-bold ${isLight ? 'text-black' : 'text-neutral-300'}`}>
              Tamanho do Texto ({settings.fontSize}px)
            </label>
            <div className="flex gap-2">
              {[12, 14, 16, 18].map((sz) => (
                <button
                  key={sz}
                  onClick={() => onUpdateSettings({ ...settings, fontSize: sz })}
                  className={`flex-1 py-2.5 rounded-xl border font-mono font-bold transition-colors ${
                    settings.fontSize === sz
                      ? 'bg-[#007acc] text-white border-[#007acc]'
                      : isLight
                      ? 'border-neutral-300 bg-white text-black'
                      : 'border-neutral-700 bg-neutral-800 text-neutral-300'
                  }`}
                >
                  {sz}px
                </button>
              ))}
            </div>
          </div>

          <div
            className={`flex items-center justify-between py-3 border-t ${
              isLight ? 'border-neutral-200' : 'border-neutral-800'
            }`}
          >
            <span className={`font-medium ${isLight ? 'text-black' : 'text-neutral-200'}`}>
              Salvamento Automático
            </span>
            <button
              onClick={() => onUpdateSettings({ ...settings, autoSave: !settings.autoSave })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.autoSave ? 'bg-emerald-600' : 'bg-neutral-500'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.autoSave ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div
            className={`flex items-center justify-between py-3 border-t ${
              isLight ? 'border-neutral-200' : 'border-neutral-800'
            }`}
          >
            <span className={`font-medium ${isLight ? 'text-black' : 'text-neutral-200'}`}>
              Quebra de Linha (Word Wrap)
            </span>
            <button
              onClick={() =>
                onUpdateSettings({
                  ...settings,
                  wordWrap: settings.wordWrap === 'on' ? 'off' : 'on',
                })
              }
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.wordWrap === 'on' ? 'bg-[#007acc]' : 'bg-neutral-500'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.wordWrap === 'on' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal (Replaces blocked window.confirm) */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-fadeIn">
          <div
            className={`w-full max-w-sm rounded-2xl shadow-2xl border p-4 flex flex-col gap-3 ${styles.cardBg} ${styles.borderColor}`}
          >
            <div className="flex items-center gap-2.5 text-red-500">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                Excluir Projeto?
              </h3>
            </div>

            <p className={`text-xs ${isLight ? 'text-neutral-800' : 'text-neutral-300'} leading-relaxed`}>
              Deseja realmente apagar o arquivo <strong className="font-mono text-red-400">"{projectToDelete.name}"</strong>? Esta ação não pode ser desfeita.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-700/30">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                  isLight ? 'text-neutral-800 hover:bg-neutral-100' : 'text-neutral-300 hover:bg-white/10'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md active:scale-95"
              >
                Sim, Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
