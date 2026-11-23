import React, { useState } from 'react';
import {
  AlertCircle,
  BatteryCharging,
  BatteryMedium,
  CheckCircle2,
  Clock,
  Compass,
  Cpu,
  Droplets,
  Factory,
  Flame,
  HelpCircle,
  Layers,
  Lightbulb,
  Radio,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';

export const UseCasesGuide: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<'p1' | 'p2' | 'p3' | 'calibration'>('p3');

  // Battery Calculator State
  const [batteryCapacity, setBatteryCapacity] = useState<number>(2500); // 2500 mAh (ex: 18650 Li-ion)
  const [eventsPerDay, setEventsPerDay] = useState<number>(1); // 1 evento de chuva diário
  const [sleepCurrentUa, setSleepCurrentUa] = useState<number>(15); // 15 uA deep sleep

  // Calculation parameters:
  // Active radio current: 120 mA
  // P1: Ton = 631.8 s/day -> Active mAh/dia = (631.8 / 3600) * 120 = 21.06 mAh/dia
  // Sleep time: 86400 - 631.8 = 85768 s -> Sleep mAh/dia = (85768 / 3600) * 0.015 mA = 0.357 mAh/dia
  // Total P1: ~21.42 mAh/dia

  // P2: Ton = 20.0 s/day -> Active mAh/dia = (20.0 / 3600) * 120 = 0.667 mAh/dia
  // Sleep time: 86400 - 20 = 86380 s -> Sleep mAh/dia = (86380 / 3600) * 0.015 mA = 0.360 mAh/dia
  // Total P2: ~1.03 mAh/dia

  // P3: Baseline (0 events) = 48 heartbeats * 0.403 s = 19.34 s
  // Each rain event adds ~6 transmissions * 0.403s = 2.42s
  const p3Ton = 19.34 + eventsPerDay * 2.42;
  const p1DailyMah = (631.8 / 3600) * 120 + ((86400 - 631.8) / 3600) * (sleepCurrentUa / 1000);
  const p2DailyMah = (20.0 / 3600) * 120 + ((86400 - 20.0) / 3600) * (sleepCurrentUa / 1000);
  const p3DailyMah = (p3Ton / 3600) * 120 + ((86400 - p3Ton) / 3600) * (sleepCurrentUa / 1000);

  // Lifetime in days (assuming 85% usable battery capacity due to self-discharge and voltage cutoff)
  const usableMah = batteryCapacity * 0.85;
  const p1Days = Math.round(usableMah / p1DailyMah);
  const p2Days = Math.round(usableMah / p2DailyMah);
  const p3Days = Math.round(usableMah / p3DailyMah);

  const p1Years = (p1Days / 365).toFixed(1);
  const p2Years = (p2Days / 365).toFixed(1);
  const p3Years = (p3Days / 365).toFixed(1);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1480px] mx-auto">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
          Guia de Decisão & Arquitetura de Projeto
        </span>
        <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
          Análise Estratégica dos Casos de Uso
        </h2>
        <p className="text-slate-600 mt-2 text-sm sm:text-base">
          Quando aplicar cada política de transmissão na prática da engenharia e por que a política adaptativa depende criticamente de calibração específica do domínio.
        </p>
      </div>

      {/* Case Navigation Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <button
          onClick={() => setSelectedCase('p1')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedCase === 'p1'
              ? 'bg-blue-50/80 border-blue-500 shadow-sm ring-1 ring-blue-500/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-blue-600 mb-2">
            <Radio className="w-5 h-5" />
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100">Ts = 1 min</span>
          </div>
          <div className="font-bold text-sm text-slate-900">Quando usar P1 (Curta)?</div>
          <div className="text-xs text-slate-500 mt-1">Malha fechada, segurança de vida e energia abundante</div>
        </button>

        <button
          onClick={() => setSelectedCase('p2')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedCase === 'p2'
              ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-1 ring-amber-500/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-amber-600 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100">TL = 30 min</span>
          </div>
          <div className="font-bold text-sm text-slate-900">Quando usar P2 (Longa)?</div>
          <div className="text-xs text-slate-500 mt-1">Dinâmica ultralenta, sensores enterrados e 10+ anos de pilha</div>
        </button>

        <button
          onClick={() => setSelectedCase('p3')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedCase === 'p3'
              ? 'bg-teal-50/80 border-teal-500 shadow-sm ring-1 ring-teal-500/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-teal-600 mb-2">
            <Sparkles className="w-5 h-5" />
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-teal-100">Ideal Teórico</span>
          </div>
          <div className="font-bold text-sm text-slate-900">Por que P3 é o Ideal?</div>
          <div className="text-xs text-slate-500 mt-1">O melhor dos dois mundos: economia de P2 com prontidão de P1</div>
        </button>

        <button
          onClick={() => setSelectedCase('calibration')}
          className={`p-4 rounded-xl border text-left transition-all ${
            selectedCase === 'calibration'
              ? 'bg-purple-50/80 border-purple-500 shadow-sm ring-1 ring-purple-500/30'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-purple-600 mb-2">
            <Compass className="w-5 h-5" />
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100">Crucial</span>
          </div>
          <div className="font-bold text-sm text-slate-900">A Lição da Calibração</div>
          <div className="text-xs text-slate-500 mt-1">Por que cada adaptativa depende do domínio e do ruído</div>
        </button>
      </div>

      {/* Case Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-12">
        {selectedCase === 'p1' && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                P1
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Casos de Uso Ideais para a Política Periódica Curta (P1)
                </h3>
                <p className="text-xs text-slate-500">Transmissão contínua em alta taxa (1 por minuto ou superior)</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              A política periódica curta é frequentemente descartada em artigos acadêmicos como "ineficiente energeticamente". No entanto, ela é a <strong>única arquitetura admissível</strong> em ambientes onde a perda de pacotes ou o atraso na detecção acarreta risco de morte, falha de processo industrial ou onde há fartura de energia elétrica.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm mb-2">
                  <Factory className="w-4 h-4" />
                  <h4>Controle em Malha Fechada</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Estufas comerciais com injeção de CO₂ e irrigação aeropônica por nebulização. Um atraso de 5 minutos na leitura de umidade radicular desidrata as mudas antes que o gateway possa atuar nas eletroválvulas.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center space-x-2 text-red-600 font-bold text-sm mb-2">
                  <ShieldAlert className="w-4 h-4" />
                  <h4>Segurança Crítica & UTI</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monitoramento de sinais vitais de pacientes em leitos hospitalares, monitoramento de pressão em gasodutos e detecção de centelhas em refinarias. Não há tolerância para espera por limiar ou filtragem de eventos.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center space-x-2 text-emerald-600 font-bold text-sm mb-2">
                  <BatteryCharging className="w-4 h-4" />
                  <h4>Alimentação Abundante</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nós conectados diretamente à rede elétrica (tomada 110/220V), Power-over-Ethernet (PoE) ou sistemas fotovoltaicos superdimensionados (placa 50W com bateria 12V 45Ah). Onde a energia é ilimitada, economizar rádio traz complexidade de software sem ganho operacional.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedCase === 'p2' && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                P2
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Casos de Uso Ideais para a Política Periódica Longa (P2)
                </h3>
                <p className="text-xs text-slate-500">Transmissão esparsa em baixa taxa (1 a cada 30 minutos, 1 hora ou diária)</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              A política longa é recomendada quando o fenômeno monitorado possui <strong>inércia física gigantesca</strong> (onde variações relevantes levam semanas para acontecer) ou quando a substituição física da bateria é financeiramente proibitiva ou logisticamente impossível.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center space-x-2 text-amber-700 font-bold text-sm mb-2">
                  <Droplets className="w-4 h-4" />
                  <h4>Aquíferos & Hidrogeologia</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Monitoramento de lençóis freáticos profundos a 50 ou 100 metros da superfície. O nível da água subterrânea varia em escala sazonal de meses. Despertar a cada 1 minuto só desperdiçaria bateria registrando o mesmo valor por semanas a fio.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center space-x-2 text-slate-700 font-bold text-sm mb-2">
                  <Factory className="w-4 h-4" />
                  <h4>Deformação em Barragens</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Extensômetros embutidos no concreto de represas hidrelétricas para medir assentamento estrutural e dilatação térmica sazonal. A variação é de frações de milímetro por ano.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm mb-2">
                  <BatteryMedium className="w-4 h-4" />
                  <h4>Instalações Inacessíveis (15 Anos)</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sensores enterrados sob o asfalto de rodovias ou na copa de árvores primárias na Amazônia. Nesses nós, o custo logístico de deslocar uma equipe para trocar uma bateria supera US$ 5.000. Uma célula de Li-SOCl₂ com P2 opera ininterruptamente por mais de uma década.
                </p>
              </div>
            </div>
          </div>
        )}

        {selectedCase === 'p3' && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                P3
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  Por que a Política Adaptativa Mista (P3) é o Ideal Teórico e Prático?
                </h3>
                <p className="text-xs text-slate-500">A fusão de alta reatividade com consumo em repouso próximo ao mínimo físico</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Em quase todos os cenários naturais (solo, clima, qualidade do ar, tráfego), o mundo físico alterna entre longos períodos de <strong className="text-slate-900">quiescência</strong> (onde quase nada muda) e breves episódios de <strong className="text-slate-900">alta dinâmica</strong> (uma tempestade torrencial, uma fumaça de incêndio, uma geada repentina). A política adaptativa P3 é ideal porque se molda dinamicamente a essa realidade:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm mb-1">
                  <Zap className="w-4 h-4" />
                  <h4>Eficiência de P2 na Calmaria (-95,2% de Rádio)</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Durante 90% do dia em que a umidade do solo está estável, o ESP32 realiza sua decisão local em apenas 74 µs e volta para o Deep Sleep imediatamente. Nenhuma conexão Wi-Fi ou MQTT é aberta desnecessariamente, poupando a bateria.
                </p>
              </div>

              <div className="p-4 bg-teal-50/60 border border-teal-200 rounded-xl">
                <div className="flex items-center space-x-2 text-teal-800 font-bold text-sm mb-1">
                  <Sparkles className="w-4 h-4" />
                  <h4>Reatividade de P1 no Evento (0,42 s de Atraso)</h4>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  No primeiro minuto em que a chuva infiltra e ultrapassa Δ = 0,30 p.p. na janela móvel, a regra (d) acorda o rádio e dispara imediatamente. O gateway recebe o alerta instantaneamente, com a mesma velocidade da política curta periódica!
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-900 text-white rounded-xl flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>O Veredito da Engenharia:</strong> Ao invés de forçar o projetista a escolher entre uma bateria que morre em 3 meses (P1) ou um sistema que é cego a desastres e perde 100% das chuvas (P2), a política P3 elimina esse compromisso — entregando <strong>autonomia de anos com latência sub-segundo</strong>.
              </p>
            </div>
          </div>
        )}

        {selectedCase === 'calibration' && (
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  A Grande Advertência: Toda Política Adaptativa Depende do Domínio Específico
                </h3>
                <p className="text-xs text-slate-500">Por que não existe um conjunto de parâmetros "mágico" para qualquer aplicação</p>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-6">
              Embora a política adaptativa seja o ideal teórico, <strong className="text-slate-900">implementar uma política adaptativa "às cegas" sem caracterização prévia do sinal físico e do ruído do hardware pode ser catastrófico</strong>. As quatro regras da P3 dependem de quatro pilares de calibração:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-4">
                <div className="font-bold text-sm text-purple-900 mb-1">
                  1. O Risco do Piso de Ruído (&Delta; &lt; 3&sigma;_ruído)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Se o limiar de variação &Delta; for ajustado abaixo da flutuação térmica do ADC ou do ruído eletromagnético da antena (ex: &Delta; = 0,05 p.p. quando &sigma; = 0,08 p.p.), o nó entrará em <em>avalanche de falsos positivos</em>. Ele transmitirá ruído aleatório achando que é evento, e a bateria durará tão pouco quanto P1!
                </p>
              </div>

              <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-4">
                <div className="font-bold text-sm text-purple-900 mb-1">
                  2. A Escala Temporal do Fenômeno (Janela w)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  No solo do observatório NEON, uma frente de chuva leva de 15 a 45 minutos para infiltrar até 10 cm de profundidade (por isso usamos janela de 30 min). Se aplicássemos a mesma regra para monitorar vibração de rolamentos industriais ou tremores sísmicos (onde o pico ocorre em 5 milissegundos), o algoritmo perderia o evento por completa incompatibilidade de escala temporal.
                </p>
              </div>

              <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-4">
                <div className="font-bold text-sm text-purple-900 mb-1">
                  3. A Obrigatoriedade do Heartbeat (Regra c)
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Uma política puramente orientada a eventos sem batimento cardíaco (heartbeat) sofre do problema da <em>morte silenciosa</em>: se uma vaca pisar na antena, se a bateria oxidar ou se houver um defeito de hardware, o servidor presume que o solo continua perfeitamente estável. O heartbeat a cada 30 min garante confirmação de vitalidade do nó.
                </p>
              </div>

              <div className="border border-purple-200 bg-purple-50/40 rounded-xl p-4">
                <div className="font-bold text-sm text-purple-900 mb-1">
                  4. A Histerese (&theta; e h) contra Chattering
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Sem histerese h = 0,20 p.p. ao redor do limiar de seca &theta; = 4,02% VWC, o nó ficaria oscilando de estado (seco / molhado / seco) dezenas de vezes a cada flutuação de temperatura ambiente entre o dia e a noite, consumindo centenas de transmissões espúrias.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Regra de Ouro do Projetista IoT:</strong> Primeiro colete uma semana de traços brutos do sensor no ambiente real com amostragem rápida (fase de caracterização), calcule o desvio padrão de ruído &sigma;, e só então congele os limiares adaptativos &Delta;, &theta;, h e w antes da produção em escala.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Battery Life Calculator */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 mb-6 border-b border-slate-700 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <BatteryCharging className="w-4 h-4" />
              <span>Calculadora de Engenharia em Tempo Real</span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-1">
              Simulador Interativo de Autonomia de Bateria
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Ajuste a capacidade da bateria, a corrente de sono e a frequência de eventos de chuva para ver a projeção empírica de vida útil no ESP32 para cada política.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 self-start lg:self-auto">
            <Cpu className="w-4 h-4 text-teal-400" />
            <span className="text-xs text-slate-300 font-mono">
              Hardware: ESP32 @ 3.3V · Rádio TX: 120 mA
            </span>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Slider 1: Battery Capacity */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-200">Capacidade da Bateria</label>
              <span className="text-sm font-extrabold text-teal-400 font-mono">{batteryCapacity} mAh</span>
            </div>
            <input
              type="range"
              min={500}
              max={10000}
              step={250}
              value={batteryCapacity}
              onChange={(e) => setBatteryCapacity(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>500 mAh (Moeda/Pequena)</span>
              <span>2500 mAh (18650)</span>
              <span>10 Ah (Pack)</span>
            </div>
          </div>

          {/* Slider 2: Rain Events per Day */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-200">Eventos de Chuva por Dia</label>
              <span className="text-sm font-extrabold text-teal-400 font-mono">{eventsPerDay} eventos/dia</span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={eventsPerDay}
              onChange={(e) => setEventsPerDay(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>0 (Seca absoluta)</span>
              <span>2 (Típico agrícola)</span>
              <span>8 (Tempestades)</span>
            </div>
          </div>

          {/* Slider 3: Sleep Current */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-200">Corrente Deep Sleep</label>
              <span className="text-sm font-extrabold text-teal-400 font-mono">{sleepCurrentUa} µA</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              step={5}
              value={sleepCurrentUa}
              onChange={(e) => setSleepCurrentUa(Number(e.target.value))}
              className="w-full accent-teal-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>5 µA (Bare ESP32)</span>
              <span>15 µA (Com LDO)</span>
              <span>100 µA (Placa Dev)</span>
            </div>
          </div>
        </div>

        {/* Results Lifetime Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* P1 Result */}
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-blue-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-blue-400 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">P1 — Periódica Curta</span>
                <Radio className="w-4 h-4" />
              </div>
              <div className="text-3xl font-extrabold text-white mt-2">
                {p1Days} <span className="text-sm font-normal text-slate-400">dias</span>
              </div>
              <div className="text-xs text-blue-300 font-mono mt-0.5">≈ {p1Years} anos</div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700 text-xs text-slate-400 space-y-1">
              <div>Consumo: <strong className="text-slate-200 font-mono">{p1DailyMah.toFixed(2)} mAh/dia</strong></div>
              <div>Precisão: <strong className="text-emerald-400">Máxima</strong> (1440 TX/dia)</div>
              <div className="text-red-400 font-medium">Bateria drena rapidamente!</div>
            </div>
          </div>

          {/* P2 Result */}
          <div className="bg-slate-800/90 rounded-2xl p-5 border border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-amber-400 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">P2 — Periódica Longa</span>
                <Clock className="w-4 h-4" />
              </div>
              <div className="text-3xl font-extrabold text-white mt-2">
                {p2Days} <span className="text-sm font-normal text-slate-400">dias</span>
              </div>
              <div className="text-xs text-amber-300 font-mono mt-0.5">≈ {p2Years} anos</div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700 text-xs text-slate-400 space-y-1">
              <div>Consumo: <strong className="text-slate-200 font-mono">{p2DailyMah.toFixed(2)} mAh/dia</strong></div>
              <div>Precisão: <strong className="text-red-400 font-bold">100% de perdas</strong> (Atraso 13 min)</div>
              <div className="text-amber-400 font-medium">Duração longa, mas cego a eventos.</div>
            </div>
          </div>

          {/* P3 Result */}
          <div className="bg-gradient-to-b from-teal-950/60 to-slate-800/90 rounded-2xl p-5 border-2 border-teal-500 flex flex-col justify-between shadow-lg ring-2 ring-teal-500/20">
            <div>
              <div className="flex items-center justify-between text-teal-400 mb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider bg-teal-500/20 px-2 py-0.5 rounded text-teal-300">
                  P3 — Adaptativa Mista (Ideal)
                </span>
                <Sparkles className="w-4 h-4 text-teal-300" />
              </div>
              <div className="text-3xl font-extrabold text-white mt-2">
                {p3Days} <span className="text-sm font-normal text-slate-400">dias</span>
              </div>
              <div className="text-xs text-teal-300 font-mono mt-0.5">
                ≈ {p3Years} anos ({((p3Days / p1Days)).toFixed(1)}x mais vida que P1)
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-teal-800/60 text-xs text-slate-300 space-y-1">
              <div>Consumo: <strong className="text-teal-200 font-mono">{p3DailyMah.toFixed(2)} mAh/dia</strong></div>
              <div>Precisão: <strong className="text-emerald-400">0 perdas (Atraso 0,42 s)</strong></div>
              <div className="text-emerald-400 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Autonomia de P2 com acurácia de P1!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
