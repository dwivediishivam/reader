import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromURL } from '@/lib/extract/url-extractor';
import { sanitizeText } from '@/lib/extract/sanitizer';

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const rawText = await extractTextFromURL(url);

    if (!rawText || rawText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Could not extract meaningful text from this URL' },
        { status: 422 }
      );
    }

    const text = sanitizeText(rawText);

    return NextResponse.json({ text, wordCount: text.split(/\s+/).length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Extraction failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
