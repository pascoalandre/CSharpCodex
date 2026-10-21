export type ThemeMode = 'vs-dark' | 'dracula' | 'vs-light';

export interface CompileError {
  line: number;
  column: number;
  severity: 'error' | 'warning';
  code: string;
  message: string;
}

export interface ExecutionResult {
  success: boolean;
  phase: 'compile' | 'run' | 'idle';
  compileTimeMs?: number;
  executionTimeMs?: number;
  stdout: string;
  stderr: string;
  exitCode?: number | null;
  timedOut?: boolean;
  errors?: CompileError[];
  message?: string;
  timestamp?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  code: string;
  stdinDefault?: string;
  category: 'basico' | 'entrada' | 'matrizes' | 'matematica' | 'poo' | 'algoritmos' | 'usuario';
  tags: string[];
  userId: string;
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
  readOnly?: boolean;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  bio?: string;
  avatarSeed?: string;
  createdAt: number;
  totalCompilations: number;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off';
  minimap: boolean;
  lineNumbers: 'on' | 'off';
  autoSave: boolean;
}
