import { ToolExecutionResult } from '../types';

export async function executeTranslationEngine(engine: string, inputData: any, options: Record<string, any>): Promise<ToolExecutionResult> {
  const startTime = performance.now();
  const text = typeof inputData === 'string' ? inputData : String(inputData || '');

  try {
    let output = '';
    const targetLang = options.targetLang || 'es';

    if (engine === 'trans-morse') {
      const morseMap: Record<string, string> = {
        A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....',
        I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.',
        Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-',
        Y: '-.--', surtout: '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
        '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', ' ': '/'
      };
      output = text
        .toUpperCase()
        .split('')
        .map((char) => morseMap[char] || char)
        .join(' ');
    } else if (engine === 'trans-binary') {
      output = text
        .split('')
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');
    } else if (engine === 'trans-hex') {
      output = text
        .split('')
        .map((char) => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(' ');
    } else if (engine === 'trans-text-translate') {
      // Real robust multi-language translation via MyMemory API (free public translation API)
      const sourceLang = options.sourceLang || 'en';
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.responseData && data.responseData.translatedText) {
        output = data.responseData.translatedText;
      } else {
        throw new Error('Translation service returned invalid response.');
      }
    } else {
      throw new Error(`Unknown translation engine: ${engine}`);
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
      error: err.message || 'Translation/Transliteration failed',
    };
  }
}
