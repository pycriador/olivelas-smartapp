# Arquitetura vs Implementação

> Language: pt-BR | [English](../en/architecture-vs-implementation.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Separação clara entre documentação de arquitetura, design e implementação — para que docs de arquitetura permaneçam úteis e não se tornem inventários no nível de classe.

## Definições

### Arquitetura

Decisões estruturais e relacionamentos que importam para entender o sistema como um todo:

- fronteira do sistema e contexto;
- componentes principais e unidades implantáveis;
- estilos de comunicação e dependências críticas;
- fronteiras de confiança e falha em um grão significativo;
- atributos de qualidade e restrições que moldam a estrutura;
- trade-offs que explicam a forma atual.

Documentação de arquitetura descreve **o que existe** (estado atual) e aponta para o **porquê** via ADRs.

### Design

Como uma solução é organizada dentro de um quadro arquitetural:

- layout de módulos dentro de um componente;
- padrões locais para uma feature;
- design detalhado de interação para um caso de uso;
- information architecture de UI para um app frontend.

Design pode ser documentado em docs de componente, RFCs ou specs de feature. É mais fino que arquitetura e mais grosso que implementação linha a linha.

### Implementação

Como código e configuração realizam o design:

- classes, funções, arquivos;
- frameworks e bibliotecas;
- algoritmos exatos;
- argumentos de recursos de IaC;
- testes como evidência executável.

Detalhe de implementação pertence principalmente ao código, comentários de código quando apropriado e docs orientados a desenvolvedores — não como o grosso de um overview de arquitetura.

## Comparação

| Preocupação | Arquitetura | Design | Implementation |
| --- | --- | --- | --- |
| Grão | System / component | Module / feature | Code / config |
| Estabilidade | Muda com pouca frequência | Muda com features | Muda com frequência |
| Pergunta principal | Quais são as partes e relacionamentos? | Como esta solução está moldada? | Como está codificado/configurado? |
| Doc típico | Overview de arquitetura, contexto, ADR | Doc de componente, RFC | Árvore de fonte, READMEs perto do código |

## O que não colocar em docs de arquitetura

Evite transformar documentação de arquitetura em:

- uma lista de toda classe ou função;
- um espelho da árvore de pacotes sem significado arquitetural;
- conteúdo de tutorial de framework;
- refactors Proposed apresentados como arquitetura atual;
- grafos auto-gerados que ninguém mantém.

Se um diagrama só faz sentido para quem já conhece todo nome de tipo, provavelmente é detalhe de implementação — mova para baixo ou descarte.

## Quando implementação aparece em docs de arquitetura

Referências de implementação são bem-vindas como **evidência**:

- caminho para um módulo que realiza um componente;
- nome de chave de config (nunca valores secretos);
- teste ou contrato que Confirms uma afirmação.

Mantenha referências curtas. Não cole blocos grandes de código em overviews de arquitetura.

## Mapeamento para níveis de documentação

| [Profundidade de audiência](architecture-model.md) | Prefira |
| --- | --- |
| Level 1–2 | Arquitetura |
| Level 3 | Arquitetura + design seletivo |
| Level 4 | Design + ponteiros de implementação |

## Documentos relacionados

- [architecture-model.md](architecture-model.md)
- [architecture-traceability.md](architecture-traceability.md)
- [architecture-by-project-type.md](architecture-by-project-type.md)
- [principles.md](principles.md)
- [decisions/README.md](decisions/README.md)
