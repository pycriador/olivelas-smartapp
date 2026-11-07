# Fluxo de Trabalho de Documentação com IA

> Language: pt-BR | [English (EN)](../en/ai-documentation-workflow.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0


Fluxos de trabalho padrão para trabalho de documentação assistido por IA.

## A. Fluxo de Mudança de Código

Use quando código, config, schema ou infra mudarem.

```text
1. Comece em ai-context.md
2. Identifique artefatos alterados
3. Mapeie o impacto da mudança (docs, contratos, registries)
4. Reúna evidência a partir da própria mudança
5. Atualize ou rascunhe docs afetados (status DRAFT/REVIEW conforme exigido)
6. Classifique claims (Confirmed/Inferred/Unknown/Proposed)
7. Sincronize docs dependentes ou abra documentation debt
8. Execute checagens de ai-documentation-validation
9. Solicite revisão humana para mudanças materiais/de segurança/contratos/ops
10. Registre fontes para auditabilidade
```

Nunca marque ACCEPTED sem processo humano.

## B. Fluxo de Pergunta / Análise

Use ao responder perguntas ou produzir análise (sem escrita durável de doc exigida).

```text
1. Comece em ai-context.md → ai-navigation.md
2. Defina o escopo da pergunta
3. Carregue progressivamente (Níveis 0–6 conforme necessário)
4. Colete claims + evidência
5. Resolva conflitos de SoT ou registre contradições
6. Responda com classificações + confiança
7. Liste lacunas / Unknowns / assunções
8. Sugira atualizações de docs como Proposed quando os docs estiverem errados — não “corrija” silenciosamente o SoT de produção só na resposta, sem o fluxo de mudança
```

## C. Fluxo de Nova Documentação

```text
1. Confirme type + id + owner
2. Prefira templates já existentes no repositório quando aplicável
3. Preencha metadata obrigatória
4. Escreva apenas conteúdo evidenciado; marque Unknown
5. Linke relacionamentos do grafo
6. Valide + revisão humana
```

## D. Depois da entrega (andaime vs durável)

Use quando a mudança está pronta para merge.

```text
1. Atualize docs duráveis (as-is, ADR, contrato, runbook, ai-context) ou abra documentation debt
2. Não faça merge de andaime de execução (spec, RFC, plano de tasks, sketch) como SoT do sistema atual
3. Mantenha uma pasta de backlog explícita só se estiver rotulada como discovery, não as-is
4. Remova ponteiros de docstring / comentário para arquivos de andaime que serão apagados
```

A spec pode existir na branch enquanto o trabalho acontece. Depois do merge, vale [source-of-truth.md](source-of-truth.md) (Andaime de execução vs conhecimento durável). Layout de arquivos de agente: [ai-agent-entry.md](ai-agent-entry.md).

## Documentos relacionados

- [ai-change-rules.md](ai-change-rules.md)
- [ai-documentation.md](ai-documentation.md)
- [ai-documentation-validation.md](ai-documentation-validation.md)
- [source-of-truth.md](source-of-truth.md)
- [ai-agent-entry.md](ai-agent-entry.md)
