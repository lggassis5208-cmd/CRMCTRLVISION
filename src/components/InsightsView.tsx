import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  LineChart, 
  Line, 
  CartesianGrid,
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Filter, 
  Calendar, 
  AlertCircle,
  CheckCircle2,
  PieChart
} from 'lucide-react';

interface InsightsData {
  funnelData: { stage: string; count: number; totalValue: number }[];
  lostData: { reason: string; count: number; totalValue: number }[];
  avgStageLifecycle: { stage: string; avgDays: number; samplesCount: number }[];
  conversionCascade: { stage: string; count: number; conversionRate: number; totalConversionRate: number }[];
  forecast: {
    countTesteAgendado: number;
    somaTesteAgendado: number;
    countEmTeste: number;
    somaEmTeste: number;
    totalForecast: number;
  };
  leadsOverTime: { week: string; count: number }[];
  hasEnoughData: boolean;
}

export const InsightsView: React.FC = () => {
  const [data, setData] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/insights');
        if (!res.ok) throw new Error('Falha ao carregar insights');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Erro ao buscar dados de insights:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <div className="w-10 h-10 border-4 border-ctrl-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">Calculando métricas e ciclo de vida do CRM...</p>
      </div>
    );
  }

  if (!data || !data.hasEnoughData) {
    return (
      <div className="max-w-4xl mx-auto my-12 p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-3 shadow-xs">
        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="font-heading font-bold text-lg text-slate-800">
          Ainda sem dados suficientes
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Adicione ou movimente mais leads no pipeline Kanban para que as métricas de conversão e ciclo de vida sejam geradas.
        </p>
      </div>
    );
  }

  const { funnelData, lostData, avgStageLifecycle, conversionCascade, forecast, leadsOverTime } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      
      {/* Top Banner & Simple Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Title Card */}
        <div className="lg:col-span-2 bg-gradient-to-r from-ctrl-graphite via-slate-900 to-blue-950 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-ctrl-blue rounded-xl">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-heading font-bold text-xl tracking-tight text-white">
                Insights & Inteligência de Vendas
              </h1>
            </div>
            <p className="text-xs text-slate-300">
              Análise de ciclo de vida do lead, previsão de faturamento mensal e conversão em cascata.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold pt-2 border-t border-white/10 text-slate-300">
            <span>• Previsão baseada em R$ 79,90/mês por lead</span>
            <span>• Atualizado em tempo real</span>
          </div>
        </div>

        {/* Forecast Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
              🎯 Previsão de Receita (Forecast)
            </span>
            <p className="text-xs text-emerald-900">
              Soma do valor mensal dos leads em <span className="font-bold">Teste Agendado</span> e <span className="font-bold">Em Teste</span>.
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-emerald-200/80">
            <span className="text-xs text-emerald-700 block font-medium">Se todos fecharem:</span>
            <span className="text-3xl font-extrabold font-heading text-emerald-700 block">
              R$ {forecast.totalForecast.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}<span className="text-sm font-semibold">/mês</span>
            </span>

            <div className="flex justify-between text-[11px] text-emerald-800 font-medium mt-2">
              <span>Teste Agendado: {forecast.countTesteAgendado} (R$ {forecast.somaTesteAgendado})</span>
              <span>Em Teste: {forecast.countEmTeste} (R$ {forecast.somaEmTeste})</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid Row 1: Funil com Valor & Leads Perdidos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Funil com valor por Etapa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                1. Funil de Vendas com Valor (MRR Estimado)
              </h3>
              <p className="text-xs text-slate-500">Quantidade de leads e valor mensal esperado por etapa</p>
            </div>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="stage" tick={{ fontSize: 10 }} interval={0} angle={-25} textAnchor="end" />
                <YAxis yAxisId="left" orientation="left" stroke="#2563EB" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" tick={{ fontSize: 10 }} />
                <Tooltip 
                  formatter={(value: any, name: any) => [
                    name === 'count' ? `${value} leads` : `R$ ${value}`, 
                    name === 'count' ? 'Qtd Leads' : 'Valor Estimado'
                  ]}
                />

                <Bar yAxisId="left" dataKey="count" fill="#2563EB" name="count" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="totalValue" fill="#10B981" name="totalValue" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Table */}
          <div className="overflow-x-auto border-t border-slate-100 pt-3">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100">
                  <th className="py-1">Estágio</th>
                  <th className="py-1 text-center">Qtd</th>
                  <th className="py-1 text-right">Valor Esperado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {funnelData.map(f => (
                  <tr key={f.stage} className="hover:bg-slate-50">
                    <td className="py-1.5 font-semibold text-slate-800">{f.stage}</td>
                    <td className="py-1.5 text-center font-bold text-ctrl-blue">{f.count}</td>
                    <td className="py-1.5 text-right font-bold text-emerald-600">R$ {f.totalValue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 1b. Leads Perdidos Quebrados por Motivo */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                Leads Perdidos & Sem Interesse
              </h3>
              <p className="text-xs text-slate-500">Motivos de desistência e valor mensal não convertido</p>
            </div>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>

          {lostData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              Nenhum lead marcado como Perdido ou Sem Interesse!
            </div>
          ) : (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lostData} layout="vertical" margin={{ top: 10, right: 20, left: 40, bottom: 10 }}>
                    <XAxis type="number" tick={{ fontSize: 10 }} />
                    <YAxis type="category" dataKey="reason" tick={{ fontSize: 10 }} width={110} />
                    <Tooltip formatter={(value: any) => [`${value} leads`, 'Qtd Perdida']} />
                    <Bar dataKey="count" fill="#EF4444" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                {lostData.map(l => (
                  <div key={l.reason} className="flex items-center justify-between text-xs p-2 bg-red-50/60 rounded-lg border border-red-100">
                    <span className="font-semibold text-red-900">{l.reason}</span>
                    <div className="text-right">
                      <span className="font-bold text-red-700 block">{l.count} {l.count === 1 ? 'lead' : 'leads'}</span>
                      <span className="text-[11px] text-red-500 font-medium">Perda: R$ {l.totalValue.toFixed(2)}/mês</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>

      {/* Grid Row 2: Ciclo de Vida Médio & Conversão em Cascata */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 2. Ciclo de Vida Médio por Estágio */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                2. Ciclo de Vida Médio (Tempo em cada Estágio)
              </h3>
              <p className="text-xs text-slate-500">Média de dias que o lead permanece em cada etapa</p>
            </div>
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgStageLifecycle} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                <XAxis type="number" tick={{ fontSize: 10 }} unit=" dias" />
                <YAxis type="category" dataKey="stage" tick={{ fontSize: 10 }} width={95} />
                <Tooltip formatter={(value: any) => [`${value} dias`, 'Tempo Médio']} />
                <Bar dataKey="avgDays" fill="#6366F1" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-2 border-t border-slate-100">
            {avgStageLifecycle.slice(0, 4).map(s => (
              <div key={s.stage} className="bg-slate-50 p-2 rounded-lg text-center">
                <span className="text-slate-400 block text-[10px] truncate">{s.stage}</span>
                <span className="font-bold text-indigo-700 text-sm">{s.avgDays}d</span>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Taxa de Conversão em Cascata */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-slate-900">
                3. Taxa de Conversão em Cascata
              </h3>
              <p className="text-xs text-slate-500">Avanço % relativo à etapa anterior do funil</p>
            </div>
            <Filter className="w-5 h-5 text-ctrl-blue" />
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {conversionCascade.map((c, idx) => (
              <div key={c.stage} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                  <span>{c.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{c.count} leads</span>
                    {idx > 0 && (
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        c.conversionRate >= 50 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.conversionRate}% da etapa anterior
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-ctrl-blue h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(5, c.totalConversionRate)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Section 5: Leads Criados ao longo do Tempo */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              5. Leads Criados ao Longo do Tempo (por Semana)
            </h3>
            <p className="text-xs text-slate-500">Volume semanal de novos prospectos adicionados ao CRM</p>
          </div>
          <Calendar className="w-5 h-5 text-teal-600" />
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={leadsOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip formatter={(value: any) => [`${value} novos leads`, 'Qtd Cadastrada']} />
              <Line type="monotone" dataKey="count" stroke="#0D9488" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
