# Segurança

> Language: pt-BR | [English (EN)](../../en/security/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Categoria para documentação de segurança em projetos em adoção, além da metodologia de Segurança definida por este padrão.

## Objetivo

Descrever o que deve ser protegido, de quê, como e com qual evidência — sem inventar controles, permissões, certificações de compliance ou vulnerabilidades.

## Integração

```text
Architecture (structure, trust, data flows)
        │
        ├── Contracts (authn/authz, sensitive fields at boundaries)
        │
        └── Operations (monitor, incident, recover)
                │
                ▼
            Security
```

Prefira links a duplicação:

- Arquitetura é dona dos diagramas e da estrutura de componentes — [../architecture-model.md](../architecture-model.md), [../trust-boundaries.md](../trust-boundaries.md)
- Contratos é dona das regras de segurança de interface — [../contract-security.md](../contract-security.md)
- Operações é dona dos runbooks e dos incidentes operacionais — [../operations-security.md](../operations-security.md), [../security-incidents.md](../security-incidents.md)

## Orientação

- Nunca armazene valores secretos na documentação.
- Documente nome da configuração, propósito, origem e se é obrigatória.
- Prefira evidência Confirmed para afirmações de segurança antes de aceitar o documento.
- Marque Unknown / Not Defined com honestidade.
- Não invente compliance, certificações ou mapeamentos regulatórios.

## Metodologia (Documentation Standard)

### Modelo

| Documento | Propósito |
| --- | --- |
| [../security-model.md](../security-model.md) | Assets→Threats→Risk→Requirements→Controls→Evidence→Monitoring→Response→Review |
| [../security-scope.md](../security-scope.md) | Dentro / fora de escopo |
| [../security-ownership.md](../security-ownership.md) | Owners de segurança / sistema / técnico / dados / operacional / incidente |

### Ativos

| Documento | Propósito |
| --- | --- |
| [../security-classification.md](../security-classification.md) | Modelos de classificação de dados/sistema |
| [../security-assets.md](../security-assets.md) | Orientação de catálogo de ativos |
| [../templates/security-asset.md](../templates/security-asset.md) | Template de ativo |

### Ameaças

| Documento | Propósito |
| --- | --- |
| [../threat-modeling.md](../threat-modeling.md) | System→Assets→Trust Boundaries→Threats→Risk→Mitigations |
| [../threat-actors.md](../threat-actors.md) | Categorias de ator (exemplos) |
| [../attack-surface.md](../attack-surface.md) | Exposed / Internal / Restricted / Unknown |
| [../templates/threat.md](../templates/threat.md) | Template de ameaça |

### Riscos

| Documento | Propósito |
| --- | --- |
| [../security-risk-model.md](../security-risk-model.md) | Likelihood, impact, severity, confidence, residual risk |
| [../templates/security-risk.md](../templates/security-risk.md) | Template de risco |
| [../security-debt.md](../security-debt.md) | Registro de dívida de segurança |
| [../security-drift.md](../security-drift.md) | Documentado ≠ segurança real |

### Requisitos

| Documento | Propósito |
| --- | --- |
| [../security-requirements.md](../security-requirements.md) | Authn/authz/confidentiality/integrity/availability/privacy/auditability |
| [../templates/security-requirement.md](../templates/security-requirement.md) | Template de requisito |
| [../security-exceptions.md](../security-exceptions.md) | Requirement/reason/risk/compensating/owner/approval/expiration |

### Controles

| Documento | Propósito |
| --- | --- |
| [../security-controls.md](../security-controls.md) | Preventive / Detective / Corrective / Compensating |
| [../templates/security-control.md](../templates/security-control.md) | Template de controle |
| [../security-evidence.md](../security-evidence.md) | Evidence + princípios de Evidence Integrity |
| [../least-privilege.md](../least-privilege.md) | Menor privilégio |
| [../privileged-access.md](../privileged-access.md) | Acesso privilegiado |
| [../encryption.md](../encryption.md) | Transit / rest / application-level |
| [../key-management.md](../key-management.md) | Gestão de chaves (conceitual) |

### Identidade

| Documento | Propósito |
| --- | --- |
| [../identity.md](../identity.md) | Authentication vs Authorization |
| [../authentication.md](../authentication.md) | Mecanismos de autenticação |
| [../authorization.md](../authorization.md) | O que é permitido |

### Dados

| Documento | Propósito |
| --- | --- |
| [../data-security.md](../data-security.md) | Collection→…→Deletion |
| [../privacy.md](../privacy.md) | Privacidade sem legislação assumida |
| [../data-retention.md](../data-retention.md) | Retenção ou Not Defined |
| [../secure-logging.md](../secure-logging.md) | Sem secrets/PII em logs |
| [../auditability.md](../auditability.md) | Auditabilidade |

### Segredos

| Documento | Propósito |
| --- | --- |
| [../secrets-management.md](../secrets-management.md) | Nunca armazene valores secretos |
| [../secret-exposure.md](../secret-exposure.md) | Detection→…→Root Cause |

### Vulnerabilidades

| Documento | Propósito |
| --- | --- |
| [../vulnerability-management.md](../vulnerability-management.md) | Ciclo de vida Identify→Close |
| [../templates/vulnerability.md](../templates/vulnerability.md) | Template de vulnerabilidade |
| [../dependency-security.md](../dependency-security.md) | Segurança de dependências |
| [../supply-chain-security.md](../supply-chain-security.md) | Segurança da cadeia de suprimentos |
| [../templates/security-exception.md](../templates/security-exception.md) | Template de exceção |

### Incidentes

| Documento | Propósito |
| --- | --- |
| [../security-incidents.md](../security-incidents.md) | Operational / Segurança / Both |
| [../templates/security-incident.md](../templates/security-incident.md) | Template de incidente de segurança |
| [../security-monitoring.md](../security-monitoring.md) | vs monitoramento operacional |
| [../templates/security-alert.md](../templates/security-alert.md) | Template de alerta de segurança |
| [../operations-security.md](../operations-security.md) | Mecanismos compartilhados de ops uma vez |

### Testes

| Documento | Propósito |
| --- | --- |
| [../security-testing.md](../security-testing.md) | SAST/DAST/etc conceitual |
| [../templates/security-test.md](../templates/security-test.md) | Template de teste de segurança |
| [../secure-development.md](../secure-development.md) | Expectativas do ciclo de vida de desenvolvimento seguro |

### Arquitetura e contratos

| Documento | Propósito |
| --- | --- |
| [../security-architecture.md](../security-architecture.md) | Trust, Identity, Access, Data Flow, Controls, Exposure, Deps |
| [../trust-boundaries.md](../trust-boundaries.md) | Trust boundaries (arquitetura + segurança) |
| [../contract-security.md](../contract-security.md) | Tópicos de segurança na fronteira do contrato |

### Prontidão

| Documento | Propósito |
| --- | --- |
| [../security-readiness.md](../security-readiness.md) | Conceito de prontidão de segurança |
| [../security-readiness-checklist.md](../security-readiness-checklist.md) | Checklist de lançamento / prontidão de segurança |
| [../security-checklist.md](../security-checklist.md) | Checklist de qualidade da documentação de segurança |
| [../templates/security.md](../templates/security.md) | Template de visão geral de segurança |

## Templates (lista rápida)

| Template | Uso |
| --- | --- |
| [security.md](../templates/security.md) | Visão geral da postura de segurança |
| [security-asset.md](../templates/security-asset.md) | Um ativo |
| [threat.md](../templates/threat.md) | Uma ameaça |
| [security-risk.md](../templates/security-risk.md) | Um risco |
| [security-requirement.md](../templates/security-requirement.md) | Um requisito |
| [security-control.md](../templates/security-control.md) | Um controle |
| [security-alert.md](../templates/security-alert.md) | Alerta de segurança |
| [vulnerability.md](../templates/vulnerability.md) | Registro de vulnerabilidade |
| [security-exception.md](../templates/security-exception.md) | Exceção de segurança |
| [security-incident.md](../templates/security-incident.md) | Incidente de segurança |
| [security-test.md](../templates/security-test.md) | Estratégia/registro de teste de segurança |

## Relacionados

- [../quality-model.md](../quality-model.md) — dimensões de qualidade de segurança
- [../ai-documentation.md](../ai-documentation.md) — regras de análise de segurança por IA
- [../standards.md](../standards.md) — IDs de segurança, severity, naming de evidence
- [../operations/README.md](../operations/README.md) — metodologia de operations
- [../contracts/README.md](../contracts/README.md) — metodologia de contracts
- [../architecture/README.md](../architecture/README.md) — metodologia de architecture
