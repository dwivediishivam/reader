'use client';

import { TextDocument } from '@/lib/text/types';

interface TextBrowserProps {
  document: TextDocument;
  selectedWordIndex: number | null;
  onWordClick: (index: number) => void;
  sectionRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

export function TextBrowser({ document, selectedWordIndex, onWordClick, sectionRefs }: TextBrowserProps) {
  const { words, paragraphBreaks, sections } = document;

  // Group words into paragraphs within sections
  const renderSections = () => {
    return sections.map((section, sIdx) => {
      const sectionWords: React.ReactNode[] = [];
      let paragraphWords: React.ReactNode[] = [];

      for (let i = section.startIndex; i <= section.endIndex && i < words.length; i++) {
        const isSelected = selectedWordIndex === i;
        paragraphWords.push(
          <span
            key={i}
            onClick={() => onWordClick(i)}
            className={`cursor-pointer hover:bg-blue-600/30 rounded px-0.5 transition-colors ${
              isSelected ? 'bg-blue-600/40 text-blue-300' : ''
            }`}
          >
            {words[i]}{' '}
          </span>
        );

        if (paragraphBreaks.has(i) || i === section.endIndex) {
          sectionWords.push(
            <p key={`p-${i}`} className="mb-4 leading-relaxed text-gray-300">
              {paragraphWords}
            </p>
          );
          paragraphWords = [];
        }
      }

      return (
        <div
          key={sIdx}
          ref={(el) => { sectionRefs.current[sIdx] = el; }}
          className="mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-3 pb-2 border-b border-gray-800">
            {section.title}
          </h2>
          {sectionWords}
        </div>
      );
    });
  };

  return (
    <div className="text-base font-[family-name:var(--font-geist-sans)]">
      {renderSections()}
    </div>
  );
}
