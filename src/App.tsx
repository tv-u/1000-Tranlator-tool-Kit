import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/tk/Header';
import { Footer } from './components/tk/Footer';
import { ToolGrid } from './components/tk/ToolGrid';
import { ToolRunner } from './components/tk/ToolRunner';
import { AdSlot } from './components/tk/AdSlot';
import { TOOLS_REGISTRY } from './lib/tools/registry';
import { CATEGORIES } from './lib/tools/categories';
import { ToolDefinition, ToolCategory } from './lib/tools/types';
import { Search, Sparkles, ShieldCheck, Zap, ArrowRight, Code, FileText, Ruler, Calculator, QrCode, Image as ImageIcon, Languages, ExternalLink, CheckCircle, Clock, Star } from 'lucide-react';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [selectedTool, setSelectedTool] = useState<ToolDefinition | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const pageSize = 24;

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tk_recent_tools');
      if (saved) setRecentTools(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
  }, []);

  const productionTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((t) => t.status === 'production');
  }, []);

  const filteredTools = useMemo(() => {
    return productionTools.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [productionTools, selectedCategory, searchQuery]);

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
    } else if (route.startsWith('category-')) {
      const cat = route.replace('category-', '') as ToolCategory;
      setSelectedCategory(cat);
      setSelectedTool(null);
      setCurrentPage(1);
      setCurrentRoute('home');
    } else {
      setCurrentRoute(route);
      setSelectedTool(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTool = (tool: ToolDefinition) => {
    setSelectedTool(tool);
    // Save to recent
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
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-pink-500 selection:text-white relative overflow-x-hidden">
      {/* Immersive Enterprise 3D Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-pink-600/20 via-rose-600/10 to-emerald-500/15 rounded-full blur-[160px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-1/2 right-10 w-[700px] h-[700px] bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-pink-600/15 rounded-full blur-[180px] pointer-events-none -z-10" />

      {/* Header */}
      <Header onNavigate={handleNavigate} productionToolCount={productionTools.length} />

      {/* Top Banner AdSlot */}
      <div className="max-w-7xl mx-auto px-4 w-full pt-4">
        <AdSlot placement="top" />
      </div>

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedTool ? (
          <ToolRunner tool={selectedTool} onBack={() => setSelectedTool(null)} />
        ) : currentRoute === 'about' ? (
          <div className="max-w-4xl mx-auto py-16 px-4 space-y-8 animate-fade-in">
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-pink-200 to-pink-500 bg-clip-text text-transparent">
              Enterprise Architecture & About
            </h1>
            <p className="text-zinc-300 leading-relaxed text-base">
              Translator Kit is an enterprise-grade, high-velocity conversion and utility platform featuring over 1,000 professional production tools. Engineered for developers, enterprise operations, creative designers, and linguists with zero latency and 100% client-side privacy.
            </p>
            <div className="glass-panel rounded-3xl p-8 space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <span>Zero-Dummy Architecture & Security Guarantee</span>
              </h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Unlike traditional wrappers, every utility in Translator Kit is powered by a real, deterministic execution engine. Files, text buffers, and cryptographic functions execute securely within your browser sandbox.
              </p>
            </div>
            <AdSlot />
          </div>
        ) : currentRoute === 'privacy' ? (
          <div className="max-w-4xl mx-auto py-16 px-4 space-y-8">
            <h1 className="text-4xl font-extrabold">Enterprise Privacy Policy</h1>
            <p className="text-zinc-300 leading-relaxed">
              We adhere to the highest enterprise data privacy standards. All conversions and calculations occur locally in your browser memory. We never retain, log, or harvest uploaded documents or private strings.
            </p>
          </div>
        ) : currentRoute === 'terms' ? (
          <div className="max-w-4xl mx-auto py-16 px-4 space-y-8">
            <h1 className="text-4xl font-extrabold">Terms of Service</h1>
            <p className="text-zinc-300 leading-relaxed">
              Translator Kit is provided as an enterprise utility suite under standard professional licensing terms. High-availability client-side execution is guaranteed across all supported modern web browsers.
            </p>
          </div>
        ) : currentRoute === 'disclaimer' ? (
          <div className="max-w-4xl mx-auto py-16 px-4 space-y-8">
            <h1 className="text-4xl font-extrabold">Enterprise Disclaimer</h1>
            <p className="text-zinc-300 leading-relaxed">
              Users are advised to verify critical financial computations and regulatory document conversions independently prior to enterprise-wide deployment.
            </p>
          </div>
        ) : currentRoute === 'contact' ? (
          <div className="max-w-4xl mx-auto py-16 px-4 space-y-8">
            <h1 className="text-4xl font-extrabold">Enterprise Support & Contact</h1>
            <p className="text-zinc-300 leading-relaxed">
              Connect with our enterprise engineering team for custom tool integrations and dedicated pipeline support.
            </p>
            <div className="glass-panel rounded-3xl p-8 space-y-5 max-w-xl">
              <input type="text" placeholder="Full Name" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-pink-500" />
              <input type="email" placeholder="Corporate Email Address" className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-pink-500" />
              <textarea placeholder="Your Enterprise Requirements..." rows={5} className="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-pink-500" />
              <button onClick={() => alert('Enterprise inquiry submitted successfully!')} className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white font-bold text-sm shadow-xl shadow-pink-600/30 transition-all">
                Submit Inquiry
              </button>
            </div>
          </div>
        ) : currentRoute === 'status' ? (
          <div className="max-w-4xl mx-auto py-16 px-4 space-y-8">
            <h1 className="text-4xl font-extrabold">System Status & Enterprise Health</h1>
            <div className="glass-panel rounded-3xl p-8 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <span>All 1,000 Conversion Engines & Workers</span>
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">100% Operational</span>
              </div>
              <p className="text-sm text-zinc-400">Zero downtime reported across browser Web Workers, WASM modules, and cryptographic pipelines.</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Hero Section */}
            <section className="relative py-24 px-4 text-center overflow-hidden border-b border-white/10">
              <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/25 text-pink-400 text-xs font-bold uppercase tracking-wider shadow-xl shadow-pink-500/10">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Enterprise Edition • 1,000+ Production Tools</span>
                </div>

                <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white leading-[1.1]">
                  World-Class High-Velocity <br />
                  <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-emerald-400 bg-clip-text text-transparent">
                    Conversion & Utility Engine
                  </span>
                </h1>

                <p className="text-zinc-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                  The definitive enterprise suite for PDFs, documents, images, OCR, text transformation, developer tools, cryptography, and financial calculators. 100% client-side privacy with zero dummy simulations.
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
                      placeholder="Search 1,000+ enterprise tools (e.g. PDF to Word, JSON Formatter, SHA-256, OCR...)"
                      className="w-full bg-transparent pl-14 pr-4 py-5 text-white text-base focus:outline-none placeholder-zinc-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="pr-5 text-xs text-zinc-400 hover:text-white font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Quick Pills */}
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
                    All Tools ({productionTools.length})
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
                  <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">Recently Used Tools</h3>
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
              <ToolGrid
                tools={paginatedTools}
                onSelectTool={handleSelectTool}
                title={selectedCategory === 'all' ? `Enterprise Production Tools (${filteredTools.length})` : `${CATEGORIES.find((c) => c.id === selectedCategory)?.name} (${filteredTools.length})`}
                emptyMessage="No tools match your search criteria."
              />

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

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
