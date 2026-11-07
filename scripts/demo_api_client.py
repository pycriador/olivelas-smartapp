#!/usr/bin/env python3
"""
Comprehensive Demonstration of the App Builder Engine Python SDK (api_client).
Exercises all sub-services: Health Check, Auth/IAM, AI Gateway, Catalog, 360 Graph,
Blueprints, Validation, Projects, and Audit Trail.
"""
from __future__ import annotations
import json
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from api_client import AppBuilderClient, ApiClientConfig


def main():
    print("=" * 80)
    print(" 🛠️  DEMONSTRAÇÃO COMPLETA DO SDK PYTHON `api_client`")
    print("=" * 80)

    api_url = os.getenv("APP_BUILDER_BASE_URL", "http://127.0.0.1:8000")
    client = AppBuilderClient(base_url=api_url)

    # 1. Health Check
    print("\n1️⃣  [Health Check]")
    health = client.health_check()
    print(f"   Status: {health.get('status')} | Service: {health.get('service')}")

    # 2. Authentication (IAM)
    print("\n2️⃣  [IAM & Authentication]")
    try:
        admin_user = os.getenv("LOFT_ADMIN_USER", "admin@loft.com.br")
        admin_pass = os.getenv("LOFT_ADMIN_PASSWORD") or os.getenv("DEFAULT_ADMIN_PASSWORD", "admin_dev_pass")
        login_res = client.auth.login(admin_user, admin_pass)
        print(f"   ✅ Login efetuado com sucesso!")
        print(f"   Token: {login_res.access_token[:25]}... (Role: {login_res.user.get('role')})")
    except Exception as e:
        print(f"   ℹ️  Login info: {e}")

    # 3. Catalog Inspection
    print("\n3️⃣  [Catalog & Building Blocks]")
    comps = client.catalog.list_components()
    tpls = client.catalog.list_templates()
    rules = client.catalog.list_rules()
    archs = client.catalog.list_architectures()
    print(f"   • Componentes Reutilizáveis: {len(comps)}")
    print(f"   • Templates Empresariais:   {len(tpls)}")
    print(f"   • Golden Rules:             {len(rules)}")
    print(f"   • Padrões Arquiteturais:    {len(archs)}")

    # 4. 360 Knowledge Graph
    print("\n4️⃣  [360° Knowledge Graph Relations]")
    if comps:
        first_comp = comps[0]["id"]
        try:
            rel = client.catalog.get_relations_360("component", first_comp)
            print(f"   Grafo 360° para '{first_comp}':")
            print(f"   • Regras associadas: {len(rel.get('rules', []))}")
            print(f"   • Especificações:    {len(rel.get('specifications', []))}")
        except Exception as e:
            print(f"   Relations: {e}")

    # 5. AI Blueprint Composition
    print("\n5️⃣  [AI Blueprint Composition]")
    blueprint = client.ai.compose_blueprint(
        name="Portal Fiança Demo",
        description="Aplicação de demonstração para esteira de locação",
        requirements=[
            "Autenticação JWT",
            "Tabela de propostas",
            "Filtro de busca em tempo real",
        ],
    )
    print(f"   ✅ Blueprint ID: {blueprint.blueprint_id}")
    print(f"   • Arquitetura: {blueprint.architecture_name}")
    print(f"   • Módulos:     {len(blueprint.resolved_modules)}")
    print(f"   • Componentes: {len(blueprint.resolved_components)}")
    print(f"   • Regras:      {len(blueprint.resolved_rules)}")

    # 6. Blueprint Validation
    print("\n6️⃣  [Blueprint Validation & Diagnostic]")
    val = client.blueprints.validate_config(
        components=["cmp_fe_app_shell", "cmp_fe_data_table"],
        rules=["rul_copan_01_brand_orange", "rul_loft_be_api_envelope"],
        architecture_id="arch_loft_standard_fullstack",
    )
    print(f"   • Validação: {'✅ VÁLIDO' if val.valid else '❌ INVÁLIDO'}")
    print(f"   • Alertas/Warnings: {len(val.warnings)}")

    # 7. Project Creation
    print("\n7️⃣  [Project Registration]")
    proj = client.projects.create_project(
        name="Projeto Demo SDK",
        description="Criado via script de demonstração do api_client",
        tags=["demo", "python-sdk"],
    )
    print(f"   ✅ Projeto criado: {proj.name} (ID: {proj.id})")

    # 8. Audit Trail
    print("\n8️⃣  [Universal Audit Trail]")
    logs = client.audit.list_logs(limit=3)
    print(f"   Últimos {len(logs)} eventos de auditoria:")
    for log in logs:
        print(f"   • [{log.get('timestamp', '')[:19]}] {log.get('actor')} -> {log.get('action')} ({log.get('resource')})")

    print("\n" + "=" * 80)
    print(" 🎉 DEMONSTRAÇÃO DO SDK CONCLUÍDA COM SUCESSO!")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
