import { ThemeMode } from '../types';

export interface ThemeStyles {
  id: ThemeMode;
  name: string;
  monacoTheme: string;
  // UI colors
  appBg: string;
  sidebarBg: string;
  activityBarBg: string;
  headerBg: string;
  terminalBg: string;
  tabActiveBg: string;
  tabInactiveBg: string;
  borderColor: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  cardBg: string;
  codeSnippetBg: string;
  inputBg: string;
  isLight: boolean;
}

export const THEMES: Record<ThemeMode, ThemeStyles> = {
  'vs-dark': {
    id: 'vs-dark',
    name: 'VS Code Dark',
    monacoTheme: 'vs-dark',
    appBg: 'bg-[#1e1e1e]',
    sidebarBg: 'bg-[#252526]',
    activityBarBg: 'bg-[#181818]',
    headerBg: 'bg-[#1f1f1f]',
    terminalBg: 'bg-[#141414]',
    tabActiveBg: 'bg-[#1e1e1e]',
    tabInactiveBg: 'bg-[#2d2d2d]',
    borderColor: 'border-[#333333]',
    borderSubtle: 'border-[#2d2d2d]',
    textPrimary: 'text-[#f1f1f1]',
    textSecondary: 'text-[#969696]',
    textMuted: 'text-[#707070]',
    accent: 'bg-[#007acc]',
    accentHover: 'hover:bg-[#0062a3]',
    accentText: 'text-[#3894df]',
    cardBg: 'bg-[#252526]',
    codeSnippetBg: 'bg-[#1e1e1e]',
    inputBg: 'bg-[#2d2d30]',
    isLight: false,
  },
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    monacoTheme: 'dracula',
    appBg: 'bg-[#282a36]',
    sidebarBg: 'bg-[#21222c]',
    activityBarBg: 'bg-[#191a21]',
    headerBg: 'bg-[#1e1f29]',
    terminalBg: 'bg-[#191a21]',
    tabActiveBg: 'bg-[#282a36]',
    tabInactiveBg: 'bg-[#21222c]',
    borderColor: 'border-[#343746]',
    borderSubtle: 'border-[#282a36]',
    textPrimary: 'text-[#f8f8f2]',
    textSecondary: 'text-[#bd93f9]',
    textMuted: 'text-[#6272a4]',
    accent: 'bg-[#bd93f9]',
    accentHover: 'hover:bg-[#ff79c6]',
    accentText: 'text-[#bd93f9]',
    cardBg: 'bg-[#21222c]',
    codeSnippetBg: 'bg-[#282a36]',
    inputBg: 'bg-[#44475a]',
    isLight: false,
  },
  'vs-light': {
    id: 'vs-light',
    name: 'VS Code Claro',
    monacoTheme: 'vs',
    appBg: 'bg-[#f4f4f5]',
    sidebarBg: 'bg-[#ffffff]',
    activityBarBg: 'bg-[#e4e4e7]',
    headerBg: 'bg-[#ffffff]',
    terminalBg: 'bg-[#0f1115]', // Terminal stays dark console so white text looks crystal clear
    tabActiveBg: 'bg-[#ffffff]',
    tabInactiveBg: 'bg-[#e4e4e7]',
    borderColor: 'border-[#d4d4d8]',
    borderSubtle: 'border-[#e4e4e7]',
    textPrimary: 'text-[#09090b]', // Pure deep black for whole app in light mode
    textSecondary: 'text-[#27272a]',
    textMuted: 'text-[#71717a]',
    accent: 'bg-[#007acc]',
    accentHover: 'hover:bg-[#0062a3]',
    accentText: 'text-[#007acc]',
    cardBg: 'bg-[#ffffff]',
    codeSnippetBg: 'bg-[#f4f4f5]',
    inputBg: 'bg-[#ffffff]',
    isLight: true,
  },
};

export const DRACULA_MONACO_THEME = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: '', foreground: 'f8f8f2', background: '282a36' },
    { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
    { token: 'string', foreground: 'f1fa8c' },
    { token: 'keyword', foreground: 'ff79c6', fontStyle: 'bold' },
    { token: 'number', foreground: 'bd93f9' },
    { token: 'type', foreground: '8be9fd' },
    { token: 'class', foreground: '8be9fd' },
    { token: 'interface', foreground: '50fa7b' },
    { token: 'function', foreground: '50fa7b' },
    { token: 'identifier', foreground: 'f8f8f2' },
    { token: 'delimiter', foreground: 'ff79c6' },
  ],
  colors: {
    'editor.background': '#282a36',
    'editor.foreground': '#f8f8f2',
    'editor.lineHighlightBackground': '#44475a40',
    'editorCursor.foreground': '#aeafad',
    'editorWhitespace.foreground': '#6272a4',
    'editorIndentGuide.background': '#424450',
    'editorIndentGuide.activeBackground': '#6272a4',
    'editor.selectionBackground': '#44475a80',
    'editorLineNumber.foreground': '#6272a4',
    'editorLineNumber.activeForeground': '#f8f8f2',
  },
};
