#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const protocolPath = path.join(__dirname, '..', 'skills', 'protocol', 'SKILL.md');
const failureMessage =
  'HACP PROTOCOL FAILED TO LOAD. Do not claim HACP conformance or resolve HACP cards until the protocol payload is available.';

function stripFrontmatter(markdown) {
  return String(markdown).replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n+/, '').trim();
}

function loadProtocol(file = protocolPath) {
  return `HACP PROTOCOL ACTIVE — Draft 0.4\n\n${stripFrontmatter(fs.readFileSync(file, 'utf8'))}`;
}

function formatOutput(event, context, env = process.env) {
  if (env.PLUGIN_DATA) {
    return JSON.stringify({
      hookSpecificOutput: { hookEventName: event, additionalContext: context },
    });
  }

  if (event === 'SubagentStart') {
    return JSON.stringify({
      hookSpecificOutput: { hookEventName: event, additionalContext: context },
    });
  }

  return context;
}

function formatFailure(event, env = process.env) {
  if (env.PLUGIN_DATA) {
    return JSON.stringify({
      systemMessage: failureMessage,
      hookSpecificOutput: {
        hookEventName: event,
        additionalContext: failureMessage,
      },
    });
  }
  return formatOutput(event, failureMessage, env);
}

function main() {
  let input = {};
  try {
    const raw = fs.readFileSync(0, 'utf8');
    if (raw.trim()) input = JSON.parse(raw.replace(/^\uFEFF/, ''));
  } catch (_) {
    // Hook input is optional for the payload; default to SessionStart.
  }

  const event = input.hook_event_name || 'SessionStart';
  try {
    process.stdout.write(formatOutput(event, loadProtocol()));
  } catch (_) {
    process.stderr.write(`${failureMessage}\n`);
    process.stdout.write(formatFailure(event));
  }
}

if (require.main === module) main();

module.exports = {
  failureMessage,
  formatFailure,
  formatOutput,
  loadProtocol,
  stripFrontmatter,
};
