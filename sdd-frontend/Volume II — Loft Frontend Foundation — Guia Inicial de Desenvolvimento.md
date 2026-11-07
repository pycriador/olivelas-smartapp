# Loft Frontend Foundation

> **Guia inicial para criação de aplicações Frontend padrão Loft**

**Versão:** 2.0  
**Atualizado:** Outubro de 2026  
**Stack:** React + TypeScript + Vite  
**UI:** Copan (`@loft/react-loft` + `@loft/tokens-loft` + `@loft/react-icons`)  
**Objetivo:** estabelecer uma fundação frontend moderna, consistente, escalável e compatível com ferramentas de desenvolvimento assistido por IA.

---

# 1. Objetivo

Este documento define o padrão técnico inicial para criação de aplicações frontend utilizadas pela Loft.

O objetivo é garantir que novos projetos tenham:

- arquitetura consistente;
- stack moderna e suportada;
- baixo acoplamento entre domínio e infraestrutura;
- componentes reutilizáveis;
- gerenciamento de estado previsível;
- integração padronizada com APIs;
- validação consistente;
- acessibilidade;
- testes automatizados;
- observabilidade;
- compatibilidade com ferramentas como Cursor, VS Code, Lovable e outros agentes de desenvolvimento;
- uso consistente do Copan (`@loft/react-loft`) como biblioteca de componentes real.

Este documento deve ser utilizado como **baseline técnico** para novos projetos.

---

# 2. Princípios

Todo projeto deve seguir estes princípios:

### 2.1 Simplicidade antes de abstração

Não criar abstrações antes de existir necessidade real.

Preferir:

```text
componente simples
    ↓
composição
    ↓
abstração reutilizável
```

Evitar:

```text
framework interno
    ↓
factory
    ↓
wrapper
    ↓
wrapper do wrapper
    ↓
componente
```

---

### 2.2 TypeScript First

Todo código de aplicação deve ser escrito em TypeScript.

Evitar:

- `any`;
- casts desnecessários;
- tipos duplicados;
- interfaces genéricas sem necessidade.

Preferir tipos derivados de schemas quando possível.

---

### 2.3 Server State ≠ Client State

Diferenciar claramente:

**Server State**

Dados provenientes de APIs:

- usuários;
- imóveis;
- pedidos;
- clientes;
- relatórios;
- configurações.

Usar:

**TanStack Query**

**Client State**

Estado exclusivamente da interface:

- sidebar aberta;
- filtros temporários;
- preferências;
- estado de modais;
- wizard atual.

Usar:

**React State** ou **Zustand**, quando realmente necessário.

---

### 2.4 Design System First

Componentes visuais devem utilizar:

**Copan (`@loft/react-loft`)**

O visual deve seguir os tokens e convenções definidos no:

**Loft Design System**

Não criar uma segunda biblioteca visual paralela sem justificativa arquitetural.

---

# 3. Stack Oficial

## 3.1 Runtime

- Node.js LTS
- npm / pnpm
- TypeScript

Recomendação:

```text
Node.js LTS
```

O projeto deve definir a versão utilizada através de:

```text
.nvmrc
```

ou mecanismo equivalente.

---

# 4. Framework Base

## React

Usar:

```text
React 19+
```

React é responsável pela camada de apresentação e composição da aplicação.

---

# 5. Build Tool

## Vite

Usar:

```text
Vite
```

Responsabilidades:

- desenvolvimento local;
- bundling;
- build de produção;
- variáveis de ambiente;
- integração com plugins.

Evitar introduzir frameworks full-stack quando o projeto é essencialmente uma aplicação frontend.

---

# 6. Linguagem

## TypeScript

Configuração recomendada:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

O projeto deve operar em modo:

```text
strict: true
```

---

# 7. UI Framework

## Copan

Biblioteca oficial para componentes de interface (privada — requer `NPM_TOKEN` com acesso ao escopo `@loft` no `.npmrc`):

```bash
npm install @loft/react-loft @loft/tokens-loft @loft/react-icons
```

