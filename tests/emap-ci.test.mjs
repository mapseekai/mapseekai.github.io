import assert from 'node:assert/strict';
import { test } from 'node:test';
import { waitForEmapCi } from '../scripts/wait-for-emap-ci.mjs';

const commit = 'a'.repeat(40);
const run = (status, conclusion = null) => ({ head_sha: commit, head_branch: 'master', event: 'push', status, conclusion });
const response = (runs) => ({ ok: true, json: async () => ({ workflow_runs: runs }) });

test('waits for the checked-out commit to pass CI', async () => {
  const results = [response([]), response([run('in_progress')]), response([run('completed', 'success')])];
  const waits = [];
  await waitForEmapCi(commit, async (url) => {
    assert.match(url, new RegExp(`head_sha=${commit}`));
    return results.shift();
  }, async (ms) => waits.push(ms));
  assert.deepEqual(waits, [60_000, 60_000]);
  assert.equal(results.length, 0);
});

test('rejects failed or cancelled CI and results for a different push', async () => {
  for (const conclusion of ['failure', 'cancelled']) {
    await assert.rejects(waitForEmapCi(commit, async () => response([run('completed', conclusion)])), /concluded/);
  }
  for (const mismatch of [{ head_sha: 'b'.repeat(40) }, { head_branch: 'other' }, { event: 'pull_request' }]) {
    await assert.rejects(waitForEmapCi(commit, async () => response([{ ...run('completed', 'success'), ...mismatch }])), /does not match/);
  }
});

test('fails closed when CI is unavailable or does not finish', async () => {
  await assert.rejects(waitForEmapCi(commit, async () => ({ ok: false, status: 403 })), /HTTP 403/);
  await assert.rejects(waitForEmapCi(commit, async () => ({ ok: true, json: async () => ({}) })), /Invalid eMAP CI response/);
  let calls = 0;
  await assert.rejects(waitForEmapCi(commit, async () => { calls++; return response([]); }, async () => {}), /Timed out/);
  assert.equal(calls, 11);
});
