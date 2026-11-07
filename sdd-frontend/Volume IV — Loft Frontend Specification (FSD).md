# Volume IV — Loft Frontend Specification (FSD)

> **Especificação oficial de frontend para aplicações padrão Loft**

**Versão:** 1.0  
**Atualizado:** Agosto de 2026  
**Objetivo:** definir páginas, fluxos, navegação, estados, comportamento e composição das aplicações frontend Loft.

---

# 1. Objetivo

Este documento define como especificar e implementar o frontend de uma aplicação utilizando o padrão Loft.

O FSD deve responder:

- Quais páginas existem?
- Como o usuário chega até elas?
- Quais componentes cada página utiliza?
- Quais dados são apresentados?
- Quais ações estão disponíveis?
- Quais estados existem?
- Como a aplicação reage às ações?
- Quais permissões são necessárias?
- Como funciona a responsividade?
- Como funciona a navegação?
- Como a aplicação trata loading, erro e estados vazios?

O FSD **não substitui**:

- Loft Frontend Foundation;
- Loft Design System;
- Loft Component Catalog.

Ele utiliza esses documentos como dependências.

---

# 2. Hierarquia dos Documentos

A especificação deve seguir:

```text
Volume I
Loft Frontend Foundation
        │
        ▼
Volume II
Loft Design System
        │
        ▼
Volume III
Loft Component Catalog
        │
        ▼
Volume IV
Loft Frontend Specification
        │
        ▼
Application
```

Cada volume possui uma responsabilidade diferente.

```text
Foundation
→ como construir

Design System
→ como parecer

Component Catalog
→ quais componentes reutilizar

Frontend Specification
→ o que construir
```

---

# 3. Regra Fundamental

A especificação de uma aplicação deve ser **implementation-ready**.

Uma IA, desenvolvedor ou ferramenta de geração de código deve conseguir utilizar este documento para implementar a aplicação sem precisar inventar:

- páginas;
- rotas;
- fluxos;
- estados;
- componentes;
- ações;
- comportamento de interface.

Quando uma decisão de produto não estiver definida, marcar explicitamente:

```text
[TBD]
```

Nunca inventar requisitos silenciosamente.

---

# 4. Princípios

Toda aplicação deve:

1. utilizar o Loft Design System;
2. reutilizar componentes do Loft Component Catalog;
3. utilizar Copan (`@loft/react-loft`) como base;
4. evitar componentes duplicados;
5. manter páginas orientadas a composição;
6. separar UI de regras de negócio;
7. possuir estados explícitos;
8. possuir navegação previsível;
9. possuir acessibilidade;
10. possuir comportamento responsivo.

---

# 5. Application Overview

Toda especificação deve começar com uma visão geral.

## Template

```yaml
application:
  name: "Nome da aplicação"
  description: "Descrição curta"
  version: "1.0.0"

  type:
    - internal
    - external
    - admin
    - portal
    - dashboard

  authentication:
    required: true

  authorization:
    enabled: true
```

---

# 6. User Personas

Definir os principais tipos de usuário.

Exemplo:

```text
Admin
Manager
Operator
Viewer
```

Para cada persona:

```yaml
persona:
  name: "Manager"
  description: "Responsável pela gestão operacional"
  permissions:
    - users.read
    - reports.read
    - reports.export
```

Não utilizar roles diretamente na UI quando uma permissão semântica puder ser utilizada.

Preferir:

```text
reports.export
```

em vez de:

```text
role === "admin"
```

---

# 7. Application Navigation

Definir a árvore completa de navegação.

Exemplo:

```text
Dashboard
├── Overview
├── Reports
│   ├── Monthly
│   └── Custom
├── Users
├── Settings
│   ├── General
│   └── Permissions
└── Audit
```

Cada item deve definir:

- label;
- rota;
- ícone;
- permissão;
- item ativo;
- filhos;
- comportamento mobile.

---

# 8. Route Specification

Todas as rotas devem ser documentadas.

## Template

| Route | Page | Permission | Authentication |
|---|---|---|---|
| `/` | Dashboard | `dashboard.read` | Yes |
| `/users` | Users | `users.read` | Yes |
| `/users/:id` | User Detail | `users.read` | Yes |
| `/settings` | Settings | `settings.read` | Yes |

---

# 9. Route Naming

Utilizar URLs semânticas.

Preferir:

```text
/users
/users/:id
/users/:id/edit
/reports
/reports/:id
```

Evitar:

```text
/user-page
/user-screen
/data1
/edit-user-component
```

---

# 10. Route Parameters

Documentar parâmetros.

```yaml
route:
  path: "/users/:userId"

  params:
    userId:
      type: string
      required: true
```

---

# 11. Query Parameters

Utilizar query parameters para filtros, paginação e ordenação.

Exemplo:

```text
/users?
  page=2&
  pageSize=20&
  status=active&
  search=will
```

Documentar:

```yaml
query:
  page:
    type: number
    default: 1

  pageSize:
    type: number
    default: 20

  search:
    type: string

  status:
    type: string
```

---

# 12. Page Specification

Cada página deve possuir uma especificação própria.

## Template obrigatório

```text
Page
Purpose
Route
Permission
Layout
Components
Data
Actions
States
Interactions
Navigation
Responsive Behavior
Accessibility
```

---

# 13. Page Example

