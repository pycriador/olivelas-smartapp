---
title: "Security Test: SECTEST-001 dependency SCA (Ficcional)"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-07"
updated: "2026-08-07"
review_date: "2026-11-07"
version: "1.0"
test_id: "SECTEST-001"
---

# Security Test: SECTEST-001 dependency SCA

> Language: pt-BR | [English](../en/security-test.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
> Owner: example-team
> Last reviewed: 2026-08-07
> Test ID: SECTEST-001
>
> **Exemplo ficcional — não é um projeto real. Sem valores secretos de ferramenta.**

## Resumo

Análise contínua de composição de software (SCA) das dependências do catalog-service; achados entram no processo de vulnerabilidades como candidatos.

## Identidade

| Campo | Valor |
| --- | --- |
| Test ID | SECTEST-001 |
| Nome | catalog-service dependency SCA |
| Estratégia | SCA |
| Status | Active |
| Owner | example-team |

## Escopo

| Campo | Valor |
| --- | --- |
| No escopo | Dependências diretas e transitivas declaradas do catalog-service |
| Fora do escopo | Pacotes do SO do host em runtime (ownership em outro lugar); SaaS de terceiros |
| Frequência | Continuous (a cada mudança em manifests de dependência) |
| Última execução | 2026-08-06 |

## Vinculação

| Campo | Valor |
| --- | --- |
| Ameaças / controles / requisitos vinculados | Apoia detecção de fraquezas de dependência no caminho de supply de RISK-001; não substitui CTRL-001 |
| Como achados são triados | Abertos como candidatos a vulnerabilidade → processo de vulnerabilidades |
| Local da evidência | Store de artefatos do pipeline (nome lógico: `catalog-sca-reports`) — só resumos nos docs |
| Classificação | Confirmed (exemplo) |

## Resultados (somente resumo)

| Campo | Valor |
| --- | --- |
| Resumo do resultado | Última execução: nenhum Critical aberto; um candidato Medium aberto como VULN pendente |
| Achados abertos (IDs) | Nenhum confirmado como VULN-00x ainda (exemplo) |
| Exceções criadas | Nenhuma |

## Documentação relacionada

| Documento | Caminho |
| --- | --- |
| Vulnerability | ../vulnerability/ |
| Control | ../control/ |
| Security review | ../security-review/ |