Utilizar Copan (`@loft/react-loft`) para: `Button`, `TextField`/`PatternField`/`NumericField`/`TextArea`, `Select`, `Checkbox`/`Radio`/`Switch`, `Modal`, `Dialog`, `Drawer`, `Table` (+`TableHead`/`Body`/`Row`/`Header`/`Data`), `Tabs`, `FeedbackBanner`, `SnackBar`, `DropdownMenu`, `Tooltip`, `Popover`, `Accordion`/`Collapse`, `Breadcrumbs`, `Card`, `Avatar`, `Tag`, `Typography`, `CircularLoader`, `FileUploader`, `Flex`/`Grid`/`GridItem`/`Container`/`UISpacer`.

Sem equivalente dedicado no Copan — compor a partir dos componentes acima (ver Volume III, Component Catalog): paginação, `DatePicker`, `Badge`, `Empty`/`Result` states, `Skeleton`/`Spin`.

---

# 8. Design System

Não há `ConfigProvider`/tema global — cada componente já aplica os tokens corretos via suas próprias props semânticas (`variant`, `state`, `modifier`). Tokens brutos (quando um componente realmente precisa de um valor explícito) vêm de `@loft/tokens-loft`:

```tsx
import { color } from '@loft/tokens-loft';
import { TrashIcon } from '@loft/react-icons';

<TrashIcon size="md" color={color.icon.primary} />
```

O projeto deve possuir uma camada própria apenas para re-exportar os tokens (não para configurá-los):

```text
src/
└── theme/
    ├── tokens.ts   (re-exporta color/spacing/typography/border de @loft/tokens-loft)
    └── index.ts
```

Não espalhar valores de token (hex, px) diretamente pelos componentes — sempre o objeto `@loft/tokens-loft`.

---

# 9. Ícones

Utilizar:

```bash
npm install @loft/react-icons
```

Usar exclusivamente os ícones nomeados disponíveis no pacote (não há componente genérico `Icon`).

Exemplo:

```tsx
import { SearchIcon } from '@loft/react-icons';
import { color } from '@loft/tokens-loft';

<SearchIcon size="md" color={color.icon.primary} />
```

Regras:

- `size`: `sm`/`md`/`lg`/`xl` — `md` padrão, `lg`/`xl` para ações importantes;
- `color` sempre de `color.icon.*` (nunca hex/`currentColor` literal);
- ícones clicáveis devem possuir acessibilidade adequada (`ActionButton` com `aria-label`);
- não utilizar emojis como ícones de interface, nem ícones de outras bibliotecas (`@ant-design/icons`, `lucide-react`).

---

# 10. Roteamento

## TanStack Router

Usar:

```bash
npm install @tanstack/react-router
```

O roteamento deve ser baseado em rotas tipadas.

Estrutura sugerida:

```text
src/
└── routes/
    ├── __root.tsx
    ├── index.tsx
    ├── login.tsx
    ├── dashboard.tsx
    └── users/
        ├── index.tsx
        ├── $id.tsx
        └── new.tsx
```

Benefícios:

- type-safe routing;
- parâmetros tipados;
- search params tipados;
- loaders;
- integração com autenticação;
- navegação previsível.

---

# 11. Server State

## TanStack Query

Usar:

```bash
npm install @tanstack/react-query
```

Responsável por:

- fetching;
- caching;
- mutations;
- retry;
- loading state;
- error state;
- invalidação;
- sincronização de dados.

Exemplo conceitual:

```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: getUsers,
});
```

Não utilizar Zustand para armazenar dados provenientes da API sem necessidade.

---

# 12. Client State

## Zustand

Usar somente quando React State não for suficiente.

```bash
npm install zustand
```

Casos adequados:

- estado global de UI;
- preferências do usuário;
- filtros persistentes;
- estado de navegação;
- configuração temporária de aplicação.

Evitar utilizar Zustand como substituto do TanStack Query.

---

# 13. Formulários

## React Hook Form

Usar:

```bash
npm install react-hook-form
```

Responsável por:

- gerenciamento de formulários;
- performance;
- dirty state;
- submit;
- validação integrada.

---

# 14. Validação

## Zod

Usar:

```bash
npm install zod
```

Zod deve ser utilizado para validar:

- formulários;
- parâmetros;
- respostas externas quando necessário;
- configurações;
- payloads.

