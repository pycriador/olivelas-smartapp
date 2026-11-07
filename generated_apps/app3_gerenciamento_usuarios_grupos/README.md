# 👥 Loft IAM & Access Hub (App 3)

Central moderna de gerenciamento de usuários, grupos, matriz de controle de acesso (RBAC) e trilha de auditoria universal sem banco de dados (in-memory / mock), conectada **100% à API** da plataforma App Builder Engine (`http://127.0.0.1:8000/api/v1`).

---

## 🚀 Como Executar

Abra o arquivo `index.html` no navegador ou inicie um servidor HTTP local:

```bash
cd generated_apps/app3_gerenciamento_usuarios_grupos
python3 -m http.server 3003
```

Acesse em: **`http://localhost:3003`**

---

## 📡 Endpoints da API Utilizados

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/v1/iam/login` | `POST` | Autenticação administrativa com perfil Global Admin |
| `/api/v1/iam/users` | `GET` / `POST` | Listagem e cadastro de novos colaboradores |
| `/api/v1/iam/users/{id}` | `PUT` / `DELETE` | Atualização de privilégios e exclusão de contas |
| `/api/v1/iam/groups` | `GET` / `POST` | Gestão de squads e times de trabalho |
| `/api/v1/iam/matrix` | `GET` | Recuperação da matriz completa de permissões por papel |
| `/api/v1/iam/permissions/{id}/toggle` | `POST` | Ativação/desativação instantânea de privilégios |
| `/api/v1/rbac/switch-role` | `POST` | Alternância rápida de perfil de segurança |
| `/api/v1/audit/logs` | `GET` | Visualização da trilha universal de auditoria |
