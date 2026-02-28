'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useReaderStore } from '@/stores/reader-store';
import { useRSVPEngine } from '@/hooks/useRSVPEngine';
import { useKeyboardControls } from '@/hooks/useKeyboardControls';
import { RSVPDisplay } from '@/components/rsvp/RSVPDisplay';
import { RSVPControls } from '@/components/rsvp/RSVPControls';
import { ProgressBar } from '@/components/rsvp/ProgressBar';
import { WPMIndicator } from '@/components/rsvp/WPMIndicator';
import { SectionBreakOverlay } from '@/components/rsvp/SectionBreakOverlay';
import { CompletionScreen } from '@/components/rsvp/CompletionScreen';

export default function ReaderPage() {
  const router = useRouter();
  const { document, targetWPM, startIndex, setSpeedMode, adjustWPM, setTargetWPM } = useReaderStore();

  const engine = useRSVPEngine(document, targetWPM, startIndex);

  const keyboardActions = useMemo(() => ({
    togglePlayPause: engine.togglePlayPause,
    continueSectionBreak: engine.continueSectionBreak,
    skipSeconds: engine.skipSeconds,
    adjustWPM,
    setSpeedMode,
    onExit: () => router.push('/'),
    restart: engine.restart,
    isSectionBreak: engine.isSectionBreak,
  }), [engine, setSpeedMode, adjustWPM, router]);

  useKeyboardControls(keyboardActions);

  // Redirect if no document loaded
  useEffect(() => {
    if (!document) {
      router.push('/');
    }
  }, [document, router]);

  if (!document) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0B]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const currentSectionTitle =
    document.sections[engine.currentSection]?.title ?? '';

  return (
    <div
      className="h-screen relative overflow-hidden bg-[#0A0A0B] select-none cursor-default"
      onClick={engine.togglePlayPause}
    >
      <ProgressBar current={engine.currentIndex} total={engine.totalWords} />

      <RSVPDisplay
        word={engine.currentWord}
        isCountdown={engine.isCountdown}
        countdownValue={engine.countdownValue}
      />

      <WPMIndicator wpm={engine.currentWPM} />

      {engine.isSectionBreak && (
        <SectionBreakOverlay
          currentSection={engine.currentSection}
          totalSections={engine.totalSections}
          sectionTitle={currentSectionTitle}
        />
      )}

      {engine.isComplete && (
        <CompletionScreen
          wordsRead={engine.wordsRead}
          startTime={engine.startTime}
          onRestart={engine.restart}
        />
      )}

      <div onClick={(e) => e.stopPropagation()}>
        <RSVPControls
          isPlaying={engine.isPlaying}
          targetWPM={targetWPM}
          onTogglePlayPause={engine.togglePlayPause}
          onSkipBackward={() => engine.skipSeconds(-5)}
          onSkipForward={() => engine.skipSeconds(5)}
          onAdjustWPM={adjustWPM}
          onSetWPM={setTargetWPM}
          onExit={() => router.push('/')}
          onRestart={engine.restart}
        />
      </div>
    </div>
  );
}
