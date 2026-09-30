import React from 'react';
import { Sparkles, Search, Globe, Zap, Cpu, Command } from 'lucide-react';
import { TOP_50_LANGUAGES } from '../../lib/tools/languages';
import { getTranslation } from '../../lib/i18n/translations';

interface HeaderProps {
  onNavigate: (route: string) => void;
  productionToolCount: number;
  currentLang: string;
  onLanguageChange: (lang: string) => void;
  onOpenShortcuts: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, productionToolCount, currentLang, onLanguageChange, onOpenShortcuts }) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-black/90 border-b border-white/15 px-4 lg:px-8 py-3.5 transition-all shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Premium Attractive Logo with Photo Emblem & Name */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          {/* Logo Emblem Photo / Icon Container */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-rose-500 to-cyan-400 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#121218] to-[#08080a] border border-white/20 p-0.5 flex items-center justify-center shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-cyan-500/20 rounded-[14px] flex items-center justify-center">
                <Cpu className="w-6 h-6 text-pink-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-wider bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent">
                {getTranslation(currentLang, 'brandName')}
              </span>
              <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 shadow-sm">
                {productionToolCount} Tools
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium hidden sm:block">
              {getTranslation(currentLang, 'subtitle')}
            </p>
          </div>
        </div>

        {/* Top 50 Languages Selector & Navigation Actions */}
        <div className="flex items-center gap-3">
          {/* Language Selector Dropdown */}
          <div className="relative flex items-center bg-zinc-900 border border-white/15 rounded-xl px-3 py-2 shadow-inner hover:border-pink-500/50 transition-all">
            <Globe className="w-4 h-4 text-cyan-400 mr-2 shrink-0 animate-spin-slow" />
            <select
              value={currentLang}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer pr-2"
            >
              {TOP_50_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-zinc-950 text-white">
                  {lang.native} ({lang.name})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onOpenShortcuts}
            className="p-2.5 bg-zinc-900 hover:bg-zinc-800 text-pink-400 border border-white/15 rounded-xl transition-all shadow-inner"
            title="Keyboard Shortcuts & Backup"
          >
            <Command className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('search')}
            className="hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-white/15 text-sm font-semibold transition-all shadow-inner"
          >
            <Search className="w-4 h-4 text-pink-400" />
            <span>Search 1,000 Tools...</span>
            <kbd className="text-[10px] bg-black px-1.5 py-0.5 rounded border border-white/20 text-zinc-400 font-mono">⌘K</kbd>
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="btn-3d btn-3d-pink flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl tracking-wide uppercase"
          >
            <Sparkles className="w-4 h-4" />
            <span>{getTranslation(currentLang, 'exploreButton')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
