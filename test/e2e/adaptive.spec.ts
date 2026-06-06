import { test, expect, type BrowserContext, type Browser } from '@playwright/test';

// ---------------------------------------------------------------------------
// Helper: build a fresh context with the given options, optionally pre-seeding
// localStorage entries before any page script runs.
// ---------------------------------------------------------------------------
async function makeContext(
  browser: Browser,
  opts: {
    locale?: string;
    colorScheme?: 'dark' | 'light' | 'no-preference';
    storageItems?: Record<string, string>;
  },
): Promise<BrowserContext> {
  const ctx = await browser.newContext({
    locale: opts.locale,
    colorScheme: opts.colorScheme,
  });

  if (opts.storageItems && Object.keys(opts.storageItems).length > 0) {
    // Runs before every page script — perfect for seeding localStorage
    const items = opts.storageItems;
    await ctx.addInitScript((entries: Record<string, string>) => {
      for (const [k, v] of Object.entries(entries)) {
        localStorage.setItem(k, v);
      }
    }, items);
  }

  return ctx;
}

// ============================================================================
// THEME TESTS
// ============================================================================

test.describe('Theme adaptivity', () => {
  test('dark OS preference → data-theme="dark" (no stored theme)', async ({ browser }) => {
    const ctx = await makeContext(browser, { colorScheme: 'dark' });
    const page = await ctx.newPage();
    await page.goto('/');
    const theme = await page.evaluate(() => document.documentElement.dataset['theme']);
    expect(theme).toBe('dark');
    await ctx.close();
  });

  test('light OS preference → data-theme="light" (no stored theme)', async ({ browser }) => {
    const ctx = await makeContext(browser, { colorScheme: 'light' });
    const page = await ctx.newPage();
    await page.goto('/');
    const theme = await page.evaluate(() => document.documentElement.dataset['theme']);
    expect(theme).toBe('light');
    await ctx.close();
  });

  test('no-preference OS → data-theme="light" (fallback is always light)', async ({ browser }) => {
    const ctx = await makeContext(browser, { colorScheme: 'no-preference' });
    const page = await ctx.newPage();
    await page.goto('/');
    const theme = await page.evaluate(() => document.documentElement.dataset['theme']);
    // matchMedia('(prefers-color-scheme: dark)').matches is false → 'light'
    expect(theme).toBe('light');
    await ctx.close();
  });

  test('stored theme="light" + dark OS → stays "light" (manual wins)', async ({ browser }) => {
    const ctx = await makeContext(browser, {
      colorScheme: 'dark',
      storageItems: { theme: 'light' },
    });
    const page = await ctx.newPage();
    await page.goto('/');
    const theme = await page.evaluate(() => document.documentElement.dataset['theme']);
    expect(theme).toBe('light');
    await ctx.close();
  });
});

// ============================================================================
// LANGUAGE TESTS
// ============================================================================

test.describe('Language adaptivity', () => {
  test('zh-CN locale + no stored lang → / redirects to /zh', async ({ browser }) => {
    const ctx = await makeContext(browser, { locale: 'zh-CN' });
    const page = await ctx.newPage();
    await page.goto('/');
    // Wait for the client-side redirect
    await page.waitForURL('**/zh', { timeout: 5000 });
    const pathname = new URL(page.url()).pathname;
    expect(pathname).toBe('/zh');
    await ctx.close();
  });

  test('en-US locale + no stored lang → / stays at /', async ({ browser }) => {
    const ctx = await makeContext(browser, { locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('/');
    // Give any potential redirect time to fire
    await page.waitForTimeout(500);
    const pathname = new URL(page.url()).pathname;
    expect(pathname).toBe('/');
    await ctx.close();
  });

  test('stored lang="en" + zh-CN locale → / stays at / (manual wins)', async ({ browser }) => {
    const ctx = await makeContext(browser, {
      locale: 'zh-CN',
      storageItems: { lang: 'en' },
    });
    const page = await ctx.newPage();
    await page.goto('/');
    // Give any potential redirect time to fire
    await page.waitForTimeout(500);
    const pathname = new URL(page.url()).pathname;
    expect(pathname).toBe('/');
    await ctx.close();
  });

  test('en-US locale + no stored lang → /zh stays at /zh (no bounce to en)', async ({
    browser,
  }) => {
    const ctx = await makeContext(browser, { locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('/zh');
    // Give any potential redirect time to fire
    await page.waitForTimeout(500);
    const pathname = new URL(page.url()).pathname;
    expect(pathname).toBe('/zh');
    await ctx.close();
  });

  test('/zh contains Chinese content (技术领导者)', async ({ browser }) => {
    const ctx = await makeContext(browser, { locale: 'en-US' });
    const page = await ctx.newPage();
    await page.goto('/zh');
    const content = await page.content();
    expect(content).toContain('技术领导者');
    await ctx.close();
  });
});
