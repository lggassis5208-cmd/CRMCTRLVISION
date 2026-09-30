import React, { useState } from 'react';
import { parseCsvText, RawCsvRow, parseStatusComercial } from '../utils/csvParser';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

interface ImportCsvModalProps {
  onClose: () => void;
  onImportLeads: (rawLeads: RawCsvRow[]) => Promise<{ importedCount: number; errorsCount: number; errors: string[] }>;
}

export const ImportCsvModal: React.FC<ImportCsvModalProps> = ({
  onClose,
  onImportLeads
}) => {
  const [csvRawText, setCsvRawText] = useState('');
  const [parsedRows, setParsedRows] = useState<RawCsvRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<{ importedCount: number; errorsCount: number; errors: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      processCsvText(text);
    };
    reader.onerror = () => {
      setError('Erro ao ler o arquivo CSV');
    };
    reader.readAsText(file, 'UTF-8');
  };

  const processCsvText = (text: string) => {
    try {
      setError(null);
      const rows = parseCsvText(text);
      setParsedRows(rows);
    } catch (err: any) {
      setError('Formato de CSV inválido: ' + err.message);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setCsvRawText(text);
    processCsvText(text);
  };

  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) {
      setError('Nenhum lead válido encontrado para importação');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      const res = await onImportLeads(parsedRows);
      setImportResult(res);
    } catch (err: any) {
      setError(err.message || 'Erro ao processar importação');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-ctrl-blue uppercase tracking-wider">Mapeamento Automático</span>
            <h2 className="font-heading font-bold text-xl text-slate-900">
              Importar Leads do Google Maps (CSV)
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
          <div className="mt-3 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Result View */}
        {importResult ? (
          <div className="mt-6 text-center space-y-4 py-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Importação Concluída com Sucesso!
              </h3>
              <p className="text-sm text-slate-600 font-semibold mt-1">
                {importResult.importedCount} {importResult.importedCount === 1 ? 'lead importado' : 'leads importados'} com sucesso.
              </p>
            </div>

            {importResult.errorsCount > 0 && (
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-left text-xs text-amber-900 max-h-40 overflow-y-auto space-y-1">
                <span className="font-bold text-amber-800">Avisos / Linhas ignoradas ({importResult.errorsCount}):</span>
                {importResult.errors.map((err, i) => (
                  <p key={i}>• {err}</p>
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-ctrl-blue hover:bg-ctrl-blue-hover text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
            >
              Ver no Pipeline Kanban
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            
            {/* Input methods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option A: File Upload */}
              <div className="border-2 border-dashed border-slate-300 hover:border-ctrl-blue rounded-2xl p-4 text-center flex flex-col items-center justify-center transition-colors bg-slate-50">
                <Upload className="w-8 h-8 text-ctrl-blue mb-2" />
                <p className="text-xs font-bold text-slate-800">Selecione o arquivo .CSV</p>
                <p className="text-[11px] text-slate-400 mb-3">Colunas: Nome, Cidade, Bairro, Telefone, Nota, Avaliações, Status</p>
                <label className="cursor-pointer bg-ctrl-blue hover:bg-ctrl-blue-hover text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs">
                  Procurar Arquivo
                  <input
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Option B: Paste Text */}
              <div className="flex flex-col">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ou cole o texto do CSV abaixo:
                </label>
                <textarea
                  rows={4}
                  value={csvRawText}
                  onChange={handleTextChange}
                  placeholder="Nome,Cidade,Bairro,Telefone,Status&#10;Consultório Dra. Ana,Goiânia,Bueno,62999998888,Altíssimo (Alto fluxo)"
                  className="w-full p-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:bg-white focus:outline-none flex-1 placeholder:text-slate-400"
                />
              </div>

            </div>

            {/* Preview Table */}
            {parsedRows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    Pré-visualização dos Leads ({parsedRows.length} encontrados)
                  </span>
                  <button
                    onClick={() => {
                      setParsedRows([]);
                      setCsvRawText('');
                    }}
                    className="text-xs text-red-600 hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Limpar
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto bg-slate-50">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-200 text-slate-700 font-semibold sticky top-0">
                      <tr>
                        <th className="p-2">#</th>
                        <th className="p-2">Nome</th>
                        <th className="p-2">Telefone</th>
                        <th className="p-2">Cidade</th>
                        <th className="p-2">Status Comercial</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {parsedRows.slice(0, 15).map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-100">
                          <td className="p-2 text-slate-400">{idx + 1}</td>
                          <td className="p-2 font-medium text-slate-900">{row.nome || row.Nome || row.Name || '-'}</td>
                          <td className="p-2 text-slate-600">{row.telefone || row.Telefone || row.Phone || '-'}</td>
                          <td className="p-2 text-slate-600">{row.cidade || row.Cidade || 'Goiânia'}</td>
                          <td className="p-2 text-slate-600 truncate max-w-[150px]">
                            {row.statusComercial || row.status || row.Status || row['Status Comercial'] || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={isProcessing || parsedRows.length === 0}
                className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 text-xs sm:text-sm font-semibold bg-ctrl-blue hover:bg-ctrl-blue-hover text-white rounded-xl shadow-md transition-colors disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span>{isProcessing ? 'Importando...' : `Confirmar Importação (${parsedRows.length})`}</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
