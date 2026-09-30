import React from 'react';
import { FilterOptions, CIDADES, ESPECIALIDADES, POTENCIAIS, FONTES, ESTAGIOS } from '../types/crm';
import { SlidersHorizontal, X, Plus } from 'lucide-react';

interface TopFiltersProps {
  filters: FilterOptions;
  onFilterChange: (key: keyof FilterOptions, value: string) => void;
  onResetFilters: () => void;
  totalFiltered: number;
  onOpenNewLeadModal: () => void;
}

export const TopFilters: React.FC<TopFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalFiltered,
  onOpenNewLeadModal
}) => {
  const isFiltered = 
    filters.cidade !== 'todas' ||
    filters.especialidade !== 'Optometria' ||
    filters.potencial !== 'todos' ||
    filters.estagio !== 'todos' ||
    filters.fonte !== 'todas' ||
    filters.search !== '';

  return (
    <div className="px-8 pt-6 pb-4 flex flex-col gap-4">
      
      {/* Top Title & Primary Action Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
            Leads
          </h2>
        </div>

        <button
          onClick={onOpenNewLeadModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-ctrl-blue hover:bg-ctrl-blue-hover text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lead</span>
        </button>
      </div>

      {/* Filter Dropdowns Bar matching exact screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Estágio Dropdown (All Status) */}
          <select
            value={filters.estagio}
            onChange={(e) => onFilterChange('estagio', e.target.value)}
            className="py-2 px-3 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:outline-none shadow-2xs"
          >
            <option value="todos">All Status ∨</option>
            {ESTAGIOS.map(e => (
              <option key={e} value={e}>Status: {e}</option>
            ))}
          </select>

          {/* Fonte Dropdown (All Sources) */}
          <select
            value={filters.fonte}
            onChange={(e) => onFilterChange('fonte', e.target.value)}
            className="py-2 px-3 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:outline-none shadow-2xs"
          >
            <option value="todas">All Sources ∨</option>
            {FONTES.map(f => (
              <option key={f} value={f}>Fonte: {f}</option>
            ))}
          </select>

          {/* Cidade Dropdown */}
          <select
            value={filters.cidade}
            onChange={(e) => onFilterChange('cidade', e.target.value)}
            className="py-2 px-3 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:outline-none shadow-2xs"
          >
            <option value="todas">Cidade: Todas</option>
            {CIDADES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Especialidade Dropdown */}
          <select
            value={filters.especialidade}
            onChange={(e) => onFilterChange('especialidade', e.target.value)}
            className="py-2 px-3 text-xs font-bold bg-blue-50 border border-blue-200 text-ctrl-blue rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:outline-none shadow-2xs"
          >
            <option value="Optometria">Especialidade: Optometria (Padrão)</option>
            {ESPECIALIDADES.map(es => (
              <option key={es} value={es}>{es}</option>
            ))}
            <option value="todas">Especialidade: Todas</option>
          </select>

          {/* Potencial Dropdown */}
          <select
            value={filters.potencial}
            onChange={(e) => onFilterChange('potencial', e.target.value)}
            className="py-2 px-3 text-xs font-bold bg-white border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-ctrl-blue focus:outline-none shadow-2xs"
          >
            <option value="todos">Potencial: Todos</option>
            {POTENCIAIS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          {/* Clear Filters Button */}
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1 py-2 px-3 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Limpar</span>
            </button>
          )}

        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-bold ml-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Filter ({totalFiltered})</span>
        </div>
      </div>

    </div>
  );
};
