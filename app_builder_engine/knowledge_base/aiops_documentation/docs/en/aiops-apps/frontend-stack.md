# Olivelas frontend stack

> Language: EN | [Português (pt-BR)](../../pt-BR/aiops-apps/frontend-stack.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Families

**A — TanStack Start:** DataForge, Olivelas Carteiras — `@tanstack/react-start`, file routes, Query, Radix/shadcn, RHF+zod, Tailwind via `@tailwindcss/vite`.

**B — react-router-dom:** Qualidade (SPA + `ProtectedRoute`/`PermissionRoute`); Deep Insight (CSR + Express SSR in `server/`, markdown, motion).

Shared: React, TypeScript, Vite, lucide, often recharts/xlsx. Scaffold names in package.json (`vite_react_shadcn_ts`, `tanstack_start_ts`, `gemini-pdf-studio`) are historical.

Not observed in web apps: Copan/`@loft/react-loft`, Next.js. AVA has no React UI ([ava-prod.md](ava-prod.md)).

Details and examples: Portuguese doc is the fuller reference — [pt-BR frontend-stack](../../pt-BR/aiops-apps/frontend-stack.md).
