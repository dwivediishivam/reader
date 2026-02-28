'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReaderStore } from '@/stores/reader-store';
import { TextInput } from '@/components/input/TextInput';
import { URLInput } from '@/components/input/URLInput';
import { FileUpload } from '@/components/input/FileUpload';
import { SpeedModeSelector } from '@/components/rsvp/SpeedModeSelector';
import { ReadHistory } from '@/components/history/ReadHistory';

type InputMethod = 'paste' | 'url' | 'pdf';

export default function LandingPage() {
  const router = useRouter();
  const { setText, speedMode, setSpeedMode } = useReaderStore();

  const [method, setMethod] = useState<InputMethod>('paste');
  const [pasteText, setPasteText] = useState('');
  const [extractedText, setExtractedText] = useState('');

  const currentText = method === 'paste' ? pasteText : extractedText;
  const hasText = currentText.trim().length > 0;
  const wordCount = hasText ? currentText.split(/\s+/).filter(Boolean).length : 0;

  const handleStart = () => {
    if (!hasText) return;
    const source = method === 'paste' ? 'paste' : method === 'url' ? 'url' : 'pdf';
    setText(currentText, source);
    router.push('/reader');
  };

  const handleBrowse = () => {
    if (!hasText) return;
    const source = method === 'paste' ? 'paste' : method === 'url' ? 'url' : 'pdf';
    setText(currentText, source);
    router.push('/browse');
  };

  const handleExtracted = (text: string) => {
    setExtractedText(text);
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
            { key: 'url' as const, label: 'Enter URL' },
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
          {method === 'url' && (
            <URLInput onExtracted={handleExtracted} />
          )}
          {method === 'pdf' && (
            <FileUpload onExtracted={handleExtracted} />
          )}
        </div>

        {/* Extracted text preview for URL/PDF */}
        {method !== 'paste' && extractedText && (
          <div className="mb-6 p-4 bg-gray-900 rounded-lg border border-gray-800">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400">Extracted text</span>
              <span className="text-xs text-gray-500">{wordCount} words</span>
            </div>
            <p className="text-sm text-gray-300 line-clamp-3">{extractedText.slice(0, 300)}...</p>
          </div>
        )}

        {/* Speed Mode */}
        <div className="mb-8">
          <label className="block text-sm text-gray-400 mb-2">Speed Mode</label>
          <SpeedModeSelector value={speedMode} onChange={setSpeedMode} />
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
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-900 rounded">&larr;&rarr;</kbd><kbd className="px-1.5 py-0.5 bg-gray-900 rounded">A/D</kbd> ±5s
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-900 rounded">W/S</kbd><kbd className="px-1.5 py-0.5 bg-gray-900 rounded">+/−</kbd> ±50 WPM
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-900 rounded">1-4</kbd> speed modes
            {' '}<kbd className="px-1.5 py-0.5 bg-gray-900 rounded">Esc</kbd> exit
          </p>
        </div>

        {/* Read History */}
        <ReadHistory />
      </div>
    </div>
  );
}
