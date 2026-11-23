import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
  ScatterChart,
  Scatter,
  ZAxis,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  Award,
  BarChart2,
  CheckCircle,
  Clock,
  Compass,
  Cpu,
  Database,
  HelpCircle,
  Layers,
  Network,
  Radio,
  Sliders,
  TrendingDown,
  Wifi,
  Zap,
} from 'lucide-react';
import summaryDataRaw from '../data/summary_results.json';
import analyticsDataRaw from '../data/cp4_detailed_analytics.json';
import { SummaryData } from '../types';

const summaryData = summaryDataRaw as unknown as SummaryData;
const analytics = analyticsDataRaw as any;

export const ResultsDashboard: React.FC = () => {
  const [activeMetricTab, setActiveMetricTab] = useState<'ton' | 'latency' | 'diagnostics' | 'rmse' | 'pareto'>('ton');
  
  // Sub-toggles
  const [tonViewMode, setTonViewMode] = useState<'bars' | 'scatter'>('scatter');
  const [latencyViewMode, setLatencyViewMode] = useState<'events' | 'bars'>('events');

  // Primary data for Bar Charts
  const tonChartData = [
    { name: 'P1 (Curta - 1m)', val: 631.8, min: 532.3, max: 731.4, color: '#2a78d6', label: '631,8 s/dia' },
    { name: 'P2 (Longa - 30m)', val: 20.0, min: 19.2, max: 20.9, color: '#eb6834', label: '20,0 s/dia' },
    { name: 'P3 (Adaptativa)', val: 30.7, min: 22.8, max: 38.6, color: '#1baf7a', label: '30,7 s/dia (-95,2%)' },
  ];

  const latencyChartData = [
    { name: 'P1 (Curta)', latency: 0.36, missed: 0, color: '#2a78d6', label: '0,36 s (0 perdidos)' },
    { name: 'P2 (Longa)', latency: 777.4, missed: 10, color: '#ef4444', label: '777,4 s (~13 min)' },
    { name: 'P3 (Adaptativa)', latency: 0.42, missed: 0, color: '#1baf7a', label: '0,42 s (0 perdidos)' },
  ];

  const rmseChartData = [
    { name: 'P1 (Curta)', rmse: 0.0003, color: '#2a78d6', label: '0,0003 p.p.' },
    { name: 'P2 (Longa)', rmse: 0.3238, color: '#ef4444', label: '0,3238 p.p. (Inadmissível)' },
    { name: 'P3 (Adaptativa)', rmse: 0.0609, color: '#1baf7a', label: '0,0609 p.p. (Conforme)' },
  ];

  const paretoPoints = [
    { delta: 'Δ = 0,15', deltaNum: 0.15, ton: 37.5, rmse: 0.0386, admissible: true, note: 'Alta fidelidade' },
    { delta: 'Δ = 0,30', deltaNum: 0.30, ton: 30.7, rmse: 0.0609, admissible: true, note: 'Ponto Ótimo CP4 (Cotovelo)' },
    { delta: 'Δ = 0,45', deltaNum: 0.45, ton: 27.4, rmse: 0.0778, admissible: true, note: 'Econômico' },
    { delta: 'Δ = 0,60', deltaNum: 0.60, ton: 26.5, rmse: 0.0954, admissible: true, note: 'Limite da tolerância' },
    { delta: 'Δ = 0,90', deltaNum: 0.90, ton: 25.1, rmse: 0.1276, admissible: false, note: 'Inadmissível (> ε_max)' },
  ];

  // Data for Hector Image 2: Paired Ton scatter plot
  // Transform ton_paired for Recharts Scatter
  const scatterP1 = analytics.ton_paired.map((d: any) => ({ x: d.P1_ton, y: 3, segmento: d.segmento, policy: 'P1' }));
  const scatterP2 = analytics.ton_paired.map((d: any) => ({ x: d.P2_ton, y: 2, segmento: d.segmento, policy: 'P2' }));
  const scatterP3 = analytics.ton_paired.map((d: any) => ({ x: d.P3_ton, y: 1, segmento: d.segmento, policy: 'P3' }));

  // Data for Hector Image 4: Wetting Events Latency Scatter Plot
  // Transform events for Recharts Scatter
  const eventsP1 = analytics.events.filter((e: any) => e.policy === 'P1').map((e: any) => ({ x: e.D, y: 3, ...e }));
  const eventsP2 = analytics.events.filter((e: any) => e.policy === 'P2').map((e: any) => ({ x: e.D, y: 2, ...e }));
  const eventsP3 = analytics.events.filter((e: any) => e.policy === 'P3').map((e: any) => ({ x: e.D, y: 1, ...e }));

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1480px] mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Resultados da Campanha Experimental
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
          Dashboard de Métricas &amp; Diagnóstico de Hardware
        </h2>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Evidências empíricas consolidadas a partir dos 21 blocos válidos de replay físico no ESP32, incluindo os 10 eventos de saturação por chuva e varredura de gaps.
        </p>
      </div>

      {/* Primary Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap gap-1 border border-slate-200 shadow-inner">
          <button
            onClick={() => setActiveMetricTab('ton')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMetricTab === 'ton'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-teal-600" />
            <span>Tempo de Rádio (M1)</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('latency')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMetricTab === 'latency'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Atraso &amp; Eventos (M4/M5)</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('diagnostics')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMetricTab === 'diagnostics'
                ? 'bg-white text-teal-700 shadow-sm ring-1 ring-teal-500/20'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Network className="w-4 h-4 text-purple-600" />
            <span>Diagnóstico de Rede &amp; Gaps</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('rmse')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMetricTab === 'rmse'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Fidelidade RMSE (M6)</span>
          </button>

          <button
            onClick={() => setActiveMetricTab('pareto')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeMetricTab === 'pareto'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-amber-600" />
            <span>Fronteira de Pareto (Δ)</span>
          </button>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-10">
        
        {/* =========================================================================
            TAB 1: TEMPO DE RÁDIO (M1) - INCLUINDO SCATTER PAREADO (IMAGEM 2 DO HECTOR)
           ========================================================================= */}
        {activeMetricTab === 'ton' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  M1 — Tempo de Rádio Ativo Diário (Proxy de Energia)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparação empírica nos 7 blocos emparelhados (S01 a S07) extrapolados para 24 horas.
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
                <button
                  onClick={() => setTonViewMode('scatter')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    tonViewMode === 'scatter' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Distribuição Pareada (Escala Log)
                </button>
                <button
                  onClick={() => setTonViewMode('bars')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    tonViewMode === 'bars' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Média &amp; IC95% (Barras)
                </button>
              </div>
            </div>

            {tonViewMode === 'scatter' ? (
              <div>
                {/* Scatter Plot Pareado (como na Imagem 2 do Hector) */}
                <div className="flex items-center justify-between mb-2 text-xs text-slate-500 font-mono">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span>P1 · periódica 60s</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                      <span>P2 · periódica 30min</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                      <span>P3 · adaptativa</span>
                    </span>
                    <span className="text-slate-400">| Cruz = Média &amp; IC95%</span>
                  </div>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-600">
                    Escala Logarítmica no Eixo X
                  </span>
                </div>

                <div className="w-full h-80 bg-slate-950 rounded-2xl p-4 shadow-inner border border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Tempo de rádio"
                        unit="s/dia"
                        scale="log"
                        domain={[10, 1000]}
                        stroke="#64748b"
                        fontSize={11}
                        label={{ value: 'Tempo de rádio (s/dia, escala log)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        domain={[0.5, 3.5]}
                        ticks={[1, 2, 3]}
                        tickFormatter={(v) => (v === 3 ? 'P1' : v === 2 ? 'P2' : 'P3')}
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs space-y-1">
                                <div className="font-bold text-teal-400">{d.policy} — Segmento {d.segmento}</div>
                                <div>Tempo de rádio diário: <span className="font-mono font-bold text-white">{d.x} s/dia</span></div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* Reference line for Means */}
                      <ReferenceLine x={631.8} stroke="#3b82f6" strokeDasharray="2 2" />
                      <ReferenceLine x={20.0} stroke="#f59e0b" strokeDasharray="2 2" />
                      <ReferenceLine x={30.7} stroke="#0d9488" strokeDasharray="2 2" />

                      {/* Scatters */}
                      <Scatter name="P1" data={scatterP1} fill="#3b82f6" shape="circle" />
                      <Scatter name="P2" data={scatterP2} fill="#f59e0b" shape="circle" />
                      <Scatter name="P3" data={scatterP3} fill="#14b8a6" shape="circle" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                  <div>
                    <strong>Padrão Empírico Observado:</strong> Em todos os 7 segmentos, os pontos da <strong>P3 (30,7 s/dia)</strong> ficam rigorosamente encostados na <strong>P2 (20,0 s/dia)</strong>, e separados por mais de uma ordem de magnitude da <strong>P1 (631,8 s/dia)</strong>!
                  </div>
                  <span className="font-mono text-teal-700 font-bold ml-4 shrink-0">Redução de 95,2% (p &lt; 10⁻⁶)</span>
                </div>
              </div>
            ) : (
              /* Bar Chart View */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={tonChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis unit="s" stroke="#64748b" fontSize={12} tickLine={false} />
                      <Tooltip
                        formatter={(value: any) => [`${value} s/dia`, 'Tempo Médio']}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="val" radius={[8, 8, 0, 0]}>
                        {tonChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-xs text-slate-600">
                  <h4 className="font-bold text-sm text-slate-800">Intervalos de Confiança (95% BCA):</h4>
                  <div><strong className="text-blue-700">P1:</strong> 631,8 s [532,3; 731,4] — rádio ativo contínuo</div>
                  <div><strong className="text-amber-700">P2:</strong> 20,0 s [19,2; 20,9] — sono profundo rígido</div>
                  <div><strong className="text-teal-700">P3:</strong> 30,7 s [22,8; 38,6] — acréscimo marginal de apenas +10,7s para capturar 100% das chuvas</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: ATRASO & EVENTOS PERDIDOS (M4/M5) - DISPERSÃO DOS 10 EVENTOS (IMAGEM 4)
           ========================================================================= */}
        {activeMetricTab === 'latency' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  M4 &amp; M5 — Atraso de Notificação de Eventos de Umedecimento
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tempo entre a ocorrência do evento no traço físico e a chegada à VM. Limiar de tolerância: D_max = 300 s.
                </p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold self-start md:self-auto">
                <button
                  onClick={() => setLatencyViewMode('events')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    latencyViewMode === 'events' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Dispersão dos 10 Eventos (Log)
                </button>
                <button
                  onClick={() => setLatencyViewMode('bars')}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    latencyViewMode === 'bars' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Médias Globais (Barras)
                </button>
              </div>
            </div>

            {latencyViewMode === 'events' ? (
              <div>
                {/* Scatter Plot de Eventos de Chuva (como na Imagem 4 do Hector) */}
                <div className="flex items-center justify-between mb-2 text-xs text-slate-500 font-mono">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      <span>P1 (0,36s médio · 0 perdidos)</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-red-500 bg-transparent" />
                      <span className="text-red-600 font-bold">P2 (Perdido &gt; 300s · 10/10)</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      <span>P3 (0,42s médio · 0 perdidos)</span>
                    </span>
                  </div>
                  <span className="text-slate-400">Total: 10 eventos em 7 segmentos</span>
                </div>

                <div className="w-full h-80 bg-slate-950 rounded-2xl p-4 shadow-inner border border-slate-800">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Atraso de notificação"
                        unit="s"
                        scale="log"
                        domain={[0.1, 10000]}
                        stroke="#64748b"
                        fontSize={11}
                        label={{ value: 'Atraso de notificação (s, escala log)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 11 }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        domain={[0.5, 3.5]}
                        ticks={[1, 2, 3]}
                        tickFormatter={(v) => (v === 3 ? 'P1' : v === 2 ? 'P2' : 'P3')}
                        stroke="#94a3b8"
                        fontSize={12}
                        tickLine={false}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const d = payload[0].payload;
                            return (
                              <div className="bg-slate-900 border border-slate-700 text-white p-2.5 rounded-xl text-xs space-y-1">
                                <div className="font-bold text-teal-400">
                                  Evento #{d.id + 1} ({d.segmento}) — {d.policy}
                                </div>
                                <div>Atraso medido: <span className="font-mono font-bold text-white">{d.x.toFixed(2)} s</span></div>
                                <div className={d.perdido ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                                  {d.perdido ? '❌ PERDIDO (> 300s)' : '✅ CAPTURADO EM TEMPO REAL'}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* Critical Boundary: D_max = 300s */}
                      <ReferenceLine
                        x={300}
                        stroke="#ef4444"
                        strokeDasharray="4 4"
                        label={{ value: 'D máx = 300 s', fill: '#ef4444', fontSize: 11, position: 'top' }}
                      />

                      <Scatter name="P1" data={eventsP1} fill="#3b82f6" shape="circle" />
                      <Scatter name="P2" data={eventsP2} fill="#ef4444" shape="cross" />
                      <Scatter name="P3" data={eventsP3} fill="#14b8a6" shape="circle" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Evidência Contundente:</strong> Todos os 10 eventos monitorados pela política <strong>P2 violaram o limite de 300 segundos</strong> (chegando a 1.620 segundos de atraso no segmento S01), tornando-a inaceitável para tomada de decisão em tempo real. Já a política <strong>P3 capturou 10 de 10 eventos em 0,42 s médio</strong>, com zero perdas!
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                <div className="lg:col-span-2 h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={latencyChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis unit="s" stroke="#64748b" fontSize={12} tickLine={false} />
                      <Tooltip
                        formatter={(value: any) => [`${value} s`, 'Atraso Médio']}
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                      />
                      <Bar dataKey="latency" radius={[8, 8, 0, 0]}>
                        {latencyChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs text-slate-600 space-y-2">
                  <h4 className="font-bold text-sm text-slate-800">Conclusão de Latência:</h4>
                  <p>P3 empata estatisticamente com a periódica curta (P1) no atraso de notificação (0,42s vs 0,36s, p = 0,21), eliminando o atraso de 13 minutos da política longa.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: DIAGNÓSTICO DE REDE & HARDWARE (OS 4 PAINÉIS DA IMAGEM 3 DO HECTOR)
           ========================================================================= */}
        {activeMetricTab === 'diagnostics' && (
          <div>
            <div className="pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-teal-600 text-xs font-bold uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>Bancada Experimental ESP32 &middot; 4 Painéis de Diagnóstico</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Análise Física de Overhead de Protocolo, Gaps e Estabilidade
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Investigação detalhada das fases de rádio, invariância temporal do overhead e estabilidade térmica ao longo dos 21 ensaios físicos.
              </p>
            </div>

            {/* 2x2 Grid of Diagnostic Panels (Image 3 from Hector) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Panel 1: Tempo de rádio por transmissão, por fase */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-white">Tempo de Rádio por Transmissão, por Fase</h4>
                  <span className="text-[11px] font-mono text-teal-400">Média por política</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={analytics.phases}
                      margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" unit="s" stroke="#64748b" fontSize={11} domain={[0, 0.6]} />
                      <YAxis type="category" dataKey="policy" stroke="#94a3b8" fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="assoc" name="Assoc Wi-Fi" stackId="a" fill="#38bdf8" />
                      <Bar dataKey="mqtt" name="Conexão MQTT" stackId="a" fill="#2dd4bf" />
                      <Bar dataKey="pub" name="Pub + PUBACK" stackId="a" fill="#34d399" />
                      <Bar dataKey="down" name="Desligamento" stackId="a" fill="#818cf8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  *Wi-Fi + MQTT somam 78% do tempo. Apenas 12% é envio de dados brutos.
                </p>
              </div>

              {/* Panel 2: Distribuição do tempo de cada transmissão (Histograma) */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-white">Distribuição do Tempo de Cada Disparo</h4>
                  <span className="text-[11px] font-mono text-teal-400">n = 5.436 transmissões</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.histogram} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="bin" stroke="#64748b" fontSize={10} />
                      <YAxis unit="%" stroke="#64748b" fontSize={10} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                      <Legend wrapperStyle={{ fontSize: '10px' }} />
                      <Bar dataKey="P1" name="P1 (1 min)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="P2" name="P2 (30 min)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="P3" name="P3 (Adaptativa)" fill="#14b8a6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  *Pico nítido em 0,40 s com cauda curta de retransmissão de beacons.
                </p>
              </div>

              {/* Panel 3: Varredura de intervalos (Invariância de T_on) */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-white">Varredura de Intervalos (Invariância de T_on)</h4>
                  <span className="text-[11px] font-mono text-teal-400">Mediana e Quartis</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.varredura} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="label" stroke="#64748b" fontSize={11} label={{ value: 'Intervalo Real entre Disparos (log)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis unit="s" stroke="#64748b" fontSize={11} domain={[0.2, 0.6]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                      <Line type="monotone" dataKey="mediana" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 5, fill: '#38bdf8' }} name="T_on Mediana (s)" />
                      <Line type="monotone" dataKey="q1" stroke="#64748b" strokeDasharray="3 3" dot={false} name="Q1" />
                      <Line type="monotone" dataKey="q3" stroke="#64748b" strokeDasharray="3 3" dot={false} name="Q3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  *Seja dormindo 7.5s ou 30 minutos, o rádio consome sempre os mesmos ~0,40s por disparo.
                </p>
              </div>

              {/* Panel 4: Ao longo da campanha (Estabilidade Temporal) */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm text-white">Ao Longo da Campanha (Estabilidade de Rádio)</h4>
                  <span className="text-[11px] font-mono text-teal-400">21 ensaios cronológicos</span>
                </div>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis type="number" dataKey="order" stroke="#64748b" fontSize={10} domain={[1, 21]} label={{ value: 'Ordem de Execução (S01 a S07)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 10 }} />
                      <YAxis type="number" dataKey="ton_por_tx" unit="s" stroke="#64748b" fontSize={10} domain={[0.3, 0.9]} />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', fontSize: '11px' }} />
                      <Scatter data={analytics.timeline} fill="#2dd4bf" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  *Estabilidade perfeita em ~0,40s. Apenas o 1º ciclo de boot frio precisou de 0,80s.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: FIDELIDADE RMSE (M6)
           ========================================================================= */}
        {activeMetricTab === 'rmse' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  M6 — Fidelidade da Reconstrução no Gateway (RMSE em p.p.)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Limiar de conformidade agronômica estabelecido: ε_max = 0,10 p.p. de umidade volumétrica.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 self-start md:self-auto">
                Hipótese H3: Confirmada (P3 RMSE = 0,0609 &le; 0,10)
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rmseChartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis unit=" p.p." stroke="#64748b" fontSize={12} tickLine={false} />
                    <Tooltip
                      formatter={(value: any) => [`${value} p.p.`, 'RMSE Médio']}
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', color: '#fff', fontSize: '12px' }}
                    />
                    <ReferenceLine y={0.1} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'ε_max = 0,10', fill: '#ef4444', fontSize: 12 }} />
                    <Bar dataKey="rmse" radius={[8, 8, 0, 0]}>
                      {rmseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-xs text-slate-600">
                <h4 className="font-bold text-sm text-slate-800">Conformidade de Reconstrução:</h4>
                <p><strong>P2 ultrapassou mais que o triplo do limite:</strong> 0,3238 p.p., pois a interpolação retangular de 30 minutos achata a frente de subida de chuvas.</p>
                <p><strong>P3 manteve 0,0609 p.p.</strong>, ficando com folga abaixo da tolerância agronômica máxima (0,10 p.p.).</p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: FRONTEIRA DE PARETO & SENSIBILIDADE Δ
           ========================================================================= */}
        {activeMetricTab === 'pareto' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Fronteira de Pareto &amp; Varredura do Parâmetro Δ
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Compromisso empírico: variação do limiar de detecção Δ (de 0,15 a 0,90 p.p.) vs Tempo de Rádio e RMSE.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 self-start md:self-auto">
                Tag cp4-freeze congelou Δ = 0,30 p.p.
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={paretoPoints} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="delta" stroke="#64748b" fontSize={12} tickLine={false} />
                    <YAxis yAxisId="left" unit="s" stroke="#0d9488" fontSize={12} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" unit=" p.p." stroke="#6366f1" fontSize={12} tickLine={false} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const p = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-xl text-xs space-y-1 shadow-lg border border-slate-700">
                              <div className="font-bold text-teal-400">{p.delta} — {p.note}</div>
                              <div>Tempo de Rádio (M1): <span className="font-mono">{p.ton} s/dia</span></div>
                              <div>Erro RMSE (M6): <span className="font-mono">{p.rmse} p.p.</span></div>
                              <div className={p.admissible ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                                {p.admissible ? '✓ Admissível (RMSE ≤ 0,10)' : '✗ Inadmissível (> ε_max)'}
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <ReferenceLine yAxisId="right" y={0.10} stroke="#ef4444" strokeDasharray="3 3" />
                    <Line yAxisId="left" type="monotone" dataKey="ton" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 5, fill: '#0d9488' }} name="Tempo Rádio (s/dia)" />
                    <Line yAxisId="right" type="monotone" dataKey="rmse" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 5, fill: '#6366f1' }} name="RMSE (p.p.)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-xs text-slate-600">
                <h4 className="font-bold text-sm text-slate-800">O Ponto de Cotovelo:</h4>
                <p>Δ = 0,30 p.p. foi escolhido porque poupa 18% a mais de rádio que 0,15 p.p. sem violar o teto de 0,10 p.p. de erro.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
