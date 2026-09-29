export type ToolCategory =
  | 'text'
  | 'developer'
  | 'units'
  | 'crypto'
  | 'image'
  | 'pdf'
  | 'spreadsheet'
  | 'qr'
  | 'calculator'
  | 'translation'
  | 'web'
  | 'files';

export type ExecutionMode = 'browser' | 'worker' | 'wasm' | 'hybrid';

export type ToolStatus = 'production' | 'beta' | 'experimental' | 'disabled';

export interface InputDefinition {
  type: 'text' | 'file' | 'number' | 'select' | 'boolean' | 'textarea' | 'color';
  name: string;
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  accept?: string;
  maxFiles?: number;
}

export interface OutputDefinition {
  type: 'text' | 'file' | 'json' | 'image' | 'html' | 'qr' | 'code';
  label: string;
}

export interface ToolOption {
  id: string;
  name: string;
  type: 'select' | 'boolean' | 'number' | 'text';
  label: string;
  defaultValue: any;
  options?: { label: string; value: string | number }[];
}

export interface ToolDefinition {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  engine: string;
  input: InputDefinition[];
  output: OutputDefinition[];
  execution: ExecutionMode;
  options?: ToolOption[];
  description: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  capabilities: {
    mobile: boolean;
    offline: boolean;
    batch: boolean;
    privacyLocal: boolean;
  };
  limits?: {
    maxFileSize?: number;
    maxFiles?: number;
  };
  status: ToolStatus;
  testId: string;
  icon?: string;
}

export interface ToolExecutionResult {
  success: boolean;
  output?: any;
  outputType?: 'text' | 'file' | 'json' | 'image' | 'html' | 'qr' | 'code';
  error?: string;
  executionTimeMs?: number;
  metadata?: Record<string, any>;
}
