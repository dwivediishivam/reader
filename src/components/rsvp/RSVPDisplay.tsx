'use client';

import { getORPIndex } from '@/lib/rsvp/word-timing';

interface RSVPDisplayProps {
  word: string;
  isCountdown: boolean;
  countdownValue: number;
}

export function RSVPDisplay({ word, isCountdown, countdownValue }: RSVPDisplayProps) {
  if (isCountdown) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-8xl md:text-9xl font-bold text-blue-400 animate-pulse">
          {countdownValue}
        </span>
      </div>
    );
  }

  if (!word) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-2xl text-gray-600">Press Space to start</span>
      </div>
    );
  }

  const orpIndex = getORPIndex(word);
  // Find actual character position accounting for leading punctuation
  const leadingPunct = word.match(/^[^a-zA-Z]*/)?.[0] ?? '';
  const actualOrpIndex = leadingPunct.length + orpIndex;

  const before = word.slice(0, actualOrpIndex);
  const orp = word[actualOrpIndex] ?? '';
  const after = word.slice(actualOrpIndex + 1);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        {/* Guide lines */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-4 w-px h-3 bg-gray-700" />
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 w-px h-3 bg-gray-700" />

        <span className="text-5xl md:text-7xl font-mono tracking-wider select-none">
          <span className="text-white">{before}</span>
          <span className="text-blue-400">{orp}</span>
          <span className="text-white">{after}</span>
        </span>
      </div>
    </div>
  );
}
