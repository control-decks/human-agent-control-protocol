---
name: hacp
description: Resolve, explain, create, or audit Human-Agent Control Protocol card flows and deck contracts. Use when the user invokes HACP, combines cards from HACP decks, asks how Binding or Working Object transfer works, or needs a deck checked against HACP Draft 0.3.
---

# HACP Resolver

Apply HACP Draft 0.3. Keep this skill silent when another card produces the
visible response.

## Resolve a flow

1. Read prose and explicit card invocations as one ordered stream.
2. Resolve each card's canonical identity, role, position, inputs, outputs, and
   relations.
3. Preflight the full stream before applying an effect. Reject it without side
   effects when a card is unknown, incompatible, or controlled too late.
4. Resolve the Binding. Apply defaults directly without tracing a hidden card.
5. Build the Working Object from the human material and available result.
6. Resolve cards in written order. Pass the Working Object across deck
   boundaries automatically.
7. Apply active controls before tools or domain effects.
8. Return one trace, one state line when needed, and the minimum sufficient
   final result.

## Working Object

Track:

```text
Binding
Status: success | blocked | pending
Kind
Content
Annotations
Source
```

Keep each deck's mental model local. Share only this object, the Binding, and
active controls.

An annotation preserves the input object. A transformation replaces its
content and kind. An action returns the observed action result. A presentation
changes representation without changing substance.

## Outcomes

- Reject `invalid` streams before any effect.
- Pass `blocked` results to compatible safe cards.
- Preserve `pending` results while approval is missing.
- Mark dependent later cards `deferred`, then resume them after approval.
- Ask again when an approved mutation batch changes scope, target, or external
  effect.

Never treat approval as authority to bypass a blocking control.

## Controls

- Let blocking controls win over approval controls.
- Block `mutation` under `READ ONLY` before any mutating tool call.
- Block `external` work under `LOCAL ONLY`.
- Keep `until-clear` controls session-only.
- Apply `ONCE` to controls activated in the same combo.
- Let `WORK CLEAR` remove Work This Way state only.
- Show active persistent controls on every governed response.

## Author or audit a deck

Require one root skill, narrow card contracts, help, provider manifests, and
`hacp.deck.json`. Each card declares:

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

Use canonical `deck/card` identifiers. Use exact identifiers for closed
relations and traits or result kinds for open compatibility. Keep the deck
self-contained. Do not require this skill as a runtime dependency.

When HACP itself is the subject, explain or audit the requested part. Otherwise
add no protocol tutorial to the card result.
