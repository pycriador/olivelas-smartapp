# Dívida de Arquitetura

> Language: pt-BR | [English](../en/architecture-debt.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

Como distinguir e registrar architecture debt versus technical debt e documentation debt.

## Três dívidas distintas

| Tipo | Significado | Exemplo típico |
| --- | --- | --- |
| **Technical Debt** | Problema na **implementação** (qualidade de código/config, atalhos, testes ausentes) | Lógica duplicada, módulo frágil, sem testes automatizados para um caminho |
| **Arquitetura Debt** | Escolha **estrutural ou de decisão** que cria custo futuro, risco ou restrição | Dependências cíclicas entre unidades implantáveis; acoplamento de DB compartilhado que bloqueia mudança independente; padrão desatualizado ainda imposto |
| **Documentation Debt** | **Informação** de arquitetura (ou outra) ausente, errada ou obsoleta | Sem seção de failure domains; diagrama contradiz o runtime; doc de contrato ausente |

Elas frequentemente coexistem. Registre cada uma no tipo certo para que a remediação aponte o artefato certo (código vs estrutura vs docs).

Detalhes de documentation debt: [documentation-debt.md](documentation-debt.md). Drift (docs ≠ realidade) frequentemente gera documentation debt e pode revelar architecture debt: [architecture-drift.md](architecture-drift.md).

## Quando algo é architecture debt

Trate como architecture debt quando o problema for principalmente sobre:

- estrutura do sistema, fronteiras ou acoplamento;
- topologia de comunicação ou direção de dependência que é custosa;
- deficiências de atributos de qualidade causadas pela estrutura (não uma única função com bug);
- decisões que deveriam ser revisitadas (com ou sem ADR);
- ausência de isolamento que a arquitetura alega ou precisa.

**Não** rotule todo bug ou unit test ausente como architecture debt.

## Como registrar architecture debt

Mantenha um registro simples (issue tracker, tabela Markdown ou backlog). Cada item deve incluir:

| Campo | Significado |
| --- | --- |
| **ID** | Identificador estável (por exemplo `ARCH-012`) |
| **Description** | Qual problema estrutural ou de decisão existe |
| **Impact** | Custo futuro, risco ou restrição se não resolvido |
| **Owner** | Time, squad ou papel responsável |
| **Priority** | `High` / `Medium` / `Low` |
| **Status** | `Open` / `In Progress` / `Resolved` / `Accepted Risk` |

Exemplo:

| ID | Description | Impact | Owner | Priority | Status |
| --- | --- | --- | --- | --- | --- |
| ARCH-004 | Dois serviços compartilham um datastore gravável sem contrato | Bloqueia deploy independente; falha acopla ambos | platform-squad | High | Open |

Campos opcionais úteis: ADR relacionado, componentes relacionados, IDs de drift/doc debt relacionados, janela alvo de resolução.

## Orientação de prioridade

| Priority | Orientação |
| --- | --- |
| **High** | Bloqueia evolução segura, cria blast radius material de outage ou viola uma restrição aceita |
| **Medium** | Custo ou acoplamento significativo; workarounds existem |
| **Low** | Cleanup ou estado final preferido; baixo blast radius |

## Orientação de status

| Status | Significado |
| --- | --- |
| `Open` | Reconhecido, não iniciado |
| `In Progress` | Sendo tratado ativamente (frequentemente via ADR + mudança estrutural) |
| `Resolved` | Estrutura/decisão atualizada; docs alinhados e revisados conforme necessário |
| `Accepted Risk` | Explicitamente adiado; impacto compreendido pelo owner |

`Accepted Risk` é uma decisão, não negligência. Registre quem aceitou e por quê. Considere um ADR quando a aceitação em si for arquitetural.

## Relação com o ciclo de vida

- Descobrir architecture debt não inventa um novo token de status de documento.
- Remediações que alteram docs de arquitetura usam `ACCEPTED → REVIEW → ACCEPTED` quando materiais.
- Novas decisões estruturais devem aterrar como ADRs quando atenderem à barra de ADR do projeto ([decisions/README.md](decisions/README.md)).

## Práticas

- Prefira poucos itens de debt precisos a um backlog vago.
- Linke IDs de debt a partir de review records e descrições de PR.
- Separe aspirações "queríamos microservices" de debt estrutural evidenciado.
- Nunca apresente debt Accepted Risk como arquitetura saudável Confirmed.

## Documentos relacionados

- [documentation-debt.md](documentation-debt.md)
- [architecture-drift.md](architecture-drift.md)
- [architecture-review.md](architecture-review.md)
- [architecture-traceability.md](architecture-traceability.md)
- [decisions/README.md](decisions/README.md)
- [quality-model.md](quality-model.md)
