import React from 'react';
import {
  Files,
  Layers,
  Code2,
  BookMarked,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

export type ActivityTab = 'explorer' | 'templates' | 'snippets' | 'cheatsheet' | 'settings' | 'user';

interface ActivityBarProps {
  activeTab: ActivityTab | null;
  onTabChange: (tab: ActivityTab) => void;
  theme: ThemeMode;
  userCompilations: number;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({
  activeTab,
  onTabChange,
  theme,
}) => {
  const styles = THEMES[theme];

  const items: { id: ActivityTab; label: string; icon: React.ReactNode }[] = [
    { id: 'explorer', label: 'Explorador de Projetos', icon: <Files className="w-5 h-5" /> },
    { id: 'templates', label: 'Exemplos Prontos (C#)', icon: <Layers className="w-5 h-5" /> },
    { id: 'snippets', label: 'Snippets Rápidos', icon: <Code2 className="w-5 h-5" /> },
    { id: 'cheatsheet', label: 'Referência & Cheat Sheet C#', icon: <BookMarked className="w-5 h-5" /> },
    { id: 'settings', label: 'Configurações do Editor', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`w-12 h-full flex flex-col justify-between items-center py-2 border-r shrink-0 select-none ${styles.activityBarBg} ${styles.borderColor}`}
      aria-label="Barra de Atividades"
    >
      <div className="flex flex-col items-center gap-1 w-full">
        {items.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={item.label}
              className={`w-10 h-10 flex items-center justify-center rounded transition-colors relative ${
                isActive
                  ? 'text-white bg-white/10'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {isActive && (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#007acc] rounded-r"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col items-center gap-2 w-full">
        <button
          onClick={() => onTabChange('user')}
          title="Minha Conta & Armazenamento"
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors relative ${
            activeTab === 'user'
              ? 'text-white bg-white/10'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          {activeTab === 'user' && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#007acc] rounded-r" />
          )}
        </button>
      </div>
    </aside>
  );
};
