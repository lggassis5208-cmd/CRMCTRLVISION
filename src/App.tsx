import React, { useState, useEffect, useCallback } from 'react';
import { Lead, FilterOptions, MetricSummary, Estagio, CanalInteracao, ModeloMensagem } from './types/crm';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { TopFilters } from './components/TopFilters';
import { KanbanBoard } from './components/KanbanBoard';
import { FollowUpPanel } from './components/FollowUpPanel';
import { InsightsView } from './components/InsightsView';
import { InteractionModal } from './components/InteractionModal';
import { LeadFormModal } from './components/LeadFormModal';
import { ImportCsvModal } from './components/ImportCsvModal';
import { LeadDetailModal } from './components/LeadDetailModal';
import { CopyTemplateModal } from './components/CopyTemplateModal';
import { ManageTemplatesModal } from './components/ManageTemplatesModal';
import { LoginScreen } from './components/LoginScreen';
import { RawCsvRow } from './utils/csvParser';
import { formatWhatsAppUrl } from './utils/formatters';

const DEFAULT_FILTERS: FilterOptions = {
  cidade: 'todas',
  especialidade: 'Optometria',
  potencial: 'todos',
  estagio: 'todos',
  fonte: 'todas',
  search: ''
};

export default function App() {
  // 🔐 Auth State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ctrl_crm_token'));
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; nome: string } | null>(() => {
    const saved = localStorage.getItem('ctrl_crm_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [leads, setLeads] = useState<Lead[]>([]);
  const [modelos, setModelos] = useState<ModeloMensagem[]>([]);
  const [metrics, setMetrics] = useState<MetricSummary>({
    totalLeads: 0,
    responseRate: 0,
    overdueCount: 0,
    totalPipelineValue: 0,
    stageCounts: {
      'Novo': 0,
      'Contatado': 0,
      'Respondeu': 0,
      'Qualificado': 0,
      'Teste Agendado': 0,
      'Em Teste': 0,
      'Cliente': 0,
      'Perdido': 0,
      'Sem Interesse': 0
    }
  });

  const [filters, setFilters] = useState<FilterOptions>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<'kanban' | 'followup' | 'insights'>('kanban');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [interactionLead, setInteractionLead] = useState<Lead | null>(null);
  const [copyTemplateLead, setCopyTemplateLead] = useState<Lead | null>(null);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isManageTemplatesOpen, setIsManageTemplatesOpen] = useState(false);
  const [selectedDetailLead, setSelectedDetailLead] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Helper fetch autenticado
  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const savedToken = localStorage.getItem('ctrl_crm_token');
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${savedToken}`,
      'Content-Type': 'application/json'
    };

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      localStorage.removeItem('ctrl_crm_token');
      localStorage.removeItem('ctrl_crm_user');
      setToken(null);
      setCurrentUser(null);
      throw new Error('Sessão expirada. Faça login novamente.');
    }
    return res;
  }, []);

  // Fetch Leads
  const fetchLeads = useCallback(async () => {
    if (!token) return;
    try {
      const queryParams = new URLSearchParams();
      if (filters.cidade) queryParams.set('cidade', filters.cidade);
      if (filters.especialidade) queryParams.set('especialidade', filters.especialidade);
      if (filters.potencial) queryParams.set('potencial', filters.potencial);
      if (filters.estagio) queryParams.set('estagio', filters.estagio);
      if (filters.fonte) queryParams.set('fonte', filters.fonte);
      if (filters.search) queryParams.set('search', filters.search);

      const res = await authFetch(`/api/leads?${queryParams.toString()}`);
      const data = await res.json();
      setLeads(data);
    } catch (err) {
      console.error('Erro ao buscar leads:', err);
    }
  }, [filters, token, authFetch]);

  // Fetch Metrics
  const fetchMetrics = useCallback(async () => {
    if (!token) return;
    try {
      const res = await authFetch('/api/leads/metrics');
      const data = await res.json();
      setMetrics(data);
    } catch (err) {
      console.error('Erro ao buscar métricas:', err);
    }
  }, [token, authFetch]);

  // Fetch Message Templates
  const fetchModelos = useCallback(async () => {
    if (!token) return;
    try {
      const res = await authFetch('/api/modelos');
      const data = await res.json();
      setModelos(data);
    } catch (err) {
      console.error('Erro ao buscar modelos:', err);
    }
  }, [token, authFetch]);

  useEffect(() => {
    if (!token) return;
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchLeads(), fetchMetrics(), fetchModelos()]);
      setIsLoading(false);
    };
    loadAll();
  }, [token, fetchLeads, fetchMetrics, fetchModelos]);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleLogout = () => {
    localStorage.removeItem('ctrl_crm_token');
    localStorage.removeItem('ctrl_crm_user');
    setToken(null);
    setCurrentUser(null);
  };

  // Stage change handler
  const handleStageChange = async (leadId: string, newStage: Estagio) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, estagio: newStage } : l));

    try {
      const res = await authFetch(`/api/leads/${leadId}`, {
        method: 'PUT',
        body: JSON.stringify({ estagio: newStage })
      });
      if (!res.ok) throw new Error('Falha ao atualizar estágio');
      const updated = await res.json();
      if (selectedDetailLead && selectedDetailLead.id === leadId) {
        setSelectedDetailLead(updated);
      }
      await Promise.all([fetchLeads(), fetchMetrics()]);
    } catch (err) {
      console.error('Erro ao atualizar estágio:', err);
      fetchLeads();
    }
  };

  // ⚡ 1-Click WhatsApp Action Handler (opens WhatsApp, updates stage to Contatado & registers interaction)
  const handleQuickWhatsAppAction = async (lead: Lead, customMessage?: string) => {
    // 1. Format URL and open WhatsApp Web
    const waUrl = formatWhatsAppUrl(lead.telefone, customMessage);
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // 2. Automatically register interaction
    try {
      await authFetch('/api/interacoes', {
        method: 'POST',
        body: JSON.stringify({
          leadId: lead.id,
          canal: 'WhatsApp',
          resumo: customMessage 
            ? `Disparo de mensagem rápida via WhatsApp: "${customMessage.slice(0, 70)}..."` 
            : 'Abordagem via WhatsApp realizada (Ação 1-Clique).',
          estagioResultante: lead.estagio === 'Novo' ? 'Contatado' : lead.estagio
        })
      });

      // 3. Move stage to Contatado if current stage is Novo
      if (lead.estagio === 'Novo') {
        await handleStageChange(lead.id, 'Contatado');
      } else {
        await Promise.all([fetchLeads(), fetchMetrics()]);
      }
    } catch (err) {
      console.error('Erro na ação rápida de WhatsApp:', err);
    }
  };

  // Interaction submit handler
  const handleSubmitInteraction = async (data: {
    leadId: string;
    canal: CanalInteracao;
    resumo: string;
    proximaAcao?: string;
    dataProximoFollowUp?: string;
  }) => {
    const res = await authFetch('/api/interacoes', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Erro ao registrar interação');
    }

    const { lead: updatedLead } = await res.json();
    if (selectedDetailLead && selectedDetailLead.id === data.leadId) {
      setSelectedDetailLead(updatedLead);
    }

    await Promise.all([fetchLeads(), fetchMetrics()]);
  };

  // Inline update Lead handler
  const handleUpdateLeadInline = async (leadId: string, updateData: Partial<Lead>) => {
    const res = await authFetch(`/api/leads/${leadId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Erro ao atualizar lead');
    }

    const updated = await res.json();
    if (selectedDetailLead && selectedDetailLead.id === leadId) {
      setSelectedDetailLead(updated);
    }

    await Promise.all([fetchLeads(), fetchMetrics()]);
  };

  // Save / Update Lead
  const handleSaveLead = async (leadData: Partial<Lead>) => {
    if (editingLead) {
      const res = await authFetch(`/api/leads/${editingLead.id}`, {
        method: 'PUT',
        body: JSON.stringify(leadData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao atualizar lead');
      }
      const updated = await res.json();
      if (selectedDetailLead && selectedDetailLead.id === editingLead.id) {
        setSelectedDetailLead(updated);
      }
    } else {
      const res = await authFetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify(leadData)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Erro ao criar lead');
      }
    }

    await Promise.all([fetchLeads(), fetchMetrics()]);
  };

  // Delete Lead
  const handleDeleteLead = async (leadId: string) => {
    try {
      const res = await authFetch(`/api/leads/${leadId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar lead');
      if (selectedDetailLead && selectedDetailLead.id === leadId) {
        setSelectedDetailLead(null);
      }
      await Promise.all([fetchLeads(), fetchMetrics()]);
    } catch (err) {
      console.error('Erro ao excluir lead:', err);
    }
  };

  // Import CSV
  const handleImportLeads = async (rawLeads: RawCsvRow[]) => {
    const res = await authFetch('/api/leads/import', {
      method: 'POST',
      body: JSON.stringify({ leads: rawLeads })
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Erro ao importar leads');
    }

    const data = await res.json();
    await Promise.all([fetchLeads(), fetchMetrics()]);
    return data;
  };

  // Export CSV
  const handleExportCsv = () => {
    setIsExporting(true);
    const savedToken = localStorage.getItem('ctrl_crm_token');
    window.location.href = `/api/export/csv?token=${savedToken}`;
    setTimeout(() => setIsExporting(false), 2000);
  };

  // 🔒 Render Login Screen if not authenticated
  if (!token) {
    return (
      <LoginScreen
        onLoginSuccess={(newToken, userObj) => {
          setToken(newToken);
          setCurrentUser(userObj);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F6F9] font-sans text-slate-800">
      
      {/* Left Sidebar matching screenshot */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        overdueCount={metrics.overdueCount}
        onOpenNewLeadModal={() => {
          setEditingLead(null);
          setIsLeadFormOpen(true);
        }}
        onOpenImportModal={() => setIsImportOpen(true)}
        onOpenManageTemplatesModal={() => setIsManageTemplatesOpen(true)}
        onExportCsv={handleExportCsv}
        onLogout={handleLogout}
        userEmail={currentUser?.email || 'admin@ctrlvision.com.br'}
      />

      {/* Right Main Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Bar matching screenshot */}
        <TopBar
          search={filters.search}
          onSearchChange={(val) => handleFilterChange('search', val)}
          onOpenNewLeadModal={() => {
            setEditingLead(null);
            setIsLeadFormOpen(true);
          }}
          onExportCsv={handleExportCsv}
          overdueCount={metrics.overdueCount}
        />

        {/* Content View */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-ctrl-blue border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-500">Carregando CRM CTRL Vision...</p>
            </div>
          ) : activeTab === 'kanban' ? (
            <div>
              <TopFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                totalFiltered={leads.length}
                onOpenNewLeadModal={() => {
                  setEditingLead(null);
                  setIsLeadFormOpen(true);
                }}
              />
              <div className="px-8">
                <KanbanBoard
                  leads={leads}
                  onStageChange={handleStageChange}
                  onOpenInteraction={(lead) => setInteractionLead(lead)}
                  onOpenCopyTemplate={(lead) => setCopyTemplateLead(lead)}
                  onEditLead={(lead) => {
                    setEditingLead(lead);
                    setIsLeadFormOpen(true);
                  }}
                  onDeleteLead={handleDeleteLead}
                  onSelectLead={(lead) => setSelectedDetailLead(lead)}
                  onQuickWhatsAppAction={handleQuickWhatsAppAction}
                />
              </div>
            </div>
          ) : activeTab === 'followup' ? (
            <div className="p-8">
              <FollowUpPanel
                leads={leads}
                onOpenInteraction={(lead) => setInteractionLead(lead)}
                onSelectLead={(lead) => setSelectedDetailLead(lead)}
                onStageChange={handleStageChange}
              />
            </div>
          ) : (
            <div className="p-8">
              <InsightsView />
            </div>
          )}
        </div>

      </div>

      {/* Modals & Slide-over views */}
      {interactionLead && (
        <InteractionModal
          lead={interactionLead}
          onClose={() => setInteractionLead(null)}
          onSubmitInteraction={handleSubmitInteraction}
        />
      )}

      {copyTemplateLead && (
        <CopyTemplateModal
          lead={copyTemplateLead}
          modelos={modelos}
          onClose={() => setCopyTemplateLead(null)}
          onQuickWhatsAppAction={handleQuickWhatsAppAction}
        />
      )}

      {isLeadFormOpen && (
        <LeadFormModal
          initialLead={editingLead}
          onClose={() => {
            setIsLeadFormOpen(false);
            setEditingLead(null);
          }}
          onSubmit={handleSaveLead}
        />
      )}

      {isImportOpen && (
        <ImportCsvModal
          onClose={() => setIsImportOpen(false)}
          onImportLeads={handleImportLeads}
        />
      )}

      {isManageTemplatesOpen && (
        <ManageTemplatesModal
          modelos={modelos}
          onClose={() => setIsManageTemplatesOpen(false)}
          onRefresh={fetchModelos}
        />
      )}

      {selectedDetailLead && (
        <LeadDetailModal
          lead={selectedDetailLead}
          onClose={() => setSelectedDetailLead(null)}
          onOpenCopyTemplate={(lead) => setCopyTemplateLead(lead)}
          onStageChange={handleStageChange}
          onEditLead={(lead) => {
            setEditingLead(lead);
            setIsLeadFormOpen(true);
          }}
          onDeleteLead={handleDeleteLead}
          onSubmitInteraction={handleSubmitInteraction}
          onUpdateLeadInline={handleUpdateLeadInline}
        />
      )}

    </div>
  );
}
