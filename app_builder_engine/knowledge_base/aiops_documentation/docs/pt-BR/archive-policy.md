# Política de Arquivamento

> Language: pt-BR | [English](../en/archive-policy.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Arquivamento mantém documentação histórica disponível sem apresentá-la como orientação atual.

Esta política é agnóstica a tecnologia. Projetos em adoção escolhem o armazenamento que se encaixa no layout do repositório.

## Quando arquivar

Arquive quando:

- o documento **não tem uso operacional**;
- já está `DEPRECATED` (ou foi abandonado como `DRAFT` com justificativa);
- leitores não devem tratá-lo como orientação ativa;
- o histórico ainda tem valor para auditorias, migrações ou aprendizado.

Não arquive documentos de que on-call ou integradores ainda precisam. Deprecie primeiro se existir substituição.

## Onde arquivar

Local sugerido:

```text
docs/archive/
```

ou o equivalente do projeto (por exemplo `docs/en/archive/` em árvores bilíngues).

Práticas:

- preserve clareza de caminho suficiente para reconhecer o tópico original;
- mantenha espelhos de idioma consistentes quando o projeto for bilíngue;
- evite espalhar arquivos arquivados sem um índice se o arquivo crescer.

Exemplo:

```text
docs/archive/contracts/order-created-v1.md
```

## Como arquivar

1. Confirme que não resta dependência operacional.
2. Defina `status: ARCHIVED` nos metadados (e blockquote se usado).
3. Preserve contexto: título, propósito anterior, link de substituição, motivo/data de depreciação quando aplicável.
4. Mova o arquivo para o local de arquivo (ou marque no lugar se o projeto usar marcadores in-place — prefira uma área dedicada de arquivo quando prático).
5. Atualize links de docs ativos; docs ativos devem apontar para substituições, não depender de páginas arquivadas.
6. Registre a mudança no PR que arquiva o documento.

Exemplo de cabeçalho:

```markdown
# Order Created v1 (Archived)

> Language: pt-BR | [English](../../en/archive/contracts/order-created-v1.md)
>
> Status: ARCHIVED
>
> Documentation Standard v1.0

> Replaced by: [order-updated.md](../../contracts/order-updated.md)
> Deprecated on: 2026-01-15
> Archived on: 2026-08-07
> Reason: Contract retired after v2 migration
```

## Preservar contexto

Documentos arquivados ainda devem responder:

- o que isto costumava descrever;
- por que foi removido do uso ativo;
- o que o substituiu, se houver.

Não esvazie o corpo até um stub, salvo se política legal ou de segurança exigir redação. Se redigir, note que o conteúdo foi removido e por quê.

## Remoção permanente (rara)

Exclusão permanente é excepcional. Considere-a apenas quando:

- o conteúdo não pode permanecer no repositório (legal, segurança ou exposição de segredo — rotacione segredos primeiro se houve exposição);
- a política de retenção exige remoção explicitamente;
- o arquivo não tem valor histórico e causa dano ativo (por exemplo segredos duplicados — remova e rotacione).

O ciclo de vida normal termina em `ARCHIVED`, não em delete. Prefira arquivo + histórico git a remoção silenciosa.

Se remoção permanente for necessária, documente a decisão fora do arquivo apagado (descrição de PR, ADR ou notas de incidente de segurança conforme apropriado) sem rearmazenar segredos.

## Documentos relacionados

- [lifecycle.md](lifecycle.md)
- [deprecation.md](deprecation.md)
- [status.md](status.md)
- [stale-documentation.md](stale-documentation.md)
