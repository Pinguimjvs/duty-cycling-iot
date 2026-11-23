# Dashboard & Simulador IoT Duty Cycling — Checkpoint 04 (Tema 21)

Aplicação web interativa para apresentação e exploração empírica dos resultados do **Checkpoint 04** da disciplina **SSC0952 / SSC0592 - Internet das Coisas (ICMC-USP)**.

**Autores:** Héctor Yolvi Herrera Cruz & João Vitor Salvini  
**Tema:** IoT Energeticamente Consciente: Avaliação Empírica de Duty Cycling e Políticas de Transmissão sob Traços Reais de Umidade do Solo

---

## 🚀 Tecnologias Utilizadas

- **Framework:** React 18 + TypeScript
- **Bundler & Dev Server:** Vite 5
- **Estilização:** Tailwind CSS 3
- **Gráficos & Visualizações:** Recharts
- **Ícones:** Lucide React
- **Hospedagem & Deploy:** Otimizado para [Vercel](https://vercel.com) (`vercel.json`)

---

## 📊 Estrutura e Funcionalidades

1. **Visão Geral (`HeroSection` & `PoliciesComparison`):**
   - Destaque das métricas centrais (-95,2% rádio, 0,42 s latência, 0 perdas).
   - Detalhamento formal das políticas P1 (Curta), P2 (Longa) e P3 (Adaptativa).
   - Especificação das 4 regras de transmissão de P3 (variação $\Delta$, histerese de seca $\theta \pm h$, subida de chuva na janela móvel $w$, heartbeat $H$).

2. **Dashboard de Métricas & Hipóteses (`ResultsDashboard`):**
   - Comparação empírica de $T_{on}$ (M1), latência $D_{ev}$ (M4), perdas (M5), erro RMSE (M6) e sobrecarga de CPU $T_{dec}$ (M8).
   - Fronteira de Pareto com varredura do limiar $\Delta$ (0,15 a 0,90 p.p.).
   - Decomposição do overhead de conexão Wi-Fi/MQTT (52% associação, 26% handshake, 12% payload, 10% desconexão).
   - Tabela formal de vereditos dos 4 testes de hipótese estatísticos.

3. **Simulador de Traço Real (`TraceViewer`):**
   - 720 amostras (12 horas) do traço de umidade do observatório ecológico NEON (Segmento S01).
   - Camadas ativáveis/desativáveis para cada política.
   - Zoom interativo no evento de saturação por chuva (4h às 7h).
   - Tooltips detalhando o motivo exato de cada transmissão de P3 (variação $\Delta$ vs heartbeat).

4. **Guia Estratégico de Casos de Uso & Calculadora (`UseCasesGuide`):**
   - **Caso P1 (Curta):** Controle em malha fechada, estufas comerciais, UTIs e alimentação abundante.
   - **Caso P2 (Longa):** Aquíferos profundos, deformação de barragens e sensores enterrados para 10-15 anos.
   - **Caso P3 (Adaptativa):** Reconciliação teórica e prática (economia de P2 na seca + prontidão de P1 na chuva).
   - **A Lição da Calibração:** Dependência do piso de ruído ($\Delta > 3\sigma$), escala temporal do fenômeno, e perigo da "morte silenciosa" sem heartbeat.
   - **Simulador de Autonomia de Bateria:** Sliders dinâmicos para capacidade da bateria (mAh), frequência de chuvas e corrente de sleep, projetando autonomia em dias e anos.

5. **Trilha de Auditoria das Execuções (`RunsTable`):**
   - Tabela pesquisável e paginada de todos os 59 registros de execução física (`runs.csv`).
   - Filtros por política (P1, P2, P3) e status de validação.
   - Exportação direta para CSV.

6. **Artigo Científico IEEE & Reprodutibilidade (`PaperSection`):**
   - Download do artigo de 18 páginas em PDF (`/artigo_cp4.pdf`).
   - Síntese dos 20 artigos da revisão sistemática Micro-PRISMA em 4 clusters.
   - Snippet executável para replicação estrita no ESP32 com PlatformIO e hashes SHA-256.

---

## 🛠️ Como Executar Localmente

\`\`\`bash
# 1. Entrar na pasta do frontend
cd frontend

# 2. Instalar as dependências (já instaladas)
npm install

# 3. Iniciar o servidor de desenvolvimento local
npm run dev
\`\`\`

Acesse no navegador: `http://localhost:5173`.

---

## 🚢 Como Fazer Deploy na Vercel

### Opção A: Pelo Dashboard da Vercel (Recomendado via GitHub)
1. Faça push do repositório para o GitHub.
2. No dashboard da [Vercel](https://vercel.com), clique em **"Add New Project"** e importe o repositório.
3. Configure o **Root Directory** como `frontend` (ou mantenha o padrão se o repositório contiver apenas a pasta frontend).
4. O framework será detectado automaticamente como **Vite**.
5. Clique em **Deploy**.

### Opção B: Pela CLI da Vercel
\`\`\`bash
cd frontend
npm install -g vercel   # se ainda não tiver a CLI
vercel
# ou para produção direta:
vercel --prod
\`\`\`

A compilação produzirá a pasta estática `dist/` pronta para CDN global de altíssima performance.
