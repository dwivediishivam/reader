import { SpeedProfile } from '@/lib/text/types';

/**
 * Calculate WPM at a given word index using quadratic ease-in.
 * Starts gentle, accelerates faster over time.
 */
export function getWPMAtIndex(wordIndex: number, profile: SpeedProfile): number {
  const { startWPM, maxWPM, rampWords } = profile;
  if (wordIndex >= rampWords) return maxWPM;

  const progress = wordIndex / rampWords;
  // Quadratic ease-in: slow start, fast finish
  const easedProgress = progress * progress;
  return startWPM + (maxWPM - startWPM) * easedProgress;
}

/**
 * Convert WPM to milliseconds per word.
 */
export function wpmToMs(wpm: number): number {
  return 60000 / wpm;
}

/**
 * Get adjusted delay for a specific word based on punctuation and length.
 */
export function getWordDelay(
  word: string,
  baseMs: number,
  isParagraphEnd: boolean
): number {
  let delay = baseMs;

  // Sentence-ending punctuation: +40%
  if (/[.!?]$/.test(word)) {
    delay *= 1.4;
  }
  // Comma, semicolon, colon: +20%
  else if (/[,;:]$/.test(word)) {
    delay *= 1.2;
  }

  // Long words (8+ chars): +15%
  const cleanWord = word.replace(/[^a-zA-Z]/g, '');
  if (cleanWord.length >= 8) {
    delay *= 1.15;
  }

  // Paragraph end: additional 1.5x
  if (isParagraphEnd) {
    delay *= 1.5;
  }

  return delay;
}

/**
 * Find the ORP (Optimal Recognition Point) index in a word.
 * Roughly at 25-35% of word length, biased toward the start.
 */
export function getORPIndex(word: string): number {
  const clean = word.replace(/^[^a-zA-Z]*/, '');
  const len = clean.length;
  if (len <= 1) return 0;
  if (len <= 3) return 1;
  if (len <= 5) return 1;
  if (len <= 9) return 2;
  return 3;
}
