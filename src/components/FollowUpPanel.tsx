import React from 'react';
import { Lead, Estagio } from '../types/crm';
import { 
  formatWhatsAppUrl, 
  formatDisplayPhone, 
  checkFollowUpStatus, 
  getDaysSinceLastContact,
  getPotencialBadgeStyle 
} from '../utils/formatters';
import { 
  Calendar, 
  Clock, 
  MessageCircle, 
  PlusCircle, 
  AlertTriangle,
  Building2,
  MapPin,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { parseISO, startOfDay, isBefore, isToday } from 'date-fns';

interface FollowUpPanelProps {
  leads: Lead[];
  onOpenInteraction: (lead: Lead) => void;
  onSelectLead: (lead: Lead) => void;
  onStageChange: (leadId: string, newStage: Estagio) => void;
}

export const FollowUpPanel: React.FC<FollowUpPanelProps> = ({
  leads,
  onOpenInteraction,
  onSelectLead,
  onStageChange
}) => {
  // Filter leads where dataProximoFollowUp <= today
  const todayStart = startOfDay(new Date());

  const followUpLeads = leads
    .filter(l => {
      if (!l.dataProximoFollowUp) return false;
      if (['Cliente', 'Perdido', 'Sem Interesse'].includes(l.estagio)) return false;
      
      const dateStart = startOfDay(parseISO(l.dataProximoFollowUp));
      return isBefore(dateStart, todayStart) || isToday(dateStart);
    })
    .sort((a, b) => {
      // Sort most overdue first
      const dateA = new Date(a.dataProximoFollowUp!).getTime();
      const dateB = new Date(b.dataProximoFollowUp!).getTime();
      return dateA - dateB;
    });

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
      
      {/* Panel Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-ctrl-graphite to-blue-950 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="font-heading font-bold text-lg text-white tracking-tight">
              Ponto de Partida do Dia • Follow-ups Pendentes
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            Leads com acompanhamento agendado para hoje ou em atraso. Registre interações para manter a régua de vendas aquecida.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center shrink-0">
          <span className="text-xs font-medium text-slate-300 block">Total a contatar</span>
          <span className="text-2xl font-extrabold font-heading text-amber-400">
            {followUpLeads.length} {followUpLeads.length === 1 ? 'lead' : 'leads'}
          </span>
        </div>
      </div>

      {/* List of Follow-up Items */}
      {followUpLeads.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-800">
            Excelente! Nenhum follow-up pendente para hoje.
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Todos os seus leads estão com o contato em dia. Vá até o Kanban para prospecção de novos contatos!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {followUpLeads.map(lead => {
            const followInfo = checkFollowUpStatus(lead.dataProximoFollowUp);
            const potStyle = getPotencialBadgeStyle(lead.potencial);
            const waUrl = formatWhatsAppUrl(lead.telefone);

            return (
              <div 
                key={lead.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-4 flex flex-col justify-between space-y-3"
              >
                {/* Header info */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border mb-1 ${potStyle.badge}`}>
                        {lead.potencial} Potencial
                      </span>
                      <h3 
                        onClick={() => onSelectLead(lead)}
                        className="font-heading font-bold text-base text-slate-900 cursor-pointer hover:text-ctrl-blue transition-colors"
                      >
                        {lead.nome}
                      </h3>
                    </div>

                    {/* Delay Badge */}
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 ${
                      followInfo.status === 'overdue'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      {followInfo.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {lead.cidade}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {lead.tipoEstrutura}
                    </span>
                  </div>

                  {/* Last interaction preview */}
                  {lead.interacoes && lead.interacoes.length > 0 ? (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
                      <span className="font-semibold text-slate-700 block">Última conversa:</span>
                      <p className="italic line-clamp-2">
                        "{lead.interacoes[0].resumo}"
                      </p>
                      {lead.interacoes[0].proximaAcao && (
                        <p className="text-[11px] text-ctrl-blue font-medium pt-1 border-t border-slate-200/60">
                          🎯 Próxima ação: {lead.interacoes[0].proximaAcao}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-400 italic">
                      Nenhuma conversa anterior gravada
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </a>

                  <button
                    onClick={() => onOpenInteraction(lead)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-ctrl-blue hover:bg-ctrl-blue-hover text-white font-semibold text-xs transition-colors shadow-xs"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Interação</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