## Users

### Purpose

Permitir gerenciamento de usuários.

### Route

```text
/users
```

### Permission

```text
users.read
```

### Layout

```text
PageContainer
 ├── PageHeader
 ├── DataTableToolbar
 └── DataTable
```

### Header

```text
Title:
Usuários

Description:
Gerencie os usuários da plataforma.

Primary Action:
Criar usuário
```

### Components

```text
PageHeader
DataTableToolbar
SearchField
FilterBar
DataTable
StatusTag
Pagination
EmptyState
```

---

# 14. Page Actions

Toda ação relevante deve ser especificada.

Exemplo:

```yaml
action:
  name: create-user
  label: "Criar usuário"
  type: primary
  permission: users.create
  destination: "/users/new"
```

---

# 15. Action Types

Utilizar:

```text
navigation
mutation
download
upload
filter
search
selection
confirmation
external-link
```

---

# 16. Primary Action

Cada página operacional deve possuir, quando aplicável, uma ação primária clara.

Exemplo:

```text
Usuários

[ Criar usuário ]
```

Não utilizar múltiplas ações primárias concorrentes.

---

# 17. Secondary Actions

Ações secundárias devem utilizar:

```text
default
secondary
ghost
link
dropdown
```

conforme o Design System.

---

# 18. Destructive Actions

Ações destrutivas devem:

- utilizar estado visual de perigo;
- solicitar confirmação quando necessário;
- informar consequência;
- impedir confirmação acidental.

Exemplo:

```text
Excluir usuário?

Esta ação não poderá ser desfeita.

[ Cancelar ] [ Excluir ]
```

---

# 19. Page States

Toda página deve documentar:

```text
Initial
Loading
Success
Empty
Error
Permission Denied
Not Found
```

quando aplicável.

---

# 20. Loading State

Definir exatamente o que aparece durante carregamento.

Exemplo:

```text
PageHeader → carregado
Table → Skeleton
Actions → disabled
```

Evitar simplesmente:

```text
Loading...
```

em páginas complexas.

---

# 21. Empty State

Definir:

```text
Title
Description
Action
```

Exemplo:

```text
Nenhum usuário cadastrado.

Comece adicionando o primeiro usuário.

[ Criar usuário ]
```

---

# 22. No Results State

Diferenciar:

```text
No Data
```

de:

```text
No Results
```

Exemplo:

```text
Nenhum resultado encontrado.

Tente alterar os filtros.
```

---

# 23. Error State

Definir:

```text
Title
Description
Retry Action
```

Exemplo:

```text
Não foi possível carregar os usuários.

Verifique sua conexão e tente novamente.

[ Tentar novamente ]
```

---

# 24. Permission State

Quando o usuário não possuir acesso:

```text
Acesso não permitido

Você não possui permissão para acessar este recurso.
```

Não renderizar ações que o usuário não pode executar.

---

# 25. Not Found State

Para recursos inexistentes:

```text
Registro não encontrado

O recurso solicitado não existe ou foi removido.
```

---

# 26. Forms Specification

Todo formulário deve documentar:

```text
Fields
Type
Required
Validation
Default
Placeholder
Helper
Error
Dependencies
Actions
```

---

# 27. Form Field Specification

## Template

| Field | Type | Required | Validation | Default |
|---|---|---:|---|---|
| Name | Input | Yes | min 3 chars | — |
| Email | Input | Yes | valid email | — |
| Status | Select | Yes | enum | Active |

---

# 28. Form Validation

A validação deve existir em duas camadas:

```text
Frontend
    ↓
UX feedback

Backend
    ↓
Security / integrity
```

A validação frontend nunca deve ser considerada mecanismo de segurança.

---

# 29. Form States

Todo formulário relevante deve possuir:

```text
Initial
Editing
Submitting
Success
Error
Disabled
```

---

# 30. Unsaved Changes

Formulários longos devem especificar comportamento para alterações não salvas.

Exemplo:

```text
Você possui alterações não salvas.

Deseja sair sem salvar?

[ Continuar editando ]
[ Sair sem salvar ]
```

---

# 31. Table Specification

Toda tabela deve documentar:

```text
Columns
Sorting
Filtering
Pagination
Selection
Actions
Loading
Empty
Error
Responsive behavior
```

---

# 32. Column Specification

## Template

| Column | Type | Sortable | Filterable | Width |
|---|---|---:|---:|---:|
| Name | Text | Yes | Yes | Auto |
| Status | StatusTag | Yes | Yes | 120 |
| Created | Date | Yes | No | 160 |
| Actions | Actions | No | No | 120 |

---

# 33. Row Actions

Preferir:

```text
View
Edit
Delete
```

Até três ações podem ser exibidas diretamente.

Acima disso:

```text
MoreActions
```

---

# 34. Bulk Actions

Quando seleção múltipla existir:

```text
No selection
```

não exibir barra de ações.

Com seleção:

```text
3 selected

[ Activate ]
[ Export ]
[ Delete ]
```

---

# 35. Filters Specification

Documentar:

```text
Filter
Type
Default
Options
URL persistence
Clear behavior
Apply behavior
```

---

# 36. Search Specification

Toda busca deve especificar:

```text
Search field
Minimum characters
Debounce
Search trigger
Result behavior
Clear behavior
```

Exemplo:

