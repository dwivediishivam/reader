'use client';

import { useEffect, useState } from 'react';
import type { ReadHistoryEntry } from '@/stores/reader-store';

export function ReadHistory() {
  const [history, setHistory] = useState<ReadHistoryEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('readHistory');
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {
      // localStorage unavailable
    }
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('readHistory');
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className="mt-10 w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-gray-400">Read History</h2>
        <button
          onClick={clearHistory}
          className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
        >
          Clear
        </button>
      </div>
      <div className="space-y-2">
        {history.slice(0, 10).map((entry) => {
          const date = new Date(entry.completedAt);
          const mins = Math.floor(entry.duration / 60);
          const secs = entry.duration % 60;
          return (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 uppercase">
                  {entry.sourceType}
                </span>
                <span className="text-sm text-gray-300">
                  {entry.wordsRead.toLocaleString()} words
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{entry.avgWPM} WPM</span>
                <span>{mins}:{secs.toString().padStart(2, '0')}</span>
                <span>{date.toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
