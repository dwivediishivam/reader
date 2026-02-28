'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useReaderStore } from '@/stores/reader-store';
import { addHistoryEntry } from '@/lib/history';

interface CompletionScreenProps {
  wordsRead: number;
  startTime: number | null;
  onRestart: () => void;
}

export function CompletionScreen({ wordsRead, startTime, onRestart }: CompletionScreenProps) {
  const router = useRouter();
  const { sourceType, rawText } = useReaderStore();
  const savedRef = useRef(false);

  const elapsed = startTime ? (Date.now() - startTime) / 1000 : 0;
  const minutes = Math.floor(elapsed / 60);
  const seconds = Math.floor(elapsed % 60);
  const avgWPM = elapsed > 0 ? Math.round(wordsRead / (elapsed / 60)) : 0;

  useEffect(() => {
    if (savedRef.current || wordsRead === 0) return;
    savedRef.current = true;

    const title = rawText.slice(0, 60).split('\n')[0].trim() || 'Untitled';
    addHistoryEntry({
      title,
      sourceType: sourceType ?? 'paste',
      wordCount: wordsRead,
      avgWPM,
      duration: Math.round(elapsed),
    });
  }, [wordsRead, avgWPM, elapsed, rawText, sourceType]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0B] z-20">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
        Reading Complete
      </h2>

      <div className="grid grid-cols-3 gap-8 mb-12">
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-400">{wordsRead.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Words Read</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-400">
            {minutes}:{seconds.toString().padStart(2, '0')}
          </p>
          <p className="text-sm text-gray-500 mt-1">Time</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-bold text-blue-400">{avgWPM}</p>
          <p className="text-sm text-gray-500 mt-1">Avg WPM</p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Read Again
        </button>
        <button
          onClick={() => router.push('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          New Text
        </button>
      </div>
    </div>
  );
}
