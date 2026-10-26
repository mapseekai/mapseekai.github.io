export function BrandMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M5 30V10L20 19L35 10V30M5 10L20 30L35 10M20 19V30" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

export function Brand() {
  return <a className="brand" href="/" aria-label="MapseekAI 首页"><BrandMark /><span>mapseek<span className="brand-ai">ai</span></span></a>;
}

export function Github({ size = 20 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.09c-3.13.68-3.8-1.33-3.8-1.33-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 .1 1.76 1.6 3.3.7.1-.73.4-1.23.72-1.51-2.5-.28-5.13-1.25-5.13-5.54 0-1.22.44-2.22 1.15-3-.11-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.15a10.73 10.73 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.54.23 2.68.11 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.63 5.25-5.14 5.53.4.35.76 1.03.76 2.08v3.34c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"/></svg>;
}
