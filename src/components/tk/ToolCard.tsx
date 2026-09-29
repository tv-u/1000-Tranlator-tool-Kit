import React from 'react';
import { ToolDefinition } from '../../lib/tools/types';
import { CATEGORIES } from '../../lib/tools/categories';
import { ArrowRight, Zap, Shield, Smartphone } from 'lucide-react';

interface ToolCardProps {
  tool: ToolDefinition;
  onSelect: (tool: ToolDefinition) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onSelect }) => {
  const categoryInfo = CATEGORIES.find((c) => c.id === tool.category);

  return (
    <div
      onClick={() => onSelect(tool)}
      className="glass-card group relative rounded-2xl p-5 cursor-pointer flex flex-col justify-between"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-pink-400 group-hover:bg-pink-500/10 transition-colors">
            {categoryInfo?.name || tool.category}
          </span>
          <div className="flex items-center gap-1.5 text-zinc-500">
            {tool.capabilities.privacyLocal && (
              <span title="Processed locally in browser">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
              </span>
            )}
            {tool.capabilities.mobile && (
              <span title="Mobile optimized">
                <Smartphone className="w-3.5 h-3.5 text-blue-400" />
              </span>
            )}
          </div>
        </div>

        <h3 className="font-bold text-white text-base mb-2 group-hover:text-pink-300 transition-colors flex items-center justify-between">
          <span>{tool.name}</span>
          <Zap className="w-4 h-4 text-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>

        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
          {tool.description}
        </p>
      </div>

      <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 group-hover:text-white transition-colors">
        <span className="font-mono text-[10px] text-zinc-400">/{tool.slug}</span>
        <span className="flex items-center gap-1 font-medium text-pink-400 group-hover:translate-x-1 transition-transform">
          <span>Launch Tool</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};
