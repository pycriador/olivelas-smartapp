# Ciclo de Vida de Contrato

> Language: pt-BR | [English](../en/contract-lifecycle.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Contratos usam o **mesmo ciclo de vida de documentação** do restante deste padrão. **Não há ciclo de vida paralelo incompatível**.

```text
DRAFT → REVIEW → ACCEPTED → DEPRECATED → ARCHIVED
```

Regras completas: [lifecycle.md](lifecycle.md), [status.md](status.md).

## Significados de status para contratos

| Status | Meaning for contracts |
| --- | --- |
| `DRAFT` | Contrato sendo escrito; não pronto para dependência de integração |
| `REVIEW` | Pronto para revisão ou em revisão contra evidência e consumers/producers |
| `ACCEPTED` | Contrato atual aprovado para a versão declarada |
| `DEPRECATED` | Ainda visível; substituído ou não mais recomendado para uso novo |
| `ARCHIVED` | Apenas histórico; não é orientação ativa de integração |

`UPDATED` não é um status armazenado. Mudanças materiais seguem `ACCEPTED → REVIEW → ACCEPTED`.

## Atividades do ciclo de vida

### Create

1. Identifique a fronteira e os participantes ([contract-model.md](contract-model.md)).
2. Escolha o(s) tipo(s) ([contract-types.md](contract-types.md)).
3. Redija usando [templates/contract.md](templates/contract.md) (seções conforme aplicável).
4. Defina `status: DRAFT`, owner e links iniciais de evidência.
5. Marque unknowns; não invente campos ou garantias.

### Review

1. Mova para `REVIEW` quando a estrutura for avaliável.
2. Revise contra código/schema/testes/consumers/producers ([review-policy.md](review-policy.md)).
3. Verifique schema, semantics, errors, retry, idempotency, versioning conforme aplicável ([contract-checklist.md](contract-checklist.md)).
4. Volte para `DRAFT` se lacunas materiais permanecerem.

### Approve

1. Em revisão bem-sucedida, defina `ACCEPTED`.
2. Garanta descobribilidade (índice de contracts / links de arquitetura e componentes).
3. Confirme que Source of Truth está declarada ([contract-source-of-truth.md](contract-source-of-truth.md)).

### Mudança

1. Avalie o impacto com [contract-change-management.md](contract-change-management.md).
2. Para contratos `ACCEPTED` materiais: `ACCEPTED → REVIEW → ACCEPTED`.
3. Atualize producers, consumers, testes e docs relacionados de forma coordenada quando necessário.

### Version

1. Aplique [contract-versioning.md](contract-versioning.md) e [contract-compatibility.md](contract-compatibility.md).
2. Breaking changes tipicamente introduzem uma nova identidade de versão de contrato.
3. Mantenha versões anteriores no ciclo de vida até deprecated/archived.

### Deprecate

1. Siga [deprecation.md](deprecation.md) e [breaking-changes.md](breaking-changes.md).
2. Defina `DEPRECATED`, `replaced_by`, `deprecated_on`, `deprecation_reason`.
3. Comunique a janela de migração aos owners dos participantes ([contract-ownership.md](contract-ownership.md)).

### Archive

1. Quando não restar uso operacional, mova para `ARCHIVED` ([archive-policy.md](archive-policy.md)).
2. Preserve para histórico; não apresente como orientação atual de integração.

## Alinhamento de governança

Contratos também seguem políticas de ownership, review, change, debt e stale-doc das lifecycle governance. Não invente tokens de status alternativos para contratos.

## Documentos relacionados

- [lifecycle.md](lifecycle.md)
- [contract-ownership.md](contract-ownership.md)
- [contract-change-management.md](contract-change-management.md)
- [contract-versioning.md](contract-versioning.md)
- [deprecation.md](deprecation.md)
- [archive-policy.md](archive-policy.md)
