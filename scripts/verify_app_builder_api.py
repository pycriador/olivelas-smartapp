#!/usr/bin/env python3
"""
Automated Verification Suite for App Builder Engine API & Client SDK.
Tests all endpoints directly against the live server or TestClient.
"""
from __future__ import annotations
import os
import sys
import tempfile
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from api_client import AppBuilderClient
from api_client.scaffolder import ApplicationScaffolder


def run_tests():
    print("🧪 Executando suíte de testes de integração do SDK `api_client`...")
    api_url = os.getenv("APP_BUILDER_BASE_URL", "http://127.0.0.1:8000")
    client = AppBuilderClient(base_url=api_url)

    # 1. Health
    print("   [TEST 1] Health check...")
    health = client.health_check()
    assert health is not None, "Health check failed"
    print("   ✅ Health check OK")

    # 2. IAM Login
    print("   [TEST 2] Auth login...")
    admin_user = os.getenv("LOFT_ADMIN_USER", "admin@loft.com.br")
    admin_pass = os.getenv("LOFT_ADMIN_PASSWORD") or os.getenv("DEFAULT_ADMIN_PASSWORD", "admin_dev_pass")
    login_res = client.auth.login(admin_user, admin_pass)
    assert login_res.access_token, "No access token returned"
    print("   ✅ Login OK")

    # 3. AI Gateway
    print("   [TEST 3] AI Compose Blueprint...")
    bp = client.ai.compose_blueprint(
        name="App Teste Automatizado",
        description="Geração de teste",
        requirements=["Autenticação", "CRUD de Contratos"],
    )
    assert bp.blueprint_id, "No blueprint ID returned"
    assert len(bp.resolved_modules) > 0, "No modules resolved"
    print(f"   ✅ AI Compose OK (Blueprint ID: {bp.blueprint_id})")

    # 4. Catalog
    print("   [TEST 4] Catalog queries...")
    comps = client.catalog.list_components()
    rules = client.catalog.list_rules()
    tpls = client.catalog.list_templates()
    archs = client.catalog.list_architectures()
    assert len(comps) > 0, "Components catalog empty"
    assert len(rules) > 0, "Rules catalog empty"
    assert len(tpls) > 0, "Templates catalog empty"
    assert len(archs) > 0, "Architectures catalog empty"
    print(f"   ✅ Catalog OK ({len(comps)} components, {len(rules)} rules, {len(tpls)} templates)")

    # 5. Scaffolder in temp directory
    print("   [TEST 5] Fullstack Scaffolder...")
    with tempfile.TemporaryDirectory() as tmp_dir:
        scaffolder = ApplicationScaffolder(target_dir=tmp_dir)
        res = scaffolder.scaffold(blueprint=bp, app_name="App Teste Temp")
        assert res["status"] == "success"
        assert res["files_created_count"] > 15
        assert (Path(tmp_dir) / "backend" / "app" / "main.py").exists()
        assert (Path(tmp_dir) / "frontend" / "package.json").exists()
        assert (Path(tmp_dir) / "README.md").exists()
        print(f"   ✅ Scaffolder OK ({res['files_created_count']} files created in tempdir)")

    print("\n🎉 TODOS OS 5 TESTES DO SDK PASSARAM COM SUCESSO!\n")


if __name__ == "__main__":
    run_tests()
