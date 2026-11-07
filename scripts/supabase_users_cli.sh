#!/usr/bin/env bash
# ==============================================================================
# Olivelas SmartApp — Exemplo de Gerenciamento de Usuários no Supabase via CLI
# Schema Isolado: olivelas_smartapp
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

if [[ -f "${REPO_ROOT}/.env" ]]; then
  set -a
  source "${REPO_ROOT}/.env"
  set +a
fi

COMMAND="${1:-help}"
shift || true

case "${COMMAND}" in
  list|status)
    python3 "${SCRIPT_DIR}/supabase_users_cli.py" list
    ;;
  create-first-admin)
    NAME="${1:-Global Admin}"
    EMAIL="${2:-admin@olivelas.com.br}"
    PASS="${3:-Admin123456}"
    python3 "${SCRIPT_DIR}/supabase_users_cli.py" create \
      --name "${NAME}" \
      --email "${EMAIL}" \
      --password "${PASS}"
    ;;
  create)
    python3 "${SCRIPT_DIR}/supabase_users_cli.py" create "$@"
    ;;
  set-role)
    python3 "${SCRIPT_DIR}/supabase_users_cli.py" set-role "$@"
    ;;
  reset-password)
    python3 "${SCRIPT_DIR}/supabase_users_cli.py" reset-password "$@"
    ;;
  verify)
    python3 "${SCRIPT_DIR}/supabase_users_cli.py" verify "$@"
    ;;
  delete)
    python3 "${SCRIPT_DIR}/supabase_users_cli.py" delete "$@"
    ;;
  sql-users)
    PGPASSWORD="${db_password}" psql \
      -h "${db_host}" \
      -p "${db_port:-5432}" \
      -U "${db_username:-${username:-postgres}}" \
      -d "${db:-postgres}" \
      -c "SELECT id, name, username, email, role, status, primary_group_id, created_at FROM olivelas_smartapp.users ORDER BY created_at ASC;"
    ;;
  rest-users)
    curl -sS "${VITE_SUPABASE_URL}/rest/v1/users?select=id,name,username,email,role,status,created_at" \
      -H "apikey: ${VITE_SUPABASE_KEY}" \
      -H "Authorization: Bearer ${VITE_SUPABASE_KEY}" \
      -H "Accept-Profile: ${DB_SCHEMA:-olivelas_smartapp}" | python3 -m json.tool
    ;;
  *)
    cat <<EOF
Uso: ./scripts/supabase_users_cli.sh <comando> [opções]

Comandos disponíveis:
  list                                            Lista todos os usuários no schema olivelas_smartapp
  create-first-admin [Nome] [Email] [Senha]       Cadastra o 1º usuário (recebe Global Admin automaticamente)
  create --name "..." --email "..." --password .. Cria usuário customizado
  set-role --ident <email> --role "Global Admin"  Promove ou altera role de um usuário
  reset-password --ident <email> --password "..." Reseta senha de um usuário
  verify --ident <email> --password "..."         Testa autenticação do usuário
  delete --ident <email> | --all                  Remove um usuário (ou todos com --all)
  sql-users                                       Consulta usuários diretamente via psql no Supabase
  rest-users                                      Consulta usuários via Supabase Data API (PostgREST)
EOF
    ;;
esac
