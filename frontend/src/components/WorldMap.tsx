"use client";

import { memo, useState } from "react";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker,
    Line
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export const WorldMap = memo(({ situations, selectedAlliances, allianceColors }: { situations: any[], selectedAlliances?: any[], allianceColors?: string[] }) => {
    const [tooltipContent, setTooltipContent] = useState("");

    return (
        <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/5 shadow-2xl relative">

            {/* SVG Filter for Glowing Markers */}
            <svg style={{ position: "absolute", width: 0, height: 0 }}>
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            <ComposableMap
                projectionConfig={{
                    scale: 140,
                }}
                className="w-full h-full outline-none"
            >
                <ZoomableGroup center={[0, 20]} zoom={1} minZoom={1} maxZoom={8}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                // Find if this country belongs to any of the currently selected alliances
                                let membershipColor = null;

                                if (selectedAlliances && allianceColors) {
                                    for (let i = 0; i < selectedAlliances.length; i++) {
                                        const isMember = selectedAlliances[i]?.members?.some((member: any) =>
                                            geo.properties.name.toLowerCase().includes(member.name.toLowerCase()) ||
                                            member.name.toLowerCase().includes(geo.properties.name.toLowerCase())
                                        );
                                        if (isMember) {
                                            membershipColor = allianceColors[i % allianceColors.length];
                                            break; // Once claimed by an alliance, stop checking (could blend, but first-match is cleaner for now)
                                        }
                                    }
                                }

                                return (
                                    <Geography
                                        key={geo.rsmKey}
                                        geography={geo}
                                        fill={membershipColor ? `${membershipColor}33` : "#1e293b"} // 33 is 20% opacity in hex
                                        stroke={membershipColor ? `${membershipColor}80` : "#334155"} // 80 is 50% opacity
                                        strokeWidth={0.5}
                                        style={{
                                            default: { outline: "none", transition: "all 250ms" },
                                            hover: { fill: "#334155", outline: "none", transition: "all 250ms" },
                                            pressed: { outline: "none" },
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>

                    {/* Render Lines for Directional Situations */}
                    {situations?.filter(sit => sit.source_lat != null && sit.target_lat != null).map((sit) => {
                        const color = sit.intensity_score >= 8 ? '#ef4444' : sit.intensity_score >= 5 ? '#f59e0b' : '#3b82f6';
                        return (
                            <Line
                                key={`line-${sit.id}`}
                                from={[sit.source_lng, sit.source_lat]}
                                to={[sit.target_lng, sit.target_lat]}
                                stroke={color}
                                strokeWidth={1.5}
                                strokeLinecap="round"
                                className="opacity-50"
                                style={{
                                    strokeDasharray: "4 4",
                                    animation: "dash 10s linear infinite"
                                }}
                            />
                        );
                    })}

                    {/* Render Action Markers for each active Situation */}
                    {situations?.filter(sit => sit.latitude != null && sit.longitude != null).map((sit) => {
                        const color = sit.intensity_score >= 8 ? '#ef4444' : sit.intensity_score >= 5 ? '#f59e0b' : '#3b82f6';

                        return (
                            <Marker
                                key={sit.id}
                                coordinates={[sit.longitude, sit.latitude]}
                                onMouseEnter={() => setTooltipContent(sit.title)}
                                onMouseLeave={() => setTooltipContent("")}
                            >
                                <circle
                                    r={8}
                                    fill={color}
                                    opacity={0.3}
                                    className="animate-ping origin-center"
                                    style={{ pointerEvents: 'none' }}
                                />
                                <circle
                                    r={4}
                                    fill={color}
                                    stroke="#000"
                                    strokeWidth={1.5}
                                    filter="url(#glow)"
                                    className="cursor-pointer hover:scale-150 transition-transform duration-300"
                                />
                            </Marker>
                        );
                    })}

                </ZoomableGroup>
            </ComposableMap>

            {/* Custom Interactive Tooltip */}
            {tooltipContent && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 pointer-events-none shadow-xl transition-all z-20">
                    <span className="text-white text-sm font-semibold tracking-wide shadow-black drop-shadow-md">{tooltipContent}</span>
                </div>
            )}

            <div className="absolute bottom-4 left-4 bg-slate-900/40 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/50 pointer-events-none">
                <span className="text-slate-400 font-mono text-[10px] uppercase tracking-widest">GeoSight Map Engine 2.0</span>
            </div>

            <style jsx>{`
                @keyframes dash {
                    to {
                        stroke-dashoffset: -100;
                    }
                }
            `}</style>
        </div>
    );
});

WorldMap.displayName = "WorldMap";
