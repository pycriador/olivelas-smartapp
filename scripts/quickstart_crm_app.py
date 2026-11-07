#!/usr/bin/env python3
"""
Quickstart Script: 1-Click Generator for 'Olivelas CRM Customer 360'.
Calls the App Builder Engine API to automatically scaffold the Customer 360 application.
"""
from __future__ import annotations
import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from api_client import AppBuilderClient
from api_client.scaffolder import ApplicationScaffolder


def main():
    print("🚀 Gerando 'Olivelas CRM & Customer 360' 100% via API do App Builder Engine...")
    
    api_url = os.getenv("APP_BUILDER_BASE_URL", "http://127.0.0.1:8000")
    client = AppBuilderClient(base_url=api_url)

    app_name = "Olivelas CRM 360"
    app_desc = "Plataforma de visualização e gestão de clientes enterprise, histórico de locações, contratos ativos e pontuação financeira."
    requirements = [
        "Visualização 360° do cliente",
        "Tabela de Clientes e Propostas com paginação canônica",
        "Painel de métricas com volume transacionado",
        "Tokens Olivelas Brand Orange (#FF774A) e Copan Design System",
        "Backend FastAPI com SQLite e validação Pydantic v2",
    ]

    # 1. Compose via AI Gateway
    print("📡 1. Solicitando composição à API do App Builder...")
    blueprint = client.ai.compose_blueprint(
        name=app_name,
        description=app_desc,
        requirements=requirements,
        domain="CRM & Vendas",
    )

    # 2. Register project
    print("📦 2. Registrando projeto na plataforma...")
    try:
        project = client.projects.create_project(
            name=app_name,
            description=app_desc,
            template_id="tpl_loft_customer_crm_360",
        )
        print(f"   Projeto criado com ID: {project.id}")
    except Exception as e:
        print(f"   Registro: {e}")

    # 3. Scaffold files
    output_dir = REPO_ROOT / "generated_apps" / "loft-crm-360"
    print(f"🏗️  3. Gerando arquivos em {output_dir}...")
    scaffolder = ApplicationScaffolder(target_dir=output_dir)
    res = scaffolder.scaffold(blueprint=blueprint, app_name=app_name, description=app_desc)

    print(f"\n✅ Aplicação '{app_name}' criada com sucesso ({res['files_created_count']} arquivos)!")
    print(f"📂 Diretório: {output_dir}")
    print(f"👉 Para rodar: cd {output_dir} && ./start_dev.sh")


if __name__ == "__main__":
    main()
