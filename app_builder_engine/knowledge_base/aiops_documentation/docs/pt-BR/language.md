# Política de Idioma da Documentação

> Language: pt-BR | [English](../en/language.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Política bilíngue deste padrão: todo documento normativo e de orientação deve existir em inglês (EN) e em português brasileiro (pt-BR).

## Regras

1. **Existência em duas línguas**  
   Todo documento deste padrão deve existir em EN e pt-BR.

2. **Árvore espelhada**  
   Use caminhos relativos idênticos sob `docs/en/...` e `docs/pt-BR/...`.

3. **Exemplos**  
   Exemplos fictícios seguem o mesmo espelhamento: `examples/<name>/en/...` e `examples/<name>/pt-BR/...`.

4. **README e CONTRIBUTING na raiz**  
   O README raiz e o CONTRIBUTING devem ter versões EN e pt-BR:
   - `README.md` + `README.pt-BR.md`
   - `CONTRIBUTING.md` + `CONTRIBUTING.pt-BR.md`

5. **Tokens de máquina permanecem em inglês**  
   Status (`DRAFT`, `REVIEW`, `ACCEPTED`, `DEPRECATED`, `ARCHIVED`), Classification (`Confirmed`, `Inferred`, `Unknown`, `Proposed`), status de observabilidade (`Implemented`, `Partial`, `Not Applicable`, `Not Documented`) e identificadores técnicos (`ADR-XXX`, IDs de contrato) não são traduzidos.

6. **Atualizações bilíngues no mesmo PR**  
   Sempre que possível, atualize as duas línguas no mesmo pull request.

7. **Tradução atrasada**  
   Se uma língua estiver atrasada em relação à outra, marque no topo do documento:

   ```markdown
   > Translation status: pending
   ```

8. **Links entre línguas**  
   Links entre línguas são obrigatórios no topo de cada documento, por exemplo:

   ```markdown
   > Language: pt-BR | [English](../en/standards.md)
   ```

   ```markdown
   > Language: EN | [Português (pt-BR)](../pt-BR/standards.md)
   ```

9. **O que não se traduz**  
   Código, nomes de arquivo, caminhos, endpoints, identificadores técnicos e nomes de templates em `kebab-case` não são traduzidos.

10. **O que se traduz**  
    Conteúdo narrativo, tabelas explicativas, guias e rótulos de diagramas Mermaid (quando fizerem parte da narrativa) são traduzidos.

## Escopo

Esta política aplica-se a:

- documentos do padrão sob `docs/en/` e `docs/pt-BR/`;
- exemplos sob `examples/`;
- arquivos de entrada na raiz do repositório (`README`, `CONTRIBUTING`).

Não exige que projetos em adoção publiquem documentação bilíngue, a menos que adotem esta política explicitamente.

## Política bilíngue parcial para projetos adotantes (opcional)

Projetos adotantes que escolhem docs bilíngues podem usar **tradução progressiva** sem violar este padrão:

| Profundidade | Expectativa | Marcação |
| --- | --- | --- |
| Hubs do Dia 0 (`project-overview`, `ai-context`, READMEs de categoria) | Preferir tradução completa quando o bilíngue for adotado | — |
| Inventários técnicos profundos (tabelas grandes de rotas, schemas completos) | Podem manter corpo técnico em EN com path espelhado | Adicionar `Translation status: partial` sob a linha de idioma |
| Archive / DEPRECATED | Espelhar path; tradução opcional | `status: DEPRECATED` |

Regras:

1. Paths permanecem espelhados (`docs/en/...` ↔ `docs/pt-BR/...`) quando o projeto é bilíngue.
2. Nunca deixe um path faltando em um idioma sem um stub explícito que linke o outro idioma e declare `Translation status: pending` ou `partial`.
3. Tokens de máquina (`Confirmed`, `ACCEPTED`, IDs) permanecem em inglês.
4. Esta seção é **orientação para adotantes**. O repositório do padrão continua exigindo EN + pt-BR completos para seus documentos normativos.

## Documentos relacionados

- [README.md](README.md)
- [standards.md](standards.md)
- [versioning.md](versioning.md)
- [documentation-checklist.md](documentation-checklist.md)
- [flat-docs-migration.md](flat-docs-migration.md)
- [adoption-path.md](adoption-path.md)
