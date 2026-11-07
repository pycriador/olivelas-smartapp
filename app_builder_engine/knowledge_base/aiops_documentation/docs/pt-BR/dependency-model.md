# Modelo de dependência

> Language: pt-BR | [English](../en/dependency-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


Como documentar dependências entre components, services, contracts e nós de documentação.

## Tipos de dependência

| Kind | Meaning | Typical edge |
| --- | --- | --- |
| **Runtime** | A precisa de B disponível para servir tráfego | service → service / datastore |
| **Build / compile** | A precisa de B para build | component → library |
| **Contract** | A fala a interface de B | service → contract |
| **Operational** | A precisa de B para operar (pager, pipeline, queue) | [operational-dependencies.md](operational-dependencies.md) |
| **Documentation** | Doc A fica incorreto/incompleto sem B | [documentation-dependencies.md](documentation-dependencies.md) |

## Direção

Sempre registre **dependent → dependency** (seta em direção ao que é necessário), consistente com [component-relationships.md](component-relationships.md).

## Registro mínimo de dependência

| Campo | Significado |
| --- | --- |
| From | Component/service/doc id |
| To | Dependency id |
| Kind | Runtime / Build / Contract / Operational / Documentation |
| Criticality | Impact if dependency fails (or Unknown) |
| Evidence | Path or Confirmed/Inferred/Unknown |
| Classification | Evidence classification |

## Regras

1. Dependência de runtime não documentada descoberta no código → registre; classifique com honestidade.
2. Não invente vendors ou serviços externos.
3. Dependências cíclicas podem ser *documentadas*, mas devem ser sinalizadas como risk/debt quando estruturais.

## Documentos relacionados

- [change-impact.md](change-impact.md)
- [dependency-reliability.md](dependency-reliability.md)
- [documentation-dependencies.md](documentation-dependencies.md)

