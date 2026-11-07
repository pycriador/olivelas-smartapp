# Modelo de Contrato

> Language: pt-BR | [English](../en/contract-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Um **contrato técnico** é uma fronteira explícita entre dois ou mais participantes que define como eles interagem e quais regras cada lado deve respeitar para a interação funcionar corretamente.

Um contrato responde:

> Como uma parte do sistema espera interagir com outra?

É mais do que uma lista de endpoints ou um esboço de payload. Quando aplicável, cobre participantes, responsabilidades, protocolo, formato, schema, semântica, validação, auth, erros, timing, retry, idempotency, ordering, delivery, versioning e compatibility.

## Contrato como fronteira

```text
Producer
    │
    │  Contract (shared expectations)
    ▼
Consumer
```

O contrato pertence ao **relacionamento**, não apenas ao producer. Documente expectativas dos dois lados. Evite narrativas só do producer que deixam obrigações do consumer e tratamento de falha implícitos.

Integração com arquitetura:

```text
Architecture
      │
      ├── Component
      │
      └── Contract
             │
             ├── Producer
             └── Consumer
```

Docs de arquitetura nomeiam componentes e relacionamentos; contratos guardam o detalhe verificável da interface. Prefira links da arquitetura para contratos em vez de copiar schemas na prosa de arquitetura. Veja [architecture-model.md](architecture-model.md) (nível Interfaces) e [contracts/README.md](contracts/README.md).

## Participantes

| Role | Meaning |
| --- | --- |
| **Producer** | Produz informação, um comando, um evento ou uma resposta |
| **Consumer** | Consome ou interpreta esse conteúdo |
| **Provider** | Expõe uma capacidade |
| **Client** | Usa uma capacidade exposta por um provider |
| **Sender** | Envia uma mensagem ou informação |
| **Receiver** | Recebe uma mensagem ou informação |

Esses papéis **podem se sobrepor**. O mesmo componente pode ser Producer de um evento e Consumer de outro contrato. Um Provider frequentemente também é Producer de respostas; um Client frequentemente é Consumer dessas respostas.

### Orientação de nomenclatura

- Prefira os termos de domínio já estabelecidos do projeto quando forem claros e estáveis.
- **Não** force renomear a terminologia local para coincidir com este vocabulário.
- Ao mapear termos locais, declare o mapeamento uma vez (por exemplo: "Gateway = Provider; Mobile app = Client").
- Sempre identifique ao menos quem produz/fornece e quem consome/usa quando ambos forem conhecidos; marque **Unknown** quando não identificados.

## O que um contrato deve tornar explícito

Quando aplicável:

| Area | Question |
| --- | --- |
| Purpose | Por que esta fronteira existe? |
| Participants | Quem interage, e em qual papel? |
| Protocol / channel | Como se conectam (descrição agnóstica de tecnologia)? |
| Input / output | O que atravessa a fronteira? |
| Schema + semantics | Estrutura **e** significado |
| Rules | Validação, authn/authz, limites |
| Behavior | Erros, retry, timeout, idempotency, ordering, delivery |
| Evolution | Versão, compatibility, deprecation |

Omita seções que não se aplicam. Não invente garantias.

## Postura tecnológica

Contratos podem ser realizados com qualquer protocolo ou formato. HTTP, RPC, filas, arquivos, bibliotecas e pipelines são **implementações**, não requisitos deste modelo.

## Documentos relacionados

- [contract-types.md](contract-types.md)
- [contract-lifecycle.md](contract-lifecycle.md)
- [contract-ownership.md](contract-ownership.md)
- [semantic-contracts.md](semantic-contracts.md)
- [contracts/README.md](contracts/README.md)
- [templates/contract.md](templates/contract.md)
