# 🤖 Loft AI Support Chatbot (App 2)

Aplicação conversacional inteligente de suporte técnico e operacional conectada **100% à API** da plataforma App Builder Engine (`http://127.0.0.1:8000/api/v1`).

---

## 🚀 Como Executar

Abra o arquivo `index.html` em seu navegador ou suba um servidor HTTP:

```bash
cd generated_apps/app2_chatbot_suporte
python3 -m http.server 3002
```

Acesse em: **`http://localhost:3002`**

---

## 📡 Endpoints da API Utilizados

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/v1/iam/login` | `POST` | Autenticação e obtenção do perfil do operador |
| `/api/v1/ai/gateway/models` | `GET` | Recuperação dinâmica dos modelos de IA ativos (Gemini 3.X) |
| `/api/v1/ai/gateway/execute` | `POST` | Execução de inferência conversacional com o LLM |
| `/api/v1/knowledge/search?q={termo}` | `GET` | Recuperação RAG para embasamento de respostas com documentação técnica |
| `/health` | `GET` | Monitoramento em tempo real da saúde da API |
