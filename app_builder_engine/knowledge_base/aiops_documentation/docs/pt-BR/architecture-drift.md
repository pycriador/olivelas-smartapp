# Drift de Arquitetura

> Language: pt-BR | [English](../en/architecture-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Drift de arquitetura é a lacuna entre a arquitetura documentada e a arquitetura real.

```text
Documented Architecture
          ≠
Actual Architecture
```

Este padrão define como reconhecer, registrar e tratar drift. Ele **não** introduz automação nesta versão — a detecção permanece humana e orientada a mudança (reviews, PRs, incidentes, onboarding).

## Por que importa

Drift erode a confiança na documentação, engana agentes de IA e engenheiros novos e esconde fronteiras reais de falha e confiança. Tratar docs como atuais quando não são é pior do que marcar Unknown.

## Sinais de drift

| Sinal | Exemplo |
| --- | --- |
| Componente documentado ausente | Overview lista um worker que foi removido |
| Componente existente não documentado | Nova unidade implantável em prod sem menção na arquitetura |
| Dependência não documentada | Serviço chama uma nova API externa sem entrada de dependência |
| Fluxo divergente | Diagrama de sequência não corresponde mais ao caminho de runtime |
| Contrato alterado | Schema evoluiu; a arquitetura ainda descreve a forma antiga |
| Infraestrutura divergente | Topologia de deploy mudou; diagrama de infra obsoleto |
| ADR não mais válido | Decisão supersedida na prática sem novo ADR ou depreciação |

Relacionado: [stale-documentation.md](stale-documentation.md). Idade sozinha é um sinal, não prova.

## Como registrar drift

Quando drift for encontrado:

1. **Classifique o impacto** — naming cosmético vs risco estrutural/operacional/security.
2. **Registre** — comentário de PR, follow-up de review record ou item de debt:
   - documentation debt para docs ausentes/errados ([documentation-debt.md](documentation-debt.md));
   - architecture debt quando a *estrutura* em si é o problema ([architecture-debt.md](architecture-debt.md)).
3. **Aponte evidência** — caminho de código, config, contrato, manifesto de deploy, link de incidente.
4. **Não "conserte" em silêncio inventando** uma arquitetura desejada como estado atual.

Campos sugeridos ao registrar drift (leves):

| Campo | Significado |
| --- | --- |
| **ID** | Id estável opcional (`DRIFT-003`) |
| **Documented** | O que os docs afirmam |
| **Actual** | O que existe (com evidência) |
| **Impact** | Quem/o que é enganado ou está em risco |
| **Owner** | Quem vai reconciliar |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

## Como tratar drift

| Achado | Ação |
| --- | --- |
| Docs errados, sistema correto | Atualize docs; `ACCEPTED → REVIEW → ACCEPTED` para docs materiais |
| Sistema errado vs arquitetura aceita | Conserte o sistema **ou** aceite um novo ADR / revise a arquitetura de propósito — não deixe divergência silenciosa |
| Ambos evoluindo | Aterre ADR + docs + código em mudanças coordenadas quando possível |
| Lacuna temporária | Abra debt com owner e prioridade; não apresente como Confirmed |

Arquitetura futura Proposed deve permanecer rotulada Proposed até se tornar atual.

## O que este padrão não faz

- Sem bots, linters ou verificação contínua de arquitetura obrigatórios nesta versão.
- Sem mandato de ferramenta separada de drift.
- Projetos podem adicionar automação depois sem mudar estas definições.

## Documentos relacionados

- [architecture-review.md](architecture-review.md)
- [architecture-debt.md](architecture-debt.md)
- [documentation-debt.md](documentation-debt.md)
- [stale-documentation.md](stale-documentation.md)
- [architecture-checklist.md](architecture-checklist.md)
- [change-policy.md](change-policy.md)
