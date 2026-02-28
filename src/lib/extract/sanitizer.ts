/**
 * Clean and normalize extracted text for RSVP reading.
 */
export function sanitizeText(text: string): string {
  return text
    // Normalize whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    // Remove excessive blank lines (keep max 2)
    .replace(/\n{3,}/g, '\n\n')
    // Remove leading/trailing whitespace per line
    .split('\n')
    .map(line => line.trim())
    .join('\n')
    // Remove common artifacts
    .replace(/\[\d+\]/g, '') // citation numbers like [1]
    .replace(/\s{2,}/g, ' ') // collapse multiple spaces within lines
    .trim();
}
