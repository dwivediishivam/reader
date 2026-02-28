export type SpeedMode = 'low' | 'medium' | 'high' | 'ultra';

export interface SpeedProfile {
  mode: SpeedMode;
  startWPM: number;
  maxWPM: number;
  rampWords: number;
}

export interface Section {
  title: string;
  startIndex: number;
  endIndex: number;
  wordCount: number;
}

export interface TextDocument {
  raw: string;
  words: string[];
  sections: Section[];
  paragraphBreaks: Set<number>; // word indices where paragraphs end
  sectionBreaks: Set<number>;  // word indices where sections start
}

export interface RSVPState {
  isPlaying: boolean;
  currentIndex: number;
  currentWord: string;
  speedMode: SpeedMode;
  currentWPM: number;
  targetWPM: number;
  totalWords: number;
  startTime: number | null;
  elapsedTime: number;
  wordsRead: number;
  isCountdown: boolean;
  countdownValue: number;
  isSectionBreak: boolean;
  currentSection: number;
  totalSections: number;
  isComplete: boolean;
}

export interface HistoryEntry {
  id: string;
  title: string;
  sourceType: 'paste' | 'url' | 'pdf';
  wordCount: number;
  avgWPM: number;
  duration: number;
  completedAt: string;
}
