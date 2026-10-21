import { Project, User, ThemeMode, EditorSettings } from '../types';
import { CSHARP_TEMPLATES } from '../data/csharpExamples';

const STORAGE_USERS_KEY = 'codex_users_v1';
const STORAGE_CURRENT_USER_KEY = 'codex_current_user_v1';
const STORAGE_PROJECTS_KEY = 'codex_projects_v1';
const STORAGE_THEME_KEY = 'codex_theme_v1';
const STORAGE_SETTINGS_KEY = 'codex_settings_v1';

export const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 4,
  wordWrap: 'on',
  minimap: false,
  lineNumbers: 'on',
  autoSave: true,
};

export const INITIAL_USER: User = {
  id: 'usr_codex_default',
  username: 'desenvolvedor',
  displayName: 'Dev Codex',
  email: 'dev@codex.net',
  bio: 'Desenvolvedor C# & Arquiteto de Software',
  avatarSeed: 'codex-master',
  createdAt: 1700000000000,
  totalCompilations: 12,
};

export const StorageService = {
  // --- USERS ---
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      if (!data) {
        this.saveUsers([INITIAL_USER]);
        return [INITIAL_USER];
      }
      return JSON.parse(data);
    } catch {
      return [INITIAL_USER];
    }
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  },

  getCurrentUser(): User {
    try {
      const id = localStorage.getItem(STORAGE_CURRENT_USER_KEY);
      const users = this.getUsers();
      const found = users.find((u) => u.id === id);
      if (found) return found;
      this.setCurrentUser(INITIAL_USER.id);
      return INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  },

  setCurrentUser(userId: string): void {
    localStorage.setItem(STORAGE_CURRENT_USER_KEY, userId);
  },

  createUser(username: string, displayName: string, email: string): User {
    const users = this.getUsers();
    const newUser: User = {
      id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      username: username.trim().toLowerCase(),
      displayName: displayName.trim(),
      email: email.trim(),
      bio: 'Entusiasta C# no C# Codex',
      avatarSeed: username.trim().toLowerCase(),
      createdAt: Date.now(),
      totalCompilations: 0,
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser.id);
    return newUser;
  },

  updateUser(updated: User): void {
    const users = this.getUsers().map((u) => (u.id === updated.id ? updated : u));
    this.saveUsers(users);
  },

  incrementCompilationCount(userId: string): void {
    const users = this.getUsers();
    const target = users.find((u) => u.id === userId);
    if (target) {
      target.totalCompilations = (target.totalCompilations || 0) + 1;
      this.saveUsers(users);
    }
  },

  // --- PROJECTS ---
  getProjects(userId: string): Project[] {
    try {
      const data = localStorage.getItem(`${STORAGE_PROJECTS_KEY}_${userId}`);
      if (!data) {
        // First time user: provide initial starter projects copied from templates
        const initialUserProjects: Project[] = [
          {
            ...CSHARP_TEMPLATES[0],
            id: 'proj_starter_' + userId,
            userId,
            readOnly: false,
            name: 'Meu Primeiro Programa.cs',
            isFavorite: true,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            ...CSHARP_TEMPLATES[2],
            id: 'proj_matrizes_' + userId,
            userId,
            readOnly: false,
            name: 'Calculadora de Matrizes.cs',
            isFavorite: false,
            createdAt: Date.now() - 3600000,
            updatedAt: Date.now() - 3600000,
          },
        ];
        this.saveProjects(userId, initialUserProjects);
        return initialUserProjects;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveProjects(userId: string, projects: Project[]): void {
    localStorage.setItem(`${STORAGE_PROJECTS_KEY}_${userId}`, JSON.stringify(projects));
  },

  createProject(
    userId: string,
    name: string,
    initialCode?: string,
    description?: string,
    stdinDefault?: string
  ): Project {
    const projects = this.getProjects(userId);
    const fileName = name.endsWith('.cs') ? name : `${name}.cs`;
    const defaultTemplateCode = initialCode || `using System;

namespace CodexApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Olá do novo projeto C# Codex!");
        }
    }
}`;

    const newProject: Project = {
      id: 'proj_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      name: fileName,
      description: description || 'Projeto C# criado no editor C# Codex',
      code: defaultTemplateCode,
      stdinDefault: stdinDefault || '',
      category: 'usuario',
      tags: ['C#', 'Código'],
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isFavorite: false,
    };

    projects.unshift(newProject);
    this.saveProjects(userId, projects);
    return newProject;
  },

  updateProject(userId: string, updated: Project): void {
    const projects = this.getProjects(userId);
    const idx = projects.findIndex((p) => p.id === updated.id);
    if (idx !== -1) {
      projects[idx] = { ...updated, updatedAt: Date.now() };
    } else {
      projects.unshift({ ...updated, updatedAt: Date.now() });
    }
    this.saveProjects(userId, projects);
  },

  deleteProject(userId: string, projectId: string): void {
    const projects = this.getProjects(userId).filter((p) => p.id !== projectId);
    this.saveProjects(userId, projects);
  },

  toggleFavorite(userId: string, projectId: string): boolean {
    const projects = this.getProjects(userId);
    const proj = projects.find((p) => p.id === projectId);
    if (proj) {
      proj.isFavorite = !proj.isFavorite;
      this.saveProjects(userId, projects);
      return proj.isFavorite;
    }
    return false;
  },

  // --- THEME & SETTINGS ---
  getTheme(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_THEME_KEY);
    if (stored === 'dracula' || stored === 'vs-light' || stored === 'vs-dark') {
      return stored;
    }
    return 'vs-dark';
  },

  saveTheme(theme: ThemeMode): void {
    localStorage.setItem(STORAGE_THEME_KEY, theme);
  },

  getSettings(): EditorSettings {
    try {
      const stored = localStorage.getItem(STORAGE_SETTINGS_KEY);
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: EditorSettings): void {
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  },
};
