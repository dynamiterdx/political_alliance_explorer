"use client";

import { useState } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIAssistantPanel({ worldState }: { worldState: any }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, worldState })
            });

            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM ERROR: Disconnected from Tactical Analysis Core." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:bg-emerald-500 transition-colors z-50 border border-emerald-400/50"
                >
                    <Bot className="w-6 h-6 text-white" />
                </button>
            )}

            {/* Slide Out Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        className="fixed bottom-6 right-6 w-96 max-h-[600px] h-[80vh] bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/50">
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5 text-emerald-400" />
                                <span className="text-sm font-semibold tracking-wide text-slate-200">TACTICAL ADVISOR</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                            {messages.length === 0 && (
                                <div className="text-center text-slate-500 my-auto text-sm pb-10">
                                    <Bot className="w-10 h-10 mx-auto opacity-20 mb-3" />
                                    <p>Ask me to analyze the current WorldState, identify risks, or summarize specific situations.</p>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-slate-800 text-slate-200 rounded-bl-sm border border-slate-700'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-bl-sm border border-slate-700 px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                                        <span className="text-xs font-mono">Synthesizing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-800 bg-slate-950">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="Query the WorldState..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-full pl-4 pr-12 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 p-1.5 bg-emerald-600 rounded-full text-white hover:bg-emerald-500 disabled:opacity-50 transition-colors"
                                >
                                    <Send className="w-4 h-4 pl-0.5" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
