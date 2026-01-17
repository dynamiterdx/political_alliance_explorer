import React, { useState, useEffect } from 'react';
import WorldMap from './components/WorldMap';
import ChatAnalyst from './components/ChatAnalyst';
import Controls from './components/Controls';
import InfoPanel from './components/InfoPanel';
import AllianceInfoPanel from './components/AllianceInfoPanel';
import ConflictInfoPanel from './components/ConflictInfoPanel';
import LeftSidebar from './components/LeftSidebar';
import { GeoJSONData, GeoJSONFeature, GeopoliticalState, LayerType, Alliance, Conflict } from './types';
import { getGeopoliticalState, HISTORICAL_DATA, KEY_YEARS } from './services/dataService';
import * as GeminiService from './services/geminiService';
import * as CacheService from './services/cacheService';
import * as WorldScanService from './services/worldScanService';
import { Globe, Server, WifiOff, ChevronLeft, ChevronRight, Bot } from 'lucide-react';

const App: React.FC = () => {
  const [geoData, setGeoData] = useState<GeoJSONData | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(WorldScanService.PRESENT_DYNAMIC_YEAR); // Default to present/dynamic
  const [currentState, setCurrentState] = useState<GeopoliticalState>(getGeopoliticalState(WorldScanService.PRESENT_DYNAMIC_YEAR));
  const [activeLayers, setActiveLayers] = useState<LayerType[]>([LayerType.ALLIANCES, LayerType.CONFLICTS]);
  
  const [selectedCountry, setSelectedCountry] = useState<GeoJSONFeature | null>(null);
  
  // Multi-selection for map comparison
  const [selectedAlliances, setSelectedAlliances] = useState<Alliance[]>([]);
  // Single selection for detailed inspection panel
  const [inspectedAlliance, setInspectedAlliance] = useState<Alliance | null>(null);
  
  const [selectedConflict, setSelectedConflict] = useState<Conflict | null>(null);

  // Separate states for Left (Map/Layers) and Right (Chat) sidebars
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const [isUpdatingLive, setIsUpdatingLive] = useState(false);
  const [ticker, setTicker] = useState<string>("System Initialized. Awaiting world scan...");
  const [liveConflicts, setLiveConflicts] = useState<Conflict[]>([]);
  const [lastScannedAt, setLastScannedAt] = useState<string | null>(null);
  
  // Cache Status State
  const [cacheStatus, setCacheStatus] = useState<'checking' | 'active' | 'offline'>('checking');

  // 1. Load Map Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [worldRes, indiaRes] = await Promise.all([
          fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
          fetch('https://raw.githubusercontent.com/datameet/maps/master/Country/india-composite.geojson')
        ]);

        const worldData = await worldRes.json() as GeoJSONData;
        const cleanWorldFeatures = worldData.features.filter((f: any) => 
            f.id !== 'IND' && 
            f.properties?.iso_a3 !== 'IND' && 
            f.properties?.ISO_A3 !== 'IND'
        );

        let indiaFeatures: GeoJSONFeature[] = [];
        if (indiaRes.ok) {
           const indiaData = await indiaRes.json() as GeoJSONData;
           indiaFeatures = indiaData.features.map(f => ({
             ...f,
             id: 'IND',
             properties: {
               ...f.properties,
               name: 'India',
               iso_a3: 'IND',
               ISO_A3: 'IND'
             }
           }));
        } else {
           const fallbackIndia = worldData.features.filter((f: any) => f.id === 'IND');
           indiaFeatures = fallbackIndia;
        }

        const mergedFeatures = [...cleanWorldFeatures, ...indiaFeatures];
        setGeoData({ type: 'FeatureCollection', features: mergedFeatures });
      } catch (err) {
        console.error("Failed to load map data", err);
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
          .then(res => res.json())
          .then(data => setGeoData(data as GeoJSONData))
          .catch(e => console.error("Critical map failure", e));
      }
    };
    loadData();
  }, []);

  // 2. Update State when year changes
  useEffect(() => {
    const base = getGeopoliticalState(currentYear);
    setCurrentState(currentYear === WorldScanService.PRESENT_DYNAMIC_YEAR ? { ...base, conflicts: liveConflicts } : base);
    setSelectedCountry(null); 
    setSelectedAlliances([]);
    setInspectedAlliance(null);
    setSelectedConflict(null);
  }, [currentYear, liveConflicts]);

  // 3. Initial Live Scan & Cache Health Check
  useEffect(() => {
      // Trigger scan immediately on load
      handleLiveUpdate();
      
      const checkHealth = async () => {
          const isHealthy = await CacheService.checkCacheHealth();
          setCacheStatus(isHealthy ? 'active' : 'offline');
      };
      checkHealth();
      const interval = setInterval(checkHealth, 30000);
      return () => clearInterval(interval);
  }, []);

  const handleCountryClick = (feature: GeoJSONFeature) => {
    setSelectedCountry(feature);
    setSelectedConflict(null);
  };

  const handleAllianceToggle = (alliance: Alliance) => {
      setSelectedCountry(null); 
      setSelectedConflict(null);
      
      setSelectedAlliances(prev => {
          const exists = prev.find(a => a.id === alliance.id);
          if (exists) {
              return prev.filter(a => a.id !== alliance.id);
          } else {
              return [...prev, alliance];
          }
      });
  };

  const handleAllianceInspect = (alliance: Alliance) => {
      setInspectedAlliance(alliance);
      setSelectedAlliances(prev => {
          const exists = prev.find(a => a.id === alliance.id);
          return exists ? prev : [...prev, alliance];
      });
  };

  const handleConflictClick = (conflict: Conflict) => {
      setSelectedConflict(conflict);
      setSelectedCountry(null);
  };

  const handleToggleLayer = (layer: LayerType) => {
    setActiveLayers(prev => 
      prev.includes(layer) ? prev.filter(l => l !== layer) : [...prev, layer]
    );
  };

  const handleLiveUpdate = async () => {
    if (currentYear !== WorldScanService.PRESENT_DYNAMIC_YEAR) return;
    setIsUpdatingLive(true);
    setTicker("Running world scan via Gemini...");
    try {
        const scan = await WorldScanService.refreshWorldScan();
        setLiveConflicts(WorldScanService.mapSituationsToConflicts(scan.situations));
        setTicker(scan.ticker);
        setLastScannedAt(scan.lastScannedAt);
    } catch (e) {
        console.error('Live update failed', e);
        setTicker("Live scan failed. Using last known signals.");
    } finally {
        setIsUpdatingLive(false);
    }
  };

  // Auto-refresh live signals when viewing the present
  useEffect(() => {
    if (currentYear !== WorldScanService.PRESENT_DYNAMIC_YEAR) return;
    const load = async () => {
      try {
        const scan = await WorldScanService.fetchWorldScan();
        setLiveConflicts(WorldScanService.mapSituationsToConflicts(scan.situations));
        setTicker(scan.ticker);
        setLastScannedAt(scan.lastScannedAt);
      } catch (e) {
        console.error('Initial world scan load failed', e);
        setTicker("World scan unavailable. Try manual refresh.");
      }
    };
    load();
    const interval = setInterval(handleLiveUpdate, 6 * 60 * 60 * 1000); // every 6 hours
    return () => clearInterval(interval);
  }, [currentYear]);

  const TIMELINE_YEARS = KEY_YEARS;
  const MIN_YEAR = Math.min(...Object.keys(HISTORICAL_DATA).map(Number));
  const MAX_YEAR = Math.max(...Object.keys(HISTORICAL_DATA).map(Number));

  // --- RENDER: Main App ---
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-geo-dark text-slate-200 font-sans selection:bg-geo-accent selection:text-white">
      
      {/* Top Bar (Sticky) */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-geo-panel/80 backdrop-blur-md border-b border-slate-700 flex items-center px-6 justify-between z-20">
        <div className="flex items-center gap-3">
             <div className="bg-geo-accent/20 p-1.5 rounded-lg border border-geo-accent/50">
                <Globe className="text-geo-accent w-5 h-5" />
             </div>
             <div>
                <h1 className="font-bold text-lg tracking-tight">GeoSight</h1>
                <p className="text-[10px] text-slate-400 -mt-1 font-mono uppercase tracking-widest">Global Sensemaking Engine</p>
             </div>
        </div>
        
        {/* News Ticker */}
        <div className="flex-1 mx-12 overflow-hidden relative h-10 flex items-center bg-slate-900/50 rounded border border-slate-800 px-4">
             <div className="text-xs font-mono text-geo-success whitespace-nowrap animate-marquee">
                 <span className="font-bold mr-2">:: LIVE INTEL ::</span> 
                 {ticker}
             </div>
             {lastScannedAt && (
                <div className="absolute right-4 text-[10px] text-slate-400 font-mono">
                  Last scan: {new Date(lastScannedAt).toLocaleString()}
                </div>
             )}
        </div>

        {/* Cache Status Indicator */}
        <div className="flex items-center gap-4 mr-4 border-r border-slate-700 pr-4">
            <div 
                className={`flex items-center gap-2 text-xs font-mono px-2 py-1 rounded border transition-colors ${
                    cacheStatus === 'active' 
                    ? 'bg-emerald-900/30 border-emerald-700 text-emerald-400' 
                    : 'bg-red-900/30 border-red-700 text-red-400'
                }`}
                title={cacheStatus === 'active' ? "Connected to Managed Redis" : "Using Local Storage Fallback"}
            >
                {cacheStatus === 'active' ? <Server className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {cacheStatus === 'active' ? "SECURE CACHE" : "LOCAL CACHE"}
                <span className={`w-2 h-2 rounded-full ${cacheStatus === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
            </div>

            {/* Author credit - subtle pill */}
            <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/60 border border-slate-700 rounded-full px-3 py-1 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-geo-accent/15 border border-geo-accent/40 flex items-center justify-center text-geo-accent font-semibold text-xs">
                    AM
                </div>
                <div className="flex flex-col leading-tight">
                    <span className="text-slate-200 font-semibold">Archit Mishra</span>
                    <div className="flex items-center gap-2">
                        <span>Bengaluru, India</span>
                        <a 
                            href="mailto:architmishrapro@gmail.com" 
                            className="text-geo-accent hover:text-white transition-colors"
                        >
                            architmishrapro@gmail.com
                        </a>
                    </div>
                </div>
            </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="relative flex-1 h-full pt-14">
        
        {/* Left Sidebar */}
        <LeftSidebar 
            state={currentState}
            activeLayers={activeLayers}
            selectedAlliances={selectedAlliances}
            onAllianceToggle={handleAllianceToggle}
            onAllianceInspect={handleAllianceInspect}
            isOpen={isLeftSidebarOpen}
            onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        />

        <WorldMap 
            geoData={geoData} 
            state={currentState}
            activeLayers={activeLayers}
            onCountryClick={handleCountryClick}
            selectedCountry={selectedCountry}
            selectedAlliances={selectedAlliances}
            onConflictClick={handleConflictClick}
        />
        
        <Controls 
            years={TIMELINE_YEARS} 
            minYear={MIN_YEAR}
            maxYear={MAX_YEAR}
            presentYear={WorldScanService.PRESENT_DYNAMIC_YEAR}
            currentYear={currentYear}
            onYearChange={setCurrentYear}
            activeLayers={activeLayers}
            onToggleLayer={handleToggleLayer}
            onTriggerLiveUpdate={handleLiveUpdate}
            isUpdating={isUpdatingLive}
        />

        {selectedCountry && (
            <InfoPanel 
                country={selectedCountry} 
                state={currentState} 
                onClose={() => setSelectedCountry(null)} 
            />
        )}

        {inspectedAlliance && (
            <AllianceInfoPanel 
                alliance={inspectedAlliance}
                state={currentState}
                onClose={() => setInspectedAlliance(null)}
                isSidebarOpen={isLeftSidebarOpen} 
            />
        )}

        {selectedConflict && (
            <ConflictInfoPanel 
                conflict={selectedConflict}
                state={currentState}
                onClose={() => setSelectedConflict(null)}
            />
        )}
      </div>

      {/* Right Sidebar: Chat Analyst with collapsible animation */}
      <div 
        className={`absolute top-14 right-0 bottom-0 transition-all duration-300 z-30 flex ${
          isChatOpen ? 'w-96' : 'w-10'
        }`}
      >
        <div className={`flex-1 bg-geo-panel/95 backdrop-blur-md border-l border-slate-700 shadow-2xl overflow-hidden ${isChatOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
          {isChatOpen && (
            <ChatAnalyst 
              currentState={currentState} 
              onCollapse={() => setIsChatOpen(false)} 
            />
          )}
        </div>

        {/* Toggle handle with label/icon when collapsed */}
        {!isChatOpen && (
          <button
            onClick={() => setIsChatOpen(true)}
            className="absolute top-4 right-full mr-2 bg-geo-panel/90 text-slate-300 px-2 py-1.5 rounded-md border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors shadow-lg z-40 pointer-events-auto flex items-center gap-2"
          >
            <div className="flex items-center gap-1">
              <Bot className="w-4 h-4 text-geo-accent" />
              <span className="text-xs font-semibold hidden sm:inline">Analyst</span>
            </div>
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default App;
