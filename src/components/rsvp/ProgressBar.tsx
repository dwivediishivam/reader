'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gray-900">
      <div
        className="h-full bg-blue-500 transition-all duration-150 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
