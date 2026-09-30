import React, { useState } from 'react';
import { 
  Lead, 
  Cidade, 
  CIDADES, 
  TipoEstrutura, 
  TIPOS_ESTRUTURA, 
  Especialidade, 
  ESPECIALIDADES, 
  Fonte, 
  FONTES, 
  Potencial, 
  POTENCIAIS, 
  Estagio, 
  ESTAGIOS, 
  MotivoPerda, 
  MOTIVOS_PERDA 
} from '../types/crm';
import { X, Save, AlertCircle, DollarSign } from 'lucide-react';

interface LeadFormModalProps {
  initialLead?: Lead | null;
  onClose: () => void;
  onSubmit: (leadData: Partial<Lead>) => Promise<void>;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  initialLead,
  onClose,
  onSubmit
}) => {
  const isEditing = Boolean(initialLead);

  const [nome, setNome] = useState(initialLead?.nome || '');
  const [telefone, setTelefone] = useState(initialLead?.telefone || '');
  const [cidade, setCidade] = useState<Cidade>(initialLead?.cidade || 'Goiânia');
  const [bairro, setBairro] = useState(initialLead?.bairro || '');
  const [tipoEstrutura, setTipoEstrutura] = useState<TipoEstrutura>(initialLead?.tipoEstrutura || 'Consultório Individual');
  const [especialidade, setEspecialidade] = useState<Especialidade>(initialLead?.especialidade || 'Optometria');
  const [instagram, setInstagram] = useState(initialLead?.instagram || '');
  const [fonte, setFonte] = useState<Fonte>(initialLead?.fonte || 'Google Maps');
  const [potencial, setPotencial] = useState<Potencial>(initialLead?.potencial || 'Médio');
  const [justificativaPotencial, setJustificativaPotencial] = useState(initialLead?.justificativaPotencial || '');
  const [estagio, setEstagio] = useState<Estagio>(initialLead?.estagio || 'Novo');
  const [motivoPerda, setMotivoPerda] = useState<MotivoPerda | ''>(initialLead?.motivoPerda || '');
  const [valorEstimado, setValorEstimado] = useState(initialLead?.valorEstimado ? String(initialLead.valorEstimado) : '79.90');
  const [notaGoogle, setNotaGoogle] = useState(initialLead?.notaGoogle !== undefined && initialLead?.notaGoogle !== null ? String(initialLead.notaGoogle) : '');
  const [avaliacoesGoogle, setAvaliacoesGoogle] = useState(initialLead?.avaliacoesGoogle !== undefined && initialLead?.avaliacoesGoogle !== null ? String(initialLead.avaliacoesGoogle) : '');
  const [dataProximoFollowUp, setDataProximoFollowUp] = useState(
    initialLead?.dataProximoFollowUp ? initialLead.dataProximoFollowUp.slice(0, 10) : ''
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      setError('O nome é obrigatório');
      return;
    }

    const digits = telefone.replace(/\D/g, '');
    if (digits.length < 10 || digits.length > 13) {
      setError('Telefone inválido. O telefone precisa ter DDD + Número (ex: 62 99999-9999)');
      return;
    }

    if (estagio === 'Perdido' && !motivoPerda) {
      setError('Informe o motivo da perda');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await onSubmit({
        nome: nome.trim(),
        telefone: telefone.trim(),
        cidade,
        bairro: bairro.trim() || null,
        tipoEstrutura,
        especialidade,
        instagram: instagram.trim() || null,
        fonte,
        potencial,
        justificativaPotencial: justificativaPotencial.trim() || null,
        estagio,
        motivoPerda: estagio === 'Perdido' ? (motivoPerda as MotivoPerda) : null,
        valorEstimado: valorEstimado ? parseFloat(valorEstimado) : 79.90,
        notaGoogle: notaGoogle ? parseFloat(notaGoogle) : null,
        avaliacoesGoogle: avaliacoesGoogle ? parseInt(avaliacoesGoogle, 10) : null,
        dataProximoFollowUp: dataProximoFollowUp || null
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar lead');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-heading font-bold text-xl text-slate-900">
              {isEditing ? 'Editar Lead' : 'Novo Lead para Prospecção'}
            </h2>
            <p className="text-xs text-slate-500">Preencha as informações do optometrista/gabinete</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Row 1: Nome & Telefone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Lead / Gabinete *
              </label>
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Consultório Dr. Lucas (Optometria)"
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefone (com DDD) *
              </label>
              <input
                type="text"
                required
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="Ex: 62 99999-8888"
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Cidade & Bairro */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cidade *
              </label>
              <select
                value={cidade}
                onChange={(e) => setCidade(e.target.value as Cidade)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              >
                {CIDADES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bairro (Opcional)
              </label>
              <input
                type="text"
                value={bairro}
                onChange={(e) => setBairro(e.target.value)}
                placeholder="Ex: Setor Bueno, Centro"
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Row 3: TipoEstrutura & Especialidade */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tipo de Estrutura *
              </label>
              <select
                value={tipoEstrutura}
                onChange={(e) => setTipoEstrutura(e.target.value as TipoEstrutura)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              >
                {TIPOS_ESTRUTURA.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Especialidade *
              </label>
              <select
                value={especialidade}
                onChange={(e) => setEspecialidade(e.target.value as Especialidade)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              >
                {ESPECIALIDADES.map(es => (
                  <option key={es} value={es}>{es}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Instagram & Valor Estimado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instagram (@perfil)
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@exemplo.optometria"
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Valor Mensal Estimado (MRR) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={valorEstimado}
                onChange={(e) => setValorEstimado(e.target.value)}
                placeholder="79.90"
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none font-semibold text-emerald-800"
              />
            </div>
          </div>

          {/* Row 5: Fonte & Potencial */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Fonte de Origem *
              </label>
              <select
                value={fonte}
                onChange={(e) => setFonte(e.target.value as Fonte)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              >
                {FONTES.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Potencial Comercial *
              </label>
              <select
                value={potencial}
                onChange={(e) => setPotencial(e.target.value as Potencial)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              >
                {POTENCIAIS.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Justificativa */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Justificativa do Potencial
            </label>
            <input
              type="text"
              value={justificativaPotencial}
              onChange={(e) => setJustificativaPotencial(e.target.value)}
              placeholder="Ex: Muitas avaliações, 2 óticas parceiras"
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
            />
          </div>

          {/* Row 6: Estagio & Motivo de Perda */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estágio do Funil *
              </label>
              <select
                value={estagio}
                onChange={(e) => setEstagio(e.target.value as Estagio)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              >
                {ESTAGIOS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {estagio === 'Perdido' && (
              <div>
                <label className="block text-xs font-semibold text-red-700 mb-1">
                  Motivo da Perda *
                </label>
                <select
                  required
                  value={motivoPerda}
                  onChange={(e) => setMotivoPerda(e.target.value as MotivoPerda)}
                  className="w-full p-2.5 text-xs sm:text-sm bg-red-50 border border-red-300 text-red-900 rounded-xl focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  <option value="">Selecione o motivo...</option>
                  {MOTIVOS_PERDA.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Row 7: Google Rating & Reviews */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nota Google Maps
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={notaGoogle}
                onChange={(e) => setNotaGoogle(e.target.value)}
                placeholder="Ex: 4.8"
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Qtd Avaliações Google
              </label>
              <input
                type="number"
                min="0"
                value={avaliacoesGoogle}
                onChange={(e) => setAvaliacoesGoogle(e.target.value)}
                placeholder="Ex: 45"
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Próximo Follow-up
              </label>
              <input
                type="date"
                value={dataProximoFollowUp}
                onChange={(e) => setDataProximoFollowUp(e.target.value)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-semibold bg-ctrl-blue hover:bg-ctrl-blue-hover text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Salvando...' : isEditing ? 'Salvar Alterações' : 'Criar Lead'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
