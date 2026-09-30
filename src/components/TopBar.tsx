import React from 'react';
import { Search, Mail, Bell, ChevronDown, Download, Plus } from 'lucide-react';

interface TopBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  onOpenNewLeadModal: () => void;
  onExportCsv: () => void;
  overdueCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  search,
  onSearchChange,
  onOpenNewLeadModal,
  onExportCsv,
  overdueCount
}) => {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
      
      {/* Search Input Box */}
      <div className="relative w-80">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search Anything..."
          className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-ctrl-blue focus:bg-white transition-all placeholder:text-slate-400 font-medium"
        />
      </div>

      {/* Top Right Actions & Profile */}
      <div className="flex items-center gap-5">
        
        {/* Export Button */}
        <button
          onClick={onExportCsv}
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-ctrl-blue hover:bg-ctrl-blue-hover text-white text-xs font-bold rounded-xl shadow-md transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export</span>
        </button>

        {/* Mail Icon */}
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
          <Mail className="w-5 h-5" />
        </button>

        {/* Notification Bell with Badge */}
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors relative">
          <Bell className="w-5 h-5" />
          {overdueCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-pulse" />
          )}
        </button>

        {/* User Profile Info */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center overflow-hidden border border-slate-200">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
              alt="Lucas Vision" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to initials if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span>LV</span>
          </div>
          <span className="text-xs font-bold text-slate-800">Hi, Lucas Vision</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

      </div>

    </header>
  );
};
