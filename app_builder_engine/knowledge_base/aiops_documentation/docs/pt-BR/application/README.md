# Application

> Language: pt-BR | [English](../../en/application/README.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Categoria para documentação de componentes de aplicação em projetos em adoção.

## Objetivo

Descrever componentes de aplicação, responsabilidades, interfaces, configuração e considerações operacionais.

## Orientação

- Um documento de componente por unidade implantável ou lógica significativa.
- Mantenha a documentação perto do componente quando o layout do repositório permitir.
- Separe responsabilidades de não responsabilidades.
- Linke contratos em vez de duplicá-los.

## Conteúdos sugeridos

| Documento | Propósito |
| --- | --- |
| `components/<name>.md` | Documentação do componente |
| Notas de integração | Interações entre componentes quando não cobertas por contratos |

## Templates

- [../templates/component.md](../templates/component.md)
- [../templates/integration.md](../templates/integration.md)
