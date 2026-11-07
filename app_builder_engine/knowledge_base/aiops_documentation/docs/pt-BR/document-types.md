# Tipos de documento

> Language: pt-BR | [English](../en/document-types.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Vocabulário controlado para o campo de metadados `type` e para classificar nós de conhecimento no documentation graph.

## Tipos permitidos

| Type | Purpose | Typical ID prefix |
| --- | --- | --- |
| **Context** | Problema, escopo, atores, entrada de IA, overview progressivo | `CTX-` |
| **Arquitetura** | Estrutura, boundaries, components, diagramas, constraints | `ARCH-` |
| **Contract** | Specs de API / event / message / file e boundaries relacionados | `CONTRACT-` |
| **Operation** | Como o sistema é operado, observado, escalado, alterado | `OPS-` |
| **Segurança** | Assets, threats, controls, identity, proteção de dados | `SEC-` |
| **Decision** | ADRs e escolhas significativas | `ADR-` / `DEC-` |
| **Requirement** | Requirements funcionais ou não funcionais | `REQ-` |
| **Runbook** | Procedimento operacional executável | `rb-` |
| **Incident** | Registro de incidente / timeline / ligação a PIR | `INC-` |
| **Evidence** | Pacotes de evidência, registros de verificação | `EVD-` |
| **Reference** | Glossários, índices, ponteiros de standards, cheat-sheets | `REF-` |

## Regras de seleção de tipo

1. Escolha o propósito **primário** do documento. Um runbook de segurança é `Runbook` com tags/links de security — ou `Security` se for política, não procedimento.
2. Não invente nomes de tipo paralelos (`ArchDoc`, `ops-guide`).
3. Templates e hubs README podem omitir `type` quando forem só navegacionais; prefira `Reference` quando inventariados.
4. Páginas do padrão AI-ready neste repositório usam `Reference` (meta-standard) a menos que sejam Context (`ai-context.md`).

## Mapeamento para categorias existentes

| Category | Primary types |
| --- | --- |
| Governance / lifecycle | Reference, Decision |
| Arquitetura methodology | Arquitetura, Context |
| Contratos methodology | Contract |
| Operações & reliability | Operation, Runbook, Incident |
| Segurança methodology | Segurança, Evidence, Requirement |
| AI-ready | Context, Reference, Evidence |

## Anti-padrões

- Um arquivo reivindicando todos os tipos
- Usar `Reference` para esconder ausência de docs Arquitetura ou Contract
- Tratar transcripts de chat como `Evidence` sem um registro de evidência

## Documentos relacionados

- [document-identity.md](document-identity.md)
- [document-metadata.md](document-metadata.md)
- [documentation-graph.md](documentation-graph.md)

