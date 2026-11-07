# Guia de Estilo

> Language: pt-BR | [English](../en/style-guide.md)
>
> Status: REVIEW
>
> Documentation Standard v1.0

Como escrever documentação sob este padrão.

## Objetivos

A documentação deve ser:

- objetiva;
- técnica;
- clara;
- consistente;
- verificável;
- livre de linguagem de marketing desnecessária.

## Regras de escrita

### Seja direto

Declare o fato e, em seguida, forneça evidência ou referência.

Prefira:

> O worker processa eventos `order.created` e grava acknowledgements no stream `order-ack`.

Evite:

> Este componente incrível potencializa de forma seamless nossa jornada event-driven.

### Prefira estrutura à narrativa

Prefira:

- tabelas;
- listas;
- diagramas;
- exemplos;
- referências;
- layouts de seção previsíveis.

Use parágrafos curtos quando a explicação for necessária. Evite blocos longos de prosa.

### Uma ideia por seção

Cada seção deve responder a uma pergunta. Se uma seção misturar propósito, operação e histórico, divida-a.

### Use linguagem precisa

| Evite | Prefira |
| --- | --- |
| "rápido", "escalável", "robusto" sem métricas | afirmações mensuráveis ou trade-offs explícitos |
| "geralmente", "às vezes" sem condições | condições e casos conhecidos |
| "etc." que esconde itens importantes | listas completas ou "não identificado" |
| "legado" sem definição | o que está restrito e por quê |

### Mantenha a terminologia consistente

- Reutilize os mesmos nomes de componentes e contratos entre documentos.
- Não invente sinônimos para o mesmo conceito.
- Preserve a nomenclatura existente do projeto; não renomeie apenas na documentação.


### Nomes canônicos

Todo component, service, contract e outro artefato de engenharia nomeado deve ter **um nome canônico** usado em títulos, registries, manifests e cross-references.

| Rule | Guidance |
| --- | --- |
| One canonical form | Prefira a grafia do registry / SoT (`checkout-api`, não “Checkout API svc”) |
| Stable IDs | Pareie o nome com um ID estável quando substantivo (`CMP-001`, `CONTRACT-001`) — [document-identity.md](document-identity.md) |
| Display variants | Labels de UI ou apelidos informais podem aparecer uma vez, mapeados ao nome canônico |
| Renames | Atualize registries e links; não deixe nomes “atuais” concorrentes |

### Abreviações

| Rule | Guidance |
| --- | --- |
| Expand on first use | `Service Level Objective (SLO)` na primeira menção no doc, depois `SLO` |
| Prefer project glossary | Registre abreviações recorrentes no glossário do projeto ([glossary.md](glossary.md)) |
| Do not invent acronyms | Não crie novas abreviações só por brevidade documental |
| Machine tokens stay English | Tokens de ciclo de vida e classification (`ACCEPTED`, `Confirmed`) não são abreviados além disso |

### A IA deve usar nomes canônicos

Agentes de IA que leem ou escrevem documentação **devem**:

1. Preferir nomes e IDs de registries, manifests e docs Authoritative.
2. Não inventar grafias alternativas, codenames ou sinônimos “mais amigáveis”.
3. Quando um nome informal aparecer em uma pergunta, resolvê-lo para o nome canônico antes de responder ou editar.
4. Marcar **Unknown** quando o nome canônico não puder ser estabelecido — não adivinhar.

Veja [ai-context.md](ai-context.md) e [ai-answering-rules.md](ai-answering-rules.md).

### Separe fato de interpretação


- Comportamento atual → Confirmed ou Inferred
- Informação ausente → Unknown
- Ideias futuras → Proposed

Veja as regras de classificação em [standards.md](standards.md).

## O que evitar

- Frases vagas
- Exagero
- Duplicação desnecessária
- Afirmações não verificadas
- Parágrafos excessivamente longos
- Apresentar propostas como estado atual
- Valores de segredos ou dados sensíveis
- Premissas tecnológicas apresentadas como requisitos universais

## O que preferir

| Padrão | Por quê |
| --- | --- |
| Tabelas para inventários | Escaneáveis e comparáveis |
| Passos ordenados para runbooks | Executáveis |
| Marcadores explícitos de Unknown | Impedem invenção |
| Links para fontes canônicas | Fonte única da verdade |
| Links em duas superfícies (GitHub + Confluence) | Packs publicados permanecem navegáveis em ambas — [publishing-surfaces.md](publishing-surfaces.md) |
| Diagramas Mermaid ou texto | Versionáveis e revisáveis |
| Exemplos curtos | Clarificam contratos e fluxos |

## Tom

- Tom de engenharia: calmo, preciso, neutro.
- Sem linguagem de vendas.
- Sem linguagem de culpa em documentos de incidente ou limitações.
- Modo imperativo em procedimentos ("Verifique", "Reinicie", "Valide").

## Expectativas de esqueleto do documento

Salvo quando um template definir o contrário, coloque perto do topo:

1. Título
2. Status (e, opcionalmente, owner / last reviewed)
3. Propósito ou visão geral
4. Escopo
5. Seções do corpo
6. Documentação relacionada

## Consistência entre documentos

Antes de finalizar um documento:

1. Confira os nomes em relação aos documentos existentes.
2. Linke em vez de copiar contratos e decisões.
3. Atualize referências ao renomear arquivos.
4. Garanta que diagramas correspondam ao estado atual escrito.

## Documentos relacionados

- [principles.md](principles.md)
- [standards.md](standards.md)
- [document-identity.md](document-identity.md)
- [glossary.md](glossary.md)
- [documentation-checklist.md](documentation-checklist.md)
- [ai-context.md](ai-context.md)
- [ai-documentation.md](ai-documentation.md)
- [language.md](language.md)
- [lifecycle.md](lifecycle.md)
- [quality-model.md](quality-model.md)
