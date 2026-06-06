import { describe, it, expect } from 'vitest';
import { sortEntries, entryHref, isLocal } from '../src/lib/writing';

const mk = (id: string, date: string, external: boolean, url?: string) => ({
  id,
  data: { title: id, date: new Date(date), external, url, source: external ? 'Ext' : undefined },
});

describe('writing helpers', () => {
  it('sorts entries newest first', () => {
    const out = sortEntries([mk('a', '2023-01-01', false), mk('b', '2024-01-01', true, 'https://x')]);
    expect(out.map((e) => e.id)).toEqual(['b', 'a']);
  });

  it('isLocal is true only for non-external entries', () => {
    expect(isLocal(mk('a', '2023-01-01', false))).toBe(true);
    expect(isLocal(mk('b', '2024-01-01', true, 'https://x'))).toBe(false);
  });

  it('entryHref returns external url for external entries', () => {
    expect(entryHref(mk('b', '2024-01-01', true, 'https://x.com/p'))).toBe('https://x.com/p');
  });

  it('entryHref returns local route for local entries', () => {
    expect(entryHref(mk('my-post', '2024-01-01', false))).toBe('/writing/my-post');
  });

  it('entryHref throws for external entries missing a url', () => {
    expect(() => entryHref(mk('broken', '2024-01-01', true))).toThrow(/missing url/);
  });
});
