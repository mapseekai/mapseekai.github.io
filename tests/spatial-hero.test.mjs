import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("spatial hero presents original map layers, not screenshots or external image carousels", async () => {
  const html = await read("dist/index.html");
  assert.match(html, /class="craft-hero spatial-hero"/);
  assert.equal((html.match(/class="atlas-sheet atlas-/g) || []).length, 5);
  for (const id of [
    "terrain",
    "geometry",
    "contours",
    "cartography",
    "parcels",
  ])
    assert.ok(html.includes(`atlas-${id}`));
  assert.match(html, /非产品截图/);
  assert.match(html, /暂停首屏动效/);
  assert.equal((html.match(/data-media-state="reserved"/g) || []).length, 3);
});
test("motion remains local and cleans up frames, observers and listeners", async () => {
  const source = await read("src/components/SpatialHero.tsx");
  for (const text of [
    "cancelAnimationFrame",
    "observer.disconnect",
    "resize.disconnect",
    "removeEventListener",
    "visibilitychange",
    "prefers-reduced-motion",
    "IntersectionObserver",
  ])
    assert.ok(source.includes(text));
  assert.ok(!/fetch\(|Math.random\(|setInterval\(|new Image\(/.test(source));
  assert.match(source, /!document.hidden/);
  assert.match(source, /!paused/);
});
test("paused and reduced-motion states retain readable static output", async () => {
  const source = await read("src/components/SpatialHero.tsx");
  const css = await read("src/spatial-hero.css");
  assert.match(source, /animationState/);
  assert.match(source, /aria-pressed/);
  assert.match(source, /setReduced/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /spatial-hero:not\(\[data-motion\]\)/);
  const html = await read("dist/index.html");
  assert.match(html, /为地理空间工作/);
  assert.match(html, /浏览产品界面/);
});
test("all three product entries retain real destinations and mouse/keyboard emphasis", async () => {
  const s = await read("src/components/SpatialHero.tsx");
  assert.match(s, /onPointerEnter/);
  assert.match(s, /onFocus/);
  const html = await read("dist/index.html");
  for (const id of ["cloud", "loom", "design"])
    assert.ok(html.includes(`href="#${id}"`));
});
