import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { routes, projects, posts, metadata, normalizePath } from '../.ssr/entry-server.js';

const dist = resolve('dist');
test('all published routes are unique and statically rendered', async () => {
  assert.equal(routes.length, new Set(routes).size);
  assert.equal(routes.length, 12);
  for (const path of routes) {
    const html = await readFile(resolve(dist, `.${path}`, 'index.html'), 'utf8');
    assert.match(html, /data-prerendered="true"/);
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, path);
    assert.ok(html.includes('<title>' + metadata(path).title + '</title>'), path);
    assert.ok(!html.includes('<!--site-html-->'), path);
    assert.ok(!html.includes('href="#"'), path);
    assert.ok(!html.includes('javascript:'), path);
  }
});
test('internal page links resolve to generated HTML, including anchors', async () => {
  for (const path of routes) {
    const html = await readFile(resolve(dist, `.${path}`, 'index.html'), 'utf8');
    for (const match of html.matchAll(/href="([^"#][^"]*)"/g)) {
      const href = match[1];
      if (!href.startsWith('/') || href.startsWith('//') || href.includes('/assets/') || href === '/favicon.svg') continue;
      const [targetPath, anchor] = href.split('#');
      const file = resolve(dist, '.' + normalizePath(targetPath), 'index.html');
      await stat(file);
      if (anchor) assert.ok((await readFile(file, 'utf8')).includes(`id="${anchor}"`), `${path} -> ${href}`);
    }
  }
});
test('private projects link to editorial notes, not inaccessible repositories', () => {
  for (const name of ['emap', 'async-geotiff-rust']) {
    const project = projects.find((item) => item.name === name);
    assert.ok(project && !project.external);
    assert.ok(routes.includes(project.href));
  }
  assert.equal(projects.find((item) => item.name === 'tasklane').href, 'https://github.com/mapseekai/tasklane');
});
test('article slugs and editorial bodies are complete', () => {
  assert.equal(posts.length, new Set(posts.map((post) => post.slug)).size);
  for (const post of posts) { assert.ok(post.sections.length >= 2); assert.ok(post.sections.every((section) => section.paragraphs.length >= 2)); }
});
test('404 exists and is not indexable', async () => {
  const html = await readFile(resolve(dist, '404.html'), 'utf8');
  assert.match(html, /name="robots" content="noindex"/);
  assert.match(html, /这片区域，还没有被绘制/);
});