```yaml
search:
  minCharacters: 2
  debounce: 300
  trigger: input
  persistInUrl: true
```

---

# 37. Detail Page

Páginas de detalhe devem seguir:

```text
Breadcrumb
PageHeader
Status
Primary Actions
Information Sections
Activity / History
Related Data
```

---

# 38. Detail Layout

Exemplo:

```text
User
────────────────────────

João Silva
Administrador
[ Ativo ]

[ Editar ] [ Mais ]

────────────────────────

Informações
────────────────────────

Email
Departamento
Criado em

────────────────────────

Atividade
────────────────────────
```

---

# 39. Create / Edit Flow

Fluxos de criação e edição devem ser explicitamente definidos.

Exemplo:

```text
Users
 ↓
Create User
 ↓
Form
 ↓
Validation
 ↓
Submit
 ↓
Success
 ↓
User Detail
```

---

# 40. Modal vs Drawer vs Page

Utilizar:

### Modal

Para:

- confirmação;
- informação curta;
- ações rápidas.

### Drawer

Para:

- detalhes;
- formulários curtos;
- edição contextual.

### Page

Para:

- formulários longos;
- processos complexos;
- fluxos multi-etapas.

Não utilizar modal para fluxos extensos.

---

# 41. Multi-Step Flow

Quando existir um processo complexo:

```text
Step 1
 ↓
Step 2
 ↓
Step 3
 ↓
Review
 ↓
Success
```

Cada etapa deve especificar:

- campos;
- validações;
- ações;
- possibilidade de voltar;
- persistência temporária.

---

# 42. Navigation Behavior

Definir:

```text
Back
Forward
Breadcrumb
Redirect
Deep Link
Browser Refresh
```

O usuário deve conseguir atualizar a página sem perder o contexto quando tecnicamente possível.

---

# 43. Redirect Rules

Exemplo:

```yaml
redirect:
  afterCreate: "/users/:id"
  afterUpdate: "/users/:id"
  afterDelete: "/users"
```

---

# 44. Notifications

Definir quando utilizar:

```text
message
notification
Alert
inline feedback
```

Regra geral:

```text
Inline
→ erro relacionado a campo ou seção

Message
→ feedback rápido de ação

Notification
→ evento relevante que merece persistência temporária

Alert
→ contexto importante dentro da página
```

---

# 45. Responsive Specification

Toda página deve documentar:

```text
Desktop
Tablet
Mobile
```

---

# 46. Responsive Rules

Desktop:

```text
Sidebar
Multi-column layout
Full toolbar
```

Mobile:

```text
Collapsed navigation
Single column
Stacked actions
Filter Drawer
Horizontal scrolling tables when necessário
```

---

# 47. Table Mobile

Não tentar transformar toda tabela em cards automaticamente.

Escolher entre:

```text
horizontal scroll
column prioritization
responsive row
card layout
```

conforme o domínio.

---

# 48. Accessibility Specification

Toda página deve garantir:

- heading hierarchy;
- keyboard navigation;
- visible focus;
- accessible labels;
- semantic buttons;
- accessible forms;
- sufficient contrast;
- status messages acessíveis.

---

# 49. Keyboard Navigation

Quando aplicável:

```text
Tab
Shift + Tab
Enter
Escape
Arrow keys
```

devem possuir comportamento previsível.

---

# 50. URL State

Estado de interface que precisa ser compartilhável deve preferencialmente estar na URL.

Exemplos:

```text
filters
search
pagination
sorting
tabs
```

---

# 51. Local UI State

Utilizar estado local para:

```text
modal open
drawer open
temporary form state
hover
expanded row
```

---

# 52. Server State

Dados provenientes da API devem ser tratados como server state.

A página não deve duplicar desnecessariamente dados da API em estado local.

---

# 53. Loading Strategy

Utilizar:

```text
Skeleton
Spinner
Progress
```

conforme o contexto.

Preferir Skeleton para conteúdo estrutural.

---

# 54. Error Recovery

Sempre que possível, erros recuperáveis devem possuir ação:

```text
Retry
Refresh
Try again
```

---

# 55. Optimistic UI

Pode ser utilizada para ações de baixa criticidade.

Exemplo:

```text
Toggle status
Mark as read
Favorite
```

Não utilizar optimistic UI indiscriminadamente em operações críticas.

---

# 56. Data Refresh

Definir quando os dados devem ser atualizados:

```text
on page load
after mutation
manual refresh
interval
window focus
```

---

# 57. Permissions

Cada página e ação deve declarar a permissão necessária.

Exemplo:

```yaml
page:
  permission: users.read

actions:
  create:
    permission: users.create

  edit:
    permission: users.update

  delete:
    permission: users.delete
```

---

# 58. Permission Hierarchy

Não assumir que:

```text
users.read
```

implica automaticamente:

```text
users.update
```

As permissões devem ser explicitamente definidas.

---

# 59. Feature Flags

Quando aplicável:

```yaml
featureFlag:
  key: "new-user-flow"
  default: false
```

O frontend deve tratar feature flags como configuração.

---

# 60. Analytics

Quando analytics fizer parte do produto, documentar eventos.

Exemplo:

```yaml
analytics:
  event: "user_created"
  trigger: "successful_create"
  properties:
    source: "users_page"
```

Não registrar dados sensíveis desnecessários.

