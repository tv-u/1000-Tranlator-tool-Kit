import React from 'react';
import { ToolDefinition } from '../../lib/tools/types';
import { ToolCard } from './ToolCard';
import { Wrench } from 'lucide-react';

interface ToolGridProps {
  tools: ToolDefinition[];
  onSelectTool: (tool: ToolDefinition) => void;
  title?: string;
  emptyMessage?: string;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ tools, onSelectTool, title, emptyMessage }) => {
  if (tools.length === 0) {
    return (
      <div className="py-16 text-center bg-[#161616]/40 rounded-2xl border border-white/10 my-8">
        <Wrench className="w-12 h-12 text-zinc-600 mx-auto mb-3 animate-pulse" />
        <h3 className="text-white font-semibold mb-1">No tools found</h3>
        <p className="text-zinc-400 text-xs">{emptyMessage || 'Try searching for a different conversion or utility tool.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping" />
            {title}
          </h2>
          <span className="text-xs text-zinc-400 font-medium">{tools.length} available</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} onSelect={onSelectTool} />
        ))}
      </div>
    </div>
  );
};
