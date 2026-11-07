# 🏠 Loft Imóveis Exclusivos (App 4)

Página moderna de imóveis para venda com fotos de alta qualidade, mapa interativo, galeria de imagens, simulador de crédito e avaliação imobiliária com inteligência artificial, conectada **100% à API** da plataforma App Builder Engine (`http://127.0.0.1:8000/api/v1`).

---

## 🚀 Como Executar

Abra o arquivo `index.html` diretamente em seu navegador ou inicialize um servidor HTTP:

```bash
cd generated_apps/app4_imoveis_venda
python3 -m http.server 3004
```

Acesse em: **`http://localhost:3004`**

---

## 📡 Endpoints da API Utilizados

| Endpoint | Método | Descrição |
|---|---|---|
| `/api/v1/iam/login` | `POST` | Autenticação do cliente |
| `/api/v1/ai/gateway/execute` | `POST` | Avaliação de mercado, rentabilidade (Yield) e análise de liquidez com IA |
| `/api/v1/api-client/execute` | `POST` | Disparo de agendamento de visita e propostas de compra |
| `/health` | `GET` | Verificação de conectividade |
