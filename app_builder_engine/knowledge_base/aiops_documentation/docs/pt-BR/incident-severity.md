# Severidade de Incidentes

> Language: pt-BR | [English](../en/incident-severity.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como documentar a severity de incidentes (urgência e impacto durante a response).

A escala SEV-1..4 abaixo é um **exemplo**. Projetos podem usar P0–P3, Red/Amber/Green ou outro modelo. Documente a escala escolhida uma vez e use-a de forma consistente. Se não existir modelo de severity: **Not Defined**.

## Escala de exemplo (SEV-1..4)

| Severity | Example meaning |
| --- | --- |
| **SEV-1** | Outage crítico voltado ao usuário ou de safety/receita; response estilo all-hands |
| **SEV-2** | Degradação ou outage maior de uma capacidade importante; response urgente |
| **SEV-3** | Impacto limitado ou workaround disponível; response em tempo hábil |
| **SEV-4** | Impacto menor; pode ser tratado em padrões normais de trabalho |

Ajuste as definições ao produto. Não copie esta tabela para um projeto sem editar os significados.

## Fatores (orientação — não auto-score)

| Factor | Question |
| --- | --- |
| User impact | Quantos / quais jornadas? |
| Business impact | Receita, legal, confiança? |
| Scope | Parcial vs total; uma região vs todas |
| Data risk | Perda, corrupção, exposição? |
| Workarounds | Caminho alternativo seguro? |
| Time sensitivity | Está piorando? Prazo? |

Severity pode mudar conforme o impacto é melhor entendido — registre mudanças na [timeline](incident-timeline.md).

## Severity vs criticality vs alert priority

| Concept | About |
| --- | --- |
| [criticality.md](criticality.md) | Importância de um *componente/capacidade* em steady state |
| Incident severity | Urgência *deste evento* |
| Alert priority | Quão alto o monitoring notifica — deve mapear para severity quando possível |

Um serviço Critical pode ter um glitch cosmético SEV-4. Um serviço Medium pode causar SEV-2 se o blast radius for grande.

## O que documentar no projeto

1. Níveis de severity e definições.
2. Quem pode definir/alterar severity.
3. Tempo esperado de response / comunicação por severity (**ou Not Defined**).
4. Mapeamento de alerts para severity inicial quando usado.

## Documentos relacionados

- [incident-management.md](incident-management.md)
- [criticality.md](criticality.md)
- [alerting.md](alerting.md)
- [post-incident-review.md](post-incident-review.md)
