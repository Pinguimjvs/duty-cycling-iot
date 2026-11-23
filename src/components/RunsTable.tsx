import React, { useState, useMemo } from 'react';
import { RunRow } from '../types';
import runsDataRaw from '../data/runs_table.json';
import { CheckCircle2, ChevronLeft, ChevronRight, Database, Download, Filter, HelpCircle, Search, ShieldAlert, XCircle } from 'lucide-react';

const runsData = runsDataRaw as RunRow[];

export const RunsTable: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [policyFilter, setPolicyFilter] = useState<'ALL' | 'P1' | 'P2' | 'P3'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'sim' | 'nao' | 'pendente'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtered runs
  const filteredRuns = useMemo(() => {
    return runsData.filter((r) => {
      const matchSearch =
        r.run_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.segmento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.cfg_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchPolicy = policyFilter === 'ALL' || r.configuracao === policyFilter;
      const matchStatus = statusFilter === 'ALL' || r.valido === statusFilter;

      return matchSearch && matchPolicy && matchStatus;
    });
  }, [searchTerm, policyFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredRuns.length / itemsPerPage);
  const currentRuns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRuns.slice(start, start + itemsPerPage);
  }, [filteredRuns, currentPage]);

  const handleDownloadCsv = () => {
    const headers = ['run_id', 'tipo', 'segmento', 'configuracao', 'cfg_id', 'valido', 'hash_parametros', 'inicio'];
    const rows = runsData.map((r) => [r.run_id, r.tipo, r.segmento, r.configuracao, r.cfg_id, r.valido, r.hash_parametros, r.inicio]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'runs_campanha_cp4.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1480px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded border border-teal-200">
              Trilha de Auditoria & Reprodutibilidade
            </span>
            <span className="text-xs text-slate-500 font-mono">59 Registros de Execução</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Registro da Campanha Experimental (runs.csv)
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Tabela completa de todas as execuções físicas na placa ESP32, incluindo os 21 replays válidos, varredura de gaps, sementes de aleatorização e hashes SHA-256 de configuração.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="mt-4 md:mt-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Exportar runs.csv</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar Run ID, Segmento ou CFG..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Policy filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {(['ALL', 'P1', 'P2', 'P3'] as const).map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPolicyFilter(p);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  policyFilter === p ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p === 'ALL' ? 'Todas Políticas' : p}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg text-xs font-medium">
            {(['ALL', 'sim', 'nao', 'pendente'] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  statusFilter === s ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s === 'ALL' ? 'Todos Status' : s === 'sim' ? 'Válidos (26)' : s === 'nao' ? 'Inválidos (4)' : 'Pendentes'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Run ID</th>
                <th className="py-3 px-4">Seg</th>
                <th className="py-3 px-4">Pol</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Config ID</th>
                <th className="py-3 px-4">Início (UTC)</th>
                <th className="py-3 px-4">Motivo / Obs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              {currentRuns.length > 0 ? (
                currentRuns.map((r, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{r.run_id}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-700">{r.segmento}</td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          r.configuracao === 'P1'
                            ? 'bg-blue-100 text-blue-800'
                            : r.configuracao === 'P2'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-teal-100 text-teal-800'
                        }`}
                      >
                        {r.configuracao}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">{r.tipo}</td>
                    <td className="py-2.5 px-4">
                      {r.valido === 'sim' ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[10px] border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Válido</span>
                        </span>
                      ) : r.valido === 'nao' ? (
                        <span className="inline-flex items-center space-x-1 text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded text-[10px] border border-red-200">
                          <XCircle className="w-3 h-3 text-red-500" />
                          <span>Inválido</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          <span>Pendente</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-600">{r.cfg_id}</td>
                    <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">
                      {r.inicio ? r.inicio.replace('T', ' ').substring(0, 16) : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 text-[11px] max-w-xs truncate" title={r.motivo_invalidacao || r.observacoes}>
                      {r.motivo_invalidacao || r.observacoes || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Nenhum registro encontrado com os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Mostrando <strong>{filteredRuns.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> a{' '}
            <strong>{Math.min(currentPage * itemsPerPage, filteredRuns.length)}</strong> de{' '}
            <strong>{filteredRuns.length}</strong> registros
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-slate-700">
              Página {currentPage} de {totalPages || 1}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
