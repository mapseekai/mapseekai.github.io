import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('scroll navigation has a pinned context title and accessible named links, not decorative sequence numbers', async () => {
  const html = await read('dist/index.html');
  assert.match(html, /class="craft-section-strip"/);
  assert.match(html, /class="craft-chapter-orbit"/);
  for (const name of ['总览','Cloud','Loom','Design']) assert.ok(html.includes(`aria-label="前往 ${name}"`));
  assert.match(html, /data-scroll-context="Cloud · 产品界面"/);
  assert.match(html, /data-scroll-context="Design · 产品能力"/);
});

test('each detail page exposes working scroll anchors for its own content', async () => {
  for (const product of ['cloud','loom','design']) {
    const html = await read(`dist/products/${product}/index.html`);
    for (const id of ['product-overview','product-screens','product-features','product-related']) assert.ok(html.includes(`id="${id}"`));
  }
});

test('viewport-sized screenshot and lightbox rules preserve complete uncropped images', async () => {
  const css = await read('src/craft-motion.css');
  assert.match(css, /height:\s*min\(62\.5cqi, calc\(100svh - 240px\), 660px\)/);
  assert.match(css, /object-fit:\s*contain/);
  assert.match(css, /screenshot-dialog > img[\s\S]*max-height:\s*calc\(100svh - 90px\)/);
  assert.match(css, /--craft-header-h:\s*48px/);
});

test('scroll uses the measured easing and does not smooth touch or reduced-motion input', async () => {
  const shell = await read('src/components/CraftShell.tsx');
  assert.match(shell, /lerp:\s*\.12/);
  assert.match(shell, /syncTouch:\s*false/);
  assert.match(shell, /if \(!reduce\.matches\)/);
  assert.match(shell, /lenis\?\.destroy/);
  assert.match(shell, /visibilitychange/);
  assert.match(shell, /observer\.disconnect/);
});
