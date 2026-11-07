---
title: "Procedimento de recuperação: restore do catalog-cache (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
recovery_id: "rcv-catalog-cache-restore"
severity: "SEV-2"
---

# Procedimento de recuperação: restore do catalog-cache

> Language: pt-BR | [English](../en/recovery-procedure.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Recovery ID: rcv-catalog-cache-restore
>
> **Exemplo ficcional — não é um projeto real.**

## Propósito

Restaurar o conteúdo do catalog-cache a partir de um backup nomeado para que lookups possam servir um snapshot recente quando o cache ao vivo está vazio ou corrompido.

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| Restore do catalog-cache a partir de artefato de backup | Disaster recovery completo do site, restore do inventory-store |

## Pré-condições

| Pré-condição | Como verificar |
| --- | --- |
| Nome e timestamp do artefato de backup conhecidos | Verificar catálogo / inventário de backups |
| Permissão de restore concedida para o ambiente | Confirmar acesso pelo processo do projeto |
| Stakeholders notificados de manutenção / recuperação | Nota de status publicada |

## Notas de segurança

- Confirme **ambiente** e **cache alvo** antes de agir.
- O restore pode **sobrescrever** o conteúdo atual do cache — destaque antes da execução.
- Nunca embuta secrets; referencie apenas nomes.
- Não invente paths de storage ou CLIs de vendor; use passos de restore evidenciados pelo projeto.
- Prefira validação read-only do backup antes do cutover quando o projeto permitir.

## Contexto de RPO / RTO

| Campo | Valor |
| --- | --- |
| RPO | 1 hora (exemplo) |
| RTO | 30 minutos (exemplo) |
| Critérios de recuperação | Lookups bem-sucedidos no snapshot restaurado; freshness dentro do RPO |

## Procedimento

1. Identifique o backup mais recente dentro do RPO; registre nome do artefato e timestamp.
2. Coloque o catalog-service em manutenção ou modo degradado documentado, se o processo do projeto exigir.
3. Restaure o backup no catalog-cache alvo usando o mecanismo evidenciado do projeto (nomeie o mecanismo; não invente comandos).
4. Execute as validações abaixo.
5. Saia da manutenção / modo degradado quando as checks passarem.
6. Registre o artefato usado e o resultado no incidente ou change record.

## Validação

| Check | Resultado esperado |
| --- | --- |
| Lookups de amostra | Sucesso dentro do timeout |
| Freshness do cache | Dentro do RPO do backup escolhido |
| Ratio de erro | Estável ou melhorando vs pré-restore |

## Rollback / Abort

| Condição | Ação |
| --- | --- |
| Restore falha na validação | Abortar cutover; manter cache anterior se ainda existir; escalar |
| Ambiente errado detectado | Parar imediatamente; não prosseguir |

A própria recuperação pode não ser seguramente reversível se o cache anterior estava vazio — documente esse estado antes da sobrescrita.

## Escalonamento

| Condição | Escalar para | Fornecer |
| --- | --- |
| Nenhum backup válido dentro do RPO | example-platform | Miss de RPO, último artefato known-good |
| Restore falha repetidamente | example-platform | Nome do artefato, falhas de validação |

## Documentação relacionada

| Documento | Path |
| --- | --- |
| Backup / restore | docs/pt-BR/backup-restore.md |
| Disaster recovery | docs/pt-BR/disaster-recovery.md (DR formal não definido neste exemplo) |
| Runbook | ../runbook/ |
| Service profile | ../service-profile/ |
| RPO / RTO | docs/pt-BR/rpo-rto.md |
