# Drift de Contrato

> Language: pt-BR | [English](../en/contract-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

**Contract drift** é o gap entre o contrato documentado (ou declarado em schema) e o acordo real de runtime.

```text
Documented Contract
        ≠
Actual Contract
```

Conceitos relacionados: [architecture-drift.md](architecture-drift.md), [stale-documentation.md](stale-documentation.md), [contract-source-of-truth.md](contract-source-of-truth.md).

## Sinais

| Signal | Example |
| --- | --- |
| Divergent schema | Código emite campos que não estão no schema/doc |
| Documented field missing | Doc lista `discount`; runtime nunca envia |
| Undocumented required field | Runtime exige `tenant_id`; docs omitem |
| Different behavior | Retry ou tratamento de erro difere da doc |
| Different errors | Novas identidades de erro não documentadas |
| Wrong version | Clients chamam semântica `@v1` enquanto o producer enviou comportamento `@v2` sob o id antigo |
| Producer/consumer divergence | Producer e consumer codificam premissas incompatíveis |

## Como registrar

Quando drift for encontrado:

1. **Classify impact** — cosmético vs quebra de integração vs sensível a segurança.
2. **Record** — follow-up de review, issue ou item de debt com evidência (path de código, amostra de payload, teste).
3. **Assign owner** — geralmente o contract owner coordenando com producer/consumer owners ([contract-ownership.md](contract-ownership.md)).
4. **Não "corrija" docs inventando** um contrato desejado como estado atual.

Campos sugeridos:

| Campo | Significado |
| --- | --- |
| **ID** | Opcional (`CDRIFT-003`) |
| **Documented** | O que docs/schema afirmam |
| **Actual** | O que o runtime faz (com evidência) |
| **Impact** | Quem quebra ou é induzido a erro |
| **Owner** | Quem reconcilia |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

## Como tratar

| Finding | Action |
| --- | --- |
| Docs/schema wrong, runtime correct | Atualize docs/schema do contrato; ciclo de vida `ACCEPTED → REVIEW → ACCEPTED` quando material |
| Runtime wrong vs accepted contract | Corrija a implementação **ou** revise deliberadamente o contrato via change management |
| Both evolving | Coordene versão, migration, testes e docs |
| Temporary gap | Registre [contract debt](contract-debt.md) ou documentation debt; não marque Confirmed |

## O que este padrão não exige

Nenhum bot de drift obrigatório ou tooling contínuo de verificação nesta versão. Projetos podem adicionar automação depois sem mudar estas definições.

## Documentos relacionados

- [contract-debt.md](contract-debt.md)
- [contract-source-of-truth.md](contract-source-of-truth.md)
- [contract-change-management.md](contract-change-management.md)
- [architecture-drift.md](architecture-drift.md)
