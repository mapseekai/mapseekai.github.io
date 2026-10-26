import { Database, Layers, PenTool } from 'lucide-react';
import { Github } from '../components/Brand';
import { products, projects, posts, githubOrg, type Post } from '../content/site';
import { MapPreview } from '../components/MapPreview';
import { EditorialArt, ProductArt } from '../components/Art';
import { Endcap, ExternalLink, SectionHeading } from '../components/Layout';

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <a href={`/blog/${post.slug}/`}>
        <EditorialArt type={post.visual} />
        <div className="post-copy">
          <h3>{post.title}</h3>
          <p>{post.summary}</p>
          <div className="post-meta"><span>{post.category}</span><span>{post.readTime}阅读</span></div>
        </div>
      </a>
    </article>
  );
}

const steps = [
  { icon: Database, title: '汇聚与理解', product: 'Cloud', text: '组织空间资源，发现数据里的线索。', id: 'cloud' },
  { icon: Layers, title: '编辑与构建', product: 'Loom', text: '打磨几何和属性，形成独立的数据成果。', id: 'loom' },
  { icon: PenTool, title: '设计与表达', product: 'Design', text: '把视觉意图，变成有辨识度的地图。', id: 'design' },
];

export function Home() {
  return <>
    <section className="hero">
      <div className="container hero-layout">
        <div className="hero-copy">
          <h1>让空间数据，<br />成为创造的起点。</h1>
          <p className="hero-description">从云端数据管理，到精细的空间编辑，再到富有表达力的地图设计。</p>
          <div className="hero-actions">
            <a className="button button-on-dark" href="#products">探索产品</a>
            <a className="text-link" href="#workspace">看看它们如何工作</a>
          </div>
        </div>
        <div id="workspace" className="hero-workspace" aria-label="Mapseek 产品交互演示">
          <MapPreview />
        </div>
      </div>
      <div className="container hero-foot">
        <p>MapseekAI，让灵感与空间相遇。</p>
        <div className="hero-capabilities"><span>空间数据管理</span><span>精细空间编辑</span><span>AI 地图设计</span></div>
      </div>
    </section>

    <section className="container section products-section" id="products">
      <SectionHeading title="三种工作，各有专注。">
        <p>从理解数据，到构建你所想象的世界。<br />选择适合当前任务的 Mapseek 工作台。</p>
      </SectionHeading>
      <div className="product-collection">
        {products.map((product) => (
          <article className={`product-showcase product-showcase-${product.id}`} key={product.id}>
            <div className="product-showcase-copy">
              <h3><a href={`/products/${product.id}/`}>{product.name}</a></h3>
              <p className="product-kind">{product.label}</p>
              <p className="product-description">{product.description}</p>
              <ul className="product-keywords">{product.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
              <a className="text-link product-explore" href={`/products/${product.id}/`}>探索 {product.id[0].toUpperCase() + product.id.slice(1)}</a>
            </div>
            <a className="product-visual-link" href={`/products/${product.id}/`} aria-label={`探索 ${product.name}`}><ProductArt type={product.id} /></a>
          </article>
        ))}
      </div>
    </section>

    <section className="workflow-section" id="workflow">
      <div className="container workflow-inner">
        <div className="workflow-intro">
          <h2>从一份数据，<br />到无限种可能。</h2>
          <div><p>让管理、编辑与设计各自专注，也让空间工作保持连贯。</p><a href="/blog/cloud-workspace/" className="text-link">了解我们的产品思路</a></div>
        </div>
        <div className="workflow-steps">
          {steps.map((step) => <a href={`/products/${step.id}/`} className="workflow-step" key={step.id}>
            <step.icon size={24} aria-hidden="true" />
            <h3>{step.title}</h3><p>{step.text}</p><span>{step.product}</span>
          </a>)}
        </div>
      </div>
    </section>

    <section className="container section ecosystem-section">
      <div className="ecosystem-intro">
        <h2>开放的代码，<br />共同的基础。</h2>
        <p>产品背后，是持续打磨的引擎、工具与工程实践。在代码与技术笔记中，分享我们如何构建。</p>
        <div className="ecosystem-actions"><a className="text-link" href="/open-source/">探索技术生态</a><ExternalLink className="github-link" href={githubOrg}><Github size={20} />GitHub</ExternalLink></div>
      </div>
      <div className="ecosystem-rows">{projects.slice(0, 3).map((project) => {
        const content = <><div className="project-row-title"><strong>{project.name}</strong><span>{project.kind}</span></div><p>{project.description}</p><span className="project-action">{project.action}</span></>;
        return project.external
          ? <ExternalLink href={project.href} className="ecosystem-row" key={project.name}>{content}</ExternalLink>
          : <a href={project.href} className="ecosystem-row" key={project.name}>{content}</a>;
      })}</div>
    </section>

    <section className="journal-section"><div className="container section">
      <SectionHeading title="地图之外，也有思考。"><a className="text-link" href="/blog/">所有文章</a></SectionHeading>
      <div className="post-grid">{posts.slice(0, 3).map((post) => <PostCard key={post.slug} post={post} />)}</div>
    </div></section>
    <Endcap />
  </>;
}
