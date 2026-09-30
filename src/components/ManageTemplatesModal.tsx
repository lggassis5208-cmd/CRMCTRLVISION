import React, { useState } from 'react';
import { ModeloMensagem } from '../types/crm';
import { X, Plus, Trash2, Edit2, Save, MessageSquare } from 'lucide-react';

interface ManageTemplatesModalProps {
  modelos: ModeloMensagem[];
  onClose: () => void;
  onRefresh: () => void;
}

export const ManageTemplatesModal: React.FC<ManageTemplatesModalProps> = ({
  modelos,
  onClose,
  onRefresh
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nome, setNome] = useState('');
  const [canal, setCanal] = useState<'WhatsApp' | 'Instagram'>('WhatsApp');
  const [categoria, setCategoria] = useState<'Primeiro Contato' | 'Follow-up' | 'Resposta a Objeção' | 'Fechamento'>('Primeiro Contato');
  const [texto, setTexto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartEdit = (m: ModeloMensagem) => {
    setEditingId(m.id);
    setNome(m.nome);
    setCanal(m.canal);
    setCategoria(m.categoria);
    setTexto(m.texto);
    setIsEditing(true);
  };

  const handleStartNew = () => {
    setEditingId(null);
    setNome('');
    setCanal('WhatsApp');
    setCategoria('Primeiro Contato');
    setTexto('');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !texto.trim()) return;

    try {
      setIsSubmitting(true);
      if (editingId) {
        await fetch(`/api/modelos/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, canal, categoria, texto })
        });
      } else {
        await fetch('/api/modelos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, canal, categoria, texto })
        });
      }
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      console.error('Erro ao salvar modelo:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir este modelo de mensagem?')) return;
    try {
      await fetch(`/api/modelos/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error('Erro ao excluir modelo:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-ctrl-blue" />
              Gerenciador de Modelos de Mensagem
            </h2>
            <p className="text-xs text-slate-500">Cadastre e edite templates rápidos de prospeção</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800">
              {editingId ? 'Editar Modelo' : 'Novo Modelo'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-1">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nome *</label>
                <input
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Abordagem Inicial"
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Canal *</label>
                <select
                  value={canal}
                  onChange={(e) => setCanal(e.target.value as any)}
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Instagram">Instagram</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria *</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value as any)}
                  className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg"
                >
                  <option value="Primeiro Contato">Primeiro Contato</option>
                  <option value="Follow-up">Follow-up</option>
                  <option value="Resposta a Objeção">Resposta a Objeção</option>
                  <option value="Fechamento">Fechamento</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Texto da Mensagem (Use &#123;nome&#125; para o nome do lead) *
              </label>
              <textarea
                required
                rows={3}
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Oi, {nome}! Tudo bem?..."
                className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 text-xs font-semibold bg-ctrl-blue hover:bg-ctrl-blue-hover text-white rounded-lg shadow-xs"
              >
                Salvar Modelo
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-600">Modelos Cadastrados ({modelos.length})</span>
              <button
                onClick={handleStartNew}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-ctrl-blue hover:bg-ctrl-blue-hover text-white rounded-lg shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Novo Modelo</span>
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {modelos.map(m => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between gap-2 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{m.nome}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium text-[10px]">
                        {m.canal}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold text-[10px]">
                        {m.categoria}
                      </span>
                    </div>
                    <p className="text-slate-600 italic line-clamp-2">"{m.texto}"</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleStartEdit(m)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="p-1.5 text-red-400 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
