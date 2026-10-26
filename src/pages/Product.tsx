import { ArrowLeft, ArrowRight, ArrowUpRight, Check, MoveUpRight } from 'lucide-react';
import { products, type Product as ProductData } from '../content/site';
import { MapPreview } from '../components/MapPreview';
import { Endcap, ExternalLink } from '../components/Layout';

const appUrls = { cloud: import.meta.env.VITE_CLOUD_URL, loom: import.meta.env.VITE_LOOM_URL, design: import.meta.env.VITE_DESIGN_URL };
function safeAppUrl(value: string | undefined): string | undefined {
  if (!value) return;
  try { const url = new URL(value); if (url.protocol === 'https:' || url.protocol === 'http:') return url.href; } catch { /* Invalid configuration keeps the working local note link. */ }
}

export function ProductPage({ product }: { product: ProductData }) {
  const appUrl = safeAppUrl(appUrls[product.id]);
  return <>
    <section className="container product-hero"><a className="back-link" href="/#products"><ArrowLeft size={14}/>全部产品</a><div className="product-hero-copy"><div><h1>{product.name}</h1><h2>{product.tagline}</h2><p>{product.detail}</p><div className="hero-actions">{appUrl ? <ExternalLink href={appUrl} className="button">打开 {product.id}<ArrowUpRight size={16}/></ExternalLink> : <a href={`/blog/${product.note}/`} className="button">阅读产品笔记<ArrowUpRight size={16}/></a>}<a className="text-link" href="#product-preview">探索交互演示<ArrowRight size={15}/></a></div></div><div className="product-hero-index"><MoveUpRight size={92} strokeWidth={.7}/><span>{product.label}</span></div></div></section>
    <section id="product-preview" className="container product-demo" aria-label={`${product.name} 概念演示`}><MapPreview initialMode={product.id} fixed/><p className="demo-disclaimer">交互概念演示，用于说明产品方向。示意数据在当前页面运行，未连接产品服务。</p></section>
    <section className="container section product-features"><h2>为真正的空间工作而设计。</h2><div className="feature-grid">{product.features.map((feature, index) => <article key={feature.title}><h3>{feature.title}</h3><p>{feature.text}</p><span className="feature-index mono">0{index+1}<Check size={16}/></span></article>)}</div></section>
    <section className="container related-products"><h2>还有这些工具，与你的工作相遇。</h2><div>{products.filter((item) => item.id !== product.id).map((item) => <a href={`/products/${item.id}/`} key={item.id}><span>{item.label}<strong>{item.name}</strong></span><ArrowUpRight size={24}/></a>)}</div></section><Endcap/>
  </>;
}
