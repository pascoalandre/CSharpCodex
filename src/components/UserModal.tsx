import React, { useState } from 'react';
import { X, UserPlus, Check, UserCheck } from 'lucide-react';
import { User, ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  allUsers: User[];
  onSelectUser: (userId: string) => void;
  onCreateUser: (username: string, displayName: string, email: string) => void;
  theme: ThemeMode;
}

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allUsers,
  onSelectUser,
  onCreateUser,
  theme,
}) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;
  const [isCreating, setIsCreating] = useState(false);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim()) {
      setError('Por favor preencha o nome e o usuário.');
      return;
    }
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (allUsers.some((u) => u.username === cleanUsername)) {
      setError('Este nome de usuário já está em uso.');
      return;
    }

    onCreateUser(cleanUsername, displayName.trim(), email.trim() || `${cleanUsername}@codex.local`);
    setIsCreating(false);
    setUsername('');
    setDisplayName('');
    setEmail('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none animate-fadeIn">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden flex flex-col ${styles.cardBg} ${styles.borderColor}`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 border-b flex items-center justify-between ${
            isLight ? 'bg-white border-neutral-300' : `${styles.headerBg} ${styles.borderColor}`
          }`}
        >
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#007acc]" />
            <h3 className={`text-sm font-bold ${isLight ? 'text-black' : 'text-white'}`}>
              Sistema de Usuários — C# Codex
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

        {/* Modal Body */}
        <div className="p-4 space-y-4">
          {!isCreating ? (
            <>
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-neutral-800' : 'text-neutral-400'}`}>
                  Perfis Registrados ({allUsers.length})
                </span>
                <button
                  onClick={() => setIsCreating(true)}
                  className="text-xs text-[#007acc] font-bold hover:underline flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Criar Novo Perfil
                </button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2">
                {allUsers.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <div
                      key={u.id}
                      onClick={() => {
                        onSelectUser(u.id);
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-[#007acc] bg-blue-50/20 text-[#007acc] font-bold'
                          : isLight
                          ? 'border-neutral-300 bg-white hover:bg-neutral-50 text-black'
                          : 'border-neutral-700/50 hover:bg-white/5 text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src="/src/assets/images/avatar_engineer_user_1792569766320.jpg"
                          alt={u.displayName}
                          className="w-10 h-10 rounded-full object-cover border border-[#007acc]"
                        />
                        <div>
                          <div className={`text-xs font-bold ${isLight ? 'text-black' : 'text-white'}`}>
                            {u.displayName}
                          </div>
                          <div className={`text-[11px] font-mono ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                            @{u.username}
                          </div>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="px-2.5 py-1 rounded-lg text-[10px] bg-[#007acc] text-white flex items-center gap-1 font-bold">
                          <Check className="w-3 h-3" /> Ativo
                        </span>
                      ) : (
                        <span className="text-[11px] text-[#007acc] font-bold">
                          Alternar &rarr;
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                  isLight ? 'bg-neutral-100 border-neutral-300 text-neutral-800' : 'bg-black/40 border-neutral-800 text-neutral-400'
                }`}
              >
                Cada perfil armazena seus próprios códigos, projetos favoritos e histórico no navegador de forma independente.
              </div>
            </>
          ) : (
            <form onSubmit={handleCreate} className="space-y-3">
              <div className={`text-xs font-bold ${isLight ? 'text-black' : 'text-neutral-200'}`}>
                Criar Novo Perfil de Desenvolvedor
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className={`text-[11px] font-bold block mb-1 ${isLight ? 'text-neutral-800' : 'text-neutral-300'}`}>
                  Nome Completo
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    isLight ? 'bg-white border-neutral-300 text-black' : 'bg-black/50 border-neutral-700 text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-[11px] font-bold block mb-1 ${isLight ? 'text-neutral-800' : 'text-neutral-300'}`}>
                  Nome de Usuário (Username)
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none font-mono ${
                    isLight ? 'bg-white border-neutral-300 text-black' : 'bg-black/50 border-neutral-700 text-white'
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-[11px] font-bold block mb-1 ${isLight ? 'text-neutral-800' : 'text-neutral-300'}`}>
                  Email (Opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border outline-none ${
                    isLight ? 'bg-white border-neutral-300 text-black' : 'bg-black/50 border-neutral-700 text-white'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                    isLight ? 'text-neutral-700 hover:bg-neutral-100' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-[#007acc] hover:bg-[#0062a3] text-white shadow"
                >
                  Salvar Perfil
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
