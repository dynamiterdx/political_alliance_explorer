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

    // Sync state if server revalidates
    useEffect(() => {
        setWorldState(initialWorldState);
    }, [initialWorldState]);

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
            <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 flex items-center justify-between h-14">
                <div className="flex items-center gap-4 px-6 h-full border-r border-slate-800">
                    <Globe className="w-5 h-5 text-emerald-500" />
                    <h1 className="text-xl font-bold tracking-tight text-white hidden md:block">GeoSight</h1>

                    {/* Year Navigation */}
                    <select
                        className="bg-slate-800 border border-slate-700 text-sm rounded-md px-2 py-1 outline-none focus:border-emerald-500"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        <option value={new Date().getFullYear()}>Present ({new Date().getFullYear()})</option>
                        <option value={2025}>2025</option>
                        <option value={2024}>2024</option>
                    </select>

                    {isLiveMode ? (
                        <span className="flex items-center gap-1.5 text-xs uppercase px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 font-mono">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
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
                                <span className="text-amber-400/80 font-bold uppercase text-xs border border-amber-900/50 bg-amber-950/30 px-2 py-0.5 rounded">BREAKING</span>
                                {worldState.situations[tickerIndex].title}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Global Controls */}
                <div className="flex items-center gap-4 px-6 h-full border-l border-slate-800">
                    <div className="text-xs text-slate-500 font-mono hidden lg:block">
                        Updated {new Date(worldState?.last_scan_time || Date.now()).toLocaleTimeString()}
                    </div>
                    <button
                        onClick={handleRefresh}
                        disabled={!isLiveMode || isRefreshing}
                        className={`p-1.5 rounded-md border transition-colors ${!isLiveMode ? 'opacity-30 cursor-not-allowed border-transparent' : isRefreshing ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}`}
                        title="Manual Live Refresh"
                    >
                        <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </header>

            {/* Main Dashboard Layout */}
            <main className="flex-1 flex overflow-hidden relative">

                {/* Left Sidebar: Active Conflicts / Situations */}
                <aside className="w-96 border-r border-slate-800 bg-slate-900/40 flex flex-col z-10 shadow-[5px_0_20px_rgba(0,0,0,0.5)]">

                    {/* Tabs */}
                    <div className="flex border-b border-slate-800">
                        <button
                            onClick={() => setActiveTab('situations')}
                            className={`flex-1 py-3 text-sm font-semibold tracking-wider flex items-center justify-center gap-2 ${activeTab === 'situations' ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-950/20' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
                        >
                            <Activity className="w-4 h-4" /> SITUATIONS
                        </button>
                        <button
                            onClick={() => setActiveTab('alliances')}
                            className={`flex-1 py-3 text-sm font-semibold tracking-wider flex items-center justify-center gap-2 ${activeTab === 'alliances' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-950/20' : 'text-slate-500 hover:bg-slate-800/50 hover:text-slate-300'}`}
                        >
                            <Shield className="w-4 h-4" /> ALLIANCES
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                        {activeTab === 'situations' ? (
                            worldState?.situations?.length > 0 ? (
                                worldState.situations.map((sit: any) => (
                                    <div
                                        key={sit.id}
                                        onClick={() => setSelectedSituation(sit)}
                                        className={`group relative overflow-hidden rounded-xl border p-4 transition-all cursor-pointer ${selectedSituation?.id === sit.id ? 'bg-slate-800/80 border-slate-600 shadow-[0_0_15px_rgba(0,0,0,0.5)]' : 'border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 hover:border-slate-700'}`}
                                    >
                                        <div className={`absolute top-0 left-0 w-1 h-full ${sit.intensity_score >= 8 ? 'bg-red-500' : sit.intensity_score >= 5 ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-mono px-2 py-1 rounded bg-slate-950/50 text-slate-300 border border-slate-800">{sit.type}</span>
                                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full ${sit.trend_direction === 'escalating' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                                                {sit.trend_direction}
                                            </span>
                                        </div>
                                        <h3 className="font-semibold text-slate-100 mt-2 line-clamp-2">{sit.title}</h3>
                                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{sit.summary}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-slate-500 text-center py-8">No active situations detected.</div>
                            )
                        ) : (
                            <div className="text-sm text-slate-500 text-center py-8 flex flex-col items-center gap-3">
                                <Shield className="w-8 h-8 opacity-20" />
                                No active alliance shifts.
                            </div>
                        )}
                    </div>
                </aside>

                {/* Center: Interactive World Map View */}
                <section className="flex-1 relative bg-slate-950 flex flex-col p-4">
                    <WorldMap situations={worldState?.situations || []} />
                </section>

                {/* Right Sidebar: Situation Detail View (Slide In) */}
                <AnimatePresence>
                    {selectedSituation && (
                        <motion.aside
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute right-0 top-0 bottom-0 w-96 bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col z-20"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
                                <span className="text-xs font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">SITUATION DETAIL</span>
                                <button onClick={() => setSelectedSituation(null)} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                                <div>
                                    <h2 className="text-xl font-bold leading-snug">{selectedSituation.title}</h2>
                                    <div className="flex items-center gap-3 mt-3">
                                        <span className={`text-xs uppercase font-bold tracking-wider px-2 py-1 rounded border ${selectedSituation.intensity_score >= 8 ? 'bg-red-500/10 text-red-400 border-red-500/20' : selectedSituation.intensity_score >= 5 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                            INTENSITY INT-{selectedSituation.intensity_score}
                                        </span>
                                        <span className="text-xs font-mono text-slate-400">{selectedSituation.date_identified ? new Date(selectedSituation.date_identified).toLocaleDateString() : 'Active'}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Globe className="w-3 h-3" /> Regions</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedSituation?.regions?.length > 0 ? selectedSituation.regions.map((r: any) => (
                                            <span key={r.id || Math.random()} className="text-xs px-2 py-1 bg-slate-800 rounded text-slate-300">{r.name || r}</span>
                                        )) : <span className="text-xs text-slate-500">Unspecified</span>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Activity className="w-3 h-3" /> Summary</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">{selectedSituation.summary}</p>
                                </div>

                                {Array.isArray(selectedSituation.causes) && selectedSituation.causes.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Identified Causes</h4>
                                        <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                                            {selectedSituation.causes.map((cause: string, i: number) => (
                                                <li key={i}>{cause}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {selectedSituation.trajectory_assessment && (
                                    <div className="space-y-2 p-4 rounded-lg bg-indigo-950/20 border border-indigo-900/50">
                                        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2 mb-2">
                                            <ChevronRight className="w-3 h-3" /> Trajectory Assessment
                                        </h4>
                                        <p className="text-sm text-indigo-200/80 leading-relaxed">{selectedSituation.trajectory_assessment}</p>
                                    </div>
                                )}

                                <div className="mt-auto pt-6 border-t border-slate-800">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500">Confidence Score</span>
                                        <span className="font-mono text-emerald-400">{selectedSituation.confidence_score}%</span>
                                    </div>
                                    {Array.isArray(selectedSituation.evidence_urls) && selectedSituation.evidence_urls.length > 0 && (
                                        <div className="mt-3">
                                            <span className="text-slate-500 text-xs block mb-1">Evidence Sources: {selectedSituation.evidence_urls.length}</span>
                                        </div>
                                    )}
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
