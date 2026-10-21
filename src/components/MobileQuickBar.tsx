import React from 'react';
import { ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

interface MobileQuickBarProps {
  onInsertSymbol: (symbol: string) => void;
  theme: ThemeMode;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({ onInsertSymbol, theme }) => {
  const styles = THEMES[theme];

  const SYMBOLS = [
    { label: 'TAB', insert: '    ' },
    { label: '{', insert: '{' },
    { label: '}', insert: '}' },
    { label: '(', insert: '(' },
    { label: ')', insert: ')' },
    { label: ';', insert: ';' },
    { label: '=', insert: '=' },
    { label: '"', insert: '"' },
    { label: '[', insert: '[' },
    { label: ']', insert: ']' },
    { label: '+', insert: '+' },
    { label: '-', insert: '-' },
    { label: '*', insert: '*' },
    { label: '/', insert: '/' },
    { label: '>', insert: '>' },
    { label: '<', insert: '<' },
    { label: '!', insert: '!' },
    { label: ':', insert: ':' },
    { label: '.', insert: '.' },
    { label: 'WriteLine', insert: 'Console.WriteLine();' },
    { label: 'ReadLine', insert: 'Console.ReadLine()' },
  ];

  return (
    <div
      className={`h-10 border-b flex items-center px-2 gap-1.5 overflow-x-auto no-scrollbar shrink-0 select-none ${styles.headerBg} ${styles.borderColor}`}
    >
      {SYMBOLS.map((item, idx) => (
        <button
          key={idx}
          onClick={() => onInsertSymbol(item.insert)}
          className={`h-7 px-2.5 rounded-lg border text-xs font-mono font-medium shrink-0 active:scale-95 transition-all flex items-center justify-center ${
            item.label === 'TAB' || item.label.includes('Line')
              ? 'bg-[#007acc]/20 text-[#3894df] border-[#007acc]/40 font-bold'
              : 'bg-white/5 border-neutral-700/60 text-neutral-200 hover:bg-white/10'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