Exemplo:

```ts
const userSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});
```

Sempre que possível, derivar os tipos do schema:

```ts
type User = z.infer<typeof userSchema>;
```

---

# 15. Integração com APIs

A aplicação deve possuir uma camada explícita de comunicação com backend.

Estrutura:

```text
src/
└── services/
    ├── api-client.ts
    ├── users.service.ts
    ├── auth.service.ts
    └── reports.service.ts
```

Não realizar chamadas HTTP diretamente dentro dos componentes.

Evitar:

```tsx
useEffect(() => {
  fetch('/api/users');
}, []);
```

Preferir:

```text
Component
   ↓
TanStack Query
   ↓
Service
   ↓
API Client
   ↓
Backend
```

---

# 16. HTTP Client

A escolha do client HTTP deve ser simples.

Opções aceitáveis:

```text
fetch
```

ou:

```text
axios
```

Para projetos novos, `fetch` pode ser suficiente.

Adicionar Axios somente quando existirem necessidades como:

- interceptors complexos;
- transformação padronizada;
- múltiplas instâncias;
- comportamento específico de retry;
- compatibilidade com infraestrutura existente.

Não adicionar Axios automaticamente em todos os projetos.

---

# 17. Autenticação

A autenticação deve ficar isolada da UI.

Estrutura:

```text
src/
└── auth/
    ├── auth-provider.tsx
    ├── auth-client.ts
    ├── permissions.ts
    └── guards.ts
```

Responsabilidades:

- login;
- logout;
- sessão;
- refresh;
- usuário atual;
- permissões;
- proteção de rotas.

A aplicação não deve espalhar lógica de autenticação pelos componentes.

---

# 18. Autorização

Autenticação responde:

> Quem é o usuário?

Autorização responde:

> O que esse usuário pode fazer?

A autorização deve ser baseada em permissões.

Exemplo:

```ts
can('users.read')
can('users.create')
can('users.update')
can('users.delete')
```

Evitar regras espalhadas:

```tsx
if (user.role === 'admin') {
  ...
}
```

Preferir:

```tsx
if (can('users.delete')) {
  ...
}
```

Isso permite evolução futura para RBAC, ABAC ou políticas mais complexas.

---

# 19. Estrutura de Projeto

Estrutura recomendada:

```text
src/
├── app/
│   ├── providers/
│   ├── config/
│   └── bootstrap.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── feedback/
│
├── features/
│   ├── auth/
│   ├── users/
│   ├── dashboard/
│   └── reports/
│
├── routes/
│
├── services/
│   ├── api-client.ts
│   └── *.service.ts
│
├── hooks/
│
├── stores/
│
├── schemas/
│
├── types/
│
├── utils/
│
├── theme/
│
├── assets/
│
└── main.tsx
```

---

# 20. Feature-Based Architecture

Funcionalidades de negócio devem preferencialmente ser organizadas por domínio.

Exemplo:

```text
features/
└── users/
    ├── components/
    ├── hooks/
    ├── services/
    ├── schemas/
    ├── types/
    └── index.ts
```

Isso é preferível a uma estrutura exclusivamente técnica:

```text
components/
hooks/
services/
types/
```

para aplicações grandes.

---

# 21. Componentes

Separar componentes em três níveis.

## UI Components

Componentes genéricos:

```text
Button
Input
Modal
PageHeader
EmptyState
LoadingState
```

## Domain Components

Componentes específicos do negócio:

```text
PropertyCard
LeadTimeline
UserPermissionMatrix
PayrollComparison
```

## Page Components

Composição de uma tela completa:

```text
UsersPage
DashboardPage
ReportsPage
```

---

# 22. Componentes de Estado

Toda tela relevante deve considerar pelo menos:

```text
Loading
Success
Empty
Error
Disabled
Permission Denied
```

Exemplo:

```text
LoadingState
EmptyState
ErrorState
PermissionState
```

Esses estados devem ser componentes reutilizáveis quando houver repetição.

---

# 23. Loading

Preferir:

```text
Skeleton
```

para carregamentos estruturais.

Usar:

```text
Spin
```

para operações localizadas.

