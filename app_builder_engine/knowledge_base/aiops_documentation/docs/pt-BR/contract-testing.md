# Testes de Contrato

> Language: pt-BR | [English](../en/contract-testing.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Orientação conceitual para verificar que participantes honram um contrato técnico.

Este padrão **não** manda ferramentas, frameworks ou vendors. A estratégia depende do tipo de contrato e do risco do projeto.

## O que significa contract testing

Contract testing verifica que producers e consumers concordam sobre a fronteira — estrutura e, quando viável, comportamento crítico — sem exigir um ambiente end-to-end completo para cada asserção.

Complementa (não substitui) unit tests e testes de integração mais amplos.

## Tipos de verificação

### Producer Verification

Evidência de que o producer emite ou aceita o que o contrato afirma: schemas batem com a saída, campos obrigatórios presentes, formas de erro honradas, identificadores de versão corretos.

### Consumer Verification

Evidência de que o consumer consegue lidar com o contrato: campos obrigatórios lidos corretamente, política de unknown-field conforme documentado, tratamento de erro alinhado às expectativas.

### Schema Validation

Checagens de máquina ou teste de que payloads conformam ao schema declarado ([schema-documentation.md](schema-documentation.md), [contract-validation.md](contract-validation.md)).

### Compatibility Testing

Checagens de que uma mudança permanece compatível com as premissas declaradas de consumer/producer ([contract-compatibility.md](contract-compatibility.md)) — por exemplo consumer antigo vs fixtures de producer novo.

### Integration Testing

Testes mais amplos em infraestrutura real ou simulada. Úteis para comportamentos de delivery, ordering e timing que checagens puras de schema não provam. Ainda agnóstico de tecnologia no nível da documentação: descreva *o que* é verificado, não um stack obrigatório.

## Orientação por tipo de contrato

| Type | Typical focus |
| --- | --- |
| API | Formas request/response, erros, modos de falha de auth |
| Event / Message | Schema do payload, tratamento de duplicata, tolerância do consumer |
| File | Validação de row/record, encoding, comportamento de arquivo parcial |
| Library | Assinaturas da API pública e side effects documentados |

## Expectativas de documentação

Quando testes existirem, o contrato (ou doc de ops relacionado) pode linkar:

- o que é verificado;
- onde os testes vivem;
- o que permanece Unverified / Unknown.

Não afirme "fully contract-tested" sem evidência. Não invente status verde.

## Documentos relacionados

- [contract-compatibility.md](contract-compatibility.md)
- [contract-source-of-truth.md](contract-source-of-truth.md)
- [contract-drift.md](contract-drift.md)
- [contract-checklist.md](contract-checklist.md)
