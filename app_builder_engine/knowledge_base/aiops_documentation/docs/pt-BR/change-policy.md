# Política de Mudança da Documentação

> Language: pt-BR | [English](../en/change-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## Regra central

Uma **mudança técnica relevante não está completa** até que a documentação necessária seja atualizada.

Código, infraestrutura e contratos embarcam com os docs que mantêm operadores, integradores e engenheiros futuros orientados. "Documentamos depois" é trabalho incompleto, salvo se rastreado como dívida de documentação explícita com owner e prioridade.

Nem toda mudança de código precisa de atualização de docs. Refactors internos sem impacto externo, operacional ou arquitetural podem não precisar de nenhuma.

## Matriz de mudança

| Mudança | Atualizar docs? | Revisão |
| --- | --- | --- |
| Novo componente | Sim | Technical |
| Mudança de responsabilidade do componente | Sim | Technical |
| Mudança de contrato (API, evento, mensagem, arquivo, comando) | Sim | Technical |
| Mudança de comportamento visível a usuários ou integradores | Sim | Technical |
| Mudança de arquitetura / fronteira | Sim | Technical |
| Mudança de infraestrutura (env, recursos, networking, scaling) | Sim | Technical |
| Mudança de segurança (auth, segredos, limite de confiança, criptografia) | Sim | Mandatory |
| Mudança operacional (runbook, escalação, recuperação) | Sim | Operational |
| Mudança de observabilidade (alertas, SLOs, dashboards críticos) | Sim | Technical / Operational |
| Mudança de dependência com impacto operacional ou de integração | Sim | Technical |
| Decisão digna de ADR | Sim (ADR + docs de estado atual relacionados) | Technical |
| Fix / refactor interno sem impacto externo ou de ops | Avaliar | Optional |
| Typo ou mudança só de formatação em docs | Apenas docs | Optional |
| Mudança só de exemplo ou comentário no código | Em geral não | Optional |

**Avaliar** significa: verificar se alguma afirmação de overview, contrato, runbook, segurança ou arquitetura ficou falsa. Se sim, atualize; se claramente não, pule.

## Completando uma mudança

Para mudanças que exigem docs:

1. Atualize os documentos canônicos (evite edições divergentes duplicadas).
2. Defina status `REVIEW` ao editar um doc substantivo `ACCEPTED` ([lifecycle.md](lifecycle.md)).
3. Atualize metadados (`updated`, owner se necessário).
4. Obtenha o tipo de revisão listado na matriz.
5. Retorne a `ACCEPTED` quando a revisão passar, ou abra [dívida de documentação](documentation-debt.md) para follow-ups adiados com aceitação explícita do risco.

Use [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md) no pull request.

## O que significa "atualizar docs"

Dependendo da mudança:

- corrigir a descrição do estado atual;
- atualizar contratos e notas de compatibilidade;
- ajustar diagramas;
- revisar runbooks e troubleshooting;
- adicionar ou emendar ADRs para decisões materiais;
- deprecar documentos substituídos em vez de deixar contradição silenciosa.

Polimento editorial sozinho não substitui atualizar os documentos que carregam a verdade operacional.

## Exceções

Documente exceções como dívida quando os docs não puderem embarcar na mesma mudança:

| Campo | Obrigatório |
| --- | --- |
| Why docs lag | Justificativa curta |
| Owner | Quem vai terminar |
| Priority | High / Medium / Low |
| Target | Issue, ticket ou ID de dívida |

Atraso não rastreado não é exceção — é descoberta de dívida esperando acontecer.

## Documentos relacionados

- [lifecycle.md](lifecycle.md)
- [review-policy.md](review-policy.md)
- [documentation-debt.md](documentation-debt.md)
- [changelog-policy.md](changelog-policy.md)
- [stale-documentation.md](stale-documentation.md)