Evitar bloquear a tela inteira sem necessidade.

---

# 24. Tratamento de Erros

Erros devem possuir:

- mensagem compreensível;
- contexto;
- ação possível quando aplicável;
- logging técnico.

Exemplo:

```text
Não foi possível carregar os usuários.

Tente novamente.

[ Tentar novamente ]
```

Não exibir stack traces ou detalhes internos ao usuário.

---

# 25. Feedback

Utilizar:

```text
message
notification
Alert
Result
```

conforme o contexto.

### Message

Feedback curto após uma ação.

### Notification

Eventos importantes que precisam permanecer visíveis.

### Alert

Informação contextual dentro da página.

### Result

Estados completos de sucesso, erro ou ausência.

---

# 26. Layout

Toda aplicação deve possuir um layout consistente.

Estrutura:

```text
App
 ├── AuthProvider
 ├── QueryClientProvider
 ├── ConfigProvider
 └── Router
      └── AppLayout
           ├── Header
           ├── Sidebar
           └── Content
```

---

# 27. Responsividade

A aplicação deve funcionar em:

- desktop;
- notebook;
- tablet;
- mobile quando aplicável.

Não assumir que toda aplicação será exclusivamente desktop.

Breakpoints devem usar os tokens reais do Copan — nunca media queries arbitrárias: `xs` (0px), `sm` (576px), `md` (768px), `lg` (960px), `xl` (1200px), `xxl` (1440px). Em componentes: `GridItem xs={12} md={6}`, ou sufixo `-up`/`-down` (`fullWidth="md-down"`).

---

# 28. Acessibilidade

Obrigatório:

- navegação por teclado;
- foco visível;
- labels;
- contraste AA;
- `aria-label` quando necessário;
- mensagens de erro associadas aos campos;
- semântica HTML adequada;
- não depender exclusivamente de cor para comunicar estados.

---

# 29. ESLint

Utilizar ESLint para:

- bugs comuns;
- regras TypeScript;
- React;
- hooks;
- imports;
- padrões de código.

O CI deve falhar quando existirem erros críticos de lint.

---

# 30. Prettier

Utilizar Prettier para formatação automática.

Objetivo:

```text
formatação não deve ser discutida durante Code Review
```

---

# 31. Testes Unitários

## Vitest

Usar:

```bash
npm install -D vitest
```

Testar principalmente:

- regras de negócio;
- funções utilitárias;
- schemas;
- hooks;
- transformações;
- componentes críticos.

---

# 32. Testes de Interface

## React Testing Library

Usar:

```bash
npm install -D @testing-library/react @testing-library/jest-dom
```

Testar comportamento do usuário, não detalhes internos de implementação.

Preferir:

```text
usuário clica
usuário preenche
usuário visualiza
usuário submete
```

em vez de testar detalhes internos do componente.

---

# 33. Testes End-to-End

## Playwright

Usar:

```bash
npm install -D playwright
```

Testar fluxos críticos:

```text
Login
    ↓
Dashboard
    ↓
Criar registro
    ↓
Editar registro
    ↓
Salvar
    ↓
Validar resultado
```

---

# 34. Qualidade mínima de testes

Projetos devem possuir pelo menos:

### Unit

Regras críticas.

### Component

Componentes complexos.

### E2E

Principais jornadas do usuário.

Não estabelecer inicialmente uma meta arbitrária de cobertura como "90%".

Cobertura deve ser acompanhada como indicador, não como objetivo isolado.

---

# 35. Variáveis de Ambiente

Utilizar:

```text
.env
.env.local
.env.example
```

Nunca armazenar secrets no frontend.

Variáveis públicas devem possuir prefixo compatível com Vite:

```text
VITE_API_URL
```

Importante:

> Tudo que estiver disponível no bundle do frontend deve ser considerado público.

---

# 36. Segurança

Nunca colocar no frontend:

- client secrets;
- API secrets;
- tokens administrativos;
- credenciais privadas;
- chaves privadas.

O frontend não é uma camada confiável de autorização.

Toda autorização real deve ser validada pelo backend.

---

# 37. CSP

Quando aplicável, utilizar Content Security Policy.

Evitar:

