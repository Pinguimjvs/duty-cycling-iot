import React from 'react';
import { ArrowDownRight, Clock, Cpu, Droplets, Gauge, ShieldAlert, Sparkles, Zap } from 'lucide-react';

interface HeroSectionProps {
  onExplore: (tab: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore }) => {
  return (
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-700/60">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-teal-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-[1480px] mx-auto relative z-10">
        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Resultados Finais do Checkpoint 04</span>
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
            USP · ICMC · SSC0952 / SSC0592
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
            Hardware-in-the-Loop no ESP32
          </span>
        </div>

        {/* Title */}
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            IoT Energeticamente Consciente:{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-300 to-teal-200">
              Duty Cycling & Políticas de Transmissão
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            Avaliação empírica no ESP32 do compromisso fundamental entre <strong className="text-white">tempo de rádio ativo</strong> (proxy de energia), <strong className="text-white">latência de notificação</strong> e <strong className="text-white">fidelidade da reconstrução</strong>, sob traços reais de umidade do solo do observatório ecológico NEON com Wi-Fi e MQTT reais.
          </p>
          <div className="mt-4 flex items-center space-x-4 text-xs sm:text-sm text-slate-400">
            <div>Autores: <span className="text-slate-200 font-medium">Héctor Yolvi Herrera Cruz</span> & <span className="text-slate-200 font-medium">João Vitor Salvini</span></div>
            <span>•</span>
            <div>Orientador: <span className="text-slate-200 font-medium">Prof. Dr. Júlio Cezar Estrella</span></div>
          </div>
        </div>

        {/* Primary Key Metrics Grid */}
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Card 1: Radio On-Time */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-4 shadow-sm hover:border-teal-500/50 transition-all">
            <div className="flex items-center justify-between text-teal-400 mb-1">
              <Zap className="w-5 h-5" />
              <span className="text-xs font-mono font-bold bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded">
                -95,2%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">30,7 <span className="text-xs font-normal text-slate-400">s/dia</span></div>
            <div className="text-xs font-medium text-slate-300 mt-1">Tempo de Rádio (P3)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">vs 631,8 s/dia em P1 (p &lt; 10⁻⁶)</div>
          </div>

          {/* Card 2: Notification Delay */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-4 shadow-sm hover:border-emerald-500/50 transition-all">
            <div className="flex items-center justify-between text-emerald-400 mb-1">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                Sem perda
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">0,42 <span className="text-xs font-normal text-slate-400">segundos</span></div>
            <div className="text-xs font-medium text-slate-300 mt-1">Atraso Médio de Chuva</div>
            <div className="text-[11px] text-slate-400 mt-0.5">P1 = 0,36 s | P2 = 777 s (~13 min)</div>
          </div>

          {/* Card 3: Events Lost */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-4 shadow-sm hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between text-blue-400 mb-1">
              <Droplets className="w-5 h-5" />
              <span className="text-xs font-mono font-bold bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded">
                100% capturado
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">0 <span className="text-xs font-normal text-slate-400">perdas</span></div>
            <div className="text-xs font-medium text-slate-300 mt-1">Eventos Perdidos (P3)</div>
            <div className="text-[11px] text-slate-400 mt-0.5">P2 perdeu 10 de 10 eventos</div>
          </div>

          {/* Card 4: RMSE */}
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-4 shadow-sm hover:border-purple-500/50 transition-all">
            <div className="flex items-center justify-between text-purple-400 mb-1">
              <Gauge className="w-5 h-5" />
              <span className="text-xs font-mono font-bold bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded">
                Abaixo de 0,1
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">0,061 <span className="text-xs font-normal text-slate-400">p.p.</span></div>
            <div className="text-xs font-medium text-slate-300 mt-1">RMSE de Reconstrução</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Teto pré-registrado ε_max = 0,10</div>
          </div>

          {/* Card 5: Decision Cost */}
          <div className="col-span-2 lg:col-span-1 bg-slate-800/80 backdrop-blur border border-slate-700/80 rounded-xl p-4 shadow-sm hover:border-amber-500/50 transition-all">
            <div className="flex items-center justify-between text-amber-400 mb-1">
              <Cpu className="w-5 h-5" />
              <span className="text-xs font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                &lt; 0,08%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">74 <span className="text-xs font-normal text-slate-400">µs/ciclo</span></div>
            <div className="text-xs font-medium text-slate-300 mt-1">Custo de Decisão CPU</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Overhead insignificante no ESP32</div>
          </div>
        </div>

        {/* Quick CTA Links */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onExplore('dashboard')}
            className="px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-sm shadow-md transition-all flex items-center space-x-2"
          >
            <span>Ver Dashboards de Resultados</span>
            <ArrowDownRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onExplore('trace')}
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center space-x-2"
          >
            <span>Explorar Simulador de Traço</span>
          </button>
          <button
            onClick={() => onExplore('usecases')}
            className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all flex items-center space-x-2"
          >
            <span>Quando usar cada política?</span>
          </button>
        </div>
      </div>
    </div>
  );
};
