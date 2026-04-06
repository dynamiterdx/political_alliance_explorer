"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const WorldMap = dynamic(() => import('@/components/WorldMap').then(mod => mod.WorldMap), { ssr: false });
import { AIAssistantPanel } from '@/components/AIAssistantPanel';
import { Activity, Globe, Shield, History, RotateCw, ChevronRight, X, AlertTriangle, Sparkles, ArrowRight, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function DashboardClient({ initialWorldState }: { initialWorldState: any }) {
    const router = useRouter();
    const [worldState, setWorldState] = useState(initialWorldState);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [activeTab, setActiveTab] = useState<'situations' | 'alliances'>('situations');
    const [selectedSituation, setSelectedSituation] = useState<any | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [tickerIndex, setTickerIndex] = useState(0);

    const isLiveMode = selectedYear === new Date().getFullYear();
    const [selectedAlliances, setSelectedAlliances] = useState<any[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [insightModal, setInsightModal] = useState<{ alliance: any, loading: boolean, data: string | null, error: string | null } | null>(null);
    const [expandedAlliances, setExpandedAlliances] = useState<string[]>([]);

    const ALLIANCE_COLORS = [
        '#3b82f6', // blue-500
        '#10b981', // emerald-500
        '#f59e0b', // amber-500
        '#8b5cf6', // violet-500
        '#ec4899', // pink-500
        '#06b6d4', // cyan-500
    ];

    const toggleAllianceSelection = (alliance: any) => {
        setSelectedAlliances(prev => {
            if (prev.find(a => a.id === alliance.id)) {
                return prev.filter(a => a.id !== alliance.id);
            } else {
                return [...prev, alliance];
            }
        });
    };

    const toggleExpandMembers = (e: React.MouseEvent, allianceId: string) => {
        e.stopPropagation();
        setExpandedAlliances(prev => 
            prev.includes(allianceId) 
                ? prev.filter(id => id !== allianceId)
                : [...prev, allianceId]
        );
    };

    const fetchInsight = async (e: React.MouseEvent, alliance: any) => {
        e.stopPropagation(); // don't toggle map selection
        setInsightModal({ alliance, loading: true, data: null, error: null });
        try {
            const res = await fetch('/api/alliance/insights', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ allianceId: alliance.id, allianceData: alliance })
            });
            const data = await res.json();
            if (data.insight) {
                setInsightModal({ alliance, loading: false, data: data.insight, error: null });
            } else {
                setInsightModal({ alliance, loading: false, data: null, error: data.error || 'Failed to analyze.' });
            }
        } catch (e) {
            setInsightModal({ alliance, loading: false, data: null, error: 'Network error.' });
        }
    };

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

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="flex h-screen bg-surface-dim text-on-surface overflow-hidden relative font-sans">
            <AIAssistantPanel worldState={worldState} />

            <div className="flex flex-col w-full h-full">
                <header className="h-14 bg-surface-container-low flex items-center justify-between px-6 z-20 shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-primary" />
                            <h1 className="text-lg font-bold tracking-widest font-display uppercase">GeoSight</h1>
                        </div>
                        <nav className="hidden md:flex items-center gap-1 font-mono text-xs uppercase tracking-widest">
                            <Link href="/" className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 transition-colors">Map View</Link>
                            <Link href="/feed" className="px-3 py-1.5 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors">Intelligence Feed</Link>
                        </nav>
                        <select
                            className="bg-surface-container text-sm rounded-md px-2 py-1 outline-none border border-outline-variant/30"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                        >
                            <option value={new Date().getFullYear()}>Present</option>
                            <option value={2025}>2025</option>
                            <option value={2024}>2024</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-xs text-slate-500 font-mono hidden lg:block">
                            {mounted && (isRefreshing ? "Fetching..." : `Updated ${new Date(worldState?.last_scan_time || Date.now()).toLocaleTimeString()}`)}
                        </div>
                        {isLiveMode && (
                            <button
                                onClick={() => router.refresh()}
                                className="p-1.5 rounded-md bg-surface-container hover:bg-surface-container-high transition-colors"
                            >
                                <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        )}
                    </div>
                </header>

                <main className="flex flex-1 overflow-hidden relative">
                    <aside className="w-[340px] bg-surface-container-low flex flex-col z-10 shrink-0 shadow-lg">
                        <div className="flex items-center px-4 pt-4 pb-2 gap-4">
                            <button
                                onClick={() => setActiveTab('situations')}
                                className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 border-b-2 ${activeTab === 'situations' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                            >
                                <Activity className="w-4 h-4 inline mr-1" /> SITUATIONS
                            </button>
                            <button
                                onClick={() => setActiveTab('alliances')}
                                className={`text-sm font-bold uppercase tracking-wider transition-colors pb-2 border-b-2 ${activeTab === 'alliances' ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-slate-300'}`}
                            >
                                <Shield className="w-4 h-4 inline mr-1" /> ALLIANCES
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                            {activeTab === 'situations' ? (
                                worldState?.situations?.map((sit: any) => (
                                    <div
                                        key={sit.id}
                                        onClick={() => setSelectedSituation(sit)}
                                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col gap-2 ${selectedSituation?.id === sit.id ? 'bg-surface-container-high' : 'bg-surface-container hover:bg-surface-container-high/60'}`}
                                    >
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${sit.intensity_score >= 8 ? 'bg-error' : sit.intensity_score >= 5 ? 'bg-tertiary' : 'bg-secondary'}`} />
                                        <div className="pl-2">
                                            <h3 className="text-sm font-bold font-display text-on-surface leading-snug">{sit.title}</h3>
                                            <div className="flex justify-between items-center gap-2 mt-2">
                                                <span className="text-[10px] font-mono px-2 py-1 rounded bg-surface-container-low text-secondary-dim border border-outline-variant/30 flex-1 truncate">{sit.type}</span>
                                                <span className={`text-[10px] uppercase font-bold tracking-wider font-mono px-2 py-1 rounded whitespace-nowrap ${sit.trend_direction?.toLowerCase()?.includes('escalat') ? 'text-error' : 'text-tertiary'}`}>
                                                    {sit.trend_direction}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                worldState?.alliances?.map((alliance: any) => {
                                    const isSelected = selectedAlliances.some(a => a.id === alliance.id);
                                    return (
                                        <div key={alliance.id} className={`p-4 rounded-xl cursor-default transition-all duration-300 relative overflow-hidden ${isSelected ? 'bg-surface-container-high' : 'bg-surface-container hover:bg-surface-container-high/60'}`}>
                                            <div className="flex border-b border-outline-variant/30 pb-3 mb-3 justify-between items-start">
                                                <div>
                                                    <h3 className="text-base font-bold font-display text-on-surface">{alliance.name}</h3>
                                                    <span className="text-[10px] text-secondary font-mono tracking-wider uppercase mt-1 inline-block">{alliance.type}</span>
                                                </div>
                                                <button
                                                    onClick={() => toggleAllianceSelection(alliance)}
                                                    className={`px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider transition-colors ${isSelected ? 'bg-error text-surface-dim' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                                >
                                                    {isSelected ? 'Deselect' : 'Select'}
                                                </button>
                                            </div>
                                            <div className="my-3">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {alliance.members?.slice(0, expandedAlliances.includes(alliance.id) ? undefined : 6).map((m: any, i: number) => (
                                                        <span key={i} className="text-[10px] font-mono text-secondary-dim bg-surface-container-low border border-outline-variant/30 px-2 py-1 rounded">{m.name}</span>
                                                    ))}
                                                    {alliance.members?.length > 6 && !expandedAlliances.includes(alliance.id) && (
                                                        <button onClick={(e) => toggleExpandMembers(e, alliance.id)} className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20 transition-colors">+{alliance.members.length - 6} more</button>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => fetchInsight(e, alliance)}
                                                disabled={insightModal?.alliance?.id === alliance.id && insightModal?.loading}
                                                className="w-full mt-2 py-2 rounded bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                            >
                                                {insightModal?.alliance?.id === alliance.id && insightModal?.loading ? <RotateCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} AI Insights
                                            </button>
                                            
                                            {insightModal?.alliance?.id === alliance.id && !insightModal?.loading && insightModal?.data && (
                                                <div className="mt-3 p-3 bg-surface-container-low rounded-lg text-xs leading-relaxed text-secondary border-l-2 border-primary overflow-auto max-h-[250px] custom-scrollbar prose prose-invert prose-sm">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] uppercase tracking-widest font-bold text-primary">Strategic Insight</span>
                                                        <button onClick={() => setInsightModal(null)} className="text-secondary hover:text-on-surface">
                                                            <X className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <ReactMarkdown>{insightModal.data}</ReactMarkdown>
                                                </div>
                                            )}
                                            {insightModal?.alliance?.id === alliance.id && !insightModal?.loading && insightModal?.error && (
                                                <div className="mt-3 p-3 bg-error/10 border border-error/30 rounded-lg text-xs text-error">
                                                    {insightModal.error}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </aside>

                    <section className="flex-1 relative bg-surface-dim">
                        <WorldMap situations={worldState?.situations || []} selectedAlliances={selectedAlliances} allianceColors={ALLIANCE_COLORS} />
                    </section>

                    <AnimatePresence>
                        {selectedSituation && (
                            <motion.aside
                                initial={{ x: '100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: '100%', opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute right-0 top-0 h-full w-[400px] bg-surface-variant/60 backdrop-blur-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.4)] flex flex-col z-20 font-sans"
                            >
                                <div className="h-14 border-b border-outline-variant/30 flex items-center justify-between px-4 shrink-0 bg-surface-dim/40">
                                    <h2 className="font-bold text-sm uppercase tracking-widest text-secondary inline-flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> Situation Detail
                                    </h2>
                                    <button onClick={() => setSelectedSituation(null)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                
                                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar">
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-bold font-display leading-[1.1] text-on-surface">{selectedSituation.title}</h2>
                                        
                                        <div className="grid grid-cols-2 gap-3 mt-4">
                                            <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1">
                                                <span className="text-[10px] text-secondary font-mono tracking-widest uppercase font-bold">Ontology Class</span>
                                                <span className="text-xs text-on-surface font-mono font-medium truncate" title={selectedSituation.type}>{selectedSituation.type}</span>
                                            </div>
                                            <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1">
                                                <span className="text-[10px] text-secondary font-mono tracking-widest uppercase font-bold">Risk Index</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm font-bold ${selectedSituation.intensity_score >= 8 ? 'text-error' : selectedSituation.intensity_score >= 5 ? 'text-tertiary' : 'text-primary'}`}>
                                                        {selectedSituation.intensity_score} / 10
                                                    </span>
                                                    <span className="text-[9px] uppercase bg-white/5 px-1.5 py-0.5 rounded text-on-surface-variant border border-outline-variant/30">{selectedSituation.trend_direction}</span>
                                                </div>
                                            </div>
                                            <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1">
                                                <span className="text-[10px] text-secondary font-mono tracking-widest uppercase font-bold">Lifecycle</span>
                                                <span className="text-xs font-semibold capitalize text-on-surface">{selectedSituation.status}</span>
                                            </div>
                                            <div className="bg-surface-container-low p-3 rounded-lg flex flex-col gap-1">
                                                <span className="text-[10px] text-secondary font-mono tracking-widest uppercase font-bold">Vector</span>
                                                <div className="text-xs font-medium">
                                                    {selectedSituation.source_lat != null && selectedSituation.target_lat != null ? (
                                                        <span className="flex items-center gap-1.5 text-warning"><ArrowRight className="w-3.5 h-3.5" /> Directed Action</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-primary"><MapPin className="w-3.5 h-3.5" /> Regional Focus</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {selectedSituation.actors && selectedSituation.actors.length > 0 && (
                                            <div className="mt-2 text-xs flex flex-wrap gap-2 items-center">
                                                <span className="text-[10px] text-secondary font-mono tracking-widest uppercase font-bold mr-1">Actors:</span>
                                                {selectedSituation.actors.map((actor: any, i: number) => (
                                                    <span key={i} className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                        {actor.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <h4 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2"><Globe className="w-3 h-3" /> Core Summary</h4>
                                        <p className="text-sm text-on-surface-variant leading-relaxed">{selectedSituation.summary}</p>
                                    </div>

                                    {selectedSituation.causes && (
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-2 px-1"><AlertTriangle className="w-3 h-3" /> Root Causes</h4>
                                            <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30">
                                                <p className="text-sm text-on-surface-variant leading-relaxed font-serif italic">{selectedSituation.causes}</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedSituation.trajectory && (
                                        <div className="space-y-2 p-4 rounded-xl bg-primary-container/30 border border-primary-container/50 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 blur-2xl rounded-full"></div>
                                            <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-2 relative z-10">
                                                <ChevronRight className="w-3 h-3" /> Future Trajectory
                                            </h4>
                                            <p className="text-sm text-on-surface leading-relaxed relative z-10 font-medium">{selectedSituation.trajectory}</p>
                                        </div>
                                    )}

                                    <div className="mt-auto pt-6 border-t border-outline-variant/30">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-secondary tracking-widest uppercase text-[10px] font-bold">Confidence</span>
                                            <span className={`font-mono px-2 py-0.5 rounded text-[10px] tracking-widest uppercase ${selectedSituation.confidence_level === 'high' ? 'bg-primary/20 text-primary' : 'bg-tertiary/20 text-tertiary'}`}>{selectedSituation.confidence_level}</span>
                                        </div>
                                        <div className="mt-3 text-right">
                                            <span className="text-secondary/50 font-mono text-[9px] uppercase tracking-widest">SYNTHESIZED BY GEMINI 2.5 PRO</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>
                    <AIAssistantPanel worldState={worldState} />
                </main>
            </div>
        </div>
    );
}
