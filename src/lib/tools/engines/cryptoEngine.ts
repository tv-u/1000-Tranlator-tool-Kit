import { ToolExecutionResult } from '../types';

export async function executeCryptoEngine(engine: string, inputData: any, options: Record<string, any>): Promise<ToolExecutionResult> {
  const startTime = performance.now();
  const text = typeof inputData === 'string' ? inputData : String(inputData || '');

  try {
    let output = '';
    if (engine === 'crypto-hash-sha256' || engine === 'crypto-hash-sha512') {
      const encoder = new TextEncoder();
      const data = encoder.encode(text);
      const algorithm = engine.includes('sha512') ? 'SHA-512' : 'SHA-256';
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      output = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } else if (engine === 'crypto-password-gen') {
      const length = Math.min(Math.max(Number(options.length || 16), 6), 128);
      const useUpper = options.uppercase !== false;
      const useLower = options.lowercase !== false;
      const useNums = options.numbers !== false;
      const useSymbols = options.symbols !== false;

      let chars = '';
      if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
      if (useNums) chars += '0123456789';
      if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
      if (!chars) chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

      const array = new Uint32Array(length);
      crypto.getRandomValues(array);
      output = Array.from(array, (num) => chars[num % chars.length]).join('');
    } else {
      throw new Error(`Unknown crypto engine: ${engine}`);
    }

    const endTime = performance.now();
    return {
      success: true,
      output,
      executionTimeMs: Math.round(endTime - startTime),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Crypto operation failed',
    };
  }
}
