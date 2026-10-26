import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// PhotoCraft-inspired product pages reserve real screenshot slots; existing demos remain in explicit disclosures.
test("Cloud resource selection and visibility controls update the sample", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/products/cloud/");
  await page.locator(".craft-demo summary").click();
  await expect(page.locator("h1")).toContainText("mapseek-cloud");
  await page.locator(".catalog-select").nth(1).click();
  await expect(page.locator(".resource-detail > strong")).toHaveText(
    "研究范围",
  );
  for (const name of ["高山湖泊影像", "研究范围", "观测位置"]) {
    await page.getByRole("button", { name: `隐藏${name}` }).click();
    await expect(
      page.getByRole("button", { name: `显示${name}` }),
    ).toHaveAttribute("aria-pressed", "false");
    await page.getByRole("button", { name: `显示${name}` }).click();
  }
  expect(errors).toEqual([]);
});

test("Loom node editing supports keyboard, undo and reset", async ({
  page,
}) => {
  await page.goto("/products/loom/");
  await page.locator(".craft-demo summary").click();
  const node = page.getByRole("button", { name: "编辑节点 1", exact: true });
  await node.focus();
  await page.keyboard.press("ArrowRight");
  await expect(node).toHaveAttribute("cx", "358");
  await page.getByRole("button", { name: "撤销节点修改" }).click();
  await expect(node).toHaveAttribute("cx", "356");
  await node.focus();
  await page.keyboard.press("Shift+ArrowDown");
  await expect(node).toHaveAttribute("cy", "241");
  await page.getByRole("button", { name: "重置几何" }).click();
  await expect(node).toHaveAttribute("cy", "231");
  await expect(
    page.getByRole("button", { name: "撤销节点修改" }),
  ).toBeDisabled();
});

test("Design switches palette, labels and exports a self-contained SVG", async ({
  page,
}) => {
  await page.goto("/products/design/");
  await page.locator(".craft-demo summary").click();
  for (const mood of ["paper", "night", "forest"]) {
    await page.locator(`.mood-option.${mood}`).click();
    await expect(page.locator(`.artboard-surface.mood-${mood}`)).toBeVisible();
  }
  await page.getByLabel("显示地图标注").uncheck();
  await expect(page.locator(".map-artboard svg text")).toHaveCount(0);
  await page.getByLabel("显示地图标注").check();
  await expect(page.locator(".map-artboard svg text")).toHaveCount(5);
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "导出示例 SVG" }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toBe("mapseek-forest-sample.svg");
  await expect(page.getByRole("status")).toHaveText("已生成示例 SVG");
});

test("product routes load directly and refresh with real content", async ({
  page,
}) => {
  for (const product of ["cloud", "loom", "design"]) {
    await page.goto(`/products/${product}/`);
    await expect(page.locator("h1")).toHaveText(`mapseek-${product}`);
    await page.reload();
    await expect(page.locator("h1")).toHaveText(`mapseek-${product}`);
    await page.locator(".craft-demo summary").click();
    await expect(
      page.getByText(
        "交互概念演示，用于说明产品方向。示意数据在当前页面运行，未连接产品服务。",
      ),
    ).toBeVisible();
  }
});

test("blog filters, search, empty state, and reset work", async ({ page }) => {
  await page.goto("/blog/");
  await expect(page.locator(".post-card")).toHaveCount(6);
  await page.getByRole("button", { name: "工程手记", exact: true }).click();
  await expect(page.locator(".post-card")).toHaveCount(3);
  await page.getByRole("searchbox", { name: "搜索文章" }).fill("tasklane");
  await expect(page.locator(".post-card")).toHaveCount(1);
  await page.getByRole("searchbox", { name: "搜索文章" }).fill("no-match-999");
  await expect(page.getByText("还没有找到相关文章。")).toBeVisible();
  await page.getByRole("button", { name: "重置筛选" }).click();
  await expect(page.locator(".post-card")).toHaveCount(6);
});

