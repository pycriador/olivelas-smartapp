# Padrões de Backend Olivelas

## ⚙️ Arquitetura em Camadas (FastAPI)

```text
Router (FastAPI)
  └── Application Service (Use Cases)
        ├── Domain & Policies (Business Logic & Authorization)
        ├── Repositories (SQLAlchemy 2.x Async)
        └── AI Gateway (AI-BAS LLMGateway)
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia |
| :--- | :--- |
| **Linguagem & Runtime** | Python 3.13+ |
| **Web Framework** | FastAPI (Async) |
| **Validação & Serialização**| Pydantic v2 |
| **ORM & Database** | SQLAlchemy 2.0 (Async) + PostgreSQL (asyncpg) |
| **Migrations** | Alembic |
| **Autenticação & Senhas** | PyJWT + pwdlib[argon2] |
| **Testes** | Pytest + pytest-asyncio / TestClient |

---

## 🔒 Segurança & Zero Trust (BSS)

1. **Default Deny:** Toda rota é protegida por padrão a menos que explicitamente marcada como pública.
2. **Isolamento Multi-Tenant:** O `tenant_id` é sempre derivado do contexto autenticado no token JWT. Nunca confiar no `tenant_id` fornecido no payload da requisição.
3. **Autorização no Recurso (BOLA/IDOR):** Toda mutação valida se o recurso pertence ao mesmo tenant antes de executar a operação.
4. **Sem Modelos em Routers:** Modelos de SQLAlchemy nunca são expostos diretamente nos endpoints; todas as entradas e saídas usam schemas Pydantic separados (`Create`, `Update`, `Response`).
