# Contratos de Arquivo

> Language: pt-BR | [English](../en/file-contracts.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Orientação para documentar integrações baseadas em **arquivo** (ou artefatos semelhantes a arquivo).

**Não** assuma CSV. Formatos podem incluir CSV, JSON, XML, Parquet, plain text, binary ou outros formatos do projeto — registre o real.

## Documente quando aplicável

| Topic | Guidance |
| --- | --- |
| Filename | Padrão, unicidade, sequenciamento |
| Format | Formato(s) realmente suportado(s) |
| Encoding | Encoding de caracteres / convenções binárias |
| Schema | Estrutura de record/campo ([schema-documentation.md](schema-documentation.md)) |
| Delimiter | Apenas se relevante para o formato |
| Header | Presença e significado de header rows / arquivos de metadados |
| Required fields | Requisitos estruturais e de negócio |
| Validation | [contract-validation.md](contract-validation.md) |
| Size | Tamanho máximo, contagens de linhas, regras de split |
| Frequency | Agenda, trigger ou ad-hoc |
| Producer | Quem escreve/publica o arquivo |
| Consumer | Quem lê/importa |
| Delivery | Como o arquivo é trocado (drop path, object store, transfer — termos do projeto) |
| Retention | Por quanto tempo arquivos permanecem; archival/deletion |
| Failure handling | Arquivos parciais, corrompidos, retries, quarantine |

## Semântica importa

O significado de campos em arquivos batch é fonte frequente de quebra silenciosa. Aplique [semantic-contracts.md](semantic-contracts.md) (units, dates, nulls, codes).

## Arquivos parciais e atrasados

Documente expectativas para:

- uploads incompletos;
- chegadas tardias em relação a um business deadline ([timing-contract.md](timing-contract.md));
- delivery duplicada de arquivo;
- evolução de schema entre versões de arquivo.

## Documentos relacionados

- [contract-types.md](contract-types.md)
- [schema-documentation.md](schema-documentation.md)
- [contract-validation.md](contract-validation.md)
- [timing-contract.md](timing-contract.md)
- [delivery-semantics.md](delivery-semantics.md)
