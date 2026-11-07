# Testes de Confiabilidade

> Language: pt-BR | [English](../en/reliability-testing.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Estratégias conceituais para testar reliability — **não** um mandato de tool, produto de chaos ou framework de carga específico.

Documente o que o projeto realmente pratica. Marque **Not Applicable** ou **Not Defined** quando estratégias não forem usadas.

## Por que documentar estratégias (não receitas)

Testes de reliability respondem: *Nossas hipóteses de falha e recovery se sustentam?* A documentação deve capturar **intent e cobertura**, não inventar scripts de ataque específicos de cluster.

## Catálogo de estratégias (exemplos — não exaustivo)

| Strategy | Intent | Typical evidence |
| --- | --- | --- |
| **Failure injection** | Verificar isolamento e degradação quando uma dependência falha | Notas de teste, relatório de game day, experimento de feature flag |
| **Latency / timeout tests** | Verificar comportamento sob dependências lentas | Alinhamento de timeout de contrato, testes de integração |
| **Load / saturation** | Encontrar cliffs de capacity e estouro de filas | Review de capacity, resumo de load test |
| **Failover / restore drills** | Verificar caminhos relevantes a RTO/RPO | Data de teste de restore, exercício de DR |
| **Idempotency / duplicate delivery** | Verificar hipóteses de retry/delivery do contrato | Testes de contrato, drills de replay |
| **Config / flag rollback drills** | Verificar caminhos de undo de mudança | Registros de change |
| **Synthetic checks** | Verificação rasa contínua de jornadas críticas | Config de monitoring |

Projetos podem usar outros nomes. Mapeie termos locais uma vez.

## O que documentar por estratégia usada

| Field | Content |
| --- | --- |
| Strategy | Nome |
| Scope | O que está coberto / excluído |
| Frequency | Continuous / periodic / ad hoc / never |
| Owner | Quem desenha e interpreta resultados |
| Linked failure modes | [failure-modes.md](failure-modes.md) |
| Linked runbooks | Validation de recovery |
| Last executed | Data ou Unknown |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Regras

- Apenas conceitual neste padrão — **sem comandos universais de chaos**.
- Não reivindique resilience que nunca foi testada.
- Alinhe testes às semânticas de contrato (timeout, retry, idempotency) e failure domains de arquitetura.
- Prefira vincular a docs de teste existentes a copiar suites para docs de ops.

## Documentos relacionados

- [game-days.md](game-days.md)
- [failure-modes.md](failure-modes.md)
- [reliability-model.md](reliability-model.md)
- [capacity.md](capacity.md)
- [contract-testing.md](contract-testing.md)
- [operational-readiness.md](operational-readiness.md)
