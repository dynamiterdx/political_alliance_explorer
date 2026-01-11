import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Conflict, GeopoliticalState } from '../types';
import * as GeminiService from '../services/geminiService';
import { X, Flame, ShieldAlert, Loader2, Swords, RefreshCw } from 'lucide-react';

interface ConflictInfoPanelProps {
  conflict: Conflict;
  state: GeopoliticalState;
  onClose: () => void;
}

const ConflictInfoPanel: React.FC<ConflictInfoPanelProps> = ({ conflict, state, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async (forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) setSummary(null);
    try {
      const text = await GeminiService.generateConflictSummary(conflict.name, state, forceRefresh);
      setSummary(text);
    } catch (e) {
      setSummary("Tactical intelligence assessment unavailable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conflict) {
        fetchSummary(false);
    }
  }, [conflict, state]);

  const handleRefresh = () => {
    fetchSummary(true);
  };

  // Split participants
  const sideA = conflict.participants[0];
  const sideB = conflict.participants.slice(1);

  return (
    <div className="absolute top-6 left-6 w-96 bg-geo-panel/95 backdrop-blur-md border border-red-500/30 rounded-lg shadow-2xl z-30 flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between p-4 border-b border-red-900/30 bg-red-900/10">
        <div className="flex items-center gap-2">
            <Flame className="text-red-500 w-5 h-5 animate-pulse" />
            <h2 className="text-xl font-bold text-slate-100">{conflict.name}</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto p-4 space-y-6 custom-scrollbar">
         {/* Intensity Meter */}
         <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
             <div className="flex justify-between items-center mb-2">
                 <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Swords className="w-3 h-3" /> Conflict Intensity
                 </div>
                 <span className="text-xs font-bold text-red-400">{(conflict.intensity * 100).toFixed(0)}%</span>
             </div>
             <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-gradient-to-r from-orange-500 to-red-600 transition-all duration-1000" 
                    style={{ width: `${conflict.intensity * 100}%` }}
                 ></div>
             </div>
         </div>

         {/* Participants */}
         <div className="grid grid-cols-2 gap-4">
             <div className="bg-slate-800/30 p-2 rounded border border-slate-700/50">
                 <div className="text-[10px] text-slate-500 uppercase mb-1">Side A</div>
                 <div className="font-mono text-amber-400 font-bold text-lg">{sideA}</div>
             </div>
             <div className="bg-slate-800/30 p-2 rounded border border-slate-700/50 text-right">
                 <div className="text-[10px] text-slate-500 uppercase mb-1">Side B</div>
                 <div className="font-mono text-indigo-400 font-bold text-lg">{sideB.join(', ')}</div>
             </div>
         </div>

         {/* Description */}
         <div className="text-sm text-slate-300 italic border-l-2 border-red-500/50 pl-3">
            {conflict.description}
         </div>

        {/* AI Analysis */}
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-geo-accent uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" /> Tactical Analysis ({state.year})
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
                        <span>Assessing battlefield dynamics...</span>
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
      </div>
    </div>
  );
};

export default ConflictInfoPanel;