---

# 61. Security

O FSD deve especificar comportamento de frontend relacionado à segurança.

Nunca considerar:

```text
hidden button
```

como mecanismo de autorização.

A autorização real deve ocorrer no backend.

Frontend:

```text
UX control
```

Backend:

```text
Security control
```

---

# 62. Sensitive Data

Não exibir dados sensíveis sem necessidade.

Especificar quando informações precisam de:

```text
masking
truncation
redaction
confirmation
```

---

# 63. Performance

Páginas devem considerar:

- lazy loading;
- pagination;
- virtualização quando necessária;
- code splitting;
- imagens otimizadas;
- requests paralelos quando apropriado.

Não otimizar prematuramente.

---

# 64. Component Selection

Ao especificar uma página, utilizar primeiro o Loft Component Catalog.

Exemplo:

```text
PageHeader
DataTable
FilterBar
EmptyState
StatusTag
```

Não criar um componente novo se um componente existente atender ao requisito.

---

# 65. Component Composition

Página deve ser composta por componentes.

Exemplo:

```text
UsersPage
│
├── PageContainer
│
├── PageHeader
│
├── DataTableToolbar
│   ├── SearchField
│   └── FilterBar
│
└── DataTable
    ├── StatusTag
    └── DataTableActions
```

---

# 66. Component Gap

Se nenhum componente existente atender ao requisito:

```text
1. Identificar gap
2. Verificar possibilidade de composição
3. Avaliar criação de novo componente
4. Documentar decisão
```

Não criar componentes ad hoc sem justificativa.

---

# 67. Page Composition Standard

Uma página deve seguir aproximadamente:

```text
PageContainer
│
├── Breadcrumb
│
├── PageHeader
│
├── ContentSection
│
├── Filters / Toolbar
│
├── Main Content
│
└── Secondary Content
```

Não é obrigatório utilizar todos os elementos.

---

# 68. Page Density

Interfaces Loft devem priorizar:

```text
clareza
hierarquia
respiro
consistência
```

Evitar:

- excesso de cards;
- excesso de bordas;
- excesso de cores;
- excesso de modais;
- excesso de ações simultâneas.

---

# 69. UX Rules

Preferir:

```text
one primary action
clear hierarchy
predictable navigation
inline validation
contextual feedback
```

Evitar:

```text
hidden actions
ambiguous labels
multiple primary actions
unexpected navigation
destructive actions without confirmation
```

---

# 70. Copy Guidelines

Textos de interface devem ser:

- curtos;
- objetivos;
- acionáveis;
- consistentes.

Preferir:

```text
Criar usuário
Salvar alterações
Excluir usuário
Tentar novamente
```

Evitar:

```text
Clique aqui para proceder com a criação do novo usuário
```

---

# 71. Button Labels

Preferir:

```text
Criar
Salvar
Editar
Excluir
Cancelar
Continuar
Voltar
Exportar
Importar
```

Quando necessário, adicionar contexto:

```text
Criar usuário
Salvar alterações
Exportar relatório
```

---

# 72. Date and Number Formatting

O FSD deve especificar o formato esperado.

Para aplicações brasileiras:

```text
Date:
DD/MM/YYYY

DateTime:
DD/MM/YYYY HH:mm

Currency:
R$ 1.234,56

Number:
1.234,56
```

Quando o produto for internacional, utilizar locale configurável.

---

# 73. Localization

Aplicações devem evitar strings espalhadas diretamente no código.

Preferir:

```text
i18n
```

quando houver necessidade de múltiplos idiomas.

---

# 74. Internationalization

Quando aplicável, documentar:

```text
PT-BR
EN
ES
```

e comportamento de:

```text
dates
numbers
currency
pluralization
messages
```

---

# 75. Error Messages

Mensagens de erro devem:

- explicar o problema;
- evitar termos técnicos desnecessários;
- indicar próximo passo quando possível.

Preferir:

```text
Não foi possível salvar as alterações.

Tente novamente.
```

Evitar:

```text
HTTP 500
```

como única mensagem para o usuário.

---

# 76. API Error Mapping

Erros da API devem ser transformados em feedback de UX.

```text
API Error
   ↓
Error Mapping
   ↓
User Feedback
```

Nunca exibir stack traces ou detalhes internos.

---

# 77. Offline / Network Errors

Quando aplicável:

```text
Sem conexão

Não foi possível atualizar os dados.

[ Tentar novamente ]
```

---

# 78. Page Lifecycle

Fluxo padrão:

```text
Route
 ↓
Permission Check
 ↓
Page Initialization
 ↓
Loading
 ↓
Data Loaded
 ↓
Render
 ↓
User Interaction
 ↓
Mutation
 ↓
Feedback
 ↓
Refresh / Navigation
```

---

# 79. FSD Template

Cada página nova deve ser documentada usando este template:

```markdown
# [PAGE NAME]

## Purpose

[Descrição]

## Route

`/route`

## Permission

`resource.action`

## Navigation

[Como chegar]

## Layout

[Composição visual]

## Components

- Component
- Component
- Component

## Data

[Dados utilizados]

## Filters

[Filtros]

## Actions

[Ações]

## Forms

[Formulários]

## States

### Loading

[Comportamento]

### Empty

[Comportamento]

### No Results

[Comportamento]

### Error

[Comportamento]

### Permission Denied

[Comportamento]

## Navigation Behavior

[Comportamento]

## Responsive

[Desktop / Tablet / Mobile]

## Accessibility

[Requisitos]

## Analytics

[Eventos]

## Security

[Considerações]

## Open Questions

[TBD]
```

