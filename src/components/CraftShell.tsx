import { Fragment, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
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

type Chapter = { id: string; label: string; name: string };
const homeChapters: Chapter[] = [
  { id: 'overview', label: 'MAPSEEK', name: '总览' },
  { id: 'cloud', label: 'CLOUD', name: 'Cloud' },
  { id: 'loom', label: 'LOOM', name: 'Loom' },
  { id: 'design', label: 'DESIGN', name: 'Design' },
];
const detailChapters: Chapter[] = [
  { id: 'product-overview', label: 'OVERVIEW', name: '产品介绍' },
  { id: 'product-screens', label: 'INTERFACE', name: '产品界面' },
  { id: 'product-features', label: 'FEATURES', name: '产品能力' },
  { id: 'product-related', label: 'EXPLORE', name: '其他产品' },
];
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const interpolate = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

/** One measured timeline drives the pinned label, chapter lettering and scroll ruler. */
export function CraftRail({ home }: { home: boolean }) {
  const chapters = home ? homeChapters : detailChapters;
  const [current, setCurrent] = useState({ index: 0, context: home ? '地理空间创作工具' : '产品介绍' });
  const links = useRef<(HTMLAnchorElement | null)[]>([]);
  const letters = useRef<(HTMLSpanElement | null)[][]>([]);
  const stage = useRef<HTMLElement>(null);
  const ruler = useRef<HTMLDivElement>(null);
  const needle = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLSpanElement>(null);
  const sectionProgress = useRef<HTMLSpanElement>(null);
  const lastDirection = useRef(1);

  useEffect(() => {
    const root = document.documentElement;
    const site = stage.current?.closest('.craft-site') as HTMLElement | null;
    if (!site) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;
    let frame = 0, requested = 0, previousY = -1, dirty = true;
    let width = innerWidth, height = innerHeight, documentHeight = 1;
    let headerHeight = 48, stripHeight = 38, gutter = 120;
    let positions: number[] = [];
    let contexts: { y: number; text: string }[] = [];
    let glyphWidths: number[][] = [];
    let labelWidths: number[] = [];
    let activeIndex = 0, activeContext = '';
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const measure = () => {
      width = innerWidth; height = innerHeight;
      const styles = getComputedStyle(site);
      headerHeight = parseFloat(styles.getPropertyValue('--craft-header-h')) || 48;
      stripHeight = parseFloat(styles.getPropertyValue('--craft-strip-h')) || 38;
      const bounds = document.querySelector('.craft-frame')?.getBoundingClientRect();
      gutter = bounds ? (width - bounds.width) / 2 : 120;
      documentHeight = Math.max(1, document.documentElement.scrollHeight - height);
      positions = chapters.map(chapter => {
        const element = document.getElementById(chapter.id);
        return element ? element.getBoundingClientRect().top + scrollY : 0;
      });
      contexts = [...document.querySelectorAll<HTMLElement>('[data-scroll-context]')].map(element => ({
        y: element.getBoundingClientRect().top + scrollY,
        text: element.dataset.scrollContext || '',
      }));
      if (context) context.font = `650 32px ${styles.getPropertyValue('--craft-display')}`;
      glyphWidths = chapters.map(chapter => Array.from(chapter.label).map(letter => context?.measureText(letter).width || 20));
      labelWidths = glyphWidths.map(values => values.reduce((sum, value) => sum + value, 0));
      dirty = true;
    };
    const update = () => {
      const y = Math.max(0, scrollY);
      if (y === previousY && !dirty) return;
      const direction = y >= previousY ? 1 : -1;
      lastDirection.current = direction;
      previousY = y; dirty = false;
      const chrome = headerHeight + stripHeight;
      let nextIndex = 0;
      positions.forEach((position, index) => { if (position <= y + chrome + height * .22) nextIndex = index; });
      const nextContext = contexts.filter(entry => entry.y <= y + chrome + height * .22).at(-1)?.text || (home ? '地理空间创作工具' : '产品介绍');
      if (nextIndex !== activeIndex || nextContext !== activeContext) {
        activeIndex = nextIndex; activeContext = nextContext;
        setCurrent({ index: nextIndex, context: nextContext });
      }
      site.dataset.activeChapter = chapters[nextIndex].id;
      const progress = clamp(y / documentHeight);
      ruler.current?.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
      ruler.current?.setAttribute('aria-valuetext', `${chapters[nextIndex].name}，页面已阅读 ${Math.round(progress * 100)}%`);
      if (ruler.current) ruler.current.style.backgroundPositionY = `${-(y * .16) % 40}px`;
      if (line.current) line.current.style.transform = `scaleY(${progress})`;
      if (needle.current) needle.current.style.transform = `translateY(${progress * Math.max(0, height - chrome - 64)}px)`;
      const start = positions[nextIndex];
      const end = positions[nextIndex + 1] ?? documentHeight + height;
      if (sectionProgress.current) sectionProgress.current.style.transform = `scaleX(${clamp((y + chrome - start) / Math.max(1, end - start))})`;
      if (width < 1100) return;

      // Past labels form a quiet top stack. The next word rides a curved path up the edge.
      const trigger = chrome + 26;
      let settled = 0;
      positions.forEach((position, index) => { if (position <= y + trigger) settled = index; });
      const next = Math.min(chapters.length - 1, settled + 1);
      const distance = Math.max(160, height * .68 - trigger);
      const travel = next > settled ? ease(clamp((y - (positions[next] - height * .68)) / distance)) : 0;
      const right = width - Math.max(28, gutter * .25);
      const top = chrome + 18;
      chapters.forEach((chapter, index) => {
        const isIncoming = index === next && next !== settled;
        const done = index < settled;
        const futureY = height - 48 - (chapters.length - 1 - index) * 26;
        let labelY = done ? top + index * 23 : index === settled ? top + settled * 23 + 22 : futureY;
        let scale = done || index > settled ? .5 : 1;
        if (index === settled && travel > 0) {
          labelY = interpolate(labelY, top + index * 23, travel);
          scale = interpolate(1, .5, travel);
        }
        if (isIncoming) { labelY = interpolate(futureY, top + index * 23 + 22, travel); scale = interpolate(.5, 1, travel); }
        if (reduce.matches) {
          scale = index === nextIndex ? 1 : .5;
          labelY = index < nextIndex ? top + index * 23 : index === nextIndex ? top + index * 23 + 22 : futureY;
        }
        const link = links.current[index];
        if (link) {
          link.style.left = `${right - labelWidths[index] * scale - 8}px`;
          link.style.top = `${labelY - 9}px`;
          link.style.width = `${labelWidths[index] * scale + 16}px`;
          link.style.height = `${Math.max(24, 36 * scale)}px`;
          link.style.pointerEvents = isIncoming && travel > .02 && travel < .98 && !reduce.matches ? 'none' : 'auto';
        }
        let offset = 0;
        const isHighlighted = index === nextIndex;
        letters.current[index]?.forEach((letter, characterIndex) => {
          if (!letter) return;
          let x = right - labelWidths[index] * scale + offset * scale;
          let letterY = labelY, rotation = 0;
          if (isIncoming && travel > 0 && travel < 1 && !reduce.matches) {
            const q = clamp((travel - characterIndex * .012) / (1 - (chapter.label.length - 1) * .012));
            const curve = Math.sin(Math.PI * q);
            letterY = interpolate(futureY, top + index * 23 + 22, q);
            const angle = -curve * 68 * Math.PI / 180;
            const local = (offset - labelWidths[index] / 2) * scale;
            x = right - labelWidths[index] * scale / 2 + Math.cos(angle) * local + curve * Math.min(32, gutter * .23);
            letterY += Math.sin(angle) * local;
            x = Math.min(width - 20 - glyphWidths[index][characterIndex] * scale / 2, x);
            rotation = -curve * 68;
          }
          letter.style.transform = `translate3d(${x.toFixed(2)}px,${letterY.toFixed(2)}px,0) rotate(${rotation.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
          letter.style.color = isHighlighted ? 'var(--craft-ink)' : 'var(--craft-orbit-muted)';
          offset += glyphWidths[index][characterIndex];
        });
      });
      stage.current?.setAttribute('data-ready', 'true');
    };
    const request = () => {
      if (!requested && !lenis) requested = requestAnimationFrame(() => { requested = 0; update(); });
    };
    const tick = (time: number) => {
      lenis?.raf(time); update();
      if (lenis && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const configure = () => {
      cancelAnimationFrame(frame); frame = 0;
      lenis?.destroy(); lenis = null;
      if (!reduce.matches) {
        lenis = new Lenis({
          lerp: .12, smoothWheel: true, syncTouch: false, anchors: false,
          prevent: element => Boolean(element.closest('dialog,[data-lenis-prevent]')),
        });
        if (!document.hidden) frame = requestAnimationFrame(tick);
      }
      root.dataset.scrollEngine = lenis ? 'lenis' : 'native';
      dirty = true; update();
    };
    const visibility = () => {
      cancelAnimationFrame(frame); frame = 0;
      if (!document.hidden && lenis) frame = requestAnimationFrame(tick);
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
      const anchor = (event.target as Element)?.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download') || anchor.closest('dialog')) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      let id: string; try { id = decodeURIComponent(url.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      event.preventDefault();
      const top = Math.max(0, target.getBoundingClientRect().top + scrollY - headerHeight - stripHeight - 16);
      if (location.hash !== url.hash) history.pushState(null, '', url.hash);
      const focus = () => {
        if (event.detail !== 0) return;
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      };
      if (lenis) lenis.scrollTo(top, { duration: 1.05, easing: t => 1 - Math.pow(1 - t, 4), onComplete: focus });
      else { window.scrollTo({ top, behavior: 'instant' }); focus(); }
    };
    const resize = () => { measure(); lenis?.resize(); request(); };
    const observer = new ResizeObserver(resize);
    observer.observe(document.querySelector('.craft-frame')!);
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', resize);
    document.addEventListener('click', click);
    document.addEventListener('visibilitychange', visibility);
    reduce.addEventListener('change', configure);
    measure(); configure();
    return () => {
      lenis?.destroy(); observer.disconnect();
      cancelAnimationFrame(frame); cancelAnimationFrame(requested);
      window.removeEventListener('scroll', request); window.removeEventListener('resize', resize);
      document.removeEventListener('click', click); document.removeEventListener('visibilitychange', visibility);
      reduce.removeEventListener('change', configure);
      delete root.dataset.scrollEngine;
    };
  }, [home]);

  const chapter = chapters[current.index];
  return <>
    <div className="craft-section-strip">
      <div className="section-strip-title" data-direction={lastDirection.current}>
        <a key={chapter.id} href={`#${chapter.id}`}><span>{home && current.index > 0 ? 'Mapseek ' : ''}{chapter.name === '总览' ? 'Mapseek' : chapter.name}</span><ArrowDown size={12} aria-hidden="true" /></a>
      </div>
      <span key={current.context} className="section-strip-context">{current.context}</span>
      <span className="section-strip-progress" aria-hidden="true" ref={sectionProgress} />
    </div>
    <aside ref={stage} className="craft-reading-rail" aria-label="章节与阅读进度">
      <nav className="craft-chapter-orbit" aria-label="章节导航">
        {chapters.map((entry, index) => <Fragment key={entry.id}>
          <a href={`#${entry.id}`} ref={element => { links.current[index] = element; }} className="orbit-link" aria-label={`前往 ${entry.name}`} aria-current={current.index === index ? 'location' : undefined}>
            <span className="orbit-fallback">{entry.name}</span>
          </a>
          {Array.from(entry.label).map((letter, i) => <span aria-hidden="true" className="orbit-letter" ref={element => { (letters.current[index] ??= [])[i] = element; }} key={i}>{letter}</span>)}
        </Fragment>)}
      </nav>
      <div ref={ruler} className="craft-scroll-ruler" role="progressbar" aria-label="页面阅读进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
        <span className="ruler-fill" ref={line} /><span className="ruler-needle" ref={needle} />
      </div>
    </aside>
  </>;
}

export function CraftFooter() {
  return <footer className="craft-footer">
    <div className="craft-footer-top"><Brand /><p>空间数据。空间编辑。地图设计。</p><a href="#top">回到顶部<ArrowUpRight size={16} aria-hidden="true" /></a></div>
    <div className="craft-footer-bottom"><span>© 2026 MapseekAI</span><span>Designed for spatial work.</span><div>{navigation.map(([id, name]) => <a key={id} href={`/products/${id}/`}>{name}</a>)}</div></div>
  </footer>;
}
