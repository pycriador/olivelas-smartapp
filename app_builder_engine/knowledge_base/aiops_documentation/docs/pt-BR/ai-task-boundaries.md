# Limites de tarefa da IA

> Language: pt-BR | [English](../en/ai-task-boundaries.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


O que a IA pode fazer com documentação, o que precisa de validação e o que é proibido.

## Permitido

- Ler e navegar docs a partir de [ai-context.md](ai-context.md)
- Responder com claims classificadas e citações
- Redigir documentação como `DRAFT`
- Sugerir melhorias Proposed
- Sinalizar Unknowns, contradições, sinais de drift e debt
- Corrigir issues não materiais (links quebrados, formatação) conforme política do projeto
- Atualizar registries quando evidenciado pela mudança em revisão

## Exige validação

- Atualizações materiais de Arquitetura, Contract, Operation, Segurança, Runbook, Incident
- Transições de status (`REVIEW` ↔ `ACCEPTED`, deprecação, arquivo)
- Mudanças de ownership
- Classificações de breaking-change ou severity
- Redação de security control/requirement
- Qualquer coisa que afete procedimentos de produção ou documentação de identity/access
- Publicar contrapartes bilíngues quando a política de idioma exigir atualizações em par

Validação significa revisão humana e/ou checagens exigidas pelo projeto — a IA não deve auto-ACCEPT.

## Não permitido

- Inventar fatos, componentes, SLOs, threats ou owners
- Expor ou solicitar **valores** de secrets
- Implementar ou especificar RAG, embeddings, vector DB, servidores MCP, motores de busca ou chatbots **como parte deste padrão de documentação**
- Apresentar Inferred/Proposed como Confirmed atual
- Apagar silenciosamente evidência ou contradições inconvenientes
- Ações de produção irreversíveis só a partir do contexto de docs
- Reescrever histórico git para esconder secrets vazados (apenas processo de segurança liderado por humanos)

## Documentos relacionados

- [ai-change-rules.md](ai-change-rules.md)
- [ai-context-safety.md](ai-context-safety.md)
- [ai-documentation.md](ai-documentation.md)