---

# 80. Application FSD Template

Para uma aplicação inteira:

```markdown
# APPLICATION FRONTEND SPECIFICATION

## 1. Overview

## 2. Personas

## 3. Authentication

## 4. Authorization

## 5. Navigation

## 6. Routes

## 7. Pages

## 8. Components

## 9. Forms

## 10. Tables

## 11. Filters

## 12. Search

## 13. States

## 14. Responsive Behavior

## 15. Accessibility

## 16. Localization

## 17. Analytics

## 18. Security

## 19. Performance

## 20. Open Questions
```

---

# 81. AI Implementation Contract

Quando uma IA receber uma especificação FSD, ela deve seguir:

### Antes de implementar

1. Ler o Loft Frontend Foundation.
2. Ler o Loft Design System.
3. Ler o Loft Component Catalog.
4. Ler o FSD da aplicação.
5. Identificar inconsistências.
6. Identificar componentes existentes.
7. Identificar gaps.

---

# 82. AI — Não Inventar

A IA não deve inventar:

- páginas;
- rotas;
- permissões;
- fluxos;
- campos;
- entidades;
- regras de negócio;
- componentes.

Quando houver informação ausente:

```text
[TBD]
```

ou solicitar decisão quando a informação for necessária para implementação segura.

---

# 83. AI — Component Reuse

Antes de criar um componente:

```text
Copan (@loft/react-loft)
        ↓
Loft Component Catalog
        ↓
Composition
        ↓
New Component
```

Somente criar novo componente quando necessário.

---

# 84. AI — Visual Rules

A implementação deve obedecer:

```text
Loft Design System
        ↓
Tokens
        ↓
Components
        ↓
Page
```

Não introduzir estilos arbitrários.

---

# 85. AI — Architecture Rules

Não colocar:

```text
API calls
business logic
authorization logic
complex state
```

diretamente em componentes visuais sem necessidade.

Preferir:

```text
Page
 ↓
Feature
 ↓
Hook / Service
 ↓
Component
```

---

# 86. AI — State Rules

Separar:

```text
Local UI State
Server State
URL State
Form State
Global Application State
```

Não utilizar uma única solução para todos os tipos de estado.

---

# 87. AI — API Rules

Componentes visuais não devem conhecer endpoints diretamente.

Evitar:

```tsx
<DataTable endpoint="/api/users" />
```

Preferir:

```tsx
const users = useUsers();

<DataTable
  data={users.data}
  loading={users.isLoading}
/>
```

---

# 88. AI — Responsive Rules

Não criar uma segunda aplicação para mobile.

Utilizar:

```text
responsive layout
breakpoints
conditional rendering
responsive components
```

---

# 89. AI — Accessibility Rules

Toda interface gerada deve verificar:

```text
keyboard navigation
focus
labels
ARIA when necessary
semantic HTML
contrast
screen reader compatibility
```

---

# 90. AI — Validation Checklist

Antes de finalizar uma implementação, validar:

### Architecture

- [ ] Foundation respeitado
- [ ] Design System respeitado
- [ ] Component Catalog reutilizado
- [ ] Sem dependências privadas do Copan/Loft

### Navigation

- [ ] Rotas corretas
- [ ] Breadcrumbs corretos
- [ ] Redirects definidos
- [ ] Deep links funcionando

### UI

- [ ] PageHeader
- [ ] Layout consistente
- [ ] Componentes corretos
- [ ] Tokens utilizados

### States

- [ ] Loading
- [ ] Empty
- [ ] No Results
- [ ] Error
- [ ] Permission Denied
- [ ] Not Found

### Forms

- [ ] Labels
- [ ] Validation
- [ ] Error states
- [ ] Loading state
- [ ] Success state

### Tables

- [ ] Sorting
- [ ] Filtering
- [ ] Pagination
- [ ] Empty state
- [ ] Loading state
- [ ] Actions

### Accessibility

- [ ] Keyboard
- [ ] Focus
- [ ] Labels
- [ ] ARIA quando necessário
- [ ] Contrast

### Responsive

- [ ] Desktop
- [ ] Tablet
- [ ] Mobile

### Security

- [ ] Permission checks
- [ ] No sensitive data leakage
- [ ] Backend remains authoritative

---

# 91. Definition of Ready

Uma página está pronta para implementação quando:

- [ ] Route definida
- [ ] Permission definida
- [ ] Layout definido
- [ ] Componentes identificados
- [ ] Dados identificados
- [ ] Ações definidas
- [ ] Estados definidos
- [ ] Responsividade definida
- [ ] Acessibilidade definida
- [ ] Open Questions resolvidas ou marcadas como TBD

---

# 92. Definition of Done

Uma página está concluída quando:

- [ ] Implementada
- [ ] Responsiva
- [ ] Acessível
- [ ] Estados implementados
- [ ] Permissões implementadas
- [ ] Validações implementadas
- [ ] Erros tratados
- [ ] Testes implementados
- [ ] Sem regressões visuais relevantes
- [ ] Sem componentes duplicados
- [ ] Sem valores de design hardcoded
- [ ] Documentação atualizada

