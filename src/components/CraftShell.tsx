import { Fragment, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { ArrowDown } from 'lucide-react';

export { CraftHeader, CraftFooter } from './SiteNavigation';

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
  const tickTrack = useRef<HTMLDivElement>(null);
  const ticks = useRef<(HTMLSpanElement | null)[]>([]);
  const digits = useRef<(HTMLSpanElement | null)[]>([]);
  const readout = useRef<HTMLSpanElement>(null);
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
    let lastPercentage = -1;
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
      const rulerHeight = Math.max(1, height - headerHeight - stripHeight - 64);
      ticks.current.forEach((tick, index) => { if (tick) tick.style.top = `${index / 100 * (documentHeight + rulerHeight)}px`; });
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
      if (tickTrack.current) tickTrack.current.style.transform = `translate3d(0,${-y}px,0)`;
      const rulerHeight = Math.max(1, height - headerHeight - stripHeight - 64);
      ticks.current.forEach((tick, index) => { if (tick && index % 5 === 0) tick.dataset.near = String(Math.abs(index / 100 * (documentHeight + rulerHeight) - y - progress * rulerHeight) < 14); });
      const percentage = Math.round(progress * 100);
      if (percentage !== lastPercentage) {
        lastPercentage = percentage;
        const values = String(percentage).padStart(3, '0');
        digits.current.forEach((digit, index) => { if (digit) digit.style.transform = `translateY(${-Number(values[index])}em)`; });
        if (readout.current) readout.current.dataset.value = `${percentage}%`;
      }
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
      const right = width - Math.max(64, gutter * .45);
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
          letter.dataset.active = String(isHighlighted);
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
    const seek = (fraction: number, immediate = false) => {
      const top = clamp(fraction) * documentHeight;
      if (lenis) lenis.scrollTo(top, { immediate, duration: .7, easing: t => 1 - Math.pow(1 - t, 4) });
      else window.scrollTo({ top, behavior: 'instant' });
    };
    let pointer: number | null = null;
    const rulerDown = (event: PointerEvent) => {
      if (event.button !== 0 || !ruler.current) return;
      event.preventDefault(); pointer = event.pointerId; ruler.current.focus({ preventScroll: true });
      ruler.current.setPointerCapture(pointer);
      const bounds = ruler.current.getBoundingClientRect();
      seek((event.clientY - bounds.top) / bounds.height);
    };
    const rulerMove = (event: PointerEvent) => {
      if (event.pointerId !== pointer || !ruler.current) return;
      const bounds = ruler.current.getBoundingClientRect(); seek((event.clientY - bounds.top) / bounds.height, true);
    };
    const rulerUp = () => { pointer = null; };
    const rulerKey = (event: KeyboardEvent) => {
      const keys: Record<string, number> = { ArrowDown: .01, ArrowUp: -.01, PageDown: .1, PageUp: -.1 };
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); seek(event.key === 'Home' ? 0 : 1); }
      else if (event.key in keys) { event.preventDefault(); seek(scrollY / documentHeight + keys[event.key]); }
    };
    const rulerElement = ruler.current;
    rulerElement?.addEventListener('pointerdown', rulerDown);
    rulerElement?.addEventListener('pointermove', rulerMove);
    rulerElement?.addEventListener('pointerup', rulerUp);
    rulerElement?.addEventListener('pointercancel', rulerUp);
    rulerElement?.addEventListener('keydown', rulerKey);
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
      rulerElement?.removeEventListener('pointerdown', rulerDown); rulerElement?.removeEventListener('pointermove', rulerMove);
      rulerElement?.removeEventListener('pointerup', rulerUp); rulerElement?.removeEventListener('pointercancel', rulerUp); rulerElement?.removeEventListener('keydown', rulerKey);
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
      <div ref={ruler} className="craft-scroll-ruler" role="scrollbar" aria-label="页面阅读进度" aria-controls="main-content" aria-orientation="vertical" tabIndex={0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={0}>
        <div className="ruler-tick-viewport" aria-hidden="true"><div className="ruler-tick-track" ref={tickTrack}>{Array.from({ length: 101 }, (_, index) => <span key={index} ref={element => { ticks.current[index] = element; }} className={index % 5 === 0 ? 'ruler-tick major' : 'ruler-tick'} style={{ top: `${index}%` }}><i />{index % 5 === 0 && <b>{index}</b>}</span>)}</div></div>
        <span className="ruler-fill" ref={line} />
        <span className="ruler-needle" ref={needle}><i className="ruler-signal" /><span className="ruler-readout" ref={readout} data-value="0%" aria-hidden="true">{[0, 1, 2].map(column => <span className="ruler-digit-window" key={column}><span className="ruler-digit-strip" ref={element => { digits.current[column] = element; }}>{Array.from({ length: 10 }, (_, number) => <span key={number}>{number}</span>)}</span></span>)}<small>%</small></span></span>
      </div>
    </aside>
  </>;
}
