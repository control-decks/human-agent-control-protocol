# Human-Agent Control Protocol, Draft 0.3

Status: Working draft  
Protocol identifier: `hacp/0.3`

This document defines the normative behavior of HACP Draft 0.3. The key words
MUST, MUST NOT, SHOULD, SHOULD NOT, and MAY indicate requirement strength.

## 1. Scope

HACP governs explicit human control of agent behavior through cards. It defines
card identity, message position, Binding, Working Object transfer, control
state, composition, lifecycle, and visible resolution.

HACP does not define transport, model APIs, tool permissions, persistent
storage, or a security boundary.

## 2. Terms

| Term | Definition |
| --- | --- |
| **Card** | A playable contract with one primary effect. |
| **Deck** | A purpose, mental model, shared resolver, and set of cards. |
| **Play** | An explicit card invocation in a human message. |
| **Binding** | The material or scope to which a card applies. |
| **Working Object** | The current result passed between adjacent cards. |
| **Annotation** | Evidence or verification added without replacing the object. |
| **Control** | Session state that permits, blocks, or delays resolution. |
| **Combo** | Cards resolved in one ordered message stream. |
| **Trace** | Visible metadata naming the resolved Binding and played cards. |
| **Clear** | Remove an active control from later resolution. |

## 3. Identity and invocation

Every card MUST have a canonical identifier in the form `deck/card`, such as
`work-this-way/read-only`. Canonical identifiers remain stable across provider
syntax and repository ownership changes.

A provider command is an alias. Examples include
`$work-this-way:work-read-only` and `/work-this-way:work-read-only`. Decks MAY
document a shorter portable form such as `/work-read-only`.

The agent MUST resolve explicit invocations only. It MUST NOT infer, repeat, or
play a card from cadence, prose similarity, or a default.

## 4. Ordered message stream

A human message contains ordered prose blocks and explicit card invocations.
The resolver MUST preserve their order.

1. A leading control applies prospectively.
2. A leading operation consumes the first following prose block. If no prose
   follows, it consumes the available Working Object or its declared default.
3. A card after prose consumes the object accumulated to its left.
4. Prose following a card adds human-authored material to the current object.
5. The next card consumes that updated object.

Providers MAY represent a card as a command line or an explicit skill token.
They MUST preserve invocation order. Plain prose MUST NOT become a card.

## 5. Mechanical roles

Each card declares one `kind`:

| Kind | Required behavior |
| --- | --- |
| `binding` | Select or refine the Binding. |
| `control` | Activate, qualify, or clear control state. |
| `operation` | Transform, annotate, act, or create an artifact. |
| `presentation` | Render the current object without changing its substance. |

The optional `mode` refines the role:

- binding: `select`;
- control: `guard`, `qualify`, or `clear`;
- operation: `transform`, `annotate`, `action`, or `artifact`;
- presentation: `render`.

Decks MAY define more specific semantic labels. Those labels MUST map to one
HACP kind and mode.

## 6. Binding

Every operation and presentation card MUST declare a `defaultBinding`. A
binding card overrides that value at its position in the stream.

The resolver applies a default directly. It MUST NOT report or trace a default
as a hidden card play.

A Binding MAY use deck-specific language. Think It Through can expose topic,
axis, and conversation selectors. Work This Way can bind to current work.
Reality Check can bind to a result, claim set, artifact, or action target.

## 7. Working Object

The Working Object has this conceptual envelope:

```text
binding       resolved Binding
status        success | blocked | pending
kind          namespaced semantic kind
content       human-visible result
annotations   zero or more namespaced annotations
source        canonical identifier of the last resolved card
```

This envelope defines meaning. Draft 0.3 does not require serialization.

Adjacent cards receive the Working Object automatically, including cards from
different decks. A card MUST declare the kinds or protocol-level result family
it accepts and the kind it produces.

An annotating card MUST preserve the input kind, content, and existing
annotations. It appends its own annotation and MAY add a concise visible delta.

Deck mental models remain private to their deck. Only the Working Object,
resolved Binding, and active controls cross a deck boundary.

## 8. Preflight

Before applying any effect, the resolver MUST validate the complete message
stream:

1. resolve each canonical card identity;
2. validate role, position, and lifecycle use;
3. validate `accepts` and `produces` compatibility;
4. evaluate declared relations and active controls;
5. detect a later control that would have changed the legality of an earlier
   operation.

The resolver MUST reject an invalid stream before applying its first effect. It
MUST NOT reorder cards to make the stream valid.

Example: `IMPLEMENT → READ ONLY` is invalid because the late control would have
forbidden the earlier mutation. No mutation occurs.

## 9. Resolution and status

