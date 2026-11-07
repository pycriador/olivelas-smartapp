# Checklist de documentação

> Language: pt-BR | [English](../en/documentation-checklist.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Checklist mínimo de qualidade para documentação de projetos que adotam este padrão.

Use antes de abrir um pull request ou aceitar documentação gerada por IA.

Nem todo item se aplica a todo projeto. Marque itens não aplicáveis explicitamente como N/A em vez de omitir em silêncio.

## Conteúdo

- [ ] Objetivo documentado
- [ ] Escopo documentado
- [ ] Non-goals documentados quando relevantes
- [ ] Arquitetura documentada (estado atual)
- [ ] Componentes identificados
- [ ] Dependências identificadas
- [ ] Integrações identificadas
- [ ] Contratos documentados quando há interfaces
- [ ] Segurança documentada
- [ ] Operação documentada
- [ ] Observabilidade documentada quando aplicável
- [ ] Limitações conhecidas documentadas
- [ ] Decisões registradas como ADRs quando houver escolhas materiais

## Qualidade

- [ ] Informação verificável ou explicitamente classificada (Confirmed / Inferred / Unknown / Proposed)
- [ ] Sem informações inventadas
- [ ] Sem secrets, credenciais ou valores secretos
- [ ] Links resolvem
- [ ] Packs sincronizados com o Confluence seguem as regras de duas superfícies ([publishing-surfaces.md](publishing-surfaces.md)): links relativos entre docs, `repository_url` / rodapé, links blob do GitHub em citações de código
- [ ] Diagramas atualizados e rotulados corretamente (atual vs proposto)
- [ ] Terminologia consistente entre documentos
- [ ] Sem duplicação desnecessária (fontes canônicas linkadas)
- [ ] Hierarquia de títulos consistente
- [ ] Detalhes específicos de tecnologia evidentes, não assumidos pelo padrão
- [ ] Documento representa o estado atual (ou está corretamente rotulado como Proposed / DEPRECATED)

## Ciclo de vida e metadata

- [ ] Status definido (`DRAFT` / `REVIEW` / `ACCEPTED` / `DEPRECATED` / `ARCHIVED`)
- [ ] YAML frontmatter presente para docs substantivos (`title`, `status`, `owner`, `updated`)
- [ ] Owner definido quando aplicável
- [ ] `review_date` / revisão periódica considerados quando aplicável
- [ ] Referências atualizadas após renomeações ou mudanças estruturais
- [ ] Documentos deprecated apontam para substitutos quando disponíveis
- [ ] Mudanças técnicas relevantes têm atualização documental correspondente ([change-policy.md](change-policy.md))

## Documentação bilíngue (este padrão)

Obrigatório para documentos deste repositório. Opcional para projetos adotantes, salvo se adotarem [language.md](language.md).

- [ ] Versões EN e pt-BR existem com o mesmo caminho relativo
- [ ] Link entre línguas presente no topo de cada documento
- [ ] Tokens de máquina permanecem em inglês (Status, Classification, IDs)
- [ ] Ambas as línguas atualizadas na mesma mudança quando possível
- [ ] Tradução atrasada marcada com `Translation status: pending` quando aplicável

## Documentação assistida por IA (quando aplicável)

- [ ] Evidence summary presente ou referências embutidas
- [ ] Unknowns listados explicitamente
- [ ] Nenhuma mudança de código incluída em alteração só de docs
- [ ] Revisão humana concluída antes de `ACCEPTED`
- [ ] IA não definiu `ACCEPTED` automaticamente

## Sign-off

| Campo | Valor |
| --- | --- |
| Reviewed by | |
| Date | YYYY-MM-DD |
| Result | Pass / Pass with follow-ups / Fail |
| Follow-ups | |

## Documentos relacionados

- [principles.md](principles.md)
- [lifecycle.md](lifecycle.md)
- [standards.md](standards.md)
- [style-guide.md](style-guide.md)
- [ai-documentation.md](ai-documentation.md)
- [quality-model.md](quality-model.md)
- [language.md](language.md)
- [templates/documentation-pr-checklist.md](templates/documentation-pr-checklist.md)
