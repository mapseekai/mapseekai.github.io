import { Github } from '../components/Brand';
import { products, projects, posts, githubOrg, type Post } from '../content/site';
import { MapPreview } from '../components/MapPreview';
import { EditorialArt } from '../components/Art';
import { Endcap, ExternalLink, SectionHeading } from '../components/Layout';
import { SpatialField } from '../components/SpatialField';
import { Workflow } from '../components/Workflow';

export function PostCard({ post }: { post: Post }) {
  return <article className="post-card"><a href={`/blog/${post.slug}/`}>
    <EditorialArt type={post.visual} />
    <div className="post-copy"><h3>{post.title}</h3><p>{post.summary}</p><div className="post-meta"><span>{post.category}</span><span>{post.readTime}阅读</span></div></div>
  </a></article>;
}

export function Home() {
  return <>
    <section className="hero cobalt-hero">
      <div className="container hero-layout">
        <div className="hero-copy">
          <h1>让空间数据，<br />成为创造的起点。</h1>
          <p className="hero-description">管理数据、编辑空间、设计地图。<br />为认真做地图的人，打造专注的工具。</p>
          <div className="hero-actions"><a className="button" href="#products">探索产品</a><a className="button button-outline" href="#workspace">看看它们如何工作</a></div>
        </div>
        <SpatialField />
      </div>
      <div className="container hero-foot"><p>MapseekAI，让灵感与空间相遇。</p><div className="hero-capabilities"><span>空间数据管理</span><span>精细空间编辑</span><span>AI 地图设计</span></div></div>
    </section>

    <section className="container section products-section" id="products">
      <SectionHeading title="选对工具，专注眼前的工作。"><p>从一份数据开始。<br />管理、编辑与设计，不必挤在同一个界面。</p></SectionHeading>
      <div className="product-index" data-reveal>{products.map((product) => <article key={product.id}>
        <a href={`/products/${product.id}/`}><h3>{product.name}</h3><p className="product-kind">{product.label}</p><p>{product.description}</p><span className="product-index-link">探索 {product.id[0].toUpperCase() + product.id.slice(1)}</span></a>
      </article>)}</div>
      <div className="workbench-heading" id="workspace"><h2>先动手，再了解。</h2><p>切换产品，试试图层、要素与配色。</p></div>
      <div className="workbench" role="group" aria-label="Mapseek 产品交互演示" data-reveal><MapPreview /></div>
      <p className="workbench-note">本地交互概念演示，用于说明产品方向，不连接实际产品服务。</p>
    </section>

    <Workflow />

    <section className="container section ecosystem-section" data-reveal>
      <div className="ecosystem-intro"><h2>产品之下，<br />是持续打磨的基础。</h2><p>从地图引擎到 Worker 运行时，<br />从栅格样式到地图设计规则。</p><div className="ecosystem-actions"><a className="text-link" href="/open-source/">探索技术生态</a><ExternalLink className="github-link" href={githubOrg}><Github size={20} />GitHub</ExternalLink></div></div>
      <div className="ecosystem-rows">{projects.map((project) => {
        const content = <><div className="project-row-title"><strong>{project.name}</strong><span>{project.kind}</span></div><p>{project.description}</p><span className="project-action">{project.action}</span></>;
        return project.external ? <ExternalLink href={project.href} className="ecosystem-row" key={project.name}>{content}</ExternalLink> : <a href={project.href} className="ecosystem-row" key={project.name}>{content}</a>;
      })}</div>
    </section>

    <section className="journal-section"><div className="container section" data-reveal>
      <SectionHeading title="把做地图的思考，写下来。"><a className="text-link" href="/blog/">所有文章</a></SectionHeading>
      <div className="journal-index">{posts.slice(0, 3).map((post) => <article key={post.slug}><a href={`/blog/${post.slug}/`}><h3>{post.title}</h3><p>{post.summary}</p><span>{post.category}<span className="journal-reading">{post.readTime}阅读</span></span></a></article>)}</div>
    </div></section>
    <Endcap />
  </>;
}