---

# 93. Final Architecture

A implementação final deve seguir:

```text
┌─────────────────────────────────────────────┐
│                APPLICATION                  │
│                                             │
│ Pages / Features / Business Logic           │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│          FRONTEND SPECIFICATION             │
│                                             │
│ Routes / Flows / States / Behavior          │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│          LOFT COMPONENT CATALOG             │
│                                             │
│ Reusable Product Components                 │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│           LOFT DESIGN SYSTEM                │
│                                             │
│ Tokens / UX / Visual Language               │
└──────────────────────┬──────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│               ANT DESIGN                   │
│                                             │
│ Base UI Components                          │
└─────────────────────────────────────────────┘
```

---

# 94. Regra de Ouro do FSD

Toda especificação deve permitir responder claramente:

```text
O que existe?
        ↓
Onde existe?
        ↓
Quem pode acessar?
        ↓
Como o usuário chega?
        ↓
O que o usuário pode fazer?
        ↓
O que acontece depois?
        ↓
O que acontece se der errado?
        ↓
Como funciona no mobile?
```

Se alguma dessas respostas não estiver definida, a especificação está incompleta.

---

# 96. Padrões de Telas Ricas de Edição & Studio / Workshop

Para aplicações e módulos que requerem composição e edição avançada (ex: Blueprint Workshop, Editor de Catálogos, IAM Studio), a interface deve seguir a arquitetura de **Studio / Workshop Visual**:

### 96.1 Anatomia da Página de Edição
```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ PageHeader: Breadcrumb | Título | Status Tag | [Rascunho] [Validar] [Publicar]│
├──────────────────────────────────────────────────────────────────────────────┤
│ Card de Pré-Carregamento Inteligente:                                        │
│  [ Seletor de Template Canônico ] ou [ Seletor de Blueprint Existente ]      │
├──────────────────────────────────────────┬───────────────────────────────────┤
│ Área de Configuração Principal (Tabs)    │ Painel Lateral de Validação       │
│  ├── Geral (Nome*, Slug, Descrição*)     │  ├── Status de Conformidade       │
│  ├── Arquitetura & Stack                 │  ├── Golden Rules Loft            │
│  ├── Módulos de Negócio                  │  │   ├── Regras Críticas (Obrig.) │
│  ├── Componentes Copan                   │  │   └── Avisos de Governança     │
│  ├── Regras de Governança                │  └── Botão de Ação Bloqueado      │
│  └── Árvore de Composição Visual         │      (se houver erros críticos)   │
└──────────────────────────────────────────┴───────────────────────────────────┘
```

### 96.2 Regras de Interação no Workshop
1. **Campos Obrigatórios em Destaque**: Nome e Descrição com aviso visual imediato se não preenchidos.
2. **Duplo Seletor de Carga**: Carregar Template Canônico (carrega arquitetura, módulos recomendados, componentes e regras) vs Blueprint Existente (clonagem para refatoração).
3. **Validação Contínua**: Validação via API em tempo real (`POST /blueprints/validate-config`), impedindo a publicação acidental de configurações inválidas.
4. **Modais de Detalhe Centralizados**: Todo modal auxiliar (inspeção de SDD, histórico de versões `EntityVersionModal`) deve usar `centered={true}` e contenção interna `maxHeight: 'calc(85vh - 140px)'` com `overflowY: 'auto'`.

---

# 97. Catálogo Canônico de 20 Telas Enterprise para Blueprints

Este catálogo descreve as 20 telas corporativas canônicas prontas para composição em Blueprints de produção.

### 1. CRM 360 & Gestão de Clientes (`/crm/customers`)
- **Objetivo**: Visão consolidada 360° do cliente, score de crédito e histórico de relacionamento.
- **Layout**: `AppShell` + `PageContainer` + `FilterBar` + `DataTable` + `Drawer` de detalhes.
- **Componentes**: `cmp_fe_data_table`, `cmp_fe_filter_bar`, `cmp_fe_status_tag`, `cmp_be_audit_service`.
- **Estados**: Listagem filtrada, visualização de perfil com timeline de contratos, formulário de interação.

### 2. Chatbot Cognitivo com IA & RAG (`/ai/assistant`)
- **Objetivo**: Atendimento ao cliente e suporte operacional com busca semântica em base de conhecimento.
- **Layout**: `AppShell` + `PageHeader` + Split View (Histórico de Conversas + Stream de Mensagens + Card de Fontes RAG).
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_empty_state`, `cmp_be_audit_service`.
- **Estados**: Conversa ativa em streaming, transbordo para atendente humano, feedback de resposta (útil/não útil).

### 3. Portal de Homologação de Fornecedores (`/suppliers/onboarding`)
- **Objetivo**: Cadastro corporativo de fornecedores prediais, upload de certidões e validação de CNDs.
- **Layout**: `AppShell` + `PageContainer` + Wizard de Cadastro + `DataTable` de status de certidões.
- **Componentes**: `cmp_fe_data_table`, `cmp_fe_filter_bar`, `cmp_fe_status_tag`, `cmp_be_permission_service`.
- **Estados**: Pendente de validação, Aprovado, Reprovado com pendências, Certidão vencida.

### 4. Gestão de Compras & Procurement PO (`/procurement/orders`)
- **Objetivo**: Requisição de compras, cotações comparativas e esteira de aprovação multinível.
- **Layout**: `AppShell` + `PageContainer` + `DataTable` com agrupamento por centro de custo + Modal de aprovação.
- **Componentes**: `cmp_fe_data_table`, `cmp_fe_filter_bar`, `cmp_fe_status_tag`, `cmp_be_audit_service`.
- **Estados**: Rascunho, Em Cotação, Aguardando Aprovação da Diretoria, Ordem Emitida (PO).

### 5. Onboarding Digital & KYC Enterprise (`/kyc/verification`)
- **Objetivo**: Validação biométrica facial, extração OCR de documentos e motor antifraude.
- **Layout**: `AppShell` + `PageContainer` + KycScanner com captura de câmera/documentos + Score visual de risco.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_status_tag`, `cmp_be_token_service`.
- **Estados**: Documento em análise, Validação facial aprovada, Fraude detectada, Análise manual necessária.

