# App Builder Engine — Documentação Técnica

## Visão Geral

O **App Builder Engine** é uma plataforma de engenharia de software orientada por IA, responsável por centralizar conhecimento técnico, padrões arquiteturais, componentes reutilizáveis e templates de implementação.

Seu propósito é fornecer uma base consistente para que agentes de IA (Cursor, Claude Code, Antigravity, etc.) possam projetar e construir aplicações utilizando uma **única fonte da verdade** (Single Source of Truth).

A plataforma atua como uma camada de inteligência entre os modelos de IA e os ativos de engenharia da organização.

---

## 🎯 Objetivos

- **Centralizar conhecimento técnico**: Unificar especificações (SDDs), regras de segurança e design tokens.
- **Padronizar decisões arquiteturais**: Eliminar divergências estruturais entre times e projetos gerados por IA.
- **Reutilizar componentes**: Catalogar componentes canônicos de Frontend e Backend.
- **Disponibilizar especificações estruturadas**: Servir esquemas e contratos consumíveis via API.
- **Expor APIs para consumo por agentes de IA**: Interface unificada REST OpenAPI.
- **Reduzir inconsistências**: Validar regras de ouro antes da geração de código.
- **Facilitar a evolução contínua**: Todo novo padrão vira ativo reutilizável.

---

## 🗂️ Estrutura da Documentação

```text
docs/
├── README.md                ← Visão geral da documentação e índice (este arquivo)
│
├── architecture/            ← Architecture Decision Records (ADRs)
│   ├── ADR-0001.md          ← Filosofia da Plataforma
│   ├── ADR-0002.md          ← Arquitetura Geral
│   ├── ADR-0003.md          ← Organização dos Módulos
│   ├── ADR-0004.md          ← Padrão API First
│   ├── ADR-0005.md          ← Knowledge Engine & SDD Loader
│   └── ADR-0006.md          ← AI Gateway & AI-BAS Compliance
│
├── specifications/          ← Especificações de engenharia e regras de negócio
│   └── README.md
│
├── frontend/                ← Padrões de UI, Design System e Frameworks
│   └── README.md
│
├── backend/                 ← Padrões de API, Banco de Dados, Segurança e Serviços
│   └── README.md
│
├── api/                     ← Referência dos endpoints e contratos REST
│   └── README.md
│
└── development/             ← Guia de desenvolvimento, testes e contribuição
    └── README.md
```

---

## 📜 Architecture Decision Records (ADR)

As decisões estruturais e fundamentações técnicas do projeto estão formalizadas nos seguintes registros:

1. [ADR-0001 — Filosofia da Plataforma](architecture/ADR-0001.md)
2. [ADR-0002 — Arquitetura Geral](architecture/ADR-0002.md)
3. [ADR-0003 — Organização dos Módulos](architecture/ADR-0003.md)
4. [ADR-0004 — Padrão API First](architecture/ADR-0004.md)
5. [ADR-0005 — Knowledge Engine](architecture/ADR-0005.md)
6. [ADR-0006 — AI Gateway](architecture/ADR-0006.md)
