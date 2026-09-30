import React from 'react';
import { Lead, Estagio, ESTAGIOS } from '../types/crm';
import { 
  formatWhatsAppUrl, 
  formatInstagramUrl, 
  formatDisplayPhone, 
  getDaysSinceLastContact, 
  checkFollowUpStatus,
  getPotencialBadgeStyle 
} from '../utils/formatters';
import { 
  Phone, 
  Mail, 
  Instagram, 
  MessageCircle, 
  MoreVertical, 
  Copy, 
  PlusCircle, 
  DollarSign, 
  Calendar 
} from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onOpenInteraction: (lead: Lead) => void;
  onOpenCopyTemplate: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onStageChange: (leadId: string, newStage: Estagio) => void;
  onSelectLead: (lead: Lead) => void;
  onQuickWhatsAppAction?: (lead: Lead) => void;
}

// Map Potencial / Status to exact soft color tags matching screenshot
function getStatusTagStyle(potencial: string, estagio: string) {
  if (estagio === 'Perdido' || estagio === 'Sem Interesse') {
    return 'bg-blue-100/70 text-blue-700 font-bold'; // Like "Dead" in screenshot
  }
  if (estagio === 'Cliente') {
    return 'bg-emerald-100/70 text-emerald-800 font-bold';
  }
  switch (potencial) {
    case 'Altíssimo':
      return 'bg-amber-100/80 text-amber-800 font-bold'; // Like "In Process" tag in screenshot
    case 'Alto':
      return 'bg-amber-100/60 text-amber-800 font-semibold';
    case 'Médio':
      return 'bg-cyan-100/70 text-cyan-800 font-semibold'; // Like "Recycled" tag in screenshot
    case 'Baixo':
    default:
      return 'bg-slate-100 text-slate-600 font-medium';
  }
}

// Generate consistent avatar colors/initials
const AVATAR_COLORS = [
  'bg-slate-700 text-white',
  'bg-amber-500 text-white',
  'bg-emerald-600 text-white',
  'bg-blue-600 text-white',
  'bg-indigo-600 text-white',
  'bg-pink-600 text-white'
];

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onOpenInteraction,
  onOpenCopyTemplate,
  onEditLead,
  onDeleteLead,
  onStageChange,
  onSelectLead,
  onQuickWhatsAppAction
}) => {
  const whatsappUrl = formatWhatsAppUrl(lead.telefone);
  const instagramUrl = formatInstagramUrl(lead.instagram);
  const lastContactInfo = getDaysSinceLastContact(lead.dataUltimoContato);
  const followUpInfo = checkFollowUpStatus(lead.dataProximoFollowUp);
  const tagStyle = getStatusTagStyle(lead.potencial, lead.estagio);
  const valor = lead.valorEstimado || 79.90;

  // Initials for avatar circle
  const cleanName = lead.nome.replace(/^EXEMPLO —\s*/, '');
  const initials = cleanName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('');

  const colorIndex = Math.abs(cleanName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % AVATAR_COLORS.length;
  const avatarBg = AVATAR_COLORS[colorIndex];

  return (
    <div 
      onClick={() => onSelectLead(lead)}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-4 flex flex-col gap-3 group cursor-pointer"
    >
      
      {/* Top Header Row: Avatar + Name & Subtitle + Menu */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Avatar Circle */}
          <div className={`w-9 h-9 rounded-full ${avatarBg} font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs`}>
            {initials}
          </div>

          <div>
            <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-ctrl-blue transition-colors leading-snug">
              {cleanName}
            </h3>
            <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
              {lastContactInfo.label}
            </span>
          </div>
        </div>

        {/* Stage quick dropdown selector */}
        <select
          value={lead.estagio}
          onChange={(e) => {
            e.stopPropagation();
            onStageChange(lead.id, e.target.value as Estagio);
          }}
          onClick={(e) => e.stopPropagation()}
          className="text-[11px] font-bold py-1 px-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-ctrl-blue shrink-0 max-w-[110px] truncate"
          title="Mudar Estágio"
        >
          {ESTAGIOS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* Contact Info Rows (Phone + Instagram/City) */}
      <div className="space-y-1.5 text-xs text-slate-500 font-medium">
        
        {/* Phone */}
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{formatDisplayPhone(lead.telefone)}</span>
        </div>

        {/* Instagram / City */}
        <div className="flex items-center gap-2">
          {lead.instagram ? (
            <>
              <Instagram className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{lead.instagram}</span>
            </>
          ) : (
            <>
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{lead.cidade}{lead.bairro ? `, ${lead.bairro}` : ''}</span>
            </>
          )}
        </div>

      </div>

      {/* Bottom Soft Colored Tag Pills (matching screenshot design) */}
      <div className="flex items-center justify-between pt-1">
        
        {/* Status / Potencial Pill Tag */}
        <span className={`px-3 py-1 rounded-lg text-[11px] tracking-tight ${tagStyle}`}>
          {lead.estagio === 'Perdido' ? 'Perdido' : lead.potencial}
        </span>

        {/* MRR Value Badge */}
        <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
          R$ {valor.toFixed(2)}/mês
        </span>
      </div>

      {/* Follow-up indicator if overdue */}
      {followUpInfo.status !== 'none' && (
        <div className={`flex items-center justify-between text-[11px] font-bold p-2 rounded-lg ${
          followUpInfo.status === 'overdue'
            ? 'bg-red-50 text-red-700 border border-red-200 animate-pulse'
            : 'bg-amber-50 text-amber-800 border border-amber-200'
        }`}>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {followUpInfo.label}
          </span>
        </div>
      )}

      {/* Quick Action Toolbar */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenCopyTemplate(lead);
          }}
          className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-ctrl-blue hover:bg-ctrl-blue-hover text-white font-bold text-[11px] shadow-xs transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Modelo</span>
        </button>

        {/* ⚡ 1-Click WhatsApp + Move to Contatado Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onQuickWhatsAppAction) {
              onQuickWhatsAppAction(lead);
            } else {
              window.open(whatsappUrl, '_blank');
            }
          }}
          className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-xs transition-colors"
          title="Abrir WhatsApp e mover para Contatado"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>⚡ Contatar</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenInteraction(lead);
          }}
          className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          title="+ Interação"
        >
          <PlusCircle className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
