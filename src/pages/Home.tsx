import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { BrandMark } from '../components/Brand';
import { products, type Post } from '../content/site';
import { EditorialArt } from '../components/Art';
import { ProductMark, ProductScreenshot } from '../components/ProductScreenshot';

export function PostCard({ post }: { post: Post }) {
  return <article className="post-card"><a href={`/blog/${post.slug}/`}><EditorialArt type={post.visual} /><div className="post-copy"><h3>{post.title}</h3><p>{post.summary}</p><div className="post-meta"><span>{post.category}</span><span>{post.readTime}阅读</span></div></div></a></article>;
}

const editorial = {
  cloud: { title: '数据有序，工作才能向前。', text: '把分散的矢量、影像与地图资源，放进同一个清晰的工作空间。从数据集开始，连接空间处理与服务发布。', focus: ['组织数据集', '理解空间数据', '发布地图服务'] },
  loom: { title: '在浏览器里，把细节做准确。', text: '图层、几何与属性，始终在同一个上下文里。围绕正在处理的要素工作，让每一次编辑都有清晰的反馈。', focus: ['编辑几何', '检查属性', '组织图层'] },
  design: { title: '让地图，拥有自己的语言。', text: '把设计意图、样式编辑与 AI 协作连接起来。在本地优先的工作空间里，预览、调整，再作出你的判断。', focus: ['编辑地图样式', '与 AI 协作', '在本地创作'] },
};

export function Home() {
  return <div className="craft-home">
    <section className="craft-hero" id="overview">
      <div className="craft-register"><span>00 / MAPSEEK</span><span>SPATIAL SOFTWARE</span></div>
      <div className="craft-hero-core">
        <div className="craft-insignia" aria-hidden="true"><BrandMark /><span>↗</span></div>
        <p className="craft-suite-label">Mapseek <span>产品系列</span></p>
        <h1>为地理空间工作，<br /><em>重新设计</em>工具。</h1>
        <p className="craft-hero-description">数据管理、空间编辑、AI 地图设计。<br />三款独立产品，专注每一步工作。</p>
        <div className="craft-hero-actions"><a className="craft-button" href="#products">认识三款产品<ArrowDown size={17} aria-hidden="true" /></a><a className="craft-text-link" href="#screens">浏览产品界面<ArrowUpRight size={15} aria-hidden="true" /></a></div>
      </div>
      <nav className="craft-product-index" id="products" aria-label="产品快速导航">
        {products.map((product, index) => <a href={`#${product.id}`} key={product.id}><span className="index-number">0{index + 1}</span><ProductMark product={product.id} /><span><strong>{product.id[0].toUpperCase() + product.id.slice(1)}</strong><small>{product.label}</small></span><ArrowUpRight size={20} aria-hidden="true" /></a>)}
      </nav>
    </section>

    {products.map((product, index) => {
      const copy = editorial[product.id];
      const name = product.id[0].toUpperCase() + product.id.slice(1);
      return <section className={`product-chapter craft-chapter craft-${product.id}`} id={product.id} key={product.id}>
        <div className="craft-register"><span>0{index + 1} / {name.toUpperCase()}</span><span>{product.label}</span></div>
        <div className="craft-chapter-inner">
          <div className="craft-product-heading" data-reveal><div className="craft-product-title"><ProductMark product={product.id} large /><h2>Mapseek <em>{name}.</em></h2></div><div className="craft-product-copy"><h3>{copy.title}</h3><p>{copy.text}</p><a className="craft-button craft-button-outline" href={`/products/${product.id}/`}>了解 {name}<ArrowUpRight size={17} aria-hidden="true" /></a></div></div>
          <div className="craft-capabilities">{copy.focus.map((focus, i) => <span key={focus}><span>0{i + 1}</span>{focus}</span>)}</div>
          {index === 0 && <span id="screens" className="craft-anchor" />}
          <ProductScreenshot product={product.id} />
        </div>
      </section>;
    })}
    <section className="craft-end" data-reveal><span className="craft-end-label">YOUR NEXT MAP</span><h2>下一张地图，<br />由你开始。</h2><nav aria-label="选择产品">{products.map((product, index) => <a href={`/products/${product.id}/`} key={product.id}><span>0{index + 1}</span>{product.id[0].toUpperCase() + product.id.slice(1)}<ArrowUpRight size={18} aria-hidden="true" /></a>)}</nav></section>
    <span id="workflow" className="craft-anchor" />
  </div>;
}
