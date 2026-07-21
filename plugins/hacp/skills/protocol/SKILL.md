---
name: protocol
description: Explain or audit Human-Agent Control Protocol flows and deck contracts. The HACP session hook injects this same payload automatically; invoke it directly only when HACP itself is the subject.
disable-model-invocation: true
---

# HACP Protocol

Apply HACP Draft 0.4. Cards are explicit human-invoked commands. Never infer,
invoke, repeat, reorder, or continue a card yourself. Loading this payload does
not play a card: without a played card or active control, respond normally and
show no HACP trace.

## Resolve an ordered stream

1. Read prose and explicit card plays in written order.
2. Preflight every card before the first effect: identity, position, role,
   `accepts`, `requires`, `produces`, lifecycle, relations, concrete effects,
   and active controls.
3. Reject an invalid stream without effects and never reorder it to make it
   valid.
4. Resolve each card's Binding with this precedence: explicit Binding, current
   Working Object, then `defaultBinding`.
5. Pass the Working Object between adjacent compatible cards, including across
   deck boundaries.
6. Apply controls before domain effects and tool calls.
7. Return one trace, useful active state, and the smallest sufficient final
   result.

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

Each annotation tracks its own namespaced ID, Binding, traits, content, and
source. An annotating card preserves the object's Binding, status, kind,
content, and existing annotations. Preserve annotations by default; invalidate
or consume one only through an explicit relation. Never change its scope or
provenance during transit.

A transformation replaces kind and content. An action returns its observed
result. A presentation renders the current object without advancing or
replacing the semantic object consumed by a later operation.

## Outcomes and lifecycle

- `invalid`: preflight failure; no effect occurred.
- `blocked`: a control forbade the effect; safe compatible cards may consume it.
- `pending`: approval or required input is missing.
- `deferred`: a later card awaits the completed pending result.

After approval, resume at the suspended operation, then its deferred dependants.
Ask again when the target, scope, mutation batch, or external effect changes.
Approval never expands authority or bypasses a blocking control.

Cards do not declare themselves terminal. The semantic terminal object is the
last completed non-presentation result. A multi-exchange card remains active
until its completion condition, stop, or redirection.

## Controls and visibility

Let blocking controls win over approval controls. Evaluate constraints against
actual effects, even when a manifest trait describes only the card's primary
path. Control state is owned by its deck; a clear operation affects only its
declared owner or traits. All persistent state ends with the session.

Before delegating governed work, pass the resolved Binding, current Working
Object, active controls, and any pending approval scope into the delegated
task. `SubagentStart` reloads these protocol rules; it does not replace that
explicit state transfer. A delegate inherits the same authority and controls,
and delegation never resets a duration or approval boundary.

Show one complete trace when a combo begins and one compact state line on every
response governed by persistent controls. A pending result exposes approval
scope. A blocked result names the blocking control and confirms that the
forbidden effect did not occur. Do not print unnecessary intermediate objects
or explain HACP unless the human asks.

## Deck boundary

A deck is a namespace, distribution unit, and coherent set of standalone card
contracts. It has no root resolver skill. A mental model and `help` are
optional and remain deck-local.

Card contracts use `accepts` for structural compatibility, optional `requires`
for semantic preconditions, and `produces` for the transmitted kind or family.
Exact card identifiers may express an indispensable same-deck mechanism only.
Cards and manifests never reference a card from another deck; open composition
uses kinds, predicates, traits, and annotation traits.

When invoked directly, explain or audit only the requested HACP surface. Keep
this protocol silent when another card owns the visible response.
