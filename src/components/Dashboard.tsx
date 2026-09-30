import React from 'react';
import { MetricSummary, ESTAGIOS, Estagio } from '../types/crm';
import { Users, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  metrics: MetricSummary;
  selectedStage: string;
  onSelectStage: (stage: string) => void;
}

const STAGE_COLORS: Record<Estagio, string> = {
  'Novo': 'bg-slate-400',
  'Contatado': 'bg-blue-500',
  'Respondeu': 'bg-teal-500',
  'Qualificado': 'bg-indigo-500',
  'Teste Agendado': 'bg-purple-500',
  'Em Teste': 'bg-violet-500',
  'Cliente': 'bg-emerald-500',
  'Perdido': 'bg-red-400',
  'Sem Interesse': 'bg-slate-500'
};

export const Dashboard: React.FC<DashboardProps> = ({
  metrics,
  selectedStage,
  onSelectStage
}) => {
  const { totalLeads, responseRate, overdueCount, stageCounts } = metrics;

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm p-4 sm:p-6 mb-4">
      <div className="max-w-7xl mx-auto space-y-4">
        
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          
          {/* Card 1: Total Leads */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total de Leads</p>
              <p className="text-xl sm:text-2xl font-bold font-heading text-slate-900">{totalLeads}</p>
            </div>
          </div>

          {/* Card 2: Taxa de Resposta */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center font-bold shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Taxa de Resposta</p>
              <div className="flex items-baseline gap-1">
                <p className="text-xl sm:text-2xl font-bold font-heading text-slate-900">{responseRate}%</p>
                <span className="text-[10px] text-slate-400 font-medium">Contatados → Respondeu</span>
              </div>
            </div>
          </div>

          {/* Card 3: Follow-ups Atrasados */}
          <div className={`rounded-xl p-3.5 border flex items-center gap-3 ${
            overdueCount > 0 
              ? 'bg-red-50 border-red-200 text-red-900' 
              : 'bg-slate-50 border-slate-200 text-slate-900'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold shrink-0 ${
              overdueCount > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {overdueCount > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Follow-up Atrasado</p>
              <p className={`text-xl sm:text-2xl font-bold font-heading ${overdueCount > 0 ? 'text-red-600' : 'text-slate-900'}`}>
                {overdueCount} {overdueCount === 1 ? 'lead' : 'leads'}
              </p>
            </div>
          </div>

          {/* Card 4: Clientes Fechados */}
          <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-800">Clientes Ativos</p>
              <p className="text-xl sm:text-2xl font-bold font-heading text-emerald-700">
                {stageCounts['Cliente'] || 0}
              </p>
            </div>
          </div>

        </div>

        {/* Funil Visual de Vendas */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Funil de Vendas (Estágios)</span>
            <span className="text-xs text-slate-400 font-medium">Clique em uma etapa para filtrar</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5">
            {ESTAGIOS.map(estagio => {
              const count = stageCounts[estagio] || 0;
              const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
              const isSelected = selectedStage === estagio;

              return (
                <button
                  key={estagio}
                  onClick={() => onSelectStage(isSelected ? 'todos' : estagio)}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    isSelected 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-ctrl-blue' 
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold truncate leading-tight">{estagio}</span>
                    <span className={`w-2 h-2 rounded-full ${STAGE_COLORS[estagio]}`} />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-base font-bold font-heading">{count}</span>
                    <span className={`text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                      {pct}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
