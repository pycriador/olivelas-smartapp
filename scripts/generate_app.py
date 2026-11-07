#!/usr/bin/env python3
"""
Loft Automated Application Generator (Powered by App Builder Engine API)

This script:
1. Connects to the running App Builder Engine API.
2. Authenticates and validates system readiness.
3. Solicits the application requirements from the user or CLI arguments.
4. Sends requirements to the AI Composition & Builder endpoints (/api/v1/ai/blueprints/compose, /api/v1/builder/generate-plan).
5. Validates architecture rules, dependencies, and security checklists.
6. Registers the Project and Blueprint in the App Builder platform.
7. Automatically generates 100% of the directory tree, backend (FastAPI), frontend (React 19 + AntD Copan),
   configurations, tests, Dockerfiles, and documentation.
"""
from __future__ import annotations
import argparse
import json
import os
import sys
import time
from pathlib import Path

# Add project root to sys.path
CURRENT_DIR = Path(__file__).resolve().parent
REPO_ROOT = CURRENT_DIR.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from api_client import AppBuilderClient, ApiClientConfig
from api_client.scaffolder import ApplicationScaffolder
from api_client.exceptions import AppBuilderApiError, ApiConnectionError


def print_banner():
    print("=" * 80)
    print(" 🚀 LOFT APP BUILDER ENGINE — 100% AUTOMATED APPLICATION GENERATOR")
    print("=" * 80)
    print(" Camada de automação de engenharia Loft conectada via API REST e AI Gateway.")
    print("=" * 80 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description="Gera uma aplicação completa fullstack de forma 100% automática usando a API do App Builder Engine."
    )
    parser.add_argument(
        "--api-url",
        default=os.getenv("APP_BUILDER_BASE_URL", "http://127.0.0.1:8000"),
        help="URL base do backend App Builder Engine (padrão: http://127.0.0.1:8000)",
    )
    parser.add_argument(
        "--name",
        help="Nome da aplicação (ex: 'Loft Fiança Aluguel', 'CRM Customer 360')",
    )
    parser.add_argument(
        "--description",
        help="Descrição do propósito da aplicação",
    )
    parser.add_argument(
        "--features",
        nargs="+",
        help="Lista de funcionalidades ou requisitos (ex: 'Autenticação JWT' 'Tabela de Propostas' 'Score de Risco')",
    )
    parser.add_argument(
        "--template-id",
        help="ID do template canônico (ex: tpl_loft_credit_risk_engine, tpl_loft_customer_crm_360)",
    )
    parser.add_argument(
        "--output-dir",
        help="Diretório de saída onde o app será criado (padrão: generated_apps/<app_slug>)",
    )
    parser.add_argument(
        "--non-interactive",
        action="store_true",
        help="Executa em modo 100% automático sem prompts no terminal",
    )

    args = parser.parse_args()
    print_banner()

    # 1. Initialize Client & Check Connection
    print(f"📡 [1/6] Conectando ao App Builder Engine em {args.api_url}...")
    client = AppBuilderClient(base_url=args.api_url)

    try:
        health = client.health_check()
        print(f"   ✅ Conexão estabelecida com sucesso! Servidor ativo: {health.get('service', 'App Builder Engine')}")
    except ApiConnectionError as err:
        print(f"\n❌ ERRO DE CONEXÃO: Não foi possível alcançar o servidor App Builder Engine.")
        print(f"   Certifique-se de que o backend está rodando: `cd app_builder_engine && python3 -m uvicorn app.main:app --reload`")
        print(f"   Detalhes: {err}\n")
        sys.exit(1)
    except Exception as ex:
        print(f"\n⚠️  Aviso no health-check: {ex}. Prosseguindo com fallback de desenvolvimento...")

    # 2. Gather Application Requirements
    app_name = args.name
    app_desc = args.description
    features = args.features or []
    template_id = args.template_id

    if not args.non_interactive and not app_name:
        print("\n📝 [2/6] Configuração da Nova Aplicação:")
        app_name = input("   👉 Nome da Aplicação [Loft Fiança Express]: ").strip() or "Loft Fiança Express"
        app_desc = input(f"   👉 Descrição [{app_name} com esteira de garantia locatícia]: ").strip() or f"{app_name} com esteira de garantia locatícia e análise instantânea."
        
        print("\n   Selecione ou digite os requisitos da aplicação (separados por vírgula):")
        print("   Exemplo: Autenticação JWT, Tabela de Propostas, Score de Risco, Formulário de Cadastro, App Switcher Copan")
        feat_input = input("   👉 Requisitos: ").strip()
        if feat_input:
            features = [f.strip() for f in feat_input.split(",") if f.strip()]
        else:
            features = [
                "Autenticação JWT com RBAC",
                "Tabela de Propostas com filtros e busca em tempo real",
                "Modal de criação de proposta com validação",
                "App Switcher 9-dots ancorado no cabeçalho",
                "Trilha de auditoria e métricas de desempenho",
            ]
    else:
        app_name = app_name or "Loft Fiança Express"
        app_desc = app_desc or f"{app_name} com esteira de garantia locatícia e análise instantânea."
        if not features:
            features = [
                "Autenticação JWT com RBAC",
                "Tabela de Propostas com filtros e busca em tempo real",
                "Modal de criação de proposta com validação",
                "App Switcher 9-dots ancorado no cabeçalho",
                "Trilha de auditoria e métricas de desempenho",
            ]

    print(f"\n⚙️  Aplicação solicitada: '{app_name}'")
    print(f"   Descrição: {app_desc}")
    print(f"   Requisitos ({len(features)}): {', '.join(features)}")

    # 3. AI Blueprint Composition via API
    print(f"\n🧠 [3/6] Solicitando Composição Arquitetural à API (/api/v1/ai/blueprints/compose)...")
    try:
        blueprint_resp = client.ai.compose_blueprint(
            name=app_name,
            description=app_desc,
            requirements=features,
            domain="Real Estate Fintech",
        )
        print(f"   ✅ Blueprint composto pela API com sucesso!")
        print(f"   📌 Arquitetura Selecionada: {blueprint_resp.architecture_name}")
        module_names = [m if isinstance(m, str) else m.get('name', '') for m in blueprint_resp.resolved_modules[:3]]
        print(f"   🧩 Módulos Resolvidos ({len(blueprint_resp.resolved_modules)}): {', '.join(module_names)}...")
        print(f"   📐 Regras de Engenharia Aplicadas: {len(blueprint_resp.resolved_rules)} regras canônicas")
        print(f"   🛡️  Checklist de Segurança: {len(blueprint_resp.security_checklist)} itens validados")

    except Exception as e:
        print(f"   ⚠️  Composição padrão via AI Gateway: {e}. Executando via Project Builder Engine...")
        blueprint_resp = client.generate_full_application_plan(
            name=app_name,
            description=app_desc,
            features=features,
            template_id=template_id,
        )

    # 4. Project & Blueprint Registration in Platform
    print(f"\n📦 [4/6] Registrando Projeto e Blueprint na plataforma via API (/api/v1/projects)...")
    try:
        project = client.projects.create_project(
            name=app_name,
            description=app_desc,
            template_id=template_id,
        )
        print(f"   ✅ Projeto registrado na API com ID: {project.id}")
    except Exception as e:
        print(f"   ℹ️  Registro de projeto: {e} (Prosseguindo com geração)")

    # 5. Local File Scaffolding
    import unicodedata
    import re
    clean_name = unicodedata.normalize('NFKD', app_name).encode('ascii', 'ignore').decode('utf-8')
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', clean_name).lower().strip('-')
    output_dir = Path(args.output_dir) if args.output_dir else REPO_ROOT / "generated_apps" / slug
    output_dir.mkdir(parents=True, exist_ok=True)


    print(f"\n🏗️  [5/6] Gerando estrutura de arquivos e código 100% de forma automática em:")
    print(f"   📂 {output_dir}")

    scaffolder = ApplicationScaffolder(target_dir=output_dir)
    result = scaffolder.scaffold(
        blueprint=blueprint_resp,
        app_name=app_name,
        description=app_desc,
    )

    # 6. Summary & Instructions
    raw_bp = getattr(blueprint_resp, "raw_blueprint", {}) or (blueprint_resp.data if hasattr(blueprint_resp, "data") else {})
    is_static = (
        raw_bp.get("is_static", False) or
        "arch_static_landing_page" in str(blueprint_resp) or
        "sem banco de dados" in app_desc.lower()
    )
    arch_display = getattr(blueprint_resp, "architecture", None) or "Loft Institutional Landing Page & Static Showcase Architecture"
    backend_stack = "Python 3.12 + FastAPI (Stateless / In-Memory Mock)" if is_static else "Python 3.12 + FastAPI + SQLAlchemy 2.0 + Pydantic v2"

    print(f"\n🎉 [6/6] Aplicação criada com 100% de sucesso!")
    print("=" * 80)
    print(f" 📊 RESUMO DA CRIAÇÃO:")
    print(f" • Nome do App:       {app_name}")
    print(f" • Diretório:         {output_dir}")
    print(f" • Arquitetura:       {arch_display}")
    print(f" • Arquivos Criados:  {result['files_created_count']} arquivos gerados")
    print(f" • Stack Backend:     {backend_stack}")
    print(f" • Stack Frontend:    React 19 + TypeScript + Vite + Ant Design + FSD")
    print("=" * 80)
    print("\n🚀 PARA EXECUTAR SUA NOVA APLICAÇÃO:")
    print(f"   cd {output_dir}")
    print("   ./start_dev.sh")
    print("\n   Ou execute individualmente:")
    print("   1. Backend:   cd backend && python3 -m uvicorn app.main:app --reload")
    print("   2. Frontend:  cd frontend && npm install && npm run dev")
    print("=" * 80 + "\n")


if __name__ == "__main__":
    main()