### 6. Faturamento & Cobrança Recorrente SaaS (`/billing/subscriptions`)
- **Objetivo**: Gestão de planos corporativos, régua de faturamento automática e conciliação bancária.
- **Layout**: `AppShell` + `PageContainer` + Cards de Métricas MRR/ARR + `DataTable` de faturas.
- **Componentes**: `cmp_fe_data_table`, `cmp_fe_status_tag`, `cmp_be_audit_service`.
- **Estados**: Fatura Paga, Em Aberto, Atrasada (com régua de cobrança ativa), Cancelada.

### 7. Motor de Análise de Risco de Crédito & Fiança (`/credit/risk-engine`)
- **Objetivo**: Análise automatizada de comprometimento de renda e cálculo instantâneo de limite de fiança.
- **Layout**: `AppShell` + `PageHeader` + Painel de Score + Simulador de Garantia + Grade de Decisões.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_data_table`, `cmp_be_permission_service`.
- **Estados**: Aprovado com limite integral, Aprovado com coparticipação, Recusado por restrição restritiva.

### 8. Copilot de Análise Contratual Jurídica (`/legal/contracts-copilot`)
- **Objetivo**: Análise semântica de minutas de locação e compra, com identificação de cláusulas divergentes.
- **Layout**: `AppShell` + `PageContainer` + DiffViewer Lado a Lado + Painel de Alertas Jurídicos.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_empty_state`, `cmp_be_audit_service`.
- **Estados**: Documento carregado, Cláusulas de risco destacadas em vermelho/amarelo, Parecer exportável.

### 9. Gestão de Portfólio & Inventário de Imóveis (`/properties/inventory`)
- **Objetivo**: Catálogo central de imóveis disponíveis, galeria de fotos e controle de chaves.
- **Layout**: `AppShell` (com App Switcher Copan) + `PageHeader` + Filtros Avançados + Grid em Cards/Tabela.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_data_table`, `cmp_fe_filter_bar`, `cmp_fe_status_tag`.
- **Estados**: Disponível para locação, Reservado com proposta, Contrato ativo, Em reforma.

### 10. Vistorias & Manutenção Predial (`/inspections/maintenance`)
- **Objetivo**: Gestão de laudos de entrada/saída, anotação de avarias fotográficas e disparo de chamados.
- **Layout**: `AppShell` + `PageContainer` + Visualizador de Laudo Digital + Painel de Chamados de Reparo.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_data_table`, `cmp_fe_filter_bar`, `cmp_be_audit_service`.
- **Estados**: Vistoria agendada, Laudo assinado digitalmente, Chamado de reparo em execução, Concluído.

### 11. Gestão de Compliance, LGPD & Auditoria (`/compliance/audit-trail`)
- **Objetivo**: Rastreamento imutável de acessos a dados sensíveis, consentimentos e portal do DPO.
- **Layout**: `AppShell` + `PageContainer` + Filtro Temporal de Eventos + `DataTable` de Logs com payload JSON.
- **Componentes**: `cmp_fe_data_table`, `cmp_fe_status_tag`, `cmp_be_audit_service`.
- **Estados**: Visualização de trilha, Exportação de relatório criptografado, Gestão de revogação de dados.

### 12. Portal de Admissão & Onboarding de Colaboradores (`/hr/onboarding`)
- **Objetivo**: Recepção digital de novos contratados, envio de documentos e trilha inicial de integração.
- **Layout**: `AppShell` + `PageHeader` + Stepper de Onboarding + Painel de Tarefas do Novo Colaborador.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_data_table`, `cmp_fe_filter_bar`, `cmp_fe_status_tag`.
- **Estados**: Pré-admissão, Documentação validada pelo DP, Equipamento enviado, Boas-vindas concluída.

### 13. Gestão de Ativos Corporativos & ITSM (`/it/assets`)
- **Objetivo**: Controle patrimonial de equipamentos de TI, alocação para colaboradores e licenças de software.
- **Layout**: `AppShell` + `PageContainer` + `DataTable` de Hardware/Licenças + Modal de Empréstimo/Termo.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_data_table`, `cmp_fe_filter_bar`, `cmp_fe_status_tag`.
- **Estados**: Em estoque, Alocado para usuário, Em manutenção técnica, Baixado/Descartado.

