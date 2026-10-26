import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('chapter travel includes an explicit vertical hold and staggered horizontal docking', async () => {
  const source = await read('src/components/CraftShell.tsx');
  assert.match(source, /entry >= 1 \? 'vertical'/);
  assert.match(source, /rotation = -90 \* turn \* \(1 - dock\)/);
  assert.match(source, /const dock = ease\(clamp/);
  assert.match(source, /data-chapter=\{entry.id\}/);
  assert.ok(!source.includes('rotation = -curve * 68'));
});

test('boundary marks belong only to section junctions and remain hidden from assistive technology', async () => {
  const component = await read('src/components/SectionBoundary.tsx');
  assert.match(component, /aria-hidden="true"/);
  assert.equal((component.match(/section-boundary-tick edge-/g) || []).length, 2);
  const html = await read('dist/index.html');
  assert.equal((html.match(/data-section-boundary="true"/g) || []).length, 4);
  assert.equal((html.match(/class="section-boundary-tick edge-left"/g) || []).length, 4);
  assert.equal((html.match(/class="section-boundary-tick edge-right"/g) || []).length, 4);
  assert.equal((html.match(/data-media-state="reserved"/g) || []).length, 3);
});

test('junction ticks are small T shapes, with a reversible scroll-bound reveal and no new timer', async () => {
  const css = await read('src/craft-motion.css');
  const source = await read('src/components/CraftShell.tsx');
  assert.match(css, /width: 11px; height: 11px/);
  assert.match(css, /width: 1px; height: 6px/);
  assert.match(css, /width: 11px; height: 1px/);
  assert.match(css, /pointer-events: none/);
  assert.match(source, /const visible = enter \* leave/);
  assert.match(source, /delete site.dataset.boundariesReady/);
  assert.ok(!/setInterval\(|setTimeout\(/.test(source));
});

test('rotated chapter hit areas use actual glyph bounds and remain keyboard navigable', async () => {
  const source = await read('src/components/CraftShell.tsx');
  assert.match(source, /Math.abs\(Math.sin\(radians\)\)/);
  assert.match(source, /boxes.push/);
  assert.match(source, /link.style.pointerEvents = 'auto'/);
  const html = await read('dist/index.html');
  for (const name of ['总览', 'Cloud', 'Loom', 'Design']) assert.ok(html.includes(`aria-label="前往 ${name}"`));
});
