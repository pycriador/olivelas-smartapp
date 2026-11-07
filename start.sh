#!/usr/bin/env bash
# ==============================================================================
# AIOps App Builder Engine — Local Development Startup Script
# ==============================================================================
# Usage:
#   ./start.sh          - Starts all services in foreground (Ctrl+C terminates all)
#   ./start.sh --daemon - Starts all services in background
#   ./start.sh stop     - Stops all running services
#   ./start.sh status   - Checks health and status of all services
#   ./start.sh logs     - Follows combined logs of all services
# ==============================================================================

set -e
set -m

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/app_builder_engine"
FRONTEND_DIR="${PROJECT_ROOT}/app_builder_engine/frontend"
LOG_DIR="${PROJECT_ROOT}/logs"
PID_DIR="${PROJECT_ROOT}/.pids"

mkdir -p "${LOG_DIR}" "${PID_DIR}"

# Ports
PORT_BACKEND="${APP_BUILDER_BACKEND_PORT:-8000}"
PORT_FRONTEND="${APP_BUILDER_FRONTEND_PORT:-5173}"

# Color formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_banner() {
  echo -e "${CYAN}${BOLD}"
  echo "╔══════════════════════════════════════════════════════════════════════════╗"
  echo "║                       AIOps App Builder Engine                           ║"
  echo "║                   Ambiente de Desenvolvimento Local                      ║"
  echo "╚══════════════════════════════════════════════════════════════════════════╝"
  echo -e "${NC}"
}

