import { SpeedMode, TextDocument } from '@/lib/text/types';
import { SPEED_PROFILES } from './speed-profiles';
import { getWPMAtIndex, wpmToMs, getWordDelay } from './word-timing';

export type EngineCallback = (state: {
  currentIndex: number;
  currentWord: string;
  currentWPM: number;
  isSectionBreak: boolean;
  currentSection: number;
  isComplete: boolean;
}) => void;

export class RSVPEngine {
  private document: TextDocument;
  private speedMode: SpeedMode;
  private currentIndex: number;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private isRunning = false;
  private callback: EngineCallback;
  private wordsReadInSession = 0;

  constructor(
    document: TextDocument,
    speedMode: SpeedMode,
    startIndex: number,
    callback: EngineCallback
  ) {
    this.document = document;
    this.speedMode = speedMode;
    this.currentIndex = startIndex;
    this.callback = callback;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.scheduleNext();
  }

  pause() {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  stop() {
    this.pause();
  }

  setSpeedMode(mode: SpeedMode) {
    this.speedMode = mode;
  }

  setIndex(index: number) {
    this.currentIndex = Math.max(0, Math.min(index, this.document.words.length - 1));
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  getWordsRead() {
    return this.wordsReadInSession;
  }

  private getCurrentSection(): number {
    const { sections } = this.document;
    for (let i = 0; i < sections.length; i++) {
      if (this.currentIndex >= sections[i].startIndex && this.currentIndex <= sections[i].endIndex) {
        return i;
      }
    }
    return 0;
  }

  private scheduleNext() {
    if (!this.isRunning) return;

    const { words, paragraphBreaks, sectionBreaks } = this.document;

    if (this.currentIndex >= words.length) {
      this.isRunning = false;
      this.callback({
        currentIndex: this.currentIndex,
        currentWord: '',
        currentWPM: 0,
        isSectionBreak: false,
        currentSection: this.getCurrentSection(),
        isComplete: true,
      });
      return;
    }

    // Check for section break
    if (sectionBreaks.has(this.currentIndex) && this.currentIndex > 0) {
      this.isRunning = false;
      this.callback({
        currentIndex: this.currentIndex,
        currentWord: words[this.currentIndex],
        currentWPM: this.getCurrentWPM(),
        isSectionBreak: true,
        currentSection: this.getCurrentSection(),
        isComplete: false,
      });
      return;
    }

    const word = words[this.currentIndex];
    const wpm = this.getCurrentWPM();
    const baseMs = wpmToMs(wpm);
    const isParagraphEnd = paragraphBreaks.has(this.currentIndex);
    const delay = getWordDelay(word, baseMs, isParagraphEnd);

    this.callback({
      currentIndex: this.currentIndex,
      currentWord: word,
      currentWPM: Math.round(wpm),
      isSectionBreak: false,
      currentSection: this.getCurrentSection(),
      isComplete: false,
    });

    this.currentIndex++;
    this.wordsReadInSession++;

    this.timer = setTimeout(() => this.scheduleNext(), delay);
  }

  private getCurrentWPM(): number {
    const profile = SPEED_PROFILES[this.speedMode];
    return getWPMAtIndex(this.wordsReadInSession, profile);
  }
}
