export type ProductId = 'cloud' | 'loom' | 'design';
export type Product = {
  id: ProductId;
  name: string;
  label: string;
  tagline: string;
  description: string;
  detail: string;
  keywords: string[];
  note: string;
  features: { title: string; text: string }[];
};

export const products: Product[] = [
  {
    id: 'cloud', name: 'mapseek-cloud', label: '空间数据平台',
    tagline: '数据汇聚，价值生长。',
    description: '从数据管理到地图服务，让分散的空间数据进入同一个工作空间。',
    detail: '以数据集为起点，组织矢量与栅格数据，连接地图预览、空间处理与服务发布。让每一份数据都易于发现、理解和使用。',
    keywords: ['数据管理', '空间分析', '服务发布'], note: 'cloud-workspace',
    features: [
      { title: '以数据集组织工作', text: '围绕项目管理数据与元信息，用地图预览和属性视图理解数据，建立清晰的空间数据目录。' },
      { title: '连接数据与地图', text: '把矢量、栅格、地图集与瓦片集放进连贯的工作流，减少数据准备和展示之间的切换。' },
      { title: '让数据走向应用', text: '围绕数据处理、地图组织与服务发布开展工作，为业务应用提供可复用的地理空间资源。' },
    ],
  },
  {
    id: 'loom', name: 'mapseek-loom', label: '浏览器空间编辑器',
    tagline: '在浏览器里，精细构建。',
    description: '让专业的空间数据编辑，发生在轻盈、专注的浏览器工作台里。',
    detail: '让地图成为工作空间。围绕图层、要素、几何与属性开展编辑，把精确操作与直观反馈带到同一个界面。',
    keywords: ['几何编辑', '属性管理', '图层组织'], note: 'loom-editing',
    features: [
      { title: '面向要素的编辑', text: '在地图上选择、检查和修改空间要素，让几何与属性在同一个操作上下文里保持清晰。' },
      { title: '专注的浏览器工作台', text: '用图层面板组织数据，用属性面板调整表达，把更多空间留给地图和正在处理的对象。' },
      { title: '独立的数据成果', text: '与 Cloud 衔接时，深度编辑的提交成果作为新的、独立的数据集进入平台，保留原始数据的独立性。' },
    ],
  },
  {
    id: 'design', name: 'mapseek-design', label: 'AI 地图设计工作台',
    tagline: '把地图，变成你的表达。',
    description: '将设计意图、地图样式与 AI 协作连接起来，让地图拥有自己的语言。',
    detail: '从一份地图样式出发，在本地优先的工作空间里预览、创作与审阅。将设计规则交给 AI，把表达和判断留给创作者。',
    keywords: ['AI 辅助设计', '样式编辑', '本地优先'], note: 'design-language',
    features: [
      { title: '从样式开始创作', text: '导入地图样式与在线资源，在地图预览里观察色彩、层次和标注，逐步形成一致的视觉表达。' },
      { title: '与 AI 一起迭代', text: '连接模型与编码代理，让 AI 在共同的地图设计规则下工作，并在具体的地图预览中审阅结果。' },
      { title: '作品留在自己的工作空间', text: '通过本地服务管理项目与修订，连接 Web 和桌面客户端，让创作过程有记录、可检查。' },
    ],
  },
];

export const githubOrg = 'https://github.com/mapseekai';

// Public links are explicit. Private repositories intentionally point to local notes.
export const projects = [
  { name: 'emap', kind: '地图引擎', language: 'TypeScript', description: '面向浏览器应用的 GIS 处理与地图交互内核。', href: '/blog/emap-engine/', external: false, action: '阅读笔记' },
  { name: 'async-geotiff-rust', kind: '栅格引擎', language: 'Rust', description: '探索 GeoTIFF 的异步读取与按需访问。', href: '/blog/async-geotiff/', external: false, action: '阅读笔记' },
  { name: 'tasklane', kind: 'Worker 运行时', language: 'TypeScript', description: '面向交互应用和大二进制数据处理的有界 Worker 运行时。', href: `${githubOrg}/tasklane`, external: true, action: 'GitHub' },
  { name: 'raster-style', kind: '样式规范', language: 'TS / Go / Rust', description: '连接栅格渲染参数与跨语言工具的样式规范。', href: `${githubOrg}/raster-style`, external: true, action: 'GitHub' },
  { name: 'cartography.md', kind: '地图设计', language: 'Specification', description: '用可读的设计原则、体系与 Token 描述地图视觉语言。', href: `${githubOrg}/cartography.md`, external: true, action: 'GitHub' },
  { name: 'map-sprite', kind: '制图工具', language: 'Toolkit', description: '围绕地图符号与 Sprite 开展工作的小工具。', href: `${githubOrg}/map-sprite`, external: true, action: 'GitHub' },
];

