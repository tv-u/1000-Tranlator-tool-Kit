import { ToolExecutionResult } from '../types';

export async function executeDeveloperEngine(engine: string, inputData: any, options: Record<string, any>): Promise<ToolExecutionResult> {
  const startTime = performance.now();
  const text = typeof inputData === 'string' ? inputData : String(inputData || '');

  try {
    let output = '';
    switch (engine) {
      case 'dev-uuid-gen':
        const count = Math.min(Math.max(Number(options.count || 1), 1), 100);
        const uuids = Array.from({ length: count }, () => crypto.randomUUID());
        output = uuids.join('\n');
        break;
      case 'dev-base64-encode':
        output = btoa(unescape(encodeURIComponent(text)));
        break;
      case 'dev-base64-decode':
        output = decodeURIComponent(escape(atob(text)));
        break;
      case 'dev-url-encode':
        output = encodeURIComponent(text);
        break;
      case 'dev-url-decode':
        output = decodeURIComponent(text);
        break;
      case 'dev-jwt-decode':
        const parts = text.split('.');
        if (parts.length < 2) throw new Error('Invalid JWT format (must have at least header.payload)');
        const decodePart = (str: string) => {
          let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) base64 += '=';
          return JSON.parse(decodeURIComponent(escape(atob(base64))));
        };
        const header = decodePart(parts[0]);
        const payload = decodePart(parts[1]);
        output = JSON.stringify({ header, payload }, null, 2);
        break;
      case 'dev-timestamp-conv':
        if (!text.trim()) {
          const now = Date.now();
          output = JSON.stringify({ unixSeconds: Math.floor(now / 1000), unixMilliseconds: now, iso: new Date(now).toISOString() }, null, 2);
        } else if (!isNaN(Number(text.trim()))) {
          const num = Number(text.trim());
          const d = new Date(num > 10000000000 ? num : num * 1000);
          output = JSON.stringify({ unixSeconds: Math.floor(d.getTime() / 1000), unixMilliseconds: d.getTime(), iso: d.toISOString(), utc: d.toUTCString() }, null, 2);
        } else {
          const d = new Date(text.trim());
          if (isNaN(d.getTime())) throw new Error('Invalid date or timestamp');
          output = JSON.stringify({ unixSeconds: Math.floor(d.getTime() / 1000), unixMilliseconds: d.getTime(), iso: d.toISOString() }, null, 2);
        }
        break;
      case 'dev-html-escape':
        output = text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        break;
      case 'dev-html-unescape':
        output = text
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#039;/g, "'");
        break;
      default:
        throw new Error(`Unknown developer engine action: ${engine}`);
    }

    const endTime = performance.now();
    return {
      success: true,
      output,
      outputType: engine.includes('jwt') || engine.includes('timestamp') ? 'json' : 'text',
      executionTimeMs: Math.round(endTime - startTime),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Developer utility failed',
      executionTimeMs: 0,
    };
  }
}
