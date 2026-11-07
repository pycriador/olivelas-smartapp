# App Builder Engine

> **Plataforma Modular de Engenharia de Software Orientada por IA**
> Camada intermediária entre agentes de IA (Cursor, Claude Code, Antigravity) e a base estruturada de conhecimento técnico, componentes reutilizáveis, regras e padrões arquiteturais da Loft.

---

## 🏛️ Visão Geral da Plataforma

O **App Builder Engine** centraliza e governa o desenvolvimento de software auxiliado por inteligência artificial através de três camadas essenciais:

1. **Knowledge Tier**: Especificações Técnicas (SDDs canônicos Volumes I a IV), Golden Rules com exemplos de código (Good vs Bad), Padrões Arquiteturais e Restrições.
2. **Building Blocks Tier**: Catálogo de Componentes Canônicos Copan (UI e Backend), Templates de Aplicação e Módulos de Domínio com interfaces padronizadas e relacionamentos bidirecionais 360°.
3. **Blueprint Tier & Workshop Studio**: Composição técnica determinística e interativa que resolve dependências e regras em tempo real, gerando Blueprints estruturados (JSON) e prompts canônicos para agentes geradores de código (Cursor, Claude Code, Antigravity).

---

## 🎨 Stack Tecnológica & Padrões Loft Frontend

Seguindo estritamente a documentação canônica de frontend da Loft (**FSD — Feature-Sliced Design**):
- **Core**: React 18 + TypeScript + Vite
- **Design System**: Loft Copan Design System integrado via Ant Design (`ConfigProvider`) com paleta corporativa (`#F56738`, `#121619`, `#F2F4F8`, `#E1E9EF`, `#20A483`) e tipografia **Inter**
- **State Management**: TanStack React Query (Server State) & Zustand (Client/UI State)
- **Componentes & Ícones**: Ant Design (`antd`), `@ant-design/icons`, Lucide React
- **Estilização**: Tailwind CSS utilitário + Ant Design tokens

---

## 🚀 Como Executar a Aplicação

### 1. Pré-requisitos
- **Python 3.10+** (recomendado Python 3.12 ou 3.13)
- **Node.js 18+** & **npm** (para build do frontend)

### 2. Build do Frontend React (Opcional caso queira compilar alterações)
```bash
cd app_builder_engine/frontend
npm install
npm run build
```
*O build de produção é automaticamente emitido para `app_builder_engine/app/static/dist/` e servido de forma integrada pelo FastAPI.*

### 3. Iniciar o Servidor Integrado
No diretório `app_builder_engine`:

