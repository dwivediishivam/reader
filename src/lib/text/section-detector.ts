const SECTION_PATTERNS = [
  /^chapter\s+\d+/i,
  /^chapter\s+[IVXLCDM]+/i,
  /^part\s+\d+/i,
  /^part\s+[IVXLCDM]+/i,
  /^#{1,3}\s+\S/,           // markdown headers
  /^\d+\.\s+[A-Z]/,         // numbered sections like "1. Introduction"
  /^[IVXLCDM]+\.\s+[A-Z]/, // Roman numeral sections
];

function isAllCapsLine(line: string): boolean {
  const trimmed = line.trim();
  if (trimmed.length < 3 || trimmed.length > 100) return false;
  const letters = trimmed.replace(/[^a-zA-Z]/g, '');
  if (letters.length < 3) return false;
  return letters === letters.toUpperCase();
}

function isSectionHeading(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (SECTION_PATTERNS.some(p => p.test(trimmed))) return true;
  if (isAllCapsLine(trimmed)) return true;
  return false;
}

export interface DetectedSection {
  title: string;
  lineIndex: number;
}

export function detectSections(text: string): DetectedSection[] {
  const lines = text.split('\n');
  const sections: DetectedSection[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (isSectionHeading(line)) {
      sections.push({ title: line.replace(/^#+\s*/, ''), lineIndex: i });
    }
  }

  return sections;
}
