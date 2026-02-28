import { create } from 'zustand';
import { SpeedMode, TextDocument } from '@/lib/text/types';
import { parseText } from '@/lib/text/parser';
import { SPEED_PROFILES } from '@/lib/rsvp/speed-profiles';

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
  adjustWPM: (delta: number) => void;
  setStartIndex: (index: number) => void;
  reset: () => void;
}

function clampWPM(wpm: number): number {
  return Math.max(50, Math.min(2000, Math.round(wpm)));
}

export const useReaderStore = create<ReaderStore>((set) => ({
  rawText: '',
  document: null,
  sourceType: null,
  speedMode: 'medium',
  targetWPM: SPEED_PROFILES.medium.maxWPM,
  startIndex: 0,

  setText: (text, source) => {
    const document = parseText(text);
    set({ rawText: text, document, sourceType: source });
  },

  setSpeedMode: (mode) => set({
    speedMode: mode,
    targetWPM: SPEED_PROFILES[mode].maxWPM,
  }),

  setTargetWPM: (wpm) => set({ targetWPM: clampWPM(wpm) }),

  adjustWPM: (delta) => set((state) => ({
    targetWPM: clampWPM(state.targetWPM + delta),
  })),

  setStartIndex: (index) => set({ startIndex: index }),

  reset: () => set({
    rawText: '',
    document: null,
    sourceType: null,
    speedMode: 'medium',
    targetWPM: SPEED_PROFILES.medium.maxWPM,
    startIndex: 0,
  }),
}));
