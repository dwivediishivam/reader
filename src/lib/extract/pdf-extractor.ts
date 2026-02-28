// Import the internal library directly to avoid pdf-parse's test file loading
// issue in the main index.js (which checks module.parent and tries to load a
// test PDF that doesn't exist in production builds).
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text.trim();
}
