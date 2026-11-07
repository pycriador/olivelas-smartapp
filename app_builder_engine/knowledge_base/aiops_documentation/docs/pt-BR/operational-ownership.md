# Ownership Operacional

> Language: pt-BR | [English](../en/operational-ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Quem é responsável por manter um sistema em execução, diagnosticá-lo e escalar quando falha.

Isto estende [ownership.md](ownership.md) (ownership de documentação) para **accountability de runtime e incidente**. O doc owner e o operational owner podem ser o mesmo time — ou diferentes. Declare ambos quando divergirem.

## Roles

O mesmo time, squad ou papel **pode exercer múltiplos roles**. Não invente pessoas distintas para cada coluna.

| Role | Meaning |
| --- | --- |
| **Service owner** | Responsável pela capacidade ponta a ponta (resultado de produto/técnico) |
| **Technical owner** | Responsável pela implementação, adequação da arquitetura e mudanças técnicas |
| **Operational owner** | Responsável pela operabilidade do dia a dia: runbooks, monitoring, readiness |
| **On-call owner** | Primeiro respondente a alertas e incidentes na janela definida |
| **Escalation owner** | Próximo nível quando on-call não resolve ou a severity exige |
| **Dependency owner** | Owner de uma dependência upstream/downstream da qual o serviço depende (pode ser outro time) |

Prefira identificadores duráveis (team / squad / role), não nomes pessoais que desaparecem após uma reorg. Veja [ownership.md](ownership.md).

## Inventário sugerido

| Component / service | Service | Technical | Operational | On-call | Escalation | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| | | | | | | |

Para cada **dependência material**, registre quem é o owner quando a falha te impacta:

| Dependency | Dependency owner | How to reach | Criticality | Notes |
| --- | --- | --- | --- | --- |
| | | | | Veja [criticality.md](criticality.md) |

Marque **Not Defined** quando um role está intencionalmente indefinido (projetos pequenos frequentemente colapsam roles em um time). Marque **Not Applicable** quando o role não faz sentido (ex.: sem on-call formal).

## Snapshot de responsabilidades

| Role | Typical duties |
| --- | --- |
| Service owner | Priorizar trabalho de reliability; aceitar trade-offs de risco |
| Technical owner | Manter design e código alinhados às expectativas de reliability |
| Operational owner | Manter sinais, runbooks e docs operacionais precisos |
| On-call | Detect → diagnose → respond; seguir runbooks; escalar quando travado |
| Escalation | Desbloquear, coordenar, comunicar externamente quando necessário |
| Dependency owner | Ownership de correções do seu lado; compartilhar status em incidentes compartilhados |

## Integração com ownership de documentação

| Concern | Document / field |
| --- | --- |
| Quem mantém o *doc* | `owner` no frontmatter — [ownership.md](ownership.md) |
| Quem é owner do *serviço em runtime* | Este documento / inventário de ops do projeto |
| Quem é owner de um *contrato* | [contract-ownership.md](contract-ownership.md) |
| Quem é owner da *precisão da arquitetura* | `owner` do doc de arquitetura + [architecture-review.md](architecture-review.md) |

Quando o ownership operacional mudar, atualize este inventário na mesma mudança que transfere a responsabilidade.

## Anti-padrões

- Listar uma pessoa sem backup de time como único owner de um serviço crítico.
- Afirmar cobertura de on-call que não existe.
- Deixar dependency owners em branco quando a dependência é Critical.
- Separar “doc owner” e “ops owner” sem que um saiba que o outro existe.

## Documentos relacionados

- [ownership.md](ownership.md)
- [operations-model.md](operations-model.md)
- [alerting.md](alerting.md)
- [incident-management.md](incident-management.md)
- [criticality.md](criticality.md)
- [contract-ownership.md](contract-ownership.md)
