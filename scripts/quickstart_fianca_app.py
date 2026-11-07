#!/usr/bin/env python3
"""
Quickstart Script: 1-Click Generator for 'Loft Fiança Aluguel & Garantia Locatícia'.
Calls the App Builder Engine API to automatically scaffold the canonical rental guarantee portal.
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
    print("🚀 Gerando 'Loft Fiança Aluguel' 100% via API do App Builder Engine...")
    
    api_url = os.getenv("APP_BUILDER_BASE_URL", "http://127.0.0.1:8000")
    client = AppBuilderClient(base_url=api_url)

    app_name = "Loft Fiança Aluguel"
    app_desc = "Portal oficial de garantia locatícia, esteira de análise de crédito instantânea e gestão de contratos para imobiliárias parceiras."
    requirements = [
        "Autenticação JWT e RBAC para imobiliárias e corretores parceiros",
        "Tabela de Propostas com busca em tempo real, status e filtros avançados",
        "Score de Risco automatizado para locatários",
        "Formulário modal de submissão de proposta com validação",
        "App Switcher 9-pontos ancorado na barra superior",
        "Design System Copan com Brand Orange (#FF774A) e tokens Ant Design",
    ]

    # 1. Compose via AI Gateway
    print("📡 1. Solicitando composição à API do App Builder...")
    blueprint = client.ai.compose_blueprint(
        name=app_name,
        description=app_desc,
        requirements=requirements,
        domain="Real Estate Fintech",
    )

    # 2. Register project
    print("📦 2. Registrando projeto na plataforma...")
    try:
        project = client.projects.create_project(
            name=app_name,
            description=app_desc,
            template_id="tpl_loft_credit_risk_engine",
        )
        print(f"   Projeto criado com ID: {project.id}")
    except Exception as e:
        print(f"   Registro: {e}")

    # 3. Scaffold files
    output_dir = REPO_ROOT / "generated_apps" / "loft-fianca-aluguel"
    print(f"🏗️  3. Gerando arquivos em {output_dir}...")
    scaffolder = ApplicationScaffolder(target_dir=output_dir)
    res = scaffolder.scaffold(blueprint=blueprint, app_name=app_name, description=app_desc)

    print(f"\n✅ Aplicação '{app_name}' criada com sucesso ({res['files_created_count']} arquivos)!")
    print(f"📂 Diretório: {output_dir}")
    print(f"👉 Para rodar: cd {output_dir} && ./start_dev.sh")


if __name__ == "__main__":
    main()
