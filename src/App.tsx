import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PoliciesComparison } from './components/PoliciesComparison';
import { ResultsDashboard } from './components/ResultsDashboard';
import { TraceViewer } from './components/TraceViewer';
import { UseCasesGuide } from './components/UseCasesGuide';
import { RunsTable } from './components/RunsTable';
import { PaperSection } from './components/PaperSection';
import { Activity, BookOpen, ExternalLink, Github, Heart, Layers, ShieldCheck, Terminal, Zap } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div>
            <HeroSection onExplore={(tab) => setActiveTab(tab)} />
            <PoliciesComparison />
            
            {/* Quick Preview Callouts */}
            <section className="py-12 bg-slate-900 text-white border-t border-slate-800">
              <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-10">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
                    Navegação Rápida
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    Explore os Resultados da Campanha CP4
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div
                    onClick={() => setActiveTab('dashboard')}
                    className="cursor-pointer bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 hover:border-teal-500/50 hover:bg-slate-800 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Dashboard de Resultados</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Visualize os gráficos comparativos de tempo de rádio (-95,2%), latência de eventos (0,42 s) e conformidade de reconstrução agronômica (RMSE).
                    </p>
                    <span className="inline-block mt-4 text-xs font-semibold text-teal-400 group-hover:underline">
                      Ver Métricas &rarr;
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('trace')}
                    className="cursor-pointer bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 hover:border-teal-500/50 hover:bg-slate-800 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Simulador de Traço Real</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Navegue pelos 720 minutos do traço de solo NEON (Segmento S01), dê zoom no evento de chuva e compare os disparos de cada política em tempo real.
                    </p>
                    <span className="inline-block mt-4 text-xs font-semibold text-blue-400 group-hover:underline">
                      Abrir Simulador &rarr;
                    </span>
                  </div>

                  <div
                    onClick={() => setActiveTab('usecases')}
                    className="cursor-pointer bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 hover:border-teal-500/50 hover:bg-slate-800 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Casos de Uso & Calculadora</h3>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                      Entenda quando usar a política curta ou longa, por que a adaptativa é o ideal, e simule a autonomia da bateria (em dias e anos) interativamente.
                    </p>
                    <span className="inline-block mt-4 text-xs font-semibold text-purple-400 group-hover:underline">
                      Acessar Guia de Decisão &rarr;
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Tab 2: Policies */}
        {activeTab === 'policies' && <PoliciesComparison />}

        {/* Tab 3: Dashboard */}
        {activeTab === 'dashboard' && <ResultsDashboard />}

        {/* Tab 4: Trace Viewer */}
        {activeTab === 'trace' && <TraceViewer />}

        {/* Tab 5: Use Cases */}
        {activeTab === 'usecases' && <UseCasesGuide />}

        {/* Tab 6: Campaign Runs */}
        {activeTab === 'campaign' && <RunsTable />}

        {/* Tab 7: Paper & Reproducibility */}
        {activeTab === 'paper' && <PaperSection />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 text-xs">
        <div className="max-w-[1480px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span>SSC0952 / SSC0592 · Internet das Coisas (IoT)</span>
            </div>
            <p className="mt-1 text-slate-400">
              Instituto de Ciências Matemáticas e de Computação — Universidade de São Paulo (ICMC-USP)
            </p>
            <p className="text-slate-500 mt-0.5">
              Tema 21 · Duty Cycling e Políticas de Transmissão sob Traços Reais
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-right">
            <div>
              <div className="text-slate-300 font-medium">Grupo 21:</div>
              <div className="text-slate-400">Héctor Yolvi Herrera Cruz &amp; João Vitor Salvini</div>
            </div>
            <div className="h-8 w-px bg-slate-800 hidden md:block" />
            <a
              href="https://github.com/ICMC-SSC0952-2026/projeto-ssc0952-grupo21"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            >
              <Github className="w-4 h-4 text-teal-400" />
              <span>Repositório GitHub</span>
            </a>
          </div>
        </div>

        <div className="max-w-[1480px] mx-auto mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2">
          <div>Checkpoint 04 Final · Pronto para deploy na Vercel</div>
          <div className="flex items-center space-x-1">
            <span>Desenvolvido com React, TypeScript, Tailwind CSS e Recharts</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
