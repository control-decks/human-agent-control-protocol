# Human-Agent Control Protocol

**Cards are the interface. Control is the protocol.**

Draft `0.4`

HACP is the semantic protocol behind Control Decks. It lets a human play
explicit commands that bind to material, pass one Working Object, combine with
other cards, and govern agent behavior without rewriting the same instructions.

## One payload, then explicit cards

The HACP plugin loads one compact protocol payload when a session starts. It
does not play a card and does not change ordinary conversation. Cards remain
explicit human commands:

```text
$deck-a:prepare
→ $deck-b:inspect
+ $deck-c:present
```

The agent preflights the complete stream, resolves it in written order, and
returns the smallest useful final result. `+` denotes a presentation of the
same semantic object; `→` passes the object into another operation.

## The shared envelope

```text
Binding + Working Object + Active Controls
```

- **Binding** says what a card acts on.
- **Working Object** carries the current kind, content, status, annotations,
  and provenance.
- **Active Controls** govern effects and tool calls before they occur.

Annotations carry their own Binding and provenance. They can travel with a
derived result without pretending that the derived result was itself checked.
Presentations render an object without replacing what a later operation
receives.

## Install the session adapter

Install HACP once, then install any compatible decks you want to use.

### Codex

```bash
codex plugin marketplace add control-decks/human-agent-control-protocol
codex plugin add hacp@hacp
```

Codex requires explicit trust for non-managed plugin hooks. Review the HACP
hook when prompted, or use `/hooks` where that command is available. A skipped
hook means the session must not claim HACP conformance.

Invoke `$hacp:protocol` directly to explain or audit HACP. The session hook
loads the same skill body automatically; it does not maintain separate rules.
On delegation, `SubagentStart` reloads that payload while the parent passes the
current object and active controls in the delegated task.

### Claude Code

```bash
claude plugin marketplace add control-decks/human-agent-control-protocol --scope user
claude plugin install hacp@hacp --scope user
```

Invoke `/hacp:protocol` directly to explain or audit HACP.

## Authoring cards

The plugin also exposes two human-only authoring cards:

| Card | Result |
| --- | --- |
| `HACP AUTHOR CARD` | One complete `hacp/card-definition` |
| `HACP AUTHOR DECK` | One complete `hacp/deck-definition` |

Both accept an optional semantic target such as a URL, path, name, slug,
manifest, or available Working Object. With no target they author a new
artifact. Invocation alone never grants permission to modify files.

## What makes a deck compatible

A deck is a namespace, distribution unit, and coherent set of standalone
cards. It does not carry its own resolver. Each card declares one effect,
Binding, structural inputs, semantic preconditions, output, duration, and
limits. Provider metadata prevents the agent from invoking cards itself.

The normative [HACP Draft 0.4 specification](SPEC.md) defines the complete
contract. `hacp.deck.json` exposes machine-readable card identities and
interfaces.

## First-party decks

- [Think It Through](https://github.com/control-decks/think-it-through) develops thought.
- [Work This Way](https://github.com/control-decks/work-this-way) sets visible session controls and acts.
- [Reality Check](https://github.com/control-decks/reality-check) adds scoped verification annotations.

Real cross-deck recipes live in deck documentation and the
[Control Decks profile](https://github.com/control-decks). They are examples,
not protocol dependencies.

## A Home-first companion, not a dependency

[Endroit](https://github.com/thevzion/endroit) and HACP can complement each
other without depending on each other:

```text
Endroit  owns workplace nouns, bindings, and durable transitions
HACP     owns optional explicit composition and control
Runtime  owns execution
Human    owns direction, judgment, and promotion
```

A companion Deck may project its stable Card capabilities into natural Endroit
activation surfaces:

```text
enter-the-home                 resolve and reload the Home
enter-the-<room>-room          resolve and reload one Room
work-on-<site>                 bind work to a Site
call-the-researcher            add a temporary Occupant
work-as-an-engineer            apply a Home-owned Role
use-research                   activate Home-owned Equipment
retain-this                    retain Room-owned Material
accept-this                    accept explicit Room truth
deliver-this                   deliver through a resolved Route
deliver-this-to-<site>         deliver through a selected Site Route
archive-this                   archive Material in its owning Room
```

These names are Endroit activation surfaces, not HACP protocol vocabulary.
Canonical HACP identity remains `deck/card`; Endroit resolves the referenced
Home objects and owns their lifecycle. Draft 0.4 does not require Endroit, and
Endroit does not require HACP. Ordinary conversation remains ungoverned until
a human explicitly plays a Card.

## Boundaries

HACP defines observable behavior. Its adapter is not a sandbox, permission
system, parser, runtime, database, transport, memory, or persistent work
environment. A conforming agent must honor controls, but HACP cannot prevent a
broken or hostile implementation from ignoring them.

## Feedback

Open a [GitHub issue](https://github.com/control-decks/human-agent-control-protocol/issues)
when a real card flow exposes an ambiguous rule or missing invariant.

## License

[MIT](LICENSE)
