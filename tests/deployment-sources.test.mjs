import assert from 'node:assert/strict';
import { test } from 'node:test';
import { checkDeploymentSources } from '../scripts/check-deployment-sources.mjs';

const commits = { website: 'a'.repeat(40), docs: 'b'.repeat(40), emap: 'c'.repeat(40) };
const head = (changed) => (url, ref) => {
  const name = url.includes('mapseekai.github.io') ? 'website' : url.includes('emap-web') ? 'docs' : 'emap';
  return `${name === changed ? 'd'.repeat(40) : commits[name]}\t${ref}\n`;
};

test('accepts a build only while all three sources are current', () => {
  assert.doesNotThrow(() => checkDeploymentSources(commits, head()));
  for (const changed of ['website', 'docs', 'emap']) {
    assert.throws(() => checkDeploymentSources(commits, head(changed)), new RegExp(`${changed} changed`));
  }
});

test('rejects missing commits and unavailable source heads', () => {
  assert.throws(() => checkDeploymentSources({ ...commits, emap: '' }, head()), /Invalid emap commit/);
  assert.throws(() => checkDeploymentSources(commits, () => `${commits.website}\trefs/heads/other`), /website changed/);
  assert.throws(() => checkDeploymentSources(commits, () => { throw new Error('network unavailable'); }), /network unavailable/);
});
