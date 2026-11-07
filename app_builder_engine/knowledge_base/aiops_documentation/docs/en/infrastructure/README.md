# Infrastructure

> Language: EN | [Português (pt-BR)](../../pt-BR/infrastructure/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Category for infrastructure and resource documentation in adopting projects.

## Objective

Describe environments, resources, provisioning, networking boundaries relevant to operation, and infrastructure constraints.

## Guidance

- Remain technology-agnostic at the structural level.
- Document what exists today; label future topology as Proposed.
- Reference IaC/manifest paths as evidence.
- Do not store credentials or secret values.

## Suggested Contents

| Topic | Examples of what to capture |
| --- | --- |
| Environments | names, purpose, promotion flow |
| Resources | compute, storage, queues, registries — as applicable |
| Provisioning | how infrastructure is defined and applied |
| Constraints | quotas, regions, isolation model |

No universal cloud, container, or orchestrator requirement is implied by this category.
