(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/WorldMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "WorldMap",
    ()=>WorldMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-simple-maps/dist/index.umd.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const WorldMap = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c = _s(({ situations, selectedAlliances, allianceColors })=>{
    _s();
    const [tooltipContent, setTooltipContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "jsx-5d9163581f00a3e3" + " " + "w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-white/5 shadow-2xl relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                style: {
                    position: "absolute",
                    width: 0,
                    height: 0
                },
                className: "jsx-5d9163581f00a3e3",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    className: "jsx-5d9163581f00a3e3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                        id: "glow",
                        x: "-50%",
                        y: "-50%",
                        width: "200%",
                        height: "200%",
                        className: "jsx-5d9163581f00a3e3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                stdDeviation: "3",
                                result: "coloredBlur",
                                className: "jsx-5d9163581f00a3e3"
                            }, void 0, false, {
                                fileName: "[project]/src/components/WorldMap.tsx",
                                lineNumber: 25,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feMerge", {
                                className: "jsx-5d9163581f00a3e3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "coloredBlur",
                                        className: "jsx-5d9163581f00a3e3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/WorldMap.tsx",
                                        lineNumber: 27,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "SourceGraphic",
                                        className: "jsx-5d9163581f00a3e3"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/WorldMap.tsx",
                                        lineNumber: 28,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/WorldMap.tsx",
                                lineNumber: 26,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/WorldMap.tsx",
                        lineNumber: 24,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/WorldMap.tsx",
                    lineNumber: 23,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/WorldMap.tsx",
                lineNumber: 22,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ComposableMap"], {
                projectionConfig: {
                    scale: 140
                },
                className: "w-full h-full outline-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ZoomableGroup"], {
                    center: [
                        0,
                        20
                    ],
                    zoom: 1,
                    minZoom: 1,
                    maxZoom: 8,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Geographies"], {
                            geography: geoUrl,
                            children: ({ geographies })=>geographies.map((geo)=>{
                                    // Find if this country belongs to any of the currently selected alliances
                                    let membershipColor = null;
                                    if (selectedAlliances && allianceColors) {
                                        for(let i = 0; i < selectedAlliances.length; i++){
                                            const isMember = selectedAlliances[i]?.members?.some((member)=>geo.properties.name.toLowerCase().includes(member.name.toLowerCase()) || member.name.toLowerCase().includes(geo.properties.name.toLowerCase()));
                                            if (isMember) {
                                                membershipColor = allianceColors[i % allianceColors.length];
                                                break; // Once claimed by an alliance, stop checking (could blend, but first-match is cleaner for now)
                                            }
                                        }
                                    }
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Geography"], {
                                        geography: geo,
                                        fill: membershipColor ? `${membershipColor}33` : "#1e293b",
                                        stroke: membershipColor ? `${membershipColor}80` : "#334155",
                                        strokeWidth: 0.5,
                                        style: {
                                            default: {
                                                outline: "none",
                                                transition: "all 250ms"
                                            },
                                            hover: {
                                                fill: "#334155",
                                                outline: "none",
                                                transition: "all 250ms"
                                            },
                                            pressed: {
                                                outline: "none"
                                            }
                                        }
                                    }, geo.rsmKey, false, {
                                        fileName: "[project]/src/components/WorldMap.tsx",
                                        lineNumber: 61,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0));
                                })
                        }, void 0, false, {
                            fileName: "[project]/src/components/WorldMap.tsx",
                            lineNumber: 41,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        situations?.filter((sit)=>sit.source_lat != null && sit.target_lat != null).map((sit)=>{
                            const color = sit.intensity_score >= 8 ? '#ef4444' : sit.intensity_score >= 5 ? '#f59e0b' : '#3b82f6';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Line"], {
                                from: [
                                    sit.source_lng,
                                    sit.source_lat
                                ],
                                to: [
                                    sit.target_lng,
                                    sit.target_lat
                                ],
                                stroke: color,
                                strokeWidth: 1.5,
                                strokeLinecap: "round",
                                className: "opacity-50",
                                style: {
                                    strokeDasharray: "4 4",
                                    animation: "dash 10s linear infinite"
                                }
                            }, `line-${sit.id}`, false, {
                                fileName: "[project]/src/components/WorldMap.tsx",
                                lineNumber: 82,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0));
                        }),
                        situations?.filter((sit)=>sit.latitude != null && sit.longitude != null).map((sit)=>{
                            const color = sit.intensity_score >= 8 ? '#ef4444' : sit.intensity_score >= 5 ? '#f59e0b' : '#3b82f6';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$simple$2d$maps$2f$dist$2f$index$2e$umd$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Marker"], {
                                coordinates: [
                                    sit.longitude,
                                    sit.latitude
                                ],
                                onMouseEnter: ()=>setTooltipContent(sit.title),
                                onMouseLeave: ()=>setTooltipContent(""),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        r: 8,
                                        fill: color,
                                        opacity: 0.3,
                                        style: {
                                            pointerEvents: 'none'
                                        },
                                        className: "jsx-5d9163581f00a3e3" + " " + "animate-ping origin-center"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/WorldMap.tsx",
                                        lineNumber: 109,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                        r: 4,
                                        fill: color,
                                        stroke: "#000",
                                        strokeWidth: 1.5,
                                        filter: "url(#glow)",
                                        className: "jsx-5d9163581f00a3e3" + " " + "cursor-pointer hover:scale-150 transition-transform duration-300"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/WorldMap.tsx",
                                        lineNumber: 116,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, sit.id, true, {
                                fileName: "[project]/src/components/WorldMap.tsx",
                                lineNumber: 103,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/WorldMap.tsx",
                    lineNumber: 40,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/WorldMap.tsx",
                lineNumber: 34,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            tooltipContent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-5d9163581f00a3e3" + " " + "absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-700 pointer-events-none shadow-xl transition-all z-20",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "jsx-5d9163581f00a3e3" + " " + "text-white text-sm font-semibold tracking-wide shadow-black drop-shadow-md",
                    children: tooltipContent
                }, void 0, false, {
                    fileName: "[project]/src/components/WorldMap.tsx",
                    lineNumber: 134,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/WorldMap.tsx",
                lineNumber: 133,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-5d9163581f00a3e3" + " " + "absolute bottom-4 left-4 bg-slate-900/40 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/50 pointer-events-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "jsx-5d9163581f00a3e3" + " " + "text-slate-400 font-mono text-[10px] uppercase tracking-widest",
                    children: "GeoSight Map Engine 2.0"
                }, void 0, false, {
                    fileName: "[project]/src/components/WorldMap.tsx",
                    lineNumber: 139,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/WorldMap.tsx",
                lineNumber: 138,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "5d9163581f00a3e3",
                children: "@keyframes dash{to{stroke-dashoffset:-100px}}"
            }, void 0, false, void 0, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/WorldMap.tsx",
        lineNumber: 19,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
}, "4iJPFHsK5WbOP98wNfwiwz0INLA=")), "4iJPFHsK5WbOP98wNfwiwz0INLA=");
_c1 = WorldMap;
WorldMap.displayName = "WorldMap";
var _c, _c1;
__turbopack_context__.k.register(_c, "WorldMap$memo");
__turbopack_context__.k.register(_c1, "WorldMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/WorldMap.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/WorldMap.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=src_components_WorldMap_tsx_a3e5b160._.js.map