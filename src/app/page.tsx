'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useReaderStore } from '@/stores/reader-store';
import { TextInput } from '@/components/input/TextInput';
import { FileUpload } from '@/components/input/FileUpload';
import { SpeedModeSelector } from '@/components/rsvp/SpeedModeSelector';
import { getHistory, clearHistory } from '@/lib/history';
import { HistoryEntry } from '@/lib/text/types';

type InputMethod = 'paste' | 'pdf';

export default function LandingPage() {
  const router = useRouter();
  const { setText, speedMode, setSpeedMode, targetWPM, setTargetWPM } = useReaderStore();

  const [method, setMethod] = useState<InputMethod>('paste');
  const [pasteText, setPasteText] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [wpmInput, setWpmInput] = useState(String(targetWPM));

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  useEffect(() => {
    setWpmInput(String(targetWPM));
  }, [targetWPM]);

  const currentText = method === 'paste' ? pasteText : extractedText;
  const hasText = currentText.trim().length > 0;
  const wordCount = hasText ? currentText.split(/\s+/).filter(Boolean).length : 0;

  const handleStart = () => {
    if (!hasText) return;
    const source = method === 'paste' ? 'paste' : 'pdf';
    setText(currentText, source);
    router.push('/reader');
  };

  const handleBrowse = () => {
    if (!hasText) return;
    const source = method === 'paste' ? 'paste' : 'pdf';
    setText(currentText, source);
    router.push('/browse');
  };

  const handleExtracted = (text: string) => {
    setExtractedText(text);
  };

  const handleWPMSubmit = () => {
    const val = parseInt(wpmInput, 10);
    if (!isNaN(val) && val >= 50 && val <= 2000) {
      setTargetWPM(val);
    } else {
      setWpmInput(String(targetWPM));
    }
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            RSVP Speed Reader
          </h1>
          <p className="text-gray-500 text-lg">
            One word at a time. Gradually faster. Focus like never before.
          </p>
        </div>

        {/* Input Method Tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1 mb-6">
          {([
            { key: 'paste' as const, label: 'Paste Text' },
            { key: 'pdf' as const, label: 'Upload File' },
          ]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setMethod(key)}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${
                method === key
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="mb-6">
          {method === 'paste' && (
            <TextInput value={pasteText} onChange={setPasteText} />
          )}
          {method === 'pdf' && (
            <FileUpload onExtracted={handleExtracted} />
          )}
        </div>

        {/* Extracted text preview for file upload */}
        {method === 'pdf' && extractedText && (
          <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Extracted text</span>
              <span className="text-xs text-gray-500">{wordCount} words</span>
            </div>
            <p className="text-sm text-gray-300 line-clamp-3">{extractedText.slice(0, 300)}...</p>
          </div>
        )}

        {/* Speed Controls */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Speed Mode</label>
          <SpeedModeSelector value={speedMode} onChange={setSpeedMode} />
        </div>

        {/* Manual WPM input */}
        <div className="mb-8">
          <label className="block text-sm text-gray-400 mb-2">Target WPM</label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTargetWPM(Math.max(50, targetWPM - 50))}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-mono"
            >
              -
            </button>
            <input
              type="number"
              value={wpmInput}
              onChange={(e) => setWpmInput(e.target.value)}
              onBlur={handleWPMSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleWPMSubmit()}
              className="w-24 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-center text-white font-mono focus:outline-none focus:border-blue-600 transition-colors"
              min={50}
              max={2000}
            />
            <button
              onClick={() => setTargetWPM(Math.min(2000, targetWPM + 50))}
              className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors font-mono"
            >
              +
            </button>
            <span className="text-sm text-gray-500">words per minute</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-3">
          <button
            onClick={handleStart}
            disabled={!hasText}
            className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg font-medium transition-colors text-lg"
          >
            Start Reading
          </button>
          <button
            onClick={handleBrowse}
            disabled={!hasText}
            className="flex-1 py-3.5 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-700 text-white rounded-lg font-medium transition-colors text-lg"
          >
            Explore Text First
          </button>
        </div>

        {/* Keyboard hints */}
        <div className="mt-8 text-center text-xs text-gray-600">
          <p>
            In reader: <kbd className="px-1.5 py-0.5 bg-gray-900 rounded">Space</kbd> play/pause
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-900 rounded">&larr;&rarr;/AD</kbd> skip 5s
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-900 rounded">W/S</kbd> speed &plusmn;50
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-900 rounded">1-4</kbd> presets
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-900 rounded">Esc</kbd> exit
          </p>
        </div>

        {/* Read History */}
        {history.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-white">Read History</h2>
              <button
                onClick={handleClearHistory}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {history.slice(0, 10).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-800"
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <p className="text-sm text-gray-300 truncate">{entry.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {new Date(entry.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                    <span>{entry.wordCount.toLocaleString()} words</span>
                    <span>{entry.avgWPM} WPM</span>
                    <span>
                      {Math.floor(entry.duration / 60)}:{(entry.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
