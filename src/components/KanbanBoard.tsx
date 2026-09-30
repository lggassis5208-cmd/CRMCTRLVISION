import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Lead, Estagio, ESTAGIOS } from '../types/crm';
import { LeadCard } from './LeadCard';

interface KanbanBoardProps {
  leads: Lead[];
  onStageChange: (leadId: string, newStage: Estagio) => void;
  onOpenInteraction: (lead: Lead) => void;
  onOpenCopyTemplate: (lead: Lead) => void;
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  onSelectLead: (lead: Lead) => void;
  onQuickWhatsAppAction?: (lead: Lead) => void;
}

const STAGE_DOT_COLORS: Record<Estagio, string> = {
  'Novo': 'bg-amber-500',
  'Contatado': 'bg-blue-500',
  'Respondeu': 'bg-teal-500',
  'Qualificado': 'bg-indigo-500',
  'Teste Agendado': 'bg-purple-500',
  'Em Teste': 'bg-violet-500',
  'Cliente': 'bg-emerald-500',
  'Perdido': 'bg-red-500',
  'Sem Interesse': 'bg-slate-400'
};

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  leads,
  onStageChange,
  onOpenInteraction,
  onOpenCopyTemplate,
  onEditLead,
  onDeleteLead,
  onSelectLead,
  onQuickWhatsAppAction
}) => {
  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;

    const sourceStage = result.source.droppableId as Estagio;
    const destStage = destination.droppableId as Estagio;

    if (sourceStage === destStage) return;

    onStageChange(draggableId, destStage);
  };

  const leadsByStage = ESTAGIOS.reduce((acc, stage) => {
    acc[stage] = leads.filter(l => l.estagio === stage);
    return acc;
  }, {} as Record<Estagio, Lead[]>);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-5 overflow-x-auto pb-6 pt-2 px-1 max-w-full items-start h-[calc(100vh-230px)] snap-x scrollbar-thin">
        {ESTAGIOS.map(stage => {
          const columnLeads = leadsByStage[stage] || [];
          const dotColor = STAGE_DOT_COLORS[stage];
          const columnTotalValue = columnLeads.reduce((acc, l) => acc + (l.valorEstimado || 79.90), 0);

          return (
            <div
              key={stage}
              className="w-80 shrink-0 flex flex-col h-full snap-center space-y-3"
            >
              {/* Column Header (matching screenshot pill design) */}
              <div className="bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 flex items-center justify-between shrink-0 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                  <h3 className="font-heading font-bold text-xs text-slate-800 tracking-tight">
                    {stage}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400">
                    R$ {columnTotalValue.toFixed(0)}
                  </span>
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {columnLeads.length} {columnLeads.length === 1 ? 'Lead' : 'Leads'}
                  </span>
                </div>
              </div>

              {/* Droppable Card List - Fixed max height with independent vertical scroll */}
              <Droppable droppableId={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-1 flex-1 overflow-y-auto space-y-3.5 transition-colors rounded-2xl scrollbar-thin ${
                      snapshot.isDraggingOver ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {columnLeads.map((lead, index) => (
                      <Draggable key={lead.id} draggableId={lead.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`${snapshot.isDragging ? 'shadow-xl ring-2 ring-ctrl-blue rotate-1 opacity-95' : ''}`}
                          >
                            <LeadCard
                              lead={lead}
                              onOpenInteraction={onOpenInteraction}
                              onOpenCopyTemplate={onOpenCopyTemplate}
                              onEditLead={onEditLead}
                              onDeleteLead={onDeleteLead}
                              onStageChange={onStageChange}
                              onSelectLead={onSelectLead}
                              onQuickWhatsAppAction={onQuickWhatsAppAction}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {columnLeads.length === 0 && (
                      <div className="h-28 border-2 border-dashed border-slate-200/80 bg-white/50 rounded-2xl flex items-center justify-center text-xs text-slate-400 font-medium">
                        Nenhum lead
                      </div>
                    )}
                  </div>
                )}
              </Droppable>

            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
