import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('homepage focuses on three products and carries no fabricated interfaces or proof metrics', async () => {
  const html = await read('dist/index.html');
  assert.match(html, /为地理空间工作/);
  for (const id of ['cloud', 'loom', 'design']) {
    assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(`/products/${id}/`));
    assert.ok(html.includes(`data-screenshot="${id}"`));
  }
  assert.equal((html.match(/class="product-chapter /g) || []).length, 3);
  for (const removed of ['atelier-hero', 'spatial-field', 'workflow-section', 'journal-section', 'ecosystem-section', 'cloud-experience', 'loom-experience', 'design-experience']) assert.ok(!html.includes(`class="${removed}`), removed);
  assert.ok(!html.includes('500+') && !html.includes('10M+'));
});

test('three missing screenshots render honest bounded placeholders without broken image requests', async () => {
  const html = await read('dist/index.html');
  assert.equal((html.match(/data-media-state="reserved"/g) || []).length, 3);
  assert.equal((html.match(/预留给真实产品截图/g) || []).length, 3);
  assert.ok(!/src="\/screenshots\//.test(html));
  assert.ok(!html.includes('placeholder-word') && !html.includes('placeholder-size'));
  const config = await read('src/content/product-media.ts');
  assert.equal((config.match(/src: null/g) || []).length, 3);
});

test('product pages use the same screenshot slots and keep demos clearly separated and collapsed', async () => {
  for (const id of ['cloud', 'loom', 'design']) {
    const html = await read(`dist/products/${id}/index.html`);
    assert.ok(html.includes(`data-screenshot="${id}"`));
    assert.ok(html.includes(`class="experience ${id}-experience"`));
    assert.ok(html.includes('本地示例，不是产品截图'));
    assert.match(html, /未连接产品服务/);
    assert.ok(/<details class="craft-demo" id="product-preview">/.test(html));
    assert.ok(!/<details[^>]*\sopen/.test(html));
  }
});

test('light/dark theme is first-party, pre-paint, and survives storage restrictions', async () => {
  const html = await read('dist/index.html');
  const theme = await read('public/assets/theme-init.js');
  assert.ok(html.indexOf('/assets/theme-init.js') < html.indexOf('<body>'));
  assert.match(theme, /mapseek-theme/);
  assert.match(theme, /catch/);
  assert.match(theme, /dataset\.craftTheme/);
  assert.ok(!/https?:\/\//.test(theme));
});

test('motion and reading indicators clean up and respect reduced-motion preferences', async () => {
  const css = await read('src/craft.css');
  const motion = await read('src/components/SiteMotion.tsx');
  const shell = await read('src/components/CraftShell.tsx');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(motion, /animation\.cancel/);
  assert.match(motion, /observer\.disconnect/);
  assert.match(shell, /cancelAnimationFrame/);
  assert.match(shell, /removeEventListener/);
  assert.ok(!/\[data-reveal\][^{]*\{[^}]*opacity:\s*0/.test(css));
  assert.ok(!/transition:\s*all/.test(css));
});

test('SVG export still resolves tokens and releases its object URL', async () => {
  const source = await read('src/components/ProductExperiences.tsx');
  assert.match(source, /XMLSerializer/);
  assert.match(source, /revokeObjectURL/);
  assert.match(source, /image\/svg\+xml/);
});


test('brand mark, wordmark, and favicon preserve the exact approved Mapseek source files', async () => {
  const hashes = {
    'public/assets/brand/mapseek-symbol.svg': '9c070b1eb5dc1a77625e7ec29948ff2b9308a2606bffb85d1d58d3beb66db904',
    'public/assets/brand/mapseek-wordmark.svg': '45a60ed2fa41cc30c23fa780e736ae2f9c71eda626b8e158fe564d3388684476',
    'public/favicon.svg': '9c070b1eb5dc1a77625e7ec29948ff2b9308a2606bffb85d1d58d3beb66db904',
  };
  for (const [file, expected] of Object.entries(hashes)) {
    assert.equal(createHash('sha256').update(await read(file)).digest('hex'), expected, file);
  }
  const html = await read('dist/index.html');
  assert.match(html, /src="\/assets\/brand\/mapseek-wordmark.svg"/);
  assert.match(html, /src="\/assets\/brand\/mapseek-symbol.svg"/);
});

test('the product presentation has no sequence labels or numbered navigation', async () => {
  for (const file of ['src/pages/Home.tsx','src/pages/Product.tsx','src/components/CraftShell.tsx']) {
    const source = await read(file);
    assert.ok(!source.includes('nav-number') && !source.includes('index-number'), file);
    assert.ok(!/0\{(?:index|i|products\.indexOf)/.test(source), file);
  }
  const html = await read('dist/index.html');
  const text = html.replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ');
  assert.ok(!/\b0[0-9]\b/.test(text), 'No displayed decorative zero-padded numbers');
  for (const name of ['总览', 'Cloud', 'Loom', 'Design']) assert.ok(html.includes(`前往 ${name}`));
  assert.ok(!html.includes('rail-percent') && !html.includes('rail-origin'));
});