export type Post = {
  slug: string;
  title: string;
  category: '产品笔记' | '工程手记' | '设计思考';
  summary: string;
  readTime: string;
  visual: 'contour' | 'grid' | 'lanes';
  relatedProduct?: ProductId;
  sections: { heading: string; paragraphs: string[] }[];
  links?: { label: string; href: string }[];
};

// Original launch editorial content, not a fabricated release history or benchmark.
export const posts: Post[] = [
  {
    slug: 'design-language', title: '让地图拥有自己的设计语言', category: '设计思考',
    summary: '从色彩到层次，将设计意图变成可以持续迭代的地图表达。',
    readTime: '3 分钟', visual: 'contour', relatedProduct: 'design',
    sections: [
      { heading: '先决定地图要讲什么', paragraphs: ['一张地图有很多可以展示的内容，但设计的第一步，是确定什么值得被看见。道路、建筑、水系和标注不是并列的信息：它们共同服务于一个阅读目的。', '在 Mapseek 的设计思路里，地图样式是一套信息表达规则，而不仅仅是一组颜色。背景需要退后，主题对象需要清晰，标注需要帮助读者理解空间关系。'] },
      { heading: '把判断写成可复用的规则', paragraphs: ['与其反复调整单个图层，不如先确定底色、语义色、描边、字号和密度之间的关系。将这些判断组织为规则后，新的图层也能够加入同一套视觉体系。', 'cartography.md 将地图设计意图组织为原则、体系与 Token。规则不仅服务于人的协作，也为 AI 辅助设计提供共同的上下文。'] },
      { heading: '让 AI 参与，让预览说话', paragraphs: ['mapseek-design 将地图样式、设计规则和 AI 协作放在一起。创作者描述方向，在预览中比较结果，再继续调整。生成是一种起点，审阅则决定最终表达。', '这也是官网采用克制绿色的原因：用绿色标记行动与焦点，将更多视觉空间留给地图本身。'] },
    ], links: [{ label: '阅读 cartography.md', href: `${githubOrg}/cartography.md` }],
  },
  {
    slug: 'async-geotiff', title: '从按需读取开始，重新思考栅格体验', category: '工程手记',
    summary: '关于 GeoTIFF、异步 I/O，以及一张影像如何进入交互工作台。',
    readTime: '3 分钟', visual: 'grid',
    sections: [
      { heading: '先明确当前需要的区域', paragraphs: ['用户打开一份影像，通常从一个视口开始，而不是同时查看所有像素。面向交互的栅格体验，可以从“当前需要哪些数据”这个问题展开设计。', '我们将关注点放在读取范围、数据块、概览层级与解码边界上。这里讨论的是设计思路，不是针对特定文件的性能结论。'] },
      { heading: '让 I/O 与计算各就其位', paragraphs: ['一次影像访问可以拆成读取元信息、确定窗口、获取数据、解码与渲染等阶段。清晰的阶段边界，有助于分别处理取消、缓存和资源预算。', 'async-geotiff-rust 是这一方向的工程探索。项目命名对应当前的 async-geotiff-rs 仓库；本页是公开的技术笔记入口，代码入口在正式开放时再接入。'] },
      { heading: '用可复现的验证代替口号', paragraphs: ['评价读取体验时，应一起记录文件结构、数据来源、网络条件、缓存状态、窗口尺寸以及内存占用。首屏速度和全量吞吐回答的是不同问题。', '后续工程笔记会围绕具体样例记录过程，让优化的收益与适用条件同样清楚。'] },
    ],
  },
  {
    slug: 'tasklane-runtime', title: '让重任务运行，让交互保持轻盈', category: '工程手记',
    summary: '从 Worker 到运行时：为任务、资源与取消建立清晰的边界。',
    readTime: '3 分钟', visual: 'lanes',
    sections: [
      { heading: '我们关心的不只是线程数量', paragraphs: ['空间数据工作台会同时面对解析、转换、索引与交互反馈。将计算移出主线程只是开始；接下来还需要决定任务怎样排队、数据由谁持有，以及不再需要的工作怎样停止。', 'tasklane 的项目定位是面向交互应用和大二进制数据处理的有界、带作用域的 Worker 运行时。它将任务与资源管理作为独立的基础能力。'] },
      { heading: '用作用域描述任务的生命周期', paragraphs: ['一个图层、一次导入或一个打开的视图，都可以成为理解任务生命周期的上下文。对象离开工作台时，相关任务也应有明确的收尾方式。', '作用域让上层应用可以围绕业务组织工作，而不是在每一个按钮旁边重复处理线程与消息的细节。'] },
      { heading: '让边界成为可检查的契约', paragraphs: ['并发、队列、缓存和数据传递都需要边界。明确这些边界，有助于在实现与测试时讨论同一件事：系统在压力下怎样保持可预期。', '具体接口和当前实现请以项目仓库为准。这篇笔记用于说明设计出发点，不把尚未完成的验证写成性能承诺。'] },
    ], links: [{ label: '查看 tasklane 源码', href: `${githubOrg}/tasklane` }],
  },
  {
    slug: 'cloud-workspace', title: '从一份数据，到一个空间工作流', category: '产品笔记',
    summary: '以数据集为起点，连接管理、预览、处理与服务。',
    readTime: '2 分钟', visual: 'grid', relatedProduct: 'cloud',
    sections: [
      { heading: '让数据先有一个清晰的位置', paragraphs: ['文件夹解决了存放问题，却不一定解决发现和理解问题。空间数据还需要范围、类型、属性与预览等上下文。', 'mapseek-cloud 以数据集为起点，将项目中的空间资源放入统一目录，让地图成为理解数据的入口。'] },
      { heading: '管理、制图和使用保持连贯', paragraphs: ['数据准备完成后，工作通常继续走向地图组织、处理任务与服务发布。我们的产品方向，是让这些环节围绕同一批清晰可识别的资源衔接。', 'Cloud 负责数据工作空间，Loom 提供专注的编辑体验，Design 聚焦地图的视觉表达。三个产品各自清晰，也为共同的空间工作流留出连接。'] },
    ],
  },
  {
    slug: 'loom-editing', title: '把地图变成真正的工作空间', category: '产品笔记',
    summary: '围绕要素、几何和属性，重新组织浏览器里的编辑体验。',
    readTime: '2 分钟', visual: 'contour', relatedProduct: 'loom',
    sections: [
      { heading: '编辑需要稳定的上下文', paragraphs: ['在一张地图上完成选择、检查与修改，意味着地图、图层和属性面板需要围绕同一个对象协作。清晰的选择反馈，是精确操作的起点。', 'mapseek-loom 把空间编辑作为独立的工作体验来设计，而不是给预览页面不断叠加按钮。'] },
      { heading: '成果有自己的边界', paragraphs: ['在 Cloud 与 Loom 的衔接设计中，Loom 接收数据开展深度编辑，提交后创建一份全新的独立数据集。它不是对原数据的覆盖，也不是原数据的一个新版本。', '这种边界让来源和成果各自清晰，也为继续分析、制图和发布提供独立的工作对象。'] },
    ],
  },
  {
    slug: 'emap-engine', title: '产品之下，保留一个清晰的地图内核', category: '工程手记',
    summary: '关于 emap，以及产品体验与基础能力之间的边界。',
    readTime: '2 分钟', visual: 'lanes',
    sections: [
      { heading: '产品不同，基础问题相通', paragraphs: ['地图需要组织图层、呈现数据并响应用户的操作。数据处理还需要清晰的输入、输出和执行边界。它们是多个空间应用都会遇到的基础问题。', 'emap 面向浏览器 GIS 处理与地图交互，为产品之下的公共能力提供组织方式。官网将它放在技术生态中，而不是与三个面向用户的产品争夺叙事。'] },
      { heading: '让能力复用，让产品保持独立', paragraphs: ['内核应当描述通用能力；具体业务则决定这些能力怎样组合。这样，轻量预览、基础编辑与完整工作台可以在保持一致性的同时，各自服务不同的任务。', '本页提供 emap 的技术方向介绍。公开源码与文档入口会在项目正式开放时接入。'] },
    ],
  },
];

