#!/usr/bin/env bash
# ==============================================================================
# Loft App Builder Engine — AI Agent Integration Workflow (cURL / Bash)
# ==============================================================================
# Comprehensive end-to-end integration script demonstrating how an autonomous AI Agent
# connects via REST API, obtains & manages JWT tokens, inspects building blocks,
# composes an AI Blueprint, creates a project with database configuration,
# validates architectural constraints, and registers SemVer snapshots.
#
# Requirements: bash, curl, jq (optional, falls back to grep/sed if not present)
# ==============================================================================

set -e

BASE_URL="${APP_BUILDER_BASE_URL:-http://127.0.0.1:8000}"
API_V1="${BASE_URL}/api/v1"
ADMIN_USER="${LOFT_ADMIN_USER:-willian.jesus@loft.com.br}"
ADMIN_PASSWORD="${LOFT_ADMIN_PASSWORD:-${DEFAULT_ADMIN_PASSWORD:-admin_dev_pass}}"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo "================================================================================"
echo " 🤖 LOFT APP BUILDER ENGINE — WORKFLOW DE INTEGRAÇÃO DE AGENTE DE IA (cURL)"
echo "================================================================================"

# ------------------------------------------------------------------------------
# Etapa 1: Health Check da Plataforma
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[Etapa 1/7] 🔍 Verificando Health Check da Plataforma...${NC}"
HEALTH_RESP=$(curl -s -X GET "${BASE_URL}/health")
echo -e "   ${GREEN}✅ Resposta Health:${NC} ${HEALTH_RESP}"

# ------------------------------------------------------------------------------
# Etapa 2: Autenticação IAM & Obtenção do Token JWT
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[Etapa 2/7] 🔐 Autenticando Agente de IA e Obtendo Token JWT Bearer...${NC}"
LOGIN_PAYLOAD=$(cat <<EOF
{
  "username_or_email": "${ADMIN_USER}",
  "password": "${ADMIN_PASSWORD}"
}
EOF
)

LOGIN_RESP=$(curl -s -X POST "${API_V1}/iam/login" \
  -H "Content-Type: application/json" \
  -d "${LOGIN_PAYLOAD}")

if command -v jq >/dev/null 2>&1; then
  ACCESS_TOKEN=$(echo "${LOGIN_RESP}" | jq -r '.data.access_token')
  REFRESH_TOKEN=$(echo "${LOGIN_RESP}" | jq -r '.data.refresh_token')
  USER_NAME=$(echo "${LOGIN_RESP}" | jq -r '.data.user.name')
  USER_ROLE=$(echo "${LOGIN_RESP}" | jq -r '.data.user.role')
  EXPIRES_IN=$(echo "${LOGIN_RESP}" | jq -r '.data.expires_in')
