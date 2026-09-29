import { ToolCategory } from './types';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  description: string;
  iconName: string;
  color: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'text',
    name: 'Text & Formatting',
    description: 'Transform, clean, format, analyze, and manipulate strings and text blocks instantly.',
    iconName: 'FileText',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'developer',
    name: 'Developer Utilities',
    description: 'JSON formatters, minifiers, UUID generators, JWT decoders, regex testers, and encoders.',
    iconName: 'Code',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 'units',
    name: 'Unit Converters',
    description: 'Convert length, weight, temperature, data storage, speed, time, energy, and pressure.',
    iconName: 'Ruler',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 'crypto',
    name: 'Security & Crypto',
    description: 'Generate secure passwords, SHA-256/512 hashes, base64 data, and checksums in-browser.',
    iconName: 'ShieldCheck',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'image',
    name: 'Image Processing',
    description: 'Resize, crop, rotate, compress, convert formats (PNG, JPG, WebP), and apply filters.',
    iconName: 'Image',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'pdf',
    name: 'PDF & Documents',
    description: 'Extract text and images from PDFs, merge, split, analyze metadata, and convert to images.',
    iconName: 'FileCheck',
    color: 'from-red-500 to-orange-500',
  },
  {
    id: 'spreadsheet',
    name: 'Spreadsheets & Data',
    description: 'Convert CSV to JSON, JSON to CSV, parse TSV, clean table columns, and format data.',
    iconName: 'Table',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'qr',
    name: 'QR Codes & Barcodes',
    description: 'Generate high-res QR codes for URLs, WiFi, vCards, text, and email with custom styling.',
    iconName: 'QrCode',
    color: 'from-violet-500 to-purple-500',
  },
  {
    id: 'calculator',
    name: 'Calculators & Finance',
    description: 'Calculate percentages, discounts, GST/VAT, loans, EMI, compound interest, and health metrics.',
    iconName: 'Calculator',
    color: 'from-yellow-500 to-amber-500',
  },
  {
    id: 'translation',
    name: 'Translation & Transliteration',
    description: 'Multi-language text translation, script transliteration (Cyrillic, Arabic, Latin, Morse).',
    iconName: 'Languages',
    color: 'from-fuchsia-500 to-pink-600',
  },
  {
    id: 'web',
    name: 'Web & Network',
    description: 'Parse URLs, inspect HTTP headers, encode/decode URI components, and test MIME types.',
    iconName: 'Globe',
    color: 'from-sky-400 to-blue-600',
  },
  {
    id: 'files',
    name: 'File Utilities',
    description: 'Inspect file metadata, generate ZIP archives, compute checksums, and sanitize filenames.',
    iconName: 'Archive',
    color: 'from-zinc-500 to-slate-700',
  },
];
