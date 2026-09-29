import { ToolExecutionResult } from '../types';

export async function executeQrEngine(engine: string, inputData: any, options: Record<string, any>): Promise<ToolExecutionResult> {
  const startTime = performance.now();
  const text = typeof inputData === 'string' ? inputData : String(inputData || '');
  if (!text.trim()) {
    return { success: false, error: 'Please enter text or URL to generate QR code.' };
  }

  try {
    const size = Number(options.size || 300);
    const fgColor = options.fgColor || '#000000';
    const bgColor = options.bgColor || '#ffffff';

    // Using reliable public QR API generator or SVG canvas rendering for robust zero-dependency QR code generation
    const encodedText = encodeURIComponent(text);
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedText}&color=${fgColor.replace('#', '')}&bgcolor=${bgColor.replace('#', '')}`;

    const res = await fetch(qrApiUrl);
    if (!res.ok) throw new Error('Failed to generate QR code image from service');
    const blob = await res.blob();
    const outputUrl = URL.createObjectURL(blob);

    const endTime = performance.now();
    return {
      success: true,
      output: outputUrl,
      outputType: 'image',
      executionTimeMs: Math.round(endTime - startTime),
      metadata: { textLength: text.length, size },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'QR code generation failed',
    };
  }
}
