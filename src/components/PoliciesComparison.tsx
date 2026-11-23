import React, { useState } from 'react';
import { CheckCircle2, Clock, Cpu, HelpCircle, Layers, Radio, Sparkles, Zap } from 'lucide-react';

export const PoliciesComparison: React.FC = () => {
  const [selectedPolicy, setSelectedPolicy] = useState<'P1' | 'P2' | 'P3'>('P3');

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-[1480px] mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Espaço de Projeto
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
          As Três Políticas de Atividade Comparadas
        </h2>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Para garantir rigor metodológico, todas as políticas foram executadas no mesmo hardware ESP32, sob os mesmos traços reais de solo, com parâmetros congelados previamente na tag <code className="bg-slate-100 text-teal-700 px-1.5 py-0.5 rounded font-mono text-xs font-bold">cp4-freeze</code>.
        </p>
      </div>

      {/* Policy Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Policy 1: Short */}
        <div 
          onClick={() => setSelectedPolicy('P1')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all relative ${
            selectedPolicy === 'P1'
              ? 'bg-blue-50/60 border-blue-500 shadow-md ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
              Baseline de Alta Frequência
            </span>
            <Radio className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-3">P1 — Periódica Curta</h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Ts = 60 segundos (1 min)</p>

          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>1.440 transmissões/dia:</strong> transmite a cada despertar.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Fidelidade máxima:</strong> RMSE de 0,0003 p.p. (erro quase nulo).</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <span><strong>Detecção imediata:</strong> atraso médio de 0,36 s para chuva.</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Tempo de Rádio Ativo</div>
            <div className="text-xl font-extrabold text-blue-600 mt-0.5">631,8 s/dia <span className="text-xs font-normal text-slate-500">(10,5 min)</span></div>
          </div>
        </div>

        {/* Policy 2: Long */}
        <div 
          onClick={() => setSelectedPolicy('P2')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all relative ${
            selectedPolicy === 'P2'
              ? 'bg-amber-50/60 border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
              Baseline de Baixa Frequência
            </span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-3">P2 — Periódica Longa</h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Tl = 1.800 segundos (30 min)</p>

          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Apenas 48 transmissões/dia:</strong> dorme a maior parte do tempo.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span><strong>Consumo mínimo:</strong> rádio ligado por apenas 20,0 s/dia.</span>
            </div>
            <div className="flex items-start space-x-2 text-rose-600 font-medium">
              <span className="text-rose-500 shrink-0 font-bold">✕</span>
              <span><strong>Cego a eventos rápidos:</strong> atraso de 13 min e 100% dos eventos perdidos.</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Tempo de Rádio Ativo</div>
            <div className="text-xl font-extrabold text-amber-600 mt-0.5">20,0 s/dia <span className="text-xs font-normal text-slate-500">(0,3 min)</span></div>
          </div>
        </div>

        {/* Policy 3: Adaptive */}
        <div 
          onClick={() => setSelectedPolicy('P3')}
          className={`cursor-pointer rounded-2xl p-6 border transition-all relative ${
            selectedPolicy === 'P3'
              ? 'bg-teal-50/60 border-teal-500 shadow-md ring-2 ring-teal-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-100 text-teal-800 flex items-center space-x-1">
              <Sparkles className="w-3 h-3" />
              <span>Proposta Grupo 21</span>
            </span>
            <Zap className="w-5 h-5 text-teal-600" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-3">P3 — Adaptativa na Borda</h3>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Amostra a cada 60 s em deep sleep</p>

          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span><strong>Média 65 transmissões/dia:</strong> liga rádio em apenas 4,5% dos ciclos!</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span><strong>Notificação em 0,42 s:</strong> mesmo atraso de P1, com 0 eventos perdidos.</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span><strong>Erro controlado:</strong> RMSE de 0,061 p.p., abaixo do teto de 0,1.</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/80">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Tempo de Rádio Ativo</div>
            <div className="text-xl font-extrabold text-teal-600 mt-0.5">30,7 s/dia <span className="text-xs font-normal text-slate-500">(-95,2% vs P1)</span></div>
          </div>
        </div>
      </div>

      {/* Deep Dive into Rules */}
      <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-teal-600" />
          <span>As 4 Regras de Transmissão da Política Adaptativa (P3)</span>
        </h3>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          O ESP32 desperta em deep sleep a cada 60 segundos, lê o valor de umidade e avalia as seguintes condições em ordem de prioridade:
        </p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center">a</span>
              <h4 className="font-bold text-sm text-slate-800">Mudança de Estado</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detecta transição entre <strong>solo seco</strong> (y &le; &theta; - h) e <strong>solo úmido</strong> (y &ge; &theta; + h) com histerese para evitar oscilações.
            </p>
            <div className="mt-3 font-mono text-[11px] bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
              s_k &ne; s_últTX
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center">b</span>
              <h4 className="font-bold text-sm text-slate-800">Variação Significativa</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transmite quando a umidade varia mais do que o limiar &Delta; desde a última transmissão confirmada por PUBACK.
            </p>
            <div className="mt-3 font-mono text-[11px] bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
              |y_k - y_últTX| &ge; &Delta;
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center">d</span>
              <h4 className="font-bold text-sm text-slate-800">Subida Rápida (Chuva)</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Janela móvel de 30 minutos: se a umidade subir &ge; &Delta; em relação ao mínimo da janela, transmite imediatamente.
            </p>
            <div className="mt-3 font-mono text-[11px] bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
              y_k - min(y_janela) &ge; &Delta;
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center">c</span>
              <h4 className="font-bold text-sm text-slate-800">Heartbeat de Segurança</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Se passarem 30 minutos sem nenhuma transmissão por evento, o nó envia uma mensagem para provar que está vivo.
            </p>
            <div className="mt-3 font-mono text-[11px] bg-white px-2 py-1 rounded border border-slate-200 text-slate-700">
              k - k_últTX &ge; 30 ciclos
            </div>
          </div>
        </div>

        {/* Parameters banner */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div><strong className="text-slate-700">Limiar de Seca (&theta;):</strong> 4,02% VWC</div>
          <div><strong className="text-slate-700">Histerese (h):</strong> 0,20 p.p.</div>
          <div><strong className="text-slate-700">Variação (&Delta;):</strong> 0,30 p.p.</div>
          <div><strong className="text-slate-700">Janela de Chuva (w):</strong> 30 min</div>
          <div><strong className="text-slate-700">Erro Máx (&epsilon;_max):</strong> 0,10 p.p.</div>
          <div><strong className="text-slate-700">Compressão (c):</strong> 8x</div>
        </div>
      </div>
    </section>
  );
};
