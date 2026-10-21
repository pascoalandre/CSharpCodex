import React from 'react';
import { Layers, ChevronRight } from 'lucide-react';
import { Project, ThemeMode } from '../types';
import { CSHARP_TEMPLATES } from '../data/csharpExamples';
import { THEMES } from '../styles/themes';

interface MobileTemplatesViewProps {
  onSelectTemplate: (template: Project) => void;
  theme: ThemeMode;
  currentProjectId: string;
}

export const MobileTemplatesView: React.FC<MobileTemplatesViewProps> = ({
  onSelectTemplate,
  theme,
  currentProjectId,
}) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;

  return (
    <div className={`flex-1 flex flex-col h-full w-full overflow-hidden ${styles.appBg}`}>
      {/* Header */}
      <div
        className={`p-3.5 border-b flex items-center justify-between shrink-0 select-none ${
          isLight ? 'bg-white border-neutral-300' : `${styles.headerBg} ${styles.borderColor}`
        }`}
      >
        <div>
          <h2
            className={`text-sm font-bold flex items-center gap-1.5 font-['Plus_Jakarta_Sans'] ${
              isLight ? 'text-black font-extrabold' : 'text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-[#007acc]" />
            Modelos Prontos de C#
          </h2>
          <p className={`text-[11px] ${styles.textMuted}`}>
            Exemplos testados e prontos para compilar no Android
          </p>
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {CSHARP_TEMPLATES.map((tpl) => {
          const isActive = currentProjectId.includes(tpl.id.replace('tpl-', ''));
          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer active:scale-98 select-none ${
                isLight
                  ? isActive
                    ? 'border-[#007acc] bg-blue-50/70 shadow-sm'
                    : 'border-neutral-300 bg-white hover:border-neutral-400'
                  : isActive
                  ? 'border-[#007acc] bg-[#007acc]/15 shadow-md shadow-[#007acc]/10'
                  : 'border-neutral-700/50 bg-[#252526] hover:border-neutral-500'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`text-xs font-bold truncate ${
                        isLight ? 'text-black' : 'text-neutral-100'
                      }`}
                    >
                      {tpl.name}
                    </h3>
                    {tpl.category === 'entrada' && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-purple-900/60 text-purple-200 font-mono font-bold">
                        Console.ReadLine
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                      isLight ? 'text-neutral-700' : 'text-neutral-400'
                    }`}
                  >
                    {tpl.description}
                  </p>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isLight ? 'bg-neutral-100 text-[#007acc]' : 'bg-white/5 text-[#3894df]'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <div
                className={`flex items-center justify-between mt-3 pt-2.5 border-t text-[10px] ${
                  isLight ? 'border-neutral-200 text-neutral-600' : 'border-neutral-700/30 text-neutral-400'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate font-mono">
                  {tpl.tags.map((t) => (
                    <span key={t}>#{t}</span>
                  ))}
                </div>
                <span className="text-[#007acc] font-bold shrink-0 flex items-center gap-1">
                  Carregar &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
