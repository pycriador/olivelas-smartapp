# Especificações Técnicas (SDDs)

Esta seção consolida as especificações que alimentam a base de conhecimento do **App Builder Engine**.

## 📚 Especificações Indexadas

### Frontend SDDs
- **Volume I — Loft Design System — Foundation & UI Guidelines**: Tokens de cor, tipografia Inter, espaçamentos, raio de borda de 12px e regras de tom de voz.
- **Volume II — Loft Frontend Foundation — Guia Inicial de Desenvolvimento**: Stack React 19+, TypeScript, Vite, TanStack Router/Query, Zustand e proibição de dependências privadas `@loft/*`.
- **Volume III — Loft Component Catalog**: Especificações dos componentes Tier 1 (PageHeader, DataTable, Waffle Menu, FilterBar, StatusTag, etc.).
- **Volume IV — Loft Frontend Specification (FSD)**: Metodologia de especificação de rotas e obrigatoriedade dos 7 estados de interface (Loading, Success, Empty, No Results, Error com retry, Permission Denied, Not Found).

### Backend SDDs
- **Loft Backend Foundation (Volume I)**: Stack Python 3.13+, FastAPI, PostgreSQL assíncrono com SQLAlchemy 2.x, Alembic, Pydantic v2.
- **Loft Backend Engineering System (Volume II)**: Arquitetura em camadas limpas, separação Router -> Service -> Domain -> Repository -> Database.
- **Loft Backend Component Catalog (Volume III)**: Componentes de infraestrutura (AuthService, TenantAccessService, UnitOfWork, AuditService, CacheService).
- **Loft Backend API Specification (Volume IV - BAS)**: Padrões de endpoints REST, envelopes de resposta com metadados de paginação e formato uniforme de erro.
- **Loft Backend AI Specification (Volume V - AI-BAS)**: Arquitetura AI-BAS, gateway agnóstico e validação estrita de structured outputs.
- **Loft Backend Security Specification (Volume VI - BSS)**: Zero Trust, Default Deny, controle de acesso baseado em posse de recurso (BOLA/IDOR), criptografia Argon2id.

### Master Guide
- **CLAUDE.md**: Síntese operacional das Golden Rules de Frontend, Backend, Segurança e IA.
