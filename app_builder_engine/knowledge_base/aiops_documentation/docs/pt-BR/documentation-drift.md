# Drift de documentação

> Language: pt-BR | [English](../en/documentation-drift.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0


**Documentation drift** é o gap entre o que os documentos afirmam e o que é verdadeiro nas fontes autoritativas que esses documentos deveriam refletir.

```text
Documented knowledge
        ≠
Authoritative reality (code, config, contract, runtime, control)
```

## Documentation drift vs domain drift

| Kind | Meaning | Canonical doc |
| --- | --- | --- |
| **Documentation drift** | Docs errados/ausentes em relação à realidade (geral) | Este documento + [stale-documentation.md](stale-documentation.md) |
| **Arquitetura drift** | Arquitetura documentada ≠ arquitetura real | [architecture-drift.md](architecture-drift.md) |
| **Contract drift** | Contrato documentado ≠ interface real | [contract-drift.md](contract-drift.md) |
| **Operational drift** | Docs de ops ≠ operações reais | [operational-drift.md](operational-drift.md) |
| **Segurança drift** | Docs de security ≠ postura/controles reais | [security-drift.md](security-drift.md) |

Docs de domain drift especializam detecção e tratamento. Documentation drift é o guarda-chuva: qualquer gap doc↔realidade, incluindo índices cross-cutting, registries e páginas de contexto de IA.

## Relação com stale documentation

[stale-documentation.md](stale-documentation.md) descreve **sinais e tratamento** quando docs parecem atuais mas não estão. Drift é o **mismatch estrutural** sendo sinalizado. Idade sozinha não prova drift.

## Como tratar

1. Classifique o impacto (cosmético vs operacional/segurança).
2. Aponte a evidência.
3. Corrija docs, ou mova para `REVIEW`, ou registre [documentation-debt.md](documentation-debt.md).
4. Se o *sistema* estiver errado em relação a uma decisão aceita, considere também debt de architecture/security/contract — não só edições de doc.
5. Nunca “resolva” drift escrevendo um estado futuro desejado como Confirmed atual.

## Regras da IA

- Ao detectar possível drift, rotule claims como Inferred/Unknown até verificar.
- Linke o doc de domain drift correspondente quando o mismatch for arquitetural, contratual, operacional ou de segurança.
- Não invente requisitos de automação para detecção de drift nesta versão do padrão.

## Documentos relacionados

- [stale-documentation.md](stale-documentation.md)
- [architecture-drift.md](architecture-drift.md)
- [contract-drift.md](contract-drift.md)
- [operational-drift.md](operational-drift.md)
- [security-drift.md](security-drift.md)
- [documentation-freshness.md](documentation-freshness.md)
- [contradiction-model.md](contradiction-model.md)

