import React, { useEffect, useState, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { GeoJSONData, GeoJSONFeature, GeopoliticalState, LayerType, Alliance, Conflict } from '../types';
import { ZoomIn, ZoomOut, Loader2, Crosshair } from 'lucide-react';

interface WorldMapProps {
  geoData: GeoJSONData | null;
  state: GeopoliticalState;
  activeLayers: LayerType[];
  onCountryClick: (feature: GeoJSONFeature) => void;
  selectedCountry: GeoJSONFeature | null;
  selectedAlliances: Alliance[];
  onConflictClick: (conflict: Conflict) => void;
}

const getIso = (feature: GeoJSONFeature): string => {
  return feature.id || feature.properties.iso_a3 || feature.properties.ISO_A3 || '';
};

const WorldMap: React.FC<WorldMapProps> = ({ 
    geoData, state, activeLayers, 
    onCountryClick, selectedCountry,
    selectedAlliances,
    onConflictClick
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [hoveredCountry, setHoveredCountry] = useState<{ name: string; x: number; y: number } | null>(null);
  
  const width = 1200;
  const height = 800;

  // Projection setup
  const projection = useMemo(() => {
    return d3.geoMercator()
      .scale(150)
      .translate([width / 2, height / 1.5]);
  }, []);

  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Calculate centroids for attack vector animations
  const countryCentroids = useMemo(() => {
    if (!geoData || !pathGenerator) return {};
    const centroids: Record<string, [number, number]> = {};
    geoData.features.forEach(f => {
        const iso = getIso(f);
        if (iso) {
            try {
                // Cast to any to satisfy d3 strict types
                const c = pathGenerator.centroid(f as any);
                if (!isNaN(c[0]) && !isNaN(c[1])) {
                    centroids[iso] = c;
                }
            } catch (e) {
                // Ignore errors
            }
        }
    });
    return centroids;
  }, [geoData, pathGenerator]);

  // Zoom handling
  useEffect(() => {
    // Only initialize zoom if the SVG is present and data is loaded
    if (!svgRef.current || !geoData) return;
    
    const svg = d3.select(svgRef.current);
    
    // Initialize zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 8])
      .translateExtent([[0, 0], [width, height]])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });
    
    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Disable default double-click zoom to prevent interference with rapid clicks
    svg.on("dblclick.zoom", null);
  }, [geoData]); // DEPENDENCY ADDED: Runs after geoData loads and SVG is rendered

  const handleZoomIn = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (svgRef.current && zoomBehaviorRef.current) {
          d3.select(svgRef.current)
            .transition()
            .duration(300)
            .call(zoomBehaviorRef.current.scaleBy, 1.4);
      }
  };

  const handleZoomOut = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (svgRef.current && zoomBehaviorRef.current) {
          d3.select(svgRef.current)
            .transition()
            .duration(300)
            .call(zoomBehaviorRef.current.scaleBy, 0.714);
      }
  };

  // Conflict Logic Helpers
  const isCountryInConflict = (iso: string) => {
      if (!activeLayers.includes(LayerType.CONFLICTS)) return null;
      const activeConflicts = state.conflicts.filter(c => c.participants.includes(iso));
      if (activeConflicts.length === 0) return null;
      
      const conflict = activeConflicts[0];
      const index = conflict.participants.indexOf(iso);
      return {
          side: index === 0 ? 'A' : 'B',
          conflictId: conflict.id
      };
  };

  // Helper to determine fill color based on state
  const getCountryFill = (feature: GeoJSONFeature) => {
    const iso = getIso(feature);
    const selectedIso = selectedCountry ? getIso(selectedCountry) : '';

    // 1. Conflict Layer - Distinct Highlighting
    const conflictStatus = isCountryInConflict(iso);
    if (conflictStatus && activeLayers.includes(LayerType.CONFLICTS)) {
        // Amber for Side A (Source/Aggressor), Indigo for Side B (Target/Defender)
        return conflictStatus.side === 'A' ? '#fbbf24' : '#818cf8';
    }

    // 2. Country Selection
    if (selectedIso === iso && iso !== '') {
      return '#38bdf8'; 
    }

    // 3. Alliance Isolation (Comparison Mode)
    if (selectedAlliances.length > 0) {
        // If a country belongs to multiple selected alliances, we prioritize the first one found in the selection list.
        // This acts as a simple layering mechanism.
        const matchingAlliance = selectedAlliances.find(a => a.members.includes(iso));
        if (matchingAlliance) {
            return matchingAlliance.color;
        }
        return '#0f172a'; // Dim countries not in any selected alliance
    }

    // 4. General Alliance Layer (Default View)
    if (activeLayers.includes(LayerType.ALLIANCES)) {
      for (const alliance of state.alliances) {
        if (alliance.members.includes(iso)) {
          return alliance.color + '40';
        }
      }
    }
    
    return '#1e293b';
  };

  const getCountryStroke = (feature: GeoJSONFeature) => {
    const iso = getIso(feature);
    const selectedIso = selectedCountry ? getIso(selectedCountry) : '';

    if (selectedAlliances.length > 0) {
        if (selectedIso === iso && iso !== '') return '#38bdf8';
        const matchingAlliance = selectedAlliances.find(a => a.members.includes(iso));
        if (matchingAlliance) return 'rgba(255, 255, 255, 0.4)';
        return '#334155';
    }

    if (activeLayers.includes(LayerType.ALLIANCES)) {
      for (const alliance of state.alliances) {
        if (alliance.members.includes(iso)) {
          return alliance.color;
        }
      }
    }
    if (selectedIso === iso && iso !== '') {
      return '#38bdf8';
    }
    return '#334155';
  };

  const getCountryOpacity = (feature: GeoJSONFeature) => {
      const iso = getIso(feature);
      const selectedIso = selectedCountry ? getIso(selectedCountry) : '';

      if (selectedAlliances.length > 0) {
          const matchingAlliance = selectedAlliances.find(a => a.members.includes(iso));
          if (matchingAlliance || (selectedIso === iso && iso !== '')) {
              return 1;
          }
          return 0.2; // Significant dimming for non-members
      }
      return 1;
  };
  
  const getCountryClassName = (feature: GeoJSONFeature) => {
      const iso = getIso(feature);
      const conflictStatus = isCountryInConflict(iso);
      if (conflictStatus) {
          return "transition-all duration-300 animate-pulse-slow cursor-pointer pointer-events-auto"; 
      }
      return "transition-all duration-300 hover:fill-slate-500 cursor-pointer pointer-events-auto";
  };

  const handleMouseMove = (e: React.MouseEvent, feature: GeoJSONFeature) => {
      setHoveredCountry({
          name: feature.properties.name,
          x: e.clientX,
          y: e.clientY
      });
  };

  if (!geoData) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-geo-neutral gap-4 bg-geo-dark">
            <Loader2 className="w-8 h-8 animate-spin text-geo-accent" />
            <div className="text-sm font-mono text-slate-400 tracking-widest uppercase">Initializing Satellite Feed...</div>
        </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden bg-geo-dark relative map-container">
      {/* CSS for custom animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .attack-vector {
            stroke-dasharray: 6, 3;
            animation: dash 1s linear infinite;
        }
      `}</style>
      
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full cursor-move touch-none pointer-events-auto"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
                <polygon points="0 0, 6 2, 0 4" fill="#fbbf24" />
            </marker>
        </defs>

        <g transform={transform.toString()}>
          {/* Base Countries */}
          {geoData.features.map((feature, i) => {
            const isIndia = getIso(feature) === 'IND';
            return (
              <React.Fragment key={`country-${i}`}>
                {/* 
                   Masking Layer for India:
                   Draws an opaque background-colored shape before the actual country.
                   This effectively "erases" any overlapping parts of underlying countries (like Pak/China claims)
                   so they don't bleed through the transparent alliance colors of the actual India layer.
                */}
                {isIndia && (
                    <path
                        d={pathGenerator(feature as any) || ''}
                        fill="#0f172a" // Matches bg-geo-dark
                        stroke="none"
                        className="pointer-events-none"
                    />
                )}
                <path
                    d={pathGenerator(feature as any) || ''}
                    fill={getCountryFill(feature)}
                    stroke={getCountryStroke(feature)}
                    strokeWidth={0.5 / transform.k}
                    opacity={getCountryOpacity(feature)}
                    className={getCountryClassName(feature)}
                    onMouseEnter={(e) => handleMouseMove(e, feature)}
                    onMouseMove={(e) => handleMouseMove(e, feature)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={(e) => {
                        e.stopPropagation();
                        onCountryClick(feature);
                    }}
                />
              </React.Fragment>
            );
          })}

          {/* Conflict Arrows (Directional A -> B) */}
          {activeLayers.includes(LayerType.CONFLICTS) && state.conflicts.map((conflict) => {
            const participants = conflict.participants;
            if (participants.length < 2) return null;

            const sideAIso = participants[0]; 
            const sideBIsos = participants.slice(1); 

            const start = countryCentroids[sideAIso];
            if (!start) return null;

            return (
                <g key={`conflict-anim-${conflict.id}`} className="pointer-events-none">
                    <title>Conflict Vector: {conflict.name}</title>
                    {sideBIsos.map(sideBIso => {
                        const end = countryCentroids[sideBIso];
                        if (!end) return null;

                        const dx = end[0] - start[0];
                        const dy = end[1] - start[1];
                        const dr = Math.sqrt(dx * dx + dy * dy);
                        // Arc path
                        const pathD = `M${start[0]},${start[1]}A${dr},${dr} 0 0,1 ${end[0]},${end[1]}`;

                        return (
                            <g key={`${sideAIso}-${sideBIso}`}>
                                {/* Directional Arrow */}
                                <path 
                                    d={pathD}
                                    fill="none"
                                    stroke="#fbbf24" 
                                    strokeWidth={1.5 / transform.k}
                                    opacity="0.8"
                                    className="attack-vector"
                                    markerEnd="url(#arrowhead)"
                                />
                                <circle 
                                    cx={start[0]} 
                                    cy={start[1]} 
                                    r={3 / transform.k} 
                                    fill="#fbbf24"
                                />
                                {/* Target Crosshair Effect */}
                                <g transform={`translate(${end[0]}, ${end[1]}) scale(${1/transform.k})`}>
                                     <circle 
                                        r="6" 
                                        fill="none" 
                                        stroke="#818cf8" 
                                        strokeWidth="1.5"
                                        className="animate-ping"
                                        opacity="0.5"
                                     />
                                     <circle 
                                        r="3" 
                                        fill="#818cf8" 
                                        stroke="white"
                                        strokeWidth="0.5"
                                     />
                                     <line x1="-5" y1="0" x2="5" y2="0" stroke="#818cf8" strokeWidth="1" />
                                     <line x1="0" y1="-5" x2="0" y2="5" stroke="#818cf8" strokeWidth="1" />
                                </g>
                            </g>
                        );
                    })}
                </g>
            );
          })}

          {/* Conflict Callouts */}
          {activeLayers.includes(LayerType.CONFLICTS) && state.conflicts.map((conflict) => {
            const [lon, lat] = conflict.coordinates;
            let coords: [number, number] | null = null;
            if (isFinite(lon) && isFinite(lat)) {
              coords = [lon, lat];
            } else {
              // Fallback: use centroid of first participant
              for (const p of conflict.participants) {
                const c = countryCentroids[p];
                if (c) { coords = c; break; }
              }
            }
            if (!coords) return null;
            const projected = projection(coords);
            if (!projected) return null;
            const [x, y] = projected;
            
            const scaleFactor = 1 / transform.k;

            return (
              <g 
                key={`callout-${conflict.id}`} 
                transform={`translate(${x}, ${y}) scale(${scaleFactor})`}
                onClick={(e) => {
                    e.stopPropagation();
                    onConflictClick(conflict);
                }}
                className="cursor-pointer pointer-events-auto"
              >
                 <g className="hover:scale-110 transition-transform duration-200">
                     <rect 
                        x="-60" y="-32" width="120" height="22" rx="4"
                        fill="#0f172a" stroke="#fbbf24" strokeWidth="1"
                        opacity="0.9"
                        className="hover:fill-slate-800"
                     />
                     <text 
                        x="0" y="-18" 
                        textAnchor="middle" 
                        fill="#fbbf24" 
                        fontSize="10" 
                        fontWeight="bold"
                        dy="0.3em"
                        style={{ textShadow: '0 1px 2px black' }}
                     >
                         {conflict.name.length > 20 ? conflict.name.substring(0,18) + '...' : conflict.name}
                     </text>
                     <line x1="0" y1="-10" x2="0" y2="0" stroke="#fbbf24" strokeWidth="1" />
                     <circle r="2" fill="#fbbf24" />
                 </g>
              </g>
            );
          })}
        </g>
      </svg>
      
      {/* Comparison Legend - Only if multiple selected */}
      {selectedAlliances.length > 1 && (
          <div className="absolute top-6 right-6 flex flex-col gap-2 bg-geo-panel/90 backdrop-blur-md p-4 rounded-lg border border-slate-600 shadow-2xl z-20 min-w-[200px] pointer-events-none">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-700 pb-2 mb-1">
                  Comparing ({selectedAlliances.length})
              </h4>
              <div className="space-y-2 pointer-events-auto">
                  {selectedAlliances.map(alliance => (
                      <div key={alliance.id} className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                              <span 
                                  className="w-3 h-3 rounded-full ring-1 ring-white/20 shadow-[0_0_8px_rgba(0,0,0,0.5)] flex-shrink-0" 
                                  style={{ backgroundColor: alliance.color }}
                              ></span>
                              <span className="text-xs font-semibold text-slate-200">{alliance.name}</span>
                          </div>
                      </div>
                  ))}
              </div>
              <div className="mt-2 text-[10px] text-slate-500 italic">
                  * Overlapping members show color of top-most selection.
              </div>
          </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
          <button 
            onClick={handleZoomIn}
            className="bg-geo-panel/90 p-2 rounded-full border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 shadow-lg transition-all active:scale-95 pointer-events-auto"
            title="Zoom In"
          >
              <ZoomIn className="w-5 h-5" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="bg-geo-panel/90 p-2 rounded-full border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 shadow-lg transition-all active:scale-95 pointer-events-auto"
            title="Zoom Out"
          >
              <ZoomOut className="w-5 h-5" />
          </button>
      </div>

      {/* Hover Tooltip */}
      {hoveredCountry && (
          <div 
            className="fixed pointer-events-none z-50 bg-slate-900/90 border border-slate-600 px-3 py-1.5 rounded shadow-xl text-white text-sm font-semibold tracking-wide backdrop-blur-sm transform -translate-x-1/2 -translate-y-[120%]"
            style={{ 
                left: hoveredCountry.x, 
                top: hoveredCountry.y 
            }}
          >
              {hoveredCountry.name}
          </div>
      )}
    </div>
  );
};

export default WorldMap;
