---
title: "Runbook: alta taxa de erro do catálogo (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
runbook_id: "rb-catalog-high-error-rate"
severity: "SEV-2"
---

# Runbook: alta taxa de erro do catálogo

> Language: pt-BR | [English](../en/runbook.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Runbook ID: rb-catalog-high-error-rate
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Reduzir a taxa de erro elevada de lookup no catalog-service e restaurar estado operacional Healthy ou Degraded (com cache).

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Diagnóstico de ratio de erro, timeouts de dependência, fallback de cache | Alterar conteúdo do catálogo, projetos de capacity |

## Severidade

| Campo | Valor |
| --- | --- |
| Severidade típica | SEV-2 |
| Quando escalar severidade | Lookups indisponíveis e cache vazio → tratar como SEV-1 |

## Sintomas

| Sintoma | Onde observado |
| --- | --- |
| Ratio de erro acima do limiar | Metrics / alert |
| Erros de timeout mencionando inventory-store | Logs |
| p99 de latência elevado | Metrics |

## Impacto

| Campo | Valor |
| --- | --- |
| Impacto ao usuário / capacidade | Browse e add-to-cart falham ou ficam lentos |
| Estado operacional | Degraded ou Unavailable |
| Raio de blast | apenas consumidores do catalog-service (exemplo) |

## Pré-condições

| Pré-condição | Como verificar |
| --- | --- |
| Acesso on-call aos sinais do serviço | Confirmar metrics/logs disponíveis |
| Status da janela de deploy | Verificar log de mudanças recentes |

## Notas de segurança

- Confirme ambiente e alvo antes de agir.
- Não invente CLIs de vendor; use o tooling evidenciado do projeto.
- Destaque passos **destrutivos** (ex.: flush de cache) antes da execução.
- Nunca embuta secrets; referencie apenas **nomes**.
- Rollback de deploy ruim pode ser mais seguro que wipe de cache — prefira o caminho menos destrutivo.

## Diagnóstico

1. Confirme que o alerta ainda dispara e anote o horário de início.
2. Compare o ratio de erro antes/depois do último deploy.
3. Verifique saúde de inventory-store (timeouts vs erros duros).
4. Verifique hit rate e freshness do catalog-cache.

| Check | Esperado | Se inesperado |
| --- | --- | --- |
| Ratio de erro | Abaixo do limiar | Continuar mitigação |
| Latência inventory-store | Dentro do timeout do contrato | Seguir mitigação de dependência |
| Freshness do cache | Dentro do RPO | Considerar recovery procedure |

## Mitigação

1. Se um deploy recente correlaciona: pause novos deploys; prepare rollback.
2. Se inventory-store está lento: garanta timeouts/retries alinhados ao contrato; ative modo degradado com cache se disponível.
3. Comunique estado Degraded aos stakeholders.

## Resolução

1. Restaure a saúde da dependência **ou** faça rollback da mudança ruim.
2. Confirme que o ratio volta abaixo do limiar na janela de monitoramento.
3. Saia do modo degradado só quando a dependência estiver saudável.

## Validação

| Check | Resultado esperado |
| --- | --- |
| Ratio de erro | Abaixo do limiar |
| Lookups de amostra | Sucesso dentro do timeout |
| Estado operacional | Healthy (ou Degraded documentado) |

## Rollback

1. Se a mitigação foi rollback de deploy: recoloque a versão known-good pelo processo do projeto.
2. Se foi restore de cache: siga a validação do recovery-procedure; não limpe o cache às cegas.

| Condição que exige rollback | Ação |
| --- | --- |
| Resolução piora o ratio | Abortar; escalar; reverter última mudança |

| Postura de rollback | Notas |
| --- | --- |
| Safe / partial | Rollback de app seguro; restore de cache pode ser irreversível sem snapshot prévio |

## Escalonamento

| Condição | Escalar para | Informações |
| --- | --- |
| Sem melhoria após mitigação | example-platform | Timeline, ratio, último deploy, status da dependência |
| Suspeita de perda de dados | example-platform + product | Escopo do impacto em cache/dados |

## Comunicação

| Audiência | O que dizer | Canal |
| --- | --- | --- |
| Stakeholders | Lookups degradados; mitigação em andamento | Canal de status do projeto |
| Par on-call | Runbook rb-catalog-high-error-rate aplicado | Nota de handoff |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Service profile | ../service-profile/ |
| Failure mode | ../failure-mode/ |
| SLO | ../slo/ |
| Recovery | ../recovery-procedure/ |
| Incident example | ../incident/ |
