"use client";

import { memo } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const WorldMap = memo(({ situations }: { situations: any[] }) => {
    return (
        <div className="w-full h-full border border-slate-800 rounded-3xl overflow-hidden bg-slate-900/50 relative">
            <ComposableMap
                projectionConfig={{
                    scale: 140,
                }}
                className="w-full h-full outline-none"
            >
                <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={8}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#1e293b" // slate-800
                                    stroke="#334155" // slate-700
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#334155", outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {/* Render glowing markers for each active Situation */}
                    {situations?.map((sit) => {
                        // For the mock demo, we generate a random coordinate 
                        // in a real app, this comes from situation.regions
                        const lat = (Math.random() - 0.5) * 120;
                        const lng = (Math.random() - 0.5) * 360;

                        const color = sit.intensity_score >= 8 ? '#ef4444' : sit.intensity_score >= 5 ? '#f59e0b' : '#3b82f6';

                        return (
                            <Marker key={sit.id} coordinates={[lng, lat]}>
                                <circle r={8} fill={color} opacity={0.4} className="animate-ping origin-center" />
                                <circle r={4} fill={color} stroke="#fff" strokeWidth={1.5} />
                            </Marker>
                        );
                    })}

                </ZoomableGroup>
            </ComposableMap>

            <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700 pointer-events-none">
                <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">Global Map Projection</span>
            </div>
        </div>
    );
});

WorldMap.displayName = "WorldMap";
