'use client';

import { useEffect } from 'react';
import { SpeedMode } from '@/lib/text/types';
import { SPEED_MODES } from '@/lib/rsvp/speed-profiles';

interface KeyboardActions {
  togglePlayPause: () => void;
  continueSectionBreak: () => void;
  skipBackward: (n?: number) => void;
  skipForward: (n?: number) => void;
  setSpeedMode: (mode: SpeedMode) => void;
  onExit: () => void;
  restart: () => void;
  isSectionBreak: boolean;
}

export function useKeyboardControls(actions: KeyboardActions) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          actions.togglePlayPause();
          break;
        case 'Enter':
          e.preventDefault();
          if (actions.isSectionBreak) {
            actions.continueSectionBreak();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          actions.skipBackward(5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          actions.skipForward(5);
          break;
        case 'Digit1':
        case 'Numpad1':
          actions.setSpeedMode(SPEED_MODES[0]);
          break;
        case 'Digit2':
        case 'Numpad2':
          actions.setSpeedMode(SPEED_MODES[1]);
          break;
        case 'Digit3':
        case 'Numpad3':
          actions.setSpeedMode(SPEED_MODES[2]);
          break;
        case 'Digit4':
        case 'Numpad4':
          actions.setSpeedMode(SPEED_MODES[3]);
          break;
        case 'Escape':
          actions.onExit();
          break;
        case 'KeyR':
          if (!e.metaKey && !e.ctrlKey) {
            actions.restart();
          }
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [actions]);
}
