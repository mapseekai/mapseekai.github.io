import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

export async function waitForEmapCi(commit, request = fetch, wait = delay) {
  if (!/^[0-9a-f]{40}$/.test(commit)) throw new Error('Invalid eMAP commit');
  const url = `https://api.github.com/repos/mapseekai/emap/actions/workflows/ci.yml/runs?branch=master&event=push&head_sha=${commit}&per_page=1`;

  for (let attempt = 0; attempt <= 10; attempt++) {
    const response = await request(url, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'mapseekai-pages-ci-gate',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });
    if (!response.ok) throw new Error(`Unable to check eMAP CI: HTTP ${response.status}`);
    const { workflow_runs: runs } = await response.json();
    if (!Array.isArray(runs)) throw new Error('Invalid eMAP CI response');
    const run = runs[0];
    if (run && (run.head_sha !== commit || run.head_branch !== 'master' || run.event !== 'push')) {
      throw new Error('eMAP CI response does not match the checked-out commit');
    }
    if (run?.status === 'completed') {
      if (run.conclusion === 'success') return;
      throw new Error(`eMAP CI for ${commit} concluded ${run.conclusion}`);
    }
    if (attempt < 10) {
      console.log(`Waiting for eMAP CI on ${commit}`);
      await wait(60_000);
    }
  }
  throw new Error(`Timed out waiting for eMAP CI on ${commit}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const commit = execFileSync('git', ['-C', '.emap-source', 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  await waitForEmapCi(commit);
}
