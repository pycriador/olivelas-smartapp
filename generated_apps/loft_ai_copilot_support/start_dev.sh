#!/usr/bin/env bash
set -e

echo "🚀 Iniciando ambiente de desenvolvimento Olivelas..."

# 1. Setup Backend
if [ -d "backend" ]; then
    echo "📦 Preparando Backend FastAPI na porta 8001..."
    cd backend
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -q -r requirements.txt
    python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload &
    BACKEND_PID=$!
    cd ..
fi

# 2. Setup Frontend
if [ -d "frontend" ]; then
    echo "⚛️ Preparando Frontend React 19 na porta 5173..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        npm install --silent
    fi
    npm run dev &
    FRONTEND_PID=$!
    cd ..
fi

echo "✅ Aplicação iniciada com sucesso!"
echo "👉 Backend API Docs: http://127.0.0.1:8001/docs"
echo "👉 Frontend App: http://127.0.0.1:5173"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
