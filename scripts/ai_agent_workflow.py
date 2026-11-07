#!/usr/bin/env python3
"""
Olivelas App Builder Engine — AI Agent Integration Workflow (Python)
-----------------------------------------------------------------
Comprehensive end-to-end integration script demonstrating how an autonomous AI Agent
connects via REST API, obtains & manages JWT tokens, inspects building blocks,
composes an AI Blueprint, creates a project with database configuration,
validates architectural constraints, and registers SemVer snapshots.

Compatible with Python 3.9+ using standard requests library.
"""
from __future__ import annotations
import json
import os
import sys
import time
from typing import Any, Dict, Optional

try:
    import requests
except ImportError:
    print("❌ Erro: O pacote 'requests' é necessário. Instale com 'pip install requests'")
    sys.exit(1)


class AIAgentClient:
    """Enterprise AI Agent API Client for Olivelas App Builder Engine."""

    def __init__(self, base_url: Optional[str] = None):
        self.base_url = (base_url or os.getenv("APP_BUILDER_BASE_URL", "http://127.0.0.1:8000")).rstrip("/")
        self.api_v1 = f"{self.base_url}/api/v1"
        self.access_token: Optional[str] = None
        self.refresh_token: Optional[str] = None
        self.user_claims: Dict[str, Any] = {}

    def _get_headers(self) -> Dict[str, str]:
        headers = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Olivelas-AIAgent-Worker/1.0",
        }
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        return headers

    def check_health(self) -> Dict[str, Any]:
        """Step 1: Check platform liveness and readiness."""
        url = f"{self.base_url}/health"
        res = requests.get(url, headers=self._get_headers(), timeout=10)
        res.raise_for_status()
        return res.json()

    def authenticate(self, username_or_email: Optional[str] = None, password: Optional[str] = None) -> Dict[str, Any]:
        """Step 2: Authenticate and obtain JWT Access & Refresh Tokens."""
        username_or_email = username_or_email or os.getenv("LOFT_ADMIN_USER", "willian.jesus@olivelas.com.br")
        password = password or os.getenv("LOFT_ADMIN_PASSWORD") or os.getenv("DEFAULT_ADMIN_PASSWORD", "admin_dev_pass")

        url = f"{self.api_v1}/iam/login"
        payload = {"username_or_email": username_or_email, "password": password}
        res = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=10)
        res.raise_for_status()
        body = res.json()
        data = body.get("data", {})
        self.access_token = data.get("access_token")
        self.refresh_token = data.get("refresh_token")
        self.user_claims = data.get("user", {})
        return data

    def refresh_access_token(self) -> Dict[str, Any]:
        """Step 2b: Renew access token using refresh token."""
        if not self.refresh_token:
            raise ValueError("No refresh token available.")
        url = f"{self.api_v1}/iam/auth/refresh"
        payload = {"refresh_token": self.refresh_token}
        res = requests.post(url, json=payload, headers={"Content-Type": "application/json"}, timeout=10)
        res.raise_for_status()
        body = res.json()
        data = body.get("data", {})
        self.access_token = data.get("access_token")
        if data.get("refresh_token"):
            self.refresh_token = data.get("refresh_token")
        return data

    def get_current_user(self) -> Dict[str, Any]:
        """Step 2c: Verify active session and permissions."""
        url = f"{self.api_v1}/iam/auth/me"
        res = requests.get(url, headers=self._get_headers(), timeout=10)
        res.raise_for_status()
        return res.json().get("data", {})

    def discover_catalog(self) -> Dict[str, Any]:
        """Step 3: Discover available components, modules, rules and architectures."""
        components = requests.get(f"{self.api_v1}/components", headers=self._get_headers(), timeout=10).json()
        rules = requests.get(f"{self.api_v1}/rules", headers=self._get_headers(), timeout=10).json()
        architectures = requests.get(f"{self.api_v1}/architectures", headers=self._get_headers(), timeout=10).json()
        return {
            "components_count": len(components.get("data", [])),
            "rules_count": len(rules.get("data", [])),
            "architectures_count": len(architectures.get("data", [])),
        }

    def compose_blueprint(self, name: str, description: str, requirements: list[str]) -> Dict[str, Any]:
        """Step 4: AI Blueprint Composition based on business requirements."""
        url = f"{self.api_v1}/ai/blueprints/compose"
        payload = {
            "application": {"name": name, "description": description},
            "requirements": requirements,
            "generate_ai_rationale": True,
        }
        res = requests.post(url, json=payload, headers=self._get_headers(), timeout=15)
        res.raise_for_status()
        return res.json()

    def create_project(self, name: str, description: str, blueprint_id: Optional[str] = None, tags: Optional[list[str]] = None) -> Dict[str, Any]:
        """Step 5: Register new project in the platform."""
        url = f"{self.api_v1}/projects"
        payload = {
            "name": name,
            "description": description,
            "domain": "Real Estate Core",
            "architecture": "Modular Monolith",
            "architecture_id": "arch-modular-monolith",
            "tags": tags or ["ai-agent", "database-enabled"],
        }
        res = requests.post(url, json=payload, headers=self._get_headers(), timeout=10)
        res.raise_for_status()
        return res.json().get("data", {})

    def configure_project_database(self, project_id: str, db_config: Dict[str, Any]) -> Dict[str, Any]:
        """Step 5b: Configure Database Connection and metadata on the project."""
        url = f"{self.api_v1}/projects/{project_id}"
        payload = {
            "requirements": [
                f"Database Type: {db_config.get('engine', 'postgresql')}",
                f"Connection Host: {db_config.get('host', 'db.loft.internal')}",
                f"Connection Port: {db_config.get('port', 5432)}",
                f"Database Name: {db_config.get('database_name', 'loft_realestate_db')}",
                f"Connection Pooling: {db_config.get('pool_size', 20)} connections",
                f"SSL Mode: {db_config.get('sslmode', 'require')}",
                f"Migrations Engine: {db_config.get('migrations', 'alembic')}",
            ],
            "tags": [
                "ai-agent",
                f"db:{db_config.get('engine', 'postgresql')}",
                "pool:configured",
                "env:production",
            ],
        }
        res = requests.put(url, json=payload, headers=self._get_headers(), timeout=10)
        res.raise_for_status()
        return res.json().get("data", {})

    def validate_architecture(self, architecture_id: str, component_ids: list[str], rule_ids: list[str]) -> Dict[str, Any]:
        """Step 6: Validate dependencies and Golden Rules."""
        url = f"{self.api_v1}/blueprints/validate-config"
        payload = {
            "architecture_id": architecture_id,
            "component_ids": component_ids,
            "rule_ids": rule_ids,
        }
        res = requests.post(url, json=payload, headers=self._get_headers(), timeout=10)
        res.raise_for_status()
        return res.json().get("data", {})

    def create_version_snapshot(self, project_id: str, version: str, changelog: str) -> Dict[str, Any]:
        """Step 7: Create immutable SemVer version snapshot."""
        url = f"{self.api_v1}/projects/{project_id}/versions"
        payload = {"version": version, "changelog": changelog}
        res = requests.post(url, json=payload, headers=self._get_headers(), timeout=10)
        res.raise_for_status()
        return res.json().get("data", {})


