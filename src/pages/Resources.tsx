import { ArrowUpRight } from 'lucide-react';
import { products, projects } from '../content/site';

export function ResourcesPage() {
  return <div className="craft-resource-page">
    <section className="directory-intro"><span className="directory-eyebrow">MAPSEEK / 资源</span><h1>从工具，<br />到背后的<em>思考。</em></h1><p>产品笔记、地图设计与工程实践。<br />从这里，继续了解 Mapseek。</p></section>
    <section className="directory-section" aria-labelledby="resource-notes"><div className="directory-section-heading"><h2 id="resource-notes">产品笔记</h2><a href="/blog/">所有文章<ArrowUpRight size={16} /></a></div>
      <div className="resource-product-grid">{products.map(product => <a key={product.id} href={`/blog/${product.note}/`}><span>Mapseek {product.id[0].toUpperCase()+product.id.slice(1)}</span><h3>{product.tagline}</h3><p>{product.description}</p><ArrowUpRight size={20} aria-hidden="true" /></a>)}</div>
    </section>
    <section className="directory-section" aria-labelledby="resource-ecosystem"><div className="directory-section-heading"><h2 id="resource-ecosystem">开放项目与技术</h2><a href="/open-source/">探索生态<ArrowUpRight size={16} /></a></div>
      <div className="resource-project-list">{projects.map(project => <a key={project.name} href={project.href} target={project.external ? '_blank' : undefined} rel={project.external ? 'noopener noreferrer' : undefined}><strong>{project.name}<small>{project.kind}</small></strong><span>{project.description}</span><ArrowUpRight size={18} aria-hidden="true" />{project.external && <span className="sr-only">（在新标签页打开）</span>}</a>)}</div>
    </section>
  </div>;
}

export function PricingPage() {
  return <div className="craft-pricing-page"><section className="directory-intro"><span className="directory-eyebrow">MAPSEEK / 价格</span><h1>找到适合你的<br /><em>空间工具。</em></h1><p>数据管理、空间编辑与地图设计，<br />从你的工作出发。</p></section>
    <section className="pricing-information" aria-labelledby="pricing-status"><h2 id="pricing-status">价格信息待补充</h2><p>本页暂未列出套餐和金额，也未开放购买入口。<br />你可以先了解三款产品的功能与工作方式。</p></section>
    <div className="resource-product-grid pricing-product-grid">{products.map(product => <a key={product.id} href={`/products/${product.id}/`}><span>{product.label}</span><h2>Mapseek {product.id[0].toUpperCase()+product.id.slice(1)}</h2><p>{product.description}</p><strong className="pricing-product-action">了解产品<ArrowUpRight size={16} aria-hidden="true" /></strong></a>)}</div>
  </div>;
}
