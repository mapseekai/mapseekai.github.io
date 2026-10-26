import { useEffect, useId, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react";
import { BrandMark } from "./Brand";
import type { ProductId } from "../content/site";

const layers = [
  {
    id: "terrain",
    product: "cloud",
    label: "地形 / TERRAIN",
    x: 16,
    y: 25,
    angle: -16,
    width: 244,
  },
  {
    id: "geometry",
    product: "loom",
    label: "几何 / GEOMETRY",
    x: 84,
    y: 26,
    angle: 14,
    width: 230,
  },
  {
    id: "contours",
    product: "cloud",
    label: "图层 / LAYERS",
    x: 8,
    y: 69,
    angle: 9,
    width: 194,
  },
  {
    id: "cartography",
    product: "design",
    label: "样式 / CARTOGRAPHY",
    x: 87,
    y: 72,
    angle: -11,
    width: 242,
  },
  {
    id: "parcels",
    product: "loom",
    label: "要素 / FEATURES",
    x: 49,
    y: 89,
    angle: -8,
    width: 182,
  },
] as const;
const entries: { id: ProductId; name: string; description: string }[] = [
  { id: "cloud", name: "Cloud", description: "让数据就位" },
  { id: "loom", name: "Loom", description: "把细节做准确" },
  { id: "design", name: "Design", description: "让地图成为表达" },
];
const contourPaths = Array.from({ length: 16 }, (_, index) => {
  const points = Array.from({ length: 89 }, (_, step) => {
    const a = (step / 88) * Math.PI * 2;
    const r =
      13 +
      index * 8.5 +
      Math.sin(a * 3 + index * 0.13) * (4 + index * 0.6) +
      Math.cos(a * 5) * 3;
    return `${(116 + Math.cos(a) * r).toFixed(1)},${(118 + Math.sin(a) * r * 0.74).toFixed(1)}`;
  });
  return `M${points.join("L")}Z`;
});
const blocks = Array.from({ length: 54 }, (_, i) => {
  const x = 214 + (i % 6) * 31,
    y = 15 + Math.floor(i / 6) * 30;
  return {
    x,
    y,
    width: 20 + (i % 3) * 2,
    height: 19 + (i % 4),
    park: i % 13 === 0,
  };
});
const nodes = [
  [212, 85],
  [276, 66],
  [317, 116],
  [298, 182],
  [231, 195],
  [196, 145],
];

/** Original cartographic brand illustration, not product UI or real geospatial data. */
function MapFragment({ kind }: { kind: (typeof layers)[number]["id"] }) {
  const uid = useId().replace(/:/g, "");
  const detailed = kind === "cartography" || kind === "parcels";
  return (
    <svg
      viewBox="0 0 400 280"
      aria-hidden="true"
      className={`map-fragment fragment-${kind}`}
    >
      <defs>
        <clipPath id={`${uid}-land`}>
          <path d="M0 0H400V280H0Z" />
        </clipPath>
        <pattern
          id={`${uid}-grid`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            fill="none"
            stroke="currentColor"
            strokeWidth=".6"
            opacity=".2"
          />
        </pattern>
      </defs>
      <rect width="400" height="280" className="fragment-ground" />
      <g clipPath={`url(#${uid}-land)`}>
        <path
          d="M0 0H174C202 24 192 46 172 71S157 127 175 149S209 173 192 202S157 245 173 280H0Z"
          className="fragment-land"
        />
        {contourPaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            className="fragment-contour"
            strokeWidth={i % 4 === 0 ? 1.3 : 0.65}
          />
        ))}
        <path
          d="M178-20C225 20 196 58 180 85S165 122 192 148S231 186 205 215S177 258 196 300"
          fill="none"
          className="fragment-river"
          strokeWidth={detailed ? 28 : 22}
        />
        {blocks.map((b, i) => (
          <rect
            key={i}
            x={b.x}
            y={b.y}
            width={b.width}
            height={b.height}
            rx="1"
            className={b.park ? "fragment-park" : "fragment-building"}
            strokeWidth=".65"
          />
        ))}
        <path
          d="M209 75L276 56L328 115L305 193L230 207L185 145Z"
          className="fragment-district"
        />
        <path
          d="M205 87L305 173M215 188L298 72M224 132L318 130"
          fill="none"
          className="fragment-road"
          strokeWidth="3"
        />
        {kind === "terrain" && (
          <path
            d="M0 225L400 40M20 280L360 0"
            className="fragment-survey"
            fill="none"
            strokeWidth="1"
            strokeDasharray="4 5"
          />
        )}
        {kind === "contours" && (
          <rect width="400" height="280" fill={`url(#${uid}-grid)`} />
        )}
        {(kind === "geometry" || kind === "parcels") && (
          <g>
            <polygon
              points={nodes.map((n) => n.join(",")).join(" ")}
              className="fragment-selection"
              strokeWidth="1.6"
            />
            {nodes.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="5" className="fragment-node-ring" />
                <circle cx={x} cy={y} r="2.2" className="fragment-node" />
              </g>
            ))}
            <path
              d="M276 66L298 182L212 85M196 145L317 116"
              className="fragment-survey"
              strokeDasharray="3 4"
              fill="none"
            />
          </g>
        )}
        {kind === "cartography" && (
          <g
            className="fragment-map-label"
            fontSize="8"
            fontFamily="inherit"
            letterSpacing="1.6"
          >
            <text x="52" y="116">
              HIGHLANDS
            </text>
            <text x="235" y="247">
              RIVERSIDE
            </text>
            <circle cx="267" cy="135" r="3" />
            <path d="M267 141V154" stroke="currentColor" />
          </g>
        )}
        <path
          d="M12 24V12H24M376 12H388V24M388 256V268H376M24 268H12V256"
          className="fragment-survey"
          fill="none"
          strokeWidth=".75"
        />
      </g>
    </svg>
  );
}

