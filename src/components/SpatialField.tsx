import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

type LandData = { width: number; height: number; path: string };
let landRequest: Promise<LandData> | undefined;
function loadLand(): Promise<LandData> {
  return landRequest ??= fetch('/data/land-path.json').then(async (response) => {
    if (!response.ok) throw new Error('Land illustration unavailable.');
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || !('path' in data) || typeof data.path !== 'string') throw new Error('Invalid land geometry.');
    return data as LandData;
  }).catch((error: unknown) => { landRequest = undefined; throw error; });
}

/** A bounded Canvas 2D animation of public-domain land geometry, not product telemetry. */
export function SpatialField() {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [mode, setMode] = useState<'glyph' | 'point'>('glyph');

  useEffect(() => {
    const element = host.current;
    const surface = canvas.current;
    if (!element || !surface) return;
    const context = surface.getContext('2d');
    if (!context) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(media.matches);
    let disposed = false, visible = false, frame = 0, last = 0, phase = 0;
    let width = 0, height = 0;
    let cells: { x: number; y: number; value: number }[] = [];
    let geometry: LandData | undefined;
    const pointer = { x: -1000, y: -1000 };
    const colors = getComputedStyle(element);
    const inks = ['--field-glyph-soft', '--field-glyph-mid', '--color-accent'].map((name) => colors.getPropertyValue(name).trim());
    const mono = colors.getPropertyValue('--font-outlier').trim();
    const canMove = () => !disposed && visible && !paused && !media.matches && !document.hidden;

    function paint() {
      if (!context || !surface) return;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, width, height);
      const scale = width / 900;
      context.font = `${Math.max(6, 10 * scale)}px ${mono}`;
      context.textBaseline = 'middle';
      const scan = media.matches ? width * 0.63 : (phase % (width + 220)) - 110;
      for (const cell of cells) {
        const x = cell.x * scale, y = cell.y * scale;
        const lens = Math.hypot(x - pointer.x, y - pointer.y) < 72;
        const bright = Math.abs(x - scan) < 32 || lens;
        context.fillStyle = inks[bright ? 2 : cell.value > 0.48 ? 1 : 0];
        if (mode === 'point') {
          context.beginPath(); context.arc(x, y, Math.max(0.8, scale * (bright ? 2.2 : 1.4)), 0, Math.PI * 2); context.fill();
        } else {
          context.fillText(bright ? '+' : ['.', ':', '+', '#'][Math.floor(cell.value * 4) % 4], x, y);
        }
      }
    }
    function tick(now: number) {
      frame = 0;
      if (!canMove()) return;
      if (now - last >= 1000 / 24) {
        phase += Math.min(now - last, 80) * 0.04;
        last = now; paint();
      }
      frame = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frame); frame = 0;
      element!.dataset.motion = media.matches ? 'reduced' : canMove() ? 'running' : 'paused';
      paint();
      if (canMove()) { last = performance.now(); frame = requestAnimationFrame(tick); }
    }
    function resize() {
      if (!geometry || !surface) return;
      const rect = element!.getBoundingClientRect();
      width = rect.width; height = width * 525 / 900;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      surface.width = Math.round(width * dpr); surface.height = Math.round(height * dpr);
      sync();
    }
    function onPreference() { setReduced(media.matches); sync(); }
    function onPointer(event: PointerEvent) {
      if (media.matches || paused) return;
      const rect = element!.getBoundingClientRect(); pointer.x = event.clientX - rect.left; pointer.y = event.clientY - rect.top;
    }
    function onLeave() { pointer.x = -1000; pointer.y = -1000; }
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    const observer = new ResizeObserver(resize);
    intersection.observe(element); observer.observe(element);
    media.addEventListener('change', onPreference);
    document.addEventListener('visibilitychange', sync);
    element.addEventListener('pointermove', onPointer, { passive: true });
    element.addEventListener('pointerleave', onLeave);
    void loadLand().then((data) => {
      if (disposed) return;
      geometry = data;
      const mask = document.createElement('canvas'); mask.width = data.width; mask.height = data.height;
      const c = mask.getContext('2d'); if (!c) return;
      c.fill(new Path2D(data.path), 'evenodd');
      const pixels = c.getImageData(0, 0, data.width, data.height).data;
      for (let y = 9; y < data.height - 7; y += 10) {
        for (let x = 7; x < data.width - 7; x += 7) {
          if (pixels[(y * data.width + x) * 4 + 3] > 80) cells.push({ x, y, value: (Math.sin(x * 0.05 + y * 0.029) + 1) / 2 });
        }
      }
      element.dataset.ready = 'true'; resize();
    }).catch(() => { if (!disposed) element.dataset.motion = 'unavailable'; });
    return () => {
      disposed = true; cancelAnimationFrame(frame); intersection.disconnect(); observer.disconnect();
      media.removeEventListener('change', onPreference); document.removeEventListener('visibilitychange', sync);
      element.removeEventListener('pointermove', onPointer); element.removeEventListener('pointerleave', onLeave);
    };
  }, [mode, paused]);

  return <figure className="spatial-figure">
    <div className="spatial-field" ref={host} data-mode={mode}>
      <img src="/assets/land-field.svg" width="900" height="525" alt="以字符与点阵呈现的世界陆地轮廓" fetchPriority="high" />
      <canvas ref={canvas} aria-hidden="true" />
      <div className="field-coordinate field-coordinate-top" aria-hidden="true">180° W <span>0°</span> 180° E</div>
      <div className="field-crosshair" aria-hidden="true" />
    </div>
    <figcaption className="field-caption">
      <span>同一份地理数据，不同的表达。</span>
      <div className="field-controls" role="group" aria-label="地理数据图形控制">
        <button type="button" aria-pressed={mode === 'glyph'} onClick={() => setMode('glyph')}>字符</button>
        <button type="button" aria-pressed={mode === 'point'} onClick={() => setMode('point')}>点阵</button>
        <button type="button" className="field-pause" aria-label={paused ? '播放地图动效' : '暂停地图动效'} aria-pressed={paused} disabled={reduced} onClick={() => setPaused((value) => !value)}>{paused || reduced ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}</button>
      </div>
    </figcaption>
    <p className="field-credit">陆地轮廓：<a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener noreferrer">Natural Earth</a>，仅作视觉表达示例。</p>
  </figure>;
}
