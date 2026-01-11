import React from 'react';
import { LayerType, GeopoliticalState } from '../types';
import { Layers, Activity, Calendar, Radio } from 'lucide-react';

interface ControlsProps {
  years: number[];
  currentYear: number;
  onYearChange: (year: number) => void;
  activeLayers: LayerType[];
  onToggleLayer: (layer: LayerType) => void;
  onTriggerLiveUpdate: () => void;
  isUpdating: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  years, currentYear, onYearChange, 
  activeLayers, onToggleLayer, 
  onTriggerLiveUpdate, isUpdating 
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 w-full max-w-3xl z-20 pointer-events-none">
      
      {/* Time Control Slider */}
      <div className="bg-geo-panel/90 backdrop-blur-md border border-slate-700 rounded-full px-6 py-3 flex items-center gap-6 shadow-2xl pointer-events-auto">
        <Calendar className="w-5 h-5 text-slate-400" />
        <div className="flex items-center gap-4">
            {years.map(year => (
                <button
                    key={year}
                    onClick={() => onYearChange(year)}
                    className={`text-sm font-mono font-bold transition-all duration-300 ${
                        currentYear === year 
                        ? 'text-geo-accent scale-125' 
                        : 'text-slate-500 hover:text-slate-300'
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
             disabled={isUpdating || currentYear !== 2024}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors border border-geo-success/30 hover:bg-geo-success/10 ${
                 isUpdating ? 'animate-pulse text-geo-success' : 'text-slate-300'
             } ${currentYear !== 2024 ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
            <Radio className={`w-4 h-4 ${isUpdating ? 'animate-spin' : ''}`} />
            {isUpdating ? 'Scanning...' : 'Live Scan'}
        </button>
      </div>
    </div>
  );
};

export default Controls;
