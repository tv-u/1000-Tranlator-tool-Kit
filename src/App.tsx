import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/tk/Header';
import { Footer } from './components/tk/Footer';
import { ToolCard } from './components/tk/ToolCard';
import { ToolRunner } from './components/tk/ToolRunner';
import { AdSlot } from './components/tk/AdSlot';
import { AIChatbot } from './components/tk/AIChatbot';
import { CommandPalette } from './components/tk/CommandPalette';
import { ShortcutsModal } from './components/tk/ShortcutsModal';
import { TOOLS_REGISTRY } from './lib/tools/registry';
import { CATEGORIES } from './lib/tools/categories';
import { ToolDefinition, ToolCategory } from './lib/tools/types';
import { Search, Sparkles, ShieldCheck, Clock, ArrowRight, Star, Zap } from 'lucide-react';
import { getTranslation } from './lib/i18n/translations';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all' | 'favorites'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [favoriteTools, setFavoriteTools] = useState<string[]>([]);
  const [currentLang, setCurrentLang] = useState<string>('en');
  const [isCmdKOpen, setIsCmdKOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [totalOps, setTotalOps] = useState<number>(128);
  const pageSize = 24;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tk_recent_tools');
      if (saved) setRecentTools(JSON.parse(saved));
      const savedFavs = localStorage.getItem('tk_fav_tools');
      if (savedFavs) setFavoriteTools(JSON.parse(savedFavs));
      const savedLang = localStorage.getItem('tk_lang');
      if (savedLang) setCurrentLang(savedLang);
      const savedOps = localStorage.getItem('tk_total_ops');
      if (savedOps) setTotalOps(parseInt(savedOps, 10));
    } catch (e) {
      // ignore
    }

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdKOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    try {
      localStorage.setItem('tk_lang', lang);
    } catch (e) {
      // ignore
    }
  };

  const toggleFavorite = (slug: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let updated: string[];
    if (favoriteTools.includes(slug)) {
      updated = favoriteTools.filter((s) => s !== slug);
    } else {
      updated = [...favoriteTools, slug];
    }
    setFavoriteTools(updated);
    try {
      localStorage.setItem('tk_fav_tools', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const handleExportFavorites = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(favoriteTools, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "translator-kit-favorites.json");
    dlAnchorElem.click();
  };

  const handleImportFavorites = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            setFavoriteTools(parsed);
            localStorage.setItem('tk_fav_tools', JSON.stringify(parsed));
            alert('Favorites imported successfully!');
          }
        } catch (error) {
          alert('Invalid JSON backup file.');
        }
      };
    }
  };

  const incrementOps = () => {
    const next = totalOps + 1;
    setTotalOps(next);
    try {
      localStorage.setItem('tk_total_ops', next.toString());
    } catch (e) {
      // ignore
    }
  };

  const productionTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((t) => t.status === 'production');
  }, []);

  const filteredTools = useMemo(() => {
    return productionTools.filter((t) => {
      let matchesCategory = true;
      if (selectedCategory === 'favorites') {
        matchesCategory = favoriteTools.includes(t.slug);
      } else if (selectedCategory !== 'all') {
        matchesCategory = t.category === selectedCategory;
      }
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [productionTools, selectedCategory, searchQuery, favoriteTools]);

  const paginatedTools = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTools.slice(start, start + pageSize);
  }, [filteredTools, currentPage]);

  const totalPages = Math.ceil(filteredTools.length / pageSize);

  const handleNavigate = (route: string) => {
    if (route === 'home') {
      setSelectedTool(null);
      setSelectedCategory('all');
      setSearchQuery('');
      setCurrentPage(1);
      setCurrentRoute('home');
    } else if (route === 'search') {
      setIsCmdKOpen(true);
    } else {
      setCurrentRoute(route);
      setSelectedTool(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    setSelectedTool(tool);
    incrementOps();
    try {
      const updated = [tool.slug, ...recentTools.filter((s) => s !== tool.slug)].slice(0, 8);
      setRecentTools(updated);
      localStorage.setItem('tk_recent_tools', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const recentToolObjs = useMemo(() => {
    return recentTools.map((slug) => TOOLS_REGISTRY.find((t) => t.slug === slug)).filter(Boolean) as ToolDefinition[];
  }, [recentTools]);

  return (
    <div className="min-h-screen bg-[#030305] text-white flex flex-col font-sans selection:bg-pink-500 selection:text-white relative overflow-x-hidden">
      {/* Immersive 3D Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-pink-600/20 via-rose-600/10 to-emerald-500/15 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/2 right-10 w-[700px] h-[700px] bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-pink-600/15 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* Header */}
      <Header 
        onNavigate={handleNavigate} 
        productionToolCount={productionTools.length} 
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Top AdSlot */}
      <div className="max-w-7xl mx-auto px-4 w-full pt-4">
        <AdSlot placement="top" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedTool ? (
          <ToolRunner tool={selectedTool} currentLang={currentLang} onBack={() => setSelectedTool(null)} />
        ) : currentRoute === 'about' ? (
          <div className="max-w-4xl mx-auto py-16 px-4 space-y-8 animate-fade-in">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent">
              Enterprise Architecture & About
            </h1>
            <p className="text-zinc-300 leading-relaxed text-base">
              Translator Kit features 1,000 professional production tools across 50 world languages with zero latency, offline PWA support, batch processing, and 100% client-side privacy.
            </p>
            <div className="glass-panel rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>Zero-Dummy Architecture & Security Guarantee</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Every utility in Translator Kit executes securely within your browser sandbox.
              </p>
            </div>
            <AdSlot />
          </div>
        ) : (
          <div>
            {/* Hero Section */}
            <section className="relative py-24 px-4 text-center overflow-hidden border-b border-white/10">
              <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-400 text-xs font-bold uppercase tracking-wider shadow-xl shadow-pink-500/10">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>1,000 Tools Registered • {totalOps} Operations Executed</span>
                </div>

                <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white leading-[1.1]">
                  Online Translator, Converter, <br />
                  <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
                    Generator & File Tools
                  </span>
                </h1>

                <p className="text-zinc-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                  The definitive enterprise suite for PDFs, documents, images, OCR, text transformation, developer tools, cryptography, and financial calculators in 50 world languages.
                </p>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto relative pt-4">
                  <div className="relative flex items-center shadow-2xl shadow-pink-500/25 rounded-2xl overflow-hidden border border-white/20 bg-zinc-950/90 backdrop-blur-2xl">
                    <Search className="absolute left-5 w-5 h-5 text-pink-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      placeholder={getTranslation(currentLang, 'searchPlaceholder')}
                      className="w-full bg-transparent pl-14 pr-36 py-5 text-white text-base focus:outline-none placeholder-zinc-500"
                    />
                    <div className="absolute right-2 flex items-center gap-2">
                      <button
                        onClick={() => setIsCmdKOpen(true)}
                        className="hidden sm:flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-white/10 rounded-lg text-[10px] text-zinc-400 font-mono"
                      >
                        <span>⌘K</span>
                      </button>
                      <button
                        onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}
                        className="btn-3d btn-3d-pink px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5"
                      >
                        <span>Search</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Category Quick Pills + Favorites */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 scale-105'
                        : 'glass-card hover:bg-white/10 text-zinc-300 border border-white/10'
                    }`}
                  >
                    {getTranslation(currentLang, 'allTools')} ({productionTools.length})
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCategory('favorites');
                      setCurrentPage(1);
                    }}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      selectedCategory === 'favorites'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30 scale-105'
                        : 'glass-card hover:bg-white/10 text-zinc-300 border border-white/10'
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
                    <span>Favorites ({favoriteTools.length})</span>
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentPage(1);
                      }}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-600/30 scale-105'
                          : 'glass-card hover:bg-white/10 text-zinc-300 border border-white/10'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Tools Quick Access Bar */}
            {recentToolObjs.length > 0 && !searchQuery && selectedCategory === 'all' && (
              <section className="max-w-7xl mx-auto pt-10 px-4 lg:px-8">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-pink-500" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                    {getTranslation(currentLang, 'recentTools')}
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {recentToolObjs.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => handleSelectTool(t)}
                      className="glass-card p-3 rounded-xl cursor-pointer text-center hover:border-pink-500/50 transition-all truncate"
                    >
                      <p className="text-xs font-semibold text-white truncate">{t.name}</p>
                      <p className="text-[10px] text-zinc-400 capitalize mt-0.5">{t.category}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Middle AdSlot */}
            <div className="max-w-7xl mx-auto px-4">
              <AdSlot placement="sidebar" />
            </div>

            {/* Tools Grid Section */}
            <section className="max-w-7xl mx-auto py-12 px-4 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {searchQuery ? `Search Results for "${searchQuery}" (${filteredTools.length})` : selectedCategory === 'favorites' ? `Favorite Starred Tools (${filteredTools.length})` : selectedCategory === 'all' ? `All 1,000 Production Tools (${filteredTools.length})` : `${CATEGORIES.find((c) => c.id === selectedCategory)?.name} (${filteredTools.length})`}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    ⚡ {getTranslation(currentLang, 'activeLanguages')}
                  </span>
                </div>
              </div>

              {paginatedTools.length === 0 ? (
                <div className="text-center py-20 text-zinc-500">
                  {selectedCategory === 'favorites' ? 'No favorite tools starred yet. Click the star icon on any tool card to pin it here!' : 'No tools found matching your query.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedTools.map((tool, idx) => {
                    const globalIdx = (currentPage - 1) * pageSize + idx;
                    const isFav = favoriteTools.includes(tool.slug);
                    return (
                      <div key={tool.id} className="relative group">
                        <ToolCard
                          tool={tool}
                          index={globalIdx}
                          currentLang={currentLang}
                          onSelect={handleSelectTool}
                        />
                        <button
                          onClick={(e) => toggleFavorite(tool.slug, e)}
                          className={`absolute top-4 right-4 z-20 p-2 rounded-xl backdrop-blur-md transition-all ${
                            isFav
                              ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/40'
                              : 'bg-black/60 text-zinc-400 hover:text-white border border-white/10'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-zinc-800 transition-all shadow"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-zinc-300 font-mono px-3 py-2 bg-black/60 rounded-xl border border-white/10">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs font-bold uppercase tracking-wider disabled:opacity-40 hover:bg-zinc-800 transition-all shadow"
                  >
                    Next
                  </button>
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer AdSlot */}
      <div className="max-w-7xl mx-auto px-4 w-full">
        <AdSlot placement="footer" />
      </div>

      {/* Spotlight Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCmdKOpen}
        onClose={() => setIsCmdKOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Shortcuts & Backup Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onExportFavorites={handleExportFavorites}
        onImportFavorites={handleImportFavorites}
        totalOps={totalOps}
      />

      {/* Advanced AI Chatbot */}
      <AIChatbot onSelectTool={handleSelectTool} />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
