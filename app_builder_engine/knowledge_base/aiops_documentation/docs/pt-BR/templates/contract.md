---
title: "Nome do Contrato"
status: "DRAFT"
owner: "team-or-role"
created: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
review_date: "YYYY-MM-DD"
version: "1.0"
contract_type: "API"  # API|Event|Message|File|Command|Callback|Library|Data|Integration|Other
# protocol: ""
# producer: "component-a"
# consumer: "component-b"
# contract_id: "domain-capability-type@version"
---

# Nome do Contrato

> Language: pt-BR | [English (EN)](../../en/templates/contract.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Template de contrato agnóstico de tecnologia. Marque seções como **Not Applicable** quando não se aplicarem. Não invente endpoints, campos, códigos de erro, garantias de entrega, timeouts, retries ou versionamento sem evidência. Classifique claims como Confirmed / Inferred / Unknown / Proposed quando útil.

## Propósito

<!-- Por que este contrato existe e qual capacidade expõe. -->

## Escopo

| No escopo | Fora do escopo |
| --- | --- |
| | |

## Participantes

| Participante | Papel | Notas | Classificação |
| --- | --- | --- | --- |
| | producer / consumer / intermediary / other | | Confirmed / Inferred / Unknown |

## Producer

| Campo | Valor | Classificação |
| --- | --- | --- |
| Sistema / componente | | Confirmed / Inferred / Unknown |
| Time / owner | | |
| Evidência | <!-- path or Unknown --> | |

## Consumer

| Consumer | Notas | Classificação |
| --- | --- | --- |
| | <!-- list known consumers; Unknown if not identified --> | Confirmed / Inferred / Unknown |

## Tipo de contrato

Selecione um (alinhado ao frontmatter `contract_type`):

- [ ] API
- [ ] Event
- [ ] Message
- [ ] File
- [ ] Command
- [ ] Callback
- [ ] Library
- [ ] Data
- [ ] Integration
- [ ] Other: <!-- specify -->

## Protocolo

<!-- Protocolo de transporte ou interação. Exemplos são apenas ilustrativos; use o que o projeto realmente usa. Não assuma HTTP. -->

| Campo | Valor | Classificação |
| --- | --- | --- |
| Protocolo | | Confirmed / Inferred / Unknown / Not Applicable |
| Estilo de interação | request-response / fire-and-forget / stream / batch / other | |

## Endpoint / canal / interface

<!-- Path, topic, queue, localização de arquivo, entrada CLI, superfície de library ou outro localizador de interface. Not Applicable quando não houver localizador discreto. -->

| Campo | Valor | Classificação |
| --- | --- | --- |
| Locator | | Confirmed / Inferred / Unknown / Not Applicable |
| Method / operation / verb | | Confirmed / Inferred / Unknown / Not Applicable |
| Notas | | |

## Request / entrada

| Campo / parte | Tipo | Obrigatório | Descrição | Classificação |
| --- | --- | --- | --- | --- |
| | | yes / no | | Confirmed / Inferred / Unknown |

## Response / saída

| Campo / parte | Tipo | Obrigatório | Descrição | Classificação |
| --- | --- | --- | --- | --- |
| | | yes / no | | Confirmed / Inferred / Unknown |

## Schema

<!-- Linke o schema canônico ou incorpore um schema mínimo. Prefira uma única source of truth. -->

```text
<!-- schema or path to schema -->
```

| Tópico | Valor | Classificação |
| --- | --- | --- |
| Localização do schema | | Confirmed / Inferred / Unknown / Not Applicable |
| Formato do schema | | |

## Semântica

<!-- Significado de campos, estados, efeitos colaterais e regras de negócio expressos pelo contrato. -->

| Conceito | Significado | Efeitos colaterais | Classificação |
| --- | --- | --- | --- |
| | | | Confirmed / Inferred / Unknown |

## Autenticação

| Mecanismo | Notas | Classificação |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

<!-- No secret values. Document secret references only. -->

## Autorização

| Regra | Notas | Classificação |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

## Validação

| Regra | Onde aplicada | Notas | Classificação |
| --- | --- | --- | --- |
| | producer / consumer / gateway / other | | Confirmed / Inferred / Unknown / Not Applicable |

## Erros

<!-- Prefira linkar a um documento de error-contract quando os erros forem não triviais. Não assuma códigos de status HTTP. -->

| Erro / condição | Retryable | Ação do consumer | Classificação |
| --- | --- | --- | --- |
| | yes / no / Unknown | | Confirmed / Inferred / Unknown / Not Applicable |

Catálogo detalhado de erros (opcional): [error-contract.md](error-contract.md).

## Comportamento de retry

| Tópico | Valor | Classificação |
| --- | --- | --- |
| Condições retryable | | Confirmed / Inferred / Unknown / Not Applicable |
| Max attempts | | |
| Backoff | | |
| Condições non-retryable | | |

## Timeout

| Timeout | Valor | Classificação |
| --- | --- | --- |
| Timeout do client / consumer | | Confirmed / Inferred / Unknown / Not Applicable |
| Timeout do server / producer | | |
| Outro | | |

## Idempotência

| Tópico | Valor | Classificação |
| --- | --- | --- |
| Idempotent | yes / no / Unknown / Not Applicable | |
| Chave / estratégia de idempotência | | Confirmed / Inferred / Unknown / Not Applicable |

## Ordenação

| Tópico | Valor | Classificação |
| --- | --- | --- |
| Garantia de ordenação | none / per-key / global / Unknown / Not Applicable | Confirmed / Inferred / Unknown / Not Applicable |
| Notas | | |

## Semântica de entrega

| Tópico | Valor | Classificação |
| --- | --- | --- |
| Garantia de entrega | at-most-once / at-least-once / exactly-once / Unknown / Not Applicable | Confirmed / Inferred / Unknown / Not Applicable |
| Modelo de acknowledgement | | |
| Notas | | |

## Versionamento

| Tópico | Valor | Classificação |
| --- | --- | --- |
| Versão atual | | Confirmed / Inferred / Unknown |
| Estratégia de versão | | |
| Política de depreciação | | |
| Contract ID | <!-- e.g. domain-capability-type@version --> | |

## Compatibilidade

| Tipo de mudança | Compatível? | Notas |
| --- | --- | --- |
| Campo opcional aditivo | | |
| Remoção de campo | | |
| Mudança de tipo | | |
| Mudança semântica | | |
| Outro | | |

Não classifique automaticamente uma mudança como breaking sem contexto de consumer e deployment.

## Rate limits

| Limite | Valor | Classificação |
| --- | --- | --- |
| | | Confirmed / Inferred / Unknown / Not Applicable |

## Limites de tamanho

| Limite | Valor | Classificação |
| --- | --- | --- |
| Tamanho de payload / message / file | | Confirmed / Inferred / Unknown / Not Applicable |
| Outro | | |

## Considerações de segurança

| Tópico | Resumo | Classificação |
| --- | --- | --- |
| Sensibilidade dos dados | | Confirmed / Inferred / Unknown / Not Applicable |
| Criptografia em trânsito | | |
| Criptografia em repouso | | |
| Tratamento de PII / secrets | <!-- references only; never embed secrets --> | |
| Outro | | |

## Observabilidade

| Sinal | O que observar | Classificação |
| --- | --- | --- |
| Logs | | Confirmed / Inferred / Unknown / Not Applicable |
| Metrics | | |
| Traces | | |
| Correlação / IDs | | |

## Exemplos

### Exemplo — sucesso

```text
<!-- representative example without secrets or sensitive data -->
```

### Exemplo — erro

```text
<!-- representative example -->
```

## Cenários de falha

| Cenário | Impacto | Comportamento esperado | Mitigação | Classificação |
| --- | --- | --- | --- | --- |
| | | | | Confirmed / Inferred / Unknown / Not Applicable |

## Componentes relacionados

| Componente | Relacionamento | Path / ID |
| --- | --- | --- |
| | producer / consumer / depends-on | |

## Arquitetura relacionada

| Documento | Path |
| --- | --- |
| Visão geral de arquitetura | |
| Contexto do sistema | |
| Fluxo de dados / sequência | |

## ADRs relacionados

| ADR | Relevância | Path |
| --- | --- | --- |
| | | |
