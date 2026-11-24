import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RunRow, SummaryData, TracePoint } from '../types';

// Fallback static data
import runsDataRaw from '../data/runs_table.json';
import summaryDataRaw from '../data/summary_results.json';
import analyticsDataRaw from '../data/cp4_detailed_analytics.json';
import traceDataRaw from '../data/s01_trace.json';

export interface VMInfo {
  status: string;
  host: string;
  port: number;
  time?: string;
  uptime?: string;
  source?: string;
}

export interface LiveDataContextType {
  isLive: boolean;
  isSyncing: boolean;
  lastSync: Date | null;
  autoRefresh: boolean;
  setAutoRefresh: (val: boolean) => void;
  refresh: () => Promise<void>;
  vmInfo: VMInfo | null;
  liveEstado: any | null;
  runs: RunRow[];
  summary: SummaryData;
  analytics: any;
  traceData: TracePoint[];
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
}

const LiveDataContext = createContext<LiveDataContextType | undefined>(undefined);

export const LiveDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [vmInfo, setVmInfo] = useState<VMInfo | null>(null);
  const [liveEstado, setLiveEstado] = useState<any | null>(null);
  const [apiBaseUrl, setApiBaseUrl] = useState<string>(''); // empty string means same-origin relative '/api'

  // Data states initialized with static fallback
  const [runs, setRuns] = useState<RunRow[]>(runsDataRaw as RunRow[]);
  const [summary, setSummary] = useState<SummaryData>(summaryDataRaw as unknown as SummaryData);
  const [analytics, setAnalytics] = useState<any>(analyticsDataRaw);
  const [traceData, setTraceData] = useState<TracePoint[]>(traceDataRaw as TracePoint[]);

  const fetchLiveData = useCallback(async () => {
    setIsSyncing(true);
    try {
      // 1. Health check
      const healthRes = await fetch(`${apiBaseUrl}/api/health`, {
        headers: { Accept: 'application/json' },
      }).catch(() => null);

      if (!healthRes || !healthRes.ok) {
        setIsLive(false);
        setIsSyncing(false);
        return;
      }

      const healthData = await healthRes.json().catch(() => null);
      if (healthData) {
        setVmInfo(healthData);
        setIsLive(true);
        setLastSync(new Date());
      }

      // 2. Fetch live estado (orchestrator snapshot from VM)
      const estadoRes = await fetch(`${apiBaseUrl}/api/estado`, {
        headers: { Accept: 'application/json' },
      }).catch(() => null);
      if (estadoRes && estadoRes.ok) {
        const estadoData = await estadoRes.json().catch(() => null);
        if (estadoData) setLiveEstado(estadoData);
      }

      // 3. Fetch live runs from VM
      const runsRes = await fetch(`${apiBaseUrl}/api/runs`, {
        headers: { Accept: 'application/json' },
      }).catch(() => null);
      if (runsRes && runsRes.ok) {
        const runsJson = await runsRes.json().catch(() => null);
        if (Array.isArray(runsJson) && runsJson.length > 0) {
          setRuns(runsJson);
        }
      }

      // 4. Fetch live summary if available
      const summaryRes = await fetch(`${apiBaseUrl}/api/summary`, {
        headers: { Accept: 'application/json' },
      }).catch(() => null);
      if (summaryRes && summaryRes.ok) {
        const summaryJson = await summaryRes.json().catch(() => null);
        if (summaryJson && summaryJson.descritiva) {
          setSummary(summaryJson);
        }
      }

      // 5. Fetch live analytics if available
      const analyticsRes = await fetch(`${apiBaseUrl}/api/analytics`, {
        headers: { Accept: 'application/json' },
      }).catch(() => null);
      if (analyticsRes && analyticsRes.ok) {
        const analyticsJson = await analyticsRes.json().catch(() => null);
        if (analyticsJson && analyticsJson.paired_ton) {
          setAnalytics(analyticsJson);
        }
      }
    } catch (err) {
      console.warn('Erro ao conectar à API da VM, mantendo snapshot local:', err);
      setIsLive(false);
    } finally {
      setIsSyncing(false);
    }
  }, [apiBaseUrl]);

  // Initial load
  useEffect(() => {
    fetchLiveData();
  }, [fetchLiveData]);

  // Auto-refresh timer (every 10s if active)
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLiveData();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLiveData]);

  return (
    <LiveDataContext.Provider
      value={{
        isLive,
        isSyncing,
        lastSync,
        autoRefresh,
        setAutoRefresh,
        refresh: fetchLiveData,
        vmInfo,
        liveEstado,
        runs,
        summary,
        analytics,
        traceData,
        apiBaseUrl,
        setApiBaseUrl,
      }}
    >
      {children}
    </LiveDataContext.Provider>
  );
};

export const useLiveData = (): LiveDataContextType => {
  const context = useContext(LiveDataContext);
  if (!context) {
    throw new Error('useLiveData must be used within a LiveDataProvider');
  }
  return context;
};