```text
unsafe-inline
unsafe-eval
```

sem justificativa.

A CSP deve ser definida considerando:

- API;
- analytics;
- autenticação;
- CDN;
- imagens;
- fontes;
- ferramentas externas.

---

# 38. Observabilidade

Aplicações de produção devem possuir mecanismo de observabilidade.

Monitorar:

- erros JavaScript;
- falhas de API;
- performance;
- Web Vitals;
- navegação;
- eventos críticos.

A ferramenta específica pode variar conforme infraestrutura Loft.

A aplicação deve possuir uma camada de abstração para evitar acoplamento excessivo ao vendor.

---

# 39. Performance

Principais práticas:

- lazy loading;
- code splitting;
- virtualização de tabelas grandes;
- cache com TanStack Query;
- otimização de imagens;
- evitar renders desnecessários;
- memoização apenas quando houver benefício comprovado.

Não utilizar `useMemo` e `useCallback` indiscriminadamente.

---

# 40. Tabelas

Tabelas corporativas devem considerar:

- paginação;
- ordenação;
- filtros;
- loading;
- empty state;
- error state;
- seleção;
- ações;
- responsividade.

Para grandes volumes:

```text
Server-side pagination
Server-side filtering
Server-side sorting
```

Não carregar milhares de registros apenas para filtrá-los no browser.

---

# 41. Formulários

Formulários devem:

- possuir labels;
- validar entrada;
- indicar campos obrigatórios;
- apresentar mensagens de erro;
- preservar dados quando possível;
- impedir submit duplicado;
- apresentar estado de loading;
- confirmar operações destrutivas.

---

# 42. Datas

Nunca tratar datas como strings arbitrárias espalhadas pela aplicação.

Centralizar:

```text
date formatting
timezone
locale
parsing
```

A aplicação deve definir explicitamente:

```text
timezone
locale
date format
```

Evitar bugs de timezone derivados de `new Date(string)` sem contrato claro.

---

# 43. Internacionalização

Projetos que necessitem suportar múltiplos idiomas devem possuir camada explícita de i18n.

Idioma padrão:

```text
pt-BR
```

Idiomas adicionais podem incluir:

```text
en-US
es
```

Não espalhar strings diretamente em componentes quando internacionalização for requisito.

---

# 44. Dependências

Adicionar uma biblioteca somente quando:

1. existir necessidade real;
2. a funcionalidade não puder ser resolvida adequadamente com a stack existente;
3. houver manutenção ativa;
4. houver compatibilidade com React e TypeScript;
5. o custo de manutenção for justificável.

Evitar:

```text
library for everything
```

A stack deve permanecer pequena e compreensível.

---

# 45. Stack Inicial Recomendada

## Runtime

```text
Node.js LTS
```

## Core

```text
React 19+
TypeScript
Vite
```

## UI

```text
@loft/react-loft
@loft/tokens-loft
@loft/react-icons
```

## Routing

```text
@tanstack/react-router
```

## Server State

```text
@tanstack/react-query
```

## Client State

```text
zustand
```

## Forms

```text
react-hook-form
```

## Validation

```text
zod
```

## Testing

```text
vitest
@testing-library/react
@testing-library/jest-dom
playwright
```

## Code Quality

```text
eslint
prettier
typescript
```

---

# 46. Instalação Inicial

Exemplo:

```bash
npm create vite@latest loft-frontend -- --template react-ts

cd loft-frontend

npm install \
  @loft/react-loft \
  @loft/tokens-loft \
  @loft/react-icons \
  @tanstack/react-router \
  @tanstack/react-query \
  zustand \
  react-hook-form \
  zod
```

Os pacotes `@loft/*` são privados — configure `NPM_TOKEN` no `.npmrc` do projeto antes de instalar (`//registry.npmjs.org/:_authToken=${NPM_TOKEN}`).

Dependências de desenvolvimento:

```bash
npm install -D \
  vitest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  playwright \
  eslint \
  prettier
```

---

# 47. Arquitetura de Dependências

A arquitetura deve seguir aproximadamente:

