# Segurança Testing

> Language: pt-BR | [English](../en/security-testing.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Estratégias conceituais para **security testing** — não um mandato para qualquer scanner, plataforma ou vendor.

Documente o que o projeto realmente pratica. Marque **Not Applicable** ou **Not Defined** quando uma estratégia não for usada. Não invente nomes de tools ou gates de pass/fail que não existam.

## Por que strategies (não recipes)

Segurança testing responde: *Nossos controls e assumptions se sustentam contra threats relevantes?* A documentação deve capturar **intent e coverage**, não scripts universais de ataque ou PoCs de exploit.

## Catálogo de strategies (exemplos — não exaustivo)

| Strategy | Intent | Typical evidence |
| --- | --- | --- |
| **SAST** | Encontrar fraquezas em source/bytecode sem rodar o sistema completo | Resumo de resultado de pipeline, finding IDs |
| **DAST** | Encontrar fraquezas via interfaces em execução | Notas de teste, findings com escopo |
| **Dependency / SCA** | Issues conhecidas em components de terceiros | Inventário + triage de findings — [dependency-security.md](dependency-security.md) |
| **Secret detection** | Encontrar credentials vazadas em repos/artifacts | Finding + refs de registro de rotation — sem valores secretos |
| **IaC / config review** | Misconfiguration em infrastructure-as-code ou policies | Notas de review, links de control |
| **Threat-driven tests** | Verificar mitigations para threats específicas | Threat IDs linkados + outcome do teste |
| **Authn / authz tests** | Verificar comportamento de identity e permission | Registros de teste de contract/security |
| **Abuse / rate-limit tests** | Verificar controls de abuse nas boundaries | Contract + notas de teste — [contract-security.md](contract-security.md) |
| **Manual review** | Análise humana de caminhos sensíveis | Data do review, scope, owner |
| **Penetration test** | Assessment adversarial com prazo (quando usado) | Referência de report, scope, data — sem dumps de exploit em docs |

Projetos podem usar outros nomes. Mapeie termos locais uma vez. **Nenhuma tool específica é exigida** por este padrão.

## O que documentar por strategy usada

| Field | Content |
| --- | --- |
| Strategy | Nome (SAST, DAST, …) |
| Scope | O que é coberto / excluído |
| Frequency | Continuous / periodic / ad hoc / never |
| Owner | Quem desenha e interpreta resultados |
| Linked threats / controls / requirements | IDs e links |
| Last executed | Data ou Unknown |
| How findings enter vuln process | [vulnerability-management.md](vulnerability-management.md) |
| Classification | Confirmed / Inferred / Unknown / Proposed |

Use [templates/security-test.md](templates/security-test.md).

## Regras

- Só conceitual — **sem comandos universais de scanner** neste padrão.
- Não afirme “secure” só porque uma tool rodou.
- Achados são inputs para triage — não verdade automática de severity.
- Nunca cole valores secretos, PoCs completos de exploit ou PII desnecessário na documentação.
- Alinhe testes a [threat-modeling.md](threat-modeling.md) e [secure-development.md](secure-development.md).

## Documentos relacionados

- [vulnerability-management.md](vulnerability-management.md)
- [secure-development.md](secure-development.md)
- [dependency-security.md](dependency-security.md)
- [supply-chain-security.md](supply-chain-security.md)
- [security-evidence.md](security-evidence.md)
- [security-readiness.md](security-readiness.md)
- [reliability-testing.md](reliability-testing.md)
