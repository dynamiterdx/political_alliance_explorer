"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, RefreshCw, Layers, ShieldAlert, Navigation } from 'lucide-react';
import Link from 'next/link';
import { AIAssistantPanel } from './AIAssistantPanel';
import { motion, AnimatePresence } from 'framer-motion';

export default function FeedClient({ initialWorldState }: { initialWorldState: any }) {
    const router = useRouter();
    const [worldState, setWorldState] = useState(initialWorldState);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch('/api/refresh', { method: 'POST' });
            const data = await res.json();
            if (data.worldState) {
                setWorldState(data.worldState);
                router.refresh();
            }
        } finally {
            setIsRefreshing(false);
        }
    };

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
                            <Link href="/" className="px-3 py-1.5 rounded-full text-secondary hover:text-on-surface hover:bg-surface-container transition-colors">Map View</Link>
                            <Link href="/feed" className="px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 transition-colors">Intelligence Feed</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-xs text-secondary font-mono hidden lg:block">
                            {mounted && (isRefreshing ? "Fetching..." : `Updated ${new Date(worldState?.last_scan_time || Date.now()).toLocaleTimeString()}`)}
                        </div>
                        <button
                            onClick={handleRefresh}
                            className="p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-secondary hover:text-on-surface"
                            disabled={isRefreshing}
                        >
                            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div className="mb-10">
                            <h2 className="text-3xl font-display text-on-surface mb-2">Intelligence Feed</h2>
                            <p className="text-secondary body-md">Real-time situational awareness powered by multi-modal ground truth. All signals are verified through independent extraction logic.</p>
                        </div>

                        {worldState?.situations?.map((sit: any, idx: number) => (
                            <motion.div
                                key={sit.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-surface-container p-6 rounded-[20px] border border-outline-variant/30 flex gap-4 relative overflow-hidden"
                            >
                                {/* Leading Indicator */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${sit.intensity_score > 7 ? 'bg-error' : sit.intensity_score > 4 ? 'bg-tertiary' : 'bg-secondary'}`} />
                                
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-display text-xl text-on-surface">{sit.title || sit.id.substring(0, 8)}</h3>
                                            <span className="font-mono text-[10px] text-secondary tracking-widest uppercase px-2 py-1 bg-surface-container-high rounded border border-outline-variant/30">
                                                {new Date(sit.last_updated).toLocaleTimeString('en-US', { hour12: false, timeZone: 'UTC' })} UTC
                                            </span>
                                        </div>
                                        <p className="text-sm text-secondary leading-relaxed">
                                            {sit.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-outline-variant/30">
                                        <div className="bg-surface-dim/50 p-3 rounded-lg border border-outline-variant/20">
                                            <div className="flex items-center gap-1.5 text-secondary mb-1">
                                                <Layers className="w-3.5 h-3.5" />
                                                <span className="text-[10px] uppercase tracking-widest font-mono">Class</span>
                                            </div>
                                            <span className="text-xs font-medium text-on-surface truncate pr-2 block" title={sit.type}>{sit.type || "Unclassified"}</span>
                                        </div>
                                        
                                        <div className="bg-surface-dim/50 p-3 rounded-lg border border-outline-variant/20">
                                            <div className="flex items-center gap-1.5 text-secondary mb-1">
                                                <ShieldAlert className="w-3.5 h-3.5" />
                                                <span className="text-[10px] uppercase tracking-widest font-mono">Risk Index</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs font-bold ${sit.intensity_score >= 8 ? 'text-error' : sit.intensity_score >= 5 ? 'text-tertiary' : 'text-primary'}`}>
                                                    {sit.intensity_score}/10
                                                </span>
                                                <span className="text-[10px] bg-surface-container px-1 py-0.5 rounded text-secondary uppercase">
                                                    {sit.status || "Active"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="bg-surface-dim/50 p-3 rounded-lg border border-outline-variant/20">
                                            <div className="flex items-center gap-1.5 text-secondary mb-1">
                                                <Navigation className="w-3.5 h-3.5" />
                                                <span className="text-[10px] uppercase tracking-widest font-mono">Vector</span>
                                            </div>
                                            <span className="text-xs font-medium text-on-surface">
                                                {sit.source_lat != null && sit.target_lat != null ? "Directed Action" : "Regional Focus"}
                                            </span>
                                        </div>
                                        
                                        <div className="bg-surface-dim/50 p-3 rounded-lg border border-outline-variant/20">
                                            <span className="text-[10px] uppercase tracking-widest font-mono text-secondary block mb-1">Confidence</span>
                                            <span className="text-xs font-mono text-primary">{(sit.intensity_score * 9.8).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
