
import React, { useEffect, useState } from 'react';
import { Alliance, GeopoliticalInsight } from '../types';
import { ALLIANCES } from '../constants';
import { getGeopoliticalInsight } from '../services/geminiService';
import { Loader2, Globe, Shield, Coins, Users, Calendar, ArrowRight, GitCompare, UserCheck } from 'lucide-react';

interface AlliancePanelProps {
  selectedIds: string[];
}

const AlliancePanel: React.FC<AlliancePanelProps> = ({ selectedIds }) => {
  const [insight, setInsight] = useState<GeopoliticalInsight | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedAlliances = ALLIANCES.filter(a => selectedIds.includes(a.id));
  const activeAlliance = selectedIds.length === 1 ? selectedAlliances[0] : null;

  useEffect(() => {
    if (activeAlliance) {
      setLoading(true);
      getGeopoliticalInsight(activeAlliance.fullName).then(res => {
        setInsight(res);
        setLoading(false);
      });
    } else {
      setInsight(null);
    }
  }, [activeAlliance]);

  if (selectedIds.length === 0) {
    return (
      <div className="p-8 text-slate-400 text-center h-full flex flex-col justify-center items-center">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 border border-slate-700">
          <Globe size={40} className="opacity-20 animate-pulse" />
        </div>
        <p className="text-lg font-medium text-slate-300">Global Overview</p>
        <p className="text-sm opacity-60 mt-2 max-w-[200px]">Select one or more alliances to explore and compare dynamics.</p>
      </div>
    );
  }

  // Comparison View
  if (selectedIds.length > 1) {
    const allMembers = selectedAlliances.flatMap(a => a.members);
    const uniqueMembers = Array.from(new Set(allMembers));
    const commonMembers = uniqueMembers.filter(m => 
      selectedAlliances.every(a => a.members.includes(m))
    );

    return (
      <div className="p-6 overflow-y-auto h-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 bg-slate-900/20">
        <header>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-widest flex items-center">
              <GitCompare size={14} className="mr-2" /> Comparison Mode
            </span>
          </div>
          <h2 className="text-2xl font-black text-white leading-tight">Alliance Comparison</h2>
          <p className="text-slate-400 text-sm mt-2">Analyzing {selectedAlliances.length} organizations</p>
        </header>

        <div className="grid grid-cols-1 gap-3">
          {selectedAlliances.map(a => (
            <div key={a.id} className="flex items-center gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: a.color }}></div>
              <div>
                <div className="text-sm font-bold text-white">{a.name}</div>
                <div className="text-[10px] text-slate-500 uppercase">{a.type} • {a.members.length} members</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Unique Coverage</div>
            <div className="text-3xl font-black text-white">{uniqueMembers.length}</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase">Total Nations</div>
          </div>
          <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/20">
            <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Common Members</div>
            <div className="text-3xl font-black text-white">{commonMembers.length}</div>
            <div className="text-[10px] text-slate-500 mt-1 uppercase">Full Overlap</div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <UserCheck size={14} /> Shared Member States
          </h3>
          <div className="flex flex-wrap gap-2">
            {commonMembers.length > 0 ? (
              commonMembers.map(m => (
                <span key={m} className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] font-medium rounded-md border border-slate-700">
                  {m}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No countries belong to all selected alliances.</p>
            )}
          </div>
        </div>

        <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
          <p className="text-xs text-blue-300 leading-relaxed">
            <strong>Insight:</strong> {commonMembers.length > 0 
              ? `These ${commonMembers.length} nations act as key bridge-points between ${selectedAlliances.map(a => a.name).join(' and ')}.`
              : `The selected alliances represent distinct geopolitical spheres with no overlapping membership.`}
          </p>
        </div>
      </div>
    );
  }

  // Single Selection View
  const TypeIcon = () => {
    switch (activeAlliance?.type) {
      case 'Military': return <Shield className="mr-2 text-blue-400" size={18} />;
      case 'Economic': return <Coins className="mr-2 text-amber-400" size={18} />;
      case 'Mixed': return <Users className="mr-2 text-purple-400" size={18} />;
      default: return <Globe className="mr-2 text-slate-400" size={18} />;
    }
  };

  return (
    <div className="p-6 overflow-y-auto h-full space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 bg-slate-900/20">
      <header>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 uppercase tracking-widest flex items-center">
            <TypeIcon /> {activeAlliance?.type}
          </span>
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-800 border border-slate-700 flex items-center">
            <Calendar className="mr-2 text-slate-500" size={14} /> EST. {activeAlliance?.yearFounded}
          </span>
        </div>
        <h2 className="text-3xl font-black text-white leading-tight">{activeAlliance?.name}</h2>
        <p className="text-slate-400 text-sm mt-2">{activeAlliance?.fullName}</p>
      </header>

      <div className="space-y-4">
        <p className="text-slate-300 leading-relaxed text-sm">
          {activeAlliance?.description}
        </p>
        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Members</div>
          <div className="text-2xl font-black text-white">{activeAlliance?.members.length} <span className="text-xs text-slate-500 font-normal uppercase">Sovereign Nations</span></div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-8">
        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          Geopolitical Analysis
          {loading && <Loader2 className="animate-spin" size={12} />}
        </h3>

        {loading ? (
          <div className="space-y-4 opacity-50">
            <div className="h-4 bg-slate-800 rounded w-full animate-pulse"></div>
            <div className="h-4 bg-slate-800 rounded w-3/4 animate-pulse"></div>
            <div className="h-32 bg-slate-800 rounded w-full animate-pulse"></div>
          </div>
        ) : insight ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-blue-500 pl-4 bg-blue-500/5 py-2">
                "{insight.summary}"
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Key Objectives</h4>
              <ul className="space-y-2">
                {insight.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-400">
                    <ArrowRight size={14} className="mt-1 text-blue-500 flex-shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
              <h4 className="text-xs font-bold text-amber-500 uppercase mb-2">Current Challenges</h4>
              <p className="text-sm text-slate-400 leading-relaxed">{insight.challenges}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-800 border-dashed">
            <p className="text-xs text-slate-600">Click an alliance to fetch AI insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlliancePanel;
