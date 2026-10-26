import type { ProductId } from '../content/site';
import { MapScene } from './MapScene';

export function ProductArt({ type }: { type: ProductId }) {
  return <div className={`product-art ${type}-art`} aria-hidden="true">
    <MapScene mode={type} theme={type === 'design' ? 'sand' : 'forest'} selected={type === 'loom'} />
    {type === 'cloud' && <div className="art-legend"><span>矢量图层</span><span>栅格资源</span><span>统一目录</span></div>}
    {type === 'loom' && <div className="art-feature"><strong>几何与属性</strong><span>选择、检查、编辑</span></div>}
    {type === 'design' && <div className="art-palette"><i /><i /><i /><i /><i /></div>}
  </div>;
}

export function EditorialArt({ type }: { type: 'contour' | 'grid' | 'lanes' }) {
  return <div className={`editorial-art editorial-${type}`} aria-hidden="true">
    {type === 'contour'
      ? <MapScene mode="design" theme="ink" zoom={1.2} />
      : type === 'grid'
        ? <div className="raster-grid">{Array.from({ length: 40 }, (_, index) => <i key={index} style={{ opacity: 0.15 + ((index * 13) % 11) / 14 }} />)}</div>
        : <div className="worker-lanes">{[0, 1, 2].map((index) => <div key={index}><span className="mono">W{index + 1}</span><i /><i /><i /></div>)}</div>}
  </div>;
}
