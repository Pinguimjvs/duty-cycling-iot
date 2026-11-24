import React, { useState } from 'react';
import { useLiveData } from '../context/LiveDataContext';
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
  Menu,
  Presentation,
  Radio,
  RefreshCw,
  Server,
  ShieldCheck,
  Wifi,
  X,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { isLive, isSyncing, lastSync, autoRefresh, setAutoRefresh, refresh, vmInfo } = useLiveData();
  const [showDownloads, setShowDownloads] = useState(false);
  const [showVmModal, setShowVmModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Visão Geral', icon: Activity },
    { id: 'policies', label: 'Políticas', icon: Layers },
    { id: 'dashboard', label: 'Resultados', icon: BarChart3 },
    { id: 'trace', label: 'Simulador', icon: Cpu },
    { id: 'usecases', label: 'Casos de Uso', icon: ShieldCheck },
    { id: 'campaign', label: 'Execuções', icon: Database },
    { id: 'paper', label: 'Artigo IEEE', icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 w-full max-w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg overflow-x-clip">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          {/* Logo & Title */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer shrink-0 group py-1 select-none"
            onClick={() => setActiveTab('overview')}
            title="Ir para a Visão Geral"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-105 group-hover:bg-teal-500/30 transition-all shadow-inner">
              <Activity className="w-5 h-5 sm:w-5 sm:h-5" />
            </div>
            <div className="whitespace-nowrap">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  IoT Duty Cycling
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  CP4
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">Tema 21 · ICMC-USP</p>
            </div>
          </div>

          {/* Desktop Navigation Links (Compact, fits on laptops without horizontal overflow) */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm ring-1 ring-teal-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* Git Commit Pill (Only visible on large screens) */}
            <a
              href="https://github.com/Pinguimjvs/duty-cycling-iot"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden 2xl:flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700/80 border border-slate-700 transition-all whitespace-nowrap"
              title="Repositório no GitHub"
            >
              <GitBranch className="w-3.5 h-3.5 text-teal-400" />
              <span>08003d2</span>
            </a>

            {/* VM Connection Status Pill & Modal */}
            <div className="relative">
              <button
                onClick={() => setShowVmModal(!showVmModal)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap shadow-sm ${
                  isLive
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                    : 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                }`}
                title="Status da conexão com a VM (andromeda.lasdpc.icmc.usp.br:5375)"
              >
                <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span className="font-mono text-[11px]">{isLive ? 'VM :5375' : 'Local'}</span>
                <ChevronDown className={`w-3 h-3 opacity-70 transition-transform ${showVmModal ? 'rotate-180' : ''}`} />
              </button>

              {/* VM Status Modal / Popover */}
              {showVmModal && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowVmModal(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-slate-900/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/80 p-4 z-50 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div className="flex items-center space-x-2">
                        <Server className="w-4 h-4 text-teal-400" />
                        <span className="font-bold text-white text-sm">Serviços da VM</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isLive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {isLive ? 'ONLINE' : 'SNAPSHOT LOCAL'}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 text-slate-300">
                      <div className="text-[11px] text-slate-400">
                        Host: <span className="font-mono text-slate-200">andromeda.lasdpc.icmc.usp.br</span>
                      </div>

                      {/* Ports Map */}
                      <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 space-y-1.5 font-mono text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Porta 5175:</span>
                          <span className="text-teal-300">Broker Mosquitto MQTT</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Porta 5275:</span>
                          <span className="text-cyan-300">Orquestrador (t21lab)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Porta 5375:</span>
                          <span className="text-emerald-300 font-bold">Frontend Web &amp; API REST</span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-700 text-slate-400">
                          <span>Porta SSH:</span>
                          <span>23175 (giotgrad21)</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                        <span>Último sync:</span>
                        <span className="font-mono text-slate-200">
                          {lastSync ? lastSync.toLocaleTimeString() : 'Ainda não sincronizado'}
                        </span>
                      </div>

                      {/* Auto-refresh Toggle */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-300">Auto-refresh (10s):</span>
                        <button
                          onClick={() => setAutoRefresh(!autoRefresh)}
                          className={`px-2.5 py-0.5 rounded-full font-semibold transition-colors ${
                            autoRefresh ? 'bg-teal-500 text-slate-950' : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {autoRefresh ? 'Ativo' : 'Pausado'}
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 flex gap-2">
                        <button
                          onClick={() => refresh()}
                          disabled={isSyncing}
                          className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold transition-all shadow-sm"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                          <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Downloads Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDownloads(!showDownloads)}
                className="flex items-center space-x-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-sm whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>Entregas</span>
                <ChevronDown className={`w-3.5 h-3.5 opacity-70 transition-transform ${showDownloads ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDownloads && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDownloads(false)}
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700 p-2 z-50 text-xs">
                    <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-700/80">
                      Entregas Oficiais CP4
                    </div>
                    
                    <a
                      href="/artigo_cp4.pdf"
                      download="Artigo_CP4_Tema21_Grupo21.pdf"
                      onClick={() => setShowDownloads(false)}
                      className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-700 text-slate-200 hover:text-white transition-colors group mt-1"
                    >
                      <FileText className="w-4 h-4 text-teal-400 group-hover:scale-110 transition-transform shrink-0" />
                      <div>
                        <div className="font-semibold text-white">Artigo Científico IEEE</div>
                        <div className="text-[10px] text-slate-400">PDF completo · 18 páginas</div>
                      </div>
                    </a>

                    <a
                      href="/apresentacao_cp4_slides.pdf"
                      download="Apresentacao_CP4_Tema21_Slides.pdf"
                      onClick={() => setShowDownloads(false)}
                      className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-700 text-slate-200 hover:text-white transition-colors group"
                    >
                      <Presentation className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                      <div>
                        <div className="font-semibold text-white">Slides da Apresentação</div>
                        <div className="text-[10px] text-slate-400">PDF widescreen · 13 slides</div>
                      </div>
                    </a>

                    <a
                      href="/apresentacao_cp4.pptx"
                      download="apresentacao_cp4.pptx"
                      onClick={() => setShowDownloads(false)}
                      className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-700 text-slate-200 hover:text-white transition-colors group"
                    >
                      <Presentation className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                      <div>
                        <div className="font-semibold text-white">PowerPoint Editável (.pptx)</div>
                        <div className="text-[10px] text-slate-400">Google Slides / Keynote</div>
                      </div>
                    </a>

                    <div className="border-t border-slate-700/80 mt-1 pt-1">
                      <a
                        href="https://github.com/Pinguimjvs/duty-cycling-iot"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setShowDownloads(false)}
                        className="flex items-center space-x-2.5 px-3 py-2 rounded-xl hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <GitBranch className="w-4 h-4 text-teal-400 shrink-0" />
                        <div>
                          <div className="font-semibold">GitHub do Projeto</div>
                          <div className="text-[10px] text-slate-400">Commit 08003d2</div>
                        </div>
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu (When open on mobile/tablet) */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900/98 px-4 pt-3 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-teal-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Contained Horizontal Scroll Sub-bar (for tablet/mobile when menu is closed) */}
      <div className="lg:hidden border-t border-slate-800/80 bg-slate-900/90 overflow-x-auto no-scrollbar py-2 px-3 w-full max-w-full">
        <div className="flex items-center space-x-1.5 w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
