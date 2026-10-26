import {
  ArrowDown,
  ArrowUpRight,
  Database,
  Layers,
  PenTool,
} from "lucide-react";
import type { Post } from "../content/site";
import { EditorialArt } from "../components/Art";
import {
  CloudExperience,
  DesignExperience,
  LoomExperience,
} from "../components/ProductExperiences";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="post-card">
      <a href={`/blog/${post.slug}/`}>
        <EditorialArt type={post.visual} />
        <div className="post-copy">
          <h3>{post.title}</h3>
          <p>{post.summary}</p>
          <div className="post-meta">
            <span>{post.category}</span>
            <span>{post.readTime}阅读</span>
          </div>
        </div>
      </a>
    </article>
  );
}

export function Home() {
  return (
    <div className="atelier-home">
      <section className="atelier-hero">
        <picture className="hero-earth">
          <source
            media="(max-width: 640px)"
            srcSet="/assets/atelier/alpine-lakes-small.webp"
          />
          <img
            src="/assets/atelier/alpine-lakes.webp"
            alt="南阿尔卑斯山脉与冰川湖泊的卫星影像"
            width="2200"
            height="1600"
            fetchPriority="high"
          />
        </picture>
        <div className="hero-shade" />
        <div className="atelier-container hero-content">
          <div className="hero-heading">
            <span className="hero-overline">空间，有更多可能。</span>
            <h1>
              让空间数据，
              <br />
              成为创造的起点。
            </h1>
            <p>
              管理数据，编辑空间，设计地图。
              <br />
              三个专注的工具，让想法抵达真实的世界。
            </p>
            <a className="atelier-button light" href="#products">
              探索 Mapseek
              <ArrowUpRight size={18} />
            </a>
          </div>

          <div className="hero-product-rail">
            <a href="#cloud">
              <Database size={19} />
              <span>
                Cloud<small>数据的统一空间</small>
              </span>
              <ArrowUpRight size={18} />
            </a>
            <a href="#loom">
              <Layers size={19} />
              <span>
                Loom<small>精准的要素编辑</small>
              </span>
              <ArrowUpRight size={18} />
            </a>
            <a href="#design">
              <PenTool size={19} />
              <span>
                Design<small>自由的地图表达</small>
              </span>
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>

      <section
        className="atelier-intro atelier-container"
        id="products"
        data-reveal
      >
        <span id="workflow" className="legacy-anchor" />
        <div>
          <span className="section-kicker">Mapseek 产品系列</span>
          <h2>
            各自专注，
            <br />
            让创造更进一步。
          </h2>
        </div>
        <p>
          把复杂留给工具，
          <br />
          把判断、灵感与表达留给你。
        </p>
        <a href="#cloud" className="round-down" aria-label="查看 Cloud 产品">
          <ArrowDown size={24} />
        </a>
      </section>

      <section className="product-chapter chapter-cloud" id="cloud">
        <div className="atelier-container">
          <div className="chapter-heading" data-reveal>
            <div className="product-wordmark">
              <span className="product-number">01</span>
              <span>
                Mapseek <b>Cloud</b>
              </span>
            </div>
            <div className="chapter-copy">
              <h2>
                数据有序，
                <br />
                工作自有章法。
              </h2>
              <div>
                <p>
                  从数据集到地图服务，让矢量、影像与空间处理，
                  <br className="wide-break" />
                  围绕同一份清晰的数据开展。
                </p>
                <a className="chapter-link" href="/products/cloud/">
                  认识 Cloud
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
          </div>
          <div data-reveal>
            <CloudExperience />
          </div>
          <div className="chapter-details">
            <span>空间数据平台</span>
            <p>
              数据管理
              <span />
              空间分析
              <span />
              服务发布
            </p>
            <a href="/products/cloud/" aria-label="了解 Mapseek Cloud">
              <ArrowUpRight size={22} />
            </a>
          </div>
        </div>
      </section>

      <section className="product-chapter chapter-loom" id="loom">
        <div className="atelier-container">
          <div className="chapter-heading" data-reveal>
            <div className="product-wordmark">
              <span className="product-number">02</span>
              <span>
                Mapseek <b>Loom</b>
              </span>
            </div>
            <div className="chapter-copy">
              <h2>细节，在你掌握之中。</h2>
              <div>
                <p>
                  地图就是工作台。围绕图层、几何和属性，
                  <br className="wide-break" />
                  在浏览器里，把每一次编辑做准确。
                </p>
                <a className="chapter-link" href="/products/loom/">
                  认识 Loom
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
          </div>
          <div data-reveal>
            <LoomExperience />
          </div>
          <div className="chapter-details">
            <span>浏览器空间编辑器</span>
            <p>
              几何编辑
              <span />
              属性管理
              <span />
              图层组织
            </p>
            <a href="/products/loom/" aria-label="了解 Mapseek Loom">
              <ArrowUpRight size={22} />
            </a>
          </div>
        </div>
      </section>

      <section className="product-chapter chapter-design" id="design">
        <div className="atelier-container">
          <div className="chapter-heading" data-reveal>
            <div className="product-wordmark">
              <span className="product-number">03</span>
              <span>
                Mapseek <b>Design</b>
              </span>
            </div>
            <div className="chapter-copy">
              <h2>
                不只是显示，
                <br />
                更是你的表达。
              </h2>
              <div>
                <p>
                  将设计意图、地图样式与 AI 协作放在一起。
                  <br className="wide-break" />
                  在每一轮预览与调整中，找到地图自己的语言。
                </p>
                <a className="chapter-link" href="/products/design/">
                  认识 Design
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
          </div>
          <div data-reveal>
            <DesignExperience />
          </div>
          <div className="chapter-details">
            <span>AI 地图设计工作台</span>
            <p>
              AI 辅助设计
              <span />
              样式编辑
              <span />
              本地优先
            </p>
            <a href="/products/design/" aria-label="了解 Mapseek Design">
              <ArrowUpRight size={22} />
            </a>
          </div>
        </div>
      </section>
      <section className="atelier-close atelier-container" data-reveal>
        <p>
          从一份数据，
          <br />
          到你想创造的世界。
        </p>
        <a className="atelier-button" href="#products">
          找到你的工具
          <ArrowUpRight size={18} />
        </a>
      </section>
    </div>
  );
}
