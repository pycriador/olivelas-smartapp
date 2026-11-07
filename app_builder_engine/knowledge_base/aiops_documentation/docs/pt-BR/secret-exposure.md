# Exposição de Secrets

> Language: pt-BR | [English](../en/secret-exposure.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **response quando um secret pode ter sido exposto**.

Este é um caminho de response especializado em segurança que se integra com [incident-management.md](incident-management.md) e [operations-model.md](operations-model.md). Não invente um time ou tooling que não exista.

**Nunca escreva o valor do secret exposto na documentação, tickets espelhados em docs ou write-ups pós-incident.** Refira por secret name e incident id.

## Propósito

Fornecer uma cadeia clara de discovery a learning:

```text
Detection → Triage → Containment → Rotation / Revocation → Impact Assessment → Eradication → Recovery → Communication → Root Cause → Corrective Actions → Review
```

Stages podem colapsar em projetos pequenos; nomeie os stages que você realmente executa.

## Orientação por stage

| Stage | Question | Notes |
| --- | --- | --- |
| **Detection** | Como ficamos sabendo da exposure? | Scanners, report humano, notice do provider, alerts de redaction de log — link [monitoring.md](monitoring.md) quando aplicável |
| **Triage** | É real, qual secret, quais environments? | Classifique confidence; atribua [security-ownership.md](security-ownership.md) / incident owner |
| **Containment** | Como paramos uso adicional? | Disable endpoints, block keys no provider, restrict network — conforme capabilities reais |
| **Rotation / Revocation** | Como invalidamos o secret? | Rotate name/version; atualize consumers via canais seguros — [secrets-management.md](secrets-management.md) |
| **Impact assessment** | O que poderia ter sido acessado? | Assets, time window, actors — Unknown é permitido |
| **Eradication** | Cópias foram removidas dos stores que controlamos? | Repos, CI logs, images — siga o processo do projeto; rewrite de history é last resort e precisa de decisão humana explícita |
| **Recovery** | Quando o service está de volta com segurança? | Confirme novo secret em uso; remova blocks de emergência quando seguro |
| **Communication** | Quem deve ser informado? | Owners, consumers afetados — sem valores secretos em canais que viram docs duráveis |
| **Root cause** | Por que foi exposto? | Link padrões de [root-cause-analysis.md](root-cause-analysis.md); evite teatro de blame |
| **Corrective actions** | O que previne recorrência? | [corrective-actions.md](corrective-actions.md) |
| **Review** | O que aprendemos? | [post-incident-review.md](post-incident-review.md) quando o projeto usa PIR |

## Campos sugeridos de incident

| Campo | Significado |
| --- | --- |
| **Incident id** | Conforme esquema do projeto |
| **Secret name(s)** | Só names |
| **Detection time / method** | Fatos |
| **Environments** | Afetados |
| **Containment / rotation actions** | Fatos — sem valores |
| **Impact** | Confirmed / Inferred / Unknown |
| **Root cause summary** | Quando conhecido |
| **Corrective actions** | Links |
| **Owner** | Incident / security owner |

## Integração com Operações

| Situation | Guidance |
| --- | --- |
| Exposure causa outage | Incident dual operacional + segurança — siga severity de ops |
| Exposure sem user impact | Ainda faça triage; pode ser security-primary |
| Incerto se o secret era real | Mantenha Unknown; prefira rotation quando o risk justificar |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Quem contatar, passos de rotate por secret name, onde não colar valores |
| Medium | Checklist de stages + linkage ao processo de incident |
| Large | Handling de evidence, notification de consumers, expectativa de PIR |

## Anti-Patterns

- Colar o secret no incident doc “para tracking.”
- Rotacionar sem identificar consumers (causa breakage silencioso).
- Fechar como “done” sem root cause quando a causa é cognoscível.
- Afirmar que git history está limpa quando o secret permanece em commits antigos — trate history como compromised até rotacionar.

## Documentos relacionados

- [secrets-management.md](secrets-management.md)
- [incident-management.md](incident-management.md)
- [root-cause-analysis.md](root-cause-analysis.md)
- [corrective-actions.md](corrective-actions.md)
- [post-incident-review.md](post-incident-review.md)
- [secure-logging.md](secure-logging.md)
