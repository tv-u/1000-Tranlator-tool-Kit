import React from 'react';
import { Wrench, Sparkles, Search, Shield, Zap } from 'lucide-react';

interface HeaderProps {
  onNavigate: (route: string) => void;
  productionToolCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, productionToolCount }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/85 border-b border-white/10 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-600 via-rose-500 to-emerald-400 p-0.5 shadow-lg shadow-pink-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-pink-400 group-hover:text-emerald-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent">
                TRANSLATOR KIT
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                {productionToolCount} Tools
              </span>
            </div>
            <p className="text-xs text-zinc-400 hidden sm:block">High-Velocity Conversion & Utility Engine</p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('search')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 text-sm transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-pink-500" />
            <span className="hidden md:inline">Quick Search...</span>
            <kbd className="hidden md:inline text-[10px] bg-black px-1.5 py-0.5 rounded border border-white/10 text-zinc-400">⌘K</kbd>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Privacy First</span>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-medium text-sm shadow-lg shadow-pink-600/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Engine</span>
          </button>
        </div>
      </div>
    </header>
  );
};
