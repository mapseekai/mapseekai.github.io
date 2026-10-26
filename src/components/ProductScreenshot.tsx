import { useId, useRef, useState, type CSSProperties } from 'react';
import { ArrowUpRight, Maximize2, X } from 'lucide-react';
import { BrandMark } from './Brand';
import { productMedia } from '../content/product-media';
import type { ProductId } from '../content/site';

const names = { cloud: 'Cloud', loom: 'Loom', design: 'Design' } as const;
/** A product identifier uses the existing suite icon, never an invented product logo. */
export function ProductMark({ product, large = false }: { product: ProductId; large?: boolean }) {
  return <span className={`craft-product-mark mark-${product} ${large ? 'mark-large' : ''}`} aria-hidden="true"><BrandMark /></span>;
}

export function ProductScreenshot({ product }: { product: ProductId }) {
  const media = productMedia[product];
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const id = useId();
  const available = Boolean(media.src) && !failed;
  const close = () => { dialog.current?.close(); opener.current?.focus(); };
  return <figure className={`craft-screenshot media-${product}`} data-screenshot={product} data-media-state={available ? 'ready' : failed ? 'error' : 'reserved'}>
    <div className="screenshot-register"><span>Mapseek {names[product]}</span><span>{available ? '实际产品截图' : '截图待补充'}</span></div>
    <div className="screenshot-canvas" style={{ '--media-ratio': `${media.width} / ${media.height}` } as CSSProperties}>
      {available ? <>
        <img src={media.src!} alt={media.alt} width={media.width} height={media.height} loading="lazy" decoding="async" onError={() => setFailed(true)} />
        <button className="screenshot-expand" ref={opener} type="button" aria-label={`放大 ${names[product]} 产品截图`} onClick={() => dialog.current?.showModal()}><Maximize2 size={16} />查看原图</button>
      </> : <div className="screenshot-placeholder">
        <div className="placeholder-content"><ProductMark product={product} large /><strong>{names[product]} 产品界面</strong><p>{failed ? '截图暂时无法加载' : '预留给真实产品截图'}</p></div>

      </div>}
    </div>
    <figcaption><span>{media.caption}</span><a href={`/products/${product}/`}>了解 {names[product]}<ArrowUpRight size={14} aria-hidden="true" /></a></figcaption>
    {available && <dialog className="screenshot-dialog" ref={dialog} aria-labelledby={`${id}-title`} onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="screenshot-dialog-bar"><h2 id={`${id}-title`}>Mapseek {names[product]}</h2><button type="button" onClick={close} aria-label="关闭截图"><X size={22} /></button></div>
      <img src={media.src!} alt={media.alt} width={media.width} height={media.height} />
    </dialog>}
  </figure>;
}
