'use client';

import { Section } from '@/lib/text/types';

interface SectionListProps {
  sections: Section[];
  activeSection: number;
  onSectionClick: (index: number) => void;
}

export function SectionList({ sections, activeSection, onSectionClick }: SectionListProps) {
  return (
    <nav className="space-y-1">
      <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-3 px-3">Sections</h3>
      {sections.map((section, i) => (
        <button
          key={i}
          onClick={() => onSectionClick(i)}
          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
            activeSection === i
              ? 'bg-blue-600/20 text-blue-400'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
        >
          <span className="block truncate">{section.title}</span>
          <span className="text-xs text-gray-600">{section.wordCount} words</span>
        </button>
      ))}
    </nav>
  );
}
