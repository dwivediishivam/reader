'use client';

interface SectionBreakOverlayProps {
  currentSection: number;
  totalSections: number;
  sectionTitle: string;
}

export function SectionBreakOverlay({
  currentSection,
  totalSections,
  sectionTitle,
}: SectionBreakOverlayProps) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0B]/95 z-10">
      <p className="text-gray-500 text-sm mb-2">
        Section {currentSection + 1} of {totalSections}
      </p>
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8">
        {sectionTitle}
      </h2>
      <p className="text-gray-400 text-sm">
        Press <kbd className="px-2 py-1 bg-gray-800 rounded text-gray-300 text-xs mx-1">Enter</kbd> to continue
      </p>
    </div>
  );
}
