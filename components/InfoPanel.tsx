import React, { useEffect, useState } from 'react';
import { GeoJSONFeature, GeopoliticalState } from '../types';
import * as GeminiService from '../services/geminiService';
import { X, Globe, Shield, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';

interface InfoPanelProps {
  country: GeoJSONFeature;
  state: GeopoliticalState;
  onClose: () => void;
}

const getIso = (feature: GeoJSONFeature): string => {
  return feature.id || feature.properties.iso_a3 || feature.properties.ISO_A3 || '';
};

const InfoPanel: React.FC<InfoPanelProps> = ({ country, state, onClose }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSummary = async (forceRefresh = false) => {
    setLoading(true);
    if (forceRefresh) setSummary(null);
    
    try {
      const text = await GeminiService.generateSummary(country.properties.name, state, forceRefresh);
      setSummary(text);
    } catch (e) {
      setSummary("Intelligence retrieval failed due to network disruption.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (country) {
        fetchSummary(false);
    }
  }, [country, state]);

  const handleRefresh = () => {
      fetchSummary(true);
  };

  const iso = getIso(country);
  // Find country participation in alliances/conflicts
  const alliances = state.alliances.filter(a => a.members.includes(iso));
  const conflicts = state.conflicts.filter(c => c.participants.includes(iso));

  return (
    <div className="absolute top-6 left-6 w-96 bg-geo-panel/95 backdrop-blur-md border border-slate-600 rounded-lg shadow-2xl z-30 flex flex-col max-h-[80vh]">
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center gap-2">
            <Globe className="text-geo-accent w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-100">{country.properties.name}</h2>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                 <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Alliances
                 </div>
                 <div className="text-sm font-semibold text-slate-200">
                    {alliances.length > 0 ? alliances.map(a => a.name).join(', ') : 'Non-aligned / Neutral'}
                 </div>
             </div>
             <div className="bg-slate-800/50 p-3 rounded border border-slate-700">
                 <div className="text-xs text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-red-400" /> Active Conflicts
                 </div>
                 <div className="text-sm font-semibold text-slate-200">
                    {conflicts.length > 0 ? conflicts.map(c => c.name).join(', ') : 'Stable'}
                 </div>
             </div>
        </div>

        {/* AI Analysis */}
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-geo-accent uppercase tracking-widest">
                    Geopolitical Briefing ({state.year})
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
                        <span>Decrypting regional status...</span>
                    </div>
                ) : (
                    <div className="prose prose-invert prose-sm">
                       {/* Simple markdown parser/renderer for the summary */}
                       {summary?.split('\n').map((line, i) => {
                           if (line.startsWith('**') || line.includes('**')) {
                               // Very basic formatting for bold text
                               const parts = line.split('**');
                               return <p key={i} className="mb-2">
                                   {parts.map((part, idx) => idx % 2 === 1 ? <strong key={idx} className="text-white">{part}</strong> : part)}
                               </p>
                           }
                           return <p key={i} className="mb-2">{line}</p>
                       })}
                    </div>
                )}
            </div>
        </div>

        {/* Historical Context (if conflicts exist) */}
        {conflicts.length > 0 && (
            <div>
                <h3 className="text-xs font-bold text-red-400 uppercase mb-2 tracking-widest">
                    Conflict Detail
                </h3>
                {conflicts.map(c => (
                    <div key={c.id} className="bg-red-900/10 border border-red-900/30 p-3 rounded mb-2">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-red-200">{c.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-900/50 text-red-300 border border-red-700">
                                Intensity: {(c.intensity * 100).toFixed(0)}%
                            </span>
                        </div>
                        <p className="text-xs text-slate-400">{c.description}</p>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;