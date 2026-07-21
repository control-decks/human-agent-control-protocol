---
name: author-deck
description: Author a new or existing HACP-compatible deck from an optional semantic target such as a URL, path, name, slug, manifest, or Working Object.
disable-model-invocation: true
---

# HACP Author Deck

**ID:** `hacp/author-deck`\
**HACP:** `0.4`\
**Kind:** `operation`\
**Mode:** `artifact`\
**Traits:** `authoring`, `artifact`\
**Default Binding:** Optional semantic target, current deck subject, then the
human's stated purpose\
**Accepts:** `hacp/content`, `hacp/result`\
**Requires:** `hacp/authoring-intent`; missing detail may resolve as a focused
`pending` clarification\
**Produces:** `hacp/deck-definition`\
**Duration:** `once`

**Effect:** Resolve an optional semantic target, recover applicable
conventions, and author the smallest coherent deck in the requested chat,
document, or repository surface.

**Limits:** Treat a URL, path, name, slug, manifest, or Working Object as a
semantic target, never typed arguments. Ask once when a target is ambiguous;
return `blocked` when an explicit target remains unavailable. Invocation alone
never grants write authority. Do not add speculative runtime, storage,
transport, or permission machinery.

## Author

1. Preserve existing identifiers unless the human requests a migration. With
   no target, start from one clear deck purpose.
2. Define a namespace, standalone cards, `hacp.deck.json`, provider manifests,
   installation instructions, and the smallest useful README. Add `help` or a
   mental model only when users or cards need it.
3. Never create a root resolver skill. Full conformance comes from a compatible
   HACP session adapter.
4. Make every card human-only and keep one primary effect. Use exact card IDs
   only for indispensable same-deck mechanics; use open interfaces for all
   other compatibility.
5. When repository output is authorized, author and validate only the files
   required to make the deck usable.

Begin the combo trace with
`> 🎯 **<target or new deck>** → 🗃️ **AUTHOR DECK**` and return the smallest
complete artifact.
