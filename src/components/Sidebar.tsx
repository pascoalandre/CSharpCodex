import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  Star,
  FileCode,
  Download,
  Upload,
  Search,
  Check,
  ChevronRight,
  Sparkles,
  BookOpen,
  Terminal,
  Calculator,
  Grid,
  Layers,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { Project, ThemeMode, User, EditorSettings } from '../types';
import { CSHARP_TEMPLATES } from '../data/csharpExamples';
import { THEMES } from '../styles/themes';
import { ActivityTab } from './ActivityBar';

interface SidebarProps {
  activeTab: ActivityTab | null;
  onClose: () => void;
  theme: ThemeMode;
  projects: Project[];
  currentProject: Project;
  onSelectProject: (project: Project) => void;
  onCreateProject: () => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (project: Project) => void;
  onToggleFavorite: (id: string) => void;
  onLoadTemplate: (template: Project) => void;
  onInsertSnippet: (snippetCode: string) => void;
  settings: EditorSettings;
  onUpdateSettings: (s: EditorSettings) => void;
  currentUser: User;
  onOpenUserModal: () => void;
  onImportFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExportAllData: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  theme,
  projects,
  currentProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onDuplicateProject,
  onToggleFavorite,
  onLoadTemplate,
  onInsertSnippet,
  settings,
  onUpdateSettings,
  currentUser,
  onOpenUserModal,
  onImportFile,
  onExportAllData,
}) => {
  const styles = THEMES[theme];
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFavoriteOnly, setFilterFavoriteOnly] = useState(false);

  if (!activeTab) return null;

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
    if (filterFavoriteOnly) return matchesSearch && p.isFavorite;
    return matchesSearch;
  });

  const SNIPPETS = [
    {
      title: 'Console.WriteLine formatado',
      desc: 'Impressão interpolada com data',
      code: `Console.WriteLine($"[INFO] Executado em: {DateTime.Now:HH:mm:ss} | Status: OK");\n`,
    },
    {
      title: 'Console.ReadLine com TryParse',
      desc: 'Leitura segura de número do teclado',
      code: `Console.Write("Digite um número: ");\nif (int.TryParse(Console.ReadLine(), out int valor))\n{\n    Console.WriteLine($"Valor lido com sucesso: {valor}");\n}\nelse\n{\n    Console.WriteLine("Entrada inválida!");\n}\n`,
    },
    {
      title: 'Vetor & Laço Foreach',
      desc: 'Inicialização e iteração de array',
      code: `int[] numeros = { 10, 20, 30, 40, 50 };\nforeach (int n in numeros)\n{\n    Console.WriteLine($"Elemento: {n}");\n}\n`,
    },
    {
      title: 'Matriz 2D (Grid 3x3)',
      desc: 'Criação e exibição em grade',
      code: `int[,] matriz = new int[3, 3];\nfor (int i = 0; i < 3; i++)\n{\n    for (int j = 0; j < 3; j++)\n    {\n        matriz[i, j] = (i + 1) * (j + 1);\n        Console.Write($"{matriz[i, j],4} ");\n    }\n    Console.WriteLine();\n}\n`,
    },
    {
      title: 'System.Numerics.BigInteger',
      desc: 'Cálculo de números gigantes sem overflow',
      code: `using System.Numerics;\n\nBigInteger valorGigante = BigInteger.Pow(2, 64);\nConsole.WriteLine($"2^64 = {valorGigante}");\n`,
    },
    {
      title: 'Benchmark Stopwatch',
      desc: 'Medição precisa de tempo em ms',
      code: `var sw = System.Diagnostics.Stopwatch.StartNew();\n// seu algoritmo aqui...\nsw.Stop();\nConsole.WriteLine($"Tempo decorrido: {sw.ElapsedMilliseconds} ms");\n`,
    },
    {
      title: 'Consulta LINQ (Where & OrderBy)',
      desc: 'Filtro e ordenação de coleção',
      code: `var itens = new List<int> { 5, 12, 8, 20, 3, 15 };\nvar filtrados = itens.Where(x => x > 10).OrderBy(x => x);\nConsole.WriteLine("Maiores que 10: " + string.Join(", ", filtrados));\n`,
    },
    {
      title: 'Tratamento Try-Catch-Finally',
      desc: 'Captura segura de exceções',
      code: `try\n{\n    // bloco suscetível a erros\n}\ncatch (Exception ex)\n{\n    Console.WriteLine($"Erro capturado: {ex.Message}");\n}\nfinally\n{\n    Console.WriteLine("Finalização concluída.");\n}\n`,
    },
  ];

  return (
    <div
      className={`w-64 md:w-72 h-full flex flex-col border-r shrink-0 select-none ${styles.sidebarBg} ${styles.borderColor}`}
    >
      {/* 1. EXPLORER TAB */}
      {activeTab === 'explorer' && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-3 border-b border-neutral-700/30 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Explorador de Projetos
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={onCreateProject}
                title="Criar Novo Arquivo C#"
                className="p-1 rounded hover:bg-white/10 text-neutral-300 hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                title="Importar arquivo .cs do computador"
                className="p-1 rounded hover:bg-white/10 text-neutral-300 hover:text-white"
              >
                <Upload className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".cs,.txt"
                className="hidden"
                onChange={onImportFile}
              />
            </div>
          </div>

          {/* Search & Filter */}
          <div className="p-2 border-b border-neutral-700/20 flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                placeholder="Filtrar projetos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-7 pr-2 py-1 text-xs rounded border outline-none font-sans ${styles.inputBg} ${styles.borderColor} ${styles.textPrimary}`}
              />
            </div>
            <button
              onClick={() => setFilterFavoriteOnly(!filterFavoriteOnly)}
              title={filterFavoriteOnly ? 'Mostrar todos' : 'Mostrar apenas favoritos'}
              className={`p-1.5 rounded text-xs border ${
                filterFavoriteOnly
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'text-neutral-400 border-neutral-700 hover:text-neutral-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            <div className="px-2 py-1 text-[10px] uppercase font-semibold text-neutral-500 flex items-center justify-between">
              <span>Meus Códigos ({filteredProjects.length})</span>
              <span>{currentUser.username}</span>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-4 text-center text-xs text-neutral-500">
                Nenhum projeto encontrado.{' '}
                <button
                  onClick={onCreateProject}
                  className="text-[#007acc] hover:underline block mt-1 mx-auto"
                >
                  Criar primeiro código
                </button>
              </div>
            ) : (
              filteredProjects.map((p) => {
                const isSelected = p.id === currentProject.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject(p)}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#007acc]/20 text-[#3894df] font-medium border border-[#007acc]/30'
                        : 'text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                      <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#3894df]' : 'text-neutral-400'}`} />
                      <span className="truncate font-mono text-[12px]">{p.name}</span>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(p.id);
                        }}
                        title={p.isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
                        className={`p-1 rounded hover:bg-white/10 ${p.isFavorite ? 'text-amber-400' : 'text-neutral-400'}`}
                      >
                        <Star className={`w-3 h-3 ${p.isFavorite ? 'fill-current' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateProject(p);
                        }}
                        title="Duplicar projeto"
                        className="p-1 rounded hover:bg-white/10 text-neutral-400 hover:text-white"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Deseja realmente excluir "${p.name}"?`)) {
                            onDeleteProject(p.id);
                          }
                        }}
                        title="Excluir projeto"
                        className="p-1 rounded hover:bg-red-500/20 text-neutral-400 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Storage Footer */}
          <div className="p-2 border-t border-neutral-700/30 text-[11px] flex items-center justify-between text-neutral-400">
            <span>Armazenamento local</span>
            <button
              onClick={onExportAllData}
              title="Baixar backup de todos os projetos em JSON"
              className="text-[#007acc] hover:underline flex items-center gap-1"
            >
              <Download className="w-3 h-3" />
              Backup
            </button>
          </div>
        </div>
      )}

      {/* 2. TEMPLATES TAB */}
      {activeTab === 'templates' && (
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-neutral-700/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Modelos Prontos de C#
            </span>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Exemplos funcionais para estudo, algoritmos e testes
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {CSHARP_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => onLoadTemplate(tpl)}
                className={`p-2.5 rounded border border-neutral-700/40 hover:border-[#007acc]/60 transition-all cursor-pointer group ${styles.cardBg}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <h4 className="text-xs font-semibold text-neutral-200 group-hover:text-[#3894df] transition-colors leading-tight">
                    {tpl.name}
                  </h4>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#3894df] shrink-0 mt-0.5" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="flex flex-wrap items-center gap-1.5 mt-2 text-[10px] text-neutral-400">
                  {tpl.tags.map((tag) => (
                    <span key={tag} className="text-neutral-400">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SNIPPETS TAB */}
      {activeTab === 'snippets' && (
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-neutral-700/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Snippets Rápidos de Código
            </span>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Clique para inserir blocos úteis de C# no editor
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {SNIPPETS.map((snip, index) => (
              <div
                key={index}
                onClick={() => onInsertSnippet(snip.code)}
                className={`p-2.5 rounded border border-neutral-700/30 hover:border-emerald-500/50 transition-all cursor-pointer group ${styles.cardBg}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200 group-hover:text-emerald-400">
                    {snip.title}
                  </span>
                  <Plus className="w-3.5 h-3.5 text-neutral-500 group-hover:text-emerald-400" />
                </div>
                <p className="text-[11px] text-neutral-400 mt-0.5">{snip.desc}</p>
                <div className="mt-1.5 p-1.5 rounded bg-black/40 font-mono text-[10px] text-neutral-300 truncate">
                  {snip.code.split('\n')[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CHEAT SHEET TAB */}
      {activeTab === 'cheatsheet' && (
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-neutral-700/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Guia & Cheat Sheet C#
            </span>
            <p className="text-[11px] text-neutral-500 mt-0.5">
              Sintaxe, tipos primitivos e funções nativas
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-3 text-xs text-neutral-300 font-sans">
            <div className="p-2 rounded bg-black/30 border border-neutral-700/30">
              <span className="text-[11px] font-bold text-blue-400 block mb-1">
                Tipos Numéricos
              </span>
              <ul className="space-y-0.5 text-[11px] font-mono text-neutral-400">
                <li><span className="text-emerald-400">int</span> : 32 bits (-2 bilhões a +2 bilhões)</li>
                <li><span className="text-emerald-400">long</span> : 64 bits para números grandes</li>
                <li><span className="text-emerald-400">double</span> : Ponto flutuante 64 bits</li>
                <li><span className="text-emerald-400">decimal</span> : 128 bits alta precisão financeira</li>
                <li><span className="text-purple-400">BigInteger</span> : Precisão arbitrária infinita</li>
              </ul>
            </div>

            <div className="p-2 rounded bg-black/30 border border-neutral-700/30">
              <span className="text-[11px] font-bold text-amber-400 block mb-1">
                Vetores e Matrizes
              </span>
              <div className="font-mono text-[11px] text-neutral-400 space-y-1">
                <p><span className="text-blue-400">int[]</span> v = new int[10];</p>
                <p><span className="text-blue-400">int[,]</span> m = new int[3, 3]; // Matriz 2D</p>
                <p><span className="text-blue-400">int[][]</span> jag = new int[3][]; // Matriz irregular</p>
                <p>Array.Sort(v); Array.Reverse(v);</p>
              </div>
            </div>

            <div className="p-2 rounded bg-black/30 border border-neutral-700/30">
              <span className="text-[11px] font-bold text-emerald-400 block mb-1">
                Entrada e Saída (I/O)
              </span>
              <div className="font-mono text-[11px] text-neutral-400 space-y-1">
                <p>{'Console.WriteLine($"Olá {nome}");'}</p>
                <p>string s = Console.ReadLine();</p>
                <p>int x = int.Parse(s);</p>
                <p>double.TryParse(s, out double d);</p>
              </div>
            </div>

            <div className="p-2 rounded bg-black/30 border border-neutral-700/30">
              <span className="text-[11px] font-bold text-purple-400 block mb-1">
                LINQ Essencial
              </span>
              <div className="font-mono text-[11px] text-neutral-400 space-y-1">
                <p>.Where(x =&gt; x &gt; 0)</p>
                <p>.Select(x =&gt; x * 2)</p>
                <p>.OrderByDescending(x =&gt; x)</p>
                <p>.GroupBy(x =&gt; x.Categoria)</p>
                <p>.Sum(), .Average(), .Count()</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-neutral-700/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Configurações do Editor
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
            {/* Font Size */}
            <div>
              <label className="text-neutral-400 block mb-1.5 font-medium">
                Tamanho da Fonte ({settings.fontSize}px)
              </label>
              <div className="flex items-center gap-1.5">
                {[12, 14, 16, 18, 20].map((size) => (
                  <button
                    key={size}
                    onClick={() => onUpdateSettings({ ...settings, fontSize: size })}
                    className={`flex-1 py-1 text-center font-mono rounded border ${
                      settings.fontSize === size
                        ? 'bg-[#007acc] text-white border-[#007acc]'
                        : 'border-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Size */}
            <div>
              <label className="text-neutral-400 block mb-1.5 font-medium">
                Tamanho da Indentação (Tab)
              </label>
              <div className="flex items-center gap-1.5">
                {[2, 4].map((size) => (
                  <button
                    key={size}
                    onClick={() => onUpdateSettings({ ...settings, tabSize: size })}
                    className={`flex-1 py-1 text-center font-mono rounded border ${
                      settings.tabSize === size
                        ? 'bg-[#007acc] text-white border-[#007acc]'
                        : 'border-neutral-700 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {size} espaços
                  </button>
                ))}
              </div>
            </div>

            {/* Minimap */}
            <div className="flex items-center justify-between py-2 border-t border-neutral-700/20">
              <span className="text-neutral-300">Minimapa de Código</span>
              <button
                onClick={() => onUpdateSettings({ ...settings, minimap: !settings.minimap })}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  settings.minimap ? 'bg-[#007acc]' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.minimap ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Word Wrap */}
            <div className="flex items-center justify-between py-2 border-t border-neutral-700/20">
              <span className="text-neutral-300">Quebra de Linha (Word Wrap)</span>
              <button
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    wordWrap: settings.wordWrap === 'on' ? 'off' : 'on',
                  })
                }
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  settings.wordWrap === 'on' ? 'bg-[#007acc]' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.wordWrap === 'on' ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between py-2 border-t border-neutral-700/20">
              <span className="text-neutral-300">Salvamento Automático</span>
              <button
                onClick={() => onUpdateSettings({ ...settings, autoSave: !settings.autoSave })}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  settings.autoSave ? 'bg-[#007acc]' : 'bg-neutral-700'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.autoSave ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. USER & ACCOUNT TAB */}
      {activeTab === 'user' && (
        <div className="flex flex-col h-full">
          <div className="p-3 border-b border-neutral-700/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Perfil & Armazenamento
            </span>
          </div>

          <div className="p-3 flex flex-col items-center text-center border-b border-neutral-700/20">
            <img
              src="/src/assets/images/avatar_engineer_user_1792569766320.jpg"
              alt={currentUser.displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#007acc] shadow-md"
            />
            <h3 className="text-sm font-semibold text-white mt-2">{currentUser.displayName}</h3>
            <span className="text-[11px] text-neutral-400 font-mono">@{currentUser.username}</span>
            <p className="text-xs text-neutral-400 mt-1 px-2">{currentUser.bio}</p>

            <button
              onClick={onOpenUserModal}
              className="mt-3 px-3 py-1.5 rounded text-xs bg-[#007acc] hover:bg-[#0062a3] text-white font-medium flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              Trocar ou Criar Usuário
            </button>
          </div>

          <div className="p-3 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Projetos salvos:</span>
              <span className="text-white font-bold">{projects.length}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Compilações realizadas:</span>
              <span className="text-emerald-400 font-bold">{currentUser.totalCompilations}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Status do Compilador:</span>
              <span className="text-emerald-400 font-medium">Mono C# Ativo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