```bash
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 🌐 Acesso à Interface e Documentação

| Interface | URL | Descrição |
| :--- | :--- | :--- |
| **Engineering Workspace (React Copan)** | [http://localhost:8000/](http://localhost:8000/) | Aplicação React completa com Copan Design System, Workshop Studio e Inspector 360° |
| **Swagger UI (OpenAPI)** | [http://localhost:8000/docs](http://localhost:8000/docs) | Documentação interativa de todas as rotas REST e AI Gateway |
| **ReDoc** | [http://localhost:8000/redoc](http://localhost:8000/redoc) | Documentação técnica dos contratos de API |
| **Health Check** | [http://localhost:8000/health](http://localhost:8000/health) | Endpoint de verificação de integridade |

---

## 🌟 Funcionalidades na Interface Web

- **Application Shell Loft Portal**: Header oficial com avatar Copan, busca global `⌘K`, Breadcrumbs padronizados e menu lateral fixo e retrátil (`w-64` ↔ `w-[72px]`) com rolagem independente por camadas e persistência de estado.
- **Engine Status em Tempo Real (`/api/v1/dashboard/engine-status`)**: Indicador fixo no rodapé da barra lateral com polling automático da saúde operacional do motor, banco de dados SQLite, versão da engine e contadores de especificações, regras e componentes.
- **Paginação Padronizada via URL (`?page=X&page_size=Y`) & Server-Side**: Todas as páginas de catálogo, conhecimento, projetos, blueprints, auditoria, agentes de IA e IAM sincronizam `page` e `page_size` na URL (`useUrlPagination`) e carregam sob demanda apenas os registros da página solicitada no backend (com `/platform/library-updates` realizando varredura sob demanda e paginação via URL).
- **360° Knowledge Graph Drawer**: Painel lateral detalhado para qualquer ativo de engenharia respondendo: *O que é?*, *Para que serve?*, *Do que depende?*, *Onde é utilizado?*, *Quais regras possui?*, *Qual documentação está relacionada?*, *Qual versão está ativa?*.
- **Interactive Blueprint Workshop Studio**: Seletor de arquitetura, checklist de módulos de negócio, componentes Copan e resolução visual em tempo real de dependências e Golden Rules mandatórias.
- **Command Palette (`⌘K` ou `Ctrl+K`)**: Busca global instantânea com debounce e navegação por teclado para qualquer entidade ou visualizador 360°.
- **Dashboard com Métricas Vivas**: KPIs em tempo real, atalhos para os catálogos e feed de auditoria.
- **Catálogo de Componentes Copan**: Filtros por categoria, visualização de props, ciclo de vida (`Publicar` / `Descontinuar`) e formulário de cadastro.
- **Catálogo de Módulos & Templates**: Módulos de domínio encapsulados e templates de scaffold.
- **Golden Rules com Good vs Bad Code**: Visualizador de regras mandatórias com blocos de código comparativo entre padrão Copan e anti-patterns.
- **Especificações Técnicas (SDDs)**: Leitor completo dos 4 volumes da Loft (Foundation, Design System, Component Catalog e FSD).
- **Atualizações de Bibliotecas (`/platform/library-updates`)**: Scanner sob demanda de pacotes npm, pip e imagens Docker com bootstrap automático de sessão JWT (`/api/v1/rbac/session-token`) e filtro paginado na URL.
- **Simulador do Agente de IA**: Teste em tempo real do raciocínio determinístico para agentes externos.
- **Trilha de Governança (Audit Logs)**: Histórico imutável de todas as ações na plataforma.

---

## 🤖 Endpoints para Agentes de IA (Cursor, Claude Code, Antigravity)

Os agentes de IA podem consultar diretamente a API para planejar e construir código:

```bash
# 1. Compor um Blueprint determinístico a partir de requisitos
curl -X POST http://localhost:8000/api/v1/ai/compose-blueprint \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Portal de crédito imobiliário com autenticação JWT e tabela de propostas"}'

# 2. Consultar relações 360° de qualquer entidade
curl http://localhost:8000/api/v1/relations/component/comp-page-header

# 3. Consultar catálogo de componentes Copan
curl http://localhost:8000/api/v1/components

# 4. Consultar Golden Rules de arquitetura e UI
curl http://localhost:8000/api/v1/rules

# 5. Consultar contratos da API para agentes
curl http://localhost:8000/api/v1/ai/agent-contracts
```

---

## 🧪 Suíte de Testes Automatizados

A plataforma conta com uma suíte de 30 testes automatizados cobrindo todas as camadas:

```bash
cd app_builder_engine
python3 -m pytest tests -v
```

---

## 📁 Estrutura do Projeto

```
app_builder_engine/
├── docs/                                  # Documentação de Arquitetura e ADRs 0001 a 0006
├── app/
│   ├── main.py                            # Ponto de entrada FastAPI + montagem de assets React
│   ├── core/                              # Configurações, logs estruturados e erros
│   ├── domain/                            # Modelos de domínio (Component, Module, Rule, Blueprint, etc.)
│   ├── storage/                           # Banco de dados e seeds da Loft
│   ├── services/                          # Serviços (360 Relations, Catalog, Blueprints, AI, Audit)
│   ├── api/v1/                            # Rotas REST e AI Gateway
│   └── static/dist/                       # Bundle compilado de produção React + Copan
├── frontend/                              # Aplicação React + TypeScript + Ant Design + Vite
│   ├── src/
│   │   ├── theme/                         # Loft Copan Design System tokens & antd-theme
│   │   ├── types/                         # TypeScript Domain & API types
│   │   ├── services/                      # API Client & Services
│   │   ├── stores/                        # Zustand UI store & active contexts
│   │   ├── components/layout/             # Header, Sidebar, AppLayout (Loft Portal Shell)
│   │   ├── components/ui/                 # PageHeader, StatusBadge, FeedbackStates, CommandPalette
│   │   └── features/                      # FSD Feature Pages & 360° Inspector Drawer
│   └── package.json
└── tests/                                 # 30 testes automatizados (pytest)
```
