import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const workflow=readFileSync('.github/workflows/build.yml','utf8');
test('report runs after image/compile failure only when one-use fetch succeeded',()=>{
  assert.match(workflow,/- name: Fetch \(one use\)\n        id: fetch/);
  assert.match(workflow,/- name: Encrypt and report\n[^]*?if: \$\{\{ always\(\) && steps\.fetch\.outcome == 'success' \}\}/);
  assert.match(workflow,/\[ -s \/tmp\/log\.txt \] \|\| echo "compile failed"/);
  assert.match(workflow,/node c\.mjs enc "\$J" \/tmp\/log\.txt \/tmp\/log\.enc err/);
});
test('all workflow shell blocks parse after expression substitution',()=>{
  const blocks=[...workflow.matchAll(/        run: \|\n((?:          .*\n|\n)+)/g)];
  assert.ok(blocks.length>=5);
  for(const [,body] of blocks){
    const shell=body.replace(/^          /gm,'').replace(/\$\{\{[^}]+\}\}/g,'test');
    const r=spawnSync('bash',['-n'],{input:shell,encoding:'utf8'});
    assert.equal(r.status,0,r.stderr);
  }
});
test('current crypto uses broker-compatible salt and explicit purpose position',()=>{
  const crypto=readFileSync('c.mjs','utf8');
  assert.match(crypto,/master, "cc-v1"/);
  assert.match(crypto,/process\.argv\[6\]/);
});
