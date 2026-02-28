'use client';

import { useState, useEffect, useCallback } from 'react';
import { SpeedMode } from '@/lib/text/types';
import { SpeedModeSelector } from './SpeedModeSelector';

interface RSVPControlsProps {
  isPlaying: boolean;
  speedMode: SpeedMode;
  targetWPM: number;
  onTogglePlayPause: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onSpeedModeChange: (mode: SpeedMode) => void;
  onTargetWPMChange: (wpm: number) => void;
  onAdjustTargetWPM: (delta: number) => void;
  onExit: () => void;
  onRestart: () => void;
}

export function RSVPControls({
  isPlaying,
  speedMode,
  targetWPM,
  onTogglePlayPause,
  onSkipBackward,
  onSkipForward,
  onSpeedModeChange,
  onTargetWPMChange,
  onAdjustTargetWPM,
  onExit,
  onRestart,
}: RSVPControlsProps) {
  const [visible, setVisible] = useState(true);
  const [hideTimer, setHideTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [wpmInput, setWpmInput] = useState(String(targetWPM));

  // Keep wpmInput in sync with targetWPM
  useEffect(() => {
    setWpmInput(String(targetWPM));
  }, [targetWPM]);

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

  const handleWpmSubmit = () => {
    const val = parseInt(wpmInput, 10);
    if (!isNaN(val) && val >= 50 && val <= 1500) {
      onTargetWPMChange(val);
    } else {
      setWpmInput(String(targetWPM));
    }
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 p-6 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center gap-3 max-w-2xl mx-auto">
        {/* WPM control row */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onAdjustTargetWPM(-50)}
            className="px-2 py-1 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            title="Decrease speed by 50 WPM (S/-)"
          >
            −50
          </button>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={wpmInput}
              onChange={(e) => setWpmInput(e.target.value)}
              onBlur={handleWpmSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleWpmSubmit()}
              className="w-20 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-center text-white text-sm font-mono focus:outline-none focus:border-blue-600"
              min={50}
              max={1500}
            />
            <span className="text-xs text-gray-500">WPM</span>
          </div>
          <button
            onClick={() => onAdjustTargetWPM(50)}
            className="px-2 py-1 text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded transition-colors"
            title="Increase speed by 50 WPM (W/+)"
          >
            +50
          </button>
        </div>

        {/* Main controls row */}
        <div className="flex items-center justify-between w-full">
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
              title="Skip back 5 seconds (←/A)"
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
              title="Skip forward 5 seconds (→/D)"
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
    </div>
  );
}
