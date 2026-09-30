import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { TOOLS_REGISTRY } from '../../lib/tools/registry';
import { ToolDefinition } from '../../lib/tools/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolDefinition) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTool }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle handled in App
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = TOOLS_REGISTRY.filter(
    (t) =>
      !query ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase()) ||
      t.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/15 flex items-center gap-3 bg-black/60">
          <Search className="w-5 h-5 text-pink-500" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tool name or category (e.g. PDF, SHA-256, OCR)..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-zinc-500"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-2 bg-black/40">
          {results.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 text-xs">No tools found matching your query.</div>
          ) : (
            results.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTool(t);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-zinc-900/80 hover:bg-pink-500/20 border border-white/10 cursor-pointer transition-all group"
              >
                <div>
                  <p className="font-extrabold text-white text-xs group-hover:text-pink-300">{t.name}</p>
                  <p className="text-[10px] text-zinc-400 capitalize mt-0.5">{t.category} • {t.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-pink-400 shrink-0 ml-2" />
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-black/80 border-t border-white/10 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            Spotlight Command Palette (Press Esc to close)
          </span>
          <span className="font-mono bg-zinc-900 px-2 py-1 rounded border border-white/10">1,000 Tools Indexed</span>
        </div>
      </div>
    </div>
  );
};
