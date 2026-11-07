# Versionamento do Documentation Standard

> Language: pt-BR | [English (EN)](../en/versioning.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Este documento define como **este padrão de documentação** é versionado e como projetos adotantes podem versionar o **conteúdo de documentos individuais**.

Ele não define como projetos adotantes versionam o próprio software.

## Versão atual

```text
Documentation Standard v1.0
```

Declare a versão no README raiz e nos documentos principais do padrão quando a versão mudar.

## Formato de versão

```text
vMAJOR.MINOR[.PATCH]
```

| Parte | Significado |
| --- | --- |
| MAJOR | Mudanças incompatíveis na estrutura ou nas convenções obrigatórias |
| MINOR | Adições compatíveis com versões anteriores |
| PATCH | Esclarecimentos, correção de typos, melhorias de redação sem quebra |

## Quando incrementar

### Patch

Incremente PATCH quando a mudança:

- esclarece regras existentes sem alterar o significado;
- corrige typos ou links quebrados;
- melhora exemplos sem mudar a estrutura exigida;
- faz melhorias de redação não quebradoras em templates.

Exemplos:

- Corrigir um link relativo quebrado.
- Esclarecer o significado de `Unknown` sem alterar os valores permitidos.

### Minor

Incremente MINOR quando a mudança:

- adiciona um template opcional;
- adiciona uma categoria ou documento de orientação opcional;
- estende um template com seções opcionais;
- adiciona convenções recomendadas (não obrigatórias);
- amplia a cobertura bilíngue sem quebrar caminhos existentes;
- adiciona docs de governança de ciclo de vida sem alterar os cinco tokens de status de forma incompatível;
- adiciona orientação de metodologia de arquitetura (modelo, diagramas, drift, dívida) sem tornar todos os docs de arquitetura obrigatórios;
- adiciona metodologia de contratos técnicos sem tornar toda seção de contrato obrigatória para todo projeto;
- adiciona metodologia de operações e confiabilidade sem tornar toda seção de ops obrigatória para todo projeto;
- adiciona metodologia de segurança sem tornar toda seção de segurança obrigatória para todo projeto;
- adiciona metodologia de documentação AI-ready (contexto, claims, relacionamentos, navegação) sem exigir RAG, embeddings ou runtimes de agentes;
- adiciona governança e automação no repositório (validação, quality gates, exceções) sem exigir SaaS ou plataformas externas.

Exemplos:

- Adicionar um template opcional de `disaster-recovery`.
- Adicionar orientação para documentação de changelog.
- Adicionar docs opcionais de ownership, review, dívida ou arquivo.
- Adicionar metodologia de arquitetura, contratos, operações, segurança, AI-ready ou governança sem tornar toda seção obrigatória.

### Incluído na v1.0

Esta primeira release oficial já inclui:

- governança de ciclo de vida (status, ownership, review, change, dívida, arquivo);
- metodologia de arquitetura com progressive disclosure;
- metodologia de contratos técnicos;
- metodologia de operações e confiabilidade;
- metodologia de segurança;
- metodologia de documentação AI-ready;
- automação e governança no repositório (validação, quality gates, exceções).

### Major

Incremente MAJOR quando a mudança:

- renomeia ou remove seções obrigatórias de forma que quebra adotantes existentes;
- altera valores de status ou o vocabulário de classificação de forma incompatível;
- redefine a estrutura obrigatória do repositório;
- altera regras de adoção de modo que docs antes conformes deixem de ser.

Exemplos:

- Substituir o status `REVIEW` por `IN_REVIEW` sem alias.
- Tornar obrigatória para todos os projetos uma categoria antes opcional.

## Expectativas de compatibilidade

| Tipo de mudança | Expectativa do adotante |
| --- | --- |
| Patch | Nenhuma ação necessária |
| Minor | Adoção opcional das novas capacidades |
| Major | Notas de migração obrigatórias; adotantes devem planejar atualizações |

## Versionamento do conteúdo de documentos

Separado do versionamento **deste padrão**: projetos adotantes podem versionar o conteúdo de documentos individuais.

Use bumps no estilo semântico no campo `version` por documento quando isso ajudar os consumidores:

| Bump | Use quando a mudança no documento… |
| --- | --- |
| **PATCH** | Esclarece redação, corrige typos/links, sem mudança semântica de orientação ou contratos |
| **MINOR** | Adiciona seções compatíveis, orientação opcional ou detalhe não quebrador |
| **MAJOR** | Quebra o entendimento anterior: orientação incompatível de contrato/ops, remove comportamento obrigatório, substitui a narrativa de arquitetura |

Regras:

- O versionamento de conteúdo do documento é opcional; `updated` (data) permanece o sinal mínimo de frescor.
- Não confunda `version` do documento com `Documentation Standard vX.Y`.
- Não use bumps de versão como substituto do status de ciclo de vida (`DRAFT` / `REVIEW` / `ACCEPTED` / `DEPRECATED` / `ARCHIVED`).
- Identificadores de contrato (por exemplo `order-created@v2`) permanecem no esquema próprio do contrato.

Exemplo de metadata:

```yaml
---
title: Send Notification Contract
status: ACCEPTED
owner: notifications-squad
updated: 2026-08-07
version: "2.1.0"
---
```

Para resumos de mudança orientados a humanos, veja [changelog-policy.md](changelog-policy.md).

## Práticas de release

1. Atualize referências a `Documentation Standard vX.Y` no `README.md` raiz e em `docs/en/README.md` / `docs/pt-BR/README.md`.
2. Resuma as mudanças no pull request (e em uma entrada de changelog quando útil — [changelog-policy.md](changelog-policy.md)).
3. Para mudanças MAJOR, inclua orientação de migração:
 - o que quebrou;
 - o que renomear/mover;
 - o que permanece válido.

## Fora de escopo

Esta política não versiona:

- exemplos fictícios como produtos versionados de forma independente;
- ferramentas externas usadas para renderizar Markdown.

Exemplos em `examples/` devem acompanhar conceitualmente a versão do padrão, mas não exigem versões semânticas independentes.

## Documentos relacionados

- [../../CONTRIBUTING.md](../../CONTRIBUTING.md)
- [../../README.md](../../README.md)
- [standards.md](standards.md)
- [language.md](language.md)
- [changelog-policy.md](changelog-policy.md)
- [lifecycle.md](lifecycle.md)
- [architecture-model.md](architecture-model.md)
- [contract-model.md](contract-model.md)
- [contracts/README.md](contracts/README.md)
- [operations-model.md](operations-model.md)
- [operations/README.md](operations/README.md)
- [security-model.md](security-model.md)
- [security/README.md](security/README.md)
- [ai-ready-model.md](ai-ready-model.md)
- [ai-context.md](ai-context.md)
- [governance.md](governance.md)
- [automation.md](automation.md)
- [migration-policy.md](migration-policy.md)
