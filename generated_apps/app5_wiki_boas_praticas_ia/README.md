# 📖 Olivelas AI & Engineering Wiki (App 5)

Página de documentação moderna tipo Wiki com guias canônicos de Boas Práticas com IA, Prompt Engineering, Guardrails, Otimização de Tokens e Copilot Interativo, conectada **100% à API** da plataforma App Builder Engine (`http://127.0.0.1:8000/api/v1`).

---

## 🚀 Como Executar

Abra o arquivo `index.html` em seu navegador ou suba um servidor HTTP local:

```bash
cd generated_apps/app5_wiki_boas_praticas_ia
python3 -m http.server 3005
```

Acesse em: **`http://localhost:3005`**

---

## 📡 Endpoints da API Utilizados

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/v1/iam/login` | `POST` | Autenticação do desenvolvedor |
| `/api/v1/knowledge/docs` | `GET` | Recuperação da lista de especificações e documentações na base |
| `/api/v1/knowledge/docs` | `POST` | Publicação de novo guia ou especificação técnica |
| `/api/v1/knowledge/search?q={query}` | `GET` | Busca global instantânea com realce de termos |
| `/api/v1/knowledge/favorites` | `GET` / `POST` | Gerenciamento de artigos favoritados |
| `/api/v1/ai/gateway/execute` | `POST` | Copilot interativo com IA para responder dúvidas sobre os guias |
| `/api/v1/rules` | `GET` | Sincronização de Golden Rules arquiteturais |
