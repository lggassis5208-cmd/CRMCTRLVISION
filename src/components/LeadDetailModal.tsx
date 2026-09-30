import React, { useState } from 'react';
import { 
  Lead, 
  Estagio, 
  ESTAGIOS, 
  CanalInteracao, 
  CANAIS, 
  Cidade, 
  CIDADES, 
  TipoEstrutura, 
  TIPOS_ESTRUTURA, 
  Potencial, 
  POTENCIAIS,
  Especialidade,
  ESPECIALIDADES
} from '../types/crm';
import { 
  formatWhatsAppUrl, 
  formatInstagramUrl, 
  formatDisplayPhone, 
  getPotencialBadgeStyle,
  getDaysSinceLastContact,
  checkFollowUpStatus
} from '../utils/formatters';
import { 
  X, 
  MessageCircle, 
  Instagram, 
  PlusCircle, 
  Building2, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Edit2, 
  Trash2, 
  Copy, 
  DollarSign, 
  ArrowLeft, 
  Send, 
  ChevronDown, 
  ChevronUp, 
  PhoneCall, 
  UserCheck, 
  Save, 
  History 
} from 'lucide-react';

interface LeadDetailModalProps {
  lead: Lead;
  onClose: () => void;
  onOpenCopyTemplate: (lead: Lead) => void;
  onStageChange: (leadId: string, newStage: Estagio) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onSubmitInteraction: (data: {
    leadId: string;
    canal: CanalInteracao;
    resumo: string;
    proximaAcao?: string;
    dataProximoFollowUp?: string;
  }) => Promise<void>;
  onUpdateLeadInline: (leadId: string, data: Partial<Lead>) => Promise<void>;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  onClose,
  onOpenCopyTemplate,
  onStageChange,
  onEditLead,
  onDeleteLead,
  onSubmitInteraction,
  onUpdateLeadInline
}) => {
  const potStyle = getPotencialBadgeStyle(lead.potencial);
  const waUrl = formatWhatsAppUrl(lead.telefone);
  const instaUrl = formatInstagramUrl(lead.instagram);
  const lastContactInfo = getDaysSinceLastContact(lead.dataUltimoContato);
  const followInfo = checkFollowUpStatus(lead.dataProximoFollowUp);

  // New Interaction Form State (always visible at top of timeline)
  const [canal, setCanal] = useState<CanalInteracao>('WhatsApp');
  const [resumo, setResumo] = useState('');
  const [proximaAcao, setProximaAcao] = useState('');
  const [dataProximoFollowUp, setDataProximoFollowUp] = useState('');
  const [isSubmittingInteraction, setIsSubmittingInteraction] = useState(false);
  const [interactionError, setInteractionError] = useState<string | null>(null);

  // Collapsible stage history toggle state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Inline edit mode state
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [editNome, setEditNome] = useState(lead.nome);
  const [editTelefone, setEditTelefone] = useState(lead.telefone);
  const [editCidade, setEditCidade] = useState<Cidade>(lead.cidade);
  const [editBairro, setEditBairro] = useState(lead.bairro || '');
  const [editTipoEstrutura, setEditTipoEstrutura] = useState<TipoEstrutura>(lead.tipoEstrutura);
  const [editEspecialidade, setEditEspecialidade] = useState<Especialidade>(lead.especialidade);
  const [editPotencial, setEditPotencial] = useState<Potencial>(lead.potencial);
  const [editValorEstimado, setEditValorEstimado] = useState(String(lead.valorEstimado || 79.90));
  const [isSavingInline, setIsSavingInline] = useState(false);

  // Handle new interaction submission
  const handleRegisterInteraction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumo.trim()) {
      setInteractionError('Por favor, informe o resumo da interação.');
      return;
    }

    try {
      setIsSubmittingInteraction(true);
      setInteractionError(null);

      await onSubmitInteraction({
        leadId: lead.id,
        canal,
        resumo: resumo.trim(),
        proximaAcao: proximaAcao.trim() || undefined,
        dataProximoFollowUp: dataProximoFollowUp || undefined
      });

      // Reset interaction form fields
      setResumo('');
      setProximaAcao('');
      setDataProximoFollowUp('');
    } catch (err: any) {
      setInteractionError(err.message || 'Erro ao registrar interação');
    } finally {
      setIsSubmittingInteraction(false);
    }
  };

  // Handle inline edit save
  const handleSaveInlineEdit = async () => {
    try {
      setIsSavingInline(true);
      await onUpdateLeadInline(lead.id, {
        nome: editNome.trim(),
        telefone: editTelefone.trim(),
        cidade: editCidade,
        bairro: editBairro.trim() || null,
        tipoEstrutura: editTipoEstrutura,
        especialidade: editEspecialidade,
        potencial: editPotencial,
        valorEstimado: parseFloat(editValorEstimado) || 79.90
      });
      setIsInlineEditing(false);
    } catch (err) {
      console.error('Erro ao salvar edições do lead:', err);
    } finally {
      setIsSavingInline(false);
    }
  };

  // Channel Icon helper for timeline
  const getChannelIcon = (canal: string) => {
    switch (canal) {
      case 'WhatsApp':
        return <MessageCircle className="w-3.5 h-3.5 text-white" />;
      case 'Instagram':
        return <Instagram className="w-3.5 h-3.5 text-white" />;
      case 'Ligação':
        return <PhoneCall className="w-3.5 h-3.5 text-white" />;
      case 'Presencial':
      default:
        return <UserCheck className="w-3.5 h-3.5 text-white" />;
    }
  };

  const getChannelBadgeBg = (canal: string) => {
    switch (canal) {
      case 'WhatsApp': return 'bg-emerald-500';
      case 'Instagram': return 'bg-purple-600';
      case 'Ligação': return 'bg-blue-600';
      case 'Presencial': default: return 'bg-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs">
      
      {/* Slide-over Full Panel */}
      <div className="bg-white max-w-3xl w-full h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Top Sticky Navigation Bar */}
        <div className="bg-ctrl-graphite text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-md">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Kanban</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInlineEditing(!isInlineEditing)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{isInlineEditing ? 'Cancelar Edição' : 'Editar Dados'}</span>
            </button>

            <button
              onClick={() => {
                if (confirm(`Tem certeza que deseja excluir o lead "${lead.nome}"?`)) {
                  onDeleteLead(lead.id);
                  onClose();
                }
              }}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="Excluir Lead"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Detail Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* 1. CABEÇALHO PRINCIPAL */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            {isInlineEditing ? (
              /* Inline Edit Mode Fields */
              <div className="space-y-3 bg-white p-4 rounded-xl border border-ctrl-blue/40">
                <h3 className="text-xs font-bold text-ctrl-blue uppercase tracking-wider">Modo de Edição Rápida</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Nome do Estabelecimento *</label>
                    <input
                      type="text"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Telefone *</label>
                    <input
                      type="text"
                      value={editTelefone}
                      onChange={(e) => setEditTelefone(e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cidade *</label>
                    <select
                      value={editCidade}
                      onChange={(e) => setEditCidade(e.target.value as Cidade)}
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      {CIDADES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bairro</label>
                    <input
                      type="text"
                      value={editBairro}
                      onChange={(e) => setEditBairro(e.target.value)}
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tipo de Estrutura</label>
                    <select
                      value={editTipoEstrutura}
                      onChange={(e) => setEditTipoEstrutura(e.target.value as TipoEstrutura)}
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      {TIPOS_ESTRUTURA.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Potencial</label>
                    <select
                      value={editPotencial}
                      onChange={(e) => setEditPotencial(e.target.value as Potencial)}
                      className="w-full p-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    >
                      {POTENCIAIS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-emerald-800 mb-1">Valor Estimado (R$/mês)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editValorEstimado}
                      onChange={(e) => setEditValorEstimado(e.target.value)}
                      className="w-full p-2 text-xs bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsInlineEditing(false)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveInlineEdit}
                    disabled={isSavingInline}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-ctrl-blue text-white rounded-lg shadow-xs hover:bg-ctrl-blue-hover"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingInline ? 'Salvando...' : 'Salvar Alterações'}</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Display Header Mode */
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${potStyle.badge}`}>
                      Potencial {lead.potencial}
                    </span>

                    {/* Editable Stage Badge Dropdown */}
                    <div className="flex items-center gap-1 bg-white px-2.5 py-0.5 rounded-full border border-slate-300 text-xs font-bold text-slate-800">
                      <span className="text-slate-400">Estágio:</span>
                      <select
                        value={lead.estagio}
                        onChange={(e) => onStageChange(lead.id, e.target.value as Estagio)}
                        className="bg-transparent font-bold text-ctrl-blue focus:outline-none cursor-pointer"
                      >
                        {ESTAGIOS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      R$ {(lead.valorEstimado || 79.90).toFixed(2)}/mês
                    </span>
                  </div>

                  <h2 className="font-heading font-extrabold text-2xl text-slate-900 leading-tight">
                    {lead.nome}
                  </h2>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {lead.cidade}{lead.bairro ? `, ${lead.bairro}` : ''}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      {lead.tipoEstrutura} ({lead.especialidade})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Toolbar Buttons */}
            <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <button
                onClick={() => onOpenCopyTemplate(lead)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-xs"
              >
                <Copy className="w-4 h-4" />
                <span>Copiar modelo</span>
              </button>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold text-xs transition-colors border border-emerald-200"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              {instaUrl && (
                <a
                  href={instaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold text-xs transition-colors border border-purple-200"
                >
                  <Instagram className="w-4 h-4 text-purple-600" />
                  <span>Instagram</span>
                </a>
              )}
            </div>
          </div>

          {/* 2. DADOS DE CONTATO E ORIGEM */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-slate-200 text-xs shadow-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Telefone</span>
              <span className="font-bold text-slate-900">{formatDisplayPhone(lead.telefone)}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Instagram</span>
              <span className="font-bold text-slate-900">{lead.instagram || 'Não informado'}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Fonte de Origem</span>
              <span className="font-bold text-slate-900">{lead.fonte}</span>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Nota Google Maps</span>
              <span className="font-bold text-slate-900 flex items-center gap-1">
                {lead.notaGoogle ? (
                  <>
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {lead.notaGoogle} ({lead.avaliacoesGoogle || 0} av.)
                  </>
                ) : 'Sem nota'}
              </span>
            </div>
          </div>

          {lead.justificativaPotencial && (
            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
              <span className="font-bold block mb-1">Justificativa do Potencial:</span>
              <p className="italic">"{lead.justificativaPotencial}"</p>
            </div>
          )}

          {/* 3 & 4. SEÇÃO DE INTERAÇÕES: FORMULÁRIO DE NOVA INTERAÇÃO FIXO NO TOPO + TIMELINE VERTICAL */}
          <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-ctrl-blue" />
                Interações & Histórico do Prospecto
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {lead.interacoes?.length || 0} registradas
              </span>
            </div>

            {/* 4. FORMULÁRIO DE NOVA INTERAÇÃO SEMPRE VISÍVEL NO TOPO */}
            <form onSubmit={handleRegisterInteraction} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ctrl-blue uppercase tracking-wider flex items-center gap-1.5">
                  <PlusCircle className="w-4 h-4" />
                  Registrar Nova Interação Rápida
                </span>
                <span className="text-[11px] text-slate-400">Atualiza a data do último contato automaticamente</span>
              </div>

              {interactionError && (
                <div className="p-2 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200">
                  {interactionError}
                </div>
              )}

              {/* Canal selection */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Canal de Comunicação *</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CANAIS.map(c => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCanal(c)}
                      className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all ${
                        canal === c
                          ? 'bg-ctrl-blue text-white border-ctrl-blue shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resumo */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Resumo do Contato / Resposta *</label>
                <textarea
                  required
                  rows={2}
                  value={resumo}
                  onChange={(e) => setResumo(e.target.value)}
                  placeholder="Ex: Mandado áudio explicando o CTRL Vision. Cliente pediu retorno após as 14h..."
                  className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-ctrl-blue focus:outline-none"
                />
              </div>

              {/* Próxima Ação & Follow-up */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Próxima Ação (Opcional)</label>
                  <input
                    type="text"
                    value={proximaAcao}
                    onChange={(e) => setProximaAcao(e.target.value)}
                    placeholder="Ex: Enviar link de teste grátis"
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-ctrl-blue focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Data do Próximo Follow-up (Opcional)
                  </label>
                  <input
                    type="date"
                    value={dataProximoFollowUp}
                    onChange={(e) => setDataProximoFollowUp(e.target.value)}
                    className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-ctrl-blue focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingInteraction}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-ctrl-blue hover:bg-ctrl-blue-hover text-white rounded-xl shadow-xs transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingInteraction ? 'Registrando...' : 'Registrar Interação'}</span>
                </button>
              </div>
            </form>

            {/* 3. TIMELINE VERTICAL DE INTERAÇÕES (Cronológica Reversa) */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                Linha do Tempo (Mais recentes primeiro)
              </h4>

              {lead.interacoes && lead.interacoes.length > 0 ? (
                <div className="relative pl-6 space-y-6 border-l-2 border-slate-200 ml-2">
                  {lead.interacoes.map((item) => {
                    const badgeBg = getChannelBadgeBg(item.canal);

                    return (
                      <div key={item.id} className="relative group">
                        {/* Timeline Circle Node Icon */}
                        <div className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full ${badgeBg} flex items-center justify-center shadow-xs ring-4 ring-white`}>
                          {getChannelIcon(item.canal)}
                        </div>

                        {/* Timeline Item Content */}
                        <div className="bg-slate-50 hover:bg-slate-100/70 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1.5 transition-colors">
                          <div className="flex items-center justify-between text-slate-500">
                            <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                              {item.canal}
                            </span>
                            <span className="font-medium text-[11px]">
                              {new Date(item.data).toLocaleString('pt-BR')}
                            </span>
                          </div>

                          <p className="text-slate-800 leading-relaxed font-medium pt-1">
                            {item.resumo}
                          </p>

                          {item.proximaAcao && (
                            <div className="pt-2 border-t border-slate-200/70 text-ctrl-blue font-bold flex items-center gap-1 text-[11px]">
                              <span>🎯 Próxima Ação:</span>
                              <span className="font-medium text-slate-700">{item.proximaAcao}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  Nenhuma interação registrada ainda. Registre a primeira acima!
                </div>
              )}
            </div>

          </div>

          {/* 5. HISTÓRICO DE ESTÁGIO NO FUNIL (Seção Recolhível) */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className="w-full p-4 text-left font-heading font-bold text-sm text-slate-900 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-ctrl-blue" />
                <span>Histórico de Permanência nos Estágios do Funil</span>
              </div>
              {isHistoryOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isHistoryOpen && (
              <div className="p-4 border-t border-slate-200 space-y-2 text-xs">
                {lead.historicoEstagios && lead.historicoEstagios.length > 0 ? (
                  <div className="space-y-2">
                    {lead.historicoEstagios.map((h) => {
                      const start = new Date(h.entrouEm);
                      const end = h.saiuEm ? new Date(h.saiuEm) : null;
                      const durationTime = (end ? end.getTime() : new Date().getTime()) - start.getTime();
                      const days = Math.round(durationTime / (1000 * 60 * 60 * 24));

                      return (
                        <div key={h.id} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{h.estagio}</span>
                            {h.saiuEm === null && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-[10px] rounded-full">
                                Estágio Atual
                              </span>
                            )}
                          </div>
                          <div className="text-right text-slate-500 text-[11px]">
                            <span className="block font-semibold text-slate-700">
                              {days === 0 ? 'Entrou hoje' : `Permaneceu ~${days} ${days === 1 ? 'dia' : 'dias'}`}
                            </span>
                            <span>Entrou em: {start.toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Sem histórico acumulado.</p>
                )}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
