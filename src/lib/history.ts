import { HistoryEntry } from '@/lib/text/types';

const HISTORY_KEY = 'rsvp-reader-history';
const MAX_ENTRIES = 50;

export function getHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'completedAt'>): void {
  const entries = getHistory();
  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    completedAt: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  if (entries.length > MAX_ENTRIES) {
    entries.length = MAX_ENTRIES;
  }
  localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY);
}
