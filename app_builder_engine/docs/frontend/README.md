# Padrões de Frontend Loft

## 🎨 Design System & UI

- **Fundação:** Ant Design + Loft Tokens (`#FF774A` como cor primária) + Loft Conventions.
- **Proibição Absoluta:** NUNCA importar `@loft/*` ou pacotes privados do Copan. O Copan é apenas referência visual.
- **Tipografia:** Família `Inter`, com hierarquia clara e tom de voz imperativo gentil em `pt-BR`.
- **Cards e Superfícies:** Raio de borda de 12px com borda de 1px OU sombra suave (nunca ambos).

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Framework** | React 19+ com TypeScript (Strict Mode) |
| **Build Tool** | Vite |
| **Componentes UI** | Ant Design (`antd`) |
| **Roteamento** | TanStack Router |
| **Server State** | TanStack Query (`@tanstack/react-query`) |
| **Client State** | Zustand |
| **Formulários & Validação** | React Hook Form + Zod |
| **Testes** | Vitest + React Testing Library |

---

## 🚦 Regras de Ouro de Frontend

1. **Separação de Estados:** Server state reside exclusivamente no TanStack Query. Nunca fazer `fetch` dentro de `useEffect` para guardar estado em Zustand ou `useState`.
2. **7 Estados Obrigatórios:** Toda tela com listagem/dados deve cobrir: Loading, Success, Empty, No Results (busca sem resultado), Error (com botão de retry), Permission Denied e Not Found.
3. **Internacionalização/Moeda:** Valores monetários sempre formatados como `R$ 1.234,56` e áreas em `62m²`.
