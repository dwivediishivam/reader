'use client';

import { SpeedMode } from '@/lib/text/types';
import { SPEED_MODES, SPEED_MODE_LABELS, SPEED_PROFILES } from '@/lib/rsvp/speed-profiles';

interface SpeedModeSelectorProps {
  value: SpeedMode;
  onChange: (mode: SpeedMode) => void;
  compact?: boolean;
}

export function SpeedModeSelector({ value, onChange, compact }: SpeedModeSelectorProps) {
  return (
    <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
      {SPEED_MODES.map((mode) => {
        const profile = SPEED_PROFILES[mode];
        const isActive = value === mode;
        return (
          <button
            key={mode}
            onClick={() => onChange(mode)}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium transition-all
              ${isActive
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              }
            `}
          >
            {SPEED_MODE_LABELS[mode]}
            {!compact && (
              <span className="ml-1 text-xs opacity-60">
                {profile.startWPM}-{profile.maxWPM}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
