import { SpeedMode, SpeedProfile } from '@/lib/text/types';

export const SPEED_PROFILES: Record<SpeedMode, SpeedProfile> = {
  low:    { mode: 'low',    startWPM: 150, maxWPM: 400,  rampWords: 200 },
  medium: { mode: 'medium', startWPM: 200, maxWPM: 600,  rampWords: 300 },
  high:   { mode: 'high',   startWPM: 250, maxWPM: 900,  rampWords: 400 },
  ultra:  { mode: 'ultra',  startWPM: 300, maxWPM: 1100, rampWords: 500 },
};

export const SPEED_MODE_LABELS: Record<SpeedMode, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  ultra: 'Ultra',
};

export const SPEED_MODES: SpeedMode[] = ['low', 'medium', 'high', 'ultra'];
