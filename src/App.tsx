import { CraftHeader, CraftFooter, CraftRail } from "./components/CraftShell";
import { ArrowUpRight } from "lucide-react";
import { SiteMotion } from "./components/SiteMotion";
import { ResourcesPage, PricingPage } from "./pages/Resources";
import { Home } from "./pages/Home";
import { ProductPage } from "./pages/Product";
import { ArticlePage, JournalPage } from "./pages/Journal";
import { EcosystemPage } from "./pages/Ecosystem";
import { normalizePath, posts, products } from "./content/site";

export function App({ path }: { path: string }) {
  const clean = normalizePath(path);
  const product = products.find((item) => clean === `/products/${item.id}`);
  const post = posts.find((item) => clean === `/blog/${item.slug}`);
  let page;
  if (clean === "/") page = <Home />;
  else if (product) page = <ProductPage product={product} />;
  else if (post) page = <ArticlePage post={post} />;
  else if (clean === "/blog") page = <JournalPage />;
  else if (clean === "/open-source") page = <EcosystemPage />;
  else if (clean === "/resources") page = <ResourcesPage />;
  else if (clean === "/pricing") page = <PricingPage />;
  else
    page = (
      <section className="container not-found">
        <h1>这片区域，还没有被绘制。</h1>
        <p>页面可能已移动，也可能是一个尚未标记的坐标。</p>
        <a className="button" href="/">
          返回首页
          <ArrowUpRight size={16} />
        </a>
      </section>
    );
  const isProductSite = clean === "/" || Boolean(product);
  return (
    <div className="craft-site">
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <div id="top" />
      <CraftHeader path={clean} />
      <div className={isProductSite ? "craft-frame" : "craft-frame craft-frame-without-rail"}><main id="main-content" className={!isProductSite ? "craft-editorial-content" : undefined}>{page}</main>
      <CraftFooter /></div>
      {isProductSite && <CraftRail home={clean === "/"} />}
      <SiteMotion path={clean} />
    </div>
  );
}