def run_ai_agent_pipeline():
    print("=" * 80)
    print(" 🤖 OLIVELAS APP BUILDER ENGINE — WORKFLOW DE INTEGRAÇÃO DE AGENTE DE IA")
    print("=" * 80)

    client = AIAgentClient()

    # Step 1: Health check
    print("\n[Etapa 1/7] 🔍 Verificando Health Check da Plataforma...")
    health = client.check_health()
    print(f"   ✅ Plataforma Ativa: {health.get('app')} v{health.get('version')} ({health.get('status')})")

    # Step 2: Authentication
    print("\n[Etapa 2/7] 🔐 Autenticando Agente de IA via IAM e Extraindo Token JWT...")
    auth_data = client.authenticate()
    token_preview = client.access_token[:30] + "..." if client.access_token else "N/A"
    print(f"   ✅ Autenticação bem-sucedida!")
    print(f"   🔑 JWT Bearer Token: {token_preview}")
    print(f"   👤 Usuário Ativo: {auth_data.get('user', {}).get('name')} ({auth_data.get('user', {}).get('role')})")
    print(f"   ⏱️  Expiração do Token: {auth_data.get('expires_in')} segundos")

    # Step 2b: Token introspection
    me = client.get_current_user()
    print(f"   🛡️  Permissões RBAC Carregadas: {len(me.get('permissions', []))} permissões")

    # Step 3: Catalog discovery
    print("\n[Etapa 3/7] 📚 Explorando Catálogo de Blocos Construtivos e Golden Rules...")
    catalog = client.discover_catalog()
    print(f"   • Componentes de Engenharia: {catalog['components_count']}")
    print(f"   • Regras Arquiteturais:       {catalog['rules_count']}")
    print(f"   • Padrões de Arquitetura:     {catalog['architectures_count']}")

    # Step 4: AI Blueprint composition
    print("\n[Etapa 4/7] 🧠 Solicitando Composição de Blueprint via AI Engine...")
    requirements = [
        "Autenticação segura via JWT e RBAC",
        "Conexão com Banco de Dados PostgreSQL de alta performance",
        "Pool de conexões assíncrono com SQLAlchemy e Alembic migrations",
        "Tabela de propostas imobiliárias com filtros e paginação",
        "Golden Rules de segurança e envelope de API padronizado",
    ]
    blueprint = client.compose_blueprint(
        name="Olivelas Portal Imobiliário com PostgreSQL",
        description="Aplicação corporativa com banco relacional e esteira de crédito",
        requirements=requirements,
    )
    print(f"   ✅ Blueprint Composto: ID {blueprint.get('blueprint_id')}")
    print(f"   🏛️  Arquitetura Mapeada: {blueprint.get('architecture')}")
    print(f"   📦 Módulos: {len(blueprint.get('identified_modules', []))}")
    print(f"   🎨 Componentes UI: {len(blueprint.get('identified_components', []))}")
    print(f"   🛡️  Regras Canônicas: {len(blueprint.get('identified_rules', []))}")

    # Step 5: Project creation & Database Configuration
    print("\n[Etapa 5/7] 🏗️  Criando Projeto e Configurando Conexão de Banco de Dados...")
    project = client.create_project(
        name="Portal Imobiliário Enterprise",
        description="Portal de intermediação imobiliária e gestão de garantias locatícias",
        blueprint_id=blueprint.get("blueprint_id"),
        tags=["ai-generated", "database:postgresql", "tier-1"],
    )
    project_id = project["id"]
    print(f"   ✅ Projeto Criado com Sucesso! ID: {project_id}")

    db_config = {
        "engine": "postgresql",
        "host": "db.loft.internal",
        "port": 5432,
        "database_name": "loft_realestate_db",
        "pool_size": 25,
        "sslmode": "require",
        "migrations": "alembic",
    }
    updated_project = client.configure_project_database(project_id, db_config)
    print(f"   ✅ Conexão com Banco de Dados Configurada no Projeto:")
    print(f"      • Engine: {db_config['engine'].upper()} (Host: {db_config['host']}:{db_config['port']})")
    print(f"      • Database Name: {db_config['database_name']}")
    print(f"      • Pool Size: {db_config['pool_size']} conexões simultâneas")
    print(f"      • Migrações: {db_config['migrations']}")

    # Step 6: Architecture & Diagnostic Validation
    print("\n[Etapa 6/7] 🔍 Executando Validação de Regras Arquiteturais e Dependências...")
    validation = client.validate_architecture(
        architecture_id=project.get("architecture_id", "arch-modular-monolith"),
        component_ids=blueprint.get("identified_components", [])[:5],
        rule_ids=blueprint.get("identified_rules", [])[:5],
    )
    is_valid = validation.get("status") == "ready" or validation.get("can_publish", True)
    print(f"   • Status da Validação: {'✅ APROVADO' if is_valid else '⚠️ ALERTAS DETECTADOS'}")
    print(f"   • Diagnósticos Críticos: {validation.get('critical_count', 0)}")
    print(f"   • Alertas: {validation.get('warning_count', 0)}")

    # Step 7: SemVer release snapshot
    print("\n[Etapa 7/7] 🏷️  Gerando Snapshot de Versão (SemVer v1.0.0)...")
    snapshot = client.create_version_snapshot(
        project_id=project_id,
        version="1.0.0",
        changelog="Release inicial automatizada pelo Agente de IA com suporte a PostgreSQL",
    )
    print(f"   ✅ Snapshot Criado: v{snapshot.get('version')} por {snapshot.get('created_by')}")
    print(f"   📅 Timestamp: {snapshot.get('created_at')}")

    print("\n" + "=" * 80)
    print(" 🎉 PIPELINE DE INTEGRAÇÃO DO AGENTE DE IA CONCLUÍDO COM SUCESSO!")
    print("=" * 80)


if __name__ == "__main__":
    run_ai_agent_pipeline()
