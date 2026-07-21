---
name: author-deck
description: Author a new or existing HACP-compatible deck from an optional semantic target such as a URL, path, name, slug, manifest, or Working Object. Use when the user invokes author-deck or explicitly asks to create, revise, or complete a HACP deck contract.
---

# 🗃️ HACP Author Deck

**Use when:** A HACP deck needs to be created or authored against an existing
deck or repository.
**Default binding:** The optional semantic target, then the current deck
subject. With neither, author a new deck from the user's stated purpose.
**Accepts:** Human content or any HACP result that contains a deck intention,
contract, repository, manifest, or reference.
**Effect:** Resolve the target when present, recover existing conventions, and
author the smallest self-contained deck that serves one clear purpose.
**Result:** A `hacp/deck-definition` delivered in the surface the user
requested: chat, document, or repository.
**Duration:** One agent turn.
**Limits:** Do not invent a target parser, silently choose among ambiguous
targets, scaffold speculative components, or treat invocation as permission to
write files. Do not make the canonical HACP plugin a runtime dependency.

## Authoring contract

1. Treat the text following the invocation as a semantic target, not typed
   arguments. Resolve a URL, path, name, slug, manifest, or available Working
   Object with the current tools and context.
2. If the explicit target is ambiguous, ask one focused question. If it cannot
   be resolved, return `blocked` and name the missing target. With no target,
   author a new deck.
3. Preserve an existing deck's identifiers and conventions unless the user
   explicitly requests a migration.
4. Define one purpose, a deck-local mental model, a minimal shared resolver,
   narrow card contracts, a help utility, `hacp.deck.json`, provider manifests,
   installation instructions, and only the README material users need.
   Name support skills `deck` and `help` (`resolver` for the canonical HACP
   plugin) and exclude them from the card manifest.
5. Keep every card self-contained with one primary effect. Use exact slugs for
   closed relations and traits, result families, or annotations for open
   compatibility. Use the deck slug as provider namespace, each card slug as
   its skill folder/name and manifest command, and `Deck · Card` for Codex
   display labels.
6. When repository output is already authorized, author and validate the
   required files in place. Otherwise return the complete deck definition in
   chat.

## Format

Begin the complete combo trace with
`> 🎯 **<target or new deck>** → 🗃️ **AUTHOR DECK**`.

Return the smallest complete artifact. Do not add runtime, storage, transport,
or permission machinery unless the user explicitly asks for it.
