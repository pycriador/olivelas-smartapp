# Contexto Progressivo

> Language: pt-BR | [English (EN)](../en/progressive-context.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Carregue a documentação em profundidade crescente: **Question → Scope → Context → Knowledge → Evidence → Constraints → Answer**.

Alinha-se à progressive disclosure de arquitetura (Context → System → Components → Interfaces → Implementation) sem substituí-la.

## Fluxo

```text
Question
  → Scope (system, env, timeframe)
  → Context (Level 0–1)
  → Knowledge (typed docs, registries)
  → Relationships (deps, links)
  → Evidence (classify claims)
  → Constraints (SoT, safety, authority)
  → Answer (with gaps & confidence)
```

## Exemplos por Domínio

### Arquitetura

| Passo | Exemplo |
| --- | --- |
| Question | O que chama o payment provider? |
| Scope | Caminho de produção `checkout` |
| Context | Visão geral do sistema |
| Knowledge | Component registry + docs de sequência |
| Evidence | Client no código + endpoint na config (Confirmed) |
| Answer | Componente nomeado + citação; Unknown se não encontrado |

### Contratos

| Passo | Exemplo |
| --- | --- |
| Question | Remover `customer_tax_id` é breaking? |
| Knowledge | Contrato `order-created@v1` + consumers |
| Evidence | Schema + testes de consumer |
| Constraints | Vocabulário de [breaking-changes.md](breaking-changes.md) |
| Answer | Potential Breaking Change / Unknown Impact — não “breaking” automático sem evidência |

### Operações

| Passo | Exemplo |
| --- | --- |
| Question | Como fazemos page em taxa de erro elevada? |
| Knowledge | Alert → link do runbook |
| Evidence | Definição do alert + runbook ACCEPTED |
| Answer | Passos do runbook; marque comandos Unknown em vez de inventar |

### Segurança

| Passo | Exemplo |
| --- | --- |
| Question | Onde a senha do DB está configurada? |
| Constraints | [ai-context-safety.md](ai-context-safety.md) |
| Answer | Apenas **nome**/referência e store do segredo; valor `[REDACTED]` / nunca inventado |

## Regras

1. Pare de expandir a profundidade quando a pergunta for respondida com evidência adequada.
2. Prefira Unknown a detalhe especulativo de Level 5–6.
3. Registre premissas em [knowledge-gaps.md](knowledge-gaps.md).

## Documentos Relacionados

- [ai-context.md](ai-context.md)
- [architecture-model.md](architecture-model.md)
- [chunking-guidelines.md](chunking-guidelines.md)
