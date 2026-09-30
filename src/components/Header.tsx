import React from 'react';
import { Plus, Upload, Download, Eye, BarChart3, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onOpenNewLeadModal: () => void;
  onOpenImportModal: () => void;
  onOpenManageTemplatesModal: () => void;
  onExportCsv: () => void;
  isExporting: boolean;
  activeTab: 'kanban' | 'followup' | 'insights';
  setActiveTab: (tab: 'kanban' | 'followup' | 'insights') => void;
  overdueCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewLeadModal,
  onOpenImportModal,
  onOpenManageTemplatesModal,
  onExportCsv,
  isExporting,
  activeTab,
  setActiveTab,
  overdueCount
}) => {
  return (
    <header className="bg-ctrl-graphite text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-3 gap-3">
          
          {/* Logo & App Title */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-ctrl-blue flex items-center justify-center font-heading font-extrabold text-lg text-white shadow-sm">
                CV
              </div>
              <div>
                <h1 className="font-heading font-bold text-lg tracking-tight leading-none text-white">
                  CTRL Vision CRM
                </h1>
                <p className="text-xs text-slate-400 font-medium">Prospecção B2B • Optometria</p>
              </div>
            </div>

            {/* Mobile Tab Switcher */}
            <div className="flex lg:hidden items-center bg-slate-800 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('kanban')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'kanban'
                    ? 'bg-ctrl-blue text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Kanban
              </button>
              <button
                onClick={() => setActiveTab('followup')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 transition-colors ${
                  activeTab === 'followup'
                    ? 'bg-ctrl-blue text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Follow-up
                {overdueCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1 rounded-full font-bold">
                    {overdueCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('insights')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'insights'
                    ? 'bg-ctrl-blue text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Insights
              </button>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden lg:flex items-center bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                activeTab === 'kanban'
                  ? 'bg-ctrl-blue text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Pipeline Kanban
            </button>
            <button
              onClick={() => setActiveTab('followup')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${
                activeTab === 'followup'
                  ? 'bg-ctrl-blue text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4" />
              Follow-ups do Dia
              {overdueCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {overdueCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-1.5 text-sm font-semibold rounded-md flex items-center gap-2 transition-colors ${
                activeTab === 'insights'
                  ? 'bg-ctrl-blue text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Insights
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <button
              onClick={onOpenManageTemplatesModal}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              title="Gerenciar Modelos de Mensagem"
            >
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Modelos</span>
            </button>

            <button
              onClick={onOpenImportModal}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              title="Importar CSV do Google Maps"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importar</span>
            </button>

            <button
              onClick={onExportCsv}
              disabled={isExporting}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
              title="Exportar CSV com histórico"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            <button
              onClick={onOpenNewLeadModal}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold bg-ctrl-blue hover:bg-ctrl-blue-hover text-white rounded-lg shadow transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Lead</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