Valid streams resolve in written order. Each card receives the current Binding,
Working Object, and active controls, then returns an updated object or state.

HACP distinguishes these outcomes:

| Outcome | Meaning |
| --- | --- |
| `success` | The card completed and returned an object. |
| `blocked` | A control forbade the effect; the blocked result can continue. |
| `pending` | The effect awaits human approval. |
| `deferred` | A later card needs a result that a pending card has not produced. |
| `invalid` | Preflight rejected the stream; no effect occurred. |

`invalid` is not a Working Object status. It is a preflight result.

A card MAY accept `blocked` or `pending` objects. A card that requires the
completed result of a pending operation becomes `deferred`. After approval, the
resolver resumes at the pending operation and then resolves its deferred
dependants.

Approval never changes the original Binding or scope. If the mutation batch,
target, or external effect changes, the resolver MUST ask again.

## 10. Control precedence and lifecycle

A blocking control wins over a control that requests approval. `READ ONLY`
therefore blocks a mutation even when `ASK FIRST` is active.

HACP distinguishes domain mutation from control-state changes. `READ ONLY`
MUST NOT prevent the human from clearing HACP controls.

Work This Way defines these Draft 0.3 controls:

- `READ ONLY` blocks the `mutation` trait;
- `ASK FIRST` requires approval for each described mutation batch;
- `LOCAL ONLY` blocks the `external-access` trait;
- `EVIDENCE REQUIRED` blocks dependent operations until the Working Object
  carries sufficient evidence or names the missing evidence;
- `ONCE` applies a one-completed-turn duration to controls activated in the
  same combo;
- `WORK CLEAR` clears all Work This Way controls and no state from another
  deck.

Persistent controls use `until-clear` by default. `until-clear` is a declared
duration, not a hidden card.

A one-turn control clears after one completed governed agent turn. `blocked`
counts as completed. `pending`, `deferred`, and `invalid` do not consume it.

Control state ends with the session even if the declared duration is
`until-clear`. HACP Draft 0.3 defines no cross-session state.

## 11. Visibility and response economy

The resolver MUST show one complete trace when a combo begins. It MUST show one
compact active-state line on every agent turn governed by a persistent control.

The resolver SHOULD return only the final useful Working Object. It SHOULD NOT
print each intermediate result, restate this protocol, or explain card
mechanics unless the user asks.

A pending result MUST show the approval request and enough scope for an
informed decision. A blocked result MUST name the blocking control and confirm
that the forbidden effect did not occur.

Normal conversation without a played card has no HACP trace.

## 12. Card contract

A card skill declares:

```text
Use when
Default binding
Accepts
Effect
Result
Duration
Limits
Format
```

`Flow` is optional. Include it only when sequence or branching would otherwise
remain ambiguous.

The card MUST keep one primary effect. Its limits MUST prevent silent scope
expansion and accidental authorization.

## 13. Deck contract

A deck defines:

- a purpose and deck-local mental model;
- a shared root skill containing the minimum HACP resolver needed to remain
  self-contained;
- card skills and a help utility;
- a `hacp.deck.json` manifest;
- provider manifests and installation metadata.

The canonical HACP skill is optional. A conforming deck MUST work without a
remote HACP dependency.

## 14. Deck manifest

Each deck root publishes `hacp.deck.json`:

```json
{
  "hacp": "0.3",
  "deck": {
    "id": "work-this-way",
    "version": "0.1.0",
    "publisher": "Control Decks"
  },
  "cards": [
    {
      "id": "work-this-way/read-only",
      "command": "work-read-only",
      "kind": "control",
      "mode": "guard",
      "traits": ["session-control"],
      "defaultBinding": "current-work",
      "accepts": ["hacp/result"],
      "produces": "hacp/control-state",
      "duration": "until-clear",
      "relations": {
        "references": ["work-this-way/implement"],
        "blocksTraits": ["mutation"]
      }
    }
  ]
}
```

Required fields are `hacp`, `deck.id`, `deck.version`, `deck.publisher`, and
every card field shown above. `relations` MUST be an object. Unused relation
arrays MAY be omitted.

Closed relations use canonical card identifiers. Open compatibility uses
traits, accepted kinds, produced kinds, and annotations. A deck SHOULD NOT
enumerate every future compatible card.

## 15. Conformance

An agent conforms to HACP Draft 0.3 when it:

- resolves explicit cards under this ordered grammar;
- transfers the Working Object across deck boundaries;
- applies active controls before tool calls or domain effects;
- blocks forbidden effects and exposes state;
- produces no effect for invalid streams;
- keeps defaults and deck mental models implicit;
- returns the minimum sufficient visible result.

Conformance describes behavior. It does not prove that the host can enforce
that behavior against a faulty agent or tool.
