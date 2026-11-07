# Política de Revisão da Documentação

> Language: pt-BR | [English](../en/review-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

A revisão existe para manter a documentação confiável. Prefira revisão **orientada a mudança** a rituais de calendário.

## Princípios

1. Uma mudança técnica relevante está incompleta até que os docs necessários sejam atualizados e revisados conforme preciso ([change-policy.md](change-policy.md)).
2. Revisão periódica é secundária — use-a quando os sinais de mudança forem fracos ou o risco for alto.
3. Não há **frequência universal** que sirva para todo documento.

## Gatilhos de revisão (primários)

Inicie ou exija uma revisão de documentação quando qualquer um dos itens a seguir mudar:

| Gatilho | Exemplos |
| --- | --- |
| Arquitetura | Fronteiras, componentes, fluxo de dados, domínios de falha |
| Contract | Schema de API/evento/mensagem, semântica, compatibilidade |
| Behavior | Mudanças de comportamento visíveis a usuários ou integradores |
| Infrastructure | Ambientes, recursos, networking, premissas de scaling |
| Segurança | AuthN/AuthZ, tratamento de segredos, limites de confiança, threat model |
| Operações | Runbooks, escalação, recuperação, procedimentos de on-call |
| Critical dependency | Dependência nova, removida ou materialmente alterada que operadores ou integradores precisam conhecer |
| Incorrect information | Afirmações conhecidamente erradas ou enganosas em docs existentes |

Quando um gatilho dispara em um documento `ACCEPTED`, mova o status para `REVIEW` (ciclo de atualização), corrija o conteúdo e retorne a `ACCEPTED` após a revisão. Veja [lifecycle.md](lifecycle.md).

## Quem revisa

| Conteúdo | Revisor típico |
| --- | --- |
| Arquitetura / design | Engenheiros familiarizados com o sistema; opcionalmente EM ou papel de arquiteto |
| Contratos | Lados produtor e consumidor quando possível |
| Segurança | Engenheiro com visão de segurança ou papel de security |
| Operações / runbooks | On-call ou time dono das operações |
| Observability | Time que possui alertas e dashboards |

O owner garante que a revisão aconteça. O reviewer questiona a precisão. Approver é opcional. Veja [ownership.md](ownership.md).

## O que verificar

No mínimo:

- afirmações batem com código, config, contratos ou ADRs aceitos — ou estão classificadas (`Confirmed` / `Inferred` / `Unknown` / `Proposed`);
- sem segredos ou dados sensíveis desnecessários;
- links e identificadores ainda resolvem;
- diagramas batem com o estado atual, a menos que rotulados Proposed;
- metadados de status, owner e `updated` estão corretos;
- docs deprecated apontam para substitutos quando disponíveis;
- pares bilíngues permanecem alinhados quando o projeto adota [language.md](language.md).

Use [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md) em pull requests.

## Como registrar uma revisão

Para revisões materiais, crie um registro curto a partir de [templates/review-record.md](templates/review-record.md):

- documento revisado;
- data;
- reviewers;
- resultado (`Pass` / `Pass with follow-ups` / `Fail`);
- follow-ups ou IDs de dívida de documentação.

Review leve de PR basta para atualizações pequenas e bem delimitadas. Prefira um review record quando a mudança for ampla, sensível a segurança ou encerrar uma revisão periódica.

## Revisão periódica (secundária)

Revisão periódica é ferramenta opcional de gestão de risco — não uma cadência obrigatória para todo arquivo.

### Quando usar

Considere revisão periódica quando:

- o documento tem alto impacto (segurança, runbooks de produção, contratos públicos) e mudanças são infrequentes;
- o ownership mudou ou conhecimento tribal saiu do time;
- aparecem sinais de staleness ([stale-documentation.md](stale-documentation.md));
- uma auditoria ou incidente mostrou que docs estavam errados ou ausentes.

**Não** invente uma regra global "revisar a cada N meses" para todos os docs. Escolha um ciclo por documento ou categoria quando agregar valor, e registre-o na matriz de ownership se for útil.

### Quem revisa

Os mesmos papéis da revisão orientada a mudança. Prefira o owner atual mais pelo menos um reviewer que não escreveu a última revisão major quando o risco for alto.

### Como registrar

- Defina ou atualize `review_date` nos metadados quando usado.
- Arquive um [review-record](templates/review-record.md) para o resultado.
- Mova `ACCEPTED → REVIEW → ACCEPTED` se edições materiais forem necessárias.
- Abra dívida de documentação para correções adiadas ([documentation-debt.md](documentation-debt.md)).

### O que verificar

O mesmo checklist da revisão orientada a mudança, mais:

- ainda é o documento canônico certo para o tópico;
- existem substitutos se o doc deveria ser deprecated;
- procedimentos operacionais ainda batem com a realidade.

### E se estiver stale

| Achado | Ação |
| --- | --- |
| Drift menor | Corrija no lugar; atualize `updated`; mantenha ou revisite brevemente `REVIEW` |
| Drift material | `REVIEW`, corrija, reaceite; registre dívida para itens inacabados |
| Substituído | Deprecie com marcadores ([deprecation.md](deprecation.md)) |
| Sem uso operacional | Arquive ([archive-policy.md](archive-policy.md)) |
| Ownership desconhecido | Atribua owner antes de tratar o doc como regido |

Idade sozinha não prova staleness — é um sinal. Veja [stale-documentation.md](stale-documentation.md).

## Documentos relacionados

- [lifecycle.md](lifecycle.md)
- [change-policy.md](change-policy.md)
- [ownership.md](ownership.md)
- [stale-documentation.md](stale-documentation.md)
- [documentation-debt.md](documentation-debt.md)
- [templates/review-record.md](templates/review-record.md)
- [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md)
