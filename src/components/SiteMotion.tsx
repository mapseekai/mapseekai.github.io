import { useEffect } from 'react';

/** Animate on entry, never hide content as a prerequisite for reading it. */
export function SiteMotion({ path }: { path: string }) {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        entry.target.setAttribute('data-entered', 'true');
        if (media.matches) continue;
        const animation = entry.target.animate([
          { opacity: 0.65, transform: 'translateY(16px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 480, easing: 'cubic-bezier(0.16,1,0.3,1)' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.06 });
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    const stop = () => { if (media.matches) animations.forEach((animation) => animation.cancel()); };
    media.addEventListener('change', stop);
    return () => { observer.disconnect(); animations.forEach((animation) => animation.cancel()); media.removeEventListener('change', stop); };
  }, [path]);
  return null;
}
