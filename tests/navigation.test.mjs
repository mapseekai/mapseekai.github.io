import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('all public routes share the same working product/resource/pricing/blog navigation', async () => {
  for (const route of ['', 'resources/', 'pricing/', 'blog/', 'open-source/', 'products/cloud/', 'products/loom/', 'products/design/']) {
    const html = await read(`dist/${route}index.html`);
    assert.match(html, /aria-label="主导航"/);
    assert.match(html, /id="nav-products-panel"[^>]*hidden/);
    assert.match(html, /id="nav-resources-panel"[^>]*hidden/);
    for (const label of ['产品','资源','价格','博客']) assert.ok(html.includes(label));
    assert.ok(html.includes('href="/pricing/"') && html.includes('href="/resources/"'));
    assert.match(html, /class="footer-directory"/);
    for (const label of ['页脚产品','页脚MAPSEEK','页脚资源','页脚社区']) assert.ok(html.includes(`aria-label="${label}"`));
  }
});

test('right ruler restores real progress digits but product chapters remain unnumbered', async () => {
  const html = await read('dist/index.html');
  assert.match(html, /role="scrollbar"[^>]*aria-label="页面阅读进度"/);
  assert.match(html, /aria-controls="main-content"/);
  assert.equal((html.match(/class="ruler-tick(?: major)?"/g) || []).length, 101);
  assert.equal((html.match(/class="ruler-digit-window"/g) || []).length, 3);
  for (const filename of ['src/pages/Home.tsx','src/pages/Product.tsx']) {
    assert.ok(!/0\{(?:index|i)/.test(await read(filename)));
  }
});

test('pricing placeholder does not invent monetary plans, purchase routes or social accounts', async () => {
  const html = await read('dist/pricing/index.html');
  assert.match(html, /价格信息待补充/);
  assert.ok(!/¥|\$\d|\d+元|checkout|stripe|立即购买/.test(html));
  const nav = await read('src/content/navigation.ts');
  assert.ok(!/discord\.gg|instagram\.com|youtube\.com|hello@/.test(nav));
});

test('reading glow and digit transitions are explicit and reduced-motion aware', async () => {
  const css = await read('src/navigation.css');
  assert.match(css, /box-shadow:\s*0 0 6px var\(--craft-accent\)/);
  assert.match(css, /ruler-digit-strip[\s\S]*transition:\s*transform 280ms/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  const shell = await read('src/components/CraftShell.tsx');
  for (const event of ['pointerdown','pointermove','pointerup','keydown']) assert.ok(shell.includes(`removeEventListener('${event}'`));
});
