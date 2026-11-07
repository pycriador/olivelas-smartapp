# Stack frontend AIOps

> Language: pt-BR | [English (EN)](../../en/aiops-apps/frontend-stack.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Duas famílias

Os quatro apps **web** caem em **duas famílias** de front:

```text
A) TanStack Start (SSR/file routes)
   aiops-dataforge · aiops-loft-carteira

B) Vite + react-router-dom
   qualidade-loft (SPA)
   aiops-deep-insight (CSR + Express SSR em server/)
```

Ambas usam **React + TypeScript + Vite + Tailwind** e, na família A/Qualidade, um kit **Radix / shadcn-like** (`components.json`).

## Família C — sem front web (AVA)

[ava-prod](https://github.com/loft-br/ava-prod) **não** tem UI React/`package.json`. Superfície = Slack. Detalhes: [ava-prod.md](ava-prod.md).

## Família A — TanStack Start

### Dependências centrais (DataForge / Carteiras)

| Pacote | Papel |
| --- | --- |
| `@tanstack/react-start` | App meta-framework (SSR) |
| `@tanstack/react-router` + `@tanstack/router-plugin` | Rotas file-based + codegen (`routeTree.gen.ts`) |
| `@tanstack/react-query` | Cache / fetching server state |
| `react` / `react-dom` | UI |
| `vite` + `@vitejs/plugin-react` | Build |
| `@tailwindcss/vite` + `tailwindcss` | CSS |
| `@radix-ui/react-*` | Primitivos acessíveis |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Variantes de componente |
| `react-hook-form`, `zod`, `@hookform/resolvers` | Forms + validação |
| `lucide-react` | Ícones |
| `sonner` | Toasts |
| `recharts` | Gráficos |
| `xlsx` / `papaparse` (DataForge) | Planilhas / CSV |
| `@lovable.dev/vite-tanstack-config` | Config Vite compartilhada do scaffold |

### Organização de rotas (exemplo DataForge)

```text
src/routes/
├── __root.tsx
├── index.tsx
├── login.tsx
├── projects.$id.files.tsx
├── admin.users.tsx
└── …
src/router.tsx
src/routeTree.gen.ts    # gerado
```

### Organização de rotas (exemplo Carteiras)

```text
src/routes/
├── __root.tsx
├── _authenticated/
│   ├── route.tsx          # layout + guards
│   ├── dashboard.tsx
│   ├── portfolio.*.tsx
│   └── settings.*.tsx
└── api/public/            # webhooks Slack/WhatsApp no edge do Start
    ├── slack.events.ts
    └── whatsapp.webhook.ts
```

Guards: `src/lib/route-guards.ts` (`requireIamPermission` → redirect `/login` ou `/dashboard`).

## Família B — react-router-dom

### Qualidade (SPA)

| Pacote | Papel |
| --- | --- |
| `react-router-dom` | `BrowserRouter` / `Routes` em `src/App.tsx` |
| `@tanstack/react-query` (+ persist client) | Cache |
| `@supabase/supabase-js`, `@lovable.dev/cloud-auth-js` | Presentes no package (legado/auth helpers) |
| Radix + `zod` + `react-hook-form` | UI/forms (mesmo padrão shadcn) |
| `@vitejs/plugin-react-swc` | Plugin React SWC |

Páginas: `src/pages/*Page.tsx`. Guards: `ProtectedRoute`, `AdminRoute`, `PermissionRoute`.

Exemplo de árvore (trecho observado em `App.tsx`):

```tsx
<Route path="/login" element={<LoginPage />} />
<Route path="/auth/callback" element={<AuthCallbackPage />} />
<Route element={<ProtectedRoute>…</ProtectedRoute>}>
  <Route path="/" element={<HomePage />} />
  <Route path="/artigo/:idSlug" element={<ArticlePage />} />
  <Route path="/chat-ai" element={<ChatAIPage />} />
  <Route path="/admin/analytics" element={
    <PermissionRoute anyPrefix="report."><AdminAnalyticsPage /></PermissionRoute>
  } />
</Route>
```

### Deep Insight (CSR + Express SSR)

| Pacote | Papel |
| --- | --- |
| `react-router-dom` | Rotas client (`src/App.tsx`) |
| `express` + `compression` | Servidor Node (`server/`) — HTML SSR + proxy `/api` |
| `react-markdown` + `remark-gfm` | Render de markdown |
| `motion` | Animações |
| `lucide-react`, Tailwind | UI mais enxuta (menos Radix no package) |

Build scripts observados: `build:client`, `build:ssr`, `build:server`, `start` → `node dist/server-node/index.mjs`.

## Tooling comum

| Ferramenta | Onde |
| --- | --- |
| ESLint + typescript-eslint | DataForge, Qualidade, Carteiras |
| Prettier | DataForge, Carteiras |
| Vitest | DataForge, Qualidade |
| `components.json` | DataForge, Qualidade, Carteiras (CLI shadcn) |

## O que **não** é o padrão destes apps

- **Copan / `@loft/react-loft`**: não listado nos `package.json` analisados.
- **Next.js**: não usado; Vite (+ TanStack Start ou Express) no lugar.
- **PHP / Kotlin front**: fora de escopo destes repos.

## Relacionados

- [routes.md](routes.md) · [security.md](security.md) · [overview.md](overview.md)
