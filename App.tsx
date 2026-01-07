
import React, { useState, useMemo, useTransition, Suspense } from 'react';
import { ALLIANCES } from './constants';
import WorldMap from './components/WorldMap';
import AlliancePanel from './components/AlliancePanel';
import CountryDetailModal from './components/CountryDetailModal';
import { Menu, ChevronRight, Globe, Layers, Trash2, GitCompare, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [selectedAllianceIds, setSelectedAllianceIds] = useState<string[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<{ iso: string; name: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggleAlliance = (id: string) => {
    startTransition(() => {
      setSelectedAllianceIds(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id) 
          : [...prev, id]
      );
    });
  };

  const handleClearAll = () => {
    startTransition(() => {
      setSelectedAllianceIds([]);
    });
  };

  const handleCountryClick = (iso: string, name: string) => {
    startTransition(() => {
      setSelectedCountry({ iso, name });
    });
  };

  const getCountryMemberships = (iso: string) => {
    return ALLIANCES
      .filter(alliance => alliance.members.includes(iso))
      .map(alliance => alliance.name);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      {/* Sidebar: Alliance Selection */}
      <aside className="w-80 border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-xl z-20">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2 text-white">
              <Globe className="text-blue-500" />
              Global Alliance
            </h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">Geopolitical Explorer</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="px-2 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Layers size={12} /> Select Alliances
            </span>
            {selectedAllianceIds.length > 0 && (
              <button 
                onClick={handleClearAll}
                className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                <Trash2 size={12} /> Clear
              </button>
            )}
          </div>
          {ALLIANCES.map((alliance) => {
            const isSelected = selectedAllianceIds.includes(alliance.id);
            return (
              <button
                key={alliance.id}
                onClick={() => toggleAlliance(alliance.id)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group border ${
                  isSelected 
                    ? 'bg-blue-600/10 border-blue-500/50 text-white shadow-lg shadow-blue-900/20' 
                    : 'hover:bg-slate-800 border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`font-semibold text-sm ${isSelected ? 'text-blue-400' : ''}`}>{alliance.name}</span>
                  <span className="text-[10px] opacity-70">{alliance.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: alliance.color }}></div>
                  <ChevronRight size={14} className={`transition-transform ${isSelected ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="p-4 border-t border-slate-800 bg-slate-900/80">
          <div className="text-[10px] text-slate-600 mb-2 font-bold uppercase tracking-widest">Guide</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              Common Membership
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              Partial Membership
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex">
        {/* Map Section */}
        <div className="flex-1 relative">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">
              <Loader2 className="animate-spin mr-2" /> Loading Global Topology...
            </div>
          }>
            <WorldMap 
              selectedAllianceIds={selectedAllianceIds} 
              onCountryHover={setHoveredCountry} 
              onCountryClick={handleCountryClick}
            />
          </Suspense>
          
          {/* Tooltip for hovering */}
          {hoveredCountry && (
            <div className="absolute bottom-10 left-10 p-3 bg-slate-900/90 border border-slate-700 backdrop-blur-md rounded-lg shadow-xl z-30 pointer-events-none animate-in fade-in slide-in-from-bottom-2">
              <div className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Current Target</div>
              <div className="text-lg font-bold text-white">{hoveredCountry}</div>
            </div>
          )}

          {selectedAllianceIds.length > 1 && (
            <div className="absolute top-10 left-10 p-3 bg-amber-500 text-slate-950 rounded-full shadow-2xl z-30 animate-bounce flex items-center gap-2 font-bold text-xs uppercase tracking-tighter">
              <GitCompare size={14} /> Comparing {selectedAllianceIds.length} Alliances
            </div>
          )}

          {isPending && (
            <div className="absolute top-4 right-4 p-2 bg-blue-500/20 text-blue-400 rounded-md flex items-center gap-2 text-xs font-medium border border-blue-500/30 backdrop-blur-md">
              <Loader2 size={12} className="animate-spin" /> Updating Map...
            </div>
          )}
        </div>

        {/* Info Panel Section */}
        <div className="w-96 border-l border-slate-800 bg-slate-900/40 backdrop-blur-md z-10 overflow-hidden shadow-2xl">
          <AlliancePanel selectedIds={selectedAllianceIds} />
        </div>
      </main>

      {/* Country Detail Modal */}
      {selectedCountry && (
        <CountryDetailModal 
          countryName={selectedCountry.name}
          iso={selectedCountry.iso}
          memberships={getCountryMemberships(selectedCountry.iso)}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
};

export default App;
