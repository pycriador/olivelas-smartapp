# Dívida de Contrato

> Language: pt-BR | [English](../en/contract-debt.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como distinguir e registrar **contract debt** versus documentation debt e technical debt quando o problema está na fronteira de um contrato.

## Três dívidas distintas

| Kind | Meaning | Typical example |
| --- | --- | --- |
| **Contract Debt** | O acordo em si está incompleto, inconsistente, difícil de evoluir ou fracamente especificado enquanto a fronteira existe | Sem história de idempotency em um comando retentado; premissas conflitantes de consumers; churn breaking sem versão |
| **Documentation Debt** | Informação sobre o contrato está ausente, errada ou stale | Contrato de runtime existe; docs Markdown/schema ausentes ou drifted |
| **Technical Debt** | Problema de qualidade da implementação ao produzir/consumir o contrato | Parser frágil, sem testes, lógica de validação duplicada |

Frequentemente coexistem. Registre cada uma no tipo certo para a remediação mirar o artefato certo (acordo vs docs vs código).

Veja também: [documentation-debt.md](documentation-debt.md), [architecture-debt.md](architecture-debt.md).

## Quando algo é contract debt

Trate como contract debt quando o problema for principalmente sobre:

- regras ausentes de que participantes precisam (retry, errors, semantics, compatibility);
- expectativas incompatíveis ou ambíguas entre producers e consumers;
- incapacidade de evoluir com segurança (sem versioning, sem caminho de deprecation);
- declarações de Source of Truth fracas ou conflitantes.

**Não** rotule todo parágrafo ausente de wiki como contract debt se o acordo em schema+código for claro — isso pode ser só documentation debt. **Não** rotule um handler com bug como contract debt se o contrato for claro — isso é technical debt.

## Como registrar contract debt

| Campo | Significado |
| --- | --- |
| **ID** | Id estável (por exemplo `CDEBT-012`) |
| **Description** | O que está fraco ou ausente no acordo |
| **Impact** | Risco de integração, custo de evolução, risco de incidente |
| **Owner** | Contract owner (e participant owners se necessário) |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Orientação de prioridade espelha architecture debt: High bloqueia integração ou evolução segura; Medium tem workarounds; Low é cleanup.

## Relação com drift e ciclo de vida

- [Contract drift](contract-drift.md) frequentemente cria documentation debt e pode revelar contract debt.
- Corrigir contract debt pode exigir [change management](contract-change-management.md) e transições de ciclo de vida — não um novo token de status.
- `Accepted Risk` é uma decisão explícita, não negligência.

## Documentos relacionados

- [contract-drift.md](contract-drift.md)
- [documentation-debt.md](documentation-debt.md)
- [architecture-debt.md](architecture-debt.md)
- [quality-model.md](quality-model.md)
- [contract-checklist.md](contract-checklist.md)
