import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../lib/api';
import { Bot, Send, Sparkles, X, Copy, Check, AlertCircle, RefreshCw, Trash2, RotateCcw } from 'lucide-react';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  userNickname: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  isLiveAI?: boolean;
  isError?: boolean;
  retryPrompt?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, userNickname }) => {
  const storageKey = `aquatrack_ai_chat_${userNickname || 'user'}`;

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'msg-welcome',
        sender: 'assistant',
        text: `Hello ${userNickname || 'Friend'}! 👋 I am your AquaTrack AI assistant.\n\nI can answer general knowledge questions (like science topics or explanations), help write school announcements, explain Philippine environmental laws (RA 9275 Clean Water Act and PD 1067 Water Code), or analyze your recorded water usage to recommend practical savings.\n\nHow can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: true,
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Persist messages to local storage
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages, storageKey]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages
      .filter((m) => m.text && !m.isError)
      .map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

    try {
      const res = await api.askAI(text, history);
      const botMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: res.isLiveAI,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'assistant',
        text: `Unable to receive a response: ${err.message || 'Please check your connection and try again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: false,
        isError: true,
        retryPrompt: text,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      // Refocus textarea on desktop
      if (textareaRef.current && window.innerWidth > 640) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    const fresh: Message[] = [
      {
        id: crypto.randomUUID(),
        sender: 'assistant',
        text: `Chat cleared. Ask me general questions, writing help, or water conservation guidance!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isLiveAI: true,
      },
    ];
    setMessages(fresh);
    try {
      localStorage.setItem(storageKey, JSON.stringify(fresh));
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg h-full bg-white dark:bg-[#102338] border-l border-slate-200 dark:border-[#263D52] shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-[#0c1a2c]/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
                  AquaTrack AI Assistant
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                General conversation, conservation & legal intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear conversation"
              aria-label="Clear chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Message scroll list */}
        <div ref={scrollRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[88%] ${
                  isUser ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div
                  className={`p-3.5 sm:p-4 rounded-3xl text-xs sm:text-sm leading-relaxed relative group ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-br-xs shadow-md'
                      : m.isError
                      ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 rounded-bl-xs'
                      : 'bg-slate-100 dark:bg-[#0c1a2c] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{m.text}</div>

                  {!isUser && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/80 text-[10px] text-slate-400">
                      <span>{m.isError ? 'Request Error' : 'Gemini AI Assistant'}</span>
                      <div className="flex items-center gap-2">
                        {m.isError && m.retryPrompt && (
                          <button
                            onClick={() => handleSend(m.retryPrompt)}
                            disabled={loading}
                            className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Retry</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(m.id, m.text)}
                          className="hover:text-cyan-500 flex items-center gap-1 transition-colors"
                          title="Copy text"
                        >
                          {copiedId === m.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-cyan-600 dark:text-cyan-400 p-3 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/30 w-fit animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>AquaTrack AI is generating response...</span>
            </div>
          )}
        </div>

        {/* Suggested chips covering general knowledge, water conservation, school announcements, and Philippine laws */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0">Try asking:</span>
          {[
            'Explain photosynthesis in simple terms',
            'Help me write a school water announcement',
            'How much water have I used today?',
            'Explain RA 9275 Clean Water Act',
            'How do I test my toilet for hidden leaks?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 shrink-0 text-[11px] transition-colors border border-slate-200 dark:border-slate-700/60 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input box with Textarea supporting Enter to send and Shift+Enter for new line */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#102338]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything (general knowledge, writing, laws, your logs)... [Enter to send]"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0c1a2c] text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none max-h-28 overflow-y-auto"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white disabled:opacity-50 hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 mt-1 px-1">
            Press <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[9px]">Enter</kbd> to send, <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[9px]">Shift+Enter</kbd> for a new line.
          </p>
        </div>
      </div>
    </div>
  );
};
