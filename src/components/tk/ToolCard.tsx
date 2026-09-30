import React from 'react';
import { ToolDefinition } from '../../lib/tools/types';
import { CATEGORIES } from '../../lib/tools/categories';
import { ArrowRight, Zap, Shield, Smartphone } from 'lucide-react';
import { getTranslation } from '../../lib/i18n/translations';

interface ToolCardProps {
  tool: ToolDefinition;
  index: number;
  currentLang: string;
  onSelect: (tool: ToolDefinition) => void;
}

const SCREENSHOT_STYLES = [
  { border: 'border-rose-500/80', badgeBg: 'bg-rose-500/20', badgeText: 'text-rose-300', btn: 'btn-3d-pink' },
  { border: 'border-emerald-500/80', badgeBg: 'bg-emerald-500/20', badgeText: 'text-emerald-300', btn: 'btn-3d-emerald' },
  { border: 'border-purple-500/80', badgeBg: 'bg-purple-500/20', badgeText: 'text-purple-300', btn: 'btn-3d-purple' },
  { border: 'border-amber-500/80', badgeBg: 'bg-amber-500/20', badgeText: 'text-amber-300', btn: 'btn-3d-amber' },
  { border: 'border-cyan-500/80', badgeBg: 'bg-cyan-500/20', badgeText: 'text-cyan-300', btn: 'btn-3d-cyan' },
  { border: 'border-violet-500/80', badgeBg: 'bg-violet-500/20', badgeText: 'text-violet-300', btn: 'btn-3d-violet' },
  { border: 'border-blue-500/80', badgeBg: 'bg-blue-500/20', badgeText: 'text-blue-300', btn: 'btn-3d-blue' },
];

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index, currentLang, onSelect }) => {
  const categoryInfo = CATEGORIES.find((c) => c.id === tool.category);
  const style = SCREENSHOT_STYLES[index % SCREENSHOT_STYLES.length];
  const toolNum = `#${String(index + 1).padStart(3, '0')}`;

  return (
    <div
      onClick={() => onSelect(tool)}
      className={`glass-card group relative rounded-3xl p-6 cursor-pointer flex flex-col justify-between overflow-hidden border-2 ${style.border} transition-all duration-300 hover:scale-[1.02] shadow-2xl`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/40 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl ${style.badgeBg} flex items-center justify-center border border-white/20 shadow-inner`}>
              <Zap className={`w-4 h-4 ${style.badgeText} animate-pulse`} />
            </div>
            <span className={`text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full ${style.badgeBg} border border-white/25 ${style.badgeText} shadow-sm`}>
              {categoryInfo?.name || tool.category}
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-zinc-400 bg-black/60 px-2.5 py-1 rounded-xl border border-white/10 shadow-inner">
            {toolNum}
          </span>
        </div>

        <h3 className="font-black text-white text-lg mb-2.5 group-hover:text-pink-300 transition-colors leading-tight">
          {tool.name}
        </h3>

        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-5 font-normal">
          {tool.description}
        </p>
      </div>

      <div className="pt-4 border-t border-white/15 flex items-center justify-between">
        <span className="font-mono text-[10px] text-zinc-400 bg-black/50 px-2.5 py-1 rounded-lg border border-white/10">
          /{tool.slug}
        </span>
        <button className={`btn-3d ${style.btn} px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-xl`}>
          <span>{getTranslation(currentLang, 'launchButton')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
