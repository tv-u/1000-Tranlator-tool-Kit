import React, { useState } from 'react';
import { ToolDefinition, ToolExecutionResult } from '../../lib/tools/types';
import { executeTool } from '../../lib/tools/registry';
import { ArrowLeft, Play, Copy, Check, Download, RefreshCw, Shield, Zap, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { getTranslation } from '../../lib/i18n/translations';

interface ToolRunnerProps {
  tool: ToolDefinition;
  currentLang: string;
  onBack: () => void;
}

export const ToolRunner: React.FC<ToolRunnerProps> = ({ tool, currentLang, onBack }) => {
  const [inputValue, setInputValue] = useState<any>(tool.input[0]?.defaultValue || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [options, setOptions] = useState<Record<string, any>>(() => {
    const defaults: Record<string, any> = {};
    tool.options?.forEach((opt) => {
      defaults[opt.id] = opt.defaultValue;
    });
    return defaults;
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleExecute = async () => {
    setLoading(true);
    setResult(null);
    try {
      const dataToProcess = tool.input[0]?.type === 'file' ? selectedFile : inputValue;
      const res = await executeTool(tool.slug, dataToProcess, options);
      setResult(res);
    } catch (err: any) {
      setResult({
        success: false,
        error: err.message || 'Execution failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = (content: string, filename: string, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4 animate-fade-in">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="btn-3d btn-3d-cyan flex items-center gap-2 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30 shadow-sm">
            {tool.category}
          </span>
          {tool.capabilities.privacyLocal && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/15 px-3.5 py-1.5 rounded-full border border-emerald-500/30 shadow-sm">
              <Shield className="w-3.5 h-3.5" />
              <span>100% Local Privacy</span>
            </span>
          )}
        </div>
      </div>

      {/* Tool Header Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden border border-white/15">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <h1 className="text-2xl sm:text-4xl font-black text-white mb-3 tracking-tight flex items-center gap-3">
          <Zap className="w-8 h-8 text-pink-400 animate-bounce" />
          {tool.name}
        </h1>
        <p className="text-zinc-300 text-base leading-relaxed max-w-2xl">{tool.description}</p>
      </div>

      {/* Input & Options Form */}
      <div className="glass-panel rounded-3xl p-6 sm:p-9 space-y-6 shadow-2xl border border-white/15">
        <h2 className="text-base font-extrabold text-white flex items-center gap-2 uppercase tracking-wide">
          <FileText className="w-5 h-5 text-pink-400" />
          <span>{getTranslation(currentLang, 'inputConfig')}</span>
        </h2>

        {/* Primary Input */}
        {tool.input.map((inp, idx) => (
          <div key={idx} className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">{inp.label}</label>

            {inp.type === 'textarea' && (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={6}
                placeholder={inp.placeholder || 'Enter input...'}
                className="w-full bg-black/70 border border-white/15 focus:border-pink-500 rounded-2xl p-4 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all resize-y shadow-inner"
              />
            )}

            {inp.type === 'text' && (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inp.placeholder || ''}
                className="w-full bg-black/70 border border-white/15 focus:border-pink-500 rounded-xl px-4 py-3.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all shadow-inner"
              />
            )}

            {inp.type === 'number' && (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-black/70 border border-white/15 focus:border-pink-500 rounded-xl px-4 py-3.5 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500/30 transition-all shadow-inner"
              />
            )}

            {inp.type === 'file' && (
              <div className="border-2 border-dashed border-white/20 hover:border-pink-500 rounded-2xl p-8 text-center bg-black/50 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  accept={inp.accept}
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400 group-hover:scale-110 transition-transform">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag & drop source file'}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : 'Instant browser-side processing • Zero upload delay'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Tool Options */}
        {tool.options && tool.options.length > 0 && (
          <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tool.options.map((opt) => (
              <div key={opt.id} className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wide">{opt.label}</label>
                {opt.type === 'select' && (
                  <select
                    value={options[opt.id]}
                    onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-3 text-white text-sm font-semibold focus:outline-none focus:border-pink-500 shadow-inner"
                  >
                    {opt.options?.map((o) => (
                      <option key={String(o.value)} value={o.value} className="bg-zinc-900 text-white">
                        {o.label}
                      </option>
                    ))}
                  </select>
                )}
                {opt.type === 'number' && (
                  <input
                    type="number"
                    value={options[opt.id]}
                    onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm font-mono focus:outline-none focus:border-pink-500 shadow-inner"
                  />
                )}
                {opt.type === 'boolean' && (
                  <label className="flex items-center gap-2.5 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={options[opt.id]}
                      onChange={(e) => setOptions({ ...options, [opt.id]: e.target.checked })}
                      className="w-5 h-5 accent-pink-500 rounded bg-black"
                    />
                    <span className="text-xs font-semibold text-zinc-300">Enable advanced feature</span>
                  </label>
                )}
                {opt.type === 'text' && (
                  <input
                    type="text"
                    value={options[opt.id]}
                    onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                    className="w-full bg-black/70 border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500 shadow-inner"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* 3D Colorful Execute Button */}
        <button
          onClick={handleExecute}
          disabled={loading}
          className="btn-3d btn-3d-pink w-full py-4.5 rounded-2xl font-black text-base tracking-wider uppercase flex items-center justify-center gap-3 shadow-2xl cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>{getTranslation(currentLang, 'processing')}</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>{getTranslation(currentLang, 'executeNow')}</span>
            </>
          )}
        </button>
      </div>

      {/* Result Panel with Copy & Download */}
      {result && (
        <div className="glass-panel rounded-3xl p-6 sm:p-9 space-y-6 shadow-2xl border border-white/15 animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2.5">
              {result.success ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span>{getTranslation(currentLang, 'executionResult')}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6 text-rose-500" />
                  <span>Execution Error</span>
                </>
              )}
            </h3>
            {result.executionTimeMs !== undefined && (
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/15 px-3.5 py-1.5 rounded-full border border-emerald-500/30">
                ⚡ {result.executionTimeMs} ms
              </span>
            )}
          </div>

          {result.success ? (
            <div className="space-y-4">
              {result.outputType === 'image' ? (
                <div className="space-y-4 text-center">
                  <div className="bg-black/70 border border-white/15 rounded-2xl p-4 inline-block shadow-2xl">
                    <img src={result.output} alt="Result" className="max-h-96 rounded-xl mx-auto shadow-lg" />
                  </div>
                  <div>
                    <a
                      href={result.output}
                      download={`output-${tool.slug}.${result.metadata?.format?.split('/')[1] || 'png'}`}
                      className="btn-3d btn-3d-emerald inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-extrabold text-sm tracking-wider uppercase shadow-xl"
                    >
                      <Download className="w-4 h-4" />
                      <span>{getTranslation(currentLang, 'downloadFile')}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-end gap-3">
                    <button
                      onClick={() => handleCopy(typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2))}
                      className="btn-3d btn-3d-purple flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? getTranslation(currentLang, 'copied') : getTranslation(currentLang, 'copyResult')}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadFile(typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2), `result-${tool.slug}.txt`, 'text/plain')}
                      className="btn-3d btn-3d-emerald flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>{getTranslation(currentLang, 'downloadFile')}</span>
                    </button>
                  </div>
                  <pre className="bg-black/90 border border-white/15 rounded-2xl p-5 text-emerald-300 font-mono text-xs sm:text-sm overflow-x-auto max-h-96 leading-relaxed shadow-inner">
                    {typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-5 text-rose-200 text-sm">
              <p className="font-extrabold mb-1">Operation Failed</p>
              <p className="text-xs">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
