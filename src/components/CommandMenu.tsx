import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { products } from '../content/site';

const destinations = [
  ...products.map((product) => ({ title: product.name, note: product.label, href: `/products/${product.id}/` })),
  { title: '空间工作流', note: '管理、编辑与地图设计', href: '/#workflow' },
  { title: '开放技术生态', note: '代码、引擎与规范', href: '/open-source/' },
  { title: '博客与技术笔记', note: '产品、设计和工程', href: '/blog/' },
];

export function CommandMenu() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [query, setQuery] = useState('');
  const results = destinations.filter((item) => `${item.title} ${item.note}`.toLowerCase().includes(query.trim().toLowerCase()));
  function open() { setQuery(''); if (!dialog.current?.open) dialog.current?.showModal(); }
  function close() { dialog.current?.close(); }
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); if (dialog.current?.open) dialog.current.close(); else { setQuery(''); dialog.current?.showModal(); }
      }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);
  return <>
    <button ref={trigger} type="button" className="command-trigger" onClick={open} aria-label="快速访问，快捷键 Control 或 Command 加 K"><Search size={16} aria-hidden="true" /><span>快速访问</span><kbd>⌘ K</kbd></button>
    <dialog ref={dialog} className="command-dialog" aria-labelledby="command-title" onClose={() => trigger.current?.focus()} onCancel={(event) => { event.preventDefault(); close(); }} onKeyDownCapture={(event) => { if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); } }} onClick={(event) => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) close(); } }}>
      <div className="command-heading"><h2 id="command-title">你想从哪里开始？</h2><button type="button" aria-label="关闭快速访问" onClick={close}><X size={20} aria-hidden="true" /></button></div>
      <label className="command-search"><Search size={18} aria-hidden="true" /><span className="sr-only">搜索页面</span><input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索产品、工作流或文章…" onKeyDown={(event) => { if (event.key === 'ArrowDown') { event.preventDefault(); dialog.current?.querySelector<HTMLAnchorElement>('.command-result')?.focus(); } }} /></label>
      <div className="command-results" aria-live="polite">{results.length ? results.map((item, index) => <a className="command-result" key={item.href} href={item.href} onClick={close} onKeyDown={(event) => { if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return; event.preventDefault(); const links = dialog.current?.querySelectorAll<HTMLAnchorElement>('.command-result'); links?.[(index + (event.key === 'ArrowDown' ? 1 : results.length - 1)) % results.length]?.focus(); }}><strong>{item.title}</strong><span>{item.note}</span></a>) : <p className="command-empty">没有匹配页面，试试 Cloud、Loom 或地图。</p>}</div>
      <p className="command-hint">方向键选择，Enter 打开，Esc 关闭。</p>
    </dialog>
  </>;
}
