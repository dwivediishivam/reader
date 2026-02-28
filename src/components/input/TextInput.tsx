'use client';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ value, onChange }: TextInputProps) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Paste your text</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste any text here — articles, essays, book chapters..."
        className="w-full h-48 bg-gray-900 border border-gray-800 rounded-lg p-4 text-white placeholder-gray-600 resize-none focus:outline-none focus:border-blue-600 transition-colors"
      />
      {value && (
        <p className="text-xs text-gray-500 mt-1">
          {value.split(/\s+/).filter(Boolean).length} words
        </p>
      )}
    </div>
  );
}
