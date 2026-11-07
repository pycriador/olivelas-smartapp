# Rastreabilidade de Arquitetura

> Language: pt-BR | [English](../en/architecture-traceability.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como conectar requisitos, arquitetura, componentes, contratos e implementação para que engenheiros possam responder de onde veio uma decisão e o que ela afeta.

Rastreabilidade **não** precisa ser perfeita ou completa para todo projeto. Prefira links úteis a matrizes pesadas.

## Cadeia de rastreio

```text
Requirement
    ↓
Architecture
    ↓
Component
    ↓
Contract
    ↓
Implementation
```

| Estágio | Artefato típico |
| --- | --- |
| **Requirement** | Necessidade de produto, SLO, restrição de compliance, mandato de plataforma, contexto de ADR |
| **Arquitetura** | Overview, fronteiras, diagramas, atributos de qualidade, restrições |
| **Component** | Docs de arquitetura de componente, mapas de relacionamento |
| **Contract** | Contratos de API/evento/mensagem/arquivo/CLI |
| **Implementation** | Código, config, caminhos de IaC citados como evidência |

Cadeia de ADR relacionada frequentemente usada na prática:

```text
Architecture → Decision (ADR) → Component → Contract
```

Arquitetura descreve *o que existe*. ADRs explicam *por quê*. Contratos definem *como as partes se comunicam*. Implementação é evidência.

## Perguntas que a rastreabilidade deve suportar

1. **Origin:** De onde veio esta decisão ou estrutura arquitetural?
2. **Impact:** Quais componentes (e contratos) são afetados por esta decisão ou mudança?

Opcionais, mas valiosos:

3. Quais requisitos ou restrições ainda justificam esta estrutura?
4. Quais caminhos de implementação comprovam a documentação (Confirmed)?

## Mecanismos leves

Use o mecanismo mais leve que funcione:

| Mecanismo | Quando |
| --- | --- |
| Links relativos em seções Related | Padrão para a maioria dos projetos |
| Campos `Affected components` / `Affected contracts` do ADR | Decisões com impacto estrutural |
| Pequena tabela de rastreio no overview de arquitetura | Poucos requisitos críticos |
| IDs de issue/ticket | Quando o tracker é a fonte da verdade do requisito |
| Matriz RTM completa | Apenas quando compliance ou escala exigir |

Exemplo de tabela mínima:

| Requirement / constraint | Arquitetura element | Components | Contract | Evidence |
| --- | --- | --- | --- | --- |
| Atualizações assíncronas de inventário | Event boundary | `inventory-projector` | `inventory-adjusted@v1` | `src/...`, ADR-001 |

## Regras

1. Não invente requisitos para preencher a cadeia. Marque Unknown.
2. Não alegue links de implementação Confirmed sem um caminho ou teste.
3. Prefira um link canônico de ADR a repetir a racional da decisão em todo doc de componente.
4. Quando um contrato mudar, atualize links reversos da arquitetura/componentes como parte de [architecture-review.md](architecture-review.md).
5. Arquitetura Proposed não deve ser rastreada como se fosse estado atual.

## Progressive disclosure

| Tamanho do projeto | Expectativa |
| --- | --- |
| Small | Links entre overview, um ADR, contrato principal |
| Medium | Links ADR ↔ component ↔ contract para decisões materiais |
| Large / regulated | Tabelas de rastreio explícitas para caminhos críticos; ainda assim evite documentar toda classe |

## Documentos relacionados

- [architecture-model.md](architecture-model.md)
- [architecture-vs-implementation.md](architecture-vs-implementation.md)
- [architecture-review.md](architecture-review.md)
- [decisions/README.md](decisions/README.md)
- [contracts/README.md](contracts/README.md)
- [templates/adr.md](templates/adr.md)
