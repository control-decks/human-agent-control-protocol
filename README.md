# Human-Agent Control Protocol

**Cards are the interface. Control is the protocol.**

Draft `0.3`

HACP gives people a visible way to direct how an AI agent thinks, checks, and
acts. A card carries one reusable instruction. A deck gives related cards a
shared purpose. HACP defines how cards bind to material, pass results, combine,
persist, block, and clear.

The repository keeps its historical `human-agent-card-protocol` slug. The
public name is **Human-Agent Control Protocol**.

## Control you can see

Suppose `READ ONLY` is active and you ask the agent to implement a change:

```text
$work-this-way:work-read-only
+ $work-this-way:work-implement
+ $think-it-through:think-explain
```

A conforming agent blocks the mutation before calling a mutating tool, then
passes that blocked result to `EXPLAIN`:

```text
> 🛠 WORK · BLOCKED · READ ONLY · READ ONLY → IMPLEMENT → THINK EXPLAIN

No mutation occurred. READ ONLY forbids the change until you clear the active
Work This Way controls.
```

The compact line shows both resolution and the state that will govern the next
exchange. The response contains the final useful result rather than a report
for every intermediate step.

## One object, multiple decks

Cards pass a **Working Object** from left to right. The object can cross deck
boundaries:

```text
accepted direction
→ THINK TO PLAN
→ plan
→ REALITY CHECK TARGETS
→ checked plan
→ WORK IMPLEMENT
→ implementation result
→ THINK EXPLAIN
→ explanation
```

Three pieces stay visible throughout the flow:

| Part | Meaning |
| --- | --- |
| **Binding** | What the cards apply to |
| **Working Object** | The result passed to the next card |
| **Active Controls** | The constraints governing resolution |

Each deck keeps its own mental model. Decks share the Working Object, resolved
Binding, and active controls.

## The grammar

HACP defines four mechanical roles:

| Role | Purpose |
| --- | --- |
| `binding` | Select what later cards apply to |
| `control` | Activate, qualify, or clear control state |
| `operation` | Transform, annotate, or act on the Working Object |
| `presentation` | Change representation without changing substance |

Prose and explicit card invocations form an ordered stream. Position carries
meaning. A leading card acts on following material or the available object. A
card after prose consumes that prose. A card between blocks transforms the
object at that point.

The agent validates the complete stream before applying an effect. It never
reorders cards silently. An invalid combo produces no effect.

Read the normative [HACP Draft 0.3 specification](SPEC.md) for identifiers,
result states, lifecycle rules, manifests, and conformance requirements.

## Decks

- [Think It Through](https://github.com/control-decks/think-it-through) shapes
  and develops thought.
- [Reality Check](https://github.com/control-decks/reality-check) verifies
  targets, sources, and assumptions without replacing the object.
- [Work This Way](https://github.com/control-decks/work-this-way) applies
  session controls and explicit action cards.

You can install one deck or combine several. Each deck remains self-contained.

## Optional HACP skill

The `hacp` plugin supplies the canonical resolver and deck-authoring guidance.
Decks do not require it at runtime.

### Codex

```bash
codex plugin marketplace add control-decks/human-agent-card-protocol
codex plugin add hacp@hacp
```

Use `$hacp` to explain or audit a flow.

### Claude Code

```bash
claude plugin marketplace add control-decks/human-agent-card-protocol --scope user
claude plugin install hacp@hacp --scope user
```

Use `/hacp:hacp` to explain or audit a flow.

## Build a deck

Start from an instruction you already repeat. Give the card one effect, one
recognizable result, a default Binding, a duration, and clear limits. Add a
`hacp.deck.json` manifest so other decks can identify its inputs, outputs,
traits, and known relations.

Test the card alone, at each message position, in same-deck combos, across deck
boundaries, and under active controls. Remove it if its result does not differ
from normal conversation.

## Boundaries

HACP defines observable agent behavior. It does not provide a sandbox,
permission system, parser, runtime, database, or transport. A conforming agent
must honor controls such as `READ ONLY`, but HACP cannot prevent a broken or
hostile implementation from ignoring them.

## Feedback

Open a [GitHub issue](https://github.com/control-decks/human-agent-card-protocol/issues)
when a real deck exposes an ambiguous rule or missing invariant.

## License

[MIT](LICENSE)
