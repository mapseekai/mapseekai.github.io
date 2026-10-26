import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("product edition renders exactly the three products without the retired marketing modules", async () => {
  const html = await read("dist/index.html");
  for (const id of ["cloud", "loom", "design"]) {
    assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(`/products/${id}/`));
  }
  assert.equal((html.match(/class="product-chapter /g) || []).length, 3);
  assert.ok(!html.includes('class="spatial-field"'));
  assert.ok(!html.includes('class="workflow-section"'));
  assert.ok(!html.includes('class="journal-section"'));
  assert.ok(!html.includes('class="ecosystem-section"'));
  assert.match(html, /功能交互示意/);
  assert.match(html, /NASA Earth Observatory \/ USGS/);
});

test("hero images are local, bounded, responsive assets with accessible fallback markup", async () => {
  const html = await read("dist/index.html");
  assert.match(html, /fetchPriority="high"/i);
  assert.match(html, /alpine-lakes-small\.webp/);
  assert.match(html, /南阿尔卑斯山脉与冰川湖泊的卫星影像/);
  for (const filename of ["alpine-lakes.webp", "alpine-lakes-small.webp"]) {
    const path = new URL(
      `../public/assets/atelier/${filename}`,
      import.meta.url,
    );
    const data = await readFile(path);
    assert.equal(data.subarray(0, 4).toString(), "RIFF");
    assert.equal(data.subarray(8, 12).toString(), "WEBP");
    assert.ok((await stat(path)).size < 1000000);
  }
});

test("initial SSR contains all controls, six keyboard-editable nodes, and an accessible style picker", async () => {
  const html = await read("dist/index.html");
  for (const name of [
    "隐藏高山湖泊影像",
    "隐藏研究范围",
    "隐藏观测位置",
    "重置几何",
    "撤销节点修改",
  ])
    assert.ok(html.includes(`aria-label="${name}"`));
  assert.equal((html.match(/aria-label="编辑节点 \d"/g) || []).length, 6);
  assert.match(html, /class="mood-option forest"/);
  assert.match(html, /class="mood-option paper"/);
  assert.match(html, /class="mood-option night"/);
  assert.match(html, /导出示例 SVG/);
});

test("product routes use the same functional experiences and retain honest demo disclosures", async () => {
  for (const id of ["cloud", "loom", "design"]) {
    const html = await read(`dist/products/${id}/index.html`);
    assert.ok(html.includes(`class="experience ${id}-experience"`));
    assert.ok(html.includes(`mapseek-${id}`));
    assert.match(html, /未连接产品服务/);
    assert.ok(!html.includes('class="workspace'));
  }
});

test("motion has a reduced-motion fallback, cleanup, and visible SSR content", async () => {
  const css = await read("src/atelier.css");
  const motion = await read("src/components/SiteMotion.tsx");
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(motion, /animation\.cancel/);
  assert.match(motion, /observer\.disconnect/);
  assert.ok(!/\[data-reveal\][^{]*\{[^}]*opacity:\s*0/.test(css));
  assert.ok(!/transition:\s*all/.test(css));
});

test("SVG export resolves palette tokens and releases its object URL", async () => {
  const source = await read("src/components/ProductExperiences.tsx");
  assert.match(source, /XMLSerializer/);
  assert.match(source, /revokeObjectURL/);
  assert.match(source, /image\/svg\+xml/);
});
