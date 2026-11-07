# Política de Changelog

> Language: pt-BR | [English](../en/changelog-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Changelogs ajudam humanos e agentes a ver o que mudou na documentação que importa. São ferramenta opcional, não exigência para cada edição.

## Quando um changelog agrega valor

Registre entradas de changelog quando a mudança:

- alterar contratos ou expectativas de compatibilidade;
- mudar arquitetura ou procedimentos operacionais;
- deprecar ou arquivar docs substantivos;
- introduzir uma nova categoria de documentação obrigatória ou recomendada;
- incrementar a versão deste padrão de documentação ([versioning.md](versioning.md));
- mudar orientação de segurança ou observabilidade de forma que operadores precisem notar.

Para projetos em adoção, um changelog de docs é útil quando consumidores externos ou múltiplos times dependem do conjunto de docs.

## Quando não se preocupar

Pule ruído de changelog para:

- correções de typo e formatação;
- reparos de link sem mudança semântica;
- reformulações que não alteram o significado;
- edições só de whitespace ou estilo em templates;
- sincronização rotineira de tradução sem delta semântico.

O histórico git permanece a fonte da verdade para essas edições.

## O que registrar

Mantenha entradas curtas e fáceis de escanear:

| Campo | Orientação |
| --- | --- |
| Date | `YYYY-MM-DD` |
| Summary | Uma ou duas frases sobre **por que** importa |
| Impact | Quem deve reler (operators, integrators, all) |
| Links | Caminhos para docs alterados ou PRs |
| Standard version | Quando o próprio padrão muda (`v1.0` → `v1.1`, etc.) |

Exemplo:

```markdown
## 2026-08-07

- Documentation Standard v1.0: added lifecycle governance (status, ownership, review, debt).
- Impact: authors of substantive docs should adopt YAML metadata and lifecycle transitions.
- See: docs/en/lifecycle.md, docs/en/standards.md
```

## Onde colocar

Projetos podem usar:

- `CHANGELOG.md` na raiz dos docs;
- uma seção no README do projeto;
- release notes que incluem uma subseção Documentation.

Escolha um lugar canônico. Não mantenha três changelogs divergentes.

## Relação com versionamento de documento

O versionamento de conteúdo de documentos individuais (PATCH/MINOR/MAJOR) é separado da versão do padrão e das entradas de changelog. Veja [versioning.md](versioning.md) — Versionamento de conteúdo de documentos.

Uma entrada de changelog pode mencionar um bump de versão de documento quando isso ajuda consumidores; não substitui metadados precisos de `status` e `updated`.

## Documentos relacionados

- [changelog.md](changelog.md) — log canônico deste repositório
- [versioning.md](versioning.md)
- [change-policy.md](change-policy.md)
- [lifecycle.md](lifecycle.md)
- [deprecation.md](deprecation.md)