check_prerequisites() {
  echo -e "${BLUE}🔍 Verificando pré-requisitos...${NC}"

  if ! command -v python3 &>/dev/null; then
    echo -e "${RED}❌ Erro: python3 não encontrado no PATH.${NC}"
    exit 1
  fi

  if ! command -v npm &>/dev/null; then
    echo -e "${RED}❌ Erro: npm não encontrado no PATH.${NC}"
    exit 1
  fi

  # Check backend .env
  if [ ! -f "${BACKEND_DIR}/.env" ]; then
    if [ -f "${BACKEND_DIR}/.env.example" ]; then
      echo -e "${YELLOW}⚠️  Aviso: app_builder_engine/.env não encontrado. Copiando de .env.example...${NC}"
      cp "${BACKEND_DIR}/.env.example" "${BACKEND_DIR}/.env"
    else
      echo -e "${RED}❌ Erro: app_builder_engine/.env não configurado.${NC}"
      exit 1
    fi
  fi

  # Ensure frontend dependencies are installed
  if [ ! -d "${FRONTEND_DIR}/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Dependências do frontend não instaladas. Rodando npm install...${NC}"
    (cd "${FRONTEND_DIR}" && npm install)
  fi

  echo -e "${GREEN}✓ Pré-requisitos verificados com sucesso.${NC}"
}

is_port_in_use() {
  local port=$1
  lsof -iTCP:"${port}" -sTCP:LISTEN -n -P -t >/dev/null 2>&1
}

kill_port_process() {
  local port=$1
  local name=$2
  local pids
  pids=$(lsof -iTCP:"${port}" -sTCP:LISTEN -n -P -t 2>/dev/null || true)
  if [ -n "${pids}" ]; then
    echo -e "${YELLOW}Liberando porta ${port} (${name})...${NC}"
    for pid in ${pids}; do
      local ppid
      ppid=$(ps -o ppid= -p "${pid}" 2>/dev/null | tr -d ' ' || true)
      if [ -n "${ppid}" ] && [ "${ppid}" -gt 1 ]; then
        local comm
        comm=$(ps -o comm= -p "${ppid}" 2>/dev/null || true)
        if echo "${comm}" | grep -qE "npm|npx|node|yarn|pnpm"; then
          kill -9 "${ppid}" 2>/dev/null || true
        fi
      fi
      kill -9 "${pid}" 2>/dev/null || true
    done
    sleep 0.5
  fi
}

stop_all() {
  echo -e "\n${YELLOW}🛑 Parando todos os serviços...${NC}"

  for pidfile in "${PID_DIR}"/*.pid; do
    if [ -f "${pidfile}" ]; then
      local pid
      pid=$(cat "${pidfile}" 2>/dev/null || true)
      if [ -n "${pid}" ] && kill -0 "${pid}" 2>/dev/null; then
        kill "${pid}" 2>/dev/null || true
      fi
      rm -f "${pidfile}"
    fi
  done

  kill_port_process "${PORT_BACKEND}" "App Builder Backend"
  kill_port_process "${PORT_FRONTEND}" "App Builder Frontend"

  echo -e "${GREEN}✓ Todos os serviços foram parados com sucesso.${NC}"
}

status() {
  print_banner
  echo -e "${BOLD}Status dos Serviços Locais:${NC}\n"

  printf "%-25s %-10s %-12s %-30s\n" "SERVIÇO" "PORTA" "STATUS" "URL"
  printf "%-25s %-10s %-12s %-30s\n" "-------" "-----" "------" "---"

  if is_port_in_use "${PORT_BACKEND}"; then
    printf "%-25s %-10s ${GREEN}%-12s${NC} %-30s\n" "App Builder Backend" "${PORT_BACKEND}" "ONLINE" "http://localhost:${PORT_BACKEND}/docs"
  else
    printf "%-25s %-10s ${RED}%-12s${NC} %-30s\n" "App Builder Backend" "${PORT_BACKEND}" "OFFLINE" "-"
  fi

  if is_port_in_use "${PORT_FRONTEND}"; then
    printf "%-25s %-10s ${GREEN}%-12s${NC} %-30s\n" "App Builder UI" "${PORT_FRONTEND}" "ONLINE" "http://localhost:${PORT_FRONTEND}"
  else
    printf "%-25s %-10s ${RED}%-12s${NC} %-30s\n" "App Builder UI" "${PORT_FRONTEND}" "OFFLINE" "-"
  fi
  echo ""
}

start_services() {
  local daemon_mode=$1

  print_banner
  check_prerequisites

  kill_port_process "${PORT_BACKEND}" "App Builder Backend"
  kill_port_process "${PORT_FRONTEND}" "App Builder Frontend"

  echo -e "\n${BLUE}🚀 Iniciando os serviços...${NC}"

  # 1. Backend (FastAPI)
  echo -e "  [1/2] Iniciando ${BOLD}App Builder Engine Backend${NC} (:${PORT_BACKEND})..."
  cd "${BACKEND_DIR}"
  nohup python3 -m uvicorn app.main:app --host 0.0.0.0 --port "${PORT_BACKEND}" --reload </dev/null > "${LOG_DIR}/backend.log" 2>&1 &
  PID_BACKEND=$!
  echo "${PID_BACKEND}" > "${PID_DIR}/backend.pid"
  disown "${PID_BACKEND}" 2>/dev/null || true

  # 2. Frontend (Vite)
  echo -e "  [2/2] Iniciando ${BOLD}App Builder Engine UI${NC} (:${PORT_FRONTEND})..."
  cd "${FRONTEND_DIR}"
  nohup ./node_modules/.bin/vite --host 0.0.0.0 --port "${PORT_FRONTEND}" </dev/null > "${LOG_DIR}/frontend.log" 2>&1 &
  PID_FRONTEND=$!
  echo "${PID_FRONTEND}" > "${PID_DIR}/frontend.pid"
  disown "${PID_FRONTEND}" 2>/dev/null || true

  cd "${PROJECT_ROOT}"

  echo -e "\n${BLUE}⏳ Aguardando prontidão dos serviços...${NC}"
  sleep 4

  echo -e "\n${GREEN}${BOLD}✨ Todos os serviços foram iniciados com sucesso!${NC}\n"
  echo -e "  • ${BOLD}App Builder UI:${NC}        ${CYAN}http://localhost:${PORT_FRONTEND}${NC}"
  echo -e "  • ${BOLD}App Builder API Docs:${NC}  ${CYAN}http://localhost:${PORT_BACKEND}/docs${NC}"
  echo ""
  echo -e "  • ${BOLD}Logs disponíveis em:${NC} ${LOG_DIR}/"
  echo ""

  if [ "${daemon_mode}" = "daemon" ]; then
    echo -e "${YELLOW}Executando em segundo plano. Para parar, utilize: ./start.sh stop${NC}"
    exit 0
  fi

  echo -e "${YELLOW}Pressione [Ctrl+C] a qualquer momento para encerrar todos os serviços.${NC}\n"

  trap stop_all INT TERM EXIT

  tail -f "${LOG_DIR}/backend.log" \
          "${LOG_DIR}/frontend.log" 2>/dev/null || wait
}

follow_logs() {
  local service=$1
  if [ -n "${service}" ] && [ -f "${LOG_DIR}/${service}.log" ]; then
    tail -f "${LOG_DIR}/${service}.log"
  else
    tail -f "${LOG_DIR}"/*.log
  fi
}

# Main router
case "$1" in
  stop)
    stop_all
    ;;
  status)
    status
    ;;
  restart)
    stop_all
    sleep 2
    start_services "daemon"
    ;;
  logs)
    follow_logs "$2"
    ;;
  --daemon|-d|background)
    start_services "daemon"
    ;;
  *)
    if [ ! -t 0 ] || [ "$1" = "start" ]; then
      start_services "daemon"
    else
      start_services "foreground"
    fi
    ;;
esac