```text
                    ┌────────────────────┐
                    │       Routes       │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │       Pages        │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │     Features       │
                    └──────┬───────┬─────┘
                           │       │
                 ┌─────────▼─┐   ┌─▼────────────┐
                 │ Components │   │    Hooks     │
                 └───────────┘   └──────┬───────┘
                                         │
                                  ┌──────▼───────┐
                                  │ TanStack     │
                                  │ Query        │
                                  └──────┬───────┘
                                         │
                                  ┌──────▼───────┐
                                  │   Services   │
                                  └──────┬───────┘
                                         │
                                  ┌──────▼───────┐
                                  │   API        │
                                  └──────────────┘
```

---

# 48. O que NÃO utilizar como padrão

Não utilizar automaticamente:

```text
Next.js
Prisma
NextAuth
Redux
styled-components
Material UI
Chakra UI
Bootstrap
jQuery
```

Isso não significa que sejam tecnologias proibidas.

Significa que não fazem parte do **baseline frontend Loft**.

Uma exceção deve possuir justificativa técnica.

---

# 49. Compatibilidade com Lovable

O projeto deve ser compatível com ferramentas de geração assistida por IA.

Entretanto:

> Lovable não deve ser considerado parte da arquitetura da aplicação.

A aplicação deve ser independente da ferramenta utilizada para gerá-la.

O código deve permanecer executável em ambiente Node/Vite padrão.

Evitar dependências proprietárias ou abstrações específicas da ferramenta.

---

# 50. Compatibilidade com Copan

O Copan é a biblioteca de componentes e tokens real da Loft — o projeto depende dele diretamente, via `@loft/react-loft` + `@loft/tokens-loft`.

Utilizar:

```text
Copan (@loft/react-loft + @loft/tokens-loft)
+
Loft Frontend Foundation
```

Arquitetura:

```text
Copan (@loft/react-loft + @loft/tokens-loft)
   │
   │ biblioteca de componentes real
   ▼
Loft Design System
   │
   │ convenções de uso
   ▼
Aplicação
```

---

# 51. Separação entre Foundation e Design System

Este documento define:

```text
COMO construir
```

O Loft Design System define:

```text
COMO deve parecer
```

Portanto:

### Frontend Foundation

- React;
- TypeScript;
- Vite;
- Router;
- Query;
- State;
- Forms;
- Validation;
- Testing;
- Security;
- Architecture.

### Loft Design System

- cores;
- tipografia;
- espaçamento;
- radius;
- componentes;
- ícones;
- layouts;
- estados visuais;
- acessibilidade visual.

Os dois documentos devem ser utilizados em conjunto.

---

# 52. Checklist de Bootstrap

Antes de iniciar o desenvolvimento:

- [ ] Node.js LTS configurado
- [ ] React configurado
- [ ] TypeScript strict habilitado
- [ ] Vite configurado
- [ ] Copan (`@loft/react-loft`) instalado
- [ ] `@loft/react-icons` instalado
- [ ] `.npmrc` com `NPM_TOKEN` do escopo `@loft` configurado
- [ ] TanStack Router configurado
- [ ] TanStack Query configurado
- [ ] React Hook Form configurado
- [ ] Zod configurado
- [ ] ESLint configurado
- [ ] Prettier configurado
- [ ] Vitest configurado
- [ ] React Testing Library configurada
- [ ] Playwright configurado quando aplicável
- [ ] Environment variables configuradas
- [ ] API Client criado
- [ ] Error handling definido
- [ ] Authentication definida
- [ ] Authorization definida
- [ ] Layout base criado
- [ ] Loading state definido
- [ ] Empty state definido
- [ ] Error state definido
- [ ] Acessibilidade considerada
- [ ] README inicial criado

---

# 53. Checklist de Code Review

Antes de abrir um PR:

- [ ] TypeScript sem erros
- [ ] ESLint sem erros
- [ ] Formatação aplicada
- [ ] Testes passando
- [ ] Estados de loading tratados
- [ ] Estados de erro tratados
- [ ] Empty states tratados
- [ ] Permissões verificadas
- [ ] Não existem secrets no frontend
- [ ] Não existem chamadas HTTP diretamente em componentes
- [ ] Server State está no TanStack Query
- [ ] Client State está separado
- [ ] Tokens do Design System (`@loft/tokens-loft`) estão sendo utilizados
- [ ] Componentes do Copan (`@loft/react-loft`) foram priorizados
- [ ] Acessibilidade básica validada
- [ ] Responsividade validada

