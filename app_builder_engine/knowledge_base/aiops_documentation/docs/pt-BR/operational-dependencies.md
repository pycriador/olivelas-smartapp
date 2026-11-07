# Dependências Operacionais

> Language: pt-BR | [English](../en/operational-dependencies.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Kinds de dependências que importam para operar um sistema — além de “serviço A chama serviço B”.

Docs de arquitetura frequentemente enfatizam arestas de runtime. Operadores também precisam de dependências de build, deployment e operacionais. Marque kinds como **Not Applicable** quando não existirem no projeto.

## Kinds de dependência

| Kind | Meaning | Examples (agnostic) |
| --- | --- | --- |
| **Runtime** | Necessária ao servir ou processar | Datastores, brokers, identity, peer APIs |
| **Build** | Necessária para produzir artifacts | Sistema de CI, artifact registry, compilers, módulos privados |
| **Deployment** | Necessária para release ou configure | Pipeline de deploy, APIs de ambiente, entrega de config/secret |
| **Operational** | Necessária para observar, diagnosticar ou recuperar | Backends de logging/metrics, paging, store de runbooks, tooling de backup |

Um único sistema externo pode aparecer em mais de um kind (ex.: identity usado em runtime e no deploy).

## O que documentar

| Dependency | Kind | Criticality | Owner | Failure Impact | Notes |
| --- | --- | --- | --- | --- | --- |
| | Runtime / Build / Deployment / Operational | | | | |

Para tratamento profundo de reliability de deps de runtime (e outras materiais), use [dependency-reliability.md](dependency-reliability.md).

## Por que separar kinds

| Kind | Typical failure symptom | Who feels it first |
| --- | --- | --- |
| Runtime | Erros voltados ao usuário, lag | On-call / usuários |
| Build | Não consegue produzir um release | Developers |
| Deployment | Não consegue shipar ou fazer roll back | Release owner |
| Operational | Cego enquanto o sistema ainda pode rodar | On-call (perigoso) |

Um outage de dependência operacional (sem métricas) pode coexistir com runtime verde — documente a detecção de “estamos cegos”.

## Integração

| View | Relationship |
| --- | --- |
| Arquitetura dependencies | Principalmente runtime / data — [component-relationships.md](component-relationships.md) |
| Contratos | Regras de interação de runtime — [contract-model.md](contract-model.md) |
| Ownership | [operational-ownership.md](operational-ownership.md) |
| Observability backends | Deps operacionais — [observability-model.md](observability-model.md) |

## Anti-padrões

- Documentar só logos de vendor cloud sem kind ou impacto.
- Ignorar dependências operacionais para que incidentes comecem com “dashboards vazios”.
- Tratar tools só de build como SPOFs de runtime (ou vice-versa) sem esclarecimento.

## Documentos relacionados

- [dependency-reliability.md](dependency-reliability.md)
- [reliability-model.md](reliability-model.md)
- [operational-ownership.md](operational-ownership.md)
- [operations-model.md](operations-model.md)