export function normalizePath(path: string): string {
  return `/${path.split('?')[0].split('#')[0].split('/').filter(Boolean).join('/')}`;
}

export const routes = [
  '/', ...products.map((product) => `/products/${product.id}/`),
  '/open-source/', '/blog/', '/resources/', '/pricing/', ...posts.map((post) => `/blog/${post.slug}/`),
];

export function metadata(path: string) {
  const clean = normalizePath(path);
  const product = products.find((item) => clean === `/products/${item.id}`);
  const post = posts.find((item) => clean === `/blog/${item.slug}`);
  if (product) return { title: `${product.name} · ${product.label} — MapseekAI`, description: product.description };
  if (post) return { title: `${post.title} — MapseekAI 博客`, description: post.summary };
  if (clean === '/resources') return { title: '资源中心 — MapseekAI', description: 'Mapseek 的产品笔记、地图设计与工程实践，以及开放项目入口。' };
  if (clean === '/pricing') return { title: '价格 — MapseekAI', description: '了解 Mapseek 三款产品；价格信息待补充。' };
  if (clean === '/blog') return { title: '博客 · 产品、设计与工程 — MapseekAI', description: '来自 MapseekAI 的产品笔记、设计思考与工程手记。' };
  if (clean === '/open-source') return { title: '开放的技术生态 — MapseekAI', description: '探索 emap、async-geotiff-rust、tasklane 与 MapseekAI 的开源工具和技术笔记。' };
  if (clean !== '/') return { title: '页面未找到 — MapseekAI', description: '返回 MapseekAI，继续探索空间数据的更多可能。' };
  return { title: 'MapseekAI · 让空间数据，成为创造的起点', description: '探索 mapseek-cloud 空间数据平台、mapseek-loom 浏览器空间编辑器与 mapseek-design AI 地图设计工作台。' };
}
