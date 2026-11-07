# Identidade de Documentos

> Language: pt-BR | [English (EN)](../en/document-identity.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Identificadores estáveis para documentos e artefatos de engenharia relacionados. Preserve as convenções existentes de [standards.md](standards.md) e dos registros de dívida de domínio; estenda-as para inventários AI-ready.

## Princípios

1. **Estável** — IDs não mudam quando títulos ou caminhos mudam.
2. **Prefixo tipado** — o prefixo codifica o tipo do artefato.
3. **Único no projeto** — sem reuso após depreciação sem registro explícito de supersessão.
4. **Tokens de máquina em inglês** — IDs não são traduzidos ([language.md](language.md)).
5. **Linkável** — todo ID deve resolver para um documento, linha de registro ou Unknown declarado.

## Esquemas de ID de documento

| Prefixo | Artefato | Exemplo | Notas |
| --- | --- | --- | --- |
| `ARCH-XXX` | Documento de arquitetura ou item de dívida de arquitetura | `ARCH-001` | Registro de dívida usa a mesma família ([architecture-debt.md](architecture-debt.md)) |
| `CONTRACT-XXX` | Documento de contrato (id humano) | `CONTRACT-001` | Distinto da chave de contrato em runtime `name@version` |
| `OPS-XXX` | Documento de operações / confiabilidade | `OPS-001` | |
| `SEC-XXX` | Documento de segurança | `SEC-001` | Drift pode usar `SEC-DRIFT-XXX` |
| `DEC-XXX` / `ADR-XXX` | Registro de decisão | `ADR-012` | Prefira `ADR-XXX` ao usar ADRs |
| `REQ-XXX` | Requisito | `REQ-001` | Segurança: `REQ-SEC-XXX` permitido |
| `RB-XXX` / `rb-*` | Runbook | `rb-checkout-timeout` | Prefira o `rb-<short-name>` existente |
| `INC-YYYYMMDD-NN` | Incidente | `INC-20260807-01` | |
| `EVD-XXX` | Registro / documento de evidência | `EVD-authn-review-20260807` | |
| `REF-XXX` | Referência / glossário / índice | `REF-001` | |
| `CTX-XXX` | Contexto / overview / AI context | `CTX-001` | |
| `DOC-XXX` | Dívida documental ou meta-doc quando necessário | `DOC-012` | ([documentation-debt.md](documentation-debt.md)) |
| `GOV-XXX` | Documento de governança / política | `GOV-001` | ([governance.md](governance.md)) |
| `VAL-XXX` / `DOC-*-*` | IDs de regra de validação | `DOC-META-001` | ([validation-rules.md](validation-rules.md)) |
| `EXC-DOC-XXX` | Exceção de documentação | `EXC-DOC-001` | ([exceptions.md](exceptions.md)) |
| `CONTRA-XXX` | Registro de contradição | `CONTRA-001` | ([contradictions/](contradictions/)) |

Preencha sufixos numéricos com zero à esquerda até três dígitos, salvo se o projeto já usar outra largura de forma consistente.

## Convenções existentes a preservar

De [standards.md](standards.md):

| Identificador | Formato | Exemplo |
| --- | --- | --- |
| ADR | `ADR-XXX` | `ADR-012` |
| Runbook | `rb-<short-name>` | `rb-checkout-timeout` |
| Incidente | `INC-YYYYMMDD-NN` | `INC-20260807-01` |
| Alerta | kebab curto ou id de monitoramento | `alert-checkout-error-rate` |
| Modo de falha | kebab curto | `fm-payment-timeout` |
| Contrato (runtime) | `name@version` | `order-created@v1` |
| Componente | nome estável local ou `CMP-XXX` | `checkout-api`, `CMP-001` |
| Serviço | nome estável local ou `SVC-XXX` | `checkout-api`, `SVC-001` |
| Ameaça | `THR-XXX` ou kebab | `THR-012` |
| Risco de segurança | `RISK-XXX` | `RISK-007` |
| Controle de segurança | `CTRL-XXX` | `CTRL-015` |
| Vulnerabilidade | `VULN-XXX` | `VULN-042` |
| Exceção de segurança | `EXC-XXX` | `EXC-004` |
| Ativo de segurança | `AST-XXX` | `AST-011` |
| Teste de segurança | `SECTEST-XXX` | `SECTEST-002` |

## ID de documento vs ID de contrato em runtime

| Tipo | Exemplo | Use para |
| --- | --- | --- |
| ID de documento | `CONTRACT-001` | Metadata `id`, links entre docs, manifest |
| Chave de contrato em runtime | `order-created@v1` | Compatibilidade, versionamento, binding producer/consumer |

Nunca colapse os dois sem uma tabela de mapeamento explícita.

## IDs de componente vs serviço

- Componentes: unidades arquiteturais ([component-registry.md](component-registry.md)) — `CMP-XXX` ou nome estável.
- Serviços: unidades operáveis/implantáveis ([service-registry.md](service-registry.md)) — `SVC-XXX` ou nome estável.
- Um serviço pode *implementar* um ou mais componentes; os IDs permanecem distintos mesmo quando os nomes coincidem.

## Regras de atribuição

1. Atribua `id` quando o documento se tornar substantivo (não notas descartáveis).
2. Registre o ID no YAML frontmatter e, opcionalmente, no título (`ARCH-001 — Checkout Overview`).
3. Em supersessão, mantenha o ID antigo; aponte `replaced_by` para o novo ID.
4. Não recicle IDs.

## Documentos relacionados

- [document-metadata.md](document-metadata.md)
- [document-types.md](document-types.md)
- [standards.md](standards.md)
- [manifest-rules.md](manifest-rules.md)
