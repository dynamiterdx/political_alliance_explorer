"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorldMap } from '@/components/WorldMap';
import { AIAssistantPanel } from '@/components/AIAssistantPanel';
import { Activity, Globe, Shield, History, RotateCw, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardClient({ initialWorldState }: { initialWorldState: any }) {
    const router = useRouter();
    const [worldState, setWorldState] = useState(initialWorldState);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [activeTab, setActiveTab] = useState<'situations' | 'alliances'>('situations');
    const [selectedSituation, setSelectedSituation] = useState<any | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [tickerIndex, setTickerIndex] = useState(0);

    const isLiveMode = selectedYear === new Date().getFullYear();
    const [selectedAlliance, setSelectedAlliance] = useState<any | null>(null);

    // Sync state if server revalidates (only for live mode)
    useEffect(() => {
        if (isLiveMode) {
            setWorldState(initialWorldState);
        }
    }, [initialWorldState, isLiveMode]);

    // Fetch Historical State when Year changes
    useEffect(() => {
        if (!isLiveMode) {
            let isMounted = true;
            setIsRefreshing(true);
            fetch(`/api/history?year=${selectedYear}`)
                .then(res => res.json())
                .then(data => {
                    if (isMounted && data && !data.error) {
                        setWorldState(data);
                    }
                })
                .catch(console.error)
                .finally(() => {
                    if (isMounted) setIsRefreshing(false);
                });
            return () => { isMounted = false; }
        }
    }, [selectedYear, isLiveMode]);

    // Basic Ticker Rotation
    useEffect(() => {
        if (!worldState?.situations || worldState.situations.length === 0) return;
        const interval = setInterval(() => {
            setTickerIndex((prev) => (prev + 1) % worldState.situations.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [worldState]);

    const handleRefresh = async () => {
        if (!isLiveMode || isRefreshing) return;
        setIsRefreshing(true);
        try {
            const res = await fetch('/api/refresh', { method: 'POST' });
            if (res.ok) {
                // Trigger Next.js App Router to fetch latest data on the server and pass it as props again
                router.refresh();
            } else {
                console.error("Refresh failed", await res.text());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans overflow-hidden">

            {/* Top Navigation / Ticker */}
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between h-14 shadow-xl">
                <div className="flex items-center gap-4 px-6 h-full border-r border-slate-800">
                    <Globe className="w-5 h-5 text-emerald-500" />
                    <h1 className="text-xl font-bold tracking-tight text-white hidden md:block">GeoSight</h1>

                    {/* Year Navigation */}
                    <select
                        className="bg-slate-800 border border-slate-700 text-sm rounded-md px-2 py-1 outline-none focus:border-emerald-500 transition-colors"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        disabled={isRefreshing}
                    >
                        <option value={new Date().getFullYear()}>Present ({new Date().getFullYear()})</option>
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                    </select>

                    {isLiveMode ? (
                        <span className="flex items-center gap-1.5 text-xs uppercase px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 font-mono">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse drop-shadow-md"></span>
                            {worldState?.freshness_status || 'LIVE'}
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 text-xs uppercase px-2 py-0.5 bg-slate-500/10 rounded-full border border-slate-500/20 text-slate-400 font-mono">
                            <History className="w-3 h-3" />
                            ARCHIVE
                        </span>
                    )}
                </div>

                {/* Ticker */}
                <div className="flex-1 px-4 overflow-hidden relative h-full flex items-center">
                    <AnimatePresence mode="wait">
                        {worldState?.situations?.[tickerIndex] && (
                            <motion.div
                                key={tickerIndex}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-sm text-slate-300 truncate font-mono flex items-center gap-3"
                            >
                                <span className="text-amber-400/80 font-bold uppercase text-xs border border-amber-900/50 bg-amber-950/30 px-2 py-0.5 rounded drop-shadow-md">BREAKING</span>
                                {worldState.situations[tickerIndex].title}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Global Controls */}
                <div className="flex items-center gap-4 px-6 h-full border-l border-slate-800">
                    <div className="text-xs text-slate-500 font-mono hidden lg:block">
                        {isRefreshing ? "Fetching Data..." : `Updated ${new Date(worldState?.last_scan_time || Date.now()).toLocaleTimeString()}`}
                    </div>
                    {isLiveMode && (
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className={`p-1.5 rounded-md border transition-colors ${isRefreshing ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                            title="Manual Live Refresh"
                        >
                            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    )}
                </div>
            </header>

            {/* Main Dashboard Layout */}
            <main className="flex-1 flex overflow-hidden relative">

                {/* Left Sidebar: Active Conflicts / Situations */}
                <aside className="w-96 border-r border-slate-800 bg-slate-900/80 backdrop-blur-3xl flex flex-col z-10 shadow-[5px_0_30px_rgba(0,0,0,0.6)]">

                    {/* Tabs */}
                    <div className="flex border-b border-slate-800">
                        <button
                            onClick={() => setActiveTab('situations')}
                            className={`flex-1 py-3 text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'situations' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
                        >
                            <Activity className="w-4 h-4" /> SITUATIONS
                        </button>
                        <button
                            onClick={() => setActiveTab('alliances')}
                            className={`flex-1 py-3 text-sm font-semibold tracking-wider flex items-center justify-center gap-2 transition-colors ${activeTab === 'alliances' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-950/20' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
                        >
                            <Shield className="w-4 h-4" /> ALLIANCES
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                        {activeTab === 'situations' ? (
                            worldState?.situations?.length > 0 ? (
                                worldState.situations.map((sit: any) => (
                                    <div
                                        key={sit.id}
                                        onClick={() => setSelectedSituation(sit)}
                                        className={`group relative overflow-hidden rounded-xl border p-4 transition-all cursor-pointer ${selectedSituation?.id === sit.id ? 'bg-slate-800/80 border-slate-600 shadow-[0_0_20px_rgba(0,0,0,0.4)]' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'}`}
                                    >
                                        <div className={`absolute top-0 left-0 w-1 h-full ${sit.intensity_score >= 8 ? 'bg-red-500' : sit.intensity_score >= 5 ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-950/80 text-slate-300 border border-white/5">{sit.type}</span>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${sit.trend_direction?.toLowerCase()?.includes('escalat') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                {sit.trend_direction}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-slate-100 mt-2 line-clamp-2 leading-relaxed">{sit.title}</h3>
                                        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{sit.summary}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-500 text-center py-8">No active situations detected.</div>
                            )
                        ) : (
                            worldState?.alliances?.length > 0 ? (
                                worldState.alliances.map((alliance: any) => (
                                    <div
                                        key={alliance.id}
                                        onClick={() => setSelectedAlliance(selectedAlliance?.id === alliance.id ? null : alliance)}
                                        className={`group relative overflow-hidden rounded-xl border p-4 transition-all cursor-pointer ${selectedAlliance?.id === alliance.id ? 'bg-blue-900/30 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10'}`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-50">{alliance.name}</h3>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${alliance.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                                                {alliance.status}
                                            </span>
                                        </div>
                                        <span className="text-xs font-mono text-blue-300/80 block mb-2">{alliance.type} • Est. {alliance.established_year}</span>
                                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{alliance.purpose}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-500 text-center py-8 flex flex-col items-center gap-3">
                                    <Shield className="w-8 h-8 opacity-20" />
                                    No records found.
                                </div>
                            )
                        )}
                    </div>
                </aside>

                {/* Center: Interactive World Map View */}
                <section className="flex-1 relative bg-slate-950 flex flex-col p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 z-0"></div>
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cartographer.png')] opacity-10 mix-blend-overlay z-0"></div>
                    <div className="relative z-10 w-full h-full">
                        <WorldMap situations={worldState?.situations || []} selectedAlliance={selectedAlliance} />
                    </div>
                </section>

                {/* Right Sidebar: Situation Detail View (Slide In) */}
                <AnimatePresence>
                    {selectedSituation && (
                        <motion.aside
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-[400px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl flex flex-col z-20"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
                                <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 shadow-inner">SITUATION DETAIL</span>
                                <button onClick={() => setSelectedSituation(null)} className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                                <div>
                                    <h2 className="text-xl font-bold leading-snug drop-shadow-md">{selectedSituation.title}</h2>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded shadow-sm border ${selectedSituation.intensity_score >= 8 ? 'bg-red-500/10 text-red-400 border-red-500/20' : selectedSituation.intensity_score >= 5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                            INTENSITY INT-{selectedSituation.intensity_score}
                                        </span>
                                        <span className="text-xs font-mono text-slate-400">{selectedSituation.first_detected ? new Date(selectedSituation.first_detected).toLocaleDateString() : 'Active'}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Globe className="w-3 h-3" /> Core Summary</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed drop-shadow-sm">{selectedSituation.summary}</p>
                                </div>

                                {selectedSituation.causes && (
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 px-1"><AlertTriangle className="w-3 h-3" /> Root Causes</h4>
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 shadow-inner">
                                            <p className="text-sm text-slate-300 leading-relaxed font-serif italic opacity-90">{selectedSituation.causes}</p>
                                        </div>
                                    </div>
                                )}

                                {selectedSituation.trajectory && (
                                    <div className="space-y-2 p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50 shadow-lg relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 blur-2xl rounded-full"></div>
                                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-2 relative z-10">
                                            <ChevronRight className="w-3 h-3" /> Future Trajectory
                                        </h4>
                                        <p className="text-sm text-indigo-200/90 leading-relaxed relative z-10 font-medium">{selectedSituation.trajectory}</p>
                                    </div>
                                )}

                                <div className="mt-auto pt-6 border-t border-slate-800">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Confidence Model</span>
                                        <span className={`font-mono px-2 py-0.5 rounded text-[10px] tracking-widest uppercase ${selectedSituation.confidence_level === 'high' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-500'}`}>{selectedSituation.confidence_level}</span>
                                    </div>
                                    <div className="mt-3 text-right">
                                        <span className="text-slate-600 font-mono text-[9px] uppercase tracking-widest">SYNTHESIZED BY GEMINI 2.5 PRO</span>
                                    </div>
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                <AIAssistantPanel worldState={worldState} />

            </main>
        </div>
    );
}