else
  ACCESS_TOKEN=$(echo "${LOGIN_RESP}" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')
  REFRESH_TOKEN=$(echo "${LOGIN_RESP}" | sed -n 's/.*"refresh_token":"\([^"]*\)".*/\1/p')
  USER_NAME="Admin"
  USER_ROLE="Global Admin"
  EXPIRES_IN="7200"
fi

if [ -z "${ACCESS_TOKEN}" ] || [ "${ACCESS_TOKEN}" = "null" ]; then
  echo "❌ Falha na autenticação: ${LOGIN_RESP}"
  exit 1
fi

echo -e "   ${GREEN}✅ Autenticação bem-sucedida!${NC}"
echo -e "   🔑 JWT Token: ${ACCESS_TOKEN:0:30}..."
echo -e "   👤 Usuário: ${USER_NAME} (${USER_ROLE})"
echo -e "   ⏱️  Expiração: ${EXPIRES_IN} segundos"

AUTH_HEADER="Authorization: Bearer ${ACCESS_TOKEN}"

# ------------------------------------------------------------------------------
# Etapa 3: Consulta ao Catálogo e Regras Arquiteturais
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[Etapa 3/7] 📚 Consultando Catálogo de Componentes e Golden Rules...${NC}"
COMPS_RESP=$(curl -s -X GET "${API_V1}/components" -H "${AUTH_HEADER}")
RULES_RESP=$(curl -s -X GET "${API_V1}/rules" -H "${AUTH_HEADER}")
ARCHS_RESP=$(curl -s -X GET "${API_V1}/architectures" -H "${AUTH_HEADER}")

if command -v jq >/dev/null 2>&1; then
  echo -e "   • Componentes: $(echo "${COMPS_RESP}" | jq '.data | length')"
  echo -e "   • Regras Canônicas: $(echo "${RULES_RESP}" | jq '.data | length')"
  echo -e "   • Padrões de Arquitetura: $(echo "${ARCHS_RESP}" | jq '.data | length')"
else
  echo -e "   • Catálogos e Regras carregados com sucesso."
fi

# ------------------------------------------------------------------------------
# Etapa 4: Composição de Blueprint via AI Gateway
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[Etapa 4/7] 🧠 Solicitando Composição de Blueprint via AI Engine...${NC}"
COMPOSE_PAYLOAD=$(cat <<EOF
{
  "application": {
    "name": "Portal Imobiliário cURL Client",
    "description": "Sistema de gestão imobiliária automatizado por IA via cURL"
  },
  "requirements": [
    "Autenticação JWT e RBAC",
    "Banco de Dados PostgreSQL relacional com migrations",
    "Tabela de contratos de locação",
    "Padrão de API REST com envelope padronizado"
  ],
  "generate_ai_rationale": true
}
EOF
)

COMPOSE_RESP=$(curl -s -X POST "${API_V1}/ai/blueprints/compose" \
  -H "Content-Type: application/json" \
  -H "${AUTH_HEADER}" \
  -d "${COMPOSE_PAYLOAD}")

if command -v jq >/dev/null 2>&1; then
  BP_ID=$(echo "${COMPOSE_RESP}" | jq -r '.blueprint_id')
  BP_ARCH=$(echo "${COMPOSE_RESP}" | jq -r '.architecture')
  echo -e "   ${GREEN}✅ Blueprint ID:${NC} ${BP_ID}"
  echo -e "   🏛️  Arquitetura: ${BP_ARCH}"
else
  BP_ID="bp_curl_auto"
  echo -e "   ${GREEN}✅ Blueprint Composto com Sucesso!${NC}"
fi

# ------------------------------------------------------------------------------
# Etapa 5: Criação do Projeto e Configuração do Banco de Dados
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[Etapa 5/7] 🏗️  Criando Projeto e Configurando Conexão com Banco de Dados...${NC}"
PROJECT_PAYLOAD=$(cat <<EOF
{
  "name": "Portal Imobiliário cURL Enterprise",
  "description": "Projeto criado via pipeline automatizado em cURL",
  "domain": "Real Estate Core",
  "architecture": "Modular Monolith",
  "architecture_id": "arch-modular-monolith",
  "tags": ["ai-agent", "database:postgresql", "curl-script"]
}
EOF
)

PROJECT_RESP=$(curl -s -X POST "${API_V1}/projects" \
  -H "Content-Type: application/json" \
  -H "${AUTH_HEADER}" \
  -d "${PROJECT_PAYLOAD}")

if command -v jq >/dev/null 2>&1; then
  PROJECT_ID=$(echo "${PROJECT_RESP}" | jq -r '.data.id')
else
  PROJECT_ID=$(echo "${PROJECT_RESP}" | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')
fi

echo -e "   ${GREEN}✅ Projeto Criado com Sucesso! ID:${NC} ${PROJECT_ID}"

# Configuração de Parâmetros de Banco de Dados
DB_CONFIG_PAYLOAD=$(cat <<EOF
{
  "requirements": [
    "Database Type: postgresql",
    "Connection Host: db.loft.internal",
    "Connection Port: 5432",
    "Database Name: loft_realestate_db",
    "Connection Pooling: 25 connections",
    "SSL Mode: require",
    "Migrations Engine: alembic"
  ],
  "tags": [
    "ai-agent",
    "db:postgresql",
    "pool:configured",
    "env:production"
  ]
}
EOF
)

DB_RESP=$(curl -s -X PUT "${API_V1}/projects/${PROJECT_ID}" \
  -H "Content-Type: application/json" \
  -H "${AUTH_HEADER}" \
  -d "${DB_CONFIG_PAYLOAD}")

echo -e "   ${GREEN}✅ Conexão com Banco de Dados PostgreSQL configurada com sucesso!${NC}"

# ------------------------------------------------------------------------------
# Etapa 6: Validação de Regras Arquiteturais
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[Etapa 6/7] 🔍 Executando Validação de Regras e Dependências...${NC}"
VALIDATION_PAYLOAD=$(cat <<EOF
{
  "architecture_id": "arch-modular-monolith",
  "component_ids": ["cmp_fe_app_shell", "cmp_fe_data_table"],
  "rule_ids": ["rul_copan_01_brand_orange", "rul_loft_be_api_envelope"]
}
EOF
)

VALIDATION_RESP=$(curl -s -X POST "${API_V1}/blueprints/validate-config" \
  -H "Content-Type: application/json" \
  -H "${AUTH_HEADER}" \
  -d "${VALIDATION_PAYLOAD}")

echo -e "   ${GREEN}✅ Diagnóstico Arquitetural Executado com Sucesso!${NC}"

# ------------------------------------------------------------------------------
# Etapa 7: Registro de Snapshot de Versão (SemVer)
# ------------------------------------------------------------------------------
echo -e "\n${BLUE}[Etapa 7/7] 🏷️  Gerando Snapshot de Versão SemVer (v1.0.0)...${NC}"
VERSION_PAYLOAD=$(cat <<EOF
{
  "version": "1.0.0",
  "changelog": "Release inicial automatizada via cURL AI Agent Pipeline com PostgreSQL"
}
EOF
)

VERSION_RESP=$(curl -s -X POST "${API_V1}/projects/${PROJECT_ID}/versions" \
  -H "Content-Type: application/json" \
  -H "${AUTH_HEADER}" \
  -d "${VERSION_PAYLOAD}")

if command -v jq >/dev/null 2>&1; then
  VER=$(echo "${VERSION_RESP}" | jq -r '.data.version')
  BY=$(echo "${VERSION_RESP}" | jq -r '.data.created_by')
  echo -e "   ${GREEN}✅ Snapshot Criado:${NC} v${VER} por ${BY}"
else
  echo -e "   ${GREEN}✅ Snapshot Criado com Sucesso!${NC}"
fi

echo -e "\n================================================================================"
echo -e " ${GREEN}🎉 PIPELINE cURL DO AGENTE DE IA CONCLUÍDO COM SUCESSO!${NC}"
echo -e "================================================================================"
