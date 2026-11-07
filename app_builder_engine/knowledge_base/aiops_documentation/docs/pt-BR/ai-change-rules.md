# Regras de mudança da IA

> Language: pt-BR | [English](../en/ai-change-rules.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Regras para agentes de IA ao propor ou aplicar mudanças de documentação (e com impacto em docs).

## Permitido sem gate extra (típico)

- Corrigir links relativos quebrados
- Adicionar marcadores Unknown e listas de gaps
- Adicionar citações de evidência a claims existentes
- Redigir conteúdo novo como `DRAFT`
- Propor melhorias Proposed claramente rotuladas

## Exige validação / revisão humana

- Mudanças materiais de arquitetura, contrato, ops ou segurança
- Reatribuição de ownership
- Transições de status em direção a `ACCEPTED`
- Declarações de breaking change
- Depreciação / arquivo de docs `ACCEPTED`
- Qualquer mudança que altere passos de segurança de incidente/runbook

## Não permitido

- Definir `ACCEPTED` unilateralmente
- Inventar componentes, SLOs, controles ou owners
- Escrever valores de secrets
- Apresentar Proposed como atual
- Tratar Inferred como Confirmed
- Apagar silenciosamente evidência contraditória
- Implementar RAG/agents/MCP como parte de “atualizações de docs”

## Processo

1. Execute análise de impacto ([change-impact.md](change-impact.md)).
2. Atualize docs dependentes ou abra itens de debt.
3. Preserve regras bilíngues quando o repositório exigir EN + pt-BR ([language.md](language.md)).
4. Deixe o status `DRAFT`/`REVIEW` conforme [ai-documentation.md](ai-documentation.md) e [change-policy.md](change-policy.md).
5. Forneça trilha de auditoria das fontes ([ai-auditability.md](ai-auditability.md)).

## Documentos relacionados

- [ai-documentation-workflow.md](ai-documentation-workflow.md)
- [ai-task-boundaries.md](ai-task-boundaries.md)
- [change-policy.md](change-policy.md)
