# Referências de Evidência

> Language: pt-BR | [English (EN)](../en/evidence-references.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0


Como apontar de um claim para o artefato que o sustenta.

## Formas Preferidas de Referência

| Tipo de evidência | Forma preferida | Exemplo |
| --- | --- | --- |
| Arquivo-fonte | Caminho relativo ao repositório **e** URL `blob` do GitHub (+ símbolo / `#Lstart-Lend` quando estável) | `src/checkout/service.ts` · [blob](https://github.com/org/repo/blob/main/src/checkout/service.ts#L40-L55) |
| Config | Caminho + nome da chave (nunca valor secreto) + link blob ao citar | `deploy/values.yaml` → `replicaCount` |
| Contrato | Link do doc de contrato + chave de runtime | [order-created](contracts/) · `order-created@v1` |
| Teste | Caminho do teste + link blob ao citar | `tests/contract/order_created_test.go` |
| ADR | `ADR-XXX` + link | `ADR-012` |
| IaC / manifesto | Caminho ou id nomeado do recurso + link blob ao citar | `infra/checkout/main.tf` |
| Ticket | Id estável ou URL | `JIRA-1234` |
| Incidente | Id do incidente + link | `INC-20260807-01` |
| Métrica / dashboard | Nome estável + link se disponível | `checkout.error_rate` |
| Spec externa | Nome + versão + URL | OpenAPI 3.1 (caminho da cópia no projeto preferido) |
| Repo GitHub externo | `org/repo` curto uma vez; depois caminho + blob — [publishing-surfaces.md](publishing-surfaces.md) | [loft-br/k8s-apps](https://github.com/loft-br/k8s-apps) |

## Forma do Registro de Evidência

Ao registrar evidência explicitamente (tabelas ou docs do tipo Evidence):

| Campo | Obrigatório | Significado |
| --- | --- | --- |
| `evidence_id` | Recommended | ex. `EVD-...` |
| `claim_id` / texto do claim | Yes | O que está sendo sustentado |
| `reference` | Yes | Caminho, id ou link (para código: caminho **e** URL blob do GitHub) |
| `collected_on` | Recommended | `YYYY-MM-DD` |
| `classification` | Yes | Confirmed / Inferred / … |
| `notes` | Optional | Limites da evidência |

## Regras

1. Referências vagas (“configurado em algum lugar”) são inválidas para claims Confirmed.
2. Datas de evidência antigas são sinal de freshness ([documentation-freshness.md](documentation-freshness.md)).
3. Não cole valores de segredo, credenciais ou PII desnecessário nos campos de evidência ([ai-context-safety.md](ai-context-safety.md)).
4. Se a evidência não puder ser citada, o claim é no máximo Inferred — em geral Unknown.
5. Ao citar código ou config do GitHub, inclua localização (caminho / linhas) e URL blob — [publishing-surfaces.md](publishing-surfaces.md).

## Documentos relacionados

- [evidence-model.md](evidence-model.md)
- [claims.md](claims.md)
- [security-evidence.md](security-evidence.md)
- [standards.md](standards.md)
- [publishing-surfaces.md](publishing-surfaces.md)
