import React from 'react';
import { ShieldCheck, Zap, Heart, Code2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-white/10 bg-black/90 py-12 px-4 lg:px-8 text-zinc-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-600 to-emerald-400 p-0.5">
              <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center">
                <Zap className="w-4 h-4 text-pink-400" />
              </div>
            </div>
            <span className="font-bold text-white tracking-wide">TRANSLATOR KIT</span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The high-velocity browser-side conversion and utility engine. Process text, PDFs, images, code, and cryptographic hashes securely with zero unnecessary server uploads.
          </p>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Client-Side Privacy Architecture</span>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Tool Categories</h4>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => onNavigate('category-text')} className="hover:text-pink-400 transition-colors">Text & Formatting</button></li>
            <li><button onClick={() => onNavigate('category-developer')} className="hover:text-pink-400 transition-colors">Developer Utilities</button></li>
            <li><button onClick={() => onNavigate('category-units')} className="hover:text-pink-400 transition-colors">Unit Converters</button></li>
            <li><button onClick={() => onNavigate('category-crypto')} className="hover:text-pink-400 transition-colors">Security & Crypto</button></li>
            <li><button onClick={() => onNavigate('category-image')} className="hover:text-pink-400 transition-colors">Image Processing</button></li>
          </ul>
        </div>

        {/* Legal & Pages */}
        <div>
          <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Engine & Legal</h4>
          <ul className="space-y-2.5 text-xs">
            <li><button onClick={() => onNavigate('about')} className="hover:text-pink-400 transition-colors">About Engine</button></li>
            <li><button onClick={() => onNavigate('privacy')} className="hover:text-pink-400 transition-colors">Privacy Policy</button></li>
            <li><button onClick={() => onNavigate('terms')} className="hover:text-pink-400 transition-colors">Terms of Service</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-pink-400 transition-colors">Contact & Feedback</button></li>
            <li><button onClick={() => onNavigate('status')} className="hover:text-pink-400 transition-colors">System Status</button></li>
          </ul>
        </div>

        {/* Trust & Architecture */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Production Engine</h4>
          <p className="text-xs text-zinc-400">
            Powered by Web Workers, Web Crypto API, HTML5 Canvas, and decentralized registry validation.
          </p>
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Code2 className="w-4 h-4 text-pink-500" />
            <span>Registry-Driven Architecture v2.4</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
        <p>© {new Date().getFullYear()} Translator Kit. All rights reserved.</p>
        <p className="flex items-center gap-1">
          Built with <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" /> for high-velocity web professionals.
        </p>
      </div>
    </footer>
  );
};
