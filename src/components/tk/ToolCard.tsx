import React from 'react';
import { ToolDefinition } from '../../lib/tools/types';
import { CATEGORIES } from '../../lib/tools/categories';
import { ArrowRight, Zap } from 'lucide-react';
import { getTranslation } from '../../lib/i18n/translations';

interface ToolCardProps {
  tool: ToolDefinition;
  index: number;
  currentLang: string;
  onSelect: (tool: ToolDefinition) => void;
}

const SCREENSHOT_STYLES = [
  { border: 'border-pink-500/90', badgeBg: 'bg-pink-500/20', badgeText: 'text-pink-300', btn: 'btn-3d-pink', nameGradient: 'from-pink-400 via-rose-300 to-amber-300' },
  { border: 'border-emerald-500/90', badgeBg: 'bg-emerald-500/20', badgeText: 'text-emerald-300', btn: 'btn-3d-emerald', nameGradient: 'from-emerald-400 via-teal-300 to-cyan-300' },
  { border: 'border-cyan-500/90', badgeBg: 'bg-cyan-500/20', badgeText: 'text-cyan-300', btn: 'btn-3d-cyan', nameGradient: 'from-cyan-400 via-blue-300 to-purple-300' },
  { border: 'border-amber-500/90', badgeBg: 'bg-amber-500/20', badgeText: 'text-amber-300', btn: 'btn-3d-amber', nameGradient: 'from-amber-400 via-yellow-300 to-rose-300' },
  { border: 'border-purple-500/90', badgeBg: 'bg-purple-500/20', badgeText: 'text-purple-300', btn: 'btn-3d-purple', nameGradient: 'from-purple-400 via-indigo-300 to-pink-300' },
  { border: 'border-blue-500/90', badgeBg: 'bg-blue-500/20', badgeText: 'text-blue-300', btn: 'btn-3d-blue', nameGradient: 'from-blue-400 via-cyan-300 to-emerald-300' },
  { border: 'border-rose-500/90', badgeBg: 'bg-rose-500/20', badgeText: 'text-rose-300', btn: 'btn-3d-pink', nameGradient: 'from-rose-400 via-pink-300 to-yellow-300' },
];

export const ToolCard: React.FC<ToolCardProps> = ({ tool, index, currentLang, onSelect }) => {
  const categoryInfo = CATEGORIES.find((c) => c.id === tool.category);
  const style = SCREENSHOT_STYLES[index % SCREENSHOT_STYLES.length];
  const toolNum = `#${String(index + 1).padStart(3, '0')}`;

  return (
    <div
      onClick={() => onSelect(tool)}
      className={`glass-card group relative rounded-3xl p-6 cursor-pointer flex flex-col justify-between overflow-hidden border-2 ${style.border} transition-all duration-300 hover:scale-[1.03] shadow-2xl hover:shadow-pink-500/20`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/50 pointer-events-none" />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-2xl ${style.badgeBg} flex items-center justify-center border border-white/30 shadow-inner`}>
              <Zap className={`w-4 h-4 ${style.badgeText} animate-pulse`} />
            </div>
            <span className={`text-xs font-black tracking-wider uppercase px-3.5 py-1.5 rounded-full ${style.badgeBg} border border-white/30 ${style.badgeText} shadow-md`}>
              {categoryInfo?.name || tool.category}
            </span>
          </div>
          <span className="font-mono text-xs font-black text-amber-300 bg-black/70 px-3 py-1 rounded-xl border border-white/20 shadow-inner">
            {toolNum}
          </span>
        </div>

        {/* HIGH-LIGHT SHOW Tool Name with Vivid Multi-Color Gradients */}
        <h3 className={`font-black text-xl mb-3 bg-gradient-to-r ${style.nameGradient} bg-clip-text text-transparent group-hover:scale-[1.01] transition-transform leading-tight drop-shadow-sm`}>
          {tool.name}
        </h3>

        <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed mb-5 font-medium">
          {tool.description}
        </p>
      </div>

      <div className="pt-4 border-t border-white/20 flex items-center justify-between">
        <span className="font-mono text-[10px] text-cyan-300 bg-black/60 px-3 py-1 rounded-lg border border-white/15">
          /{tool.slug}
        </span>
        <button className={`btn-3d ${style.btn} px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-2xl`}>
          <span>{getTranslation(currentLang, 'launchButton')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
