import { ArrowUpRight } from 'lucide-react';
import { SectionBoundary } from '../components/SectionBoundary';
import { SpatialHero } from '../components/SpatialHero';
import { products, type Post } from '../content/site';
import { EditorialArt } from '../components/Art';
import { ProductScreenshot } from '../components/ProductScreenshot';

export function PostCard({ post }: { post: Post }) {
  return <article className="post-card"><a href={`/blog/${post.slug}/`}><EditorialArt type={post.visual} /><div className="post-copy"><h3>{post.title}</h3><p>{post.summary}</p><div className="post-meta"><span>{post.category}</span><span>{post.readTime}阅读</span></div></div></a></article>;
}

const editorial = {
  cloud: { heading: <>把空间数据，<br />组织成<em>工作的起点。</em></>, text: '从数据集到地图服务，让矢量、影像与空间处理，在同一个清晰的工作空间里展开。' },
  loom: { heading: <>在浏览器里，<br />把每一处<em>细节做准确。</em></>, text: '图层、几何与属性，始终在同一个上下文里。专注正在处理的要素，让每一次编辑都有清晰的反馈。' },
  design: { heading: <>不止于显示。<br />让地图<em>成为你的表达。</em></>, text: '将地图样式、设计意图与 AI 协作连接起来。在本地优先的工作空间里，预览、调整，再作出你的判断。' },
};

export function Home() {
  return <div className="craft-home">
    <SpatialHero />
    {products.map(product => {
      const name = product.id[0].toUpperCase() + product.id.slice(1);
      const copy = editorial[product.id];
      return <section className={`product-chapter craft-chapter craft-${product.id}`} id={product.id} key={product.id} data-boundary-host="true"><SectionBoundary />
        <div className="craft-register"><span>MAPSEEK {name.toUpperCase()}</span><span>{product.label}</span></div>
        <div className="craft-chapter-intro" data-reveal data-scroll-context={product.label}>
          <p className="craft-product-name">Mapseek <span>{name}</span></p>
          <h2>{copy.heading}</h2><p className="craft-chapter-description">{copy.text}</p>
          <a className="craft-button craft-button-outline" href={`/products/${product.id}/`}>了解 Mapseek {name}<ArrowUpRight size={16} aria-hidden="true" /></a>
        </div>
        {product.id === 'cloud' && <span id="screens" className="craft-anchor" />}
        <ProductScreenshot product={product.id} />
        <div className="craft-feature-grid"
            role="group" data-scroll-context={`${name} · 产品能力`} aria-label={`${name} 产品特点`}>{product.features.map(feature => <article key={feature.title} data-reveal><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
      </section>;
    })}
    <section className="craft-end" data-boundary-host="true"><SectionBoundary /><h2 data-reveal>下一张地图，<br /><em>由你开始。</em></h2><p data-reveal>找到适合你的工作方式。</p><nav data-reveal aria-label="选择产品">{products.map(product => <a href={`/products/${product.id}/`} key={product.id}>{product.id[0].toUpperCase() + product.id.slice(1)}<ArrowUpRight size={17} aria-hidden="true" /></a>)}</nav></section>
    <span id="workflow" className="craft-anchor" />
  </div>;
}
