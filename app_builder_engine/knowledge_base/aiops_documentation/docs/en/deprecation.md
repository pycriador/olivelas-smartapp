# Deprecation Policy

> Language: EN | [Português (pt-BR)](../pt-BR/deprecation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Deprecation marks a document as no longer primary without immediately destroying history.

## When to Deprecate

Deprecate when:

- a newer document replaces this one;
- the design or interface is no longer recommended;
- the document would mislead if treated as current guidance;
- you need a migration window before archive.

Prefer deprecation over silent edits that erase the fact that a previous contract or architecture existed.

## Required Markers

Every deprecated document must include:

| Marker | Meaning |
| --- | --- |
| **Status** | `DEPRECATED` (YAML `status` preferred, or blockquote) |
| **Replaced by** | Link or path to the successor document (or explicit `None` with reason) |
| **Deprecated on** | ISO date `YYYY-MM-DD` |
| **Reason** | Short explanation of why it is deprecated |

YAML example:

```yaml
---
title: Legacy Order Events
status: DEPRECATED
owner: checkout-squad
updated: 2026-08-07
replaced_by: docs/contracts/order-updated.md
deprecated_on: 2026-08-07
deprecation_reason: Replaced by order-updated@v2 contract
---
```

Visible callout near the top (recommended even when YAML exists):

```markdown
> Status: DEPRECATED
>
> Replaced by: [order-updated.md](../contracts/order-updated.md)
> Deprecated on: 2026-08-07
> Reason: Replaced by order-updated@v2 contract
```

## How to Deprecate

1. Ensure a successor exists or explicitly document that there is none.
2. Set status to `DEPRECATED` with all required markers.
3. Update inbound links from active docs to point to the replacement.
4. Leave the deprecated file readable — do not gut content on day one.
5. Communicate in the change that introduced the replacement (PR summary; changelog when useful — [changelog-policy.md](changelog-policy.md)).

## Keep — Do Not Delete Immediately

Deprecated docs:

- preserve migration context;
- prevent broken historical links;
- help AI and humans understand what changed.

Deletion is not the first step. Archive later when operational use is gone.

## When to Archive

Move from `DEPRECATED` to `ARCHIVED` when:

- no operational procedures depend on the document;
- consumers have migrated;
- the file is retained only for history.

Follow [archive-policy.md](archive-policy.md).

## Related Documents

- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [archive-policy.md](archive-policy.md)
- [standards.md](standards.md)
