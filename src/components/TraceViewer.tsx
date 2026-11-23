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
} from 'recharts';
import { TracePoint } from '../types';
import traceDataRaw from '../data/s01_trace.json';
import { Activity, AlertCircle, CheckCircle2, CloudRain, Filter, Info, Radio, Zap } from 'lucide-react';

const traceData = traceDataRaw as TracePoint[];

export const TraceViewer: React.FC = () => {
  const [showP1, setShowP1] = useState(false);
  const [showP2, setShowP2] = useState(true);
  const [showP3, setShowP3] = useState(true);
  const [zoomRain, setZoomRain] = useState(false);

  // Filter or window data if zoomed
  const displayData = useMemo(() => {
    if (zoomRain) {
      // Zoom into rain event: hours 4 to 7 (minutes 240 to 420)
      return traceData.filter((d) => d.hour >= 3.8 && d.hour <= 7.2);
    }
    // For full 720 points, show all
    return traceData;
  }, [zoomRain]);

  // Transform data for recharts markers
  const chartData = useMemo(() => {
    return displayData.map((d) => ({
      hour: Number(d.hour.toFixed(2)),
      minute: d.k,
      moisture: d.moisture,
      p1Tx: d.p1 ? d.moisture : null,
      p2Tx: d.p2 ? d.moisture : null,
      p3Tx: d.p3 ? d.moisture : null,
      p3Reason: d.p3_reason,
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
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
              Hardware-in-the-Loop Replay
            </span>
            <span className="text-xs text-slate-500 font-mono">Segmento S01 (NEON Field Trace)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Simulador & Visualizador de Traço Real
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Série temporal de 12 horas (720 amostras) de umidade volumétrica do solo (% VWC) coletada em campo, mostrando exatamente os instantes de disparo de cada política.
          </p>
        </div>

        {/* Action Controls */}
        <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setZoomRain(!zoomRain)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              zoomRain
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>{zoomRain ? 'Ver 12 Horas Completas' : 'Focar Evento de Chuva (4h-7h)'}</span>
          </button>
        </div>
      </div>

      {/* KPI Cards for S01 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">P1: Periódica Curta</div>
          <div className="text-2xl font-extrabold text-blue-600 mt-1">
            {stats.p1Count} <span className="text-xs font-normal text-slate-500">transmissões</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">1 TX / minuto (100% dos ciclos)</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">P2: Periódica Longa</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">
            {stats.p2Count} <span className="text-xs font-normal text-slate-500">transmissões</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-0.5">Perde o início da frente de chuva!</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide">P3: Adaptativa Mista</div>
          <div className="text-2xl font-extrabold text-teal-600 mt-1">
            {stats.p3Count} <span className="text-xs font-normal text-slate-500">transmissões</span>
          </div>
          <div className="text-[11px] text-teal-700 font-medium mt-0.5">
            {stats.p3Delta} por variação &Delta; + {stats.p3Hb} heartbeats
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm bg-gradient-to-br from-teal-50/50 to-emerald-50/50">
          <div className="text-xs font-semibold text-teal-800 uppercase tracking-wide">Economia em S01</div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            -95,8% <span className="text-xs font-normal text-slate-500">vs P1</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Latência sub-segundo preservada</div>
        </div>
      </div>

      {/* Chart Card */}
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
            <LineChart
              data={chartData}
              margin={{ top: 15, right: 20, left: 0, bottom: 20 }}
            >
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

              {/* Rain zone highlight (around hour 4.8 to 6.2) */}
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
                          {!data.p1Tx && !data.p2Tx && !data.p3Tx && (
                            <div className="text-slate-400 italic">Nenhuma política em rádio ativo neste minuto</div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Physical Soil Moisture Curve */}
              <Line
                type="monotone"
                dataKey="moisture"
                stroke="#0f172a"
                strokeWidth={2.2}
                dot={false}
                name="Sinal Físico (Umidade Solo)"
              />

              {/* P1 Transmissions */}
              {showP1 && (
                <Line
                  type="monotone"
                  dataKey="p1Tx"
                  stroke="#3b82f6"
                  strokeWidth={0}
                  dot={{ r: 1.5, fill: '#3b82f6', stroke: '#1d4ed8' }}
                  isAnimationActive={false}
                  name="P1 Curta (1 min)"
                />
              )}

              {/* P2 Transmissions */}
              {showP2 && (
                <Line
                  type="monotone"
                  dataKey="p2Tx"
                  stroke="#d97706"
                  strokeWidth={0}
                  dot={{ r: 5, fill: '#f59e0b', stroke: '#b45309', strokeWidth: 1.5 }}
                  name="P2 Longa (30 min)"
                />
              )}

              {/* P3 Transmissions */}
              {showP3 && (
                <Line
                  type="monotone"
                  dataKey="p3Tx"
                  stroke="#0d9488"
                  strokeWidth={0}
                  dot={{ r: 4.5, fill: '#14b8a6', stroke: '#0f766e', strokeWidth: 2 }}
                  name="P3 Adaptativa (Eventos + HB)"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Insight Box */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-slate-900" />
              <span>Umidade Real (% VWC)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-amber-700" />
              <span>P2 (A cada 30 min)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 border border-teal-700" />
              <span>P3 (Adaptativa: Δ + Heartbeat)</span>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1.5 rounded-lg flex items-center space-x-2">
            <Info className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>Comportamento Chave:</strong> Entre as horas 5.0 e 5.8, a chuva eleva a umidade em +2,7 p.p. A P3 dispara 6 transmissões contínuas sem atraso, enquanto a P2 dorme cega até o próximo ciclo de 30 minutos.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
