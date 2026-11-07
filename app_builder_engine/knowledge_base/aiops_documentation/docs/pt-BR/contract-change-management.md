# Gestão de Mudanças de Contrato

> Language: pt-BR | [English](../en/contract-change-management.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como avaliar uma mudança proposta a um contrato técnico antes de ela entrar.

Qualquer mudança material de contrato deve avaliar estes **nove pontos**:

## Nove pontos de avaliação

| # | Point | Question |
| --- | --- | --- |
| 1 | **Existing consumers** | Quem consome hoje? Quais premissas eles codificam? |
| 2 | **Existing producers** | Quem produz hoje? Conseguem emitir/aceitar a nova forma? |
| 3 | **Compatibility** | Backward / forward / breaking? ([contract-compatibility.md](contract-compatibility.md)) |
| 4 | **Impact** | Raio de explosão: falha de runtime, drift semântico silencioso, carga de ops |
| 5 | **Versioning** | Mesma versão, minor bump ou novo major/contract id? ([contract-versioning.md](contract-versioning.md)) |
| 6 | **Migration** | Como os participantes migram? Dual-run? Feature flag? Data de cutover? |
| 7 | **Documentation** | Doc do contrato, links de arquitetura, runbooks, exemplos atualizados? |
| 8 | **Tests** | Checagens producer/consumer/schema/compatibility atualizadas? ([contract-testing.md](contract-testing.md)) |
| 9 | **Deprecation** | O comportamento antigo está deprecated com janela e `replaced_by`? |

Pule um ponto apenas quando claramente Not Applicable — e diga por quê.

## Processo leve

1. Descreva a mudança pretendida e classifique-a (additive / removal / semantic / …).
2. Percorra os nove pontos; registre Unknowns.
3. Envolva owners conforme [contract-ownership.md](contract-ownership.md).
4. Aplique o ciclo de vida: contratos `ACCEPTED` materiais vão `ACCEPTED → REVIEW → ACCEPTED` ([contract-lifecycle.md](contract-lifecycle.md)).
5. Para breaking changes, siga [breaking-changes.md](breaking-changes.md).

## O que gestão de mudança não é

- Não é um CAB pesado obrigatório para cada typo.
- Não é substituto para classificação honesta de impacto Unknown.
- Não é permissão para mudar o contrato silenciosamente no código sem atualizar o doc canônico.

## Documentos relacionados

- [breaking-changes.md](breaking-changes.md)
- [contract-compatibility.md](contract-compatibility.md)
- [contract-versioning.md](contract-versioning.md)
- [change-policy.md](change-policy.md)
- [contract-ownership.md](contract-ownership.md)
