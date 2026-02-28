import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF } from '@/lib/extract/pdf-extractor';
import { sanitizeText } from '@/lib/extract/sanitizer';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const rawText = await extractTextFromPDF(buffer);

    if (!rawText || rawText.trim().length < 10) {
      return NextResponse.json(
        { error: 'Could not extract text from this PDF' },
        { status: 422 }
      );
    }

    const text = sanitizeText(rawText);

    return NextResponse.json({ text, wordCount: text.split(/\s+/).length });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'PDF parsing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
