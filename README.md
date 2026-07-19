# Human-Agent Card Protocol

**Shared rules for conversation cards.**

Draft `0.2`

The Human-Agent Card Protocol (HACP) is a semantic interaction protocol for
cards explicitly played by a human and resolved by an AI agent.

A card turns a repeated instruction such as “separate these ideas without
merging them” into a short, visible command with a recognizable contract. HACP
defines how those cards focus, combine, resolve, last, and clear.

It is a working proposal extracted from one implemented deck. It is not a
standard or a network protocol. The acronym is overloaded elsewhere, so the
full name is authoritative.

## Why cards

People often mix their actual thought with instructions for the agent:

```text
This product may be a method, a tool, and a protocol.
Separate those ideas, keep useful connections, and do not choose yet.
```

The first sentence carries the thought. The second controls the response. That
control instruction may recur across subjects, so a deck can give it a card:

```text
This product may be a method, a tool, and a protocol.
/distill
```

The human keeps developing the subject. The card carries the richer contract.

HACP makes that contract useful across a deck:

- each card declares a recognizable effect, result, default focus, and
  duration;
- several cards combine in a predictable semantic order;
- multi-exchange effects state when they stop and what clears them;
- each explicit play shows what the agent resolved;
- different decks can share interaction rules without sharing a methodology.

Without a card, the agent responds normally.

## One complete exchange

This example uses a deck whose `/distill` card separates thoughts and exposes
only supported relationships.

**Human**

```text
The product may be a method, an interface, and a protocol. Some of those
ideas overlap, but perhaps I am forcing them together.

/distill
```

**Agent**

```text
🎯 Latest message → 🧪 DISTILL

Distilled
- Method: a repeatable way of working.
- Interface: how a person directs and observes the work.
- Protocol: rules that different implementations can follow.

Connections
The three may be layers of one system, but the thought does not establish that
they must be one product.

Response
Choose which layer people adopt first. Let the others support it without
forcing them into the same product boundary.
```

The trace identifies the resolved focus and card. The result remains semantic:
the card controls the requested operation, not the generated content or the
human's final direction.

## A visible combo

Decks can expose several cards in one human turn:

```text
/topic "Positioning"
+ /distill
+ /propose
+ /brief
+ /diagrams
```

The semantic order is visible in one trace:

```text
🎯 Topic: Positioning → 🧪 DISTILL → 🧭 PROPOSE → 📄 BRIEF + 📊 DIAGRAMS
```

HACP resolves the focus first, passes move results from left to right, creates
at most one output, then applies modifiers to the final representation. The
deck chooses the command names and trace style.

## Where HACP fits

HACP governs the lifecycle of played cards. It does not replace a deck,
methodology, provider, or tool.

```mermaid
flowchart LR
    H["Human<br/>thought + explicit cards"] --> P["HACP<br/>focus, order, duration, clearing"]
    P --> D["Deck<br/>card effects and defaults"]
    D --> A["Agent<br/>semantic result"]
    M["Method or project rules"] -. "govern substance" .-> A
    V["Provider, skills, and tools"] -. "supply context and capabilities" .-> A
```

| Layer | Owns |
| --- | --- |
| **HACP** | Card types, semantic order, duration, clearing, and visible resolution |
| **Deck** | Purpose, methodology, mental model, cards, defaults, and help |
| **Method or project** | Domain reasoning, quality constraints, and artifact structure |
| **Provider and tools** | Instruction loading, available context, transport, and capabilities |

Two decks can use the same card lifecycle while organizing completely different
work.

## One exchange

A **human turn** contains a message and zero or more explicitly played cards.
An **agent turn** resolves their effects against the available context and
returns a result. Together they form an **exchange**.

```mermaid
flowchart LR
    H["Human turn<br/>thought + zero or more cards"] --> C{"Cards played?"}
    C -->|No| N["Normal agent response"]
    C -->|Yes| A["Resolve explicit effects"]
    N --> R["Next human thought"]
    A --> R
    R --> H
```

A human may play cards on successive turns, but each play remains explicit.
The agent never repeats a cleared effect. A card controls the requested
operation, not the generated content or final direction.

## Shared terms

| Term | Meaning |
| --- | --- |
| **Play** | Explicitly invoke a card for an agent turn. |
| **Resolve** | Apply a card's effect under the protocol and deck rules. |
| **Effect** | The semantic transformation requested by a card. |
| **Result** | Recognizable material returned or passed to another card. |
| **Duration** | How long an effect remains active. |
| **Combo** | Several cards resolved for the same agent turn. |
| **Focus** | The material on which a combo operates. |
| **Clear** | Stop applying an effect to later turns. |
| **Resolution trace** | Visible metadata identifying the resolved focus and played cards. |

