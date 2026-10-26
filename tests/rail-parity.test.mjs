import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
test('section and footer rules span the viewport without replacing original frame junctions', async () => {
 const html=await read('dist/index.html');assert.equal((html.match(/class="section-divider"/g)||[]).length,5);assert.equal((html.match(/data-section-boundary="true"/g)||[]).length,4);
 assert.equal((html.match(/data-media-state="reserved"/g)||[]).length,3);
 const css=await read('src/craft-motion.css');assert.match(css,/\.section-divider[^}]*width: 100vw/);assert.match(css,/\.section-divider[^}]*pointer-events: none/);
});
test('divider alignment excludes native scrollbar width and cleans up on unmount', async()=>{
 const source=await read('src/components/SiteMotion.tsx');assert.match(source,/document.documentElement.clientWidth/);assert.match(source,/host.clientLeft/);assert.match(source,/dividerObserver.disconnect\(\)/);assert.match(source,/cancelAnimationFrame\(dividerFrame\)/);
});
test('right lettering is anchored to the actual ruler rather than the content gutter', async()=>{
 const s=await read('src/components/CraftShell.tsx');assert.match(s,/const railX = rulerLeft \+ rulerWidth \/ 2/);assert.match(s,/const right = rulerLeft/);assert.match(s,/const headingSize = 34/);assert.match(s,/16 \/ headingSize, vertical = 20 \/ headingSize/);assert.ok(!s.includes('gutter * .45'));assert.ok(!s.includes('width - 74'));
});
test('product-independent pages also receive the full-width footer separator',async()=>{
 for(const path of ['resources','pricing','blog','open-source']){const html=await read(`dist/${path}/index.html`);assert.match(html,/<footer[^>]*>[\s\S]*?class="section-divider"/);}
});
