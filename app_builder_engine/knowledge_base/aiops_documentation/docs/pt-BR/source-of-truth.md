# Fonte de Verdade

> Language: pt-BR | [English (EN)](../en/source-of-truth.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0


Qual artefato é authoritative para cada tipo de informação, e como resolver conflitos.

## Autoridade por Tipo de Informação

| Informação | Fonte Authoritative | Papel da documentação |
| --- | --- | --- |
| Comportamento em runtime | Código + config implantada + runtime observável | Descrever e citar; não inventar |
| Forma de API pública / evento | Schema canônico + doc de contrato | O doc de contrato deve acompanhar o schema |
| Intenção / restrições de arquitetura | ADRs Accepted + docs de arquitetura | Docs explicam; ADR decide |
| Procedimento operacional | Runbook Accepted | O runbook deve corresponder às ferramentas reais |
| Níveis de serviço | Definições Accepted de SLO/SLI | A implementação de métricas deve corresponder às definições |
| Controles de segurança em vigor | Controles implementados + docs de segurança Accepted | Nunca afirmar controles não verificados |
| Ownership | Metadados de ownership / registry de times | Prefira ids duráveis de time |
| Fatos de incidente | Registro de incidente + tags de timeline | Hipóteses permanecem rotuladas |
| Segredos | Referências a secret manager / Vault | Docs armazenam **nomes**, nunca valores |
| O próprio padrão de documentação | Docs ACCEPTED deste repositório | Docs de projeto não devem fazer fork silenciosamente |
| Comportamento atual do sistema após uma entrega | Docs duráveis no branch padrão (as-is, ADR, contrato, runbook) | Andaime de execução (spec, RFC, plano de tasks) não é SoT |
| Páginas publicadas no Confluence | O mesmo Markdown após `docs-sync` (só ida) | Links navegáveis no Confluence + origem/código no GitHub — [publishing-surfaces.md](publishing-surfaces.md) |

Veja também SoT específica de domínio: [contract-source-of-truth.md](contract-source-of-truth.md).

## Andaime de execução vs conhecimento durável

Uma spec, RFC ou plano de tasks é **andaime de execução**. Não é a fonte de verdade de como o sistema se comporta depois do merge.

| Camada | O que é | Onde vive | Autoridade |
| --- | --- | --- | --- |
| **Andaime de execução** | Spec, RFC, plano de tasks, sketch, relatório de rollout | Feature branch / pull request | Informational enquanto o trabalho está em andamento. Não faça merge como descrição do comportamento atual. |
| **Conhecimento durável** | Docs as-is, ADRs, contratos, runbooks, `ai-context.md` | Branch padrão (`main`) | Authoritative só depois do ciclo usual (`DRAFT` → `REVIEW` → `ACCEPTED`) |
| **Exceção explícita de backlog** | Discovery ainda não iniciado (path opcional como `docs/specs/backlog/`) | Branch padrão só se rotulado como backlog, não as-is | **Não** descreve o código atual. Faxina futura de specs deve pular ou relabelar. |

Quando a entrega termina:

1. Atualize o documento durável canônico, ou abra [dívida de documentação](documentation-debt.md).
2. Não deixe a spec como o registro do que o sistema faz.
3. Não aponte comentários de código ou docstrings para arquivos de andaime que serão apagados.

Como o time escreve specs antes de codar está fora de escopo aqui. A spec pode existir na branch; não é SoT de runtime depois do merge. Veja [ai-documentation-workflow.md](ai-documentation-workflow.md) e [ai-agent-entry.md](ai-agent-entry.md).

## Ordem de Resolução de Conflitos

Quando as fontes discordarem:

1. **Evidência de runtime** (código, config, testes, sinais de produção) para claims de *comportamento atual*.
2. **Contrato / schema Accepted** para claims de *interface* entre participantes.
3. **ADR Accepted** para claims de *decisão / restrição*.
4. **Doc de domínio Accepted** (arquitetura, ops, segurança) para explicação sintetizada.
5. **Docs DRAFT / REVIEW** — informativos até serem Accepted.
6. **Docs Historical / deprecated** — não são SoT atual ([history-model.md](history-model.md)).

Se ainda não resolvido: marque **Unknown** ou abra uma [contradição](contradiction-model.md); não escolha a narrativa mais conveniente.

## Documentação vs Implementação

```text
If docs ≠ implementation:
  → treat as drift (see documentation-drift.md and domain drift docs)
  → do not “fix” by inventing a desired state as Confirmed current
```

## Regras de IA

- Prefira fontes Authoritative e Verified ([authority-levels.md](authority-levels.md)).
- Cite a SoT usada para claims Confirmed ([evidence-references.md](evidence-references.md)).
- Nunca eleve blog posts, chat ou texto de IA não verificado acima de código/contratos/ADRs.

## Documentos Relacionados

- [authority-levels.md](authority-levels.md)
- [evidence-model.md](evidence-model.md)
- [documentation-drift.md](documentation-drift.md)
- [contract-source-of-truth.md](contract-source-of-truth.md)
- [ai-documentation-workflow.md](ai-documentation-workflow.md)
- [ai-agent-entry.md](ai-agent-entry.md)
- [publishing-surfaces.md](publishing-surfaces.md)
