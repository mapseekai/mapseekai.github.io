import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { loadEnv } from 'vite';
import { render, routes, metadata } from '../.ssr/entry-server.js';

const root = resolve('dist');
const template = await readFile(resolve(root, 'index.html'), 'utf8');
const env = loadEnv('production', process.cwd(), 'VITE_');
const originValue = process.env.VITE_SITE_URL || env.VITE_SITE_URL;
let origin;
if (originValue) {
  const url = new URL(originValue);
  if (!['http:', 'https:'].includes(url.protocol) || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('VITE_SITE_URL must be an HTTP(S) origin without a subpath, query, or hash.');
  }
  origin = url.origin;
}
const escape = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

for (const path of [...routes, '/404/']) {
  const { title, description } = metadata(path);
  const is404 = path === '/404/';
  const canonical = origin && !is404 ? new URL(path, origin).href : undefined;
  const head = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(description)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(description)}" />`,
    `<meta property="og:locale" content="zh_CN" />`,
    `<meta property="og:site_name" content="MapseekAI" />`,
    `<meta property="og:type" content="${path.startsWith('/blog/') && path !== '/blog/' ? 'article' : 'website'}" />`,
    `<meta name="twitter:card" content="summary" />`,
    ...(is404 ? ['<meta name="robots" content="noindex" />'] : []),
    ...(canonical ? [`<link rel="canonical" href="${escape(canonical)}" />`, `<meta property="og:url" content="${escape(canonical)}" />`] : []),
  ].join('\n    ');
  const html = template.replace('<!--site-head-->', head)
    .replace('<div id="root">', '<div id="root" data-prerendered="true">')
    .replace('<!--site-html-->', render(path));
  const file = is404 ? resolve(root, '404.html') : resolve(root, `.${path}`, 'index.html');
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, html);
}
await writeFile(resolve(root, 'robots.txt'), `User-agent: *\nAllow: /\n${origin ? `Sitemap: ${origin}/sitemap.xml\n` : ''}`);
if (origin) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((path) => `<url><loc>${escape(new URL(path, origin).href)}</loc></url>`).join('')}</urlset>\n`;
  await writeFile(resolve(root, 'sitemap.xml'), xml);
}
console.log(`Prerendered ${routes.length} pages + 404. ${origin ? `Canonical origin: ${origin}` : 'No production origin configured; canonical URLs and sitemap omitted.'}`);
