import React from 'react';
import { ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

interface AcodeKeyboardBarProps {
  onInsert: (text: string) => void;
  theme: ThemeMode;
}

export const AcodeKeyboardBar: React.FC<AcodeKeyboardBarProps> = ({ onInsert, theme }) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;

  // Row 1: C# Types & Keywords
  const ROW1 = [
    { label: 'class', insert: 'class ' },
    { label: 'void', insert: 'void ' },
    { label: 'int', insert: 'int ' },
    { label: 'string', insert: 'string ' },
    { label: 'Console', insert: 'Console.' },
    { label: 'WriteLine', insert: 'Console.WriteLine();' },
    { label: 'ReadLine', insert: 'Console.ReadLine()' },
    { label: 'public', insert: 'public ' },
    { label: 'return', insert: 'return ' },
    { label: 'if', insert: 'if () ' },
    { label: 'for', insert: 'for (int i = 0; i < n; i++) ' },
    { label: 'foreach', insert: 'foreach (var item in list) ' },
  ];

  // Row 2: Symbols & Operators matching screenshot
  const ROW2 = [
    { label: '→|', insert: '    ' }, // TAB
    { label: '=""', insert: ' = ""' },
    { label: '<', insert: '<' },
    { label: '>', insert: '>' },
    { label: '{', insert: '{' },
    { label: '}', insert: '}' },
    { label: '(', insert: '(' },
    { label: ')', insert: ')' },
    { label: '[', insert: '[' },
    { label: ']', insert: ']' },
    { label: ';', insert: ';' },
    { label: '=', insert: '=' },
    { label: '+', insert: '+' },
    { label: '-', insert: '-' },
    { label: '*', insert: '*' },
    { label: '/', insert: '/' },
    { label: '//', insert: '// ' },
    { label: '!', insert: '!' },
    { label: ':', insert: ':' },
    { label: '.', insert: '.' },
  ];

  const btnStyle = isLight
    ? 'bg-[#e2e4e8] border-neutral-300 text-black hover:bg-neutral-300 active:bg-neutral-400'
    : 'bg-[#252b36] border-[#323947] text-[#cfd6e0] hover:bg-[#2d3442] active:bg-[#1a1f28]';

  return (
    <div
      className={`border-t flex flex-col gap-1 p-1 select-none shrink-0 ${
        isLight ? 'bg-[#f0f2f5] border-neutral-300' : 'bg-[#181c24] border-[#292f3d]'
      }`}
    >
      {/* Row 1 */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span className="text-[9px] font-mono text-[#e57373] px-1 font-bold shrink-0">
          C#
        </span>
        {ROW1.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsert(item.insert)}
            className={`h-7 px-2.5 rounded-md border text-[11px] font-mono font-medium shrink-0 active:scale-95 transition-all flex items-center justify-center ${btnStyle}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Row 2 */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {ROW2.map((item, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onInsert(item.insert)}
            className={`h-7 min-w-[28px] px-2 rounded-md border text-[12px] font-mono font-medium shrink-0 active:scale-95 transition-all flex items-center justify-center ${btnStyle} ${
              item.label === '→|' ? 'bg-[#007acc]/20 text-[#3894df] font-bold border-[#007acc]/40' : ''
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
