import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('homepage contains the accessible local geographic fallback and labelled controls', async () => {
  const html = await read('dist/index.html');
  assert.match(html, /src="\/assets\/land-field\.svg"/);
  assert.match(html, /width="900" height="525"/);
  assert.match(html, /aria-label="暂停地图动效"/);
  assert.match(html, /aria-label="地理数据图形控制"/);
  assert.ok(!/<dialog[^>]*\sopen(?:\s|>)/.test(html));
});

test('local geographic geometry and its SVG fallback use the same coordinate domain', async () => {
  const data = JSON.parse(await read('public/data/land-path.json'));
  const svg = await read('public/assets/land-field.svg');
  assert.equal(data.width, 900);
  assert.equal(data.height, 525);
  assert.ok(data.path.startsWith('M') && data.path.endsWith('Z'));
  assert.match(data.source, /Natural Earth/);
  assert.match(svg, /viewBox="0 0 900 525"/);
  assert.ok(svg.includes(data.path));
  assert.ok(!/<script|<foreignObject|https?:\/\/(?!www\.w3\.org)/i.test(svg));
});

test('homepage preserves both tab systems and distinct accessible names', async () => {
  const html = await read('dist/index.html');
  for (const name of ['产品演示', '空间工作环节', '搜索页面']) assert.ok(html.includes(name));
  assert.equal((html.match(/role="tablist"/g) || []).length, 2);
  assert.equal((html.match(/role="tab"/g) || []).length, 6);
  assert.match(html, /交互概念演示/);
  for (const product of ['cloud', 'loom', 'design']) assert.ok(html.includes(`/products/${product}/`));
});

test('motion ships with reduction and cleanup provisions instead of hidden page content', async () => {
  const css = await read('src/styles.css');
  const field = await read('src/components/SpatialField.tsx');
  const motion = await read('src/components/SiteMotion.tsx');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(field, /cancelAnimationFrame/);
  assert.match(field, /visibilitychange/);
  assert.match(field, /IntersectionObserver/);
  assert.match(field, /1000 \/ 24/);
  assert.match(motion, /animation\.cancel/);
  assert.ok(!/\[data-reveal\][^{]*\{[^}]*opacity:\s*0/.test(css));
});
