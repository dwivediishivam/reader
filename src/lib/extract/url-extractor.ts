import * as cheerio from 'cheerio';
import { Readability } from '@mozilla/readability';
import { JSDOM } from 'jsdom';

export async function extractTextFromURL(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; RSVPReader/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${response.status}`);
  }

  const html = await response.text();

  // Try Readability first
  try {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (article?.textContent) {
      return article.textContent.trim();
    }
  } catch {
    // Fall through to cheerio
  }

  // Fallback: cheerio extraction
  const $ = cheerio.load(html);
  $('script, style, nav, header, footer, aside, .sidebar, .menu, .ad').remove();

  const text = $('article, main, .content, .post-content, .entry-content, body')
    .first()
    .text()
    .replace(/\s+/g, ' ')
    .trim();

  return text;
}
