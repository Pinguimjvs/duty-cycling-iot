import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  ExternalLink,
  FileCheck,
  FileSpreadsheet,
  FileText,
  GitBranch,
  Github,
  Layers,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const PaperSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const reproCommand = `# 1. Clonar repositório e posicionar no commit auditado
git clone https://github.com/ICMC-SSC0952-2026/projeto-ssc0952-grupo21.git
cd projeto-ssc0952-grupo21
git checkout 08003d27c8dd8d70d23836c07aad604020f26b0c

# 2. Gerar a imagem LittleFS idêntica (cfg_hash 70077ec9...c7f0)
cd firmware
python3 tools/build_fs_image.py \\
  --config ../configs/cp4/campanha.yaml \\
  --kinds S,G,C \\
  --traces ../data/raw/cp4/traces/indice.csv \\
  --traces ../experiments/cp4/sinteticos/indice.csv \\
  --r-scale ../configs/r_scale.yaml \\
  --out ../build/image --force

# 3. Gravar na placa ESP32 (LittleFS primeiro, depois binário)
pio run -e esp32dev -t uploadfs
pio run -e esp32dev -t upload`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reproCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const prismaClusters = [
    {
      title: 'Cluster 1: Disparo por Evento & Deadband (7 artigos)',
      desc: 'Técnicas que suprimem transmissões quando o sinal varia menos que um limiar Δ (deadband físico ou perceptual). Fundamentação direta para as regras a e d da política P3.',
      papers: 'Mase et al. (2020), Shi et al. (2021), Al-Fuqaha et al. (2022), etc.',
    },
    {
      title: 'Cluster 2: Taxa Dupla & Multi-Fidelidade (5 artigos)',
      desc: 'Alternância entre período rápido (T_S) durante eventos dinâmicos e período longo (T_L) durante estabilidade, combinado com batimento de segurança (heartbeat). Base da arquitetura de P3.',
      papers: 'Nguyen et al. (2019), Kumar & Dash (2021), Zhao et al. (2023), etc.',
    },
    {
      title: 'Cluster 3: Consciente de Coleta de Energia (4 artigos)',
      desc: 'Modelagem do compromisso de duty cycling acoplado a harvesters solares e baterias de lítio com curva de descarga não-linear.',
      papers: 'Gorlatova et al. (2020), Fraternali et al. (2021), etc.',
    },
    {
      title: 'Cluster 4: Aprendizado por Reforço / Adaptativo (4 artigos)',
      desc: 'Ajuste adaptativo online dos limiares via Q-learning ou heurísticas de gradiente para convergir ao Pareto ótimo sem conhecimento a priori do modelo físico.',
      papers: 'Chen et al. (2022), Santos & Silva (2024), etc.',
    },
  ];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1480px] mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Publicação & Reprodutibilidade
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
          Artigo Científico IEEE & Protocolo de Auditoria
        </h2>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          O projeto está formalizado em um artigo de 18 páginas em formato IEEE de duas colunas, acompanhado de revisão sistemática Micro-PRISMA e snapshot de código imutável.
        </p>
      </div>

      {/* Main Grid: Paper Card + Micro-PRISMA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Paper Presentation Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Formato IEEE Transactions · 18 Páginas</span>
              </span>
              <span className="text-xs font-mono text-slate-500">Checkpoint 04 Final</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              IoT Energeticamente Consciente: Avaliação Empírica de Duty Cycling e Políticas de Transmissão Adaptativas sob Traços Reais de Umidade do Solo
            </h3>

            <div className="mt-3 flex items-center space-x-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Héctor Yolvi Herrera Cruz</span>
              <span>•</span>
              <span className="font-medium text-slate-700">João Vitor Salvini</span>
              <span>•</span>
              <span>USP / ICMC (2026)</span>
            </div>

            {/* Abstract */}
            <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-2">
              <div className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">Resumo Executivo (Abstract)</div>
              <p>
                Este trabalho investiga experimentalmente o compromisso fundamental entre consumo energético (avaliado pelo tempo de rádio ativo <span className="font-mono">T_on</span>), latência de notificação de eventos e fidelidade de reconstrução temporal em nós IoT com restrição de energia operando em Wi-Fi 802.11 e MQTT.
              </p>
              <p>
                Utilizando uma bancada Hardware-in-the-Loop com microcontrolador ESP32 executando replay em tempo real de traços físicos do observatório ecológico NEON, comparamos uma política periódica curta (P1, Ts = 1 min), uma periódica longa (P2, TL = 30 min) e uma política adaptativa mista (P3).
              </p>
              <p>
                Os resultados empíricos demonstram que P3 reduz o tempo de rádio em <strong>95,2%</strong> em relação a P1 (30,7 s/dia vs 631,8 s/dia, p &lt; 10⁻⁶), mantendo latência sub-segundo (0,42 s) e zero eventos perdidos, enquanto P2 perdeu 100% dos eventos com atraso médio de 777 s.
              </p>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-3">
            <a
              href="/artigo_cp4.pdf"
              download="Artigo_CP4_Tema21_Grupo21.pdf"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-sm hover:shadow"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Artigo Completo (PDF, 18 págs)</span>
            </a>

            <a
              href="/artigo_cp4.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir no Navegador</span>
            </a>
          </div>
        </div>

        {/* Micro-PRISMA Summary Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-teal-600 mb-2">
              <FileSpreadsheet className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Revisão Sistemática</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Protocolo Micro-PRISMA (20 Artigos)
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Mapeamento estruturado da literatura recente em 4 clusters metodológicos (tabela <code className="font-mono">micro_prisma.xlsm</code>).
            </p>

            <div className="mt-4 space-y-3">
              {prismaClusters.map((cluster, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
                  <div className="font-bold text-slate-800">{cluster.title}</div>
                  <div className="text-slate-600 mt-1 leading-normal">{cluster.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Arquivo auditado na entrega:</span>
            <span className="font-mono font-semibold text-slate-700">micro_prisma.xlsm</span>
          </div>
        </div>
      </div>

      {/* Reproducibility & Git Snapshot Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-3">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>Reprodutibilidade Estrita (Deterministic Replay)</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Como Replicar os Resultados no ESP32
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="https://github.com/ICMC-SSC0952-2026/projeto-ssc0952-grupo21"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Repositório GitHub</span>
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado!' : 'Copiar Comandos'}</span>
            </button>
          </div>
        </div>

        {/* Hashes Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs font-mono">
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] uppercase">Commit Hash Imutável</span>
            <span className="text-teal-300 font-bold">08003d27c8dd8d70d23836c07aad604020f26b0c</span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] uppercase">Configuração SHA-256</span>
            <span className="text-emerald-300 font-bold truncate block" title="70077ec928f367d3230204261adfc31f98263d0fa50f175f264362bf6da2c7f0">
              70077ec9...c7f0
            </span>
          </div>
          <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/80">
            <span className="text-slate-400 block text-[10px] uppercase">Tag Git Congelada</span>
            <span className="text-blue-300 font-bold">cp4-freeze-2</span>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="relative bg-slate-950 rounded-xl p-4 font-mono text-xs text-slate-300 overflow-x-auto border border-slate-800/80">
          <pre>{reproCommand}</pre>
        </div>
      </div>
    </section>
  );
};
