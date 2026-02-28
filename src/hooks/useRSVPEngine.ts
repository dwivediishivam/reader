'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RSVPEngine } from '@/lib/rsvp/engine';
import { SpeedMode, TextDocument } from '@/lib/text/types';

interface RSVPEngineState {
  isPlaying: boolean;
  currentIndex: number;
  currentWord: string;
  currentWPM: number;
  isSectionBreak: boolean;
  currentSection: number;
  isComplete: boolean;
  isCountdown: boolean;
  countdownValue: number;
}

export function useRSVPEngine(
  document: TextDocument | null,
  speedMode: SpeedMode,
  startIndex: number,
  targetWPM: number
) {
  const engineRef = useRef<RSVPEngine | null>(null);
  const countdownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [state, setState] = useState<RSVPEngineState>({
    isPlaying: false,
    currentIndex: startIndex,
    currentWord: document?.words[startIndex] ?? '',
    currentWPM: 0,
    isSectionBreak: false,
    currentSection: 0,
    isComplete: false,
    isCountdown: false,
    countdownValue: 3,
  });

  const [startTime, setStartTime] = useState<number | null>(null);
  const [wordsRead, setWordsRead] = useState(0);

  // Initialize engine
  useEffect(() => {
    if (!document) return;

    const engine = new RSVPEngine(document, speedMode, startIndex, (update) => {
      setState(prev => ({
        ...prev,
        currentIndex: update.currentIndex,
        currentWord: update.currentWord,
        currentWPM: update.currentWPM,
        isSectionBreak: update.isSectionBreak,
        currentSection: update.currentSection,
        isComplete: update.isComplete,
        isPlaying: !update.isSectionBreak && !update.isComplete,
      }));

      if (update.isComplete || update.isSectionBreak) {
        // Engine paused itself
      }

      setWordsRead(engine.getWordsRead());
    });

    engineRef.current = engine;

    return () => {
      engine.stop();
    };
  }, [document, startIndex]); // intentionally not re-creating on speedMode change

  // Sync speed mode changes to engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setSpeedMode(speedMode);
    }
  }, [speedMode]);

  // Sync targetWPM to engine
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTargetWPM(targetWPM);
    }
  }, [targetWPM]);

  const startCountdown = useCallback(() => {
    setState(prev => ({ ...prev, isCountdown: true, countdownValue: 3 }));

    let count = 3;
    const tick = () => {
      count--;
      if (count > 0) {
        setState(prev => ({ ...prev, countdownValue: count }));
        countdownRef.current = setTimeout(tick, 700);
      } else {
        setState(prev => ({ ...prev, isCountdown: false, isPlaying: true }));
        setStartTime(prev => prev ?? Date.now());
        engineRef.current?.start();
      }
    };

    countdownRef.current = setTimeout(tick, 700);
  }, []);

  const play = useCallback(() => {
    if (!engineRef.current || state.isComplete) return;
    if (!startTime) {
      startCountdown();
    } else {
      setState(prev => ({ ...prev, isPlaying: true }));
      engineRef.current.start();
    }
  }, [state.isComplete, startTime, startCountdown]);

  const pause = useCallback(() => {
    engineRef.current?.pause();
    if (countdownRef.current) {
      clearTimeout(countdownRef.current);
      countdownRef.current = null;
    }
    setState(prev => ({ ...prev, isPlaying: false, isCountdown: false }));
  }, []);

  const togglePlayPause = useCallback(() => {
    if (state.isPlaying || state.isCountdown) {
      pause();
    } else {
      play();
    }
  }, [state.isPlaying, state.isCountdown, play, pause]);

  const skipForward = useCallback((seconds: number = 5) => {
    if (!engineRef.current || !document) return;
    const wordsToSkip = Math.round((state.currentWPM || targetWPM) * seconds / 60);
    const newIndex = Math.min(state.currentIndex + Math.max(wordsToSkip, 1), document.words.length - 1);
    engineRef.current.setIndex(newIndex);
    setState(prev => ({
      ...prev,
      currentIndex: newIndex,
      currentWord: document.words[newIndex],
    }));
  }, [state.currentIndex, state.currentWPM, targetWPM, document]);

  const skipBackward = useCallback((seconds: number = 5) => {
    if (!engineRef.current || !document) return;
    const wordsToSkip = Math.round((state.currentWPM || targetWPM) * seconds / 60);
    const newIndex = Math.max(state.currentIndex - Math.max(wordsToSkip, 1), 0);
    engineRef.current.setIndex(newIndex);
    setState(prev => ({
      ...prev,
      currentIndex: newIndex,
      currentWord: document.words[newIndex],
    }));
  }, [state.currentIndex, state.currentWPM, targetWPM, document]);

  const continueSectionBreak = useCallback(() => {
    if (!state.isSectionBreak) return;
    setState(prev => ({ ...prev, isSectionBreak: false, isPlaying: true }));
    engineRef.current?.start();
  }, [state.isSectionBreak]);

  const restart = useCallback(() => {
    if (!engineRef.current || !document) return;
    engineRef.current.stop();
    engineRef.current.setIndex(startIndex);
    setStartTime(null);
    setWordsRead(0);
    setState({
      isPlaying: false,
      currentIndex: startIndex,
      currentWord: document.words[startIndex] ?? '',
      currentWPM: 0,
      isSectionBreak: false,
      currentSection: 0,
      isComplete: false,
      isCountdown: false,
      countdownValue: 3,
    });
  }, [document, startIndex]);

  // Auto-pause on tab visibility change
  useEffect(() => {
    const handleVisibility = () => {
      if (window.document.hidden && state.isPlaying) {
        pause();
      }
    };
    // Use window.document to avoid shadowing
    window.document.addEventListener('visibilitychange', handleVisibility);
    return () => window.document.removeEventListener('visibilitychange', handleVisibility);
  }, [state.isPlaying, pause]);

  return {
    ...state,
    startTime,
    wordsRead,
    totalWords: document?.words.length ?? 0,
    totalSections: document?.sections.length ?? 0,
    play,
    pause,
    togglePlayPause,
    skipForward,
    skipBackward,
    continueSectionBreak,
    restart,
    startCountdown,
  };
}
