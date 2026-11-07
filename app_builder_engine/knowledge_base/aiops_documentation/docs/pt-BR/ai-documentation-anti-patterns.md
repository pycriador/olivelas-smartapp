# Anti-padrões de documentação com IA

> Language: pt-BR | [English](../en/ai-documentation-anti-patterns.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Modos comuns de falha ao tornar a documentação “AI-ready”.

| Anti-pattern | Why it hurts | Do instead |
| --- | --- | --- |
| Dumping entire docs into every prompt | Ruído, contradições, risco de secrets | Progressive context packs |
| Treating chat output as SoT | Claims não verificados se espalham | Classify + cite evidence |
| Inferred stated as fact | Falsa confidence | Label Inferred |
| Inventing architecture styles | Estrutura enganosa | Unknown until evidenced |
| Secret values in examples | Incidente de segurança | `[REDACTED]` / placeholders |
| Auto-ACCEPT by AI | Quebra governança | Human lifecycle |
| Ignoring drift siblings | Remediação parcial | Link architecture/contract/ops/security drift |
| Building RAG in the standard | Fora do escopo | search-readiness only |
| One mega-doc for all types | Innavegável | Typed docs + graph |
| Translating status tokens | Quebra máquinas | Keep English tokens |
| Deleting contradictions | Risco oculto | Contradiction register |
| Equating confidence with ACCEPTED | Erro de categoria | Separate models |
| Component = service assumed | Análise de impacto errada | Distinct registries |
| Frescor by date only | Chamadas falsas de stale/fresh | Evidence comparison |

## Documentos relacionados

- [ai-generation-guidelines.md](ai-generation-guidelines.md)
- [ai-ready-checklist.md](ai-ready-checklist.md)
- [ai-documentation.md](ai-documentation.md)

