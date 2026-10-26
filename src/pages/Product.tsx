import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { products, type Product as ProductData } from "../content/site";
import {
  CloudExperience,
  DesignExperience,
  LoomExperience,
} from "../components/ProductExperiences";
import { ExternalLink } from "../components/Layout";

const appUrls = {
  cloud: import.meta.env.VITE_CLOUD_URL,
  loom: import.meta.env.VITE_LOOM_URL,
  design: import.meta.env.VITE_DESIGN_URL,
};
function safeAppUrl(value: string | undefined): string | undefined {
  if (!value) return;
  try {
    const url = new URL(value);
    if (url.protocol === "https:" || url.protocol === "http:") return url.href;
  } catch {
    /* Fall back to the existing product note. */
  }
}
export function ProductPage({ product }: { product: ProductData }) {
  const appUrl = safeAppUrl(appUrls[product.id]);
  return (
    <div className="atelier-home atelier-product-page">
      <section className="atelier-container product-detail-intro">
        <a className="back-link" href="/#products">
          <ArrowLeft size={16} />
          全部产品
        </a>
        <div className="detail-title">
          <span>{product.label}</span>
          <h1>{product.name}</h1>
          <h2>{product.tagline}</h2>
          <p>{product.detail}</p>
          <div className="detail-actions">
            {appUrl ? (
              <ExternalLink href={appUrl} className="atelier-button">
                打开 {product.id}
                <ArrowUpRight size={18} />
              </ExternalLink>
            ) : (
              <a className="atelier-button" href={`/blog/${product.note}/`}>
                阅读产品笔记
                <ArrowUpRight size={18} />
              </a>
            )}
            <a href="#product-preview" className="chapter-link">
              体验交互示例
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
      <section
        id="product-preview"
        className="atelier-container product-detail-preview"
        aria-label={`${product.name} 概念演示`}
      >
        {product.id === "cloud" ? (
          <CloudExperience />
        ) : product.id === "loom" ? (
          <LoomExperience />
        ) : (
          <DesignExperience />
        )}
        <p className="demo-disclaimer">
          交互概念演示，用于说明产品方向。示意数据在当前页面运行，未连接产品服务。
        </p>
      </section>
      <section className="atelier-container product-detail-features">
        <h2>让工具服务于工作。</h2>
        <div>
          {product.features.map((feature) => (
            <article key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="atelier-container product-detail-related">
        <h2>继续认识 Mapseek。</h2>
        <div>
          {products
            .filter((item) => item.id !== product.id)
            .map((item) => (
              <a href={`/products/${item.id}/`} key={item.id}>
                <span>
                  {item.label}
                  <strong>{item.name}</strong>
                </span>
                <ArrowUpRight size={28} />
              </a>
            ))}
        </div>
      </section>
    </div>
  );
}
