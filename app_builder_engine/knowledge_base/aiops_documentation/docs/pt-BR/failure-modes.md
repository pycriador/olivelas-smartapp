# Modos de Falha

> Language: pt-BR | [English](../en/failure-modes.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Orientação para catalogar como um sistema pode falhar — para design review, monitoring e runbooks.

As categorias abaixo são **exemplos, não exaustivas**. Projetos inventam categorias que cabem no seu domínio. Omita modes que não se aplicam.

## Propósito

Uma entrada de failure mode responde:

> O que dá errado, como notamos, o que o usuário sente e o que fazemos?

## Campos sugeridos da entrada

| Campo | Significado |
| --- | --- |
| ID / name | Identificador estável |
| Description | O que falha |
| Category | Veja exemplos abaixo |
| Trigger | Condições que o provocam |
| Detectable? | Como (metric, log, health, user report) — ou Unknown |
| User / business impact | |
| Criticality | [criticality.md](criticality.md) |
| Propagation | Link [failure-propagation.md](failure-propagation.md) |
| Mitigation | Automática ou manual |
| Recovery | Passos / runbook |
| Classification | Confirmed / Inferred / Unknown / Proposed |

## Categorias de exemplo (não exaustivas)

| Categoria | Exemplos |
| --- | --- |
| Crash / stop | Exit de processo, job travado sem agendar |
| Timeout | Caller ou callee excede o orçamento de tempo |
| Saturation | Exaustão de CPU, memória, fila, connection pool |
| Dependency failure | Downstream indisponível ou recusando |
| Data / state | Corrupção, inconsistência, poison message |
| Partial incorrectness | Resultados errados enquanto aparenta healthy |
| Throttling / rejection | Rate limits, admission control |
| Configuration | Config ruim, credenciais expiradas |
| Capacity | Demanda excede capacity provisionada |
| Segurança / abuse | Roubo de credenciais, flood de tráfego — quando no escopo |

Adicione ou renomeie categorias livremente. Não force toda linha nesta lista.

## Forma do catálogo

| ID | Mode | Category | Detection | Impact | Mitigation | Recovery | Criticality |
| --- | --- | --- | --- | --- | --- | --- | --- |
| | | | | | | | |

Comece com modes Confirmed a partir de incidentes ou testes. Marque modes Proposed com clareza para não serem tratados como risco atual sem evidência.

## Progressive Disclosure

| Project size | Minimum |
| --- | --- |
| Small | Top 3–5 modes realistas no overview de arquitetura ou ops |
| Medium | Catálogo para caminhos críticos + falhas de dependência |
| Large | Catálogos por subsistema + modes de dependências compartilhadas |

## Anti-padrões

- FMEA teórico exaustivo para uma ferramenta simples sem owners para mantê-lo.
- Listar só crashes de infraestrutura e ignorar modes “errado mas up”.
- Duplicar o doc inteiro de arquitetura em vez de vincular [failure-domains.md](failure-domains.md).

## Documentos relacionados

- [reliability-model.md](reliability-model.md)
- [failure-propagation.md](failure-propagation.md)
- [failure-domains.md](failure-domains.md)
- [degradation.md](degradation.md)
- [runbooks/README.md](runbooks/README.md)
