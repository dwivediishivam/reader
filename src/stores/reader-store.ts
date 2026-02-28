import { create } from 'zustand';
import { SpeedMode, TextDocument } from '@/lib/text/types';
import { parseText } from '@/lib/text/parser';

interface ReaderStore {
  // Text data
  rawText: string;
  document: TextDocument | null;
  sourceType: 'paste' | 'url' | 'pdf' | null;

  // Reader state
  speedMode: SpeedMode;
  startIndex: number;

  // Actions
  setText: (text: string, source: 'paste' | 'url' | 'pdf') => void;
  setSpeedMode: (mode: SpeedMode) => void;
  setStartIndex: (index: number) => void;
  reset: () => void;
}

export const useReaderStore = create<ReaderStore>((set) => ({
  rawText: '',
  document: null,
  sourceType: null,
  speedMode: 'medium',
  startIndex: 0,

  setText: (text, source) => {
    const document = parseText(text);
    set({ rawText: text, document, sourceType: source });
  },

  setSpeedMode: (mode) => set({ speedMode: mode }),
  setStartIndex: (index) => set({ startIndex: index }),

  reset: () => set({
    rawText: '',
    document: null,
    sourceType: null,
    speedMode: 'medium',
    startIndex: 0,
  }),
}));
