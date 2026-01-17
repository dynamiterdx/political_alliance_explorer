import React from 'react';
import { ChevronLeft, ChevronRight, Shield, Coins, Users, Activity, Eye, Layers, Info, Check, Flame, Swords } from 'lucide-react';
import { LayerType, Alliance, GeopoliticalState, Conflict } from '../types';

interface LeftSidebarProps {
  state: GeopoliticalState;
  activeLayers: LayerType[];
  selectedAlliances: Alliance[];
  onAllianceToggle: (alliance: Alliance) => void;
  onAllianceInspect: (alliance: Alliance) => void;
  onConflictSelect: (conflict: Conflict) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const getAllianceTypeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('military') || t.includes('security') || t.includes('defense') || t.includes('war')) 
        return <Shield className="w-3 h-3 text-red-400" />;
    if (t.includes('economic') || t.includes('trade') || t.includes('market')) 
        return <Coins className="w-3 h-3 text-amber-400" />;
    if (t.includes('intelligence')) 
        return <Eye className="w-3 h-3 text-blue-400" />;
    if (t.includes('political')) 
        return <Activity className="w-3 h-3 text-purple-400" />;
    return <Users className="w-3 h-3 text-slate-400" />;
};

const LeftSidebar: React.FC<LeftSidebarProps> = ({
  state,
  activeLayers,
  selectedAlliances,
  onAllianceToggle,
  onAllianceInspect,
  onConflictSelect,
  isOpen,
  onToggle
}) => {
  return (
    <div 
      className={`absolute top-14 left-0 bottom-0 transition-all duration-300 z-30 flex ${isOpen ? 'w-80' : 'w-0'}`}
    >
      <div className={`flex-1 bg-geo-panel/95 backdrop-blur-md border-r border-slate-700 flex flex-col overflow-hidden ${isOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
         
         <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/50">
            <h2 className="font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-geo-accent" />
                Active Layers
            </h2>
         </div>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
            
            {/* Alliances Section */}
            {activeLayers.includes(LayerType.ALLIANCES) && (
                <div>
                    <div className="flex items-center justify-between mb-3 sticky top-0 bg-geo-panel/95 pb-2 z-10 border-b border-slate-700/50">
                         <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alliances ({state.alliances.length})</div>
                         {selectedAlliances.length > 0 && (
                             <button 
                                onClick={() => selectedAlliances.forEach(a => onAllianceToggle(a))}
                                className="text-[10px] text-geo-accent hover:text-white underline"
                             >
                                Clear Selection
                             </button>
                         )}
                    </div>
                    
                    <div className="space-y-2">
                        {state.alliances.map(a => {
                            const isSelected = selectedAlliances.some(sa => sa.id === a.id);
                            return (
                                <div 
                                    key={a.id} 
                                    className={`relative rounded-lg p-3 border transition-all duration-200 group flex items-start justify-between cursor-pointer overflow-hidden ${
                                        isSelected
                                        ? 'bg-slate-700/80 shadow-md' 
                                        : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-700 hover:border-slate-600'
                                    }`}
                                    style={{ borderColor: isSelected ? a.color : '' }}
                                    onClick={() => onAllianceToggle(a)}
                                >
                                    {/* Color Ribbon */}
                                    <div 
                                        className="absolute left-0 top-0 bottom-0 w-1.5"
                                        style={{ backgroundColor: a.color }}
                                    />

                                    <div className="flex flex-col gap-2 flex-1 min-w-0 pr-2 pl-3">
                                        <div className="flex items-center gap-3">
                                            <div 
                                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'border-transparent text-slate-900' : 'border-slate-500'}`}
                                                style={{ backgroundColor: isSelected ? a.color : 'transparent' }}
                                            >
                                                {isSelected && <Check className="w-3 h-3" />}
                                            </div>
                                            <span className={`text-sm font-semibold truncate ${isSelected ? 'text-white' : 'text-slate-200'} ${a.status.includes('Collapsing') ? 'line-through decoration-slate-500 text-slate-500' : ''}`}>
                                                {a.name}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-2 pl-7 flex-wrap">
                                            <div className={`px-1.5 py-0.5 rounded text-[10px] border flex items-center gap-1 ${
                                                a.status.toLowerCase().includes('active') ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                                                a.status.toLowerCase().includes('collapsing') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                                                'bg-slate-700 border-slate-600 text-slate-400'
                                            }`}>
                                                <div className={`w-1 h-1 rounded-full ${a.status.toLowerCase().includes('active') ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                                {a.status}
                                            </div>
                                            <div className="px-1.5 py-0.5 rounded text-[10px] border bg-slate-700/50 border-slate-600 text-slate-300 flex items-center gap-1" title={a.type}>
                                                {getAllianceTypeIcon(a.type)}
                                                <span className="truncate max-w-[80px]">{a.type.split(' ')[0]}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-600 rounded transition-colors z-10"
                                        title="View Details"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onAllianceInspect(a);
                                        }}
                                    >
                                        <Info className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Conflicts Legend */}
            {activeLayers.includes(LayerType.CONFLICTS) && (
                 <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-700/50 pb-2 flex items-center justify-between">
                      <span>Conflicts ({state.conflicts.length})</span>
                      {state.conflicts.length > 0 && (
                        <span className="text-[10px] text-slate-500">Click to focus</span>
                      )}
                    </div>

                    {state.conflicts.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {state.conflicts.map(conflict => (
                          <button
                            key={conflict.id}
                            onClick={() => onConflictSelect(conflict)}
                            className="w-full text-left bg-slate-800/40 rounded-lg p-3 border border-slate-700/50 hover:border-slate-500 hover:bg-slate-700/40 transition-colors flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Flame className="w-4 h-4 text-amber-400" />
                                <span className="text-sm font-semibold text-slate-200 truncate">{conflict.name}</span>
                              </div>
                              <div className="flex items-center gap-1 text-[11px] text-amber-300 bg-amber-900/30 border border-amber-700/50 px-2 py-0.5 rounded-full">
                                <Swords className="w-3 h-3" />
                                {Math.round(conflict.intensity * 100)}%
                              </div>
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-2">{conflict.description}</div>
                            <div className="flex flex-wrap gap-1">
                              {conflict.participants.slice(0,6).map(code => (
                                <span key={code} className="px-1.5 py-0.5 bg-slate-900/60 border border-slate-700 rounded text-[10px] text-slate-300 font-mono">{code}</span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-500 mb-4">No live conflicts available.</div>
                    )}

                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-700/50 pb-2">Legend</div>
                    <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50 space-y-3">
                         <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded bg-[#fbbf24] border border-yellow-600/50 shadow-sm"></span>
                            <div>
                                <div className="text-xs text-slate-200 font-medium">Aggressor / Side A</div>
                                <div className="text-[10px] text-slate-500">Origin of pressure vector</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <span className="w-4 h-4 rounded bg-[#818cf8] border border-indigo-600/50 shadow-sm"></span>
                             <div>
                                <div className="text-xs text-slate-200 font-medium">Defender / Side B</div>
                                <div className="text-[10px] text-slate-500">Target of pressure</div>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                             <div className="w-8 h-[2px] bg-[#fbbf24] relative flex-shrink-0">
                                 <div className="absolute right-0 -top-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-[#fbbf24]"></div>
                             </div>
                             <div className="text-xs text-slate-400">Directional Influence Flow</div>
                         </div>
                    </div>
                 </div>
            )}

            {!activeLayers.includes(LayerType.ALLIANCES) && !activeLayers.includes(LayerType.CONFLICTS) && (
                <div className="text-center text-slate-500 py-10 text-sm">
                    No layers active. Use the bottom controls to enable data layers.
                </div>
            )}

         </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute top-4 left-full ml-2 bg-geo-panel/90 text-slate-300 p-1.5 rounded-md border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors shadow-lg z-40 pointer-events-auto"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default LeftSidebar;
