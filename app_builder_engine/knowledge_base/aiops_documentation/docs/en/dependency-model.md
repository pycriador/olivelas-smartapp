# Dependency Model

> Language: EN | [Português (pt-BR)](../pt-BR/dependency-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


How to document dependencies among components, services, contracts, and documentation nodes.

## Dependency Kinds

| Kind | Meaning | Typical edge |
| --- | --- | --- |
| **Runtime** | A needs B available to serve traffic | service → service / datastore |
| **Build / compile** | A needs B to build | component → library |
| **Contract** | A speaks B’s interface | service → contract |
| **Operational** | A needs B to operate (pager, pipeline, queue) | [operational-dependencies.md](operational-dependencies.md) |
| **Documentation** | Doc A is incorrect/incomplete without B | [documentation-dependencies.md](documentation-dependencies.md) |

## Direction

Always record **dependent → dependency** (arrow toward what is needed), consistent with [component-relationships.md](component-relationships.md).

## Minimum Dependency Record

| Field | Meaning |
| --- | --- |
| From | Component/service/doc id |
| To | Dependency id |
| Kind | Runtime / Build / Contract / Operational / Documentation |
| Criticality | Impact if dependency fails (or Unknown) |
| Evidence | Path or Confirmed/Inferred/Unknown |
| Classification | Evidence classification |

## Rules

1. Undocumented runtime dependency discovered in code → register; classify honestly.
2. Do not invent external vendors or services.
3. Cyclic dependencies are allowed to *document* but should be flagged as risk/debt when structural.

## Related Documents

- [change-impact.md](change-impact.md)
- [dependency-reliability.md](dependency-reliability.md)
- [documentation-dependencies.md](documentation-dependencies.md)
