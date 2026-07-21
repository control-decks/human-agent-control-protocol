const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const hook = require('../plugins/hacp/hooks/session-start.js');

test('loads the protocol body without frontmatter', () => {
  const payload = hook.loadProtocol();
  assert.match(payload, /^HACP PROTOCOL ACTIVE — Draft 0\.4/);
  assert.doesNotMatch(payload, /^---/);
  assert.match(payload, /Cards are explicit human-invoked commands/);
});

test('uses Codex additionalContext for session starts and resumes', () => {
  for (const event of ['SessionStart', 'SubagentStart']) {
    const output = JSON.parse(hook.formatOutput(event, 'payload', { PLUGIN_DATA: '/tmp/data' }));
    assert.equal(output.hookSpecificOutput.hookEventName, event);
    assert.equal(output.hookSpecificOutput.additionalContext, 'payload');
  }

  const hooks = JSON.parse(fs.readFileSync(
    path.join(__dirname, '../plugins/hacp/hooks/hooks.json'),
    'utf8',
  ));
  assert.match(hooks.hooks.SessionStart[0].matcher, /resume/);
  assert.match(hooks.hooks.SessionStart[0].matcher, /compact/);
});

test('uses native Claude output and JSON for Claude subagents', () => {
  assert.equal(hook.formatOutput('SessionStart', 'payload', {}), 'payload');
  const output = JSON.parse(hook.formatOutput('SubagentStart', 'payload', {}));
  assert.equal(output.hookSpecificOutput.additionalContext, 'payload');
});

test('makes loader failures explicit', () => {
  assert.throws(() => hook.loadProtocol('/missing/hacp-protocol.md'));
  assert.match(hook.formatFailure('SessionStart', {}), /FAILED TO LOAD/);
  const output = JSON.parse(hook.formatFailure('SessionStart', { PLUGIN_DATA: '/tmp/data' }));
  assert.match(output.systemMessage, /FAILED TO LOAD/);
});
