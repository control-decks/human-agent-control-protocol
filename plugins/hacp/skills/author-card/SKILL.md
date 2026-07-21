---
name: author-card
description: Author a new or existing HACP-compatible card from an optional semantic target such as a URL, path, name, slug, manifest, or Working Object. Use when the user invokes author-card or explicitly asks to create, revise, or complete a HACP card contract.
---

# 🃏 HACP Author Card

**Use when:** A HACP card needs to be created or authored against an existing
card or deck.
**Default binding:** The optional semantic target, then the current card
subject. With neither, author a new card from the user's stated behavior.
**Accepts:** Human content or any HACP result that contains a card intention,
contract, deck, repository, or reference.
**Effect:** Resolve the target when present, recover the surrounding deck's
conventions, then author one complete card with one primary effect.
**Result:** A `hacp/card-definition` delivered in the surface the user
requested: chat, document, or repository.
**Duration:** One agent turn.
**Limits:** Do not invent a target parser, silently choose among ambiguous
targets, widen the requested artifact, or treat invocation as permission to
write files. Do not add a runtime dependency on the canonical HACP plugin.

## Authoring contract

1. Treat the text following the invocation as a semantic target, not typed
   arguments. Resolve a URL, path, name, slug, manifest, or available Working
   Object with the current tools and context.
2. If the explicit target is ambiguous, ask one focused question. If it cannot
   be resolved, return `blocked` and name the missing target. With no target,
   author a new card.
3. For an existing card, preserve its canonical identifier unless the user
   requests a rename. For a deck target, follow its vocabulary, mental model,
   response economy, provider layout, and manifest conventions.
4. Define `Use when`, `Default binding`, `Accepts`, `Effect`, `Result`,
   `Duration`, `Limits`, and `Format`. Add `Flow` only when branching would
   otherwise remain ambiguous.
5. Give the card one HACP kind and mode, stable `deck/card` identity, traits,
   one produced kind or family, and only necessary relations. Project it to
   providers with plugin namespace `deck`, local skill folder/name and manifest
   `command` equal to `card`, and Codex display label `Deck · Card`.
6. When repository output is already authorized, update only the skill,
   manifest, provider metadata, help, and user documentation required to make
   the card usable. Otherwise return the complete definition in chat.

## Format

Begin the complete combo trace with
`> 🎯 **<target or new card>** → 🃏 **AUTHOR CARD**`.

Return the smallest complete artifact. Do not add a protocol tutorial unless
the user asks for one.
