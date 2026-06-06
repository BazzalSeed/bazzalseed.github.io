export const LOCALES = ['en', 'zh'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export function localeFromPath(pathname: string): Locale {
  const seg = pathname.split('/').filter(Boolean)[0];
  return seg && isLocale(seg) ? seg : DEFAULT_LOCALE;
}

/**
 * Return the equivalent path in `target` locale, preserving the sub-path.
 * Site uses `trailingSlash: 'never'`, so non-root paths have no trailing slash;
 * the root is '/'.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] && isLocale(parts[0])) parts.shift(); // strip current locale prefix
  const rest = parts.join('/');
  if (target === DEFAULT_LOCALE) return rest ? `/${rest}` : '/';
  return rest ? `/${target}/${rest}` : `/${target}`;
}
