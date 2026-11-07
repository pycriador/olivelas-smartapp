# Infrastructure

> Language: pt-BR | [English](../../en/infrastructure/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Categoria para documentação de infraestrutura e recursos em projetos em adoção.

## Objetivo

Descrever ambientes, recursos, provisionamento, limites de rede relevantes à operação e restrições de infraestrutura.

## Orientação

- Permaneça agnóstico de tecnologia no nível estrutural.
- Documente o que existe hoje; rotule topologia futura como Proposed.
- Referencie caminhos de IaC/manifestos como evidência.
- Não armazene credenciais ou valores de segredos.

## Conteúdos sugeridos

| Tópico | Exemplos do que capturar |
| --- | --- |
| Environments | nomes, propósito, fluxo de promoção |
| Resources | compute, storage, filas, registries — conforme aplicável |
| Provisioning | como a infraestrutura é definida e aplicada |
| Constraints | quotas, regiões, modelo de isolamento |

Nenhum requisito universal de nuvem, container ou orquestrador é implícito nesta categoria.
