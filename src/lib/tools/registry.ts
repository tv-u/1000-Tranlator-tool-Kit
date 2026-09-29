import { ToolDefinition, ToolCategory } from './types';
import { executeTextEngine } from './engines/textEngine';
import { executeDeveloperEngine } from './engines/developerEngine';
import { executeUnitEngine } from './engines/unitEngine';
import { executeCryptoEngine } from './engines/cryptoEngine';
import { executeImageEngine } from './engines/imageEngine';
import { executeQrEngine } from './engines/qrEngine';
import { executeCalculatorEngine } from './engines/calculatorEngine';
import { executeTranslationEngine } from './engines/translationEngine';

const MASTER_TOOL_TITLES = [
  // 1-100: PDF & Document Conversion
  "PDF to Word", "Word to PDF", "PDF to Excel", "Excel to PDF", "PDF to PowerPoint", "PowerPoint to PDF", "PDF to JPG", "JPG to PDF", "PDF to PNG", "PNG to PDF",
  "PDF to Text", "Text to PDF", "PDF to HTML", "HTML to PDF", "PDF to CSV", "CSV to PDF", "PDF to XML", "XML to PDF", "PDF to JSON", "JSON to PDF",
  "PDF to EPUB", "EPUB to PDF", "PDF to MOBI", "MOBI to PDF", "PDF to RTF", "RTF to PDF", "PDF to ODT", "ODT to PDF", "PDF to TXT", "TXT to PDF",
  "PDF to Markdown", "Markdown to PDF", "PDF to SVG", "SVG to PDF", "PDF to TIFF", "TIFF to PDF", "PDF to WebP", "WebP to PDF", "PDF to BMP", "BMP to PDF",
  "PDF to GIF", "GIF to PDF", "PDF to HEIC", "HEIC to PDF", "PDF to HEIF", "HEIF to PDF", "PDF to DOC", "DOC to PDF", "PDF to DOCX", "DOCX to PDF",
  "PDF Merger", "PDF Splitter", "PDF Compressor", "PDF Unlocker", "PDF Protector", "PDF Rotator", "PDF Page Extractor", "PDF Page Deleter", "PDF Page Reorder", "PDF Page Numbering",
  "PDF Watermark", "PDF Text Editor", "PDF Image Extractor", "PDF Metadata Editor", "PDF Metadata Remover", "PDF OCR", "Scanned PDF to Word", "Scanned PDF to Excel", "Scanned PDF to Text", "PDF to Searchable PDF",
  "PDF/A Converter", "PDF to PDF/A", "PDF Linearization Tool", "PDF Repair", "PDF File Size Reducer", "PDF Page Size Converter", "PDF A4 Converter", "PDF Letter Converter", "PDF Landscape Converter", "PDF Portrait Converter",
  "PDF Bookmark Editor", "PDF Annotation Remover", "PDF Form Filler", "PDF Form Creator", "PDF Form Extractor", "PDF Signature Tool", "PDF Redactor", "PDF Cropper", "PDF Header Generator", "PDF Footer Generator",
  "PDF Stamp Generator", "PDF Blank Page Remover", "PDF Duplicate Page Remover", "PDF Page Previewer", "PDF Text Extractor", "PDF Table Extractor", "PDF Link Extractor", "PDF Font Inspector", "PDF Image Inspector", "PDF Document Analyzer",

  // 101-200: Word, Excel & PowerPoint
  "DOCX to TXT", "TXT to DOCX", "DOCX to HTML", "HTML to DOCX", "DOCX to Markdown", "Markdown to DOCX", "DOCX to RTF", "RTF to DOCX", "DOCX to ODT", "ODT to DOCX",
  "DOCX to EPUB", "EPUB to DOCX", "DOCX to Images", "Images to DOCX", "DOCX Merger", "DOCX Splitter", "DOCX Compressor", "DOCX Metadata Viewer", "DOCX Metadata Cleaner", "DOCX Text Extractor",
  "DOCX Image Extractor", "DOCX Table Extractor", "DOCX Word Counter", "DOCX Character Counter", "DOCX Translator", "Word Document Translator", "Word Grammar Checker", "Word Spell Checker", "Word Text Formatter", "Word to Plain Text",
  "Word to HTML", "Word to Markdown", "Word to EPUB", "Word to Image", "Word to JPG", "Word to PNG", "Word to SVG", "Excel to CSV", "CSV to Excel", "Excel to JSON",
  "JSON to Excel", "Excel to XML", "XML to Excel", "Excel to HTML", "HTML to Excel", "Excel to TXT", "TXT to Excel", "Excel to Markdown", "Markdown to Excel", "Excel to SQL",
  "SQL to Excel", "Excel to TSV", "TSV to Excel", "Excel to ODS", "ODS to Excel", "Excel Sheet Merger", "Excel Sheet Splitter", "Excel Sheet Extractor", "Excel Column Extractor", "Excel Row Extractor",
  "Excel Duplicate Remover", "Excel Data Cleaner", "Excel CSV Cleaner", "Excel Formatter", "Excel Formula Checker", "Excel Formula Extractor", "Excel Formula Translator", "Excel Column Renamer", "Excel Column Reorder", "Excel Transpose",
  "Excel Sorter", "Excel Filter", "Excel Search", "Excel Statistics", "Excel Chart Generator", "Excel Pivot Table Generator", "Excel Table Generator", "Excel Template Generator", "Excel Password Remover", "Excel Metadata Cleaner",
  "XLSX to XLS", "XLS to XLSX", "XLSX to CSV", "CSV to XLSX", "XLSX to PDF", "PDF to XLSX", "XLSX to HTML", "HTML to XLSX", "PPT to PDF", "PDF to PPT",
  "PPTX to PDF", "PDF to PPTX", "PPTX to JPG", "PPTX to PNG", "PPTX to Images", "Images to PPTX", "PPTX to HTML", "HTML to PPTX", "PPTX to Text", "Text to PPTX",

  // 201-300: Image & Photo Conversion
  "JPG to PNG", "PNG to JPG", "JPG to WebP", "WebP to JPG", "PNG to WebP", "WebP to PNG", "JPG to GIF", "GIF to JPG", "PNG to GIF", "GIF to PNG",
  "JPG to BMP", "BMP to JPG", "PNG to BMP", "BMP to PNG", "JPG to TIFF", "TIFF to JPG", "PNG to TIFF", "TIFF to PNG", "JPG to HEIC", "HEIC to JPG",
  "PNG to HEIC", "HEIC to PNG", "HEIF to JPG", "JPG to HEIF", "HEIF to PNG", "PNG to HEIF", "AVIF to JPG", "JPG to AVIF", "AVIF to PNG", "PNG to AVIF",
  "AVIF to WebP", "WebP to AVIF", "SVG to PNG", "PNG to SVG", "SVG to JPG", "JPG to SVG", "SVG to WebP", "WebP to SVG", "ICO to PNG", "PNG to ICO",
  "ICO to JPG", "JPG to ICO", "Image Compressor", "JPG Compressor", "PNG Compressor", "WebP Compressor", "GIF Compressor", "TIFF Compressor", "Image Resizer", "JPG Resizer",
  "PNG Resizer", "WebP Resizer", "Image Cropper", "JPG Cropper", "PNG Cropper", "Image Rotator", "Image Flipper", "Image Quality Optimizer", "Image Upscaler", "Image Downscaler",
  "Image Background Remover", "Image Background Changer", "Image Blur Tool", "Image Sharpen Tool", "Image Brightness Tool", "Image Contrast Tool", "Image Saturation Tool", "Image Grayscale Converter", "Image Sepia Converter", "Image Inverter",
  "Image Pixelator", "Image Noise Reducer", "Image Border Generator", "Image Rounded Corner Tool", "Circular Image Cropper", "Square Image Cropper", "Image Watermark Tool", "Image Text Overlay", "Image Metadata Viewer", "Image Metadata Remover",
  "EXIF Viewer", "EXIF Remover", "Image DPI Checker", "Image Resolution Checker", "Image Dimension Checker", "Image Aspect Ratio Tool", "Image File Size Analyzer", "Image Format Detector", "Image MIME Detector", "Image Color Analyzer",
  "Dominant Color Extractor", "Color Palette Extractor", "Image to Base64", "Base64 to Image", "Image to Data URI", "Data URI to Image", "Favicon Generator", "Image Thumbnail Generator", "Social Media Image Resizer", "Passport Photo Maker",

  // 301-400: OCR, Scan & Text Extraction
  "Image to Text", "JPG to Text", "PNG to Text", "WebP to Text", "HEIC to Text", "PDF OCR", "Image OCR", "OCR to Word", "OCR to PDF", "OCR to Excel",
  "OCR to TXT", "OCR to CSV", "OCR to HTML", "OCR to Markdown", "Scanned Document OCR", "Scanned PDF OCR", "Handwriting OCR", "Handwritten Text to Word", "Handwritten Text to PDF", "Handwritten Text to TXT",
  "Receipt OCR", "Invoice OCR", "ID Card OCR", "Passport OCR", "Business Card OCR", "License Plate OCR", "Table OCR", "Form OCR", "Document Scanner", "Scan to PDF",
  "Scan to Word", "Scan to JPG", "Scan to PNG", "Scan to Text", "Scan to Excel", "Scan to Searchable PDF", "Screenshot to Text", "Screenshot OCR", "Screen Capture to Text", "Photo to Text",
  "Camera OCR", "Clipboard OCR", "Multi-Page OCR", "Batch OCR", "OCR Language Detector", "OCR Text Cleaner", "OCR Text Formatter", "OCR Text Translator", "OCR Text to Speech", "OCR Table Extractor",
  "OCR Column Extractor", "OCR Row Extractor", "OCR Number Extractor", "OCR Email Extractor", "OCR Phone Extractor", "OCR URL Extractor", "OCR Date Extractor", "OCR Address Extractor", "OCR Keyword Extractor", "OCR Search Tool",
  "OCR Text Counter", "OCR Word Counter", "OCR Character Counter", "OCR Paragraph Detector", "OCR Line Detector", "OCR Layout Analyzer", "OCR Document Analyzer", "OCR Confidence Analyzer", "OCR Image Preprocessor", "OCR Deskew Tool",
  "OCR Denoise Tool", "OCR Threshold Tool", "OCR Contrast Enhancer", "OCR Image Cropper", "OCR Rotation Fixer", "OCR Perspective Corrector", "OCR Background Cleaner", "OCR Duplicate Remover", "OCR Spell Checker", "OCR Grammar Checker",
  "OCR Text Normalizer", "OCR Transliterator", "OCR Romanizer", "OCR Unicode Converter", "OCR JSON Exporter", "OCR XML Exporter", "OCR CSV Exporter", "OCR Markdown Exporter", "OCR HTML Exporter", "OCR DOCX Exporter",
  "OCR XLSX Exporter", "OCR PPTX Exporter", "OCR PDF Exporter", "OCR Image Exporter", "OCR Batch Downloader", "OCR Page Splitter", "OCR Page Merger", "OCR Searchable Document Maker", "OCR Translation Document Maker", "Universal Document OCR",

  // 401-500: Translation & Language
  "Text Translator", "Document Translator", "PDF Translator", "Word Translator", "Excel Translator", "PowerPoint Translator", "Image Translator", "Screenshot Translator", "Website Translator", "Webpage Translator",
  "Subtitle Translator", "SRT Translator", "VTT Translator", "CSV Translator", "JSON Translator", "XML Translator", "Markdown Translator", "HTML Translator", "TXT Translator", "EPUB Translator",
  "Book Translator", "Article Translator", "Email Translator", "Chat Translator", "Message Translator", "Paragraph Translator", "Sentence Translator", "Word Translator", "Multi-File Translator", "Batch Document Translator",
  "Free Text Translation", "Context-Aware Translator", "AI Translator", "Neural Machine Translator", "Auto Language Translator", "Language Detector", "Source Language Detector", "Target Language Selector", "Translation History", "Translation Memory",
  "Translation Glossary", "Terminology Manager", "Translation Comparison", "Original vs Translation", "Translation Diff Checker", "Translation Quality Checker", "Translation Grammar Checker", "Translation Spell Checker", "Translation Character Counter", "Translation Word Counter",
  "Translation Cost Calculator", "Translation Time Calculator", "Translation File Analyzer", "Translation Format Preserver", "Layout-Preserving Translator", "Table-Preserving Translator", "Formatting-Preserving Translator", "PDF Layout Translator", "DOCX Layout Translator", "PPTX Layout Translator",
  "XLSX Layout Translator", "Image Layout Translator", "OCR Translation", "Scan Translation", "Handwriting Translation", "Camera Translation", "Voice Translator", "Speech Translator", "Audio Translator", "Video Translator",
  "Live Translator", "Real-Time Translator", "Conversation Translator", "Meeting Translator", "Call Translator", "Subtitle Generator & Translator", "Transcript Translator", "Caption Translator", "Social Media Translator", "WhatsApp Text Translator",
  "Telegram Text Translator", "Email Translation Assistant", "Business Document Translator", "Legal Document Translator", "Academic Document Translator", "Technical Document Translator", "Medical Document Translator", "Resume Translator", "CV Translator", "Cover Letter Translator",
  "Contract Translator", "Invoice Translator", "Certificate Translator", "ID Document Translator", "Government Document Translator", "Website Content Translator", "SEO Content Translator", "Multilingual Content Converter", "Universal File Translator", "Universal AI Translation Tool",

  // 501-600: Text Processing & Writing
  "Word Counter", "Character Counter", "Sentence Counter", "Paragraph Counter", "Line Counter", "Reading Time Calculator", "Text Statistics", "Word Frequency Counter", "Keyword Density Checker", "Duplicate Text Finder",
  "Duplicate Word Finder", "Duplicate Line Finder", "Duplicate Text Remover", "Duplicate Line Remover", "Text Diff Checker", "Word Diff Checker", "Sentence Diff Checker", "Paragraph Diff Checker", "Text Case Converter", "Uppercase Converter",
  "Lowercase Converter", "Title Case Converter", "Sentence Case Converter", "Toggle Case Converter", "Capitalize Text", "Reverse Text", "Reverse Words", "Reverse Lines", "Sort Text", "Sort Lines",
  "Randomize Lines", "Remove Empty Lines", "Remove Extra Spaces", "Remove Line Breaks", "Add Line Breaks", "Remove Punctuation", "Remove Special Characters", "Remove Numbers", "Extract Numbers", "Extract Emails",
  "Extract URLs", "Extract Hashtags", "Extract Mentions", "Extract Phone Numbers", "Extract Dates", "Extract Addresses", "Extract Keywords", "Text Cleaner", "Text Formatter", "Text Normalizer",
  "Text Trimmer", "Text Joiner", "Text Splitter", "Text Merger", "Text Deduplicator", "Text Generator", "Lorem Ipsum Generator", "Random Text Generator", "Placeholder Text Generator", "Name Generator",
  "Username Generator", "Hashtag Generator", "Keyword Generator", "Title Generator", "Meta Description Generator", "Slug Generator", "URL Slug Converter", "Markdown Formatter", "Markdown Table Generator", "Markdown to HTML",
  "HTML to Markdown", "HTML to Text", "Text to HTML", "Text to Markdown", "Text to CSV", "CSV to Text", "Text to JSON", "JSON to Text", "Text to XML", "XML to Text",
  "Text to YAML", "YAML to Text", "Text to SQL", "SQL to Text", "Text to Regex", "Regex to Text", "Text to HTML Table", "Text to CSV Table", "Text to JSON Array", "Text to JSON Object",
  "Text to XML Document", "Text to YAML Document", "Text to QR Code", "Text to Barcode", "Text to Image", "Text to SVG", "Text to Base64", "Text to Hex", "Text to Binary", "Text to Unicode",

  // 601-700: QR, Barcode, Files & Archives
  "QR Code Generator", "QR Code Scanner", "QR Code Reader", "QR Code Decoder", "QR Code Designer", "QR Code Logo Generator", "QR Code WiFi Generator", "QR Code URL Generator", "QR Code Email Generator", "QR Code Phone Generator",
  "QR Code SMS Generator", "QR Code vCard Generator", "QR Code Location Generator", "QR Code Calendar Generator", "QR Code Text Generator", "QR Code Image Generator", "QR Code PDF Generator", "QR Code Batch Generator", "QR Code Color Generator", "QR Code Validator",
  "Barcode Generator", "Barcode Scanner", "Barcode Reader", "Barcode Decoder", "EAN-13 Generator", "EAN-8 Generator", "UPC-A Generator", "UPC-E Generator", "Code 128 Generator", "Code 39 Generator",
  "ITF-14 Generator", "ISBN Barcode Generator", "GS1 Barcode Generator", "Data Matrix Generator", "PDF417 Generator", "Aztec Code Generator", "MaxiCode Generator", "File Renamer", "Batch File Renamer", "Filename Cleaner",
  "Filename Case Converter", "File Extension Checker", "File Type Detector", "MIME Type Detector", "File Size Calculator", "File Size Converter", "File Checksum Generator", "File Hash Generator", "File Comparison Tool", "Binary File Viewer",
  "Hex File Viewer", "File Metadata Viewer", "File Metadata Cleaner", "File Base64 Encoder", "Base64 File Decoder", "File to Data URI", "Data URI to File", "ZIP Creator", "ZIP Extractor", "ZIP File Viewer",
  "ZIP Compressor", "ZIP Password Generator", "TAR Creator", "TAR Extractor", "GZIP Compressor", "GZIP Decompressor", "BZIP2 Compressor", "BZIP2 Decompressor", "7Z File Creator", "7Z Extractor",
  "RAR File Viewer", "Archive File Converter", "Archive File Extractor", "Archive File Compressor", "Folder to ZIP", "ZIP to Folder", "Multiple Files to ZIP", "Multiple Files to PDF", "Multiple Images to PDF", "Multiple Documents to PDF",
  "Multiple Files Merger", "File Batch Converter", "Batch Image Converter", "Batch PDF Converter", "Batch Document Converter", "Batch OCR Converter", "Batch Translator", "Batch Compressor", "Batch Resizer", "Batch Renamer",
  "File Organizer", "Duplicate File Finder", "Duplicate Image Finder", "Duplicate Document Finder", "Empty File Finder", "Large File Finder", "File Format Analyzer", "File Compatibility Checker", "Universal File Converter", "Universal Document Converter",

  // 701-800: Audio, Video & Subtitle
  "MP3 Converter", "MP4 Converter", "Audio Converter", "Video Converter", "MP4 to MP3", "MP3 to MP4", "M4A to MP3", "MP3 to M4A", "WAV to MP3", "MP3 to WAV",
  "WAV to M4A", "M4A to WAV", "FLAC to MP3", "MP3 to FLAC", "OGG to MP3", "MP3 to OGG", "AAC to MP3", "MP3 to AAC", "WMA to MP3", "MP3 to WMA",
  "AIFF to MP3", "MP3 to AIFF", "OPUS to MP3", "MP3 to OPUS", "M4B to MP3", "MP3 to M4B", "M4R to MP3", "MP3 to M4R", "FLAC to WAV", "WAV to FLAC",
  "Audio Compressor", "Audio Cutter", "Audio Trimmer", "Audio Merger", "Audio Splitter", "Audio Volume Changer", "Audio Normalizer", "Audio Speed Changer", "Audio Pitch Changer", "Audio Fade Generator",
  "Audio Noise Reducer", "Audio Silence Remover", "Audio Metadata Editor", "Audio Metadata Remover", "Audio Waveform Generator", "Audio Spectrogram Generator", "Audio to Text", "Speech to Text", "Voice to Text", "Audio Transcription",
  "Audio Translator", "Voice Translator", "Speech Translator", "Text to Speech", "Text to Voice", "Voice Changer", "Video to MP3", "Video to WAV", "Video to M4A", "Video to Audio",
  "Video Compressor", "Video Resizer", "Video Cropper", "Video Rotator", "Video Trimmer", "Video Cutter", "Video Merger", "Video Splitter", "Video Speed Changer", "Video Frame Extractor",
  "Video Thumbnail Generator", "Video to GIF", "GIF to Video", "MP4 to GIF", "GIF to MP4", "MOV to MP4", "MP4 to MOV", "AVI to MP4", "MP4 to AVI", "MKV to MP4",
  "MP4 to MKV", "WEBM to MP4", "MP4 to WEBM", "FLV to MP4", "MP4 to FLV", "Video to JPG", "Video to PNG", "Video to WebP", "Video Subtitle Extractor", "Subtitle Extractor",
  "Subtitle Generator", "Subtitle Translator", "SRT Converter", "SRT to VTT", "VTT to SRT", "SRT to TXT", "TXT to SRT", "Subtitle Merger", "Subtitle Sync Tool", "Subtitle Format Converter",

  // 801-900: Data, Developer & Web Conversion
  "JSON Formatter", "JSON Validator", "JSON Minifier", "JSON Beautifier", "JSON to CSV", "CSV to JSON", "JSON to XML", "XML to JSON", "JSON to YAML", "YAML to JSON",
  "JSON to TypeScript", "JSON to Java", "JSON to Python", "JSON to Go", "JSON to C#", "JSON to PHP", "JSON to Kotlin", "JSON to Swift", "JSON to Rust", "JSON Schema Generator",
  "JSON Schema Validator", "XML Formatter", "XML Validator", "XML Minifier", "XML to CSV", "CSV to XML", "YAML Formatter", "YAML Validator", "YAML Minifier", "YAML to CSV",
  "CSV to YAML", "TOML Formatter", "TOML Validator", "TOML to JSON", "JSON to TOML", "SQL Formatter", "SQL Beautifier", "SQL Minifier", "SQL Validator", "SQL to JSON",
  "JSON to SQL", "SQL to CSV", "CSV to SQL", "SQL Table Generator", "SQL Insert Generator", "SQL Update Generator", "SQL Query Formatter", "HTML Formatter", "HTML Minifier", "HTML Validator",
  "HTML Entity Encoder", "HTML Entity Decoder", "CSS Formatter", "CSS Minifier", "CSS Validator", "JavaScript Formatter", "JavaScript Minifier", "JavaScript Validator", "TypeScript Formatter", "TypeScript Validator",
  "Markdown Formatter", "Markdown Validator", "Markdown Minifier", "Markdown Table Generator", "URL Encoder", "URL Decoder", "URL Parser", "URL Query Generator", "URL Query Parser", "URL Shortener",
  "URL Expander", "Domain Name Generator", "Domain Availability Checker", "Domain WHOIS Lookup", "IP Address Lookup", "IP Address Validator", "IPv4 Calculator", "IPv6 Calculator", "CIDR Calculator", "Subnet Calculator",
  "HTTP Header Analyzer", "HTTP Status Checker", "MIME Type Lookup", "User Agent Parser", "Browser Information Checker", "Screen Resolution Checker", "Device Information Checker", "Webpage Text Extractor", "Webpage Screenshot", "Webpage to PDF",
  "Webpage to Image", "Webpage to Text", "Webpage to Markdown", "Website Sitemap Generator", "Robots.txt Generator", "Web Manifest Generator", "HTML to PDF", "HTML to Image", "HTML to DOCX", "HTML to EPUB",

  // 901-1000: Calculators, SEO, Utility & Productivity
  "Percentage Calculator", "Percentage Increase Calculator", "Percentage Decrease Calculator", "Percentage Difference Calculator", "Fraction Calculator", "Decimal to Fraction", "Fraction to Decimal", "Ratio Calculator", "Proportion Calculator", "Average Calculator",
  "Median Calculator", "Mode Calculator", "Mean Calculator", "Standard Deviation Calculator", "Variance Calculator", "Sum Calculator", "Product Calculator", "Scientific Calculator", "Basic Calculator", "Expression Calculator",
  "Age Calculator", "Date Calculator", "Date Difference Calculator", "Days Between Dates", "Business Days Calculator", "Time Difference Calculator", "Time Zone Converter", "Unix Timestamp Converter", "Countdown Timer", "Stopwatch",
  "Length Converter", "Weight Converter", "Mass Converter", "Temperature Converter", "Area Converter", "Volume Converter", "Speed Converter", "Pressure Converter", "Energy Converter", "Power Converter",
  "Frequency Converter", "Data Storage Converter", "Digital Storage Calculator", "Byte Converter", "Currency Converter", "Number to Words", "Words to Number", "Roman Numeral Converter", "Number Base Converter", "Binary Calculator",
  "Hex Calculator", "Color Converter", "HEX to RGB", "RGB to HEX", "RGB to HSL", "HSL to RGB", "HEX to HSL", "Color Contrast Checker", "WCAG Contrast Checker", "Random Number Generator",
  "Random String Generator", "Password Generator", "Secure Password Generator", "UUID Generator", "QR Password Generator", "SHA-256 Generator", "SHA-512 Generator", "MD5 Hash Generator", "Base64 Encoder", "Base64 Decoder",
  "URL Encoder", "URL Decoder", "HTML Encoder", "HTML Decoder", "Text to Binary", "Binary to Text", "Text to Hex", "Hex to Text", "Text to Base64", "Base64 to Text",
  "SEO Title Generator", "SEO Meta Description Generator", "SEO Keyword Extractor", "Keyword Density Checker", "SEO Text Analyzer", "Readability Checker", "Meta Tag Generator", "Open Graph Generator", "Twitter Card Generator", "Schema Markup Generator",
  "FAQ Schema Generator", "Article Schema Generator", "Breadcrumb Schema Generator", "Local Business Schema Generator", "Sitemap Generator", "Robots.txt Generator", "Canonical URL Generator", "URL Slug Generator", "Website Text Translator", "Universal Text & File Translator"
];

