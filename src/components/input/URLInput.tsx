'use client';

import { useState } from 'react';

interface URLInputProps {
  onExtracted: (text: string) => void;
}

export function URLInput({ onExtracted }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExtract = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to extract text');
      }

      const data = await res.json();
      onExtracted(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extract text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Enter a URL</label>
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/article"
          className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-600 transition-colors"
          onKeyDown={(e) => e.key === 'Enter' && handleExtract()}
        />
        <button
          onClick={handleExtract}
          disabled={loading || !url.trim()}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-lg transition-colors font-medium"
        >
          {loading ? 'Extracting...' : 'Extract'}
        </button>
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
