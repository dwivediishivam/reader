'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface RSVPControlsProps {
  isPlaying: boolean;
  targetWPM: number;
  onTogglePlayPause: () => void;
  onSkipBackward: () => void;
  onSkipForward: () => void;
  onAdjustWPM: (delta: number) => void;
  onSetWPM: (wpm: number) => void;
  onExit: () => void;
  onRestart: () => void;
}

export function RSVPControls({
  isPlaying,
  targetWPM,
  onTogglePlayPause,
  onSkipBackward,
  onSkipForward,
  onAdjustWPM,
  onSetWPM,
  onExit,
  onRestart,
}: RSVPControlsProps) {
  const [visible, setVisible] = useState(true);
  const [hideTimer, setHideTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [isEditingWPM, setIsEditingWPM] = useState(false);
  const [wpmInput, setWpmInput] = useState(String(targetWPM));
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!isEditingWPM) {
      setWpmInput(String(targetWPM));
    }
  }, [targetWPM, isEditingWPM]);

  const handleWPMSubmit = () => {
    const val = parseInt(wpmInput, 10);
    if (!isNaN(val) && val >= 50 && val <= 2000) {
      onSetWPM(val);
    } else {
      setWpmInput(String(targetWPM));
    }
    setIsEditingWPM(false);
  };

  return (
    <>
      {/* Persistent floating pause/play button - always visible */}
      <button
        onClick={onTogglePlayPause}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 p-4 bg-blue-600 hover:bg-blue-500 rounded-full transition-all shadow-lg shadow-blue-600/20"
        title="Play/Pause (Space)"
      >
        {isPlaying ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21" />
          </svg>
        )}
      </button>

      {/* Auto-hiding control bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-300 ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {/* Left: Exit / Restart */}
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

          {/* Center: Skip controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={onSkipBackward}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Skip back 5s (← / A)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="11,17 6,12 11,7" />
                <polyline points="18,17 13,12 18,7" />
              </svg>
            </button>

            <span className="text-xs text-gray-500 w-8 text-center">5s</span>

            <button
              onClick={onSkipForward}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Skip forward 5s (→ / D)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="13,17 18,12 13,7" />
                <polyline points="6,17 11,12 6,7" />
              </svg>
            </button>
          </div>

          {/* Right: WPM controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAdjustWPM(-50)}
              className="px-2 py-1 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              title="Decrease speed (S / -)"
            >
              -
            </button>

            {isEditingWPM ? (
              <input
                ref={inputRef}
                type="number"
                value={wpmInput}
                onChange={(e) => setWpmInput(e.target.value)}
                onBlur={handleWPMSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleWPMSubmit();
                  if (e.key === 'Escape') {
                    setWpmInput(String(targetWPM));
                    setIsEditingWPM(false);
                  }
                }}
                className="w-16 bg-gray-800 border border-gray-600 rounded px-1 py-0.5 text-center text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                min={50}
                max={2000}
                autoFocus
              />
            ) : (
              <button
                onClick={() => {
                  setIsEditingWPM(true);
                  setWpmInput(String(targetWPM));
                }}
                className="px-2 py-0.5 text-sm font-mono text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors cursor-text"
                title="Click to set custom WPM"
              >
                {targetWPM}
              </button>
            )}

            <button
              onClick={() => onAdjustWPM(50)}
              className="px-2 py-1 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors"
              title="Increase speed (W / +)"
            >
              +
            </button>

            <span className="text-xs text-gray-500 ml-1">WPM</span>
          </div>
        </div>
      </div>
    </>
  );
}
