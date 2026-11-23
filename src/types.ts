export interface TracePoint {
  k: number;
  hour: number;
  moisture: number;
  vm_p1?: number;
  vm_p2?: number;
  vm_p3?: number;
  p1: boolean;
  p2: boolean;
  p3: boolean;
  p3_reason: string | null;
  cum_p1?: number;
  cum_p2?: number;
  cum_p3?: number;
}

export interface MetricSummary {
  media: number;
  dp: number;
  ic_lo: number;
  ic_hi: number;
  min: number;
  max: number;
}

export interface PolicyResults {
  M1_ton_s_dia: MetricSummary;
  M2_ntx_dia: MetricSummary;
  M2_nrx_dia: MetricSummary;
  M3_nsamp_dia: MetricSummary;
  M3_ntx_por_nsamp: MetricSummary;
  M4_D_medio_s: MetricSummary;
  M4_D_medio_evw_s?: MetricSummary;
  M4_D_mediana_s?: MetricSummary;
  M4_D_max_s?: MetricSummary;
  M5_perdidos: MetricSummary;
  M6_rmse_pp: MetricSummary;
  M6_mae_pp?: MetricSummary;
  M6_maxabs_pp?: MetricSummary;
  M6_rmse_lin_pp?: MetricSummary;
  M7_pdr: MetricSummary;
  M7_n_fail?: MetricSummary;
  M7_reconexoes?: MetricSummary;
  M7_violacoes_hb?: MetricSummary;
  M8_tdec_medio_us: MetricSummary;
  M8_tdec_max_us: MetricSummary;
  M8_tdec_tawake_max_pct?: MetricSummary;
  M9_E_J_dia: MetricSummary;
  ton_por_tx_medio_s: MetricSummary;
  [key: string]: any;
}

export interface SummaryData {
  n_segmentos: number;
  segmentos: string[];
  parametros: {
    theta: number;
    h: number;
    Delta: number;
    Delta_ev: number;
    eps_max: number;
    D_max: number;
    delta_D: number;
    c: number;
    T_S: number;
    T_L: number;
    H_ciclos: number;
  };
  descritiva: {
    P1: PolicyResults;
    P2: PolicyResults;
    P3: PolicyResults;
  };
  [key: string]: any;
}

export interface RunRow {
  run_id: string;
  run_n: string;
  tipo: string;
  placa: string;
  segmento: string;
  configuracao: string;
  entry: string;
  cfg_id: string;
  hash_parametros: string;
  hash_traco: string;
  c: string;
  commit_firmware: string;
  versao_servicos: string;
  posicao_ordem: string;
  seed: string;
  inicio: string;
  fim: string;
  valido: string;
  motivo_invalidacao: string;
  observacoes: string;
}

export interface ParetoPoint {
  Delta: string;
  n_tx_dia: string;
  ton_s_dia: string;
  atraso_s: string;
  rmse: string;
  ic_hi_rmse: string;
  perdidos: string;
  admissivel: string;
}

export interface EventItem {
  id: number;
  segmento: string;
  policy: string;
  D: number;
  perdido: boolean;
  t_ev_s: number;
}

export interface PairedTonItem {
  segmento: string;
  P1_ton: number;
  P2_ton: number;
  P3_ton: number;
  P1_tx_ton?: number;
  P2_tx_ton?: number;
  P3_tx_ton?: number;
}

export interface VarreduraItem {
  gap: number;
  label: string;
  mediana: number;
  q1: number;
  q3: number;
}