export function SpatialHero() {
  const root = useRef<HTMLElement>(null);
  const runway = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const tiles = useRef<(HTMLDivElement | null)[]>([]);
  const copy = useRef<HTMLDivElement>(null);
  const line = useRef<SVGPathElement>(null);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<ProductId>("cloud");
  const [reduced, setReduced] = useState(false);
  const animationState = useRef({
    elapsed: 0,
    progress: 0,
    pointerX: 0,
    pointerY: 0,
  });

  useEffect(() => {
    const host = root.current,
      track = runway.current,
      stage = scene.current;
    if (!host || !track || !stage) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0,
      visible = false,
      previous = 0;
    let elapsed = animationState.current.elapsed;
    let { pointerX, pointerY, progress } = animationState.current;
    let targetX = pointerX,
      targetY = pointerY;
    let width = 0,
      height = 0,
      stageTop = 0,
      runwayTop = 0,
      travel = 1,
      mobile = false;
    const measure = () => {
      width = stage.clientWidth;
      height = stage.clientHeight;
      mobile = width < 680;
      stageTop = parseFloat(getComputedStyle(stage).top) || 84;
      runwayTop = track.getBoundingClientRect().top + scrollY;
      travel = Math.max(1, track.clientHeight - height);
    };
    const render = (time: number) => {
      frame = 0;
      const moving =
        visible && !document.hidden && !preference.matches && !paused;
      if (moving) {
        const dt = previous ? Math.min(48, time - previous) : 16;
        elapsed += dt;
        pointerX += (targetX - pointerX) * 0.055;
        pointerY += (targetY - pointerY) * 0.055;
      }
      previous = time;
      if (!paused)
        progress = preference.matches
          ? 0
          : Math.min(1, Math.max(0, (scrollY - runwayTop + stageTop) / travel));
      const p = progress * progress * (3 - 2 * progress);
      const clock = elapsed / 1000;
      tiles.current.forEach((tile, i) => {
        if (!tile) return;
        const layer = layers[i];
        const spread = mobile ? 1.15 : 1;
        const startX = width * (0.5 + (layer.x / 100 - 0.5) * spread);
        const startY = (height * layer.y) / 100;
        const endX = width * 0.5 + (i - 2) * 7;
        const endY = height * 0.46 + (i - 2) * 16;
        const float = 1 - p;
        const x =
          startX +
          (endX - startX) * p +
          Math.sin(clock * 0.3 + i * 1.7) * 8 * float +
          pointerX * (5 + i) * float;
        const y =
          startY +
          (endY - startY) * p +
          Math.cos(clock * 0.36 + i * 1.4) * 8 * float +
          pointerY * (4 + i) * float;
        const baseW = layer.width * (mobile ? 0.69 : Math.min(1, width / 1100));
        const endW = Math.min(width * 0.72, mobile ? 300 : 420);
        const scale = (baseW + (endW - baseW) * p) / layer.width;
        const angle = layer.angle + (-20 - layer.angle) * p;
        tile.style.transform = `translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) translate(-50%,-50%) rotateX(${(12 + p * 36).toFixed(2)}deg) rotateZ(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        tile.style.opacity = String(i === 2 || i === 4 ? 1 - p * 0.82 : 1);
        tile.style.zIndex = String(i === 3 ? 6 : i === 1 ? 5 : 3);
      });
      animationState.current = { elapsed, progress, pointerX, pointerY };
      host.style.setProperty("--atlas-progress", String(p));
      if (copy.current) {
        copy.current.style.transform = `translate3d(0,${(-p * 100).toFixed(1)}px,0)`;
        copy.current.style.opacity = String(1 - p);
        copy.current.style.visibility = p > 0.995 ? "hidden" : "visible";
      }
      if (line.current) line.current.style.strokeDashoffset = String(1 - p);
      host.dataset.motion = preference.matches
        ? "reduced"
        : paused
          ? "paused"
          : moving
            ? "running"
            : "idle";
      host.dataset.assembled = p > 0.9 ? "true" : "false";
      if (moving) frame = requestAnimationFrame(render);
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
    };
    const visibility = () => {
      stop();
      request();
    };
    const change = () => {
      setReduced(preference.matches);
      stop();
      measure();
      request();
    };
    const pointer = (event: PointerEvent) => {
      if (!finePointer.matches || paused || preference.matches) return;
      const r = stage.getBoundingClientRect();
      targetX = (event.clientX - r.left) / Math.max(1, width) - 0.5;
      targetY = (event.clientY - r.top) / Math.max(1, height) - 0.5;
      request();
    };
    const reset = () => {
      targetX = 0;
      targetY = 0;
      request();
    };
    const resize = new ResizeObserver(() => {
      measure();
      request();
    });
    resize.observe(track);
    resize.observe(stage);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        stop();
        request();
      },
      { threshold: 0 },
    );
    observer.observe(track);
    stage.addEventListener("pointermove", pointer);
    stage.addEventListener("pointerleave", reset);
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", visibility);
    preference.addEventListener("change", change);
    host.dataset.motion = preference.matches
      ? "reduced"
      : paused
        ? "paused"
        : "idle";
    setReduced(preference.matches);
    measure();
    render(performance.now());
    return () => {
      stop();
      observer.disconnect();
      resize.disconnect();
      stage.removeEventListener("pointermove", pointer);
      stage.removeEventListener("pointerleave", reset);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", visibility);
      preference.removeEventListener("change", change);
    };
  }, [paused]);

  return (
    <section
      className="craft-hero spatial-hero"
      id="overview"
      ref={root}
      data-active-product={active}
    >
      <div className="spatial-runway" ref={runway}>
        <div
          className="spatial-stage"
          ref={scene}
          data-scroll-context="空间创作，从数据开始"
        >
          <div className="atlas-art" aria-hidden="true">
            <svg
              className="atlas-field"
              viewBox="0 0 1200 780"
              preserveAspectRatio="xMidYMid slice"
            >
              <g transform="translate(600 390)">
                {Array.from({ length: 12 }, (_, i) => (
                  <ellipse
                    key={i}
                    cx="0"
                    cy="0"
                    rx={160 + i * 64}
                    ry={105 + i * 40}
                    transform="rotate(-24)"
                  />
                ))}
              </g>
              <path
                ref={line}
                className="atlas-route"
                pathLength="1"
                d="M150 110C-70 440 190 670 590 690S1250 580 1080 210"
              />
            </svg>
            {layers.map((layer, i) => (
              <div
                key={layer.id}
                ref={(el) => {
                  tiles.current[i] = el;
                }}
                className={`atlas-sheet atlas-${layer.id}`}
                data-product={layer.product}
                style={{
                  width: layer.width,
                  left: 0,
                  top: 0,
                  transform: `translate(${layer.x}cqw, ${layer.y}cqh) translate(-50%,-50%) rotate(${layer.angle}deg)`,
                }}
              >
                <MapFragment kind={layer.id} />
                <span className="atlas-sheet-label">{layer.label}</span>
              </div>
            ))}
          </div>
          <div className="atlas-reading-field" aria-hidden="true" />
          <div className="spatial-copy" ref={copy}>
            <div className="spatial-brand">
              <BrandMark />
              <span>Mapseek</span>
              <span className="spatial-brand-note">地理空间创作工具</span>
            </div>
            <h1>
              为地理空间工作，
              <br />
              <em>重新设计</em>工具。
            </h1>
            <p>
              管理数据，编辑空间，设计地图。
              <br />
              三款独立产品，让每一步工作更专注。
            </p>
            <div className="spatial-actions">
              <a className="craft-button" href="#products">
                认识三款产品
                <ArrowDown size={16} aria-hidden="true" />
              </a>
              <a className="craft-button craft-button-outline" href="#screens">
                浏览产品界面
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="atlas-resolution" aria-hidden="true">
            <span>同一片空间，不同的创造方式。</span>
            <p>数据就位。细节清晰。表达自由。</p>
          </div>
          <div className="atlas-stage-footer">
            <span>
              空间图层演绎 <i /> 非产品截图
            </span>
            <button
              type="button"
              className="atlas-motion-toggle"
              disabled={reduced}
              aria-pressed={paused || reduced}
              aria-label={
                reduced
                  ? "已遵循减少动态效果"
                  : paused
                    ? "播放首屏动效"
                    : "暂停首屏动效"
              }
              onClick={() => setPaused((v) => !v)}
            >
              {paused || reduced ? (
                <Play size={12} aria-hidden="true" />
              ) : (
                <Pause size={12} aria-hidden="true" />
              )}
              <span>
                {reduced ? "静态展示" : paused ? "播放动效" : "暂停动效"}
              </span>
            </button>
          </div>
        </div>
      </div>
      <nav
        className="craft-product-index spatial-product-index"
        id="products"
        aria-label="产品快速导航"
      >
        {entries.map((entry) => (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            onPointerEnter={() => setActive(entry.id)}
            onFocus={() => setActive(entry.id)}
            data-active={active === entry.id}
          >
            <span>
              <strong>{entry.name}</strong>
              <small>{entry.description}</small>
            </span>
            <ArrowRight size={20} aria-hidden="true" />
          </a>
        ))}
      </nav>
    </section>
  );
}
