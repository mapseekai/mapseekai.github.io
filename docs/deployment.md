# GitHub Pages 部署

官网：<https://mapseekai.github.io/>

源码：<https://github.com/mapseekai/mapseekai.github.io>

## 发布流程

`main` 分支保存源码。`.github/workflows/pages.yml` 在推送后安装锁定依赖，执行 TypeScript 检查、静态构建和页面测试，再把 `dist/` 作为 Pages Artifact 发布。Pull Request 只执行构建与测试，不部署网站。

运行环境由 `.nvmrc` 与 `package.json` 的 `packageManager` 确定。构建设置 `VITE_SITE_URL=https://mapseekai.github.io`，生成 canonical、Open Graph URL、robots.txt 和 sitemap.xml。Actions 以提交 SHA 固定版本；只有部署 Job 获得 Pages 写入和 OIDC 权限，不需要仓库内的访问令牌。

## 本地验证

```bash
pnpm install --frozen-lockfile
VITE_SITE_URL=https://mapseekai.github.io pnpm build
pnpm test
pnpm preview
```

产物包括首页、三个产品页、生态页、博客列表、六篇文章和独立 `404.html`。页面直接访问与刷新不依赖 SPA 回退。

## 配置与维护

页面文案和链接集中在 `src/content/site.ts`。三个产品的部署地址可通过 `VITE_CLOUD_URL`、`VITE_LOOM_URL`、`VITE_DESIGN_URL` 在构建时设置；未配置时继续链接到站内产品笔记。

`.env`、本地 Skill 缓存、浏览器截图、日志、测试报告、源码备份及构建目录不提交到公开仓库。只发布 `dist/` 中的静态站点文件。

GitHub Pages 设置使用 GitHub Actions 作为发布源。发布状态和日志可在仓库 Actions 页查看；需要回退时，在 `main` 撤销对应源码提交，再由同一流程构建发布。
