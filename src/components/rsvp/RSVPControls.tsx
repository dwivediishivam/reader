'use client';

import { useState, useEffect, useCallback } from 'react';
import { SpeedMode } from '@/lib/text/types';
import { SpeedModeSelector } from './SpeedModeSelector';

interface RSVPControlsProps {
  isPlaying: boolean;
  speedMode: SpeedMode;
  onTogglePlayPause: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onSpeedModeChange: (mode: SpeedMode) => void;
  onExit: () => void;
  onRestart: () => void;
}

export function RSVPControls({
  isPlaying,
  speedMode,
  onTogglePlayPause,
  onSkipBackward,
  onSkipForward,
  onSpeedModeChange,
  onExit,
  onRestart,
}: RSVPControlsProps) {
  const [visible, setVisible] = useState(true);
  const [hideTimer, setHideTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const resetHideTimer = useCallback(() => {
    setVisible(true);
    if (hideTimer) clearTimeout(hideTimer);
    if (isPlaying) {
      const t = setTimeout(() => setVisible(false), 2000);
      setHideTimer(t);
    }
  }, [isPlaying, hideTimer]);

  useEffect(() => {
    if (!isPlaying) {
      setVisible(true);
      if (hideTimer) clearTimeout(hideTimer);
    } else {
      const t = setTimeout(() => setVisible(false), 2000);
      setHideTimer(t);
      return () => clearTimeout(t);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handler = () => resetHideTimer();
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [resetHideTimer]);

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={onExit}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Exit
          </button>
          <button
            onClick={onRestart}
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Restart
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSkipBackward}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Skip back 5 words (←)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="11,17 6,12 11,7" />
              <polyline points="18,17 13,12 18,7" />
            </svg>
          </button>

          <button
            onClick={onTogglePlayPause}
            className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors"
            title="Play/Pause (Space)"
          >
            {isPlaying ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            )}
          </button>

          <button
            onClick={onSkipForward}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Skip forward 5 words (→)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="13,17 18,12 13,7" />
              <polyline points="6,17 11,12 6,7" />
            </svg>
          </button>
        </div>

        <SpeedModeSelector value={speedMode} onChange={onSpeedModeChange} compact />
      </div>
    </div>
  );
}