---

# 54. Instruções para IA

Este bloco deve ser utilizado como contexto inicial em ferramentas de desenvolvimento assistido por IA.

> Ao desenvolver este projeto, siga obrigatoriamente o Loft Frontend Foundation e o Loft Design System.
>
> Utilize React 19+, TypeScript strict e Vite.
>
> Utilize Copan (`@loft/react-loft`) como biblioteca principal de componentes visuais, `@loft/tokens-loft` para tokens e `@loft/react-icons` para ícones — são pacotes privados reais, não uma referência a copiar.
>
> Utilize TanStack Router para roteamento.
>
> Utilize TanStack Query para server state.
>
> Utilize React State ou Zustand para client state quando necessário.
>
> Utilize React Hook Form para formulários.
>
> Utilize Zod para validação.
>
> Utilize Vitest, React Testing Library e Playwright conforme o nível de teste necessário.
>
> Sempre utilize as bibliotecas privadas reais do Copan (`@loft/react-loft`, `@loft/tokens-loft`, `@loft/react-icons`).
>
> Não introduza outra biblioteca visual (Ant Design, MUI, Chakra, Bootstrap, styled-components) sem justificativa.
>
> Não criar uma biblioteca de componentes paralela ao Copan sem necessidade real.
>
> Priorize composição e reutilização.
>
> Não colocar chamadas HTTP diretamente nos componentes.
>
> Não armazenar server state em Zustand.
>
> Não colocar secrets no frontend.
>
> Toda autorização deve ser tratada também pelo backend.
>
> Utilize os tokens definidos pelo Loft Design System.
>
> A interface deve utilizar Inter, grid de 8px, radius padrão de 8px e a paleta oficial.
>
> Toda tela deve considerar loading, success, empty, error e permission denied quando aplicável.
>
> Todos os formulários devem possuir validação e estados de erro.
>
> Todos os fluxos críticos devem possuir testes.
>
> Antes de adicionar uma nova dependência, avaliar se a funcionalidade já pode ser resolvida pela stack existente.
>
> O código deve permanecer independente da ferramenta de IA utilizada para sua criação.

---

# 55. Definition of Done — Frontend

Uma funcionalidade frontend pode ser considerada concluída quando:

```text
Código
 ├── TypeScript válido
 ├── ESLint válido
 └── arquitetura consistente

UI
 ├── Design System aplicado
 ├── responsividade validada
 └── acessibilidade considerada

Estado
 ├── loading
 ├── success
 ├── empty
 └── error

Dados
 ├── API isolada
 ├── cache adequado
 └── validação

Segurança
 ├── autorização
 ├── sem secrets
 └── tratamento de erros

Testes
 ├── unit/component quando necessário
 └── E2E para fluxos críticos

Deploy
 └── build de produção funcionando
```

---

# 56. Princípio Final

O objetivo do padrão Loft não é criar um framework interno.

O objetivo é criar uma **fundação previsível** sobre tecnologias públicas e amplamente utilizadas.

A aplicação deve poder ser desenvolvida:

```text
Cursor
VS Code
Lovable
Figma Make
ou manualmente
```

sem alterar sua arquitetura fundamental.

A combinação recomendada é:

```text
                 LOFT FRONTEND
                       │
          ┌────────────┴────────────┐
          │                         │
   Frontend Foundation       Loft Design System
          │                         │
          │                         │
   React + TypeScript          Copan (@loft/react-loft)
   Vite                        Tokens
   TanStack Router             Branding
   TanStack Query              Components
   React Hook Form             UX
   Zod
   Zustand
   Vitest
   Playwright
          │                         │
          └────────────┬────────────┘
                       │
                       ▼
                 APPLICATION
```

**Resultado esperado:** aplicações frontend modernas, tipadas, testáveis, acessíveis, escaláveis e visualmente consistentes com o padrão Loft, sem dependência direta do Copan ou de bibliotecas privadas.