test("article table of contents and ecosystem filters remain available", async ({
  page,
}) => {
  await page.goto("/blog/design-language/");
  await page
    .getByRole("link", { name: "把判断写成可复用的规则", exact: true })
    .click();
  await expect(page).toHaveURL(/#section-2$/);
  await expect(page.locator("#section-2")).toBeInViewport();
  await page.goto("/open-source/");
  await page.getByRole("button", { name: "技术笔记", exact: true }).click();
  await expect(page.locator(".directory-card")).toHaveCount(2);
  await page.getByRole("button", { name: "开源代码", exact: true }).click();
  await expect(page.locator(".directory-card")).toHaveCount(4);
});

test("mobile navigation closes with Escape and restores focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "打开导航" }).click();
  await expect(
    page.getByRole("navigation", { name: "产品导航" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "打开导航" })).toBeFocused();
  await page.getByRole("button", { name: "打开导航" }).click();
  await page.locator('#craft-navigation a[href="/#design"]').click();
  await expect(page).toHaveURL(/#design$/);
  await expect(page.getByRole("button", { name: "打开导航" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
});

test("all layouts fit mobile, tablet and desktop widths", async ({ page }) => {
  for (const width of [320, 375, 414, 768, 1024, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      "/",
      "/products/cloud/",
      "/products/loom/",
      "/products/design/",
      "/blog/",
    ]) {
      await page.goto(path);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${width}: ${path}`,
      ).toBe(true);
      await expect(page.locator("h1")).toBeVisible();
    }
  }
});

test("unknown routes return a real 404 and a recovery link", async ({
  page,
}) => {
  expect((await page.goto("/not-a-page/"))?.status()).toBe(404);
  await page.getByRole("link", { name: "返回首页" }).click();
  await expect(page.locator("h1")).toContainText("为地理空间工作");
});

test("primary pages have no automated WCAG A/AA violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of [
    "/",
    "/products/cloud/",
    "/products/loom/",
    "/products/design/",
  ]) {
    await page.goto(path);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(
      result.violations.map((issue) => ({
        id: issue.id,
        nodes: issue.nodes.map((node) => node.target),
      })),
      path,
    ).toEqual([]);
  }
});

test("reduced motion preserves the functional product states without animation", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/products/design/");
  await page.locator(".craft-demo summary").click();
  await page.locator(".mood-option.night").click();
  await expect(page.locator(".artboard-surface.mood-night")).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === "running").length,
    ),
  ).toBe(0);
});


test("theme preference persists and all screenshot slots remain honest", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('[data-media-state="reserved"]')).toHaveCount(3);
  await page.getByRole("button", { name: "切换为深色模式" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-craft-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-craft-theme", "dark");
  await page.getByRole("button", { name: "切换为浅色模式" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-craft-theme", "light");
});

// Scroll-fidelity regression: use actual geometry, not only page scrollWidth.
test("fixed chapter title follows the current product and screenshot context", async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => page.locator('.craft-header').evaluate(el => el.getBoundingClientRect().height)).toBe(48);
  for (const id of ['cloud', 'loom', 'design']) {
    await page.evaluate(id => window.scrollTo({ top: document.getElementById(id)!.getBoundingClientRect().top + scrollY - 104, behavior: 'instant' }), id);
    await expect(page.locator('.craft-site')).toHaveAttribute('data-active-chapter', id);
    await expect(page.locator(`.orbit-link[href="#${id}"]`)).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('.section-strip-title')).toContainText(id[0].toUpperCase() + id.slice(1));
  }
});

test("whole screenshot figure fits below fixed navigation on short and landscape screens", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width,height] of [[1280,720],[1366,768],[375,667],[812,375]]) {
    await page.setViewportSize({ width,height });
    await page.goto('/');
    for (const product of ['cloud','loom','design']) {
      const figure = page.locator(`[data-screenshot="${product}"]`);
      await figure.evaluate(el => window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - 104, behavior: 'instant' }));
      const rect = await figure.boundingBox();
      expect(rect).not.toBeNull();
      expect(rect!.y).toBeGreaterThanOrEqual(82);
      expect(rect!.y + rect!.height).toBeLessThanOrEqual(height + 1);
    }
  }
});

test("reducing motion at runtime returns the document to native scrolling", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-scroll-engine', 'lenis');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveAttribute('data-scroll-engine', 'native');
});
