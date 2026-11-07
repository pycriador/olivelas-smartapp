# Controls de Segurança

> Language: pt-BR | [English](../en/security-controls.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como projetos em adoção documentam **medidas que enforce requirements ou reduzem risk**.

Controls implementam [security-requirements.md](security-requirements.md). Prefira descrever *intent e placement* do control a listas de features de vendor. Escolhas de tecnologia podem aparecer como evidence, não como substituto do statement do control.

## Tipos de control

| Type | Meaning | Example intent (illustrative) |
| --- | --- | --- |
| **Preventive** | Impede que um evento ruim ocorra | Deny ação não autorizada; encrypt channel; block admin anônimo |
| **Detective** | Revela que algo indesejável ocorreu ou está ocorrendo | Alert no uso de privilege; sinal de falha de integrity check |
| **Corrective** | Limita dano ou restaura estado seguro após um evento | Revoke credentials; isolate component; rotate secret |
| **Compensating** | Substitui parcialmente quando um control preferido está ausente ou fraco | Monitoring extra enquanto um fix de design está pendente — deve declarar residual risk |

Um único mecanismo pode servir a mais de um tipo. Registre o tipo primário e note os outros quando útil.

## Registro sugerido de control

| Campo | Significado |
| --- | --- |
| **ID** | Id curto e estável |
| **Name** | Label curto |
| **Type** | Preventive / Detective / Corrective / Compensating |
| **Requirement(s)** | Links |
| **Description** | O que faz, onde fica (trust boundary / component) |
| **Owner** | Technical ou security owner |
| **Evidence** | Como a effectiveness é mostrada |
| **Monitoring** | Sinais relacionados — link docs de ops |
| **Status** | active / planned / exception / Not Defined |
| **Certainty** | Confirmed / Inferred / Unknown / Proposed |

## Inventário sugerido

| ID | Name | Type | Requirements | Owner | Evidence | Status | Certainty |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

## Orientação de mapping

```text
Requirement → Control(s) → Evidence → Monitoring → Response
```

| Gap | Documentation action |
| --- | --- |
| Requirement sem control | Registre como open risk ou exception |
| Control sem requirement | Ou adicione o requirement ou remova/clareie o control |
| Control sem evidence | Marque certainty Inferred/Unknown; não afirme Confirmed |
| Só compensating | Documente residual risk e expiration/review |

## Integração

| Area | Link |
| --- | --- |
| Trust boundary crossings | [trust-boundaries.md](trust-boundaries.md) |
| Identity controls | [identity.md](identity.md), [authentication.md](authentication.md), [authorization.md](authorization.md) |
| Data / crypto | [encryption.md](encryption.md), [key-management.md](key-management.md), [data-security.md](data-security.md) |
| Detect / respond | [monitoring.md](monitoring.md), [incident-management.md](incident-management.md) |
| Placement na arquitetura | [security-architecture.md](security-architecture.md) — evite duplicar diagramas |

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Nomeie os poucos controls que guardam o edge e secrets |
| Medium | Inventário por tipo com links de requirement |
| Large | Evidence e hooks de monitoring; compensating controls com datas de review |

## Anti-Patterns

- Listar tools sem declarar o intent do control.
- Marcar controls planned como active.
- Compensating controls sem residual risk e sem owner.
- Duplicar runbooks completos de ops dentro do catálogo de controls.

## Documentos relacionados

- [security-model.md](security-model.md)
- [security-requirements.md](security-requirements.md)
- [security-risk-model.md](security-risk-model.md)
- [threat-modeling.md](threat-modeling.md)
- [auditability.md](auditability.md)
