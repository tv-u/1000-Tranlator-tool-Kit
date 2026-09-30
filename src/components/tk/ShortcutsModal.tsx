import React, { useEffect } from 'react';
import { X, Command, Sparkles, Download, Upload, Zap } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportFavorites: () => void;
  onImportFavorites: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalOps: number;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({
  isOpen,
  onClose,
  onExportFavorites,
  onImportFavorites,
  totalOps,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
              <Command className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Power-User Keyboard & Backup</h2>
              <p className="text-xs text-zinc-400">Advanced shortcuts & session telemetry</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-wider text-pink-400">Keyboard Shortcuts</p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/10">
              <span className="text-zinc-300">Open Spotlight Search</span>
              <kbd className="font-mono bg-zinc-900 px-2 py-1 rounded border border-white/20 text-cyan-300 font-bold">⌘K / Ctrl+K</kbd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/10">
              <span className="text-zinc-300">Close Modals / Exit</span>
              <kbd className="font-mono bg-zinc-900 px-2 py-1 rounded border border-white/25 text-rose-300 font-bold">Escape</kbd>
            </div>
          </div>
        </div>

        {/* Favorites Backup */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Favorites Backup & Sync</p>
          <div className="flex items-center gap-3">
            <button
              onClick={onExportFavorites}
              className="btn-3d btn-3d-emerald flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export Favorites JSON</span>
            </button>
            <label className="btn-3d btn-3d-cyan flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import Favorites</span>
              <input type="file" accept=".json" onChange={onImportFavorites} className="hidden" />
            </label>
          </div>
        </div>

        {/* Session telemetry */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 font-bold text-amber-300">
            <Zap className="w-4 h-4" />
            Total Session Operations Executed:
          </span>
          <span className="font-mono bg-zinc-900 px-3 py-1 rounded-xl border border-white/20 text-white font-black text-sm">
            {totalOps}
          </span>
        </div>
      </div>
    </div>
  );
};
