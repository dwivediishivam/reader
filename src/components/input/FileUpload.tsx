'use client';

import { useState, useRef } from 'react';

interface FileUploadProps {
  onExtracted: (text: string) => void;
}

export function FileUpload({ onExtracted }: FileUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      setError('Please upload a PDF or TXT file');
      return;
    }

    setLoading(true);
    setError('');
    setFileName(file.name);

    try {
      if (file.name.endsWith('.txt')) {
        const text = await file.text();
        onExtracted(text);
      } else {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to parse PDF');
        }

        const data = await res.json();
        onExtracted(data.text);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">Upload a PDF or TXT file</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-800 rounded-lg p-8 text-center cursor-pointer hover:border-gray-600 transition-colors"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />

        {loading ? (
          <p className="text-gray-400">Processing {fileName}...</p>
        ) : fileName ? (
          <p className="text-gray-300">{fileName} — click to change</p>
        ) : (
          <div>
            <svg className="w-8 h-8 mx-auto mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-500">Click or drop a file here</p>
            <p className="text-xs text-gray-600 mt-1">PDF or TXT</p>
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
    </div>
  );
}
