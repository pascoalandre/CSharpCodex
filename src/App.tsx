import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { AcodeHeader } from './components/AcodeHeader';
import { AcodeKeyboardBar } from './components/AcodeKeyboardBar';
import { CodeEditor } from './components/CodeEditor';
import { FileDrawer } from './components/FileDrawer';
import { MobileTerminalView } from './components/MobileTerminalView';
import { InputPromptModal } from './components/InputPromptModal';
import { MoreMenuModal } from './components/MoreMenuModal';
import { UserModal } from './components/UserModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { StorageService } from './services/storageService';
import { CompilerService } from './services/compilerService';
import { Project, User, ThemeMode, ExecutionResult, EditorSettings } from './types';
import { THEMES } from './styles/themes';
import { CSHARP_TEMPLATES } from './data/csharpExamples';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => StorageService.getTheme());
  const styles = THEMES[theme];

  // User & Project state
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [allUsers, setAllUsers] = useState<User[]>(() => StorageService.getUsers());
  const [projects, setProjects] = useState<Project[]>(() => StorageService.getProjects(currentUser.id));

  // Current active project & open tabs
  const [currentProject, setCurrentProject] = useState<Project>(() => {
    const list = StorageService.getProjects(currentUser.id);
    return list.length > 0 ? list[0] : CSHARP_TEMPLATES[0];
  });
  const [openProjects, setOpenProjects] = useState<Project[]>(() => {
    const list = StorageService.getProjects(currentUser.id);
    return list.length > 0 ? [list[0]] : [CSHARP_TEMPLATES[0]];
  });

  const [code, setCode] = useState<string>(() => currentProject.code);
  const [isSaved, setIsSaved] = useState<boolean>(true);

  // Settings
  const [settings, setSettings] = useState<EditorSettings>(() => StorageService.getSettings());

  // Execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [stdinValue, setStdinValue] = useState<string>(() => currentProject.stdinDefault || '');
  const [selectedErrorLine, setSelectedErrorLine] = useState<number | null>(null);

  // UI state & Modals
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState<boolean>(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);

  // Search trigger counter
  const [searchTrigger, setSearchTrigger] = useState<number>(0);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Container refs
  const appContainerRef = useRef<HTMLDivElement | null>(null);
  const autoSaveTimerRef = useRef<any>(null);

  // Apply theme to document body
  useEffect(() => {
    document.body.className = `${styles.appBg} ${styles.textPrimary} antialiased overflow-hidden select-none`;
    StorageService.saveTheme(theme);
  }, [theme, styles]);

  // Reload projects on user change
  useEffect(() => {
    const userProjects = StorageService.getProjects(currentUser.id);
    setProjects(userProjects);
    if (userProjects.length > 0) {
      setCurrentProject(userProjects[0]);
      setOpenProjects([userProjects[0]]);
      setCode(userProjects[0].code);
      setStdinValue(userProjects[0].stdinDefault || '');
    } else {
      const initial = StorageService.createProject(
        currentUser.id,
        'Program.cs',
        CSHARP_TEMPLATES[0].code,
        'Meu programa C#'
      );
      setProjects([initial]);
      setCurrentProject(initial);
      setOpenProjects([initial]);
      setCode(initial.code);
    }
    setIsSaved(true);
  }, [currentUser.id]);

  // Handle Code changes
  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setIsSaved(false);

    if (settings.autoSave && !currentProject.readOnly) {
      if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = setTimeout(() => {
        saveProjectWithCode(newCode);
      }, 2000);
    }
  };

  const saveProjectWithCode = (codeToSave: string) => {
    if (currentProject.readOnly) return;
    const updated = {
      ...currentProject,
      code: codeToSave,
      stdinDefault: stdinValue,
      updatedAt: Date.now(),
    };
    StorageService.updateProject(currentUser.id, updated);
    setCurrentProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setOpenProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setIsSaved(true);
  };

  const handleManualSave = () => {
    if (currentProject.readOnly) {
      const cloned = StorageService.createProject(
        currentUser.id,
        `${currentProject.name} (Meu)`,
        code,
        currentProject.description,
        stdinValue
      );
      const updatedList = StorageService.getProjects(currentUser.id);
      setProjects(updatedList);
      setCurrentProject(cloned);
      setOpenProjects((prev) => [...prev.filter((p) => p.id !== currentProject.id), cloned]);
      setIsSaved(true);
      return;
    }
    saveProjectWithCode(code);
  };

  // Check if C# code requires user input
  const detectNeedsInput = useCallback((c: string) => {
    return /Console\s*\.\s*Read(Line|Key)?\s*\(/.test(c);
  }, []);

  // Primary Run Code trigger
  const handleRunCode = () => {
    if (isRunning) return;

    // If program needs input and stdin is currently empty, show the input dialog automatically!
    if (detectNeedsInput(code) && !stdinValue.trim()) {
      setIsInputModalOpen(true);
      return;
    }

    executeCodeWithInput(stdinValue);
  };

  // Actual backend execution call
  const executeCodeWithInput = async (inputToSend: string) => {
    setIsRunning(true);
    setSelectedErrorLine(null);
    setIsTerminalOpen(true); // Open terminal output view

    try {
      const data: ExecutionResult = await CompilerService.compileAndRun(
        code,
        inputToSend,
        8000
      );
      setExecutionResult(data);

      if (data.success && data.exitCode === 0) {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#007acc', '#10b981', '#bd93f9', '#f59e0b'],
        });
        StorageService.incrementCompilationCount(currentUser.id);
        setCurrentUser(StorageService.getCurrentUser());
      }
    } catch (err: any) {
      setExecutionResult({
        success: false,
        phase: 'run',
        stdout: '',
        stderr: `Erro de comunicação: ${err.message || 'Falha ao conectar ao servidor'}`,
        exitCode: 1,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // When user submits input from the modal
  const handleInputModalSubmit = (input: string) => {
    setStdinValue(input);
    setIsInputModalOpen(false);
    executeCodeWithInput(input);
  };

  // Quick symbol bar insertion
  const handleInsertSymbol = (symbol: string) => {
    setCode((prev) => prev + symbol);
    setIsSaved(false);
  };

  // Fullscreen Toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      appContainerRef.current?.requestFullscreen().catch(() => {
        setIsFullscreen(true);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleRunCode();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
      } else if (e.key === 'F11') {
        e.preventDefault();
        handleToggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, stdinValue, isRunning]);

  // Select project / Tab switching
  const handleSelectProject = (project: Project) => {
    if (!isSaved && !currentProject.readOnly) {
      saveProjectWithCode(code);
    }
    setCurrentProject(project);
    setCode(project.code);
    setStdinValue(project.stdinDefault || '');
    setIsSaved(true);

    // Ensure it exists in openProjects tabs
    setOpenProjects((prev) => {
      if (prev.some((p) => p.id === project.id)) return prev;
      return [...prev, project];
    });
  };

  // Close a project tab
  const handleCloseProjectTab = (id: string) => {
    if (openProjects.length <= 1) return; // Keep at least one tab open
    const remaining = openProjects.filter((p) => p.id !== id);
    setOpenProjects(remaining);

    // If active tab was closed, switch to the last remaining tab
    if (currentProject.id === id) {
      const nextActive = remaining[remaining.length - 1];
      setCurrentProject(nextActive);
      setCode(nextActive.code);
      setStdinValue(nextActive.stdinDefault || '');
      setIsSaved(true);
    }
  };

  // Create new project
  const handleCreateProject = () => {
    const num = projects.length + 1;
    const newProj = StorageService.createProject(
      currentUser.id,
      `Programa_${num}.cs`,
      `using System;\n\nnamespace CodexApp\n{\n    internal class Program\n    {\n        static void Main(string[] args)\n        {\n            Console.WriteLine("Olá do C# Codex!");\n        }\n    }\n}\n`,
      'Novo código C#'
    );
    const updated = StorageService.getProjects(currentUser.id);
    setProjects(updated);
    setCurrentProject(newProj);
    setOpenProjects((prev) => [...prev, newProj]);
    setCode(newProj.code);
    setStdinValue('');
    setIsSaved(true);
  };

  // Duplicate project
  const handleDuplicateProject = (project: Project) => {
    const duplicated = StorageService.createProject(
      currentUser.id,
      `${project.name.replace('.cs', '')}_copia.cs`,
      project.code,
      project.description,
      project.stdinDefault
    );
    const updated = StorageService.getProjects(currentUser.id);
    setProjects(updated);
    setOpenProjects((prev) => [...prev, duplicated]);
    setCurrentProject(duplicated);
    setCode(duplicated.code);
    setIsSaved(true);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    StorageService.toggleFavorite(currentUser.id, id);
    setProjects(StorageService.getProjects(currentUser.id));
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    StorageService.deleteProject(currentUser.id, id);
    const updated = StorageService.getProjects(currentUser.id);
    setProjects(updated);

    // Remove from open tabs
    const remainingOpen = openProjects.filter((p) => p.id !== id);
    if (currentProject.id === id) {
      if (remainingOpen.length > 0) {
        const next = remainingOpen[0];
        setOpenProjects(remainingOpen);
        setCurrentProject(next);
        setCode(next.code);
      } else if (updated.length > 0) {
        setOpenProjects([updated[0]]);
        setCurrentProject(updated[0]);
        setCode(updated[0].code);
      } else {
        const fresh = StorageService.createProject(
          currentUser.id,
          'Program.cs',
          CSHARP_TEMPLATES[0].code,
          'Meu programa'
        );
        setProjects([fresh]);
        setOpenProjects([fresh]);
        setCurrentProject(fresh);
        setCode(fresh.code);
      }
    } else {
      setOpenProjects(remainingOpen);
    }
  };

  // Select template
  const handleSelectTemplate = (template: Project) => {
    const imported = StorageService.createProject(
      currentUser.id,
      template.name,
      template.code,
      template.description,
      template.stdinDefault
    );
    setProjects(StorageService.getProjects(currentUser.id));
    setOpenProjects((prev) => [...prev, imported]);
    setCurrentProject(imported);
    setCode(imported.code);
    setStdinValue(imported.stdinDefault || '');
    setIsSaved(true);
  };

  // File import (.cs / .txt)
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = StorageService.createProject(
        currentUser.id,
        file.name,
        content,
        `Importado em ${new Date().toLocaleDateString()}`
      );
      setProjects(StorageService.getProjects(currentUser.id));
      setOpenProjects((prev) => [...prev, imported]);
      setCurrentProject(imported);
      setCode(imported.code);
      setIsSaved(true);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Export all backup
  const handleExportAllData = () => {
    const backup = {
      user: currentUser,
      projects: StorageService.getProjects(currentUser.id),
      exportDate: new Date().toISOString(),
      platform: 'C# Codex Mobile Editor',
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `csharp_codex_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      ref={appContainerRef}
      className={`h-screen w-screen flex flex-col overflow-hidden relative ${styles.appBg}`}
    >
      {/* 1. Exact Acode / Mobile Code Editor 2-Row Top Navigation */}
      <AcodeHeader
        currentProject={currentProject}
        openProjects={openProjects}
        onSelectProject={handleSelectProject}
        onCloseProjectTab={handleCloseProjectTab}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        onNewFile={handleCreateProject}
        onSave={handleManualSave}
        onRun={handleRunCode}
        onSearch={() => setSearchTrigger((prev) => prev + 1)}
        onOpenMoreMenu={() => setIsMoreMenuOpen(true)}
        isRunning={isRunning}
        isSaved={isSaved}
        theme={theme}
      />

      {/* 2. Main Editor Viewport (Clean edge-to-edge, NO bottom navigation bar) */}
      <div className="flex-1 flex flex-col min-h-0 relative overflow-hidden">
        <CodeEditor
          code={code}
          onChange={handleCodeChange}
          theme={theme}
          settings={settings}
          errors={executionResult?.errors || []}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          selectedErrorLine={selectedErrorLine}
          searchTrigger={searchTrigger}
        />
      </div>

      {/* 3. Exact 2-Row Bottom Accessory Keyboard Bar matching reference screenshot */}
      <AcodeKeyboardBar onInsert={handleInsertSymbol} theme={theme} />

      {/* 4. Sliding File & Templates Drawer */}
      <FileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        projects={projects}
        currentProjectId={currentProject.id}
        onSelectProject={handleSelectProject}
        onCreateProject={handleCreateProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
        onToggleFavorite={handleToggleFavorite}
        onSelectTemplate={handleSelectTemplate}
        onImportFile={handleImportFile}
        onExportAllData={handleExportAllData}
        currentUser={currentUser}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        theme={theme}
      />

      {/* 5. Terminal & Output Sheet / View Overlay */}
      {isTerminalOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-black/70 backdrop-blur-xs select-none">
          <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
            <MobileTerminalView
              executionResult={executionResult}
              isRunning={isRunning}
              theme={theme}
              stdinValue={stdinValue}
              onClearOutput={() => setExecutionResult(null)}
              onSendInput={(val) => {
                setStdinValue(val);
                executeCodeWithInput(val);
              }}
              onOpenInputModal={() => setIsInputModalOpen(true)}
              onSelectErrorLine={(line) => {
                setSelectedErrorLine(line);
                setIsTerminalOpen(false);
              }}
              onBackToEditor={() => setIsTerminalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* 6. More Options Modal [•••] */}
      <MoreMenuModal
        isOpen={isMoreMenuOpen}
        onClose={() => setIsMoreMenuOpen(false)}
        onOpenTerminal={() => setIsTerminalOpen(true)}
        theme={theme}
        onThemeChange={setTheme}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenInputModal={() => setIsInputModalOpen(true)}
        onOpenShortcuts={() => setIsShortcutsModalOpen(true)}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        onOpenDrawerTemplates={() => {
          setIsDrawerOpen(true);
        }}
        onExportAll={handleExportAllData}
        currentUser={currentUser}
      />

      {/* 7. Input Prompt Modal (when program requests Console.ReadLine with empty stdin) */}
      <InputPromptModal
        isOpen={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
        onSubmit={handleInputModalSubmit}
        initialValue={stdinValue}
        theme={theme}
      />

      {/* 8. User Management Modal */}
      <UserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={(id) => {
          StorageService.setCurrentUser(id);
          setCurrentUser(StorageService.getCurrentUser());
        }}
        onCreateUser={(usr, name, email) => {
          const created = StorageService.createUser(usr, name, email);
          setAllUsers(StorageService.getUsers());
          setCurrentUser(created);
        }}
        theme={theme}
      />

      {/* 9. Keyboard Shortcuts Reference Modal */}
      <ShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
        theme={theme}
      />
    </div>
  );
}
