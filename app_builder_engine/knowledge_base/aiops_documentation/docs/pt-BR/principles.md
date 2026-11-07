# Princípios de Documentação

> Language: pt-BR | [English (EN)](../en/principles.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## Princípio central

A documentação faz parte do produto de engenharia.

Não é um artefato secundário ou opcional.

Uma documentação adequada deve permitir que alguém que nunca trabalhou no projeto compreenda:

- por que o projeto existe;
- qual problema ele resolve;
- como funciona;
- quais componentes possui;
- como os componentes se relacionam;
- quais dependências possui;
- como usá-lo;
- como operá-lo;
- como modificá-lo;
- quais riscos existem;
- quais decisões arquiteturais foram tomadas.

A documentação também deve ser estruturada o suficiente para que **agentes de IA a usem como contexto confiável**.

---

## 1. Documentação como código

A documentação deve:

- viver junto com o código;
- ser versionada;
- passar por revisão;
- manter histórico;
- seguir padrões;
- ser atualizada junto com mudanças relevantes.

Trate pull requests de documentação com o mesmo rigor aplicado a mudanças de código que afetam compreensão, operação ou integração.

---

## 2. Fonte única da verdade

Evite duplicação desnecessária.

Quando uma informação tem fonte oficial, outros documentos devem referenciá-la em vez de copiá-la.

Exemplo:

```text
API Contract
     ↑
     │
Architecture
     │
Runbook
```

Não replique o mesmo contrato em vários documentos. Linke para o contrato canônico e descreva apenas a perspectiva necessária no documento atual.

---

## 3. Estado atual primeiro

A documentação deve distinguir claramente:

| Tipo | Significado |
| --- | --- |
| Estado atual | O que existe e se comporta hoje |
| Comportamento inferido | Deduzido de evidências, ainda não confirmado como intenção de desenho |
| Decisões | Escolhas registradas (geralmente via ADRs) |
| Limitações | Restrições conhecidas do sistema atual |
| Propostas futuras | Estado desejado ou planejado |

Uma arquitetura desejada nunca deve ser apresentada como arquitetura existente.

---

## 4. Documentação baseada em evidência

Sempre que possível, afirmações técnicas devem ter evidência.

Exemplos de evidência:

- arquivo;
- módulo;
- configuração;
- código;
- definição de infraestrutura;
- teste;
- contrato;
- ADR.

Evite afirmações sem suporte. Se a evidência estiver ausente, marque a informação como Unknown ou Inferred.

---

## 5. Estrutura agnóstica de tecnologia

A estrutura da documentação é independente de tecnologia.

Não assuma como requisitos universais:

- provedor de nuvem;
- linguagem;
- framework;
- banco de dados;
- runtime de containers;
- Kubernetes;
- serverless;
- um estilo específico de arquitetura.

A estrutura deve se adaptar ao projeto. A tecnologia aparece no conteúdo do projeto, não como forma obrigatória do padrão.

---

## 6. Documentação para humanos e IA

A documentação deve ser:

- legível por humanos;
- estruturada para máquinas;
- consistente;
- semanticamente clara;
- previsível;
- modular.

Prefira tabelas, listas e estruturas explícitas a texto narrativo longo quando a narrativa reduzir a capacidade de varredura ou verificação.

---

## 7. Documentação perto da fonte

Quando a informação depende diretamente de um componente específico, mantenha-a perto da documentação desse componente.

Evite um único documento gigante que tente descrever o sistema inteiro em um só lugar.

Use um documento de visão geral para navegação e documentos no nível de componente para o detalhe.

---

## 8. Desconhecidos explícitos

Quando a informação não estiver disponível, não a invente.

Use um marcador explícito, por exemplo:

> Não identificado.

ou:

> Informação ainda não documentada.

Para classificação estruturada, use Unknown (veja [standards.md](standards.md)).

---

## 9. Ciclo de vida da documentação

A documentação tem um ciclo de vida explícito. Os tokens de status duráveis são:

```text
DRAFT → REVIEW → ACCEPTED → DEPRECATED → ARCHIVED
```

Atualizações materiais em um documento `ACCEPTED` seguem o ciclo `ACCEPTED → REVIEW → ACCEPTED` (às vezes chamado de "UPDATED" na conversa — não é um token de status armazenado).

| Status | Significado |
| --- | --- |
| `DRAFT` | Trabalho em andamento; pode estar incompleto |
| `REVIEW` | Pronto para revisão ou em revisão |
| `ACCEPTED` | Aprovado como orientação ou descrição atual |
| `DEPRECATED` | Ainda visível, mas substituído ou não mais primário |
| `ARCHIVED` | Retido para histórico; não é orientação ativa |

Status e ownership do documento devem ser visíveis perto do topo de cada documento substantivo (preferencialmente YAML frontmatter). Veja [lifecycle.md](lifecycle.md), [status.md](status.md) e [standards.md](standards.md).

---

## Princípios AI-Ready

Estes dez princípios estendem a base acima para o Documentation Standard v1.0. Eles regem como a documentação deve se comportar como **contexto de IA** — não como construir RAG, embeddings ou agentes.

### AR-1. Documentação é contexto

A documentação é o principal contexto estruturado para consumidores de IA. Escreva de modo que um agente localize escopo, fatos e limites sem conhecimento tribal.

### AR-2. Identidade estável e nomes canônicos

Todo documento, componente e serviço substantivo tem um ID estável e um nome canônico. Sinônimos e apelidos devem mapear de volta à forma canônica ([style-guide.md](style-guide.md), [document-identity.md](document-identity.md)).

### AR-3. Estrutura acima de narrativa ambígua

Prefira tabelas, inventários, campos tipados e enums explícitos a prosa longa que enterra fatos. A narrativa explica; a estrutura carrega a verdade ([machine-readable.md](machine-readable.md)).

### AR-4. Claims ligados a evidência

Afirmações técnicas materiais são claims com classificação e evidência. Nunca trate Inferred como Confirmed; nunca apresente Proposed como atual ([claims.md](claims.md), [evidence-model.md](evidence-model.md)).

### AR-5. Relacionamentos explícitos

Conexões entre documentos e componentes usam um vocabulário controlado de relacionamentos. Não dependa só de prosa implícita do tipo “relacionado de algum modo” ([document-relationships.md](document-relationships.md)).

### AR-6. Contexto progressivo

Carregue contexto por pergunta e profundidade. Comece em [ai-context.md](ai-context.md) e escale níveis só conforme necessário ([progressive-context.md](progressive-context.md)).

### AR-7. Incerteza honesta

Unknowns, premissas, gaps e contradições são registrados explicitamente. Documentação incompleta e precisa supera documentação completa e inventada ([knowledge-gaps.md](knowledge-gaps.md), [contradiction-model.md](contradiction-model.md)).

### AR-8. IA sem autoridade

A IA pode fazer Discovery, Analysis, Validation, Generation e Maintenance de rascunhos. A IA **não** possui aceitação, reatribuição de ownership nem substituição silenciosa de fontes Authoritative ([lifecycle.md](lifecycle.md), [ai-task-boundaries.md](ai-task-boundaries.md)).

### AR-9. Integridade de contexto

Não misture sistemas, ambientes ou eras em uma resposta indiferenciada. Mantenha Confirmed distinto de Proposed; rotule Historical; preserve limites de source-of-truth ([source-of-truth.md](source-of-truth.md)).

### AR-10. Contexto seguro

Nunca incorpore valores de segredos ou dados sensíveis desnecessários na documentação ou em saídas de IA. Referencie segredos apenas por nome e origem; redija com `[REDACTED]` quando necessário ([ai-context-safety.md](ai-context-safety.md)).

---

## Princípios de governança

Estes dez princípios estendem a base para o Documentation Standard v1.0. Eles regem como a qualidade da documentação é **aplicada** — não como construir portais SaaS ou plataformas externas.

### GV-1. Ownership explícito

O ownership da documentação deve ser explícito para documentos Authoritative e operacionalmente críticos ([documentation-ownership.md](documentation-ownership.md)).

### GV-2. Accountability Authoritative

Documentação Authoritative exige owner nomeado e accountable, além de controle de mudança ([source-of-truth.md](source-of-truth.md), [governance.md](governance.md)).

### GV-3. Regras objetivas automatizáveis

A validação automatizada deve aplicar regras objetivas (metadata, IDs, links, manifest) ([automation.md](automation.md)).

### GV-4. Decisões semânticas humanas

A revisão humana deve tratar decisões semânticas: verdade arquitetural, adequação de segurança, força da evidência, resolução de contradições.

### GV-5. Exceções explícitas

Exceções devem ser explícitas, ter owner e, quando temporárias, prazo ([exceptions.md](exceptions.md)).

### GV-6. Mudanças rastreáveis

Mudanças devem ser rastreáveis via Git, checagens de PR e registros de mudança quando materiais ([governance-auditability.md](governance-auditability.md)).

### GV-7. Distinguir Deprecated

Documentação Deprecated deve permanecer distinguível da orientação atual ([history-model.md](history-model.md)).

### GV-8. Sem edições Authoritative silenciosas

A automação não deve alterar silenciosamente conhecimento Authoritative. Propostas de IA exigem aceitação humana ([ai-task-boundaries.md](ai-task-boundaries.md)).

### GV-9. Governança documentada

As próprias regras de governança devem ser documentadas e versionadas ([governance-versioning.md](governance-versioning.md)).

### GV-10. Quality gates

Quality gates devem impedir que falhas conhecidas de documentação sejam mescladas quando a severidade ERROR se aplica ([quality-gates.md](quality-gates.md)).

---

## Documentos relacionados

- [standards.md](standards.md)
- [lifecycle.md](lifecycle.md)
- [status.md](status.md)
- [ownership.md](ownership.md)
- [style-guide.md](style-guide.md)
- [ai-context.md](ai-context.md)
- [ai-ready-model.md](ai-ready-model.md)
- [ai-documentation.md](ai-documentation.md)
- [governance.md](governance.md)
- [automation.md](automation.md)
- [documentation-checklist.md](documentation-checklist.md)
- [language.md](language.md)
- [quality-model.md](quality-model.md)
