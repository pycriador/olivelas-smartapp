# Evidence de Segurança

> Language: pt-BR | [English](../en/security-evidence.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar **evidence** de que security requirements e controls são atendidos — sem armazenar secrets ou dados sensíveis desnecessários.

Evidence sustenta afirmações Confirmed na documentação de segurança ([standards.md](standards.md)). Prefira links e identifiers a cópias de material sensível bruto.

## O que conta como evidence

| Kind | Examples (conceptual) |
| --- | --- |
| **Configuration** | Settings nomeados, policy files, referências de IaC (sem valores secretos) |
| **Test results** | Registros de security test, outcomes de checks de pipeline — [security-testing.md](security-testing.md) |
| **Reviews** | Data de review do threat model, review de control, approval de exception |
| **Operational signals** | Definições de alert, inventário de monitor — não dumps brutos de PII |
| **Audit / access records** | Existência e localização de audit trails — [auditability.md](auditability.md) |
| **Incident / vulnerability records** | IDs e outcomes |

Marque evidence **Unknown** quando uma afirmação não puder ser substantiated. Não invente tickets, screenshots ou certificações.

## Princípios de Evidence Integrity

Documente e preserve a integrity de evidence relevante de segurança:

| Principle | Meaning |
| --- | --- |
| **Authenticity** | Evidence vem de uma fonte identificável e autorizada |
| **Integrity** | Evidence é protegida contra alteração não detectada onde o projeto exige |
| **Completeness** | Lacunas materiais são marcadas; não selecione só provas lisonjeiras |
| **Rastreabilidade** | Evidence linka ao control, requirement, risk ou incident que sustenta |
| **Retention honesty** | Retention é Defined, **Not Defined** ou N/A — nunca invente legal holds |
| **Least exposure** | Prefira referências a cópias; nunca embuta valores secretos; minimize PII |
| **Timeliness** | Note quando a evidence foi coletada; evidence stale pode virar [security drift](security-drift.md) |

Projetos escolhem mecanismos (hashing, WORM storage, access control). Este padrão não manda uma tool.

## O que documentar por item de evidence

| Campo | Significado |
| --- | --- |
| **ID** | Id estável de evidence quando útil ([standards.md](standards.md)) |
| **Supports** | ID de requirement / control / risk / incident / vulnerability |
| **Kind** | Config / test / review / signal / audit / other |
| **Location** | Onde encontrar (path, nome do sistema, ticket) — não o secret |
| **Collected** | Data ou período |
| **Owner** | Quem pode produzir ou interpretar |
| **Integrity notes** | Como a integrity é protegida, ou **Not Defined** |
| **Classification** | Confirmed / Inferred / Unknown / Proposed |

## Naming

Prefira nomes estáveis e scannable:

```text
EVD-<short-topic>-<YYYYMMDD>
```

Exemplo: `EVD-authn-review-20260807`. Projetos podem adaptar.

## Regras

- Documentação **não é** um secret store — [secrets-management.md](secrets-management.md).
- Logs usados como evidence devem seguir [secure-logging.md](secure-logging.md).
- “Evidence” gerada por IA sem fonte real é inválida — marque Proposed ou descarte ([ai-documentation.md](ai-documentation.md)).
- Prefira evidence Confirmed antes de aceitar security docs como `ACCEPTED`.

## Documentos relacionados

- [security-model.md](security-model.md)
- [security-controls.md](security-controls.md)
- [security-requirements.md](security-requirements.md)
- [security-testing.md](security-testing.md)
- [security-incidents.md](security-incidents.md)
- [auditability.md](auditability.md)
- [standards.md](standards.md)
