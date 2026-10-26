import { useEffect } from 'react';

/** Progressive enhancement: prose and media remain visible without JS or motion. */
export function SiteMotion({ path }: { path: string }) {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        entry.target.setAttribute('data-entered', 'true');
        if (media.matches || !entry.target.animate || entry.target.matches('.craft-register')) continue;
        const intro = entry.target.matches('.craft-chapter-intro');
        const isScreen = entry.target.matches('.screenshot-canvas');
        const targets = intro ? Array.from(entry.target.children) : [entry.target];
        targets.forEach((target, index) => {
          const animation = target.animate([
            { opacity: .3, transform: isScreen ? 'translateY(24px) scale(.978)' : 'translateY(28px)', filter: isScreen ? 'none' : 'blur(5px)' },
            { opacity: 1, transform: 'translateY(0) scale(1)', filter: 'blur(0px)' },
          ], { duration: isScreen ? 1000 : 850, delay: index * 60, easing: 'cubic-bezier(.16,1,.3,1)' });
          animations.add(animation);
          animation.onfinish = () => { animations.delete(animation); animation.cancel(); };
        });
      }
    }, { threshold: .12, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('[data-reveal],.craft-register,.screenshot-canvas').forEach(element => observer.observe(element));
    const stop = () => { if (media.matches) { animations.forEach(animation => animation.cancel()); animations.clear(); } };
    media.addEventListener('change', stop);
    return () => { observer.disconnect(); animations.forEach(animation => animation.cancel()); media.removeEventListener('change', stop); };
  }, [path]);
  return null;
}
