import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { products, type Product as ProductData } from '../content/site';
import { CloudExperience, DesignExperience, LoomExperience } from '../components/ProductExperiences';
import { ProductMark, ProductScreenshot } from '../components/ProductScreenshot';
import { ExternalLink } from '../components/Layout';

const appUrls = { cloud: import.meta.env.VITE_CLOUD_URL, loom: import.meta.env.VITE_LOOM_URL, design: import.meta.env.VITE_DESIGN_URL };
function safeAppUrl(value: string | undefined): string | undefined {
  if (!value) return;
  try { const url = new URL(value); if (url.protocol === 'https:' || url.protocol === 'http:') return url.href; } catch { /* Keep the existing product note link. */ }
}
export function ProductPage({ product }: { product: ProductData }) {
  const appUrl = safeAppUrl(appUrls[product.id]);
  const name = product.id[0].toUpperCase() + product.id.slice(1);
  return <div className="craft-detail">
    <div className="craft-register"><span>MAPSEEK {name.toUpperCase()}</span><span>{product.label}</span></div>
    <div className="craft-detail-inner">
      <a className="craft-back" href="/#products"><ArrowLeft size={14} />全部产品</a>
      <section className="craft-detail-heading"><div><ProductMark product={product.id} large /><h1>{product.name}</h1><p className="craft-product-label">{product.label}</p></div><div><h2>{product.tagline}</h2><p>{product.detail}</p>{appUrl ? <ExternalLink className="craft-button" href={appUrl}>打开 {name}<ArrowUpRight size={17} /></ExternalLink> : <a className="craft-button" href={`/blog/${product.note}/`}>阅读产品笔记<ArrowUpRight size={17} /></a>}</div></section>
      <ProductScreenshot product={product.id} />
      <section className="craft-detail-features" aria-label={`${name} 产品介绍`}>{product.features.map((feature) => <article key={feature.title}><h2>{feature.title}</h2><p>{feature.text}</p></article>)}</section>
      <details className="craft-demo" id="product-preview"><summary>打开功能交互示意<small>本地示例，不是产品截图</small></summary>{product.id === 'cloud' ? <CloudExperience /> : product.id === 'loom' ? <LoomExperience /> : <DesignExperience />}<p className="demo-disclaimer">交互概念演示，用于说明产品方向。示意数据在当前页面运行，未连接产品服务。</p></details>
      <section className="craft-detail-related"><h2>继续认识 Mapseek。</h2><div>{products.filter((entry) => entry.id !== product.id).map((entry) => <a href={`/products/${entry.id}/`} key={entry.id}><ProductMark product={entry.id} /><span><strong>Mapseek {entry.id[0].toUpperCase() + entry.id.slice(1)}</strong><small>{entry.label}</small></span><ArrowUpRight size={20} /></a>)}</div></section>
    </div>
  </div>;
}
