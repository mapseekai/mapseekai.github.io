import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Brand } from "./Brand";
import { satelliteSource } from "./ProductExperiences";

const navigation = [
  ["cloud", "Cloud"],
  ["loom", "Loom"],
  ["design", "Design"],
] as const;
export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  useEffect(() => {
    function close(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        setOpen(false);
        trigger.current?.focus();
      }
    }
    function outside(event: PointerEvent) {
      if (open && !header.current?.contains(event.target as Node))
        setOpen(false);
    }
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);
  return (
    <header className="atelier-header" ref={header}>
      <div className="atelier-container">
        <Brand />
        <nav
          id="atelier-navigation"
          className={open ? "is-open" : ""}
          aria-label="产品导航"
        >
          {navigation.map(([id, name]) => (
            <a key={id} href={`/#${id}`} onClick={() => setOpen(false)}>
              {name}
              <span>
                {id === "cloud"
                  ? "空间数据"
                  : id === "loom"
                    ? "空间编辑"
                    : "地图设计"}
              </span>
            </a>
          ))}
        </nav>
        <a className="atelier-nav-action" href="/#products">
          探索产品
          <ArrowUpRight size={16} />
        </a>
        <button
          className="atelier-menu"
          type="button"
          ref={trigger}
          aria-expanded={open}
          aria-controls="atelier-navigation"
          aria-label={open ? "关闭导航" : "打开导航"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
export function LandingFooter() {
  return (
    <footer className="atelier-footer">
      <div className="atelier-container">
        <div className="footer-signoff">
          <Brand />
          <p>为认真创造空间的人而做。</p>
        </div>
        <div className="footer-product-links">
          {navigation.map(([id, name]) => (
            <a key={id} href={`/products/${id}/`}>
              Mapseek {name}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </div>
        <div className="atelier-legal">
          <span>© 2026 MapseekAI</span>
          <p>
            影像：
            <a href={satelliteSource} target="_blank" rel="noopener noreferrer">
              NASA Earth Observatory / USGS
            </a>
            。交互画面为功能示意。
          </p>
          <a href="#top">回到顶部 ↑</a>
        </div>
      </div>
    </footer>
  );
}