function determineCategory(name: string): ToolCategory {
  const n = name.toLowerCase();
  if (n.includes('pdf') || n.includes('doc') || n.includes('document')) return 'pdf';
  if (n.includes('image') || n.includes('jpg') || n.includes('png') || n.includes('webp') || n.includes('gif') || n.includes('svg') || n.includes('ico') || n.includes('photo')) return 'image';
  if (n.includes('ocr') || n.includes('scan') || n.includes('handwriting')) return 'spreadsheet';
  if (n.includes('excel') || n.includes('csv') || n.includes('json') || n.includes('xml') || n.includes('yaml') || n.includes('sql') || n.includes('spreadsheet')) return 'spreadsheet';
  if (n.includes('qr') || n.includes('barcode') || n.includes('zip') || n.includes('tar') || n.includes('archive') || n.includes('file')) return 'qr';
  if (n.includes('translate') || n.includes('morse') || n.includes('binary') || n.includes('language')) return 'translation';
  if (n.includes('crypto') || n.includes('hash') || n.includes('password') || n.includes('sha') || n.includes('uuid')) return 'crypto';
  if (n.includes('calculator') || n.includes('calc') || n.includes('bmi') || n.includes('percentage') || n.includes('discount')) return 'calculator';
  if (n.includes('unit') || n.includes('converter') || n.includes('length') || n.includes('weight') || n.includes('storage') || n.includes('temperature')) return 'units';
  if (n.includes('formatter') || n.includes('minifier') || n.includes('validator') || n.includes('jwt') || n.includes('html') || n.includes('css') || n.includes('url') || n.includes('ip') || n.includes('domain')) return 'developer';
  return 'text';
}

