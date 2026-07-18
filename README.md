# Human-Agent Card Protocol

**Draft 0.2**

The Human-Agent Card Protocol is a draft semantic interaction protocol for cards explicitly played by a human and resolved by an AI agent.

Conversation Cards are the public interface. Each card declares its default focus, effect, result, and duration. The protocol defines how cards combine, resolve, and clear.

HACP is a working proposal extracted from one implemented deck. It is not a standard or a network protocol. The acronym is overloaded elsewhere, so the full name is authoritative.

## Why cards

People often mix their actual thought with instructions for the agent:

```text
This product may be a method, a tool, and a protocol.
Separate those ideas, keep useful connections, and do not choose yet.
```

The first sentence carries the thought. The second controls the response. A card can name that repeated instruction:

```text
This product may be a method, a tool, and a protocol.
/distill
```

The card holds the richer contract. The human can keep developing the subject.

## One exchange

```mermaid
flowchart LR
    H["Human turn<br/>thought + zero or more cards"] --> C{"Cards played?"}
    C -->|No| N["Normal agent response"]
    C -->|Yes| A["Resolve explicit effects"]
    N --> R["Next human thought"]
    A --> R
    R --> H
```

A **human turn** contains a message and zero or more explicitly played cards. An **agent turn** resolves their effects against the available context and returns a result. Together they form an **exchange**.

Without a card, the agent responds normally. A human may play cards on successive turns, but each play remains explicit. The agent never repeats a cleared effect. A card controls the requested operation, not the generated content or final direction.

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

HACP is semantic rather than transport-level. It defines card meaning, resolution, composition, and clearing. It does not define message transport, instruction loading, or memory. Clearing an effect stops its behavior, not the provider's context.

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

Card type determines semantic order. One focus card applies to the complete combo, then clears. Moves resolve left to right without intermediate agent turns. One optional output creates an artifact. Modifiers read the same final result rather than transforming one another.

Every card declares a `Default focus`. A focus card overrides that value for one combo. Without an override, the agent resolves the default directly; it does not play a hidden focus card.

Before applying any effect, ask one focused question when multiple focus or output cards conflict. The agent never plays a move that the human did not invoke or request explicitly.

Each explicit resolution exposes the resolved focus and played cards. The deck chooses the trace format. A normal response without a card has no trace.

Most effects last for one agent turn. A card may declare a multi-exchange duration when its effect requires continued dialogue. A new explicit direction, another played move, completion, or a human stop ends that loop.

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

`Default focus` makes omitted input explicit. `Effect` names the operation without making content deterministic. `Result` makes its outcome recognizable. `Duration` states when the effect clears. `Limits` keep the card narrow.

A useful card captures an instruction that recurs across subjects, produces a distinct result, and composes without forcing a destination.

## Deck contract

A deck applies HACP to a purpose. It defines:

- the purpose people use it for;
- the methodology that guides that purpose;
- the mental model the agent maintains as available context allows;
- the included cards and their defaults;
- a discoverable help entrypoint;
- any deck rules that do not replace HACP's turn and resolution rules.

The mental model belongs to the deck, not to HACP. A research deck might organize questions, claims, and evidence. A writing deck might organize intent, structure, and draft. Both can use the same card lifecycle while reasoning about different material.

The help entrypoint explains the deck, its cards, and their defaults. It may use the current context to recommend normal conversation, a card, or a combo. It never plays a card or recommends domain actions. Its name and presentation belong to the deck and provider.

## First deck

[Think It Through](https://github.com/thevzion/think-it-through) is the deck from which this draft was extracted and the first to implement its rules explicitly. It provides 14 cards plus a contextual help entrypoint for long, nonlinear thinking with this mental model:

```text
Conversation
└── Topics
    └── Axes
```

Its cards clarify, explore, interview, challenge, recover, propose, preserve, and operationalize human thought. The implementation embeds the HACP rules it needs and has no runtime dependency on this repository.

## Boundaries

HACP does not define transport, model APIs, tool access, persistent memory, autonomous card selection, or a required workflow. It does not authorize execution. It provides no SDK, schema, registry, certification, or conformance claim in this draft.

A deck may work inside a stricter method, project convention, or document template. Those systems govern domain reasoning and artifact structure. HACP governs played cards, their order, duration, and conversational result.

## Feedback

This draft needs evidence from more than one deck. Open a [GitHub Issue](https://github.com/thevzion/human-agent-card-protocol/issues) when a rule creates friction, a card type cannot express a useful interaction, or another deck reveals a missing invariant.

## License

MIT
