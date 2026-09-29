import { ToolExecutionResult } from '../types';

const lengthFactors: Record<string, number> = {
  meter: 1,
  kilometer: 1000,
  centimeter: 0.01,
  millimeter: 0.001,
  micrometer: 0.000001,
  nanometer: 0.000000001,
  mile: 1609.344,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254,
  nauticalMile: 1852,
};

const weightFactors: Record<string, number> = {
  kilogram: 1,
  gram: 0.001,
  milligram: 0.000001,
  metricTon: 1000,
  pound: 0.45359237,
  ounce: 0.028349523125,
  stone: 6.35029318,
};

const storageFactors: Record<string, number> = {
  byte: 1,
  kilobyte: 1024,
  megabyte: 1024 * 1024,
  gigabyte: 1024 * 1024 * 1024,
  terabyte: 1024 * 1024 * 1024 * 1024,
  petabyte: 1024 * 1024 * 1024 * 1024 * 1024,
};

export async function executeUnitEngine(engine: string, inputData: number, options: Record<string, any>): Promise<ToolExecutionResult> {
  const startTime = performance.now();
  const val = Number(inputData);
  if (isNaN(val)) {
    return { success: false, error: 'Please enter a valid numeric value for conversion' };
  }

  const fromUnit = options.from || Object.keys(lengthFactors)[0];
  const toUnit = options.to || Object.keys(lengthFactors)[1];

  try {
    let result = 0;
    if (engine === 'unit-length') {
      const baseValue = val * (lengthFactors[fromUnit] || 1);
      result = baseValue / (lengthFactors[toUnit] || 1);
    } else if (engine === 'unit-weight') {
      const baseValue = val * (weightFactors[fromUnit] || 1);
      result = baseValue / (weightFactors[toUnit] || 1);
    } else if (engine === 'unit-storage') {
      const baseValue = val * (storageFactors[fromUnit] || 1);
      result = baseValue / (storageFactors[toUnit] || 1);
    } else if (engine === 'unit-temperature') {
      // Temperature conversion
      let celsius = val;
      if (fromUnit === 'fahrenheit') celsius = (val - 32) * (5 / 9);
      else if (fromUnit === 'kelvin') celsius = val - 273.15;

      if (toUnit === 'celsius') result = celsius;
      else if (toUnit === 'fahrenheit') result = celsius * (9 / 5) + 32;
      else if (toUnit === 'kelvin') result = celsius + 273.15;
    } else {
      throw new Error(`Unknown unit engine: ${engine}`);
    }

    const endTime = performance.now();
    return {
      success: true,
      output: String(Number(result.toFixed(6))),
      executionTimeMs: Math.round(endTime - startTime),
      metadata: { input: val, from: fromUnit, to: toUnit, result },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Unit conversion failed',
    };
  }
}
