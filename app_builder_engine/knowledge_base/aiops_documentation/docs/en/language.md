# Documentation Language Policy

> Language: EN | [Português (pt-BR)](../pt-BR/language.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Bilingual policy for this standard: every normative and guidance document must exist in English (EN) and Brazilian Portuguese (pt-BR).

## Rules

1. **Dual-language existence**  
   Every document in this standard must exist in EN and pt-BR.

2. **Mirrored tree**  
   Use identical relative paths under `docs/en/...` and `docs/pt-BR/...`.

3. **Examples**  
   Fictional examples follow the same mirroring: `examples/<name>/en/...` and `examples/<name>/pt-BR/...`.

4. **Root README and CONTRIBUTING**  
   The root README and CONTRIBUTING must have EN and pt-BR versions:
   - `README.md` + `README.pt-BR.md`
   - `CONTRIBUTING.md` + `CONTRIBUTING.pt-BR.md`

5. **Machine tokens stay in English**  
   Status (`DRAFT`, `REVIEW`, `ACCEPTED`, `DEPRECATED`, `ARCHIVED`), Classification (`Confirmed`, `Inferred`, `Unknown`, `Proposed`), observability status (`Implemented`, `Partial`, `Not Applicable`, `Not Documented`), and technical identifiers (`ADR-XXX`, contract IDs) are not translated.

6. **Bilingual updates in the same PR**  
   Whenever possible, update both languages in the same pull request.

7. **Lagging translation**  
   If one language lags behind the other, mark at the top of the document:

   ```markdown
   > Translation status: pending
   ```

8. **Cross-language links**  
   Cross-language links are mandatory at the top of each document, for example:

   ```markdown
   > Language: EN | [Português (pt-BR)](../pt-BR/standards.md)
   ```

   ```markdown
   > Language: pt-BR | [English](../en/standards.md)
   ```

9. **What is not translated**  
   Code, file names, paths, endpoints, technical identifiers, and template filenames in `kebab-case` are not translated.

10. **What is translated**  
    Narrative content, explanatory tables, guides, and Mermaid diagram labels (when part of the narrative) are translated.

## Scope

This policy applies to:

- standard documents under `docs/en/` and `docs/pt-BR/`;
- examples under `examples/`;
- repository entry files at the root (`README`, `CONTRIBUTING`).

It does not require adopting projects to publish bilingual documentation unless they explicitly adopt this policy.

## Partial bilingual policy for adopting projects (optional)

Adopting projects that choose bilingual docs may use **progressive translation** without violating this standard:

| Depth | Expectation | Marking |
| --- | --- | --- |
| Day 0 hubs (`project-overview`, `ai-context`, category READMEs) | Prefer full translation when bilingual is adopted | — |
| Deep technical inventories (large route tables, full schemas) | May keep a technical body in EN with mirrored path | Add `Translation status: partial` under the language line |
| Archive / DEPRECATED | Mirror path; translation optional | `status: DEPRECATED` |

Rules:

1. Paths stay mirrored (`docs/en/...` ↔ `docs/pt-BR/...`) when the project is bilingual.
2. Never leave a path missing in one language without an explicit stub that links to the other language and states `Translation status: pending` or `partial`.
3. Machine tokens (`Confirmed`, `ACCEPTED`, IDs) stay in English.
4. This section is **guidance for adopters**. The standard repository itself continues to require full EN + pt-BR for its normative documents.

## Related Documents

- [README.md](README.md)
- [standards.md](standards.md)
- [versioning.md](versioning.md)
- [documentation-checklist.md](documentation-checklist.md)
- [flat-docs-migration.md](flat-docs-migration.md)
- [adoption-path.md](adoption-path.md)
