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
  const { document, speedMode, targetWPM, startIndex, setSpeedMode, setTargetWPM, adjustTargetWPM } = useReaderStore();

  const engine = useRSVPEngine(document, speedMode, startIndex, targetWPM);

  const keyboardActions = useMemo(() => ({
    togglePlayPause: engine.togglePlayPause,
    continueSectionBreak: engine.continueSectionBreak,
    skipBackward: engine.skipBackward,
    skipForward: engine.skipForward,
    setSpeedMode,
    adjustTargetWPM,
    onExit: () => router.push('/'),
    restart: engine.restart,
    isSectionBreak: engine.isSectionBreak,
  }), [engine, setSpeedMode, adjustTargetWPM, router]);

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
          sourceType={useReaderStore.getState().sourceType}
          totalWords={engine.totalWords}
          onRestart={engine.restart}
        />
      )}

      <div onClick={(e) => e.stopPropagation()}>
        <RSVPControls
          isPlaying={engine.isPlaying}
          speedMode={speedMode}
          targetWPM={targetWPM}
          onTogglePlayPause={engine.togglePlayPause}
          onSkipBackward={() => engine.skipBackward(5)}
          onSkipForward={() => engine.skipForward(5)}
          onSpeedModeChange={setSpeedMode}
          onTargetWPMChange={setTargetWPM}
          onAdjustTargetWPM={adjustTargetWPM}
          onExit={() => router.push('/')}
          onRestart={engine.restart}
        />
      </div>
    </div>
  );
}
