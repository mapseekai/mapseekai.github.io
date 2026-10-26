import {
  useId,
  useRef,
  useState,
  type ReactNode,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import {
  Check,
  Database,
  Download,
  Eye,
  EyeOff,
  Layers,
  MousePointer2,
  Move,
  RotateCcw,
  Undo2,
} from "lucide-react";

export const satelliteSource =
  "https://science.nasa.gov/earth/earth-observatory/how-glaciers-turn-lakes-turquoise-145055/";

const catalog = [
  {
    id: "imagery",
    name: "高山湖泊影像",
    kind: "栅格影像",
    format: "Landsat 8",
    icon: "raster",
  },
  {
    id: "boundary",
    name: "研究范围",
    kind: "矢量数据",
    format: "Polygon",
    icon: "polygon",
  },
  {
    id: "places",
    name: "观测位置",
    kind: "矢量数据",
    format: "Point",
    icon: "point",
  },
] as const;

/** A self-contained sample: toggles only affect the illustrative map on this page. */
export function CloudExperience() {
  const [active, setActive] = useState("imagery");
  const [visible, setVisible] = useState<Record<string, boolean>>({
    imagery: true,
    boundary: true,
    places: true,
  });
  const resource = catalog.find((item) => item.id === active)!;
  return (
    <div
      className="experience cloud-experience"
      role="group"
      aria-label="Cloud 数据组织交互示例"
    >
      <div className="experience-bar">
        <span>
          <Database size={16} />
          Mapseek Cloud
        </span>
        <span className="sample-label">功能交互示意</span>
      </div>
      <div className="cloud-body">
        <aside className="catalog-panel">
          <div className="catalog-title">
            <span>空间资源</span>
            <span>{catalog.length.toString().padStart(2, "0")}</span>
          </div>
          <div className="catalog-project">
            <Layers size={16} />
            <span>
              高山湖泊研究<small>示例项目</small>
            </span>
          </div>
          <div className="catalog-list">
            {catalog.map((item) => (
              <div
                className={`catalog-row ${active === item.id ? "is-active" : ""}`}
                key={item.id}
              >
                <button
                  type="button"
                  className="catalog-select"
                  aria-pressed={active === item.id}
                  onClick={() => setActive(item.id)}
                >
                  <i className={`resource-symbol symbol-${item.icon}`} />
                  <span>
                    {item.name}
                    <small>{item.kind}</small>
                  </span>
                </button>
                <button
                  type="button"
                  className="layer-eye"
                  aria-label={`${visible[item.id] ? "隐藏" : "显示"}${item.name}`}
                  aria-pressed={visible[item.id]}
                  onClick={() =>
                    setVisible((value) => ({
                      ...value,
                      [item.id]: !value[item.id],
                    }))
                  }
                >
                  {visible[item.id] ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
            ))}
          </div>
          <div className="resource-detail" aria-live="polite">
            <span>当前资源</span>
            <strong>{resource.name}</strong>
            <dl>
              <div>
                <dt>类型</dt>
                <dd>{resource.kind}</dd>
              </div>
              <div>
                <dt>格式</dt>
                <dd>{resource.format}</dd>
              </div>
              <div>
                <dt>可见性</dt>
                <dd>{visible[resource.id] ? "显示中" : "已隐藏"}</dd>
              </div>
            </dl>
          </div>
          <div className="catalog-foot">数据、地图与服务，在同一处。</div>
        </aside>
        <div className="cloud-map" data-imagery={visible.imagery}>
          <img
            className="cloud-imagery"
            src="/assets/atelier/alpine-lakes.webp"
            alt="新西兰南岛高山与湖泊的 Landsat 影像"
            width="2200"
            height="1600"
            loading="lazy"
          />
          <div className="cloud-grid" aria-hidden="true" />
          <svg
            className="cloud-overlay"
            viewBox="0 0 900 590"
            aria-label="研究范围和观测位置示意"
            role="img"
            preserveAspectRatio="xMidYMid slice"
          >
            <g className="sample-boundary" opacity={visible.boundary ? 1 : 0}>
              <path d="M300 85L650 130L730 415L507 520L238 379Z" />
              <path
                className="boundary-inner"
                d="M330 122L623 161L689 398L505 475L279 361Z"
              />
            </g>
            <g className="sample-places" opacity={visible.places ? 1 : 0}>
              {[
                [370, 250],
                [550, 195],
                [604, 370],
              ].map(([x, y], index) => (
                <g key={index} transform={`translate(${x} ${y})`}>
                  <circle r="13" className="point-halo" />
                  <circle r="4" />
                  <text x="19" y="5">
                    观测点 {String(index + 1).padStart(2, "0")}
                  </text>
                </g>
              ))}
            </g>
          </svg>
          <div className="cloud-location">
            <span className="location-cross">+</span>Southern Alps
            <small>新西兰南岛 / Landsat 8</small>
          </div>
          <div className="cloud-map-note">研究范围和观测位置为交互示例</div>
          <div className="map-orientation" aria-hidden="true">
            N<span>↑</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export type MapMood = "forest" | "paper" | "night";
type Position = { x: number; y: number };
export const initialVertices: Position[] = [
  { x: 356, y: 231 },
  { x: 505, y: 200 },
  { x: 571, y: 273 },
  { x: 544, y: 371 },
  { x: 402, y: 389 },
  { x: 330, y: 315 },
];
const blocks = Array.from({ length: 110 }, (_, i) => {
  const col = i % 11,
    row = Math.floor(i / 11),
    seed = (i * 17) % 13;
  return {
    x: col * 83 + 16,
    y: row * 67 + 11,
    w: 48 + seed,
    h: 36 + (seed % 7),
    park: seed === 0 || seed === 7,
  };
});
const palettes: Record<MapMood, Record<string, string>> = {
  forest: {
    "--plan-ground": "#e7eade",
    "--plan-water": "#9cbdb4",
    "--plan-building": "#d0d5c6",
    "--plan-building-stroke": "#bbc6b5",
    "--plan-park": "#b6c7a0",
    "--plan-road": "#fafbf6",
    "--plan-road-edge": "#c3cabe",
    "--plan-ink": "#42594f",
    "--plan-minor": "#708178",
    "--plan-accent": "#296448",
  },
  paper: {
    "--plan-ground": "#f2e9d9",
    "--plan-water": "#a8b7b4",
    "--plan-building": "#e1d4bc",
    "--plan-building-stroke": "#cabb9f",
    "--plan-park": "#c8ceb5",
    "--plan-road": "#fffaf0",
    "--plan-road-edge": "#cdbfa7",
    "--plan-ink": "#625b49",
    "--plan-minor": "#897e67",
    "--plan-accent": "#675b3f",
  },
  night: {
    "--plan-ground": "#182b2a",
    "--plan-water": "#0c1a1d",
    "--plan-building": "#2b4240",
    "--plan-building-stroke": "#39544e",
    "--plan-park": "#294e42",
    "--plan-road": "#64766d",
    "--plan-road-edge": "#203832",
    "--plan-ink": "#d1dcc8",
    "--plan-minor": "#8da49a",
    "--plan-accent": "#c7e99a",
  },
};

/** Deterministic, fictitious district geometry; never presented as a surveyed place. */
export function DistrictMap({
  mood = "forest",
  labels = true,
  children,
  className = "",
}: {
  mood?: MapMood;
  labels?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`district-map ${className}`}
      style={palettes[mood] as CSSProperties}
      viewBox="0 0 960 620"
      preserveAspectRatio="xMidYMid slice"
      role={children ? "group" : "img"}
      aria-label="滨水街区示例地图"
    >
      <defs>
        <clipPath id={`${id}-island`}>
          <path d="M-100-100H1050V70C730 60 780 159 643 173S489 145 525 280S698 343 630 421S517 473 433 530S384 637 386 750H-100Z" />
        </clipPath>
      </defs>
      <rect width="960" height="620" fill="var(--plan-water)" />
      <g clipPath={`url(#${id}-island)`}>
        <rect
          x="-100"
          y="-100"
          width="1200"
          height="900"
          fill="var(--plan-ground)"
        />
        <g transform="rotate(-17 460 300)">
          {blocks.map((b, i) => (
            <g key={i}>
              <rect
                x={b.x}
                y={b.y}
                width={b.w}
                height={b.h}
                rx="2"
                fill={b.park ? "var(--plan-park)" : "var(--plan-building)"}
                stroke="var(--plan-building-stroke)"
                strokeWidth=".7"
              />
              {!b.park && (
                <path
                  d={`M${b.x + 8} ${b.y + 8}h${b.w - 16}v${b.h - 16}h-${b.w - 16}Z`}
                  fill="none"
                  stroke="var(--plan-ground)"
                  strokeWidth="3"
                />
              )}
            </g>
          ))}
          {Array.from({ length: 12 }, (_, i) => (
            <path
              key={`v${i}`}
              d={`M${i * 83 + 5} -200V900`}
              stroke="var(--plan-road)"
              strokeWidth="10"
            />
          ))}
          {Array.from({ length: 11 }, (_, i) => (
            <path
              key={`h${i}`}
              d={`M-100 ${i * 67 + 1}H1200`}
              stroke="var(--plan-road)"
              strokeWidth="10"
            />
          ))}
          <path
            d="M-100 590L310 275L810 40M-80 80L600 560"
            fill="none"
            stroke="var(--plan-road-edge)"
            strokeWidth="22"
          />
          <path
            d="M-100 590L310 275L810 40M-80 80L600 560"
            fill="none"
            stroke="var(--plan-road)"
            strokeWidth="17"
          />
        </g>
        <path
          d="M298 213L493 159L609 256L580 405L393 435L294 330Z"
          fill="var(--plan-park)"
        />
        <path
          d="M304 254L541 289L413 424M331 208L473 402"
          fill="none"
          stroke="var(--plan-road)"
          strokeWidth="4"
        />
        {[
          [340, 248],
          [374, 214],
          [469, 228],
          [522, 315],
          [402, 368],
          [355, 325],
          [480, 356],
        ].map(([x, y]) => (
          <circle
            key={x}
            cx={x}
            cy={y}
            r="8"
            fill="var(--plan-accent)"
            opacity=".2"
          />
        ))}
      </g>
      <path
        d="M760 45C711 112 754 172 619 189S507 170 542 277S716 343 645 431S526 487 447 543S401 625 400 670"
        fill="none"
        stroke="var(--plan-road)"
        strokeWidth="4"
      />
      <path
        d="M665 370C760 368 850 407 1000 405M453 556C581 534 698 566 1000 610"
        stroke="var(--plan-road-edge)"
        strokeWidth="18"
        fill="none"
      />
      <path
        d="M665 370C760 368 850 407 1000 405M453 556C581 534 698 566 1000 610"
        stroke="var(--plan-road)"
        strokeWidth="12"
        fill="none"
      />
      {labels && (
        <g fill="var(--plan-ink)" fontFamily="inherit" fontSize="12">
          <text x="120" y="162" transform="rotate(-17 120 162)">
            Garden Avenue
          </text>
          <text x="80" y="450" transform="rotate(-17 80 450)">
            West district
          </text>
          <text x="417" y="109" transform="rotate(-17 417 109)">
            Park Road
          </text>
          <text x="690" y="285" fontSize="19" letterSpacing="7" opacity=".8">
            RIVERSIDE
          </text>
          <text x="210" y="530" fontSize="11">
            滨水街区 / 示例数据
          </text>
        </g>
      )}
      {children}
    </svg>
  );
}

export function LoomExperience() {
  const [vertices, setVertices] = useState<Position[]>(initialVertices);
  const [history, setHistory] = useState<Position[][]>([]);
  const [selected, setSelected] = useState(0);
  const svgHolder = useRef<HTMLDivElement>(null);
  const dragging = useRef<number | null>(null);
  const dragOrigin = useRef<Position[] | null>(null);
  const dragChanged = useRef(false);
  const live = useRef(vertices);
  live.current = vertices;
  const store = (prior: Position[]) =>
    setHistory((entries) => [...entries.slice(-19), prior]);
  const bounded = (x: number, y: number) => ({
    x: Math.max(240, Math.min(650, Math.round(x))),
    y: Math.max(130, Math.min(460, Math.round(y))),
  });
  function move(event: PointerEvent<SVGCircleElement>) {
    if (dragging.current === null) return;
    const svg = svgHolder.current?.querySelector("svg");
    const ctm = svg?.getScreenCTM();
    if (!ctm) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      ctm.inverse(),
    );
    const pos = bounded(point.x, point.y);
    const index = dragging.current;
    if (pos.x !== live.current[index].x || pos.y !== live.current[index].y)
      dragChanged.current = true;
    setVertices((old) => old.map((value, i) => (i === index ? pos : value)));
  }
  function finish() {
    if (dragChanged.current && dragOrigin.current) store(dragOrigin.current);
    dragging.current = null;
    dragOrigin.current = null;
    dragChanged.current = false;
  }
  function keyMove(event: KeyboardEvent<SVGCircleElement>, index: number) {
    const directions: Record<string, number[]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    };
    const d = directions[event.key];
    if (!d) return;
    event.preventDefault();
    store(vertices);
    const step = event.shiftKey ? 10 : 2;
    setVertices((old) =>
      old.map((point, i) =>
        i === index
          ? bounded(point.x + d[0] * step, point.y + d[1] * step)
          : point,
      ),
    );
  }
  function undo() {
    const last = history.at(-1);
    if (!last) return;
    setVertices(last);
    setHistory((old) => old.slice(0, -1));
  }
  const point = vertices[selected];
  return (
    <div
      className="experience loom-experience"
      role="group"
      aria-label="Loom 几何编辑交互示例"
    >
      <div className="experience-bar">
        <span>
          <MousePointer2 size={16} />
          Mapseek Loom
        </span>
        <span className="sample-label">功能交互示意</span>
      </div>
      <div className="loom-body">
        <div className="loom-canvas" ref={svgHolder}>
          <DistrictMap>
            <polygon
              points={vertices.map((p) => `${p.x},${p.y}`).join(" ")}
              className="editable-polygon"
            />
            {vertices.map((p, index) => (
              <circle
                key={index}
                cx={p.x}
                cy={p.y}
                r={index === selected ? 8 : 6}
                className={`edit-node ${index === selected ? "is-selected" : ""}`}
                role="button"
                aria-label={`编辑节点 ${index + 1}`}
                tabIndex={0}
                onFocus={() => setSelected(index)}
                onPointerDown={(event) => {
                  event.preventDefault();
                  event.currentTarget.focus();
                  event.currentTarget.setPointerCapture(event.pointerId);
                  setSelected(index);
                  dragging.current = index;
                  dragOrigin.current = vertices;
                  dragChanged.current = false;
                }}
                onPointerMove={move}
                onPointerUp={finish}
                onPointerCancel={finish}
                onLostPointerCapture={finish}
                onKeyDown={(event) => keyMove(event, index)}
              />
            ))}
          </DistrictMap>
          <div className="editing-tools">
            <span>
              <Move size={16} />
              节点编辑
            </span>
            <button
              type="button"
              aria-label="撤销节点修改"
              disabled={!history.length}
              onClick={undo}
            >
              <Undo2 size={17} />
            </button>
            <button
              type="button"
              aria-label="重置几何"
              onClick={() => {
                setVertices(initialVertices);
                setHistory([]);
                setSelected(0);
              }}
            >
              <RotateCcw size={17} />
            </button>
          </div>
          <div className="editing-tip">拖动节点，或聚焦后使用方向键</div>
        </div>
        <aside className="inspector-panel">
          <span className="inspector-caption">要素属性</span>
          <h3>滨水公园</h3>
          <div className="geometry-tag">
            <i />
            Polygon
          </div>
          <dl>
            <div>
              <dt>要素名称</dt>
              <dd>滨水公园</dd>
            </div>
            <div>
              <dt>图层</dt>
              <dd>公共绿地</dd>
            </div>
            <div>
              <dt>节点数</dt>
              <dd>{vertices.length}</dd>
            </div>
          </dl>
          <div className="node-inspector" aria-live="polite">
            <span>已选择节点 {selected + 1}</span>
            <div>
              <span>
                X <b>{point.x}</b>
              </span>
              <span>
                Y <b>{point.y}</b>
              </span>
            </div>
            <small>示例画布局部坐标</small>
          </div>
          <p className="inspector-note">
            让几何与属性，
            <br />
            始终在同一个上下文里。
          </p>
        </aside>
      </div>
    </div>
  );
}

const moods: { id: MapMood; name: string; caption: string }[] = [
  { id: "forest", name: "林野", caption: "让自然成为主角" },
  { id: "paper", name: "纸本", caption: "把城市写在纸上" },
  { id: "night", name: "夜航", caption: "让轮廓在夜色中浮现" },
];
export function DesignExperience() {
  const [mood, setMood] = useState<MapMood>("forest");
  const [labels, setLabels] = useState(true);
  const [message, setMessage] = useState("");
  const map = useRef<HTMLDivElement>(null);
  const current = moods.find((entry) => entry.id === mood)!;
  function download() {
    const source = map.current?.querySelector("svg");
    if (!source) return;
    const clone = source.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "960");
    clone.setAttribute("height", "620");
    // Resolve palette variables to make the exported file self-contained.
    const serialized = new XMLSerializer()
      .serializeToString(clone)
      .replace(
        /var\((--plan-[\w-]+)\)/g,
        (_, token: string) => palettes[mood][token] || "#18352b",
      );
    const blob = new Blob([serialized], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mapseek-${mood}-sample.svg`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("已生成示例 SVG");
  }
  return (
    <div
      className="experience design-experience"
      role="group"
      aria-label="Design 地图样式交互示例"
    >
      <div className="experience-bar">
        <span>
          <Layers size={16} />
          Mapseek Design
        </span>
        <span className="sample-label">功能交互示意</span>
      </div>
      <div className="design-body">
        <aside className="style-panel">
          <span className="inspector-caption">风格方向</span>
          <div className="mood-options">
            {moods.map((entry) => (
              <button
                key={entry.id}
                type="button"
                aria-pressed={mood === entry.id}
                onClick={() => {
                  setMood(entry.id);
                  setMessage("");
                }}
                className={`mood-option ${entry.id}`}
              >
                <span className="mood-preview">
                  <i />
                  <i />
                  <i />
                </span>
                <span>{entry.name}</span>
                {mood === entry.id && <Check size={15} />}
              </button>
            ))}
          </div>
          <div className="style-properties">
            <span>图面元素</span>
            <label>
              <input
                type="checkbox"
                checked={labels}
                onChange={(event) => setLabels(event.target.checked)}
              />
              显示地图标注
            </label>
          </div>
          <div
            className="palette-list"
            role="img"
            aria-label={`${current.name} 配色`}
          >
            {["ground", "water", "park", "building", "ink"].map((role) => (
              <span
                key={role}
                style={{ background: palettes[mood][`--plan-${role}`] }}
              />
            ))}
          </div>
          <button type="button" className="export-sample" onClick={download}>
            导出示例 SVG
            <Download size={15} />
          </button>
          <p className="export-feedback" role="status">
            {message}
          </p>
        </aside>
        <div className={`artboard-surface mood-${mood}`}>
          <div className="map-artboard" key={mood} ref={map}>
            <div className="artboard-title">
              <span>Riverside</span>
              <h3>
                一座城市，
                <br />
                不止一种表达。
              </h3>
              <p>{current.caption}</p>
            </div>
            <DistrictMap mood={mood} labels={labels} />
            <div className="artboard-colophon">
              <span>Mapseek Design</span>
              <span>Cartographic study / 01</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
