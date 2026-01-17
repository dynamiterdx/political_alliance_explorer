import React from 'react';
import { LayerType } from '../types';
import { Layers, Activity, Calendar, Radio, Star } from 'lucide-react';

interface ControlsProps {
  years: number[]; // highlight years
  minYear: number;
  maxYear: number;
  presentYear: number;
  currentYear: number;
  onYearChange: (year: number) => void;
  activeLayers: LayerType[];
  onToggleLayer: (layer: LayerType) => void;
  onTriggerLiveUpdate: () => void;
  isUpdating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  years, minYear, maxYear, presentYear, currentYear, onYearChange, 
  activeLayers, onToggleLayer, 
  onTriggerLiveUpdate, isUpdating 
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-full max-w-3xl z-20 pointer-events-none">
      
      {/* Time Control */}
      <div className="bg-geo-panel/90 backdrop-blur-md border border-slate-700 rounded-xl px-6 py-4 flex flex-col gap-3 shadow-2xl pointer-events-auto w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Calendar className="w-5 h-5 text-slate-400" />
            <span>Year: {currentYear}</span>
          </div>
        </div>
        <input 
          type="range" 
          min={minYear} 
          max={maxYear} 
          value={currentYear} 
          onChange={(e) => onYearChange(Number(e.target.value))} 
          className="w-full accent-geo-accent"
        />
        <div className="flex flex-wrap gap-2 items-center text-xs text-slate-400">
          <Star className="w-3 h-3 text-geo-accent" />
          <span className="font-semibold text-slate-200">Key years:</span>
          {years.map(year => (
              <button
                  key={year}
                  onClick={() => onYearChange(year)}
                  className={`px-2 py-1 rounded-md border text-[12px] transition-colors ${
                      currentYear === year 
                      ? 'bg-geo-accent/20 border-geo-accent text-geo-accent'
                      : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:border-geo-accent/50'
                  }`}
              >
                  {year}
              </button>
          ))}
        </div>
      </div>

      {/* Layer Toggles */}
      <div className="bg-geo-panel/90 backdrop-blur-md border border-slate-700 rounded-lg px-4 py-2 flex items-center gap-4 shadow-xl pointer-events-auto">
        
        <button 
            onClick={() => onToggleLayer(LayerType.ALLIANCES)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors border ${
                activeLayers.includes(LayerType.ALLIANCES)
                ? 'bg-blue-900/30 border-blue-500/50 text-blue-200'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
            <Layers className="w-4 h-4" />
            Alliances
        </button>

        <button 
            onClick={() => onToggleLayer(LayerType.CONFLICTS)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors border ${
                activeLayers.includes(LayerType.CONFLICTS)
                ? 'bg-red-900/30 border-red-500/50 text-red-200'
                : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
            }`}
        >
            <Activity className="w-4 h-4" />
            Conflicts
        </button>

        <div className="w-px h-6 bg-slate-700 mx-2"></div>

        <button 
             onClick={onTriggerLiveUpdate}
             disabled={isUpdating || currentYear !== presentYear}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors border border-geo-success/30 hover:bg-geo-success/10 ${
                 isUpdating ? 'animate-pulse text-geo-success' : 'text-slate-300'
             } ${currentYear !== presentYear ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
            <Radio className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Scanning...' : 'Refresh Scan'}
        </button>
      </div>
    </div>
  );
};

export default Controls;
