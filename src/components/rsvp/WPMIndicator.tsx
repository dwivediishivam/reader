'use client';

interface WPMIndicatorProps {
  wpm: number;
}

export function WPMIndicator({ wpm }: WPMIndicatorProps) {
  return (
    <div className="absolute bottom-4 right-4 text-sm text-gray-600 font-mono">
      {wpm > 0 ? `${wpm} WPM` : ''}
    </div>
  );
}