### 14. Portal do Desenvolvedor & API Marketplace (`/dev/api-portal`)
- **Objetivo**: Documentação interativa OpenAPI v3, emissão de API Keys seguras e monitoramento de webhooks.
- **Layout**: `AppShell` + `PageHeader` + Swagger/Redoc Viewer + Painel de Credenciais e Quotas de Uso.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_data_table`, `cmp_be_audit_service`.
- **Estados**: Sandbox para testes, Produção com rate-limit ativo, Chave de API revogada.

### 15. Portal Loft Fiança Aluguel (`/partner/guarantee`)
- **Objetivo**: Portal oficial para corretores e imobiliárias contratarem garantias locatícias sem burocracia.
- **Layout**: `AppShell` com App Switcher (menu 9 pontos fixo à esquerda) + Hero Card Verde Loft + Tabela de Propostas.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_page_header`, `cmp_fe_data_table`, `cmp_fe_filter_bar`.
- **Estados**: Simulação realizada, Proposta enviada ao inquilino, Garantia emitida, Sinistro acionado.

### 16. Loft Engineering & Backoffice (`/admin/backoffice`)
- **Objetivo**: Governança de plataforma, administração de catálogos técnicos e gestão de usuários/IAM.
- **Layout**: `AppShell` + `PageContainer` + Sub-abas de Governança + Modais de Edição com Validação.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_page_container`, `cmp_fe_data_table`, `cmp_be_audit_service`.
- **Estados**: Operação normal, Bloqueio administrativo, Trilha de auditoria em tempo real.

### 17. Fintech & Checkout Imobiliário (`/fintech/checkout`)
- **Objetivo**: Checkout transparente para pagamento de aluguel e encargos com split instantâneo para proprietários.
- **Layout**: `AppShell` + Card de Checkout Seguro + Seleção de Método (Pix Copia-e-Cola, Boleto, Cartão).
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_page_header`, `cmp_fe_data_table`, `cmp_fe_filter_bar`.
- **Estados**: Aguardando pagamento, Pix liquidado em tempo real, Split processado, Comprovante emitido.

### 18. Analytics & Performance BI Dashboard (`/analytics/bi`)
- **Objetivo**: Dashboard analítico em tempo real com volumetria transacional, taxas de conversão e gráficos executivos.
- **Layout**: `AppShell` + `PageHeader` + Grid de KPIs Resumidos + Gráficos Temporais + Tabela Detalhada.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_page_header`, `cmp_fe_data_table`, `cmp_be_audit_service`.
- **Estados**: Dados atualizados ao vivo, Filtro de período customizado, Exportação de CSV/XLSX.

### 19. CRM de Renegociação & Mesa de Acordos (`/crm/renegotiation`)
- **Objetivo**: Mesa de cobrança amigável para renegociação de aluguéis em atraso com geração de termos de confissão de dívida.
- **Layout**: `AppShell` + `PageContainer` + Painel de Inadimplência + Simulador de Parcelamento + Acordo Digital.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_page_container`, `cmp_fe_data_table`, `cmp_fe_filter_bar`.
- **Estados**: Em atraso D+15, Proposta de acordo enviada, Acordo aceito e primeiro boleto liquidado.

### 20. AI Ops Gateway & Multi-Agent Hub (`/ai/gateway`)
- **Objetivo**: Orquestração central de agentes inteligentes, controle de quotas de tokens e auditoria de prompts.
- **Layout**: `AppShell` + `PageHeader` + Painel de Roteamento de Modelos + Logs de Execução dos Agentes.
- **Componentes**: `cmp_fe_app_shell`, `cmp_fe_page_header`, `cmp_be_audit_service`.
- **Estados**: Agente ativo, Execução em background, Prompt com alerta de guardrail, Cache atingido.

---

# 98. Instrução Final para IA

> **Você está implementando uma aplicação frontend dentro do padrão Loft.**
>
> Antes de escrever código, utilize como fonte de verdade:
>
> 1. Loft Frontend Foundation;
> 2. Loft Design System (incluindo diretrizes de Modais Centralizados e Contenção de Rolagem);
> 3. Loft Component Catalog;
> 4. esta Frontend Specification (incluindo os 20 Padrões Canônicos de Telas Enterprise para Blueprints).
>
> A especificação da aplicação possui prioridade para requisitos funcionais específicos do produto, enquanto Foundation, Design System e Component Catalog definem padrões técnicos, visuais e de reutilização.
>
> Não invente requisitos ausentes.
> Não invente páginas ou rotas.
> Reutilize Copan (`@loft/react-loft`) e `@loft/react-icons` como base — são pacotes privados reais, não Ant Design.
> Reutilize primeiro componentes do Loft Component Catalog.
> Utilize tokens do Loft Design System (`@loft/tokens-loft`).
> Para confirmações, use `Dialog` (já centralizado); para `Modal` com conteúdo longo, contenha o scroll no wrapper interno do conteúdo (`maxHeight` + `overflowY: 'auto'` em um `Flex` dentro do Modal — o Modal do Copan não expõe `centered`/`styles`).
> Implemente explicitamente loading, empty, no-results, error, permission-denied e not-found.
> Garanta responsividade para desktop, tablet e mobile.
>
> **O objetivo é produzir uma aplicação consistente, previsível, acessível, reutilizável, segura e perfeitamente alinhada ao padrão frontend Loft.**