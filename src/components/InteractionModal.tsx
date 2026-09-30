import React, { useState } from 'react';
import { Lead, CanalInteracao, CANAIS } from '../types/crm';
import { X, Send, Calendar, MessageSquare } from 'lucide-react';

interface InteractionModalProps {
  lead: Lead;
  onClose: () => void;
  onSubmitInteraction: (data: {
    leadId: string;
    canal: CanalInteracao;
    resumo: string;
    proximaAcao?: string;
    dataProximoFollowUp?: string;
  }) => Promise<void>;
}

export const InteractionModal: React.FC<InteractionModalProps> = ({
  lead,
  onClose,
  onSubmitInteraction
}) => {
  const [canal, setCanal] = useState<CanalInteracao>('WhatsApp');
  const [resumo, setResumo] = useState('');
  const [proximaAcao, setProximaAcao] = useState('');
  const [dataProximoFollowUp, setDataProximoFollowUp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumo.trim()) {
      setError('Por favor, informe o resumo da interação.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmitInteraction({
        leadId: lead.id,
        canal,
        resumo: resumo.trim(),
        proximaAcao: proximaAcao.trim() || undefined,
        dataProximoFollowUp: dataProximoFollowUp || undefined
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar interação');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-ctrl-blue uppercase tracking-wider">Nova Interação</span>
            <h2 className="font-heading font-bold text-lg text-slate-900 leading-tight">
              {lead.nome}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs font-medium rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Canal */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Canal de Comunicação *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CANAIS.map(c => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCanal(c)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all ${
                    canal === c
                      ? 'bg-ctrl-blue text-white border-ctrl-blue shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Resumo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Resumo da Conversa *
            </label>
            <textarea
              required
              rows={3}
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              placeholder="O que o cliente disse ou respondeu? Ex: Gostou do sistema, pediu proposta..."
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ctrl-blue focus:bg-white placeholder:text-slate-400"
            />
          </div>

          {/* Próxima Ação */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Próxima Ação (Opcional)
            </label>
            <input
              type="text"
              value={proximaAcao}
              onChange={(e) => setProximaAcao(e.target.value)}
              placeholder="Ex: Enviar vídeo demonstrativo, Ligar para fechar..."
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ctrl-blue focus:bg-white placeholder:text-slate-400"
            />
          </div>

          {/* Data do Próximo Follow-up */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Agendar Próximo Follow-up (Opcional)
            </label>
            <input
              type="date"
              value={dataProximoFollowUp}
              onChange={(e) => setDataProximoFollowUp(e.target.value)}
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-ctrl-blue focus:bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Se preenchido, este lead aparecerá no seu painel de follow-up do dia selecionado.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2 text-xs sm:text-sm font-semibold bg-ctrl-blue hover:bg-ctrl-blue-hover text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Salvando...' : 'Salvar Interação'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
