# Exemplo: Plataforma de Documentos Sugerida (Ficcional) — Northstar

> Idioma: pt-BR | [English](../en/README.md)
>
> Status: ACCEPTED · Owner: example-team · Updated: 2026-08-10
>
> Documentation Standard v1.0

## Enquadramento crítico (leia primeiro)

Este pacote é uma stack **SUGERIDA / ILUSTRATIVA**, inspirada em padrões de um **projeto isolado de referência** (inteligência documental / RAG / SSR BFF / Flask / worker Slack / scheduler / PostgreSQL).

Isto **NÃO** é:

- o Padrão de Documentação AIOps
- o guia definitivo de uso do framework
- um mandato de plataforma Loft

Escolhas de tecnologia (React SSR, Flask, provedor LLM externo, Slack Socket Mode, busca vetorial opcional, Vault, values estilo Helm) são **apenas exemplo**. O Padrão de Documentação de Engenharia permanece **agnóstico de tecnologia**.

**Produto fictício:** **Northstar Document Platform**. Use placeholders como `https://docs.example.com` e `secrets/path/example` — nunca hostnames reais da organização nem paths reais de vault.

## Stack ilustrativa sugerida (**NÃO É O PADRÃO**)

| Camada | Escolha ilustrativa |
| --- | --- |
| Frontend | React + Node SSR BFF |
| API | Flask + SQLAlchemy |
| DB | PostgreSQL dual schema app + knowledge |
| Workers | Slack Socket Mode + scheduler interno (mesma imagem da API) |
| AI | Provedor LLM externo (ilustrativo) |
| Search | FTS + vetor opcional |
| Secrets | Env/Vault; segredos de grupo criptografados em repouso |
| Deploy | Container + values estilo Helm (específico da org) |

## O que este exemplo implementa

1. **project-overview** — propósito, escopo, não-objetivos, componentes, card de stack
2. **architecture/** — overview, system context, data model
3. **application/** — SSR BFF, Flask API, document analysis, Slack bridge, scheduler, knowledge platform
4. **contracts/** — esboços de HTTP API e external API
5. **operations/** — feature flags, local-dev, deploy-k8s, runbook de hybrid search
6. **security/** + **observability/** — overviews honestos com Confirmed/Inferred/Unknown
7. **decisions/** — ADR-001 SSR BFF, ADR-002 Slack Socket worker
8. **infrastructure/deployment.md** — esboço de container + values
9. **ai-context** — entrada AI-ready para agentes

## Como ler

Comece em [docs/project-overview.md](docs/project-overview.md).

## Relacionados (metodologia do padrão)

- [adoption-path.md](../../../docs/pt-BR/adoption-path.md)
- [flat-docs-migration.md](../../../docs/pt-BR/flat-docs-migration.md)
- [templates/](../../../docs/pt-BR/templates/)
