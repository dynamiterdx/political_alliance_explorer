
import React, { useMemo } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup
} from 'react-simple-maps';
import { ALLIANCES, GEO_URL } from '../constants';

interface WorldMapProps {
  selectedAllianceIds: string[];
  onCountryHover: (name: string | null) => void;
  onCountryClick: (iso: string, name: string) => void;
}

const WorldMap: React.FC<WorldMapProps> = ({ selectedAllianceIds, onCountryHover, onCountryClick }) => {
  const selectedAlliances = useMemo(() => 
    ALLIANCES.filter(a => selectedAllianceIds.includes(a.id)), 
    [selectedAllianceIds]
  );

  const isMultiSelect = selectedAllianceIds.length > 1;

  const getCountryColor = (iso: string) => {
    if (selectedAllianceIds.length === 0) return "#334155";

    const memberOfCount = selectedAlliances.filter(a => a.members.includes(iso)).length;

    if (memberOfCount === 0) return "#334155";

    if (isMultiSelect) {
      // In multi-select, show overlap vs partial
      if (memberOfCount === selectedAllianceIds.length) {
        return "#fbbf24"; // Overlap (Gold)
      }
      return "#6366f1"; // Partial (Indigo)
    } else {
      // Single select, use alliance color
      return selectedAlliances[0].color;
    }
  };

  return (
    <div className="w-full h-full relative bg-slate-950">
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147
        }}
        className="w-full h-full"
      >
        <ZoomableGroup center={[0, 20]} zoom={1}>
          <Sphere stroke="#1e293b" strokeWidth={0.5} id="sphere" fill="transparent" />
          <Graticule stroke="#1e293b" strokeWidth={0.5} />
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso = geo.properties.iso_a3 || geo.id;
                const fillColor = getCountryColor(iso);
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => onCountryHover(geo.properties.name)}
                    onMouseLeave={() => onCountryHover(null)}
                    onClick={() => onCountryClick(iso, geo.properties.name)}
                    style={{
                      default: {
                        fill: fillColor,
                        outline: "none",
                        stroke: "#0f172a",
                        strokeWidth: 0.5,
                        transition: "all 250ms"
                      },
                      hover: {
                        fill: fillColor === "#334155" ? "#475569" : fillColor,
                        outline: "none",
                        stroke: "#f8fafc",
                        strokeWidth: 1,
                        cursor: "pointer",
                        filter: "brightness(1.1)"
                      },
                      pressed: {
                        fill: "#1e293b",
                        outline: "none"
                      }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
