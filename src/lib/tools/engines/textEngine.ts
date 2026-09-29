import { ToolExecutionResult } from '../types';

export async function executeTextEngine(engine: string, inputData: any, options: Record<string, any>): Promise<ToolExecutionResult> {
  const startTime = performance.now();
  const text = typeof inputData === 'string' ? inputData : String(inputData || '');

  try {
    let output = '';
    switch (engine) {
      case 'text-uppercase':
        output = text.toUpperCase();
        break;
      case 'text-lowercase':
        output = text.toLowerCase();
        break;
      case 'text-titlecase':
        output = text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
        break;
      case 'text-sentencecase':
        output = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case 'text-camelcase':
        output = text
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
          .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
        break;
      case 'text-snakecase':
        output = text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map((w) => w.toLowerCase())
          .join('_');
        break;
      case 'text-kebabcase':
        output = text
          .replace(/\W+/g, ' ')
          .split(/ |\B(?=[A-Z])/)
          .map((w) => w.toLowerCase())
          .join('-');
        break;
      case 'text-reverse':
        output = text.split('').reverse().join('');
        break;
      case 'text-remove-whitespace':
        output = text.replace(/\s+/g, ' ').trim();
        break;
      case 'text-remove-duplicates':
        const lines = text.split(/\r?\n/);
        output = Array.from(new Set(lines)).join('\n');
        break;
      case 'text-word-count':
        const words = text.trim() ? text.trim().split(/\s+/) : [];
        const chars = text.length;
        const charsNoSpace = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(Boolean).length;
        const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;
        const readingTime = Math.ceil(words.length / 200); // ~200 wpm
        output = JSON.stringify(
          {
            words: words.length,
            characters: chars,
            charactersNoSpaces: charsNoSpace,
            sentences,
            paragraphs,
            estimatedReadingTimeMinutes: readingTime,
          },
          null,
          2
        );
        break;
      case 'json-format':
        try {
          const parsed = JSON.parse(text);
          const indent = options.indent ? Number(options.indent) : 2;
          output = JSON.stringify(parsed, null, indent);
        } catch (e: any) {
          throw new Error('Invalid JSON input: ' + e.message);
        }
        break;
      case 'json-minify':
        try {
          const parsed = JSON.parse(text);
          output = JSON.stringify(parsed);
        } catch (e: any) {
          throw new Error('Invalid JSON input: ' + e.message);
        }
        break;
      default:
        throw new Error(`Unknown text engine action: ${engine}`);
    }

    const endTime = performance.now();
    return {
      success: true,
      output,
      outputType: engine.includes('json') ? 'json' : 'text',
      executionTimeMs: Math.round(endTime - startTime),
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Text processing failed',
      executionTimeMs: 0,
    };
  }
}