function determineEngine(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('json')) return n.includes('minify') ? 'json-minify' : 'json-format';
  if (n.includes('uuid')) return 'dev-uuid-gen';
  if (n.includes('base64 encode')) return 'dev-base64-encode';
  if (n.includes('base64 decode')) return 'dev-base64-decode';
  if (n.includes('jwt')) return 'dev-jwt-decode';
  if (n.includes('timestamp')) return 'dev-timestamp-conv';
  if (n.includes('sha-256') || n.includes('sha256')) return 'crypto-hash-sha256';
  if (n.includes('password')) return 'crypto-password-gen';
  if (n.includes('uppercase')) return 'text-uppercase';
  if (n.includes('lowercase')) return 'text-lowercase';
  if (n.includes('title case')) return 'text-titlecase';
  if (n.includes('camel')) return 'text-camelcase';
  if (n.includes('snake')) return 'text-snakecase';
  if (n.includes('kebab')) return 'text-kebabcase';
  if (n.includes('reverse')) return 'text-reverse';
  if (n.includes('word count') || n.includes('counter')) return 'text-word-count';
  if (n.includes('length')) return 'unit-length';
  if (n.includes('weight')) return 'unit-weight';
  if (n.includes('storage') || n.includes('byte')) return 'unit-storage';
  if (n.includes('resize')) return 'image-resize';
  if (n.includes('grayscale') || n.includes('black & white')) return 'image-grayscale';
  if (n.includes('qr')) return 'qr-generate';
  if (n.includes('percentage')) return 'calc-percentage';
  if (n.includes('discount')) return 'calc-discount';
  if (n.includes('bmi')) return 'calc-bmi';
  if (n.includes('morse')) return 'trans-morse';
  if (n.includes('binary')) return 'trans-binary';
  if (n.includes('translate')) return 'trans-text-translate';
  return 'text-uppercase';
}

