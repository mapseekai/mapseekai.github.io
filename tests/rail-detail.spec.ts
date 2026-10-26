import { test, expect } from '@playwright/test';

const moveBoundary = async (page: import('@playwright/test').Page, selector: string, screenY: number) => {
  await page.evaluate(({ selector, screenY }) => {
    const target = document.querySelector(selector)!;
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - screenY, behavior: 'instant' });
  }, { selector, screenY });
};

test('chapter lettering holds vertical before staggered horizontal docking, in both directions', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('.craft-reading-rail')).toHaveAttribute('data-ready', 'true');
  const link = page.locator('.orbit-link[href="#loom"]');
  const angles = () => page.locator('[data-chapter="loom"]').evaluateAll(nodes => nodes.map(node => Number((node as HTMLElement).style.transform.match(/rotate\(([-\d.]+)deg\)/)![1])));
  for (const y of [580, 430, 350]) {
    await moveBoundary(page, '#loom', y);
    await expect(link).toHaveAttribute('data-phase', 'vertical');
    await expect.poll(angles).toEqual([-90, -90, -90, -90]);
  }
  await moveBoundary(page, '#loom', 170); // A short word reaches its per-glyph bend later than the former shared timeline.
  await expect(link).toHaveAttribute('data-phase', 'docking');
  await expect.poll(async () => new Set((await angles()).map(Math.round)).size).toBeGreaterThan(2);
  await moveBoundary(page, '#loom', 100);
  await expect(link).toHaveAttribute('data-phase', 'docked');
  await expect.poll(angles).toEqual([0, 0, 0, 0]);
  await moveBoundary(page, '#loom', 430);
  await expect.poll(angles).toEqual([-90, -90, -90, -90]);
});

test('small T junctions reveal at section dividers and disappear behind fixed navigation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const boundary = page.locator('#design > .section-boundary');
  await moveBoundary(page, '#design', 950);
  await expect(boundary).toHaveCSS('opacity', '0');
  await moveBoundary(page, '#design', 450);
  await expect(boundary).toHaveCSS('opacity', '1');
  await expect(boundary.locator('.section-boundary-tick')).toHaveCount(2);
  const edges = await boundary.locator('.section-boundary-tick').evaluateAll(nodes => nodes.map(node => ({ width: node.getBoundingClientRect().width, height: node.getBoundingClientRect().height })));
  expect(edges).toEqual([{ width: 11, height: 11 }, { width: 11, height: 11 }]);
  await moveBoundary(page, '#design', 60);
  await expect(boundary).toHaveCSS('opacity', '0');
  await moveBoundary(page, '#design', 450);
  await expect(boundary).toHaveCSS('opacity', '1');
});

test('reduced motion retains chapter links without vertical rotation', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await moveBoundary(page, '#loom', 430);
  await expect(page.locator('html')).toHaveAttribute('data-scroll-engine', 'native');
  const angles = await page.locator('.orbit-letter').evaluateAll(nodes => nodes.map(node => Number((node as HTMLElement).style.transform.match(/rotate\(([-\d.]+)deg\)/)![1])));
  expect(angles.every(angle => angle === 0)).toBe(true);
  await page.locator('.orbit-link[href="#loom"]').click();
  await expect(page.locator('.section-strip-title')).toContainText('Loom');
});


test('section rules reach both viewport edges while labels travel inside the ruler', async ({ page }) => {
  for (const width of [1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.craft-reading-rail')).toHaveAttribute('data-ready', 'true');
    const viewport = await page.evaluate(() => document.documentElement.clientWidth);
    for (const rule of await page.locator('.section-divider').all()) {
      await expect.poll(async () => (await rule.boundingBox())!.x).toBeCloseTo(0, 0);
      expect((await rule.boundingBox())!.width).toBe(viewport);
    }
    await moveBoundary(page, '#loom', 480);
    await expect(page.locator('.orbit-link[href="#loom"]')).toHaveAttribute('data-phase', 'vertical');
    const centers = await page.locator('[data-chapter="loom"]').evaluateAll(nodes => nodes.map(node => {
      const rect = node.getBoundingClientRect(); return rect.left + rect.width / 2;
    }));
    expect(centers.every(center => Math.abs(center - (viewport - 30)) < 1)).toBe(true);
  }
});
