# Superfícies de publicação (GitHub e Confluence)

> Language: pt-BR | [English (EN)](../en/publishing-surfaces.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0

Como a documentação deve linkar quando é lida no **GitHub / checkout local** e quando é **publicada no Confluence** via `docs-sync`.

**O Markdown no GitHub / checkout local é a fonte da verdade.** O Confluence é a visão publicada ([source-of-truth.md](source-of-truth.md)). As duas superfícies precisam permanecer navegáveis: no Confluence, links entre páginas do Confluence; no GitHub, links de repositório e de arquivo.

## Superfícies

| Superfície | Papel | Como o leitor navega |
| --- | --- | --- |
| GitHub / checkout local | Markdown autoritativo | Links relativos `.md` dentro da árvore; URLs absolutas do GitHub para outros repositórios e para citações de código |
| Confluence (via `docs-sync`) | Visão publicada | Links in-tree reescritos para URLs de página do Confluence (`--relink`); link de origem no GitHub no rodapé gerenciado; URLs absolutas do GitHub para repos externos e código |

## Regras obrigatórias (todo pack de sync)

1. **Declarar o repositório da documentação** no perfil do `docs-sync`: `project.repository_url` (ex.: `https://github.com/loft-br/aiops-documentation`). Sincronizar com `include_footer: true` (padrão) para cada página do Confluence apontar de volta ao arquivo no GitHub.
2. **Sempre resolver links** em publicações reais: `sync` com `--relink` (padrão). Não deixar placeholders `confluence://…` no corpo publicado — use `audit` e depois `sync --force --relink` se necessário.
3. **Todo link deve resolver nas duas superfícies.** Links relativos só são permitidos quando o alvo existe **dentro da árvore de documentação / pack de sync**. `docs-sync validate` e `make docs-validate` **interrompem** em relativos quebrados, caminhos que escapam da árvore e prosa `../../…/*.md` nua. Não inventar URLs GitHub para arquivos inexistentes.
4. **Links entre documentos no Markdown permanecem relativos** só dentro da mesma árvore publicada (ex.: `[Architecture](architecture/README.md)`). Autores não devem hardcodar URLs de páginas do Confluence gerenciadas pelo `docs-sync`. Alvos cross-pack **neste** repo fora da raiz de sync devem usar URL `blob` do GitHub (ou ampliar o pack). Arquivos em **outro** repositório GitHub devem usar URL `blob` absoluta — nunca `../../backend/README.md`.
5. **Nomear cada repositório GitHub citado uma vez, de forma eficiente** — link curto `org/repo` no topo da seção ou do overview do pack; depois reutilizar caminho + links `blob` para arquivos. Usar o mesmo nome nos espelhos EN e pt-BR.
6. **Citações de código exigem localização + link do GitHub** — ver [Citações de código](#citações-de-código) abaixo.

## Identificação de repositório (forma eficiente)

Quando um claim depende de outro repositório GitHub (ou deste, como código, não só docs):

| Faça | Evite |
| --- | --- |
| Uma linha: `Repo: [loft-br/kong-configs](https://github.com/loft-br/kong-configs).` | Repetir a URL completa em cada frase |
| Citação de arquivo: caminho em backticks **e** link `blob` | Só o caminho, sem como abrir o arquivo |
| Mesma string `org/repo` em EN e pt-BR | Apelidos (`repo do kong`, `configs`) sem o link canônico |

Exemplo (estilo de pack as-is):

```markdown
Repo: [loft-br/kong-configs](https://github.com/loft-br/kong-configs).

Files: [front route](https://github.com/loft-br/kong-configs/blob/main/gateways/.../aiops-dataforge-front-route.yaml).
```

O branch padrão para URLs `blob` é `main`, salvo se o repositório citado documentar outro default — nesse caso use esse nome de forma consistente.

## Citações de código

Ao citar ou resumir um trecho de código ou config:

1. Informe **onde** está: caminho relativo ao repositório (e símbolo / intervalo de linhas quando estável).
2. Forneça uma **URL blob do GitHub** para esse caminho (adicione `#Lstart-Lend` quando o intervalo for estável e útil).
3. Mantenha trechos curtos; prefira link + caminho a colar blocos grandes.
4. Nunca cole segredos, tokens ou PII — [ai-context-safety.md](ai-context-safety.md).

| Forma | Exemplo |
| --- | --- |
| Caminho + link | `clusters/cross-prod/applications/aiops-dataforge.yaml` — [blob](https://github.com/loft-br/k8s-apps/blob/main/clusters/cross-prod/applications/aiops-dataforge.yaml) |
| Caminho + linhas | `src/checkout/service.ts` L40–L55 — `…/blob/main/src/checkout/service.ts#L40-L55` |

Tabelas de evidência seguem a mesma regra — [evidence-references.md](evidence-references.md).

## Proibido: caminhos relativos de monorepo fora desta árvore de docs

Caminhos que só fazem sentido dentro do monorepo de uma **aplicação** não podem aparecer como links relativos de docs nem como prosa nua quando a página vive neste repositório de documentação (ou é publicada no Confluence).

**Proibido (quebrado no Confluence e enganoso no GitHub):**

```text
Docs de pacotes relacionados (nível de implementação): ../../knowledge/README.md · ../../backend/README.md · ../../deploy/k8s/README.md · ../../scripts/README.md
```

**Forma obrigatória** (nomeie o repo do app uma vez; depois links blob):

```markdown
Repo: [loft-br/aiops-deep-insight](https://github.com/loft-br/aiops-deep-insight).

Docs de pacotes relacionados (nível de implementação):
[knowledge/README.md](https://github.com/loft-br/aiops-deep-insight/blob/main/knowledge/README.md) ·
[backend/README.md](https://github.com/loft-br/aiops-deep-insight/blob/main/backend/README.md) ·
[deploy/k8s/README.md](https://github.com/loft-br/aiops-deep-insight/blob/main/deploy/k8s/README.md) ·
[scripts/README.md](https://github.com/loft-br/aiops-deep-insight/blob/main/scripts/README.md).
```

Validação: `DOC-LINK-003` (caminhos relativos nus) e `docs-sync validate` (relativos que escapam / faltam) bloqueiam a publicação.

## Checklist do autor (local → Confluence)

Antes de publicar um pack a partir de um clone local:

- [ ] `project.repository_url` definido no perfil de sync
- [ ] Links entre docs são `.md` relativos **somente quando o alvo existe na árvore de sync**
- [ ] Sem prosa `../../pkg/README.md` nua; sem relativos que escapam do pack de docs
- [ ] Toda dependência GitHub externa nomeada com `org/repo` + URL; READMEs de pacotes usam URLs blob
- [ ] Citações de código/config incluem caminho + link blob do GitHub
- [ ] `make docs-validate` e `docs-sync validate` passam sem erros de link
- [ ] `validate` → `plan`/`status` → `sync` (com relink) → `audit`
- [ ] Espelhos EN e pt-BR carregam os mesmos nomes de repositório e alvos de link (só a prosa traduzida)

Ferramentas: [docs-sync/README.md](../../docs-sync/README.md), perfis em [docs-sync/aiops-config/](../../docs-sync/aiops-config/).

## Hub AIOps em três níveis

O time AIOps usa um modelo dedicado ([aiops-team/documentation-model.md](aiops-team/documentation-model.md)):

| Nível | SoT | Publicação Confluence |
| --- | --- | --- |
| 1 — Time | `docs/{lang}/aiops-team/` | `documentacao-inicial.pt-BR.yaml` (parent `6086460456`) |
| 2 — Aplicação | `docs/{lang}/aiops-apps/{app}.md` | Idem + opcional `aiops-apps.pt-BR.yaml` (`6091309071`) |
| 3 — Repositório | `README.md` no GitHub da app | Não sincroniza — link blob a partir do nível 2 |

Registro e comandos scoped: [docs-sync/aiops-config/hub-registry.yaml](../../docs-sync/aiops-config/hub-registry.yaml). Skill de agente: [`.cursor/skills/sync-aiops-hub/SKILL.md`](../../.cursor/skills/sync-aiops-hub/SKILL.md).

## Anti-padrões

- Publicar sem `repository_url` (páginas Confluence sem origem no GitHub)
- Hardcodar URLs do Confluence gerenciadas no Markdown SoT (quebra em rename/reparent; contorna o `--relink`)
- Citar outro repo Loft só pelo nome informal
- Colar código sem caminho e link blob
- Deixar hrefs `confluence://` sem resolver depois do sync
- Caminhos nus ou relativos estilo `../../knowledge/README.md` vindos de monorepo de app (mortos no Confluence; errados neste GitHub)
- Deixar o sync inventar URLs `blob/main/docs/…` para arquivos que não existem

## Documentos relacionados

- [source-of-truth.md](source-of-truth.md)
- [standards.md](standards.md) (Referências e links)
- [evidence-references.md](evidence-references.md)
- [style-guide.md](style-guide.md)
- [ai-change-rules.md](ai-change-rules.md)
