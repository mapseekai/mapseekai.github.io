import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const sources = [
  ['website', 'https://github.com/mapseekai/mapseekai.github.io.git', 'refs/heads/main'],
  ['docs', 'https://github.com/mapseekai/emap-web.git', 'refs/heads/main'],
  ['emap', 'https://github.com/mapseekai/emap.git', 'refs/heads/master'],
];

export function checkDeploymentSources(expected, readHead = (url, ref) => execFileSync(
  'git', ['ls-remote', '--exit-code', url, ref], { encoding: 'utf8', timeout: 30_000 },
)) {
  for (const [name, url, ref] of sources) {
    if (!/^[0-9a-f]{40}$/.test(expected[name] ?? '')) throw new Error(`Invalid ${name} commit`);
    const [actual, actualRef] = readHead(url, ref).trim().split(/\s+/);
    if (actual !== expected[name] || actualRef !== ref) throw new Error(`${name} changed after the build`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  checkDeploymentSources({ website: process.env.WEBSITE_COMMIT, docs: process.env.DOCS_COMMIT, emap: process.env.EMAP_COMMIT });
}
