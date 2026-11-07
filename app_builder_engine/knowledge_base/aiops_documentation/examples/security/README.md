# Security Examples / Exemplos de Segurança

> **Fictional examples** / **Exemplos ficcionais** for the Security methodology (Documentation Standard v1.0).
>
> None of these documents describe a real project. / Nenhum destes documentos descreve um projeto real.

Standalone samples using the shared security templates (plus a short Potential Finding–style review note).  
Amostras autônomas usando os templates de segurança compartilhados (mais uma nota curta de revisão no estilo Potential Finding).

Choose a language / Escolha um idioma — each type has `en/` and `pt-BR/`:

| Type / Tipo | What it demonstrates / O que demonstra | EN | pt-BR |
| --- | --- | --- | --- |
| [asset/](asset/) | Catalog pricing-tier data asset (Internal) / Ativo de dados de faixas de preço do catálogo (Internal) | [en/asset.md](asset/en/asset.md) | [pt-BR/asset.md](asset/pt-BR/asset.md) |
| [threat/](threat/) | Bulk enumeration via public edge / Enumeração em massa via borda pública | [en/threat.md](threat/en/threat.md) | [pt-BR/threat.md](threat/pt-BR/threat.md) |
| [risk/](risk/) | Exposure of internal pricing tiers / Exposição de faixas de preço internas | [en/risk.md](risk/en/risk.md) | [pt-BR/risk.md](risk/pt-BR/risk.md) |
| [requirement/](requirement/) | Authenticated admin write requirement / Requisito de escrita admin autenticada | [en/requirement.md](requirement/en/requirement.md) | [pt-BR/requirement.md](requirement/pt-BR/requirement.md) |
| [control/](control/) | Edge auth for admin routes / Auth na borda para rotas admin | [en/control.md](control/en/control.md) | [pt-BR/control.md](control/pt-BR/control.md) |
| [vulnerability/](vulnerability/) | Overly permissive preview CORS (mitigated) / CORS permissivo em preview (mitigado) | [en/vulnerability.md](vulnerability/en/vulnerability.md) | [pt-BR/vulnerability.md](vulnerability/pt-BR/vulnerability.md) |
| [exception/](exception/) | Time-bounded public read without auth / Leitura pública sem auth com prazo | [en/exception.md](exception/en/exception.md) | [pt-BR/exception.md](exception/pt-BR/exception.md) |
| [incident/](incident/) | Suspected abuse of public lookup rate / Suspeita de abuso da taxa de lookup público | [en/incident.md](incident/en/incident.md) | [pt-BR/incident.md](incident/pt-BR/incident.md) |
| [security-test/](security-test/) | Dependency SCA strategy record / Registro de estratégia SCA de dependências | [en/security-test.md](security-test/en/security-test.md) | [pt-BR/security-test.md](security-test/pt-BR/security-test.md) |
| [security-review/](security-review/) | Potential Finding–style review note / Nota de revisão no estilo Potential Finding | [en/security-review.md](security-review/en/security-review.md) | [pt-BR/security-review.md](security-review/pt-BR/security-review.md) |

Methodology / Metodologia:

| EN | pt-BR |
| --- | --- |
| [docs/en/security-model.md](../../docs/en/security-model.md) | [docs/pt-BR/security-model.md](../../docs/pt-BR/security-model.md) |
| [docs/en/threat-modeling.md](../../docs/en/threat-modeling.md) | [docs/pt-BR/threat-modeling.md](../../docs/pt-BR/threat-modeling.md) |
| [docs/en/security/README.md](../../docs/en/security/README.md) | [docs/pt-BR/security/README.md](../../docs/pt-BR/security/README.md) |

Progressive chain / Cadeia progressiva: **Architecture → Trust Boundaries → Assets → Threats → Controls → Operations → Response**.

Use them to see how assets, threats, risks, requirements, controls, vulnerabilities, exceptions, incidents, tests, and review notes look when filled — not as production copy-paste.  
Use-os para ver como ficam ativos, ameaças, riscos, requisitos, controles, vulnerabilidades, exceções, incidentes, testes e notas de revisão preenchidos — não como documentação de produção para copiar e colar.
