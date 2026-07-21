# Human-Agent Control Protocol, Draft 0.4

Status: Working draft  
Protocol identifier: `hacp/0.4`

This document defines the normative behavior of HACP Draft 0.4. The key words
MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY indicate requirement strength.

## 1. Scope

HACP governs explicit human control of agent behavior through composable cards.
It defines invocation, ordered resolution, Binding, Working Object transfer,
annotations, controls, lifecycle, visibility, and deck interoperability.

HACP does not define transport, model APIs, tool permissions, persistent
storage, a parser, or a security boundary.

## 2. Terms

| Term | Definition |
| --- | --- |
| **Card** | A human-invoked command contract with one primary effect. |
| **Deck** | A namespace, distribution unit, and coherent set of cards. |
| **Play** | An explicit card invocation in a human message. |
| **Protocol adapter** | The host integration that makes the HACP payload available to the agent. |
| **Binding** | The material or scope to which a card applies. |
| **Working Object** | The current semantic result passed between cards. |
| **Annotation** | Scoped information added without replacing the Working Object. |
| **Control** | Session state that permits, blocks, delays, qualifies, or clears resolution. |
| **Combo** | Cards resolved in one ordered message stream. |
| **Trace** | Visible metadata naming the resolved Binding and played cards. |

## 3. Protocol availability

A session is HACP-conforming only when a compatible protocol adapter has made
this protocol's semantics available before the first card resolves. An adapter
MAY use a provider-native lifecycle hook, system instruction, or equivalent
mechanism.

Loading HACP does not play a card and does not govern ordinary conversation.
Without a played card or active control, the agent MUST respond normally and
MUST NOT show a HACP trace.

The canonical HACP plugin is one protocol adapter. A deck MAY be installed
without it, but that installation MUST NOT claim full HACP conformance unless
another compatible adapter is present.

## 4. Identity and invocation

Every card MUST have a stable canonical identifier in the form `deck/card`.
Provider syntax is a mechanical projection of that identity:

| Surface | Projection |
| --- | --- |
| Plugin namespace | `deck` |
| Local skill folder and skill `name` | `card` |
| Manifest `command` | `card` |
| Codex invocation | `$deck:card` |
| Claude Code invocation | `/deck:card` |
| Codex display label | `Deck · Card` |

Cards are human-invoked commands. The agent MUST NOT infer, invoke, repeat,
reorder, or continue a card from natural-language similarity, cadence, a
default, or a prior play. Provider projections MUST disable implicit or
model-initiated invocation when the provider supports that policy.

Support utilities such as `help` and the canonical `protocol` skill are not
cards and MUST NOT appear in `hacp.deck.json`.

## 5. Ordered message stream

A human message is an ordered stream of prose blocks and explicit card plays.
The resolver MUST preserve written order.

1. A leading binding or control applies prospectively.
2. A leading operation consumes the first following prose block. With no
   following prose, it consumes the available Working Object or its default.
3. A card after prose consumes the object accumulated to its left.
4. Prose following a card adds human-authored material to the current object.
5. The next operation consumes that updated object.
6. A presentation renders the current object but does not advance or replace
   the semantic object consumed by a later operation.

Providers MAY render cards as commands, selected skills, or explicit tokens.
They MUST preserve invocation order. Plain prose MUST NOT become a card.

## 6. Mechanical roles

Each card declares one `kind` and one compatible `mode`:

| Kind | Modes | Behavior |
| --- | --- | --- |
| `binding` | `select` | Select or refine the Binding. |
| `control` | `guard`, `qualify`, `clear` | Change active control state. |
| `operation` | `transform`, `annotate`, `action`, `artifact` | Change, annotate, act on, or materialize the object. |
| `presentation` | `render` | Change representation without changing substance. |

Deck-specific labels MUST map to one HACP kind and mode.

## 7. Binding

Every operation and presentation card MUST declare `defaultBinding`. The
resolver chooses the Binding at each card position with this precedence:

1. an explicit Binding established for the card;
2. the current Working Object and its Binding;
3. the card's `defaultBinding`.

A default is applied directly. It MUST NOT be traced as a hidden card.

A binding card acts prospectively over its combo, including a multi-exchange
operation. A deck MAY define its own binding vocabulary, but that mental model
MUST NOT cross a deck boundary.

## 8. Working Object and annotations

The Working Object has this conceptual envelope:

```text
binding       resolved Binding
status        success | blocked | pending
kind          namespaced semantic kind
content       human-visible result
annotations   zero or more scoped annotations
source        canonical identifier of the last resolved operation
```

Each annotation has:

```text
id             namespaced annotation identifier
binding        scope actually inspected
traits         zero or more open semantic traits
content        finding, evidence, or qualification
source         canonical identifier of the annotating card
```

Draft 0.4 defines meaning, not a required serialization.

Adjacent compatible cards receive the Working Object automatically, including
across deck boundaries. A transformation replaces `kind` and `content`. An
action returns its observed result. An annotation MUST preserve the input
Binding, status, kind, content, and existing annotations, then append its own
annotation with the Binding resolved at that card's position.

Existing annotations are preserved by default. A card MAY invalidate or
consume an annotation only through an explicit declared relation. Transit MUST
NOT silently change an annotation's Binding, traits, content, or provenance.

A presentation renders a view of the current object. Its visible result MAY be
returned to the human, but the semantic Working Object remains available to
later operations unchanged. For a presentation card, `produces` names the
rendered view; it does not replace the semantic kind or content.

## 9. Compatibility and preflight

Before applying any effect, the resolver MUST preflight the complete stream:

1. resolve every card identity, role, position, and lifecycle;
2. validate structural compatibility with `accepts` and `produces`;
3. validate semantic preconditions declared by `requires`;
4. evaluate relations and active controls against the concrete effects and
   tool calls selected for each card;
5. reject a later control that would have changed the legality of an earlier
   operation.

`accepts` describes compatible input kinds or HACP families. `requires` is an
optional list of semantic predicates that MUST hold at resolution time.
Shared predicates use the `hacp/*` namespace; deck-local predicates use the
deck namespace. `produces` names one exact kind or HACP family.

An unsatisfied precondition makes the stream `invalid` unless the card's
contract explicitly defines a pending clarification flow. The resolver MUST
reject an invalid stream before its first effect and MUST NOT reorder cards to
make it valid.

Controls apply to actual effects and tool calls, not only manifest traits. A
card that can satisfy its contract through an allowed path SHOULD use that path
instead of failing the whole card.

## 10. Resolution, status, and completion

Valid streams resolve in written order. Each card receives the current
Binding, Working Object, and active controls.

| Outcome | Meaning |
| --- | --- |
| `success` | The card completed and returned an object. |
| `blocked` | A control forbade the effect; a safe compatible card may consume the result. |
| `pending` | The effect awaits human approval or required input. |
| `deferred` | A later card awaits the completed result of a pending card. |
| `invalid` | Preflight rejected the stream before any effect. |

`invalid` is a preflight result, not a Working Object status. `blocked` and
`pending` are statuses, not result kinds.

After approval, resolution resumes at the suspended operation and then its
deferred dependants. Approval does not expand authority or change the original
Binding. A changed target, mutation batch, scope, or external effect requires
new approval.

Cards do not declare themselves terminal. The semantic terminal object is the
last completed non-presentation result in the resolved stream. Presentations
may render that object for the final visible response. A multi-exchange card
remains active until its own completion condition, stop, or redirection.

## 11. Controls and lifecycle

Controls are evaluated before domain effects and tool calls. A blocking
control wins over a control that requests approval. Approval never bypasses a
blocking control or higher instructions.

Control state is owned by its deck. A clear operation MUST name the owner or
control traits it clears and MUST NOT clear another deck's state implicitly.
Control-state changes are distinct from domain mutation, so a mutation guard
MUST NOT prevent the human from clearing controls.

Manifest durations are:

