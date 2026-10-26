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
// C2-continuous endpoints avoid a visible acceleration kink when a letter joins the vertical rail.
const ease = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

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
    let headerHeight = 48, stripHeight = 38;
    let rulerLeft = 0, rulerWidth = 60;
    const headingSize = 34;
    let positions: number[] = [];
    let boundaries: { element: HTMLElement; y: number }[] = [];
    let contexts: { y: number; text: string }[] = [];
    let glyphWidths: number[][] = [];
    let labelWidths: number[] = [];
    let activeIndex = 0, activeContext = '';
    let lastPercentage = -1;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const measure = () => {
      width = document.documentElement.clientWidth; height = innerHeight;
      const styles = getComputedStyle(site);
      headerHeight = parseFloat(styles.getPropertyValue('--craft-header-h')) || 48;
      stripHeight = parseFloat(styles.getPropertyValue('--craft-strip-h')) || 38;
      const rulerBounds = ruler.current?.getBoundingClientRect();
      rulerLeft = rulerBounds?.left ?? width - 60;
      rulerWidth = rulerBounds?.width || 60;
      documentHeight = Math.max(1, document.documentElement.scrollHeight - height);
      positions = chapters.map(chapter => {
        const element = document.getElementById(chapter.id);
        return element ? element.getBoundingClientRect().top + scrollY : 0;
      });
      boundaries = [...site.querySelectorAll<HTMLElement>('[data-section-boundary]')].map(element => ({
        element, y: element.getBoundingClientRect().top + scrollY,
      }));
      contexts = [...document.querySelectorAll<HTMLElement>('[data-scroll-context]')].map(element => ({
        y: element.getBoundingClientRect().top + scrollY,
        text: element.dataset.scrollContext || '',
      }));
      if (context) context.font = `620 ${headingSize}px ${styles.getPropertyValue('--craft-display')}`;
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
      // Reveal the two junction ticks only as their section boundary enters the reading area.
      // No timer or permanent luminous border: the same position gives the same result in reverse.
      boundaries.forEach(({ element, y: boundaryY }) => {
        const screenY = boundaryY - y;
        const enter = ease(clamp((height - 24 - screenY) / Math.max(80, height * .18)));
        const leave = ease(clamp((screenY - chrome + 2) / 20));
        const visible = enter * leave;
        element.style.setProperty('--boundary-visibility', visible.toFixed(4));
        element.style.setProperty('--boundary-scale', (reduce.matches ? 1 : interpolate(.45, 1, enter)).toFixed(4));
        element.dataset.visible = String(visible > .01);
      });
      site.dataset.boundariesReady = 'true';
      if (width < 1100) return;

      // Four scroll-bound poses: queued horizontal -> quarter-turn -> vertical rail -> horizontal dock.
      // The middle phase holds a real -90deg baseline; it must not be a single sinusoidal tilt.
      const trigger = chrome + 26;
      let settled = 0;
      positions.forEach((position, index) => { if (position <= y + trigger) settled = index; });
      const next = Math.min(chapters.length - 1, settled + 1);
      const boundaryY = positions[next] - y;
      const incomingLength = labelWidths[next] * (20 / headingSize);
      const entryStart = height - 36;
      const entryEnd = entryStart - incomingLength - 100;
      const dockStart = trigger + 72 + incomingLength * .84;
      const entry = next > settled ? clamp((entryStart - boundaryY) / Math.max(80, entryStart - entryEnd)) : 0;
      const docking = next > settled ? clamp((dockStart - boundaryY) / Math.max(90, dockStart - trigger)) : 0;
      const right = rulerLeft;
      const railX = rulerLeft + rulerWidth / 2; // The reference places vertical lettering inside the ruler.
      const top = headerHeight + 28;
      const small = 16 / headingSize, vertical = 20 / headingSize;
      chapters.forEach((chapter, index) => {
        const isIncoming = index === next && next !== settled;
        const done = index < settled;
        const futureY = height - 36 - (chapters.length - 1 - index) * 20;
        const dockY = top + index * 20 + 26;
        const pastY = top + index * 20;
        let labelY = done ? pastY : index === settled ? dockY : futureY;
        let scale = done || index > settled ? small : 1;
        if (index === settled && docking > 0 && !reduce.matches) {
          labelY = interpolate(dockY, pastY, ease(docking));
          scale = interpolate(1, small, ease(docking));
        }
        if (reduce.matches) {
          scale = index === nextIndex ? 1 : small;
          labelY = index < nextIndex ? pastY : index === nextIndex ? dockY : futureY;
        }
        let offset = 0;
        let maxDock = 0, minDock = 1, minTurn = 1, maxTurn = 0;
        const boxes: { left: number; right: number; top: number; bottom: number }[] = [];
        const phase = isIncoming && !reduce.matches
          ? docking > 0 ? 'docking' : entry >= 1 ? 'vertical' : entry > 0 ? 'turning' : 'queued'
          : index === (reduce.matches ? nextIndex : settled) ? 'docked' : done ? 'past' : 'queued';
        letters.current[index]?.forEach((letter, characterIndex) => {
          if (!letter) return;
          const glyphWidth = glyphWidths[index][characterIndex];
          let glyphScale = scale;
          let x = right - labelWidths[index] * scale + (offset + glyphWidth / 2) * scale;
          let letterY = labelY, rotation = 0;
          let glyphEmphasis = index === settled ? 1 - ease(docking) : 0;
          if (isIncoming && !reduce.matches) {
            // The leading end turns first, then the remaining characters follow; the word is
            // rigid and readable during its vertical travel, rather than spaced on a diagonal.
            const fraction = characterIndex / Math.max(1, chapter.label.length - 1);
            const verticalY = boundaryY + (labelWidths[index] - offset - glyphWidth / 2) * vertical;
            // A letter turns when it physically reaches the bend, not at a word-wide percentage.
            const turn = ease(clamp((futureY + 36 - verticalY) / 100));
            const dock = ease(clamp((trigger + 72 + offset * vertical * .84 - boundaryY) / (58 + fraction * 10)));
            maxDock = Math.max(maxDock, dock); minDock = Math.min(minDock, dock);
            minTurn = Math.min(minTurn, turn); maxTurn = Math.max(maxTurn, turn);
            const queuedX = right - labelWidths[index] * small + (offset + glyphWidth / 2) * small;
            const dockX = right - labelWidths[index] + offset + glyphWidth / 2;
            x = interpolate(interpolate(queuedX, railX, turn), dockX, dock);
            letterY = interpolate(interpolate(futureY, verticalY, turn), dockY, dock);
            glyphScale = interpolate(interpolate(small, vertical, turn), 1, dock);
            rotation = -90 * turn * (1 - dock);
            glyphEmphasis = dock;
          }
          const radians = rotation * Math.PI / 180;
          const halfWidth = (Math.abs(Math.cos(radians)) * glyphWidth + Math.abs(Math.sin(radians)) * headingSize) * glyphScale / 2;
          const halfHeight = (Math.abs(Math.sin(radians)) * glyphWidth + Math.abs(Math.cos(radians)) * headingSize) * glyphScale / 2;
          x = Math.max(halfWidth + 4, Math.min(width - 4 - halfWidth, x));
          boxes.push({ left: x - halfWidth, right: x + halfWidth, top: letterY - halfHeight, bottom: letterY + halfHeight });
          if (reduce.matches) glyphEmphasis = index === nextIndex ? 1 : 0;
          const emphasized = glyphEmphasis >= .5;
          letter.style.transform = `translate3d(${x.toFixed(3)}px,${letterY.toFixed(3)}px,0) translate(-50%,-50%) rotate(${rotation.toFixed(3)}deg) scale(${glyphScale.toFixed(5)})`;
          letter.style.color = `color-mix(in srgb, var(--craft-ink) ${(glyphEmphasis * 100).toFixed(2)}%, var(--craft-orbit-muted))`;
          letter.dataset.active = String(emphasized);
          letter.dataset.phase = phase;
          offset += glyphWidth;
        });
        // The hit area follows the actual rotated glyph bounds, including the vertical hold.
        const link = links.current[index];
        if (link && boxes.length) {
          const left = Math.min(...boxes.map(box => box.left)) - 6;
          const rightEdge = Math.min(width - 2, Math.max(...boxes.map(box => box.right)) + 6);
          const topEdge = Math.min(...boxes.map(box => box.top)) - 5;
          const bottom = Math.max(...boxes.map(box => box.bottom)) + 5;
          link.style.left = `${left}px`; link.style.top = `${topEdge}px`;
          link.style.width = `${Math.max(24, rightEdge - left)}px`;
          link.style.height = `${Math.max(28, bottom - topEdge)}px`;
          link.style.pointerEvents = 'auto';
          link.dataset.phase = isIncoming && !reduce.matches
            ? minDock >= .999 ? 'docked' : maxDock > .001 ? 'docking' : minTurn >= .999 ? 'vertical' : maxTurn > .001 ? 'turning' : 'queued'
            : phase;
        }
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
      delete site.dataset.boundariesReady;
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
          {Array.from(entry.label).map((letter, i) => <span aria-hidden="true" className="orbit-letter" data-chapter={entry.id} ref={element => { (letters.current[index] ??= [])[i] = element; }} key={i}>{letter}</span>)}
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