HACP is semantic rather than transport-level. It defines card meaning,
resolution, composition, and clearing. It does not define message transport,
instruction loading, or memory. Clearing an effect stops its behavior, not the
provider's context.

## Resolution rules

HACP uses four card types:

| Type | Role |
| --- | --- |
| **Focus** | Chooses the material for the combo. |
| **Move** | Transforms that material or the preceding result. |
| **Output** | Creates one structured artifact. |
| **Modifier** | Changes the final representation without changing its substance. |

Resolve a combo in this order:

```text
FOCUS? → MOVE* → OUTPUT? → MODIFIER*
```

Card type determines semantic order. One focus card applies to the complete
combo, then clears. Moves resolve left to right without intermediate agent
turns. One optional output creates an artifact. Modifiers read the same final
result rather than transforming one another.

Every card declares a `Default focus`. A focus card overrides that value for
one combo. Without an override, the agent resolves the default directly; it
does not play a hidden focus card.

Before applying any effect, ask one focused question when multiple focus or
output cards conflict. The agent never plays a move that the human did not
invoke or request explicitly.

Each explicit resolution exposes the resolved focus and played cards. The deck
chooses the trace format. A normal response without a card has no trace.

Most effects last for one agent turn. A card may declare a multi-exchange
duration when its effect requires continued dialogue. A new explicit
direction, another played move, completion, or a human stop ends that loop.

## Card contract

A card describes:

```text
Use when
Default focus
Effect
Result
Duration
Limits
Flow
Format
```

`Default focus` makes omitted input explicit. `Effect` names the operation
without making content deterministic. `Result` makes its outcome recognizable.
`Duration` states when the effect clears. `Limits` keep the card narrow.

A useful card captures an instruction that recurs across subjects, produces a
distinct result, and composes without forcing a destination.

## Deck contract

A deck applies HACP to a purpose. It defines:

- the purpose people use it for;
- the methodology that guides that purpose;
- the mental model the agent maintains as available context allows;
- the included cards and their defaults;
- a discoverable help entrypoint;
- any deck rules that do not replace HACP's turn and resolution rules.

The mental model belongs to the deck, not to HACP. A research deck might
organize questions, claims, and evidence. A writing deck might organize intent,
structure, and draft. Both can use the same card lifecycle while reasoning
about different material.

The help entrypoint explains the deck, its cards, and their defaults. It may use
the current context to recommend normal conversation, a card, or a combo. It
never plays a card or recommends domain actions. Its name and presentation
belong to the deck and provider.

## Build and test a deck

Start with behavior people already request:

```text
repeated instruction
→ one narrow effect
→ one recognizable result
→ explicit focus and duration
→ tests alone, in combos, and across exchanges
```

For each candidate card:

1. Write the complete card contract.
2. Assign one HACP type.
3. Test the default focus and an explicit focus override.
4. Combine it with compatible cards and reject focus or output conflicts.
5. Verify the trace, duration, completion, stop, and clearing behavior.
6. Remove or revise the card if its result is not distinct.

A deck is useful because its cards capture repeated needs, not because it has
many cards.

## First deck

[Think It Through](https://github.com/thevzion/think-it-through) is the deck
from which this draft was extracted and the first to implement its rules
explicitly. It provides 14 cards plus a contextual help entrypoint for long,
nonlinear thinking with this mental model:

```text
Conversation
└── Topics
    └── Axes
```

Its cards clarify, explore, interview, challenge, recover, propose, preserve,
and operationalize human thought. The implementation is self-contained.

## Boundaries

HACP does not define transport, model APIs, tool access, persistent memory,
autonomous card selection, or a required workflow. It does not authorize
execution. Draft `0.2` provides no SDK, schema, registry, certification, or
conformance claim.

A deck may work inside a stricter method, project convention, or document
template. Those systems govern domain reasoning and artifact structure. HACP
governs played cards, their order, duration, and conversational result.

## Feedback

This draft needs evidence from more than one deck. Open a
[GitHub Issue](https://github.com/thevzion/human-agent-card-protocol/issues)
when a rule creates friction, a card type cannot express a useful interaction,
or another deck reveals a missing invariant.

## License

[MIT](LICENSE)
