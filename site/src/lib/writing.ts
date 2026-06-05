export type WritingEntry = {
  id: string;
  data: {
    title: string;
    date: Date;
    external: boolean;
    url?: string;
    source?: string;
    description?: string;
    tags?: string[];
  };
};

export function sortEntries<T extends WritingEntry>(entries: T[]): T[] {
  return [...entries].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function isLocal(entry: WritingEntry): boolean {
  return !entry.data.external;
}

export function entryHref(entry: WritingEntry): string {
  if (entry.data.external) {
    if (!entry.data.url) throw new Error(`External entry "${entry.id}" missing url`);
    return entry.data.url;
  }
  return `/writing/${entry.id}`;
}
