import React from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';

interface AdSlotProps {
  placement?: 'top' | 'sidebar' | 'footer' | 'result';
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement = 'top' }) => {
  const adLinks = [
    'https://www.effectivecpmnetwork.com/x0wcj4zk?key=c2b46070b44982014166acafd6074c3d',
    'https://www.effectivecpmnetwork.com/sa8mca36sv?key=3711015d24018cf89ccb362976c4a2e0',
    'https://www.profitableratecpmnetwork.com/sa8mca36sv?key=3711015d24018cf89ccb362976c4a2e0',
    'https://www.profitableratecpmnetwork.com/x0wcj4zk?key=c2b46070b44982014166acafd6074c3d'
  ];

  const randomLink = adLinks[Math.floor(Math.random() * adLinks.length)];

  return (
    <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-zinc-900 via-[#161616] to-zinc-900 border border-white/10 relative overflow-hidden group shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 to-emerald-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white tracking-wide">Sponsored Utility & Recommended Engine</p>
            <p className="text-[11px] text-zinc-400">High-speed cloud conversion partners and trusted tools.</p>
          </div>
        </div>
        <a
          href={randomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-pink-600/20 transition-all"
        >
          <span>Access Sponsored Feature</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
