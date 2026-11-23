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
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  Award,
  BarChart2,
  CheckCircle,
  Clock,
  Compass,
  Cpu,
  HelpCircle,
  Layers,
  Radio,
  Sliders,
  TrendingDown,
  Wifi,
  Zap,
} from 'lucide-react';
import summaryDataRaw from '../data/summary_results.json';
import { SummaryData } from '../types';

const summaryData = summaryDataRaw as unknown as SummaryData;

export const ResultsDashboard: React.FC = () => {
  const [activeMetricTab, setActiveMetricTab] = useState<'ton' | 'latency' | 'rmse' | 'pareto'>('ton');

  // Primary data for Bar Charts
  const tonChartData = [
    { name: 'P1 (Curta - 1m)', val: 631.8, min: 532.3, max: 731.4, color: '#3b82f6', label: '631,8 s/dia' },
    { name: 'P2 (Longa - 30m)', val: 20.0, min: 19.2, max: 20.9, color: '#f59e0b', label: '20,0 s/dia' },
    { name: 'P3 (Adaptativa)', val: 30.7, min: 22.8, max: 38.6, color: '#0d9488', label: '30,7 s/dia (-95,2%)' },
  ];

  const latencyChartData = [
    { name: 'P1 (Curta)', latency: 0.36, missed: 0, color: '#3b82f6', label: '0,36 s (0 perdidos)' },
    { name: 'P2 (Longa)', latency: 777.4, missed: 10, color: '#ef4444', label: '777,4 s (~13 min)' },
    { name: 'P3 (Adaptativa)', latency: 0.42, missed: 0, color: '#0d9488', label: '0,42 s (0 perdidos)' },
  ];

  const rmseChartData = [
    { name: 'P1 (Curta)', rmse: 0.0003, color: '#3b82f6', label: '0,0003 p.p.' },
    { name: 'P2 (Longa)', rmse: 0.3238, color: '#ef4444', label: '0,3238 p.p. (Inadmissível)' },
    { name: 'P3 (Adaptativa)', rmse: 0.0609, color: '#0d9488', label: '0,0609 p.p. (Conforme)' },
  ];

  const paretoPoints = [
    { delta: 'Δ = 0,15', deltaNum: 0.15, ton: 37.5, rmse: 0.0386, admissible: true, note: 'Alta fidelidade' },
    { delta: 'Δ = 0,30', deltaNum: 0.30, ton: 30.7, rmse: 0.0609, admissible: true, note: 'Ponto Ótimo CP4 (Cotovelo)' },
    { delta: 'Δ = 0,45', deltaNum: 0.45, ton: 27.4, rmse: 0.0778, admissible: true, note: 'Econômico' },
    { delta: 'Δ = 0,60', deltaNum: 0.60, ton: 26.5, rmse: 0.0954, admissible: true, note: 'Limite da tolerância' },
    { delta: 'Δ = 0,90', deltaNum: 0.90, ton: 25.1, rmse: 0.1276, admissible: false, note: 'Inadmissível (> ε_max)' },
  ];

  const connectionPhases = [
    { phase: 'Wi-Fi Scan & Associação', time: '210 ms', pct: 52, color: 'bg-blue-500' },
    { phase: 'Handshake MQTT + TLS', time: '105 ms', pct: 26, color: 'bg-teal-500' },
    { phase: 'Publicação de Payload & ACK', time: '48 ms', pct: 12, color: 'bg-emerald-500' },
    { phase: 'Desconexão e Limpeza', time: '40 ms', pct: 10, color: 'bg-indigo-500' },
  ];

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1480px] mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Evidências Experimentais
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
          Dashboard de Métricas Centrais & Hipóteses
        </h2>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Resultados consolidados a partir de 21 execuções completas com replay de traços reais de solo no ESP32, com nível de confiança de 95% (bootstrap BCA).
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1.5 rounded-xl flex flex-wrap gap-1 border border-slate-200">
          <button
            onClick={() => setActiveMetricTab('ton')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeMetricTab === 'ton'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Tempo de Rádio (M1)</span>
          </button>
          <button
            onClick={() => setActiveMetricTab('latency')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeMetricTab === 'latency'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Latência & Eventos (M4/M5)</span>
          </button>
          <button
            onClick={() => setActiveMetricTab('rmse')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeMetricTab === 'rmse'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Fidelidade RMSE (M6)</span>
          </button>
          <button
            onClick={() => setActiveMetricTab('pareto')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeMetricTab === 'pareto'
                ? 'bg-white text-teal-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Fronteira de Pareto (Sensibilidade Δ)</span>
          </button>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-10">
        {activeMetricTab === 'ton' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  M1 — Tempo de Rádio Ativo Diário (Proxy de Energia)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Média de 7 segmentos de 12h extrapolados para 24h. Intervalo de Confiança de 95% indicado pelas barras.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 self-start md:self-auto">
                Hipótese H1: Rejeitada com p &lt; 10⁻⁶ (Cohen d = 7,86)
              </span>
            </div>

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

              {/* Metric Breakdown Box */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Conclusões sobre o Rádio (M1):</h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-start space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-slate-800">P1 (631,8 s/dia):</strong> Consome ~10,5 minutos de rádio contínuo. Exige bateria recarregável com painel solar robusto.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-slate-800">P2 (20,0 s/dia):</strong> Consumo mínimo (~20s), mas deixa o sistema cego a chuvas intensas.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                    <div>
                      <strong className="text-slate-800">P3 (30,7 s/dia):</strong> Reduz <strong className="text-teal-700">95,2%</strong> do rádio de P1, gastando apenas +10,7 s que P2 para capturar 100% dos eventos!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMetricTab === 'latency' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  M4 & M5 — Latência de Notificação de Eventos & Eventos Perdidos
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Janela máxima admissível de detecção: D_max = 300 segundos (5 minutos).
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800 self-start md:self-auto">
                Hipótese H2: Rejeitada com p &lt; 10⁻⁴ (P3 não perde eventos)
              </span>
            </div>

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

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Eventos Perdidos (M5):</h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    <strong>P2 Perdeu 10 de 10 eventos (100%):</strong> Com período fixo de 30 minutos, o início das chuvas violou sistematicamente o limiar D_max = 300s. Atraso médio de 777 segundos (~13 minutos).
                  </div>
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-teal-800">
                    <strong>P3 e P1: 0 eventos perdidos (0%):</strong> P3 detectou todas as 10 frentes de chuva em apenas <strong>0,42 s</strong>, empatando estatisticamente com a política curta (0,36 s, p = 0,21).
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

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

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4">
                <h4 className="text-sm font-bold text-slate-800">Análise de Reconstrução:</h4>
                <div className="space-y-3 text-xs text-slate-600">
                  <div>
                    <strong className="text-slate-800">Interpolação no Gateway:</strong> Entre as transmissões, o gateway reconstrói a série temporal via interpolação linear ponderada.
                  </div>
                  <div>
                    <strong className="text-slate-800">Falha Crítica de P2 (0,3238 p.p.):</strong> O erro de P2 é mais que o triplo do máximo permitido, porque a interpolação em degraus de 30 min achata completamente o pico das curvas.
                  </div>
                  <div>
                    <strong className="text-teal-700">Acurácia de P3 (0,0609 p.p.):</strong> Fica 39% abaixo do teto de erro estipulado, garantindo fidelidade para modelos de balanço hídrico agronômico.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeMetricTab === 'pareto' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-2">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Fronteira de Pareto & Varredura do Parâmetro Δ
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

              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3">
                <h4 className="text-sm font-bold text-slate-800">Por que Δ = 0,30 p.p.?</h4>
                <div className="text-xs text-slate-600 space-y-2">
                  <p>
                    <strong>Ponto de Cotovelo (Knee Point):</strong> Aumentar Δ de 0,15 para 0,30 poupa 18% a mais de energia (cai de 37,5s para 30,7s) com impacto mínimo no RMSE (0,038 para 0,061).
                  </p>
                  <p>
                    <strong>Zona Inadmissível:</strong> Para Δ &ge; 0,90, o RMSE estoura a barreira de 0,10 p.p., tornando as leituras inviáveis para controle de irrigação.
                  </p>
                  <p className="text-slate-500">
                    O limiar de 0,30 p.p. foi rigorosamente congelado na tag Git antes de rodar os 21 replays na placa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Network Connection Phase Breakdown */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm mb-10 border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Wifi className="w-4 h-4" />
              <span>Análise de Overhead de Protocolo</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Decomposição Temporal de um Ciclo de Transmissão Wi-Fi / MQTT
            </h3>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Tempo Médio por Disparo: <strong className="text-teal-300">~403 ms</strong>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
          No ecossistema IoT baseado em redes IP (Wi-Fi 802.11 e MQTT), o rádio ativo consome energia majoritariamente no <strong>custo fixo de conexão</strong>, não na transferência de bytes de dados. Despertar para enviar 4 bytes ou 400 bytes tem praticamente o mesmo custo energético!
        </p>

        {/* Phase Progress Bar */}
        <div className="w-full h-5 rounded-full overflow-hidden flex mb-4 shadow-inner">
          {connectionPhases.map((phase, idx) => (
            <div
              key={idx}
              className={`${phase.color} h-full transition-all flex items-center justify-center text-[10px] font-bold text-white`}
              style={{ width: `${phase.pct}%` }}
              title={`${phase.phase}: ${phase.time} (${phase.pct}%)`}
            >
              {phase.pct > 15 ? `${phase.pct}%` : ''}
            </div>
          ))}
        </div>

        {/* Phase Legend Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {connectionPhases.map((phase, idx) => (
            <div key={idx} className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`w-2.5 h-2.5 rounded-full ${phase.color}`} />
                <span className="text-xs font-bold text-white">{phase.pct}%</span>
              </div>
              <div className="text-xs font-medium text-slate-300">{phase.phase}</div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">{phase.time}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-3.5 bg-slate-800/50 rounded-xl border border-slate-700/80 flex items-start space-x-3 text-xs text-slate-300">
          <Award className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          <span>
            <strong>Conclusão Arquitetural:</strong> Como 78% do tempo do rádio é gasto apenas em negociação Wi-Fi (52%) e handshake MQTT (26%), <em>a única forma viável de prolongar a bateria de sensores Wi-Fi é o Duty Cycling com supressão de transmissões inúteis</em> (como feito em P3).
          </span>
        </div>
      </div>

      {/* Hypothesis Testing Summary Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center space-x-2 mb-4">
          <CheckCircle className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-bold text-slate-900">
            Quadro Formal de Testes de Hipótese (Protocolo Experimental)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Hipótese</th>
                <th className="py-3 px-4">Enunciado & Métrica</th>
                <th className="py-3 px-4">Critério de Decisão</th>
                <th className="py-3 px-4">Evidência Estatística</th>
                <th className="py-3 px-4">Veredito</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">H1 (Rádio)</td>
                <td className="py-3 px-4">P3 reduz tempo de rádio em relação a P1 (M1).</td>
                <td className="py-3 px-4 font-mono text-xs">t-pareado unilateral, α = 0,05</td>
                <td className="py-3 px-4">30,7s vs 631,8s (p = 8,3 × 10⁻⁷, d = 7,86)</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                    Rejeitada H0 (Sucesso)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">H2 (Latência)</td>
                <td className="py-3 px-4">P3 detecta eventos sem violar D_max = 300s (M4/M5).</td>
                <td className="py-3 px-4 font-mono text-xs">Atraso ≤ 300s, eventos perdidos = 0</td>
                <td className="py-3 px-4">0,42s de atraso, 0 perdas (P2 perdeu 100%)</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                    Rejeitada H0 (Sucesso)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">H3 (Fidelidade)</td>
                <td className="py-3 px-4">Erro de reconstrução de P3 é inferior a ε_max (M6).</td>
                <td className="py-3 px-4 font-mono text-xs">IC95% superior do RMSE ≤ 0,10</td>
                <td className="py-3 px-4">RMSE = 0,0609 p.p. (IC95% hi = 0,0783 &le; 0,10)</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                    Não Rejeitada (Conforme)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-bold text-slate-900">H4 (Sobrecarga)</td>
                <td className="py-3 px-4">Cálculo das regras na CPU do ESP32 tem custo desprezível.</td>
                <td className="py-3 px-4 font-mono text-xs">T_dec &lt; 10 ms e &lt; 1% de T_awake</td>
                <td className="py-3 px-4">T_dec médio = 74,2 µs (0,0028% do tempo ativo)</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800">
                    Confirmada (Insignificante)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
