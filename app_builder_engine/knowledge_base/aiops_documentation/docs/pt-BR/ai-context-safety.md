# Segurança de contexto da IA

> Language: pt-BR | [English](../en/ai-context-safety.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Regras de segurança para conteúdo de documentação usado como contexto de IA.

## Nunca expor secrets

Documentação e respostas de IA **nunca** devem incluir:

- API keys, tokens, passwords, private keys
- Connection strings com credenciais embutidas
- Cookies de sessão crus ou bearer tokens
- Valores de secrets de Vault/CI

Documente apenas: **nome** do secret, finalidade, referência do store, owner de rotação — conforme [secrets-management.md](secrets-management.md) e [secret-exposure.md](secret-exposure.md).

## Token de redação

Use `[REDACTED]` quando um valor apareceria de outra forma:

```text
password=[REDACTED]
Authorization: Bearer [REDACTED]
```

Prefira omitir o campo inteiramente quando possível.

## Segurança adicional

| Topic | Rule |
| --- | --- |
| PII | Evite CPF/CNPJ, dados bancários e documentos pessoais desnecessários nos docs |
| Logs/examples | Mascarar campos sensíveis |
| Segurança findings | Não publicar PoCs de exploit em docs gerais |
| Prompts | Não colar secrets em context packs de prompt |

## Obrigações da IA

1. Recusar ecoar valores de secrets encontrados no contexto; substituir por `[REDACTED]` e alertar.
2. Não “reconstruir” passwords prováveis de forma “útil”.
3. Tratar commits acidentais de secrets como incidentes de segurança — não apenas editar o arquivo.

## Documentos relacionados

- [ai-task-boundaries.md](ai-task-boundaries.md)
- [secure-logging.md](secure-logging.md)
- [secret-exposure.md](secret-exposure.md)
