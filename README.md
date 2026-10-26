# MapseekAI Website

[在线官网](https://mapseekai.github.io/) · [设计规范](design.md) · [资源来源](docs/asset-sources.md)

MapseekAI 的产品官网，以 Mapseek Cloud、Mapseek Loom 和 Mapseek Design 为核心。首页采用真实卫星影像与三个独立的可操作示例，分别展示数据组织、几何编辑和地图设计。

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

交互预览明确标注为功能示意。Cloud 的卫星影像来自 NASA/USGS，叠加范围与点位为示例；Loom 和 Design 的街区为合成示例数据，节点坐标是画布局部坐标。它们不调用真实产品服务，也不是产品运行截图。

既有 `/blog/`、文章详情和 `/open-source/` 路由继续保留，但不再作为首页展示模块。

## 代码组织

- `src/pages/Home.tsx`：三产品首页。
- `src/pages/Product.tsx`：产品详情。
- `src/components/LandingShell.tsx`：产品导航和页脚。
- `src/components/ProductExperiences.tsx`：三个交互示例与矢量地图。
- `src/atelier.css`：产品官网的独立布局与动效。
- `src/content/site.ts`：产品事实、文章和链接。
- `src/components/SiteMotion.tsx`：一次性入场效果及清理逻辑。

首页影像使用本地响应式 WebP。页面不需要运行时第三方图片或字体请求；减少动态效果时关闭空间位移与入场效果，静态正文和地图在关闭 JavaScript 后仍可阅读。

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

`pnpm test` 验证静态路由、内部链接、元数据、资源、三个交互示例的初始状态、无 JavaScript 回退与动效约定。

浏览器回归脚本保存在 `tests/site.spec.ts`，通过 `pnpm test:e2e` 运行。测试服务使用独立端口 5190，运行前应确保它未被其他服务占用。

本次产品版的实际浏览器检查通过 Ego 完成，结果和边界见 [验证记录](docs/product-edition-validation.md)。自动无障碍扫描不能代替人工审查。

## 发布

推送到 `main` 后，现有 [GitHub Actions 工作流](.github/workflows/pages.yml) 会安装锁定依赖、构建、执行静态测试，并将 `dist/` 发布到 GitHub Pages。

源码仓库：`mapseekai/mapseekai.github.io`。部署说明见 [docs/deployment.md](docs/deployment.md)。本地截图、下载、日志与环境配置保留在忽略目录中，不进入公开仓库。
