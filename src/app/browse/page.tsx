'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useReaderStore } from '@/stores/reader-store';
import { SectionList } from '@/components/browse/SectionList';
import { TextBrowser } from '@/components/browse/TextBrowser';

export default function BrowsePage() {
  const router = useRouter();
  const { document, setStartIndex } = useReaderStore();
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  const handleSectionClick = (index: number) => {
    setActiveSection(index);
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleWordClick = (index: number) => {
    setSelectedWord(index);
    // Determine which section this word belongs to
    for (let i = 0; i < document.sections.length; i++) {
      if (index >= document.sections[i].startIndex && index <= document.sections[i].endIndex) {
        setActiveSection(i);
        break;
      }
    }
  };

  const handleStartFromHere = () => {
    setStartIndex(selectedWord ?? 0);
    router.push('/reader');
  };

  return (
    <div className="h-screen flex bg-[#0A0A0B]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-800 p-4 overflow-y-auto flex-shrink-0 hidden md:block">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-sm text-gray-500 hover:text-white transition-colors"
          >
            &larr; Back
          </button>
        </div>

        <SectionList
          sections={document.sections}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />

        <div className="mt-6 pt-4 border-t border-gray-800">
          <p className="text-xs text-gray-600 mb-1">{document.words.length} total words</p>
          <p className="text-xs text-gray-600">{document.sections.length} sections</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12">
        <div className="max-w-3xl mx-auto">
          {/* Mobile back button */}
          <button
            onClick={() => router.push('/')}
            className="md:hidden text-sm text-gray-500 hover:text-white transition-colors mb-4"
          >
            &larr; Back
          </button>

          <TextBrowser
            document={document}
            selectedWordIndex={selectedWord}
            onWordClick={handleWordClick}
            sectionRefs={sectionRefs}
          />
        </div>

        {/* Floating start button */}
        {selectedWord !== null && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={handleStartFromHere}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg shadow-blue-600/20 font-medium transition-all"
            >
              Start Reading from Here (word {selectedWord + 1})
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
