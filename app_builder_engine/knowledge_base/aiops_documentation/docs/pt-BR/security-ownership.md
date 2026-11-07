# Ownership de Segurança

> Language: pt-BR | [English](../en/security-ownership.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Quem é accountable por outcomes, decisões e response de segurança de um sistema.

Isto estende [ownership.md](ownership.md) (ownership da documentação) e integra-se com [operational-ownership.md](operational-ownership.md) (accountability de runtime e incident). Doc owner, operational owner e security owner **podem ser o mesmo time** — ou diferentes. Declare cada um quando diferirem.

## Roles

O mesmo time, squad ou role **pode acumular múltiplos roles**. Não invente pessoas separadas para cada coluna.

| Role | Meaning |
| --- | --- |
| **Segurança owner** | Accountable pela postura de segurança do sistema: requirements, adequação de controls, exceptions, atualidade do threat model |
| **System owner** | Accountable pela capability end-to-end (outcome de produto/técnico); frequentemente o mesmo que service owner |
| **Technical owner** | Accountable pela implementação, fitness de arquitetura e controls técnicos de segurança em código/config |
| **Data owner** | Accountable por decisões de data class, intenção de retention e quem pode processar os dados |
| **Operational owner** | Accountable pela operabilidade do dia a dia: signals, runbooks, readiness — veja [operational-ownership.md](operational-ownership.md) |
| **Incident owner** | Accountable por coordenar response quando ocorre um incident relevante de segurança ou operacional (pode haver handoff por tipo) |

Prefira identificadores duráveis (team / squad / role), não nomes pessoais que somem após uma reorg. Veja [ownership.md](ownership.md).

## Inventário sugerido

| Component / service | Segurança | System | Technical | Data | Operational | Incident | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

Marque **Not Defined** quando um role estiver intencionalmente sem definição (projetos pequenos frequentemente colapsam roles em um time). Marque **Not Applicable** quando um role não fizer sentido.

## Snapshot de responsabilidades

| Role | Typical duties |
| --- | --- |
| Segurança owner | Manter threat model e requirements honestos; aceitar ou escalar residual risk; acompanhar exceptions |
| System owner | Priorizar trabalho de segurança; aceitar trade-offs de risk no nível de produto |
| Technical owner | Implementar e verificar controls; manter docs de arquitetura/segurança alinhados à realidade |
| Data owner | Classificar dados; definir intenção de retention quando conhecida; aprovar processamento incomum |
| Operational owner | Garantir que monitoring/alerting/runbooks cubram falhas relevantes de segurança quando aplicável |
| Incident owner | Conduzir coordenação Detection → Response → Recovery; escalar; preservar evidence integrity |

## Integração com outros ownerships

| Concern | Document / field |
| --- | --- |
| Quem mantém o *security doc* | `owner` no frontmatter — [ownership.md](ownership.md) |
| Quem owns o *service em runtime* | [operational-ownership.md](operational-ownership.md) |
| Quem owns um *contract* | [contract-ownership.md](contract-ownership.md) |
| Quem owns *accuracy de arquitetura* | `owner` do doc de arquitetura + [architecture-review.md](architecture-review.md) |
| Quem owns *postura de segurança* | Este documento / inventário de segurança do projeto |

Quando o ownership de segurança mudar, atualize este inventário na mesma mudança que transfere a responsabilidade.

## Anti-Patterns

- Listar uma pessoa sem backup de time como único security owner de um sistema Critical.
- Afirmar incident ownership que não existe no on-call.
- Deixar data owner em branco quando dados Confidential ou Restricted são processados.
- Separar doc, ops e security owners sem que nenhum saiba que os outros existem.

## Documentos relacionados

- [ownership.md](ownership.md)
- [operational-ownership.md](operational-ownership.md)
- [security-model.md](security-model.md)
- [security-scope.md](security-scope.md)
- [incident-management.md](incident-management.md)
- [contract-ownership.md](contract-ownership.md)
