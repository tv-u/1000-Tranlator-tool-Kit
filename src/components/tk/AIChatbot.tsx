import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, Zap, ArrowRight } from 'lucide-react';
import { TOOLS_REGISTRY } from '../../lib/tools/registry';
import { ToolDefinition } from '../../lib/tools/types';

interface Message {
  sender: 'ai' | 'user';
  text: string;
  recommendedTools?: ToolDefinition[];
}

interface AIChatbotProps {
  onSelectTool: (tool: ToolDefinition) => void;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ onSelectTool }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: 'Hello! I am your AI Assistant powered by Translator Kit. Ask me anything or tell me what you want to convert, translate, or generate (e.g. "PDF to Word", "SHA-256 hash", "Spanish translation").',
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages: Message[] = [...messages, { sender: 'user', text: userText }];
    setMessages(newMessages);
    setInput('');

    // Process intelligent response
    setTimeout(() => {
      const query = userText.toLowerCase();
      let replyText = "I found these matching tools for your request in our 1,000-tool registry:";
      
      const matches = TOOLS_REGISTRY.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.slug.toLowerCase().includes(query)
      ).slice(0, 3);

      if (matches.length === 0) {
        replyText = `I can help you with translation, PDF conversion, OCR, hashing, and formatting. Try searching for "PDF", "Text", "Image", or "Crypto".`;
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: replyText,
          recommendedTools: matches.length > 0 ? matches : undefined,
        },
      ]);
    }, 400);
  };

  return (
    <>
      {/* Floating 3D AI Chatbot Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="btn-3d btn-3d-pink flex items-center gap-3 px-5 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center animate-spin-slow">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span>AI Assistant</span>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
        </button>
      </div>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 sm:w-[420px] max-w-[calc(100vw-3rem)] h-[540px] glass-panel rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20 animate-fade-in">
          {/* Header */}
          <div className="bg-black/80 px-6 py-4 border-b border-white/15 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-600 to-cyan-400 p-0.5 shadow-lg">
                <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
                  <Bot className="w-5 h-5 text-pink-400" />
                </div>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-sm">Advanced AI Assistant</h3>
                <p className="text-[10px] text-emerald-400 font-mono">● Online • 1,000 Tools Indexed</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-all border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-pink-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-lg ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium rounded-tr-none'
                      : 'bg-zinc-900/90 text-zinc-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                  {m.recommendedTools && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-white/10">
                      {m.recommendedTools.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => {
                            onSelectTool(t);
                            setIsOpen(false);
                          }}
                          className="flex items-center justify-between p-2 rounded-xl bg-black/60 hover:bg-pink-500/20 border border-white/10 cursor-pointer transition-all group"
                        >
                          <div className="truncate">
                            <p className="font-bold text-white group-hover:text-pink-300 truncate">{t.name}</p>
                            <p className="text-[10px] text-zinc-400 capitalize">{t.category}</p>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-pink-400 shrink-0 ml-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-cyan-400" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-black/90 border-t border-white/15 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI or search tools..."
              className="flex-1 bg-zinc-900 border border-white/15 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-pink-500 shadow-inner"
            />
            <button
              type="submit"
              className="btn-3d btn-3d-cyan px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
