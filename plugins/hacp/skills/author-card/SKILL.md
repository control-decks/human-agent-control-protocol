---
name: author-card
description: Author a new or existing HACP-compatible card from an optional semantic target such as a URL, path, name, slug, manifest, or Working Object.
disable-model-invocation: true
---

# HACP Author Card

**ID:** `hacp/author-card`\
**HACP:** `0.4`\
**Kind:** `operation`\
**Mode:** `artifact`\
**Traits:** `authoring`, `artifact`\
**Default Binding:** Optional semantic target, current card subject, then the
human's stated behavior\
**Accepts:** `hacp/content`, `hacp/result`\
**Requires:** `hacp/authoring-intent`; missing detail may resolve as a focused
`pending` clarification\
**Produces:** `hacp/card-definition`\
**Duration:** `once`

**Effect:** Resolve an optional semantic target, recover applicable
conventions, and author one complete standalone card with one primary effect in
the requested chat, document, or repository surface.

**Limits:** Treat a URL, path, name, slug, manifest, or Working Object as a
semantic target, never typed arguments. Ask once when a target is ambiguous;
return `blocked` when an explicit target remains unavailable. Invocation alone
never grants write authority or expands the requested artifact.

## Author

1. Preserve an existing canonical identifier unless the human requests a
   migration. With no target, author a new card from the requested behavior.
2. Define `ID`, `HACP`, `Kind`, `Mode`, `Traits`, `Default Binding`, `Accepts`,
   optional `Requires`, `Produces`, `Duration`, `Effect`, and `Limits`. Add
   `Format` or `Flow` only when the feature requires it.
3. Make the provider projection human-only: local folder, skill `name`, and
   manifest `command` use the card slug; Codex shows `Deck · Card` and disables
   implicit invocation; Claude disables model invocation.
4. Keep cross-deck compatibility open through kinds, predicates, traits, and
   annotation traits. Never reference a foreign card identifier.
5. When repository output is authorized, change only the card, manifest,
   provider metadata, help, and user documentation needed for usability.

Begin the combo trace with
`> 🎯 **<target or new card>** → 🃏 **AUTHOR CARD**` and return the smallest
complete artifact.
