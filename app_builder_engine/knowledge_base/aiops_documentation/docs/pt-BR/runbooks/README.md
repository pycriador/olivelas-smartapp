# Runbooks

> Language: pt-BR | [English](../../en/runbooks/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

O que é um runbook, como projetos em adoção devem estruturá-los e regras de segurança para procedimentos operacionais.

## Conceito

Um **runbook** é um procedimento executável para diagnosticar e/ou resolver uma situação operacional. Diz a um respondente treinado o que verificar, o que fazer, como validar e quando escalar.

Runbooks ficam nos estágios Respond / Recover do [modelo de operações](../operations-model.md). Devem permanecer alinhados à [arquitetura](../architecture-model.md) e aos [contratos](../contract-model.md) atuais.

## Quando escrever um

| Situation | Guidance |
| --- | --- |
| Falha recorrente ou de alto impacto | Escreva um runbook |
| Caminho raro mas Critical | Escreva ao menos diagnosis + escalation |
| Restart óbvio de um passo sem risco | Runbook curto ou seção em troubleshooting pode bastar |
| Procedimento desconhecido | Não invente; marque gaps e escale |

## Conteúdo mínimo

| Section | Purpose |
| --- | --- |
| Purpose / scope | Qual resultado; o que está fora de escopo |
| Preconditions | O que deve ser verdade antes de agir |
| Symptoms | Como a situação se apresenta |
| Diagnosis | Checks ordenados |
| Resolution | Ações ordenadas |
| Validation | Como confirmar sucesso |
| Rollback | Como desfazer se a resolution piorar as coisas |
| Escalation | Quem em seguida, com qual contexto |

Use o template do projeto: [../templates/runbook.md](../templates/runbook.md). Relacionado: [../templates/troubleshooting.md](../templates/troubleshooting.md).

## Regras de segurança

### Ações destrutivas

- Rotule passos destrutivos explicitamente (delete de dados, failover, force unlock, drop de tráfego).
- Exija checks de precondition antes de passos destrutivos.
- Prefira mitigação menos destrutiva primeiro quando for seguro.
- Nunca cole secrets, credenciais ou PII bruto em runbooks.

### Preconditions

- Declare ambiente, role/permissions necessárias e “não prossiga se…”.
- Verifique se o incidente corresponde ao escopo do runbook antes de ações irreversíveis.

### Validação

- Todo caminho de resolution precisa de checks de validation com resultados esperados.
- Inclua “como é o bom” para metrics/health/jornada do usuário.

### Rollback

- Documente rollback quando a resolution pode piorar o impacto.
- Se rollback for impossível, diga **irreversible** e exija confirmação explícita / escalation.
- Veja também a política de rollback do projeto quando existir.

### Ownership e frescor

- Owner recomendado para runbooks `ACCEPTED` ([../ownership.md](../ownership.md), [../operational-ownership.md](../operational-ownership.md)).
- Atualize runbooks quando arquitetura, contratos ou alerts mudarem; runbooks stale são dívida operacional.

## Indexação

Projetos em adoção devem manter um índice simples (name → symptom → link → owner). Este README é a orientação do **padrão**; runbooks do projeto vivem na área de operations do repo adotante.

## Documentos relacionados

- [../templates/runbook.md](../templates/runbook.md)
- [../templates/troubleshooting.md](../templates/troubleshooting.md)
- [../alerting.md](../alerting.md)
- [../incident-management.md](../incident-management.md)
- [../operations-model.md](../operations-model.md)
- [../operations/README.md](../operations/README.md)