- `once`: one resolution;
- `until-complete`: a multi-exchange operation;
- `until-confirmed`: an artifact awaiting confirmation;
- `until-clear`: persistent session control state.

A qualifier MAY assign `one-turn` to controls activated in its combo. One turn
is consumed only by a completed governed response; `pending`, `deferred`, and
`invalid` do not consume it. All control state ends with the session.

Before delegating governed work, the parent resolver MUST include the resolved
Binding, current Working Object, active controls, and any pending approval
scope in the delegated task. The `SubagentStart` payload supplies protocol
rules, not session state. A delegate MUST apply the inherited state before its
own effects. Delegation MUST NOT expand authority, reset a duration, consume an
approval, or silently clear a control.

## 12. Visibility and response economy

The resolver MUST show one complete trace when a combo begins. It MUST show one
compact state line on every response governed by persistent controls.

A pending result MUST expose enough scope for informed approval. A blocked
result MUST name the blocking control and confirm that the forbidden effect did
not occur.

The response SHOULD contain the smallest useful final result. It SHOULD NOT
print every intermediate object, restate this protocol, or explain mechanics
unless the human asks.

## 13. Card contract

A card skill declares this compact contract:

```text
ID
HACP
Kind
Mode
Traits
Default Binding
Accepts
Requires        optional
Produces
Duration
Effect
Limits
Format          only when the feature requires it
Flow            only when branching would otherwise be ambiguous
```

The card MUST have one primary effect. Its limits MUST prevent silent scope
expansion and accidental authorization. A card MUST remain usable without a
deck-wide root skill; cross-cutting HACP behavior belongs to the protocol
adapter.

## 14. Deck contract

A conforming deck defines:

- one stable namespace and purpose;
- one or more standalone card contracts;
- `hacp.deck.json` and provider manifests;
- installation and user documentation;
- optional explicit `help` and optional deck-local mental model.

A deck MUST NOT require or ship a root resolver skill. A mental model is not a
conformance requirement and belongs only in the cards or help surface that use
it.

Exact card identifiers MAY appear in same-deck relations only when they encode
an indispensable mechanical dependency. Suggestions, sequences, and recipes
belong in documentation. A card or manifest MUST NOT reference a card from
another deck. Open interoperability uses kinds, HACP families, semantic
predicates, traits, and annotation traits.

## 15. Deck manifest

Each deck root publishes `hacp.deck.json`:

```json
{
  "hacp": "0.4",
  "deck": {
    "id": "example-deck",
    "version": "0.1.0",
    "publisher": "Example Publisher"
  },
  "cards": [
    {
      "id": "example-deck/inspect",
      "command": "inspect",
      "kind": "operation",
      "mode": "annotate",
      "traits": ["read-only"],
      "defaultBinding": "current-object",
      "accepts": ["hacp/content", "hacp/result"],
      "requires": ["hacp/inspectable-object"],
      "produces": "hacp/result",
      "duration": "once",
      "relations": {
        "addsAnnotations": ["example-deck/inspected"]
      }
    }
  ]
}
```

Required fields are `hacp`, `deck.id`, `deck.version`, `deck.publisher`, and
every card field shown except `requires`. `relations` MUST be an object. Unused
relations and `requires` MAY be omitted.

An annotating card declares its own annotation IDs with
`relations.addsAnnotations`. Relations MAY use open traits. They MUST NOT use a
foreign deck's card identifier.

## 16. Conformance

An agent conforms to HACP Draft 0.4 when it:

- loads a compatible protocol payload before resolving cards;
- resolves only cards explicitly played by the human;
- preserves written order and preflights before effects;
- transfers scoped Working Objects and annotations across deck boundaries;
- applies active controls before tool calls and domain effects;
- blocks forbidden effects and exposes useful state;
- produces no effect for invalid streams;
- leaves normal conversation untraced;
- returns the minimum sufficient visible result.

Conformance describes observable behavior. It does not prove that the host can
enforce that behavior against a faulty agent or tool and does not create a
sandbox or permission boundary.
