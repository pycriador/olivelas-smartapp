# 🏢 Loft AI Copilot Support

> Página de chatbot sem banco de dados, somente mock, com design padrão Loft Copan  
> Desenvolvido e governado através do **Loft App Builder Engine** e **Copan Design System**.

---

## 🛠️ Stack Tecnológica & Arquitetura
- **Design System:** Copan Design System (Ant Design v5 + Loft Brand Tokens `#F56738`)
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query
- **Backend:** FastAPI (Python 3.11+) + Pydantic v2 + SQLite / SQLAlchemy 2.x
- **Governança:** Zero Trust, RBAC, Rate Limiting, Audit Trail e Contratos OpenAPI

---

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+

### Execução Simplificada
```bash
./start_dev.sh
```

### Execução Manual
```bash
# Backend (Porta 8001)
cd backend
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload

# Frontend (Porta 5173)
cd frontend
npm install
npm run dev
```
Acesse a aplicação em: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testes Automatizados
```bash
# Testes de Backend
cd backend && pytest tests/ -v

# Testes de Frontend
cd frontend && npm run test
```
