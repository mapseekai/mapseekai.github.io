import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowDown, ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from 'lucide-react';
import { Brand } from './Brand';
import { footerGroups, productLinks, resourceGroups, type NavigationLink } from '../content/navigation';

type Dropdown = 'products' | 'resources';
function NavLink({ item, onNavigate }: { item: NavigationLink; onNavigate?: () => void }) {
  return <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined} onClick={onNavigate}>
    <span><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span>
    <ArrowUpRight size={14} aria-hidden="true" />
    {item.external && <span className="sr-only">（在新标签页打开）</span>}
  </a>;
}

export function CraftHeader({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [dropdown, setDropdown] = useState<Dropdown | null>(null);
  const [dark, setDark] = useState(false);
  const header = useRef<HTMLElement>(null);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const triggers = useRef<Partial<Record<Dropdown, HTMLButtonElement | null>>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimer = () => { if (closeTimer.current) clearTimeout(closeTimer.current); closeTimer.current = null; };
  const close = () => { stopTimer(); setOpen(false); setDropdown(null); };
  useEffect(() => {
    setDark(document.documentElement.dataset.craftTheme === 'dark');
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (dropdown) { const previous = dropdown; setDropdown(null); triggers.current[previous]?.focus(); }
      else if (open) { setOpen(false); mobileTrigger.current?.focus(); }
    };
    const outside = (event: PointerEvent) => { if (!header.current?.contains(event.target as Node)) close(); };
    document.addEventListener('keydown', escape); document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); stopTimer(); };
  }, [open, dropdown]);
  function toggleTheme() {
    const next = !dark; setDark(next);
    document.documentElement.dataset.craftTheme = next ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#121614' : '#f2f1ee');
    try { localStorage.setItem('mapseek-theme', next ? 'dark' : 'light'); } catch { /* In-memory theme remains available. */ }
  }
  function firstLink(kind: Dropdown, event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault(); setDropdown(kind);
    requestAnimationFrame(() => header.current?.querySelector<HTMLAnchorElement>(`#nav-${kind}-panel a`)?.focus());
  }
  function panelKeys(event: KeyboardEvent<HTMLDivElement>) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const items = [...event.currentTarget.querySelectorAll<HTMLAnchorElement>('a[href]')];
    if (!items.length) return;
    event.preventDefault(); const index = items.indexOf(document.activeElement as HTMLAnchorElement);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : (index + (event.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length;
    items[next]?.focus();
  }
  function leave() { stopTimer(); closeTimer.current = setTimeout(() => setDropdown(null), 140); }
  return <header className="craft-header" ref={header} data-menu-open={dropdown ?? ''}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setDropdown(null); setOpen(false); } }}>
    <div className="craft-brand"><Brand /></div>
    <nav id="craft-navigation" aria-label="主导航" className={open ? 'is-open' : ''}>
      <div className="nav-disclosure nav-products" onMouseEnter={stopTimer} onMouseLeave={leave}>
        <button ref={element => { triggers.current.products = element; }} type="button" className="site-nav-trigger" aria-expanded={dropdown === 'products'} aria-controls="nav-products-panel"
          data-current={path.startsWith('/products')} onKeyDown={event => firstLink('products', event)} onClick={() => { stopTimer(); setDropdown(value => value === 'products' ? null : 'products'); }}>
          产品<ChevronDown size={12} aria-hidden="true" />
        </button>
        <div id="nav-products-panel" className="site-nav-panel product-nav-panel" hidden={dropdown !== 'products'} onKeyDown={panelKeys} data-lenis-prevent>
          <span className="nav-panel-heading">MAPSEEK 产品</span>
          {productLinks.map(item => <NavLink key={item.href} item={item} onNavigate={close} />)}
          <a className="nav-panel-all" href="/#products" onClick={close}>浏览全部产品<ArrowDown size={13} aria-hidden="true" /></a>
        </div>
      </div>
      <div className="nav-disclosure nav-resources" onMouseEnter={stopTimer} onMouseLeave={leave}>
        <button ref={element => { triggers.current.resources = element; }} type="button" className="site-nav-trigger" aria-expanded={dropdown === 'resources'} aria-controls="nav-resources-panel"
          data-current={path === '/resources' || path === '/open-source'} onKeyDown={event => firstLink('resources', event)} onClick={() => { stopTimer(); setDropdown(value => value === 'resources' ? null : 'resources'); }}>
          资源<ChevronDown size={12} aria-hidden="true" />
        </button>
        <div id="nav-resources-panel" className="site-nav-panel resources-nav-panel" hidden={dropdown !== 'resources'} onKeyDown={panelKeys} data-lenis-prevent>
          {resourceGroups.map(group => <section key={group.title}><h2>{group.title}</h2>{group.items.map(item => <NavLink key={item.href} item={item} onNavigate={close} />)}</section>)}
        </div>
      </div>
      <a className="site-nav-direct" href="/pricing/" aria-current={path === '/pricing' ? 'page' : undefined} onMouseEnter={() => setDropdown(null)} onClick={close}>价格</a>
      <a className="site-nav-direct" href="/blog/" aria-current={path.startsWith('/blog') ? 'page' : undefined} onMouseEnter={() => setDropdown(null)} onClick={close}>博客</a>
    </nav>
    <div className="craft-header-actions">
      <button className="craft-theme-toggle" type="button" onClick={toggleTheme} aria-label={dark ? '切换为浅色模式' : '切换为深色模式'} aria-pressed={dark}>{dark ? <Sun size={17} /> : <Moon size={17} />}</button>
      <a className="craft-header-cta" href="/#products">探索产品<ArrowDown size={14} aria-hidden="true" /></a>
      <button className="craft-menu" type="button" ref={mobileTrigger} onClick={() => { stopTimer(); setOpen(value => !value); setDropdown(null); }} aria-expanded={open} aria-controls="craft-navigation" aria-label={open ? '关闭导航' : '打开导航'}>{open ? <X size={21} /> : <Menu size={21} />}</button>
    </div>
  </header>;
}

export function CraftFooter() {
  return <footer className="craft-footer craft-directory-footer" id="site-footer" data-scroll-context="网站导航">
    <div className="footer-directory">
      <div className="footer-brand-cell"><Brand /><p>空间数据、浏览器编辑<br />与 AI 地图设计。</p><span>为真实的地理空间工作而设计。</span></div>
      {footerGroups.map(group => <nav className="footer-link-column" aria-label={`页脚${group.title}`} key={group.title}><h2>{group.title}</h2>{group.items.map(item => <a key={item.href} href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}>{item.label}{item.external && <span className="sr-only">（在新标签页打开）</span>}</a>)}</nav>)}
    </div>
    <div className="footer-directory-bottom"><span>© 2026 MapseekAI</span><span>Designed for spatial work.</span><a href="#top">回到顶部<ArrowUpRight size={14} aria-hidden="true" /></a></div>
  </footer>;
}
