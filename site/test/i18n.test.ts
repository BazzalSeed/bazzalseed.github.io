import { describe, it, expect } from 'vitest';
import { localeFromPath, switchLocalePath, isLocale } from '../src/i18n/config';

describe('i18n helpers', () => {
  it('detects locale from path', () => {
    expect(localeFromPath('/')).toBe('en');
    expect(localeFromPath('/writing/foo')).toBe('en');
    expect(localeFromPath('/zh')).toBe('zh');
    expect(localeFromPath('/zh/')).toBe('zh');
    expect(localeFromPath('/zh/writing')).toBe('zh');
  });
  it('switches a path to the other locale preserving the rest (no trailing slash)', () => {
    expect(switchLocalePath('/', 'zh')).toBe('/zh');
    expect(switchLocalePath('/zh', 'en')).toBe('/');
    expect(switchLocalePath('/zh/', 'en')).toBe('/');
    expect(switchLocalePath('/zh/writing/x', 'en')).toBe('/writing/x');
    expect(switchLocalePath('/writing/x', 'zh')).toBe('/zh/writing/x');
  });
  it('validates locales', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('zh')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });
});
