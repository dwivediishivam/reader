import { TextDocument, Section } from './types';
import { detectSections } from './section-detector';

const AUTO_CHUNK_SIZE = 500;

export function parseText(raw: string): TextDocument {
  const cleaned = raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  const lines = cleaned.split('\n');
  const detectedSections = detectSections(cleaned);

  // Build word array and track paragraph/section boundaries
  const words: string[] = [];
  const paragraphBreaks = new Set<number>();
  const sectionBreaks = new Set<number>();

  // Map line indices to section heading line indices
  const sectionLineSet = new Set(detectedSections.map(s => s.lineIndex));

  let prevLineEmpty = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      prevLineEmpty = true;
      continue;
    }

    // If this line is a section heading, mark current word position as section break
    if (sectionLineSet.has(i) && words.length > 0) {
      sectionBreaks.add(words.length);
    }

    // If previous line was empty, mark paragraph break at prev word
    if (prevLineEmpty && words.length > 0) {
      paragraphBreaks.add(words.length - 1);
    }

    const lineWords = line.split(/\s+/).filter(w => w.length > 0);
    words.push(...lineWords);
    prevLineEmpty = false;
  }

  // Mark last word as paragraph end
  if (words.length > 0) {
    paragraphBreaks.add(words.length - 1);
  }

  // Build sections
  let sections: Section[];

  if (detectedSections.length > 0) {
    sections = buildSectionsFromDetected(words, detectedSections, lines, sectionBreaks);
  } else {
    // Auto-split into chunks
    sections = autoChunkSections(words);
  }

  return { raw: cleaned, words, sections, paragraphBreaks, sectionBreaks };
}

function buildSectionsFromDetected(
  words: string[],
  detected: { title: string; lineIndex: number }[],
  lines: string[],
  sectionBreaks: Set<number>
): Section[] {
  const breakIndices = Array.from(sectionBreaks).sort((a, b) => a - b);
  const sections: Section[] = [];

  // Add first section if content exists before first heading
  if (breakIndices.length > 0 && breakIndices[0] > 0) {
    sections.push({
      title: 'Introduction',
      startIndex: 0,
      endIndex: breakIndices[0] - 1,
      wordCount: breakIndices[0],
    });
  }

  for (let i = 0; i < detected.length; i++) {
    const start = i < breakIndices.length ? breakIndices[i] : 0;
    const end = i + 1 < breakIndices.length ? breakIndices[i + 1] - 1 : words.length - 1;
    sections.push({
      title: detected[i].title,
      startIndex: start,
      endIndex: end,
      wordCount: end - start + 1,
    });
  }

  // If no sections at all, make one big section
  if (sections.length === 0) {
    sections.push({
      title: 'Full Text',
      startIndex: 0,
      endIndex: words.length - 1,
      wordCount: words.length,
    });
  }

  return sections;
}

function autoChunkSections(words: string[]): Section[] {
  const sections: Section[] = [];
  for (let i = 0; i < words.length; i += AUTO_CHUNK_SIZE) {
    const end = Math.min(i + AUTO_CHUNK_SIZE - 1, words.length - 1);
    sections.push({
      title: `Section ${sections.length + 1}`,
      startIndex: i,
      endIndex: end,
      wordCount: end - i + 1,
    });
  }
  return sections;
}
