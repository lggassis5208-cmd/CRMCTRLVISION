import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart3, 
  MessageSquare, 
  Upload, 
  Download, 
  ShieldCheck, 
  FileText,
  Eye
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'kanban' | 'followup' | 'insights';
  setActiveTab: (tab: 'kanban' | 'followup' | 'insights') => void;
  overdueCount: number;
  onOpenNewLeadModal: () => void;
  onOpenImportModal: () => void;
  onOpenManageTemplatesModal: () => void;
  onExportCsv: () => void;
  onLogout?: () => void;
  userEmail?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  overdueCount,
  onOpenImportModal,
  onOpenManageTemplatesModal,
  onExportCsv,
  onLogout,
  userEmail = 'admin@ctrlvision.com.br'
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen select-none">
      
      {/* Top Branding Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-ctrl-blue flex items-center justify-center text-white font-extrabold text-xl shadow-md">
            <div className="w-5 h-5 rounded-full border-3 border-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full" />
            </div>
          </div>
          <div>
            <h1 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight leading-none">
              CRM
            </h1>
            <span className="text-[11px] font-semibold text-slate-400">CTRL Vision • Optometria</span>
          </div>
        </div>

        {/* Sidebar Navigation Menu Items */}
        <nav className="mt-8 space-y-1.5">
          
          {/* Dashboard */}
          <button
            onClick={() => setActiveTab('kanban')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'kanban'
                ? 'bg-ctrl-blue text-white font-bold shadow-md shadow-ctrl-blue/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
          </button>

          {/* Leads (Active main pipeline) */}
          <button
            onClick={() => setActiveTab('kanban')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'kanban'
                ? 'bg-ctrl-blue text-white font-bold shadow-md shadow-ctrl-blue/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>Leads (Kanban)</span>
            </div>
          </button>

          {/* Follow-ups do Dia */}
          <button
            onClick={() => setActiveTab('followup')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'followup'
                ? 'bg-ctrl-blue text-white font-bold shadow-md shadow-ctrl-blue/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4" />
              <span>Follow-ups</span>
            </div>
            {overdueCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                activeTab === 'followup' ? 'bg-white text-ctrl-blue' : 'bg-red-500 text-white'
              }`}>
                {overdueCount}
              </span>
            )}
          </button>

          {/* Insights & Relatórios */}
          <button
            onClick={() => setActiveTab('insights')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-xs transition-all ${
              activeTab === 'insights'
                ? 'bg-ctrl-blue text-white font-bold shadow-md shadow-ctrl-blue/20'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-4 h-4" />
              <span>Insights & Funil</span>
            </div>
          </button>

          <div className="pt-4 pb-2">
            <span className="px-4 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Ferramentas</span>
          </div>

          {/* Modelos de Mensagem */}
          <button
            onClick={onOpenManageTemplatesModal}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <MessageSquare className="w-4 h-4 text-amber-500" />
            <span>Modelos de Mensagem</span>
          </button>

          {/* Importar CSV */}
          <button
            onClick={onOpenImportModal}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Upload className="w-4 h-4 text-ctrl-blue" />
            <span>Importar CSV</span>
          </button>

          {/* Exportar CSV */}
          <button
            onClick={onExportCsv}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Exportar CSV</span>
          </button>

        </nav>
      </div>

      {/* Sidebar Footer User Info & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-full bg-ctrl-blue text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {userEmail[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate">Fundador</p>
            <p className="text-[10px] text-slate-500 truncate">{userEmail}</p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
            title="Sair do CRM"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        )}
      </div>

    </aside>
  );
};
