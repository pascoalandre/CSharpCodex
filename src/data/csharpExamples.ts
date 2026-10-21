import { Project } from '../types';

export const CSHARP_TEMPLATES: Project[] = [
  {
    id: 'tpl-ola-mundo',
    name: '01. Olá Mundo & Tipos Fundamentais',
    description: 'Apresentação básica do C#, interpolação de strings, tipos primitivos e formatação no terminal.',
    category: 'basico',
    tags: ['Iniciante', 'Console', 'Sintaxe'],
    userId: 'system',
    createdAt: 1700000000000,
    updatedAt: 1700000000000,
    readOnly: true,
    code: `using System;

namespace CodexApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("========================================");
            Console.WriteLine("      C# CODEX — ANDROID EDITION        ");
            Console.WriteLine("========================================");

            string dev = "Desenvolvedor Mobile";
            int versao = 10;
            double precisao = 99.95;
            DateTime agora = DateTime.Now;

            Console.WriteLine($"Dispositivo  : Celular Android (App Mobile)");
            Console.WriteLine($"Desenvolvedor: {dev}");
            Console.WriteLine($"Compilador   : Mono C# {versao}");
            Console.WriteLine($"Precisão     : {precisao:F2}%");
            Console.WriteLine($"Data e Hora  : {agora:dd/MM/yyyy HH:mm:ss}");

            Console.WriteLine("\\n[✓] Ambiente pronto para compilar qualquer código C#!");
        }
    }
}`,
  },
  {
    id: 'tpl-entrada-dados',
    name: '02. Entrada de Dados Interativa (Console.ReadLine)',
    description: 'Leitura interativa do teclado via caixa de texto com parsing de nome, idade e cálculo de IMC.',
    category: 'entrada',
    tags: ['Console.ReadLine', 'Input', 'Teclado', 'IMC'],
    userId: 'system',
    createdAt: 1700000000001,
    updatedAt: 1700000000001,
    readOnly: true,
    stdinDefault: `Maria Clara\n22\n1.68\n58.5`,
    code: `using System;
using System.Globalization;

namespace CodexApp
{
    class Program
    {
        static void Main(string[] args)
        {
            var cultura = CultureInfo.InvariantCulture;

            Console.WriteLine("========================================");
            Console.WriteLine("     LEITURA INTERATIVA DE ENTRADA      ");
            Console.WriteLine("========================================");

            // 1. Leitura do Nome
            Console.Write("Digite o seu nome completo: ");
            string nome = Console.ReadLine();
            if (string.IsNullOrWhiteSpace(nome)) nome = "Usuário Mobile";
            Console.WriteLine(nome);

            // 2. Leitura da Idade
            Console.Write("Digite a sua idade: ");
            string rawIdade = Console.ReadLine();
            Console.WriteLine(rawIdade);
            if (!int.TryParse(rawIdade, out int idade)) idade = 25;

            // 3. Leitura da Altura
            Console.Write("Digite a sua altura em metros (ex: 1.75): ");
            string rawAltura = Console.ReadLine();
            Console.WriteLine(rawAltura);
            if (!double.TryParse(rawAltura?.Replace(',', '.'), NumberStyles.Any, cultura, out double altura)) altura = 1.75;

            // 4. Leitura do Peso
            Console.Write("Digite o seu peso em kg (ex: 70.5): ");
            string rawPeso = Console.ReadLine();
            Console.WriteLine(rawPeso);
            if (!double.TryParse(rawPeso?.Replace(',', '.'), NumberStyles.Any, cultura, out double peso)) peso = 70.0;

            // Cálculo do IMC
            double imc = altura > 0 ? peso / (altura * altura) : 0;

            Console.WriteLine("\\n================ RELATÓRIO FINAL ================");
            Console.WriteLine($"Nome    : {nome}");
            Console.WriteLine($"Idade   : {idade} anos");
            Console.WriteLine($"Altura  : {altura:F2} m");
            Console.WriteLine($"Peso    : {peso:F1} kg");
            Console.WriteLine($"IMC     : {imc:F2}");

            string status = imc < 18.5 ? "Abaixo do peso" : (imc <= 24.9 ? "Peso normal" : "Sobrepeso");
            Console.WriteLine($"Situação: {status}");
            Console.WriteLine("\\n[✓] Entrada de dados processada com sucesso!");
        }
    }
}`,
  },
  {
    id: 'tpl-vetores-matrizes',
    name: '03. Vetores, Matrizes e Álgebra Linear',
    description: 'Manipulação de vetores, ordenação e cálculo de matriz 2D (soma e multiplicação).',
    category: 'matrizes',
    tags: ['Arrays', 'Matriz 2D', 'Vetores', 'Álgebra'],
    userId: 'system',
    createdAt: 1700000000002,
    updatedAt: 1700000000002,
    readOnly: true,
    code: `using System;

namespace CodexApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== VETORES E MATRIZES EM C# ===\\n");

            // 1. Vetor Unidimensional
            int[] vetor = { 45, 12, 89, 23, 7, 56, 91, 3 };
            Console.WriteLine("1. Vetor Original:");
            Console.WriteLine("[ " + string.Join(", ", vetor) + " ]");

            Array.Sort(vetor);
            Console.WriteLine("\\n2. Vetor Ordenado (Array.Sort):");
            Console.WriteLine("[ " + string.Join(", ", vetor) + " ]");

            // 2. Matrizes Bidimensionais 2x2
            int[,] matrizA = { { 2, 4 }, { 6, 8 } };
            int[,] matrizB = { { 1, 3 }, { 5, 7 } };

            Console.WriteLine("\\n3. Matriz A (2x2):");
            ImprimirMatriz(matrizA);

            Console.WriteLine("\\n4. Matriz B (2x2):");
            ImprimirMatriz(matrizB);

            // Soma das Matrizes
            Console.WriteLine("\\n5. Matriz Soma (A + B):");
            int[,] soma = new int[2, 2];
            for (int i = 0; i < 2; i++)
            {
                for (int j = 0; j < 2; j++)
                {
                    soma[i, j] = matrizA[i, j] + matrizB[i, j];
                }
            }
            ImprimirMatriz(soma);

            // Multiplicação de Matrizes
            Console.WriteLine("\\n6. Produto (A x B):");
            int[,] prod = new int[2, 2];
            for (int i = 0; i < 2; i++)
            {
                for (int j = 0; j < 2; j++)
                {
                    prod[i, j] = matrizA[i, 0] * matrizB[0, j] + matrizA[i, 1] * matrizB[1, j];
                }
            }
            ImprimirMatriz(prod);

            Console.WriteLine("\\n[✓] Operações matriciais calculadas com sucesso!");
        }

        static void ImprimirMatriz(int[,] m)
        {
            for (int i = 0; i < m.GetLength(0); i++)
            {
                Console.Write("  | ");
                for (int j = 0; j < m.GetLength(1); j++)
                {
                    Console.Write($"{m[i, j],3} ");
                }
                Console.WriteLine("|");
            }
        }
    }
}`,
  },
  {
    id: 'tpl-crivo-primos',
    name: '04. Matemática de Alta Performance (Crivo de Primos)',
    description: 'Algoritmo otimizado para encontrar 10.000 números primos com medição de tempo Stopwatch.',
    category: 'matematica',
    tags: ['Primos', 'Crivo', 'Stopwatch', 'Performance'],
    userId: 'system',
    createdAt: 1700000000003,
    updatedAt: 1700000000003,
    readOnly: true,
    code: `using System;
using System.Diagnostics;
using System.Collections.Generic;

namespace CodexApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("==================================================");
            Console.WriteLine("    CRIVO DE ERATÓSTENES (ALTA PERFORMANCE)       ");
            Console.WriteLine("==================================================");

            int limite = 50000;
            Console.WriteLine($"Buscando números primos até {limite:N0}...\\n");

            var relogio = Stopwatch.StartNew();

            bool[] ehPrimo = new bool[limite + 1];
            for (int i = 2; i <= limite; i++) ehPrimo[i] = true;

            for (int p = 2; p * p <= limite; p++)
            {
                if (ehPrimo[p])
                {
                    for (int m = p * p; m <= limite; m += p)
                        ehPrimo[m] = false;
                }
            }

            List<int> primos = new List<int>();
            for (int i = 2; i <= limite; i++)
            {
                if (ehPrimo[i]) primos.Add(i);
            }

            relogio.Stop();

            Console.WriteLine($"Tempo de processamento: {relogio.ElapsedMilliseconds} ms");
            Console.WriteLine($"Total de primos encontrados: {primos.Count:N0}");

            Console.WriteLine("\\nPrimeiros 10 números primos:");
            Console.WriteLine(string.Join(", ", primos.GetRange(0, Math.Min(10, primos.Count))));

            Console.WriteLine("\\nÚltimos 5 maiores primos até 50.000:");
            int inicio = Math.Max(0, primos.Count - 5);
            Console.WriteLine(string.Join(", ", primos.GetRange(inicio, 5)));

            Console.WriteLine("\\n[✓] Benchmark concluído com sucesso!");
        }
    }
}`,
  },
  {
    id: 'tpl-big-integer-matematica',
    name: '05. Casos Gigantes de Matemática (BigInteger & Fatorial 100!)',
    description: 'Cálculo de números astronômicos sem estouro usando System.Numerics.BigInteger.',
    category: 'matematica',
    tags: ['BigInteger', 'Fatorial', 'Fibonacci', 'Precisão'],
    userId: 'system',
    createdAt: 1700000000004,
    updatedAt: 1700000000004,
    readOnly: true,
    code: `using System;
using System.Numerics;

namespace CodexApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("==================================================");
            Console.WriteLine("     MATEMÁTICA GIGANTE COM BIGINTEGER EM C#      ");
            Console.WriteLine("==================================================");

            // 1. Fatorial de 100!
            BigInteger fat100 = 1;
            for (int i = 1; i <= 100; i++) fat100 *= i;

            Console.WriteLine("1. Fatorial de 100 (100!):");
            string fatStr = fat100.ToString();
            Console.WriteLine(fatStr);
            Console.WriteLine($"-> Total de dígitos de 100!: {fatStr.Length} dígitos!\\n");

            // 2. Potência astronômica 2^256 (Criptografia)
            BigInteger pot256 = BigInteger.Pow(2, 256);
            Console.WriteLine("2. Potência de 256 bits (2^256):");
            Console.WriteLine(pot256);

            // 3. Fibonacci(150)
            BigInteger a = 0, b = 1;
            for (int i = 2; i <= 150; i++)
            {
                BigInteger c = a + b;
                a = b;
                b = c;
            }
            Console.WriteLine($"\\n3. Fibonacci(150) = {b}");
            Console.WriteLine($"-> Total de dígitos: {b.ToString().Length} dígitos");

            Console.WriteLine("\\n[✓] Precisão arbitrária executada sem overflow!");
        }
    }
}`,
  },
  {
    id: 'tpl-poo-polimorfismo',
    name: '06. Programação Orientada a Objetos (POO & Polimorfismo)',
    description: 'Classes abstratas, interfaces, encapsulamento e polimorfismo bancário.',
    category: 'poo',
    tags: ['POO', 'Classes', 'Polimorfismo', 'Interface'],
    userId: 'system',
    createdAt: 1700000000005,
    updatedAt: 1700000000005,
    readOnly: true,
    code: `using System;
using System.Collections.Generic;

namespace CodexApp
{
    public interface ITransacao
    {
        string ObterResumo();
    }

    public abstract class ContaBancaria : ITransacao
    {
        public string Titular { get; }
        public decimal Saldo { get; protected set; }

        public ContaBancaria(string titular, decimal saldoInicial)
        {
            Titular = titular;
            Saldo = saldoInicial;
        }

        public virtual void Depositar(decimal valor)
        {
            Saldo += valor;
            Console.WriteLine($"[+] Depósito de R$ {valor:F2} para {Titular}. Saldo: R$ {Saldo:F2}");
        }

        public abstract bool Sacar(decimal valor);

        public string ObterResumo()
        {
            return $"{Titular,-18} | Saldo: R$ {Saldo,8:F2}";
        }
    }

    public class ContaCorrente : ContaBancaria
    {
        public decimal Limite { get; }

        public ContaCorrente(string titular, decimal saldo, decimal limite)
            : base(titular, saldo)
        {
            Limite = limite;
        }

        public override bool Sacar(decimal valor)
        {
            if (Saldo + Limite >= valor)
            {
                Saldo -= valor;
                Console.WriteLine($"[-] Saque de R$ {valor:F2} realizado por {Titular}. Saldo: R$ {Saldo:F2}");
                return true;
            }
            Console.WriteLine($"[x] Saldo insuficiente para {Titular}.");
            return false;
        }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== SISTEMA BANCÁRIO POO EM C# ===\\n");

            var contas = new List<ContaBancaria>
            {
                new ContaCorrente("Ana Souza", 1500.00m, 500.00m),
                new ContaCorrente("Lucas Rocha", 3200.00m, 1000.00m)
            };

            contas[0].Depositar(300.00m);
            contas[0].Sacar(1900.00m);
            contas[1].Sacar(500.00m);

            Console.WriteLine("\\n--- RELATÓRIO DE CONTAS ---");
            foreach (var c in contas)
            {
                Console.WriteLine(c.ObterResumo());
            }

            Console.WriteLine("\\n[✓] Polimorfismo e herança executados!");
        }
    }
}`,
  },
  {
    id: 'tpl-linq-consultas',
    name: '07. Consultas Avançadas com LINQ',
    description: 'Filtragem (Where), ordenação (OrderBy), agregação (Sum, Average) e projeções.',
    category: 'algoritmos',
    tags: ['LINQ', 'Coleções', 'Where', 'OrderBy', 'Sum'],
    userId: 'system',
    createdAt: 1700000000006,
    updatedAt: 1700000000006,
    readOnly: true,
    code: `using System;
using System.Collections.Generic;
using System.Linq;

namespace CodexApp
{
    public class Produto
    {
        public string Nome { get; set; }
        public string Categoria { get; set; }
        public decimal Preco { get; set; }
        public int Estoque { get; set; }
    }

    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== CONSULTAS COM LINQ EM C# ===\\n");

            var produtos = new List<Produto>
            {
                new Produto { Nome = "Mouse Gamer", Categoria = "Periféricos", Preco = 180.00m, Estoque = 15 },
                new Produto { Nome = "Teclado RGB", Categoria = "Periféricos", Preco = 320.00m, Estoque = 10 },
                new Produto { Nome = "Monitor 27 pol", Categoria = "Monitores", Preco = 1450.00m, Estoque = 4 },
                new Produto { Nome = "Headset 7.1", Categoria = "Áudio", Preco = 290.00m, Estoque = 8 },
                new Produto { Nome = "Cadeira Ergonômica", Categoria = "Móveis", Preco = 1100.00m, Estoque = 3 }
            };

            // 1. Filtrando produtos com Where e ordenando com OrderByDescending
            Console.WriteLine("1. PRODUTOS ACIMA DE R$ 300,00 (ORDENADOS):");
            var caros = produtos.Where(p => p.Preco >= 300.00m).OrderByDescending(p => p.Preco);
            foreach (var p in caros)
            {
                Console.WriteLine($"   • {p.Nome,-18} | R$ {p.Preco,7:F2} | Estoque: {p.Estoque}");
            }

            // 2. Métricas gerais com LINQ
            decimal totalPatrimonio = produtos.Sum(p => p.Preco * p.Estoque);
            decimal precoMedio = produtos.Average(p => p.Preco);

            Console.WriteLine($"\\n2. RESUMO FINANCEIRO:");
            Console.WriteLine($"   Patrimônio total em estoque: R$ {totalPatrimonio:F2}");
            Console.WriteLine($"   Preço médio dos produtos   : R$ {precoMedio:F2}");

            Console.WriteLine("\\n[✓] LINQ executado com sucesso!");
        }
    }
}`,
  },
  {
    id: 'tpl-quicksort-busca-binaria',
    name: '08. Algoritmos: QuickSort e Busca Binária',
    description: 'Algoritmo de ordenação eficiente QuickSort e busca logarítmica O(log N).',
    category: 'algoritmos',
    tags: ['QuickSort', 'Busca Binária', 'Algoritmos'],
    userId: 'system',
    createdAt: 1700000000007,
    updatedAt: 1700000000007,
    readOnly: true,
    code: `using System;

namespace CodexApp
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("=== ALGORITMOS: QUICKSORT E BUSCA BINÁRIA ===\\n");

            int[] dados = { 64, 34, 25, 12, 22, 11, 90, 88, 76, 50, 42, 9, 3 };

            Console.WriteLine("1. Vetor Original desordenado:");
            Console.WriteLine("[ " + string.Join(", ", dados) + " ]");

            // Ordenando com QuickSort
            QuickSort(dados, 0, dados.Length - 1);

            Console.WriteLine("\\n2. Vetor Ordenado com QuickSort O(N log N):");
            Console.WriteLine("[ " + string.Join(", ", dados) + " ]");

            // Testando Busca Binária
            int[] alvos = { 42, 90, 15, 3 };
            Console.WriteLine("\\n3. Testes de Busca Binária O(log N):");
            foreach (var alvo in alvos)
            {
                int idx = BuscaBinaria(dados, alvo);
                if (idx >= 0)
                    Console.WriteLine($"   [✓] Valor {alvo,2} encontrado no índice [{idx}].");
                else
                    Console.WriteLine($"   [✗] Valor {alvo,2} não está no vetor.");
            }

            Console.WriteLine("\\n[✓] Algoritmos executados com sucesso!");
        }

        static void QuickSort(int[] arr, int inicio, int fim)
        {
            if (inicio < fim)
            {
                int pivo = arr[fim];
                int i = inicio - 1;
                for (int j = inicio; j < fim; j++)
                {
                    if (arr[j] <= pivo)
                    {
                        i++;
                        int tmp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = tmp;
                    }
                }
                int tmp2 = arr[i + 1];
                arr[i + 1] = arr[fim];
                arr[fim] = tmp2;

                int pivoIdx = i + 1;
                QuickSort(arr, inicio, pivoIdx - 1);
                QuickSort(arr, pivoIdx + 1, fim);
            }
        }

        static int BuscaBinaria(int[] arr, int chave)
        {
            int baixo = 0, alto = arr.Length - 1;
            while (baixo <= alto)
            {
                int meio = baixo + (alto - baixo) / 2;
                if (arr[meio] == chave) return meio;
                if (arr[meio] < chave) baixo = meio + 1;
                else alto = meio - 1;
            }
            return -1;
        }
    }
}`,
  },
];
