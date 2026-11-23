import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  ChevronDown,
  Cpu,
  Database,
  Download,
  FileText,
  GitBranch,
  Layers,
  Presentation,
  ShieldCheck,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [showDownloads, setShowDownloads] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: Activity },
    { id: 'policies', label: 'Políticas', icon: Layers },
    { id: 'dashboard', label: 'Resultados', icon: BarChart3 },
    { id: 'trace', label: 'Simulador', icon: Cpu },
    { id: 'usecases', label: 'Casos de Uso', icon: ShieldCheck },
    { id: 'campaign', label: 'Execuções (59)', icon: Database },
    { id: 'paper', label: 'Artigo IEEE', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Project Identification */}
          <div
            className="flex items-center space-x-3 cursor-pointer shrink-0 group py-1"
            onClick={() => setActiveTab('overview')}
            title="Ir para a Visão Geral"
          >
            <div className="w-11 h-11 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-105 group-hover:bg-teal-500/30 transition-all shadow-inner">
              <Activity className="w-6 h-6" />
            </div>
            <div className="whitespace-nowrap">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  IoT Duty Cycling
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  CP4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Tema 21 · ICMC-USP</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 xl:px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30 ring-1 ring-teal-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Git Commit Pill */}
            <a
              href="https://github.com/ICMC-SSC0952-2026/projeto-ssc0952-grupo21"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-mono font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700 transition-all whitespace-nowrap"
              title="Commit Imutável da Campanha"
            >
              <GitBranch className="w-3.5 h-3.5 text-teal-400" />
              <span>08003d2</span>
            </a>

            {/* Downloads Dropdown / Action */}
            <div className="relative">
              <button
                onClick={() => setShowDownloads(!showDownloads)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-md shadow-teal-950/40 whitespace-nowrap"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Entregas CP4</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>

              {/* Dropdown Menu */}
              {showDownloads && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDownloads(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/80">
                      Documentos Oficiais
                    </div>
                    
                    <a
                      href="/artigo_cp4.pdf"
                      download="Artigo_CP4_Tema21_Grupo21.pdf"
                      onClick={() => setShowDownloads(false)}
                      className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-700 text-slate-200 hover:text-white transition-colors group mt-1"
                    >
                      <FileText className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold">Artigo Científico IEEE</div>
                        <div className="text-[10px] text-slate-400">PDF completo · 18 páginas</div>
                      </div>
                    </a>

                    <a
                      href="/apresentacao_cp4_slides.pdf"
                      download="Apresentacao_CP4_Tema21_Slides.pdf"
                      onClick={() => setShowDownloads(false)}
                      className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-700 text-slate-200 hover:text-white transition-colors group"
                    >
                      <Presentation className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold">Slides da Apresentação</div>
                        <div className="text-[10px] text-slate-400">PDF widescreen · 13 slides</div>
                      </div>
                    </a>

                    <a
                      href="/apresentacao_cp4.pptx"
                      download="apresentacao_cp4.pptx"
                      onClick={() => setShowDownloads(false)}
                      className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-700 text-slate-200 hover:text-white transition-colors group"
                    >
                      <Presentation className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                      <div>
                        <div className="font-semibold">PowerPoint Editável (.pptx)</div>
                        <div className="text-[10px] text-slate-400">Compatível com Google Slides/Keynote</div>
                      </div>
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sub-bar / Tablet / Mobile Navigation */}
      <div className="lg:hidden border-t border-slate-800 bg-slate-900/90 overflow-x-auto no-scrollbar py-2.5 px-4 sm:px-6">
        <div className="flex items-center space-x-2 w-max mx-auto sm:mx-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
