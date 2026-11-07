#!/usr/bin/env python3
"""
Olivelas AI Application Generator with Complete API Tracing & Evidence Capture
"""
from __future__ import annotations
import json
import os
import sys
import time
from pathlib import Path
from typing import Any, Dict, List

import requests

CURRENT_DIR = Path(__file__).resolve().parent
REPO_ROOT = CURRENT_DIR.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from api_client.scaffolder import ApplicationScaffolder


def main():
    base_url = "http://127.0.0.1:8000/api/v1"
    evidence: List[Dict[str, Any]] = []

    def record_call(method: str, endpoint: str, payload: Any = None, headers: Dict[str, str] = None) -> Any:
        url = f"{base_url}{endpoint}"
        t0 = time.time()
        hdrs = headers or {}
        if method.upper() == "GET":
            res = requests.get(url, headers=hdrs)
        elif method.upper() == "POST":
            res = requests.post(url, json=payload, headers=hdrs)
        elif method.upper() == "PUT":
            res = requests.put(url, json=payload, headers=hdrs)
        elif method.upper() == "DELETE":
            res = requests.delete(url, headers=hdrs)
        else:
            raise ValueError(f"Unsupported method: {method}")
        duration_ms = round((time.time() - t0) * 1000, 2)

        try:
            res_json = res.json()
        except Exception:
            res_json = res.text

        sanitized_payload = payload.copy() if payload else None
        if sanitized_payload and "password" in sanitized_payload:
            sanitized_payload["password"] = "**************** (REDACTED_IAM_SECRET)"

        record = {
            "step": len(evidence) + 1,
            "method": method.upper(),
            "url": url,
            "endpoint": endpoint,
            "headers": {k: (v if k.lower() != "authorization" else "Bearer ***[REDACTED_JWT]***") for k, v in hdrs.items()},
            "request_payload": sanitized_payload,
            "response_status": res.status_code,
            "duration_ms": duration_ms,
            "response_json": res_json,
        }
        evidence.append(record)
        return res_json

    print("🚀 [Step 1/7] Authenticating with Olivelas IAM API...")
    admin_user = os.getenv("LOFT_ADMIN_USER", "admin@olivelas.com.br")
    admin_password = os.getenv("LOFT_ADMIN_PASSWORD") or os.getenv("DEFAULT_ADMIN_PASSWORD", "admin_dev_pass")
    login_resp = record_call("POST", "/iam/login", {
        "username_or_email": admin_user,
        "password": admin_password
    })
    token = login_resp["data"]["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    print("📊 [Step 2/7] Querying Platform Catalog & Golden Rules...")
    record_call("GET", "/dashboard/metrics", headers=auth_headers)
    record_call("GET", "/components", headers=auth_headers)
    record_call("GET", "/modules", headers=auth_headers)
    record_call("GET", "/architectures", headers=auth_headers)
    record_call("GET", "/rules", headers=auth_headers)
    record_call("GET", "/specifications", headers=auth_headers)
    record_call("GET", "/ai/agents", headers=auth_headers)

    print("🧠 [Step 3/7] Sending Requirements to AI Composition Engine...")
    app_name = "Olivelas AI Copilot Support"
    app_desc = "Página de chatbot sem banco de dados, somente mock, com design padrão Olivelas Copan"
    features = [
        "Chatbot com IA",
        "Histórico de Mensagens",
        "Respostas Rápidas",
        "Design System Copan",
        "Sem Banco de Dados Mock"
    ]

    compose_payload = {
        "application": {
            "name": app_name,
            "description": app_desc
        },
        "requirements": features,
        "generate_ai_rationale": True,
    }
    compose_resp = record_call("POST", "/ai/blueprints/compose", compose_payload, headers=auth_headers)
    
    arch_id = compose_resp["architecture"]
    identified_modules = compose_resp["identified_modules"]
    identified_components = compose_resp["identified_components"]
    identified_rules = compose_resp["identified_rules"]
    identified_templates = compose_resp["identified_templates"]

    print(f"   💡 Blueprint ID: {compose_resp['blueprint_id']}")
    print(f"   🏛️  Arquitetura Selecionada: {arch_id}")
    print(f"   📦 Módulos Identificados: {len(identified_modules)} módulos")
    print(f"   🎨 Componentes UI Identificados: {len(identified_components)} componentes")
    print(f"   🛡️  Regras Canônicas Mapeadas: {len(identified_rules)} regras")
    print(f"   🤖 AI Reasoning: {compose_resp.get('ai_reasoning')}")

    print("📝 [Step 4/7] Generating Build Plan...")
    plan_payload = {
        "app_name": app_name,
        "description": app_desc,
        "target_architecture": arch_id,
        "modules": identified_modules,
        "components": identified_components,
        "database_type": "in_memory",
        "use_authentication": True,
        "use_ai_copilot": True,
    }
    record_call("POST", "/builder/generate-plan", plan_payload, headers=auth_headers)

    print("💾 [Step 5/7] Registering Project in SQLite Database...")
    template_id = identified_templates[0] if identified_templates else "tpl_loft_ai_support_chatbot"
    project_payload = {
        "name": app_name,
        "slug": "loft-ai-copilot-support",
        "description": app_desc,
        "template_id": template_id,
        "architecture": arch_id,
        "status": "Active",
        "config": {
            "modules": identified_modules,
            "components": identified_components,
            "rules": identified_rules,
            "database_type": "in_memory",
        }
    }
    proj_resp = record_call("POST", "/projects", project_payload, headers=auth_headers)
    project_id = proj_resp["data"]["id"]

    print("🔍 [Step 6/7] Querying Registered Project & Permission Matrix...")
    record_call("GET", f"/projects/{project_id}", headers=auth_headers)
    record_call("GET", "/iam/permissions", headers=auth_headers)

    print("⚙️  [Step 7/7] Scaffolding Application Codebase via Generator...")
    output_dir = REPO_ROOT / "generated_apps" / "loft_ai_copilot_support"
    scaffolder = ApplicationScaffolder(target_dir=output_dir)

    result = scaffolder.scaffold(
        blueprint=compose_resp,
        app_name=app_name,
        description=app_desc,
    )
    print(f"   ✅ Arquivos gerados com sucesso em {output_dir}")
    print(f"   📁 Total de arquivos gerados: {result.get('total_files', 'N/A')}")

    evidence_path = REPO_ROOT / "generated_apps" / "api_evidence_chatbot_app.json"
    evidence_path.parent.mkdir(parents=True, exist_ok=True)
    with open(evidence_path, "w", encoding="utf-8") as f:
        json.dump(evidence, f, indent=2, ensure_ascii=False)
    print(f"   📄 Evidências salvas em: {evidence_path}")


if __name__ == "__main__":
    main()
