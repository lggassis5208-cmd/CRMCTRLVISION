import React, { useState } from 'react';
import { Lead, ModeloMensagem } from '../types/crm';
import { formatWhatsAppUrl, formatInstagramUrl } from '../utils/formatters';
import { X, Copy, Check, MessageCircle, Instagram, ExternalLink } from 'lucide-react';

interface CopyTemplateModalProps {
  lead: Lead;
  modelos: ModeloMensagem[];
  onClose: () => void;
  onQuickWhatsAppAction?: (lead: Lead, customMessage?: string) => void;
}

export const CopyTemplateModal: React.FC<CopyTemplateModalProps> = ({
  lead,
  modelos,
  onClose,
  onQuickWhatsAppAction
}) => {
  const [selectedCanal, setSelectedCanal] = useState<'WhatsApp' | 'Instagram'>('WhatsApp');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter templates by channel
  const filteredModelos = modelos.filter(m => m.canal === selectedCanal);

  const getReplacedText = (templateText: string) => {
    // Replace {nome} with lead's first name or full name
    const firstName = lead.nome.replace(/^EXEMPLO —\s*/, '').split(' ')[0];
    return templateText.replace(/\{nome\}/g, firstName);
  };

  const handleCopyAndOpen = (modelo: ModeloMensagem) => {
    const textToCopy = getReplacedText(modelo.texto);
    
    // Copy to clipboard
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(modelo.id);

    // Open channel link & auto move stage/log interaction!
    setTimeout(() => {
      if (selectedCanal === 'WhatsApp') {
        if (onQuickWhatsAppAction) {
          onQuickWhatsAppAction(lead, textToCopy);
        } else {
          const url = formatWhatsAppUrl(lead.telefone, textToCopy);
          window.open(url, '_blank');
        }
      } else {
        const url = formatInstagramUrl(lead.instagram);
        if (url) window.open(url, '_blank');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4 animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-ctrl-blue uppercase tracking-wider">Modelos Prontos</span>
            <h2 className="font-heading font-bold text-lg text-slate-900">
              Enviar Mensagem para {lead.nome.replace(/^EXEMPLO —\s*/, '')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selector */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setSelectedCanal('WhatsApp')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              selectedCanal === 'WhatsApp'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp (Pré-preenche texto)</span>
          </button>

          <button
            onClick={() => setSelectedCanal('Instagram')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              selectedCanal === 'Instagram'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
          </button>
        </div>

        {/* List of Templates */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {filteredModelos.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
              Nenhum modelo cadastrado para este canal.
            </div>
          ) : (
            filteredModelos.map(modelo => {
              const previewText = getReplacedText(modelo.texto);
              const isCopied = copiedId === modelo.id;

              return (
                <div
                  key={modelo.id}
                  className="bg-slate-50 hover:bg-slate-100/80 p-4 rounded-xl border border-slate-200 space-y-2 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-800">{modelo.nome}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {modelo.categoria}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyAndOpen(modelo)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : selectedCanal === 'WhatsApp'
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          : 'bg-ctrl-blue hover:bg-ctrl-blue-hover text-white'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Texto Pronto & Abrindo!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Enviar no WhatsApp</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 italic bg-white p-2.5 rounded-lg border border-slate-200/80">
                    "{previewText}"
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Direct Link Without Template */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Deseja abrir o conversa em branco sem mensagem pré-definida?</span>
          <a
            href={selectedCanal === 'WhatsApp' ? formatWhatsAppUrl(lead.telefone) : (formatInstagramUrl(lead.instagram) || '#')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ctrl-blue font-bold hover:underline inline-flex items-center gap-1"
          >
            <span>Abrir sem texto</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
