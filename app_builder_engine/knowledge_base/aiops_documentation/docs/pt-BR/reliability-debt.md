# Dívida de Confiabilidade

> Language: pt-BR | [English](../en/reliability-debt.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como distinguir e registrar **reliability debt** versus outros kinds de dívida.

## Kinds de dívida (mantenha-os distintos)

| Kind | Meaning | Typical example |
| --- | --- | --- |
| **Technical debt** | Qualidade de implementação / atalhos em código ou config | Testes ausentes, módulo frágil |
| **Arquitetura debt** | Custo estrutural/de decisão — [architecture-debt.md](architecture-debt.md) | Acoplamento a DB compartilhado gravável |
| **Contract debt** | Regras de interface ausentes/erradas — [contract-debt.md](contract-debt.md) | Semântica de retry não documentada |
| **Documentation debt** | Docs ausentes/errados/stale — [documentation-debt.md](documentation-debt.md) | Sem runbook |
| **Reliability debt** | Risco de **operability/reliability** aceito ou não notado em como o sistema falha, é detectado ou recuperado | Sem alert no caminho crítico; restore não testado; SPOF sem mitigation |

Frequentemente coexistem. Registre cada um no kind certo para que a remediação mire o artifact certo.

## Quando algo é reliability debt

Trate como reliability debt quando o issue é principalmente sobre:

- detection ausente ou ineficaz para falhas materiais;
- caminhos de recovery ausentes ou inseguros;
- SPOFs / failure modes conhecidos sem mitigation ou aceitação;
- backup/restore não testado ou DR reivindicado sem evidência;
- alerts non-actionable ou rotineiramente ignorados;
- compromissos de error-budget / SLO sem ownership;
- conhecimento operacional que existe só como memória tribal em caminhos críticos.

**Não** rotule todo bug ou unit test ausente como reliability debt.

## Como registrar

| Campo | Significado |
| --- | --- |
| **ID** | Id estável (ex.: `REL-014`) |
| **Description** | Qual gap de reliability/operability existe |
| **Impact** | Failure mode, blast radius, efeito em MTTD/MTTR se conhecido |
| **Owner** | Team/role responsável |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Opcional: failure mode vinculado, gap de runbook, incidente, finding de game day, IDs de architecture/contract debt.

## Orientação de prioridade

| Priority | Guidance |
| --- | --- |
| **High** | Caminho crítico cego ou irrecuperável; incidentes SEV-level repetidos |
| **Medium** | Gap significativo de detection/recovery; workarounds existem |
| **Low** | Preferência de hardening; blast radius baixo |

`Accepted Risk` exige reconhecimento explícito do owner — não negligência.

## Documentos relacionados

- [operational-drift.md](operational-drift.md)
- [failure-modes.md](failure-modes.md)
- [operational-readiness.md](operational-readiness.md)
- [corrective-actions.md](corrective-actions.md)
- [reliability-metrics.md](reliability-metrics.md)
- [operations-model.md](operations-model.md)
