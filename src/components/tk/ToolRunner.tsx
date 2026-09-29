import React, { useState } from 'react';
import { ToolDefinition, ToolExecutionResult } from '../../lib/tools/types';
import { executeTool } from '../../lib/tools/registry';
import { ArrowLeft, Play, Copy, Check, Download, RefreshCw, Shield, Zap, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

interface ToolRunnerProps {
  tool: ToolDefinition;
  onBack: () => void;
}

export const ToolRunner: React.FC<ToolRunnerProps> = ({ tool, onBack }) => {
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white px-3 py-2 rounded-xl bg-[#161616] border border-white/10 hover:border-pink-500/50 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-pink-500" />
          <span>Back to Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
            {tool.category}
          </span>
          {tool.capabilities.privacyLocal && (
            <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5" />
              <span>Local Privacy</span>
            </span>
          )}
        </div>
      </div>

      {/* Tool Header Card */}
      <div className="bg-[#161616] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight flex items-center gap-3">
          <Zap className="w-7 h-7 text-pink-500" />
          {tool.name}
        </h1>
        <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">{tool.description}</p>
      </div>

      {/* Input & Options Form */}
      <div className="bg-[#161616] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-pink-500" />
          <span>Input Configuration</span>
        </h2>

        {/* Primary Input */}
        {tool.input.map((inp, idx) => (
          <div key={idx} className="space-y-2">
            <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider">{inp.label}</label>

            {inp.type === 'textarea' && (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={6}
                placeholder={inp.placeholder || 'Enter input...'}
                className="w-full bg-black/60 border border-white/10 focus:border-pink-500 rounded-2xl p-4 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all resize-y"
              />
            )}

            {inp.type === 'text' && (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inp.placeholder || ''}
                className="w-full bg-black/60 border border-white/10 focus:border-pink-500 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
              />
            )}

            {inp.type === 'number' && (
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full bg-black/60 border border-white/10 focus:border-pink-500 rounded-xl px-4 py-3 text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
              />
            )}

            {inp.type === 'file' && (
              <div className="border-2 border-dashed border-white/10 hover:border-pink-500/50 rounded-2xl p-8 text-center bg-black/40 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept={inp.accept}
                  onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag and drop file'}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      {selectedFile ? `${Math.round(selectedFile.size / 1024)} KB` : 'Secure local file processing'}
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
                <label className="block text-xs font-medium text-zinc-300">{opt.label}</label>
                {opt.type === 'select' && (
                  <select
                    value={options[opt.id]}
                    onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
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
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm font-mono focus:outline-none focus:border-pink-500"
                  />
                )}
                {opt.type === 'boolean' && (
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={options[opt.id]}
                      onChange={(e) => setOptions({ ...options, [opt.id]: e.target.checked })}
                      className="w-4 h-4 accent-pink-500 rounded bg-black"
                    />
                    <span className="text-xs text-zinc-300">Enable feature</span>
                  </label>
                )}
                {opt.type === 'text' && (
                  <input
                    type="text"
                    value={options[opt.id]}
                    onChange={(e) => setOptions({ ...options, [opt.id]: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-pink-500"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Run Button */}
        <button
          onClick={handleExecute}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-600 via-rose-600 to-emerald-500 hover:from-pink-500 hover:to-emerald-400 text-white font-bold text-base shadow-xl shadow-pink-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Processing Engine...</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              <span>Execute Tool Now</span>
            </>
          )}
        </button>
      </div>

      {/* Result Panel */}
      {result && (
        <div className="bg-[#161616] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              {result.success ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Execution Result</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-rose-500" />
                  <span>Execution Error</span>
                </>
              )}
            </h3>
            {result.executionTimeMs !== undefined && (
              <span className="text-xs font-mono text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                {result.executionTimeMs} ms
              </span>
            )}
          </div>

          {result.success ? (
            <div className="space-y-4">
              {result.outputType === 'image' ? (
                <div className="space-y-4 text-center">
                  <div className="bg-black/60 border border-white/10 rounded-2xl p-4 inline-block">
                    <img src={result.output} alt="Result" className="max-h-96 rounded-xl mx-auto shadow-lg" />
                  </div>
                  <div>
                    <a
                      href={result.output}
                      download={`output-${tool.slug}.${result.metadata?.format?.split('/')[1] || 'png'}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-semibold text-sm shadow-lg shadow-pink-600/30 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Processed File</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2))}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-white/10 transition-all shadow"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <pre className="bg-black/80 border border-white/10 rounded-2xl p-5 text-emerald-300 font-mono text-xs sm:text-sm overflow-x-auto max-h-96 leading-relaxed">
                    {typeof result.output === 'string' ? result.output : JSON.stringify(result.output, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 text-rose-300 text-sm">
              <p className="font-semibold mb-1">Operation Failed</p>
              <p className="text-xs">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
