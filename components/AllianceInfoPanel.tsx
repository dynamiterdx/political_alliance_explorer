import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Alliance, GeopoliticalState } from '../types';
import * as GeminiService from '../services/geminiService';
import { X, Shield, Users, Loader2, Tag, Activity, RefreshCw } from 'lucide-react';

interface AllianceInfoPanelProps {
  alliance: Alliance;
  state: GeopoliticalState;
  onClose: () => void;
  isSidebarOpen: boolean;
}

const AllianceInfoPanel: React.FC<AllianceInfoPanelProps> = ({ alliance, state, onClose, isSidebarOpen }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async (forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) setSummary(null);
    try {
      const text = await GeminiService.generateAllianceSummary(alliance.name, state, forceRefresh);
      setSummary(text);
    } catch (e) {
      setSummary("Intelligence retrieval failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (alliance) {
        fetchSummary(false);
    }
  }, [alliance, state]);

  const handleRefresh = () => {
    fetchSummary(true);
  };

  // Determine status color
  const getStatusColor = (status: string) => {
      const s = status.toLowerCase();
      if (s.includes('active')) return 'bg-green-500/10 border-green-500/50 text-green-400';
      if (s.includes('collapsing') || s.includes('fractured')) return 'bg-red-500/10 border-red-500/50 text-red-400';
      if (s.includes('war')) return 'bg-red-500/20 border-red-500/50 text-red-300';
      if (s.includes('expanding') || s.includes('forming')) return 'bg-blue-500/10 border-blue-500/50 text-blue-400';
      return 'bg-slate-700/50 border-slate-600 text-slate-300';
  };

  return (
    <div 
        className={`absolute top-20 transition-all duration-300 w-96 bg-geo-panel/95 backdrop-blur-md border border-slate-600 rounded-lg shadow-2xl z-20 flex flex-col max-h-[80vh] overflow-hidden ${
            isSidebarOpen ? 'left-[21rem]' : 'left-6'
        }`}
    >
      {/* Color Ribbon Indicator */}
      <div 
        className="w-full h-1.5 shadow-sm z-10" 
        style={{ 
            backgroundColor: alliance.color,
            boxShadow: `0 1px 10px ${alliance.color}60`
        }} 
      />

      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/40">
        <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: alliance.color }} />
            <h2 className="text-xl font-bold text-slate-100">{alliance.name}</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto p-4 space-y-6 custom-scrollbar">
         {/* Detailed Status Grid */}
         <div className="grid grid-cols-2 gap-3">
            <div className={`p-2 rounded border flex flex-col justify-center ${getStatusColor(alliance.status)}`}>
                <div className="text-[10px] uppercase opacity-70 font-bold mb-1 flex items-center gap-1">
                     <Activity className="w-3 h-3" /> Status
                </div>
                <div className="text-sm font-bold">{alliance.status}</div>
            </div>
            
            <div className="p-2 rounded border bg-slate-800/50 border-slate-700 text-slate-300 flex flex-col justify-center">
                <div className="text-[10px] uppercase opacity-70 font-bold mb-1 flex items-center gap-1">
                     <Tag className="w-3 h-3" /> Type
                </div>
                <div className="text-sm font-bold">{alliance.type}</div>
            </div>
         </div>

         {/* Stats */}
         <div className="flex items-center gap-4 bg-slate-800/50 p-3 rounded border border-slate-700">
             <div className="p-2 rounded bg-slate-700">
                <Users className="w-5 h-5 text-slate-300" />
             </div>
             <div>
                 <div className="text-xs text-slate-400 uppercase tracking-wider">Members</div>
                 <div className="text-lg font-bold text-slate-100">{alliance.members.length} Countries</div>
             </div>
         </div>

         {/* Description */}
         <div className="text-sm text-slate-400 italic border-l-2 pl-3" style={{ borderColor: alliance.color }}>
            {alliance.description}
         </div>

        {/* AI Analysis */}
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-geo-accent uppercase tracking-widest">
                    Strategic Assessment ({state.year})
                </h3>
                <button 
                    onClick={handleRefresh}
                    disabled={loading}
                    className="p-1 text-slate-500 hover:text-geo-accent transition-colors disabled:opacity-50"
                    title="Regenerate Analysis"
                >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>
            
            <div className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-md border border-slate-800 min-h-[150px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-500 py-8">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Analyzing power projection...</span>
                    </div>
                ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>
                            {summary || ''}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>

        {/* Members List */}
        <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">
                Membership
            </h3>
            <div className="flex flex-wrap gap-2">
                {alliance.members.map(code => (
                    <span 
                        key={code} 
                        className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300 font-mono"
                    >
                        {code}
                    </span>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AllianceInfoPanel;
