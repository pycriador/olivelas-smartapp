# Contratos

> Language: pt-BR | [English (EN)](../../en/contracts/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Categoria para documentação de interfaces e contratos em projetos em adoção, além da metodologia de contratos técnicos definida por este padrão.

## Objetivo

Documentar APIs, eventos, mensagens, arquivos, comandos, bibliotecas, dados e outros contratos como fronteiras canônicas e verificáveis entre participantes.

Um contrato técnico responde: *Como uma parte do sistema espera interagir com outra?*

## Integração com arquitetura

```text
Architecture
      │
      ├── Component
      │
      └── Contract
             │
             ├── Producer
             └── Consumer
```

Docs de arquitetura descrevem estrutura e relacionamentos; contratos guardam o acordo detalhado e verificável da interface. Prefira links de arquitetura/componentes para contratos em vez de copiar schemas na prosa de arquitetura.

Veja [../architecture-model.md](../architecture-model.md) (nível Interfaces) e [../contract-model.md](../contract-model.md).

## Orientação

- Não assuma HTTP, Kafka, JSON ou qualquer protocolo ou formato específico.
- Um documento canônico por contrato (ou família de contratos versionada).
- Outros docs devem linkar aqui em vez de copiar schemas.
- Inclua expectativas de compatibility, versioning, retry, idempotency e delivery quando aplicável.
- Use o ciclo de vida compartilhado: `DRAFT` → `REVIEW` → `ACCEPTED` → `DEPRECATED` → `ARCHIVED` — sem sistema paralelo de status.
- Classifique afirmações incertas (`Confirmed` / `Inferred` / `Unknown` / `Proposed`).

## Metodologia (Documentation Standard)

### Modelo e tipos

| Documento | Propósito |
| --- | --- |
| [../contract-model.md](../contract-model.md) | Contrato como fronteira; participantes (Producer/Consumer/Provider/Client/Sender/Receiver) |
| [../contract-types.md](../contract-types.md) | API, Event, Message, File, Command, Callback, Library, Data, Integration |

### Schema e significado

| Documento | Propósito |
| --- | --- |
| [../schema-documentation.md](../schema-documentation.md) | Tabelas de campos; estrutura com descrição semântica obrigatória |
| [../semantic-contracts.md](../semantic-contracts.md) | Contratos estruturais vs semânticos |
| [../contract-validation.md](../contract-validation.md) | Categorias de validação; estrutural vs de negócio |

### Comportamento

| Documento | Propósito |
| --- | --- |
| [../retry-policy.md](../retry-policy.md) | Quando retentar; contagens; backoff; exhaustion |
| [../idempotency.md](../idempotency.md) | Perguntas de idempotency; "not guaranteed" quando Unknown |
| [../delivery-semantics.md](../delivery-semantics.md) | at-most-once, at-least-once, exactly-once, best effort; sync/async |
| [../ordering.md](../ordering.md) | Ordering global/key/entity/none/parallel |
| [../timing-contract.md](../timing-contract.md) | Timeout vs business deadline vs processing duration |

### Evolução e governança

| Documento | Propósito |
| --- | --- |
| [../contract-versioning.md](../contract-versioning.md) | Breaking/non-breaking/additive/removal/deprecation/migration |
| [../contract-compatibility.md](../contract-compatibility.md) | Backward, forward, breaking; análise producer+consumer |
| [../contract-lifecycle.md](../contract-lifecycle.md) | Ciclo de vida integrado aos statuses de documentação |
| [../contract-ownership.md](../contract-ownership.md) | Owners de contrato, producer e consumer; responsabilidade compartilhada |
| [../contract-change-management.md](../contract-change-management.md) | Nove pontos de avaliação para mudanças |
| [../breaking-changes.md](../breaking-changes.md) | Caracterizar, comunicar, versionar, migrar, depreciar |

### Orientação por tipo

| Documento | Propósito |
| --- | --- |
| [../api-contracts.md](../api-contracts.md) | Orientação de API sem tornar HTTP obrigatório |
| [../event-contracts.md](../event-contracts.md) | Campos de evento; Event vs Command |
| [../message-contracts.md](../message-contracts.md) | Campos de mensagem; mecanismos heterogêneos |
| [../file-contracts.md](../file-contracts.md) | Integrações por arquivo; agnóstico de formato |

### Qualidade, verdade e verificação

| Documento | Propósito |
| --- | --- |
| [../contract-testing.md](../contract-testing.md) | Verificação conceitual producer/consumer/schema/compatibility/integration |
| [../contract-source-of-truth.md](../contract-source-of-truth.md) | Documentation/Schema/Spec/Code/Generated; evitar Doc≠Schema≠Impl |
| [../contract-drift.md](../contract-drift.md) | Documentado ≠ real; sinais e tratamento |
| [../contract-debt.md](../contract-debt.md) | Dívida de contrato vs documentação vs técnica |
| [../contract-checklist.md](../contract-checklist.md) | Checklist de qualidade |
| [../quality-model.md](../quality-model.md) | Inclui dimensões de qualidade de contrato |

## Templates

| Template | Propósito |
| --- | --- |
| [../templates/contract.md](../templates/contract.md) | Template primário de documento de contrato |
| [../templates/integration.md](../templates/integration.md) | Visão geral de integração quando for mais ampla que um único contrato |

## Conteúdos sugeridos no projeto

| Documento | Propósito |
| --- | --- |
| Um arquivo por contrato (ou família versionada) | Acordo canônico |
| Links de components / architecture | Descobribilidade sem duplicação |
| Artefatos de schema (quando usados) | Estrutura legível por máquina; declare Source of Truth |

## Documentos relacionados

- [../standards.md](../standards.md) — naming, IDs, metadados de contrato
- [../lifecycle.md](../lifecycle.md)
- [../ownership.md](../ownership.md)
- [../architecture/README.md](../architecture/README.md)
