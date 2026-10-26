import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { CommandMenu } from './CommandMenu';
import { Brand, BrandMark, Github } from './Brand';
import { githubOrg, products } from '../content/site';

export function ExternalLink({ href, className = '', children }: { href: string; className?: string; children: ReactNode }) {
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only">（在新标签页打开）</span></a>;
}

export function Header({ path }: { path: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const productRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    const top = document.getElementById("top");
    if (top) observer.observe(top);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handleClick(event: PointerEvent) {
      if (!headerRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
        setProductsOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      if (productsOpen) { setProductsOpen(false); productRef.current?.focus(); }
      else if (menuOpen) { setMenuOpen(false); menuRef.current?.focus(); }
    }
    document.addEventListener('pointerdown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('pointerdown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen, productsOpen]);

  return <header className={`site-header ${path === '/' ? 'site-header-home' : ''}`} ref={headerRef} data-scrolled={scrolled}>
    <div className="header-inner container">
      <Brand />
      <button type="button" className="mobile-toggle icon-button" ref={menuRef} aria-label={menuOpen ? '关闭导航' : '打开导航'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={24} /> : <Menu size={24} />}</button>
      <nav id="main-navigation" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="主导航">
        <div className="nav-product">
          <button type="button" ref={productRef} className={`nav-link ${path.startsWith('/products') ? 'is-current' : ''}`} aria-expanded={productsOpen} aria-controls="product-navigation" onClick={() => setProductsOpen((value) => !value)}>产品<ChevronDown size={16} aria-hidden="true" /></button>
          {productsOpen && <div className="product-dropdown" id="product-navigation">{products.map((item) => <a key={item.id} href={`/products/${item.id}/`}><strong>{item.name}</strong><small>{item.label}</small></a>)}</div>}
        </div>
        <a className="nav-link" href="/#workflow" onClick={() => setMenuOpen(false)}>工作流</a>
        <a className="nav-link" href="/open-source/" aria-current={path === '/open-source' ? 'page' : undefined}>开放生态</a>
        <a className="nav-link" href="/blog/" aria-current={path.startsWith('/blog') ? 'page' : undefined}>博客</a>
        <div className="mobile-nav-products">{products.map((item) => <a href={`/products/${item.id}/`} key={item.id}>{item.name}</a>)}</div>
      </nav>
      <div className="header-actions"><CommandMenu /><ExternalLink href={githubOrg} className="github-link"><Github size={20} /><span>GitHub</span></ExternalLink><a className="button button-small button-outline" href="/#products">探索产品</a></div>
    </div>
  </header>;
}

export function Footer() {
  return <footer className="site-footer">
    <div className="container footer-main">
      <div className="footer-brand"><Brand /><p>为每一种空间想象，<br />提供创造的工具。</p></div>
      <div className="footer-column"><h2>产品</h2>{products.map((item) => <a key={item.id} href={`/products/${item.id}/`}>{item.name}</a>)}</div>
      <div className="footer-column"><h2>探索</h2><a href="/#workflow">空间工作流</a><a href="/open-source/">开放生态</a><a href="/blog/">博客与技术笔记</a></div>
      <div className="footer-column"><h2>一起构建</h2><ExternalLink href={githubOrg}>GitHub</ExternalLink><ExternalLink href={`${githubOrg}/tasklane`}>tasklane</ExternalLink><ExternalLink href={`${githubOrg}/cartography.md`}>cartography.md</ExternalLink></div>
    </div>
    <div className="container footer-bottom"><span>© 2026 MapseekAI</span><span>为地理空间而构建</span><a href="#top">回到顶部</a></div>
  </footer>;
}

export function SectionHeading({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="section-heading"><h2>{title}</h2>{children}</div>;
}

export function Endcap() {
  return <section className="endcap"><div className="container endcap-inner"><div className="endcap-mark"><BrandMark /></div><h2>下一张地图，<br />从这里开始。</h2><a className="button" href="/#products">找到你的工作台</a></div></section>;
}
