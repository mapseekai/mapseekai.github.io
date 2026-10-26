# MapseekAI Website

[在线官网](https://mapseekai.github.io/) · [设计规范](design.md) · [截图替换](docs/product-screenshots.md) · [验证记录](docs/photocraft-validation.md)

MapseekAI 的产品官网，以 Cloud、Loom、Design 三款独立产品为核心。本版参考用户指定的 PhotoCraft 官方产品页，以浅灰纸面、粗字、细线与章节编号组织内容，支持明暗主题和章节导航。

## 本地开发

Node.js 22.12+，pnpm 版本由 `package.json` 固定。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

开发服务默认运行在 `http://127.0.0.1:5188/`。

```bash
pnpm build
pnpm test
pnpm preview
```

构建会检查 TypeScript、编译客户端与服务端渲染入口，然后生成 12 个静态页面和独立 404 页。预览服务也默认使用 5188 端口；开发与预览不要同时占用该端口。通过 `PORT=5190 pnpm preview` 可以使用另一个端口。

## 页面和交互

首页只围绕三个产品展开。各产品拥有独立详情页：

| 产品 | 地址 | 官网交互示例 |
| --- | --- | --- |
| Cloud | `/products/cloud/` | 资源选择、影像/研究范围/观测位置图层显隐 |
| Loom | `/products/loom/` | 节点拖拽、键盘移动、撤销与重置、属性查看 |
| Design | `/products/design/` | 三套地图配色、标注开关、自包含 SVG 导出 |

首页和详情页预留三张真实产品截图，配置集中在 `src/content/product-media.ts`。没有截图时显示明确占位，不请求不存在的图片。放入真实截图后自动支持放大查看、Esc 关闭与加载失败回退，详见 [截图替换](docs/product-screenshots.md)。

原有交互预览保留在详情页的折叠区，明确标注为功能示意，而不是产品截图。Cloud 的卫星影像来自 NASA/USGS，叠加范围与点位为示例；Loom 和 Design 的街区为合成示例数据，节点坐标是画布局部坐标。它们不调用真实产品服务，也不是产品运行截图。

既有 `/blog/`、文章详情和 `/open-source/` 路由继续保留，但不再作为首页展示模块。

## 代码组织

- `src/pages/Home.tsx`：三产品首页。
- `src/pages/Product.tsx`：产品详情。
- `src/components/CraftShell.tsx`：产品导航、主题切换、章节读数和页脚。
- `src/components/ProductScreenshot.tsx`：截图占位、实际图片与原图查看。
- `src/content/product-media.ts`：三个共享截图配置。
- `src/components/ProductExperiences.tsx`：三个交互示例与矢量地图。
- `src/craft.css`：本版布局、明暗主题和响应式样式；旧样式仅用于保留页面及交互演示。
- `src/content/site.ts`：产品事实、文章和链接。
- `src/components/SiteMotion.tsx`：一次性入场效果及清理逻辑。

页面不需要运行时第三方图片或字体请求。主题偏好保存在本地；减少动态效果时停用过渡与入场效果。关闭 JavaScript 后仍可阅读全部产品和截图说明。

## 生产配置

复制 `.env.example` 为 `.env.local` 后，可配置自己拥有的部署地址：

```dotenv
VITE_SITE_URL=https://your-owned-domain.example
VITE_CLOUD_URL=https://your-cloud.example
VITE_LOOM_URL=https://your-loom.example
VITE_DESIGN_URL=https://your-design.example
```

以上是格式示例。产品地址为空时，主入口指向可访问的站内产品笔记。生产域名用于 canonical、Open Graph、`sitemap.xml` 和 `robots.txt`。当前官网采用站点根目录部署。

## 验证

`pnpm test` 验证静态路由、内部链接、元数据、截图占位、主题初始化、折叠示例、清理逻辑与 SVG 导出约定。

浏览器回归脚本保存在 `tests/site.spec.ts`，通过 `pnpm test:e2e` 运行。测试服务使用独立端口 5190，运行前应确保它未被其他服务占用。

本次实际浏览器检查通过 Ego 完成，结果和边界见 [验证记录](docs/photocraft-validation.md)。本轮未运行 Playwright 套件。自动无障碍扫描不能代替人工审查。

## 发布

推送到 `main` 后，现有 [GitHub Actions 工作流](.github/workflows/pages.yml) 会安装锁定依赖、构建、执行静态测试，并将 `dist/` 发布到 GitHub Pages。

源码仓库：`mapseekai/mapseekai.github.io`。部署说明见 [docs/deployment.md](docs/deployment.md)。本地截图、下载、日志与环境配置保留在忽略目录中，不进入公开仓库。
