# Documentação Stale

> Language: pt-BR | [English](../en/stale-documentation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Documentação stale parece atual, mas não corresponde mais ao sistema. É mais perigosa que uma página ausente porque leitores e agentes de IA confiam nela.

## Idade é um sinal, não prova

Uma data `updated` antiga sugere risco; não prova que o conteúdo está errado. Um doc tocado recentemente ainda pode estar stale se as seções erradas foram editadas.

Sempre valide contra evidência (código, config, contratos, comportamento em runtime), não só contra o calendário.

## Sinais de staleness

| Sinal | Por que importa |
| --- | --- |
| Documento contradiz código ou config | Imprecisão direta |
| Docs de contrato atrasam schema ou consumidores | Risco de integração |
| Passos de runbook falham ou pulam tooling real | Risco operacional |
| Diagramas mostram componentes removidos | Modelo mental enganoso |
| Time owner não existe mais | Lacuna de manutenção |
| Incidentes revelam "docs estavam errados" | Staleness confirmada |
| Dependências renomeadas/substituídas sem atualização de doc | Acoplamento oculto |
| Status ainda `ACCEPTED` após grande mudança não revisada | Lacuna de processo |
| Múltiplos docs discordam sem link canônico | Dívida de conflito |
| Apenas conteúdo gerado por IA sem trilha de evidência | Lacuna de confiança |

## Como identificar

1. Compare afirmações críticas com fontes autoritativas.
2. Percorra um caminho operacional (deploy, falha, integração) usando o doc como único guia.
3. Pergunte se um engenheiro ou agente novo tomaria uma decisão errada a partir desta página.
4. Verifique docs relacionados quanto a divergência após uma mudança conhecida.
5. Use os gatilhos de revisão em [review-policy.md](review-policy.md) como checklist após releases.

## Como tratar

| Situação | Ação |
| --- | --- |
| Drift factual pequeno | Corrija imediatamente; atualize `updated`; revise conforme necessário |
| Drift material em doc `ACCEPTED` | Mova para `REVIEW`, corrija, reaceite ([lifecycle.md](lifecycle.md)) |
| Não pode corrigir agora | Registre [dívida de documentação](documentation-debt.md) com impacto e owner |
| Substituído | [Deprecie](deprecation.md) com link de substituição |
| Sem valor operacional | [Arquive](archive-policy.md) |
| Ownership pouco claro | Atribua [owner](ownership.md) antes de chamar o doc de regido |

**Não** invente status como `STALE`, `OLD` ou `OUTDATED`. Mantenha os cinco tokens de ciclo de vida e expresse staleness por revisão, dívida, depreciação ou arquivamento.

## Ligação com dívida e revisão

- Staleness sem plano de correção → item de dívida de documentação.
- Staleness com correção ativa → revisão orientada a mudança ou periódica.
- Staleness recorrente em uma categoria → revisite ownership e adesão à [change-policy.md](change-policy.md).

## Documentos relacionados

- [documentation-debt.md](documentation-debt.md)
- [review-policy.md](review-policy.md)
- [lifecycle.md](lifecycle.md)
- [change-policy.md](change-policy.md)
- [quality-model.md](quality-model.md)
