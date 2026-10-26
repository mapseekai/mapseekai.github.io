# MapseekAI Website

[在线官网](https://mapseekai.github.io/) · [部署流程](docs/deployment.md)

基于 React 和 TypeScript 的 MapseekAI 品牌官网，采用 Hallmark Cobalt 参考的浅色布局、Mapseek 绿色品牌与响应式交互设计。重点呈现 `mapseek-cloud`、`mapseek-loom`、`mapseek-design`，并提供技术生态与博客入口。

## 本地运行

使用 Node.js 22.12+。依赖版本由 `pnpm-lock.yaml` 锁定。

```bash
pnpm install --frozen-lockfile
pnpm dev
```

开发地址：`http://127.0.0.1:5188`。

## 构建与预览

```bash
pnpm build
pnpm preview
```

`build` 先检查 TypeScript，再编译客户端和构建时渲染入口，最后生成 **12 个静态页面与独立 404 页面**。`dist/` 可由任意静态托管服务提供；无需运行产品后台。页面正文在 HTML 中，JavaScript 负责交互演示、筛选与导航。

`preview` 使用项目自带的静态服务器，默认仅监听 `127.0.0.1:5188`；找不到的路径返回 HTTP 404。不要把它作为互联网生产服务器。开发与预览共用端口，启动另一种模式前请先停止前一种。

## 页面

| 页面 | 路径 |
| --- | --- |
| 首页 | `/` |
| 三个产品 | `/products/cloud/`、`/products/loom/`、`/products/design/` |
| 开放生态 | `/open-source/` |
| 博客列表 | `/blog/` |
| 6 篇文章 | `/blog/<slug>/` |
| 404 | `404.html` |

## 交互

首页演示支持 Cloud 图层显隐、Loom 示例要素检查、Design 三套地图配色、缩放与重置。演示采用程序化 SVG 示例地图；不向外部地图平台发送请求，不调用产品 API，不加载真实项目数据。

产品选择使用可键盘操作的标签页；导航支持手机菜单、Escape 关闭与焦点返回。博客支持分类、全文关键词搜索、空状态与重置。开放生态支持开源代码与技术笔记筛选。

## 内容维护

- `src/content/site.ts`：产品定位、项目链接、博客正文、SEO 元信息。
- `src/tokens.css`：品牌颜色、字体、间距与地图配色 Token。
- `src/base.css`：Hallmark 生成的基础排版与可访问性规则。
- `src/styles.css`：共享组件、页面布局和响应式断点。
- `src/components/MapScene.tsx`：示意地图、图层与配色。
- `src/components/MapPreview.tsx`：概念演示控件。
- `design.md`：统一设计系统，后续页面遵循的视觉规范。
- `docs/design.md`：设计与信息架构说明。
- `docs/content-policy.md`：内容真实性、入口配置与上线检查。

博客是本次官网编写的编辑内容，不是历史发布记录；发布前应由团队审阅。`mapseek-design` 是展示名称，不会修改现有 `map-design` 仓库。展示名称 `async-geotiff-rust` 对应当前仓库名称 `async-geotiff-rs`。

`emap` 和 `async-geotiff-rs` 在核对时为私有项目，因此使用站内技术笔记入口。tasklane、raster-style、cartography.md、map-sprite 使用已核对的公开仓库链接。项目许可和使用条件以各仓库为准。

## 真实产品入口与域名

复制 `.env.example` 为 `.env.local`，填写自己拥有的真实部署地址：

```dotenv
VITE_SITE_URL=https://your-owned-domain.example
VITE_CLOUD_URL=https://your-cloud.example
VITE_LOOM_URL=https://your-loom.example
VITE_DESIGN_URL=https://your-design.example
```

这些是格式示例，不能直接作为上线地址。未配置产品地址时，按钮保持为可访问的站内产品笔记，不展示虚构的登录或试用入口。仅接受 HTTP(S) 产品链接。

设置 `VITE_SITE_URL` 后重新构建，会生成 canonical、Open Graph URL 和 `sitemap.xml`，并在 `robots.txt` 中引用站点地图。未提供域名时不生成假域名。官网部署在 GitHub Pages 组织站点根目录，当前不使用项目子路径。

## 测试

```bash
pnpm build
pnpm test
pnpm exec playwright install chromium
pnpm test:e2e
```

静态测试验证页面、内部链接、文章、404 和私有项目入口。浏览器测试验证交互、直达/刷新、导航、六种视口宽度、搜索、真实 404、减少动态效果偏好和自动化 WCAG A/AA 检查。自动化扫描不代替人工无障碍审查。

使用系统已安装的 Google Chrome 运行测试：`PLAYWRIGHT_CHANNEL=chrome pnpm test:e2e`。

测试服务器绑定 `127.0.0.1:5190`，不会复用未知的已有服务。Playwright 报告位于 `playwright-report/`。

## 部署

`main` 分支通过 [GitHub Actions](.github/workflows/pages.yml) 自动构建、测试并部署到 <https://mapseekai.github.io/>。详细配置见 [部署说明](docs/deployment.md)。

其他托管方式也可以把 `dist/` 作为静态站点发布。Nginx 配置示例见 `docs/nginx.conf`。Cloudflare Pages、Netlify 等需将 404 配置为真正的 404，不要把所有未知路径重写为首页。静态页面可直接通过目录下的 `index.html` 访问。

项目未接入注册、登录、订阅、表单提交、分析追踪或产品后端。所有可见主按钮都指向可用的本地页面、锚点或已核对的公开仓库。推送到 `main` 后会自动构建并发布官网。

## Hallmark Cobalt 改版

2026-10-26 按 Hallmark Cobalt 主题重新组织官网：保留 Mapseek 绿色，将重复地图卡片改成字符地理图形、产品索引与一个交互工作台。

新增可暂停的字符 / 点阵地图、产品切换反馈、工作流阶段切换与连线、导航微交互、一次性区块入场和 Cmd/Ctrl+K 快速访问。减少动态效果、离屏和后台状态都有对应处理。所有素材本地提供，不新增第三方地图请求或动画库。

- [设计系统](design.md)
- [素材来源](docs/asset-sources.md)
- [本轮验证与边界](docs/cobalt-validation.md)

Hallmark 是全局设计 Skill，不是站点运行依赖；没有向 AGENTS.md 注入规则。本地原始截图和逐项结果保存在被 Git 忽略的 `artifacts/cobalt-20261026/`。原有测试文件未修改，新增改版回归测试由 `pnpm test` 一起运行。本轮浏览器检查使用 Ego，未运行原 Playwright 套件。
