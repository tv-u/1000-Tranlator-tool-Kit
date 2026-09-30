import React, { useState, useEffect } from 'react';
import { Download, Sparkles, X, Cpu, CheckCircle } from 'lucide-react';

export const InstallPromptBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShowBanner(true), 1500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    } else {
      const dismissed = sessionStorage.getItem('tk_install_dismissed');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
      setShowBanner(false);
    } else {
      alert('To instantly install Translator Kit on your Mobile or PC Home Screen:\n\n• Mobile (Chrome/Safari): Tap the browser menu (⋮ or Share) and select "Add to Home Screen" or "Install App".\n• PC (Chrome/Edge): Click the install icon in your browser address bar.');
      setShowBanner(false);
    }
    sessionStorage.setItem('tk_install_dismissed', 'true');
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('tk_install_dismissed', 'true');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border-2 border-pink-500/90 rounded-3xl p-5 shadow-2xl shadow-pink-500/40 animate-bounce-short">
      <div className="absolute -top-3 -right-3 w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:bg-pink-500 transition-colors" onClick={handleDismiss}>
        <X className="w-4 h-4" />
      </div>

      <div className="flex items-start gap-4">
        {/* Best Premium Logo Emblem */}
        <div className="relative shrink-0">
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-rose-500 to-cyan-400 rounded-2xl blur-sm opacity-80 animate-pulse" />
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#121218] to-[#08080a] border border-white/25 p-0.5 flex items-center justify-center shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-cyan-500/30 rounded-[14px] flex items-center justify-center">
              <Cpu className="w-7 h-7 text-pink-400 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-pink-400 uppercase tracking-wider">Native App Mode</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          </div>
          <h3 className="text-sm font-black text-white leading-snug">Download Translator Kit</h3>
          <p className="text-[11px] text-zinc-300">Add to your PC or Mobile home screen with a single click for instant offline access.</p>
          
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="btn-3d btn-3d-pink flex-1 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home</span>
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold border border-white/10"
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
