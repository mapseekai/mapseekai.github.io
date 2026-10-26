import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react';
import { Brand } from './Brand';

const navigation = [['cloud', 'Cloud'], ['loom', 'Loom'], ['design', 'Design']] as const;

export function CraftHeader({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const header = useRef<HTMLElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    setDark(document.documentElement.dataset.craftTheme === 'dark');
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) { setOpen(false); trigger.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (open && !header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('keydown', escape); document.removeEventListener('pointerdown', outside); };
  }, [open]);
  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.craftTheme = next ? 'dark' : 'light';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#141715' : '#f2f1ee');
    try { localStorage.setItem('mapseek-theme', next ? 'dark' : 'light'); } catch { /* Current-tab switching still works when storage is disabled. */ }
  }
  return <header className="craft-header" ref={header}>
    <div className="craft-brand"><Brand /></div>
    <nav id="craft-navigation" aria-label="产品导航" className={open ? 'is-open' : ''}>
      {navigation.map(([id, name]) => <a key={id} href={`/#${id}`} aria-current={path === `/products/${id}` ? 'page' : undefined} onClick={() => setOpen(false)}>{name}<ArrowUpRight size={14} aria-hidden="true" /></a>)}
    </nav>
    <div className="craft-header-actions">
      <button className="craft-theme-toggle" type="button" onClick={toggleTheme} aria-label={dark ? '切换为浅色模式' : '切换为深色模式'} aria-pressed={dark}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
      <a className="craft-header-cta" href="/#products">探索产品<ArrowDown size={14} aria-hidden="true" /></a>
      <button className="craft-menu" type="button" ref={trigger} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="craft-navigation" aria-label={open ? '关闭导航' : '打开导航'}>{open ? <X size={21} /> : <Menu size={21} />}</button>
    </div>
  </header>;
}

export function CraftRail({ home }: { home: boolean }) {
  const [active, setActive] = useState('overview');
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.round(scrollY / max * 100)) : 0);
      const candidates = ['overview', 'cloud', 'loom', 'design'].map((id) => ({ id, element: document.getElementById(id) })).filter((entry) => entry.element);
      const current = candidates.filter((entry) => entry.element!.getBoundingClientRect().top <= innerHeight * 0.42).at(-1);
      setActive(current?.id ?? 'overview');
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
    return () => { window.removeEventListener('scroll', request); window.removeEventListener('resize', request); cancelAnimationFrame(frame); };
  }, []);
  return <aside className="craft-reading-rail" aria-label="章节与阅读进度">
    <div className="rail-progress" role="progressbar" aria-label="页面阅读进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ transform: `scaleY(${progress / 100})` }} /></div>
    {home && <nav aria-label="章节导航">{[['overview', '总览'], ...navigation].map(([id, label]) => <a key={id} href={`#${id}`} aria-label={`前往 ${label}`} aria-current={active === id ? 'location' : undefined}><span>{label}</span></a>)}</nav>}
  </aside>;
}

export function CraftFooter() {
  return <footer className="craft-footer">
    <div className="craft-footer-top"><Brand /><p>空间数据。空间编辑。地图设计。</p><a href="#top">回到顶部<ArrowUpRight size={16} aria-hidden="true" /></a></div>
    <div className="craft-footer-bottom"><span>© 2026 MapseekAI</span><span>Designed for spatial work.</span><div>{navigation.map(([id, name]) => <a key={id} href={`/products/${id}/`}>{name}</a>)}</div></div>
  </footer>;
}
