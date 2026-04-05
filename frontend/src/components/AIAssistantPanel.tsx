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
                    className="fixed bottom-6 right-6 h-14 w-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(123,208,255,0.4)] hover:bg-primary/90 transition-colors z-50 border border-primary/50"
                >
                    <Bot className="w-6 h-6 text-surface-dim" />
                </button>
            )}

            {/* Slide Out Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: 20, opacity: 0, scale: 0.95 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 20, opacity: 0, scale: 0.95 }}
                        className="fixed bottom-6 right-6 w-96 max-h-[600px] h-[80vh] bg-surface-variant/70 backdrop-blur-[20px] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-[20px] flex flex-col z-50 overflow-hidden font-sans border border-outline-variant/30"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-outline-variant/30 bg-surface-dim/40 h-14 shrink-0">
                            <div className="flex items-center gap-2">
                                <Bot className="w-5 h-5 text-primary" />
                                <span className="text-sm font-bold tracking-widest uppercase font-mono text-secondary">TACTICAL ADVISOR</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1 rounded-full text-secondary hover:text-on-surface hover:bg-white/10 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                            {messages.length === 0 && (
                                <div className="text-center text-secondary my-auto text-sm pb-10 flex flex-col items-center">
                                    <Bot className="w-10 h-10 opacity-20 mb-3" />
                                    <p className="max-w-[200px] font-mono text-xs">Query the intelligence surface for threat vectors and sentiment drift.</p>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] rounded-[14px] px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-surface-dim rounded-br-[4px] font-medium' : 'bg-surface-container-high text-on-surface rounded-bl-[4px] border border-outline-variant/30'}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-surface-container-high text-secondary rounded-[14px] rounded-bl-[4px] border border-outline-variant/30 px-4 py-3 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                        <span className="text-[10px] font-mono uppercase tracking-widest text-primary">Synthesizing...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-outline-variant/30 bg-surface-container shrink-0">
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    disabled={isLoading}
                                    placeholder="Type a command..."
                                    className="w-full bg-surface-dim border border-outline-variant/30 rounded-full pl-4 pr-12 py-3 text-sm text-on-surface placeholder-secondary focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all disabled:opacity-50 font-mono"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 p-1.5 bg-primary rounded-full text-surface-dim hover:opacity-90 disabled:opacity-50 transition-opacity"
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
