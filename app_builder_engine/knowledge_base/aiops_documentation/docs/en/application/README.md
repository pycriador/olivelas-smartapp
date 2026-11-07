# Application

> Language: EN | [Português (pt-BR)](../../pt-BR/application/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Category for application component documentation in adopting projects.

## Objective

Describe application components, responsibilities, interfaces, configuration, and operational considerations.

## Guidance

- One component document per meaningful deployable or logical unit.
- Keep documentation near the component when the repository layout allows.
- Separate responsibilities from non-responsibilities.
- Link contracts instead of duplicating them.

## Suggested Contents

| Document | Purpose |
| --- | --- |
| `components/<name>.md` | Component documentation |
| Integration notes | Cross-component interactions when not covered by contracts |

## Templates

- [../templates/component.md](../templates/component.md)
- [../templates/integration.md](../templates/integration.md)
