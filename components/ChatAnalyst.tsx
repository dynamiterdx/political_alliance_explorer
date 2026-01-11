import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, RefreshCw } from 'lucide-react';
import { ChatMessage, GeopoliticalState } from '../types';
import * as GeminiService from '../services/geminiService';

interface ChatAnalystProps {
  currentState: GeopoliticalState;
}

const ChatAnalyst: React.FC<ChatAnalystProps> = ({ currentState }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      role: 'model',
      text: `Greetings. I am your Geopolitical Analyst. I am currently reviewing the world state for **${currentState.year}**. Ask me about conflicts, alliances, or regional dynamics.`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Re-initialize context when year changes if needed, 
  // currently simplified to just updating the system prompts implicitly via new questions
  useEffect(() => {
     // Optional: Add a system message indicating context shift
     setMessages(prev => [
         ...prev,
         {
             id: `sys-${Date.now()}`,
             role: 'model',
             text: `[System Update]: Context shifted to year ${currentState.year}. My analysis will now reflect this time period.`,
             timestamp: new Date()
         }
     ]);
  }, [currentState.year]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const stream = await GeminiService.sendMessage(userMsg.text, currentState);
      
      let fullResponse = '';
      const botMsgId = (Date.now() + 1).toString();
      
      // Add placeholder bot message
      setMessages(prev => [...prev, {
        id: botMsgId,
        role: 'model',
        text: '',
        timestamp: new Date(),
        isThinking: true
      }]);

      for await (const chunk of stream) {
        if (chunk.text) {
             fullResponse += chunk.text;
             setMessages(prev => prev.map(m => 
                m.id === botMsgId 
                ? { ...m, text: fullResponse, isThinking: false } 
                : m
             ));
        }
      }

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I encountered an error connecting to the intelligence feed. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-geo-panel border-l border-slate-700 w-96 shadow-xl z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center gap-2">
        <Bot className="text-geo-accent w-5 h-5" />
        <h2 className="font-semibold text-slate-200">Analyst Link</h2>
        <div className="ml-auto flex items-center gap-1 text-xs text-geo-success">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-200 border border-slate-600'
              }`}
            >
              {msg.text || (msg.isThinking ? <Loader2 className="w-4 h-4 animate-spin text-slate-400" /> : '')}
            </div>
            <span className="text-[10px] text-slate-500 mt-1">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700 bg-slate-900/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about global stability..."
            disabled={isLoading}
            className="flex-1 bg-slate-800 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-geo-accent focus:ring-1 focus:ring-geo-accent transition-all placeholder:text-slate-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-geo-accent/10 hover:bg-geo-accent/20 text-geo-accent p-2 rounded-md transition-colors disabled:opacity-50 border border-geo-accent/50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAnalyst;
