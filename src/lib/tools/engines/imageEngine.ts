import { ToolExecutionResult } from '../types';

export async function executeImageEngine(engine: string, file: File | null, options: Record<string, any>): Promise<ToolExecutionResult> {
  const startTime = performance.now();
  if (!file || !(file instanceof File)) {
    return { success: false, error: 'Please provide a valid image file for processing.' };
  }

  try {
    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    const canvas = document.createElement('canvas');
    let width = img.width;
    let height = img.height;

    if (engine === 'image-resize') {
      const maxDim = Number(options.maxDimension || 800);
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not initialize canvas context');

    ctx.drawImage(img, 0, 0, width, height);

    if (engine === 'image-grayscale') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const avg = 0.3 * data[i] + 0.59 * data[i + 1] + 0.11 * data[i + 2];
        data[i] = avg;
        data[i + 1] = avg;
        data[i + 2] = avg;
      }
      ctx.putImageData(imgData, 0, 0);
    } else if (engine === 'image-invert') {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      ctx.putImageData(imgData, 0, 0);
    }

    let mimeType = file.type || 'image/png';
    if (options.format) {
      if (options.format === 'jpg' || options.format === 'jpeg') mimeType = 'image/jpeg';
      else if (options.format === 'png') mimeType = 'image/png';
      else if (options.format === 'webp') mimeType = 'image/webp';
    }

    const quality = options.quality ? Number(options.quality) / 100 : 0.9;
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const resBlob = await (await fetch(dataUrl)).blob();
    const resultFile = new File([resBlob], `processed-${file.name.replace(/\.[^/.]+$/, '')}.${mimeType.split('/')[1]}`, { type: mimeType });

    const endTime = performance.now();
    return {
      success: true,
      output: URL.createObjectURL(resultFile),
      outputType: 'image',
      executionTimeMs: Math.round(endTime - startTime),
      metadata: {
        originalSize: file.size,
        newSize: resBlob.size,
        width,
        height,
        format: mimeType,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Image processing failed',
    };
  }
}