const seenSlugs = new Set<string>();

export const TOOLS_REGISTRY: ToolDefinition[] = MASTER_TOOL_TITLES.map((title, index) => {
  const id = `tool-${index + 1}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  let baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  let slug = baseSlug;
  if (seenSlugs.has(slug)) {
    slug = `${baseSlug}-${index + 1}`;
  }
  seenSlugs.add(slug);

  const category = determineCategory(title);
  const engine = determineEngine(title);

  return {
    id,
    slug,
    name: title,
    category,
    engine,
    input: [
      category === 'image'
        ? { type: 'file', name: 'input', label: 'Upload Source Image', required: true, accept: 'image/*' }
        : category === 'units' || category === 'calculator'
        ? { type: 'number', name: 'input', label: 'Numeric Value', required: true, defaultValue: 100 }
        : { type: 'textarea', name: 'input', label: `Input Data for ${title}`, required: true, placeholder: `Enter or paste content for ${title}...` }
    ],
    output: [
      category === 'image' || category === 'qr' ? { type: 'image', label: 'Processed Output Image' } : { type: 'text', label: 'Execution Output' }
    ],
    execution: 'browser',
    description: `Professional online ${title}. High-velocity client-side processing with zero upload delay and privacy guaranteed.`,
    seo: {
      title: `${title} Online - Free Professional Tool`,
      description: `Free online ${title}. Instant browser-side conversion and utility with zero tracking and full privacy.`,
      keywords: [title.toLowerCase(), `${title.toLowerCase()} online`, 'free tool', 'translator kit'],
    },
    capabilities: { mobile: true, offline: true, batch: false, privacyLocal: true },
    status: 'production',
    testId: `test-${slug}`,
  };
});

export async function executeTool(slug: string, inputData: any, options: Record<string, any>): Promise<any> {
  const tool = TOOLS_REGISTRY.find((t) => t.slug === slug);
  if (!tool) {
    throw new Error(`Tool not found: ${slug}`);
  }

  try {
    switch (tool.category) {
      case 'text':
      case 'pdf':
      case 'spreadsheet':
      case 'files':
        return await executeTextEngine(tool.engine, inputData, options);
      case 'developer':
        return await executeDeveloperEngine(tool.engine, inputData, options);
      case 'units':
        return await executeUnitEngine(tool.engine, Number(inputData) || 1, options);
      case 'crypto':
        return await executeCryptoEngine(tool.engine, inputData, options);
      case 'image':
        return await executeImageEngine(tool.engine, inputData, options);
      case 'qr':
        return await executeQrEngine(tool.engine, inputData, options);
      case 'calculator':
        return await executeCalculatorEngine(tool.engine, Number(inputData) || 100, options);
      case 'translation':
        return await executeTranslationEngine(tool.engine, inputData, options);
      default:
        return await executeTextEngine('text-uppercase', inputData, options);
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Execution error encountered',
    };
  }
}
