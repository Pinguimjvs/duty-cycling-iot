import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceArea,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { TracePoint } from '../types';
import { useLiveData } from '../context/LiveDataContext';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  CloudRain,
  Columns,
  Eye,
  Filter,
  Info,
  Radio,
  RefreshCw,
  Sliders,
  Zap,
} from 'lucide-react';

export const TraceViewer: React.FC = () => {
  const { traceData, isLive, lastSync, refresh, isSyncing } = useLiveData();
  const [viewMode, setViewMode] = useState<'integrated' | 'panels'>('panels');
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(true);
  const [showP3, setShowP3] = useState(true);
  const [zoomRain, setZoomRain] = useState(false);

  // Filter or window data if zoomed
  const displayData = useMemo(() => {
    if (zoomRain) {
      // Zoom into rain event: hours 3.8 to 7.2 (minutes 228 to 432)
      return traceData.filter((d) => d.hour >= 3.8 && d.hour <= 7.2);
    }
    return traceData;
  }, [zoomRain]);

  // Transform data for recharts markers
  const chartData = useMemo(() => {
    return displayData.map((d) => ({
      hour: Number(d.hour.toFixed(2)),
      minute: d.k,
      moisture: d.moisture,
      vm_p1: d.vm_p1 ?? d.moisture,
      vm_p2: d.vm_p2 ?? d.moisture,
      vm_p3: d.vm_p3 ?? d.moisture,
      p1Tx: d.p1 ? d.moisture : null,
      p2Tx: d.p2 ? (d.vm_p2 ?? d.moisture) : null,
      p3Tx: d.p3 ? (d.vm_p3 ?? d.moisture) : null,
      p3Reason: d.p3_reason,
      cum_p1: d.cum_p1 ?? 0,
      cum_p2: d.cum_p2 ?? 0,
      cum_p3: d.cum_p3 ?? 0,
    }));
  }, [displayData]);

  // Statistics for S01
  const stats = useMemo(() => {
    const p1Count = traceData.filter((d) => d.p1).length;
    const p2Count = traceData.filter((d) => d.p2).length;
    const p3Count = traceData.filter((d) => d.p3).length;
    const p3Delta = traceData.filter((d) => d.p3_reason === 'variacao_delta').length;
    const p3Hb = traceData.filter((d) => d.p3_reason === 'heartbeat').length;
    return { p1Count, p2Count, p3Count, p3Delta, p3Hb };
  }, []);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1480px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
              Hardware-in-the-Loop Replay
            </span>
            <span className="text-xs text-slate-500 font-mono">Segmento S01 (NEON Field Trace · 09/06/2025)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Simulador de Traço Real &amp; Reconstrução na VM
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Série temporal de 12 horas (720 amostras) de umidade do solo (% VWC). Compare o sinal original com a série reconstruída no servidor MQTT para cada política.
          </p>
        </div>

        {/* View Mode & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setViewMode('panels')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'panels' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-teal-600" />
              <span>Painéis por Política &amp; Rádio Acumulado</span>
            </button>
            <button
              onClick={() => setViewMode('integrated')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                viewMode === 'integrated' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Visão Sobreposta</span>
            </button>
          </div>

          <button
            onClick={() => setZoomRain(!zoomRain)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              zoomRain
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>{zoomRain ? '12h Completas' : 'Zoom Chuva (4h-7h)'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for S01 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">P1 · Periódica 60s</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            434,1 <span className="text-xs font-normal text-slate-500">s de rádio</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">720 transmissões · Atraso: 0,337 s</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">P2 · Periódica 30min</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            10,0 <span className="text-xs font-normal text-slate-500">s de rádio</span>
          </div>
          <div className="text-[11px] text-red-600 font-bold mt-0.5">24 TX · Atraso: 1.620 s (PERDIDO)</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">P3 · Adaptativa Mista</div>
          <div className="text-2xl font-extrabold text-teal-600 mt-1">
            24,0 <span className="text-xs font-normal text-slate-500">s de rádio</span>
          </div>
          <div className="text-[11px] text-teal-700 font-semibold mt-0.5">30 TX · Atraso: 0,349 s (0 perdas)</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm bg-gradient-to-br from-teal-50/50 to-emerald-50/50">
          <div className="text-xs font-semibold text-teal-800 uppercase tracking-wide">Economia no Traço S01</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            -94,5% <span className="text-xs font-normal text-slate-500">vs P1</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Fidelidade sub-segundo preservada</div>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: TRÊS FAIXAS POR POLÍTICA + RÁDIO ACUMULADO (IMAGEM 1 DO HECTOR)
         ========================================================================= */}
      {viewMode === 'panels' ? (
        <div className="bg-slate-950 text-white rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400 gap-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-slate-400" />
                <span>Sensor Físico</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-blue-500" />
                <span>P1 na VM</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-amber-500" />
                <span>P2 na VM</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-3 h-0.5 bg-teal-400" />
                <span>P3 na VM</span>
              </span>
            </div>
            <span className="text-teal-400 font-semibold">Painéis Um por Política + Rádio Acumulado (log)</span>
          </div>

          {/* Panel 1: P1 · periódica 60 s */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-bold text-blue-400">P1 · periódica 60 s</span>
              <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">Atraso: 0,337 s</span>
                <span>720 transmissões · 434,1 s de rádio</span>
              </div>
            </div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <YAxis domain={[5.0, 8.5]} stroke="#64748b" fontSize={10} tickCount={4} />
                  <XAxis dataKey="hour" hide />
                  <Line type="monotone" dataKey="moisture" stroke="#64748b" strokeWidth={1} dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="vm_p1" stroke="#3b82f6" strokeWidth={1.8} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Panel 2: P2 · periódica 30 min */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-bold text-amber-400">P2 · periódica 30 min</span>
              <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                <span className="bg-red-500/20 text-red-300 px-2 py-0.5 rounded border border-red-500/30">
                  Atraso: 1.620 s · PERDIDO
                </span>
                <span>24 transmissões · 10,0 s de rádio</span>
              </div>
            </div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <YAxis domain={[5.0, 8.5]} stroke="#64748b" fontSize={10} tickCount={4} />
                  <XAxis dataKey="hour" hide />
                  <Line type="monotone" dataKey="moisture" stroke="#64748b" strokeWidth={1} dot={false} isAnimationActive={false} />
                  <Line type="stepAfter" dataKey="vm_p2" stroke="#f59e0b" strokeWidth={1.8} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Panel 3: P3 · adaptativa */}
          <div className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className="font-bold text-teal-400">P3 · adaptativa mista</span>
              <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                <span className="bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded border border-teal-500/30">
                  Atraso: 0,349 s
                </span>
                <span>30 transmissões · 24,0 s de rádio</span>
              </div>
            </div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <YAxis domain={[5.0, 8.5]} stroke="#64748b" fontSize={10} tickCount={4} />
                  <XAxis dataKey="hour" hide />
                  <Line type="monotone" dataKey="moisture" stroke="#64748b" strokeWidth={1} dot={false} isAnimationActive={false} />
                  <Line type="stepAfter" dataKey="vm_p3" stroke="#14b8a6" strokeWidth={1.8} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Panel 4: Tempo de rádio acumulado (s), escala log (Bottom panel of Hector Image 1) */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                Tempo de Rádio Acumulado (s), Escala Logarítmica
              </span>
              <div className="flex items-center space-x-4 font-mono text-[11px]">
                <span className="text-blue-400 font-bold">● P1: 434,1 s</span>
                <span className="text-teal-400 font-bold">● P3: 24,0 s</span>
                <span className="text-amber-400 font-bold">● P2: 10,0 s</span>
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis
                    dataKey="hour"
                    unit="h"
                    stroke="#64748b"
                    fontSize={11}
                    label={{ value: 'Tempo Decorrido (Horas)', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 10 }}
                  />
                  <YAxis
                    scale="log"
                    domain={[1, 1000]}
                    stroke="#64748b"
                    fontSize={11}
                    ticks={[1, 10, 100, 1000]}
                    unit="s"
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '11px' }}
                  />
                  <Line type="monotone" dataKey="cum_p1" stroke="#3b82f6" strokeWidth={2.2} dot={false} name="P1 Acumulado (s)" />
                  <Line type="monotone" dataKey="cum_p3" stroke="#14b8a6" strokeWidth={2.2} dot={false} name="P3 Acumulado (s)" />
                  <Line type="monotone" dataKey="cum_p2" stroke="#f59e0b" strokeWidth={2.2} dot={false} name="P2 Acumulado (s)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            VIEW MODE 2: VISÃO SOBREPOSTA (COM TOGGLE DE CAMADAS)
           ========================================================================= */
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          {/* Toggle Layers */}
          <div className="flex flex-wrap items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-3">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
              <Filter className="w-4 h-4 text-slate-500" />
              <span>Camadas no Gráfico:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowP1(!showP1)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  showP1
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>P1 Curta ({stats.p1Count} TXs)</span>
              </button>

              <button
                onClick={() => setShowP2(!showP2)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  showP2
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>P2 Longa ({stats.p2Count} TXs)</span>
              </button>

              <button
                onClick={() => setShowP3(!showP3)}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                  showP3
                    ? 'bg-teal-100 text-teal-800 border-teal-300 ring-1 ring-teal-500/30'
                    : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                <span>P3 Adaptativa ({stats.p3Count} TXs)</span>
              </button>
            </div>
          </div>

          {/* Main Chart */}
          <div className="w-full h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="hour"
                  unit="h"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  label={{ value: 'Tempo Decorrido (Horas)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  unit="%"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  label={{ value: 'Umidade (% VWC)', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                />

                <ReferenceArea
                  x1={4.7}
                  x2={6.3}
                  stroke="#38bdf8"
                  strokeOpacity={0.3}
                  fill="#0284c7"
                  fillOpacity={0.06}
                />

                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-xl p-3 shadow-xl border border-slate-700 min-w-[200px]">
                          <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-700 font-mono">
                            <span className="text-teal-400 font-bold">{data.hour}h ({data.minute} min)</span>
                            <span className="text-slate-300">{data.moisture.toFixed(2)}% VWC</span>
                          </div>
                          <div className="space-y-1">
                            {data.p1Tx && showP1 && (
                              <div className="flex items-center justify-between text-blue-300">
                                <span>P1 (Periódica):</span>
                                <span className="font-semibold">Transmissão ativa</span>
                              </div>
                            )}
                            {data.p2Tx && (
                              <div className="flex items-center justify-between text-amber-300">
                                <span>P2 (Periódica 30m):</span>
                                <span className="font-semibold">Disparo periódico</span>
                              </div>
                            )}
                            {data.p3Tx && (
                              <div className="flex items-center justify-between text-emerald-300">
                                <span>P3 (Adaptativa):</span>
                                <span className="font-bold underline decoration-teal-400">
                                  {data.p3Reason === 'variacao_delta' ? '⚡ Variação Δ (Chuva)' : '💓 Heartbeat'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Line type="monotone" dataKey="moisture" stroke="#0f172a" strokeWidth={2.2} dot={false} name="Sinal Físico (Sensor)" />

                {showP1 && (
                  <Line type="monotone" dataKey="p1Tx" stroke="#3b82f6" strokeWidth={0} dot={{ r: 1.5, fill: '#3b82f6', stroke: '#1d4ed8' }} isAnimationActive={false} name="P1 Curta (1 min)" />
                )}

                {showP2 && (
                  <Line type="monotone" dataKey="p2Tx" stroke="#d97706" strokeWidth={0} dot={{ r: 5, fill: '#f59e0b', stroke: '#b45309', strokeWidth: 1.5 }} name="P2 Longa (30 min)" />
                )}

                {showP3 && (
                  <Line type="monotone" dataKey="p3Tx" stroke="#0d9488" strokeWidth={0} dot={{ r: 4.5, fill: '#14b8a6', stroke: '#0f766e', strokeWidth: 2 }} name="P3 Adaptativa" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </section>
  );
};
