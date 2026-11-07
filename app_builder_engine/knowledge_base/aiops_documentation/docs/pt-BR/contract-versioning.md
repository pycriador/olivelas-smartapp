# Versionamento de Contrato

> Language: pt-BR | [English](../en/contract-versioning.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como versionar contratos técnicos. Versões de contrato são distintas das versões do **Documentation Standard** ([versioning.md](versioning.md)) e dos campos opcionais `version` de conteúdo de documento.

## Identidade de versão

Use um identificador estável de contrato mais uma versão, por exemplo:

```text
order-created@v1
order-created@v2
```

Projetos podem usar semver (`1.2.0`), versões inteiras (`v3`) ou versões datadas — escolha um esquema por família de contrato e mantenha consistência. Veja [standards.md](standards.md).

## Classes de mudança

| Class | Meaning |
| --- | --- |
| **Breaking change** | Pode invalidar consumers ou producers existentes sob as expectativas atuais |
| **Non-breaking change** | Participantes conformes existentes continuam a funcionar sob as premissas declaradas |
| **Additive change** | Adiciona capacidade opcional (frequentemente non-breaking para consumers tolerantes) |
| **Removal** | Remove um campo, valor, endpoint ou comportamento (geralmente breaking) |
| **Deprecation** | Marca algo como em saída, ainda suportado por um período |
| **Migration** | Mudança planejada de uma versão/comportamento para outra |

Compatibility sempre depende do comportamento de **producer e consumer** — [contract-compatibility.md](contract-compatibility.md).

### Exemplos potencialmente breaking

- Remover um campo
- Mudar o significado de um campo (mudança semântica)
- Mudar o tipo
- Tornar um campo opcional em obrigatório
- Mudar a semântica de erro de forma da qual consumers dependem
- Renomear identificadores que participantes hard-codam

### Exemplos potencialmente non-breaking

- Adicionar um campo opcional (se consumers ignoram unknowns)
- Adicionar um novo valor permitido de enum (depende do rigor do consumer)
- Adicionar uma nova operação que clients existentes nunca chamam
- Esclarecer documentação sem mudar comportamento

**Additive não é automaticamente seguro.** Consumers estritos que rejeitam campos desconhecidos podem quebrar com mudanças additive do producer. Analise os dois lados.

## Práticas de versionamento

1. Incremente a versão do contrato quando o acordo publicado mudar materialmente.
2. Prefira evolução additive dentro de uma versão apenas quando a análise de compatibility sustentar.
3. Para breaking changes, publique uma nova versão e execute o processo de [breaking-changes.md](breaking-changes.md).
4. Documente janelas de depreciação e passos de migração.
5. Mantenha versões antigas descobíveis até o arquivamento ([contract-lifecycle.md](contract-lifecycle.md)).

## Documentos relacionados

- [contract-compatibility.md](contract-compatibility.md)
- [breaking-changes.md](breaking-changes.md)
- [contract-change-management.md](contract-change-management.md)
- [versioning.md](versioning.md)
- [deprecation.md](deprecation.md)
