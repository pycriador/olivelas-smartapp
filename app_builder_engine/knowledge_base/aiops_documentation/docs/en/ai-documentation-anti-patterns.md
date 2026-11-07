# AI Documentation Anti-Patterns

> Language: EN | [Português (pt-BR)](../pt-BR/ai-documentation-anti-patterns.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Common failure modes when making documentation “AI-ready”.

| Anti-pattern | Why it hurts | Do instead |
| --- | --- | --- |
| Dumping entire docs into every prompt | Noise, contradictions, secret risk | Progressive context packs |
| Treating chat output as SoT | Unverified claims spread | Classify + cite evidence |
| Inferred stated as fact | False confidence | Label Inferred |
| Inventing architecture styles | Misleading structure | Unknown until evidenced |
| Secret values in examples | Security incident | `[REDACTED]` / placeholders |
| Auto-ACCEPT by AI | Breaks governance | Human lifecycle |
| Ignoring drift siblings | Partial remediation | Link architecture/contract/ops/security drift |
| Building RAG in the standard | Out of scope | search-readiness only |
| One mega-doc for all types | Unnavigable | Typed docs + graph |
| Translating status tokens | Breaks machines | Keep English tokens |
| Deleting contradictions | Hidden risk | Contradiction register |
| Equating confidence with ACCEPTED | Category error | Separate models |
| Component = service assumed | Wrong impact analysis | Distinct registries |
| Freshness by date only | False stale/fresh calls | Evidence comparison |

## Related Documents

- [ai-generation-guidelines.md](ai-generation-guidelines.md)
- [ai-ready-checklist.md](ai-ready-checklist.md)
- [ai-documentation.md](ai-documentation.md)
