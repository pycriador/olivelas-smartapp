# 📰 Olivelas News Portal (App 1)

Aplicação frontend completa, moderna e isolada consumindo **100% da API** da plataforma App Builder Engine (`http://127.0.0.1:8000/api/v1`).

---

## 🚀 Como Executar

Abra o arquivo `index.html` diretamente em seu navegador ou inicie um servidor local:

```bash
cd generated_apps/app1_portal_noticias
python3 -m http.server 3001
```

Acesse em: **`http://localhost:3001`**

---

## 📡 Endpoints da API Utilizados

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/v1/iam/login` | `POST` | Autenticação do operador e obtenção do token JWT |
| `/api/v1/knowledge/docs` | `GET` | Listagem em tempo real de artigos e notícias da base |
| `/api/v1/knowledge/docs` | `POST` | Publicação de nova matéria jornalística na base |
| `/api/v1/knowledge/search?q={query}` | `GET` | Busca instantânea por título, tags e conteúdo integral |
| `/api/v1/knowledge/favorites` | `GET` | Recuperação dos IDs favoritados pelo usuário |
| `/api/v1/knowledge/favorites/{id}` | `POST` | Alternância de favorito com persistência no backend |
| `/api/v1/ai/gateway/execute` | `POST` | Geração de resumos executivos inteligentes via IA |
| `/health` | `GET` | Verificação de conectividade e status do backend |
