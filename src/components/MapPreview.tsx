import { useId, useRef, useState } from 'react';
import { Check, ChevronDown, Crosshair, Database, Eye, EyeOff, Layers, Minus, MousePointer2, Plus, RotateCcw, SlidersHorizontal, SquareDashedMousePointer } from 'lucide-react';
import { products, type ProductId } from '../content/site';
import { MapScene, type LayerId, type MapTheme } from './MapScene';

const layerLabels: { id: LayerId; label: string; hint: string }[] = [
  { id: 'buildings', label: '城市建筑', hint: 'Polygon' },
  { id: 'green', label: '公园绿地', hint: 'Polygon' },
  { id: 'roads', label: '道路网络', hint: 'LineString' },
];

export function MapPreview({ initialMode = 'cloud', fixed = false }: { initialMode?: ProductId; fixed?: boolean }) {
  const [mode, setMode] = useState<ProductId>(initialMode);
  const [layers, setLayers] = useState<Record<LayerId, boolean>>({ buildings: true, green: true, roads: true });
  const [zoom, setZoom] = useState(1);
  const [theme, setTheme] = useState<MapTheme>('forest');
  const [selected, setSelected] = useState(false);
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const product = products.find((item) => item.id === mode)!;

  function reset() {
    setZoom(1);
    setTheme('forest');
    setSelected(false);
    setLayers({ buildings: true, green: true, roads: true });
  }

  return (
    <div className={`workspace ${fixed ? 'workspace-fixed' : ''}`}>
      {!fixed && <div className="workspace-tabs" role="tablist" aria-label="产品演示">
        {products.map((item, index) => <button type="button"
          key={item.id} id={`${id}-tab-${item.id}`} role="tab" aria-selected={mode === item.id}
          aria-controls={`${id}-panel`} tabIndex={mode === item.id ? 0 : -1}
          ref={(node) => { tabRefs.current[index] = node; }}
          onClick={() => { setMode(item.id); reset(); }}
          onKeyDown={(event) => {
            const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End'];
            if (!keys.includes(event.key)) return;
            event.preventDefault();
            const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (index + (event.key === 'ArrowRight' ? 1 : 2)) % 3;
            setMode(products[next].id); reset(); tabRefs.current[next]?.focus();
          }}
        ><span className="mono">0{index + 1}</span> {item.id[0].toUpperCase() + item.id.slice(1)}</button>)}
        <span className="workspace-tabs-label mono">地图工作台</span>
      </div>}
      <div id={`${id}-panel`} role={fixed ? undefined : 'tabpanel'} aria-labelledby={fixed ? undefined : `${id}-tab-${mode}`} className="workspace-panel">
        <div className="workspace-topbar"><span className="workspace-product"><Layers size={15} /> {product.name}</span><span className="workspace-breadcrumb">工作空间 <span>/</span> 城市空间研究 <ChevronDown size={12}/></span><span className="demo-tag">交互概念演示</span></div>
        <div className="workspace-body">
          <aside className="workspace-sidebar" aria-label="演示控制面板">
            <div className="sidebar-heading"><span>{mode === 'design' ? '地图样式' : mode === 'loom' ? '编辑对象' : '数据图层'}</span><SlidersHorizontal size={13} /></div>
            {mode === 'design' ? <>
              <div className="sidebar-section mono">地图配色</div>
              {([{ id: 'forest', label: '林间 · Forest' }, { id: 'ink', label: '墨色 · Ink' }, { id: 'sand', label: '原野 · Sand' }] as const).map((item) => <button type="button" key={item.id} className={`theme-choice ${theme === item.id ? 'is-active' : ''}`} onClick={() => setTheme(item.id)} aria-pressed={theme === item.id}><span className={`theme-chip ${item.id}`} /><span>{item.label}</span>{theme === item.id && <Check size={12}/>}</button>)}
              <div className="style-token"><span className="mono">设计意图</span><p>让绿地更自然，<br/>让城市退后一步。</p><span>切换色系预览地图</span></div>
            </> : <>
              <div className="sidebar-section mono">{mode === 'loom' ? '要素图层' : '项目图层'}</div>
              {layerLabels.map((layer, index) => <button type="button" key={layer.id} className={`layer-button ${layers[layer.id] ? 'is-visible' : ''}`} onClick={() => setLayers((state) => ({ ...state, [layer.id]: !state[layer.id] }))} aria-pressed={layers[layer.id]} aria-label={`${layers[layer.id] ? '隐藏' : '显示'}${layer.label}`}><span className={`layer-symbol layer-symbol-${index}`} /><span>{layer.label}<small>{layer.hint}</small></span>{layers[layer.id] ? <Eye size={12} /> : <EyeOff size={12} />}</button>)}
              {mode === 'loom' && <button type="button" className={`select-feature ${selected ? 'is-selected' : ''}`} onClick={() => setSelected((value) => !value)} aria-pressed={selected}><SquareDashedMousePointer size={14}/>{selected ? '取消选择' : '检查示例要素'}</button>}
              <div className="sidebar-bottom"><Database size={13} /><span>本地示意数据</span></div>
            </>}
          </aside>
          <div className="map-viewport">
            <MapScene mode={mode} theme={theme} zoom={zoom} layers={layers} selected={selected}/>
            <div className="map-tool-label"><MousePointer2 size={13}/>{mode === 'design' ? '地图样式预览' : mode === 'loom' ? '几何与属性编辑' : '从数据，看见空间'}</div>
            <div className="map-compass" aria-hidden="true"><span>N</span><svg width="18" height="24" viewBox="0 0 18 24"><path d="M9 1L16 22L9 17L2 22Z" fill="var(--color-accent)"/><path d="M9 1V17L2 22Z" fill="var(--color-rule)"/></svg></div>
            {(mode !== 'loom' || selected) && <div className="map-info" aria-live="polite"><span className="mono">{mode === 'loom' ? '示例要素' : mode === 'design' ? '样式预览' : '数据浏览'}</span><strong>{mode === 'loom' ? '中央片区' : mode === 'design' ? ({ forest: '林间 · Forest', ink: '墨色 · Ink', sand: '原野 · Sand' }[theme]) : '一张地图，连接你的数据。'}</strong><span>{mode === 'loom' ? 'Polygon · 5 个编辑节点' : mode === 'design' ? '同一份数据，不同的表达。' : '矢量与栅格，在此相遇。'}</span></div>}
            <div className="map-controls"><button type="button" aria-label="放大地图" disabled={zoom >= 1.8} onClick={() => setZoom((value) => Math.min(1.8, +(value + .2).toFixed(1)))}><Plus size={16}/></button><button type="button" aria-label="缩小地图" disabled={zoom <= .8} onClick={() => setZoom((value) => Math.max(.8, +(value - .2).toFixed(1)))}><Minus size={16}/></button><button type="button" aria-label="重置地图演示" onClick={reset}><Crosshair size={16}/></button></div>
            <div className="map-scale mono"><span/>示意地图</div>
          </div>
        </div>
        <div className="workspace-status"><span>{mode === 'design' ? '地图样式预览' : mode === 'loom' ? '空间要素编辑' : '空间数据管理'}</span><span className="status-right mono">{Math.round(zoom * 100)}%<button type="button" onClick={reset} aria-label="还原演示设置"><RotateCcw size={11}/></button></span></div>
      </div>
      {!fixed && <a className="workspace-caption" href={`/products/${mode}/`}><span>{product.label}<span className="caption-divider">/</span>{product.tagline}</span><span>了解 {mode[0].toUpperCase() + mode.slice(1)}</span></a>}
    </div>
  );
}
