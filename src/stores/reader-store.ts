import { create } from 'zustand';
import { SpeedMode, TextDocument } from '@/lib/text/types';
import { parseText } from '@/lib/text/parser';
import { SPEED_PROFILES } from '@/lib/rsvp/speed-profiles';

export interface ReadHistoryEntry {
  id: string;
  title: string;
  wordsRead: number;
  totalWords: number;
  avgWPM: number;
  duration: number;
  completedAt: string;
  sourceType: 'paste' | 'url' | 'pdf';
}

interface ReaderStore {
  // Text data
  rawText: string;
  document: TextDocument | null;
  sourceType: 'paste' | 'url' | 'pdf' | null;

  // Reader state
  speedMode: SpeedMode;
  targetWPM: number;
  startIndex: number;

  // Actions
  setText: (text: string, source: 'paste' | 'url' | 'pdf') => void;
  setSpeedMode: (mode: SpeedMode) => void;
  setTargetWPM: (wpm: number) => void;
  adjustTargetWPM: (delta: number) => void;
  setStartIndex: (index: number) => void;
  reset: () => void;
}

const DEFAULT_TARGET_WPM = SPEED_PROFILES.medium.maxWPM;

export const useReaderStore = create<ReaderStore>((set) => ({
  rawText: '',
  document: null,
  sourceType: null,
  speedMode: 'medium',
  targetWPM: DEFAULT_TARGET_WPM,
  startIndex: 0,

  setText: (text, source) => {
    const document = parseText(text);
    set({ rawText: text, document, sourceType: source });
  },

  setSpeedMode: (mode) => set({
    speedMode: mode,
    targetWPM: SPEED_PROFILES[mode].maxWPM,
  }),

  setTargetWPM: (wpm) => set({ targetWPM: Math.max(50, Math.min(1500, wpm)) }),

  adjustTargetWPM: (delta) => set((state) => ({
    targetWPM: Math.max(50, Math.min(1500, state.targetWPM + delta)),
  })),

  setStartIndex: (index) => set({ startIndex: index }),

  reset: () => set({
    rawText: '',
    document: null,
    sourceType: null,
    speedMode: 'medium',
    targetWPM: DEFAULT_TARGET_WPM,
    startIndex: 0,
  }),
}));
