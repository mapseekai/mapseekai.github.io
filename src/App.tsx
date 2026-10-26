import { LandingHeader, LandingFooter } from "./components/LandingShell";
import { ArrowUpRight } from "lucide-react";
import { SiteMotion } from "./components/SiteMotion";
import { Footer, Header } from "./components/Layout";
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
  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <div id="top" />
      {clean === "/" || product ? <LandingHeader /> : <Header path={clean} />}
      <main id="main-content">{page}</main>
      {clean === "/" || product ? <LandingFooter /> : <Footer />}
      <SiteMotion path={clean} />
    </>
  );
}
