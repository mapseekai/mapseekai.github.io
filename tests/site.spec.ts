import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Every navigation uses the real prerendered site, not mocked components.
test('home hydrates without errors and switches all product demonstrations', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('创造的起点');
  await page.getByRole('tab', { name: '02 Loom' }).click();
  await page.getByRole('button', { name: '检查示例要素' }).click();
  await expect(page.getByText('Polygon · 5 个编辑节点')).toBeVisible();
  await page.getByRole('tab', { name: '03 Design' }).click();
  await page.getByRole('button', { name: '墨色 · Ink' }).click();
  await expect(page.locator('.map-info strong')).toHaveText('墨色 · Ink');
  await page.getByRole('tab', { name: '01 Cloud' }).click();
  await page.getByRole('button', { name: '隐藏城市建筑' }).click();
  await expect(page.getByRole('button', { name: '显示城市建筑' })).toHaveAttribute('aria-pressed', 'false');
  expect(errors).toEqual([]);
});
test('map zoom is bounded and resets', async ({ page }) => {
  await page.goto('/');
  const plus = page.getByRole('button', { name: '放大地图' });
  for (let i = 0; i < 4; i++) await plus.click();
  await expect(plus).toBeDisabled();
  await expect(page.locator('.status-right')).toContainText('180%');
  await page.getByRole('button', { name: '重置地图演示' }).click();
  await expect(page.locator('.status-right')).toContainText('100%');
});
test('product tabs support keyboard navigation', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('tab', { name: '01 Cloud' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: '02 Loom' })).toBeFocused();
  await expect(page.getByRole('tab', { name: '02 Loom' })).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('End');
  await expect(page.getByRole('tab', { name: '03 Design' })).toBeFocused();
});
test('product routes load directly and refresh with real content', async ({ page }) => {
  for (const product of ['cloud', 'loom', 'design']) {
    await page.goto(`/products/${product}/`);
    await expect(page.locator('h1')).toHaveText(`mapseek-${product}`);
    await page.reload();
    await expect(page.locator('h1')).toHaveText(`mapseek-${product}`);
    await expect(page.getByText('交互概念演示，用于说明产品方向。示意数据在当前页面运行，未连接产品服务。')).toBeVisible();
  }
});
test('blog filters, search, empty state, and reset work', async ({ page }) => {
  await page.goto('/blog/');
  await expect(page.locator('.post-card')).toHaveCount(6);
  await page.getByRole('button', { name: '工程手记', exact: true }).click();
  await expect(page.locator('.post-card')).toHaveCount(3);
  await page.getByRole('searchbox', { name: '搜索文章' }).fill('tasklane');
  await expect(page.locator('.post-card')).toHaveCount(1);
  await page.getByRole('searchbox', { name: '搜索文章' }).fill('no-match-999');
  await expect(page.getByText('还没有找到相关文章。')).toBeVisible();
  await page.getByRole('button', { name: '重置筛选' }).click();
  await expect(page.locator('.post-card')).toHaveCount(6);
});
test('article routes include readable body and working table of contents', async ({ page }) => {
  await page.goto('/blog/design-language/');
  await expect(page.locator('h1')).toHaveText('让地图拥有自己的设计语言');
  await page.getByRole('link', { name: '把判断写成可复用的规则', exact: true }).click();
  await expect(page).toHaveURL(/#section-2$/);
  await expect(page.locator('#section-2')).toBeInViewport();
});
test('ecosystem distinguishes public code and technical notes', async ({ page }) => {
  await page.goto('/open-source/');
  await page.getByRole('button', { name: '技术笔记', exact: true }).click();
  await expect(page.locator('.directory-card')).toHaveCount(2);
  await page.getByRole('button', { name: '开源代码', exact: true }).click();
  await expect(page.locator('.directory-card')).toHaveCount(4);
  await expect(page.locator('a[href="https://github.com/mapseekai/emap"]')).toHaveCount(0);
});
test('navigation dropdown closes with Escape and restores focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '产品', exact: true }).click();
  await expect(page.locator('#product-navigation')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#product-navigation')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '产品', exact: true })).toBeFocused();
});
test('mobile navigation opens, closes and navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: '打开导航' }).click();
  await expect(page.getByRole('navigation', { name: '主导航' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: '打开导航' })).toBeFocused();
  await page.getByRole('button', { name: '打开导航' }).click();
  await page.locator('.mobile-nav-products').getByRole('link', { name: 'mapseek-loom' }).click();
  await expect(page.locator('h1')).toHaveText('mapseek-loom');
});
test('all layouts fit mobile, tablet and desktop widths', async ({ page }) => {
  for (const width of [360, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['/', '/products/design/', '/blog/', '/open-source/', '/blog/async-geotiff/']) {
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${width}: ${path}`).toBe(true);
      await expect(page.locator('h1')).toBeVisible();
    }
  }
});
test('unknown routes return a real 404 and accessible recovery link', async ({ page }) => {
  const response = await page.goto('/not-a-page/');
  expect(response?.status()).toBe(404);
  await page.getByRole('link', { name: '返回首页' }).click();
  await expect(page.locator('h1')).toContainText('创造的起点');
});
test('primary pages have no automated WCAG A/AA violations', async ({ page }) => {
  for (const path of ['/', '/products/design/', '/blog/', '/open-source/', '/blog/design-language/']) {
    await page.goto(path);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(result.violations.map((issue) => ({ id: issue.id, nodes: issue.nodes.map((node) => ({ target: node.target, summary: node.failureSummary })) })), path).toEqual([]);
  }
});
test('reduced motion is respected', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
});
