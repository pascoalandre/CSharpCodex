import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';
import { ThemeMode } from '../types';
import { THEMES } from '../styles/themes';

interface AndroidStatusBarProps {
  theme: ThemeMode;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ theme }) => {
  const styles = THEMES[theme];
  const isLight = styles.isLight;
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`h-7 px-4 flex items-center justify-between text-[11px] font-medium tracking-tight select-none shrink-0 ${
        isLight ? 'bg-white text-black' : `${styles.headerBg} text-neutral-400`
      }`}
    >
      <div className="flex items-center gap-2">
        <span className={`font-bold ${isLight ? 'text-black' : 'text-neutral-200'}`}>
          {time || '12:00'}
        </span>
        <span className="text-[10px] text-emerald-500 font-mono hidden xs:inline">● Codex</span>
      </div>

      <div className={`flex items-center gap-2 ${isLight ? 'text-neutral-800' : 'text-neutral-300'}`}>
        <span className={`text-[10px] font-bold tracking-widest ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
          5G
        </span>
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-bold">98%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-500" />
        </div>
      </div>
    </div>
  );
};
