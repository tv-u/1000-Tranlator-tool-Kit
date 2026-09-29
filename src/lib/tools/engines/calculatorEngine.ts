import { ToolExecutionResult } from '../types';

export async function executeCalculatorEngine(engine: string, inputData: any, options: Record<string, any>): Promise<ToolExecutionResult> {
  const startTime = performance.now();
  const val = Number(inputData);

  try {
    let output = '';
    const meta: Record<string, any> = {};

    if (engine === 'calc-percentage') {
      const percent = Number(options.percent || 10);
      const res = (val * percent) / 100;
      output = `${percent}% of ${val} is ${res}`;
      meta.result = res;
    } else if (engine === 'calc-discount') {
      const discount = Number(options.discount || 20);
      const saved = (val * discount) / 100;
      const finalPrice = val - saved;
      output = JSON.stringify({ originalPrice: val, discountPercent: discount, amountSaved: saved, finalPrice }, null, 2);
    } else if (engine === 'calc-gst-vat') {
      const taxRate = Number(options.taxRate || 18);
      const taxAmount = (val * taxRate) / 100;
      const totalAmount = val + taxAmount;
      output = JSON.stringify({ netAmount: val, taxRatePercent: taxRate, taxAmount, totalAmount }, null, 2);
    } else if (engine === 'calc-bmi') {
      // inputData can be weight in kg, height in cm from options
      const heightCm = Number(options.height || 170);
      const heightM = heightCm / 100;
      const bmi = val / (heightM * heightM);
      let category = 'Normal weight';
      if (bmi < 18.5) category = 'Underweight';
      else if (bmi >= 25 && bmi < 30) category = 'Overweight';
      else if (bmi >= 30) category = 'Obese';

      output = JSON.stringify({ weightKg: val, heightCm, bmi: Number(bmi.toFixed(2)), category }, null, 2);
    } else {
      throw new Error(`Unknown calculator engine: ${engine}`);
    }

    const endTime = performance.now();
    return {
      success: true,
      output,
      outputType: engine.includes('discount') || engine.includes('gst') || engine.includes('bmi') ? 'json' : 'text',
      executionTimeMs: Math.round(endTime - startTime),
      metadata: meta,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Calculation failed',
    };
  }
}
