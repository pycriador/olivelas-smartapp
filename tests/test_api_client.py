import pytest
import tempfile
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
APP_ENGINE_DIR = REPO_ROOT / "app_builder_engine"
if str(APP_ENGINE_DIR) not in sys.path:
    sys.path.insert(0, str(APP_ENGINE_DIR))
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from fastapi.testclient import TestClient
from app.main import app
from api_client.config import ApiClientConfig
from api_client.client import AppBuilderClient

from api_client.scaffolder import ApplicationScaffolder
from api_client.models import AICompositionResponse, ApplicationMetaInput

fastapi_test_client = TestClient(app)


class MockHttpAdapter:
    """Adapts HttpClient requests to FastAPI TestClient for in-memory testing."""

    def __init__(self, test_client: TestClient) -> None:
        self.test_client = test_client
        self.config = ApiClientConfig()

    def _clean_params(self, params):
        if not params:
            return None
        cleaned = {k: v for k, v in params.items() if v is not None and v != ""}
        return cleaned or None

    def get(self, endpoint: str, params=None, use_root: bool = False, unwrap_data: bool = True):
        path = f"/{endpoint}" if use_root else f"/api/v1/{endpoint}"
        resp = self.test_client.get(path, params=self._clean_params(params))
        json_data = resp.json()
        if unwrap_data and isinstance(json_data, dict) and "data" in json_data:
            return json_data["data"]
        return json_data

    def post(self, endpoint: str, json_data=None, params=None, use_root: bool = False, unwrap_data: bool = True):
        path = f"/{endpoint}" if use_root else f"/api/v1/{endpoint}"
        resp = self.test_client.post(path, json=json_data, params=self._clean_params(params))
        json_data = resp.json()
        if unwrap_data and isinstance(json_data, dict) and "data" in json_data:
            return json_data["data"]
        return json_data

    def put(self, endpoint: str, json_data=None, params=None, use_root: bool = False, unwrap_data: bool = True):
        path = f"/{endpoint}" if use_root else f"/api/v1/{endpoint}"
        resp = self.test_client.put(path, json=json_data, params=self._clean_params(params))
        json_data = resp.json()
        if unwrap_data and isinstance(json_data, dict) and "data" in json_data:
            return json_data["data"]
        return json_data

    def delete(self, endpoint: str, params=None, use_root: bool = False, unwrap_data: bool = True):
        path = f"/{endpoint}" if use_root else f"/api/v1/{endpoint}"
        resp = self.test_client.delete(path, params=self._clean_params(params))
        return resp.json() if resp.text else None



def test_api_client_with_testclient():
    client = AppBuilderClient()
    client.http = MockHttpAdapter(fastapi_test_client)
    # Re-link sub-services with mock http
    client.auth.http = client.http
    client.ai.http = client.http
    client.builder.http = client.http
    client.projects.http = client.http
    client.blueprints.http = client.http
    client.catalog.http = client.http
    client.audit.http = client.http
    client.settings.http = client.http

    # 1. Health check
    health = client.health_check()
    assert health["status"] == "healthy"

    # 2. IAM Login
    import os
    admin_user = os.getenv("LOFT_ADMIN_USER", "admin@olivelas.com.br")
    admin_password = os.getenv("LOFT_ADMIN_PASSWORD", "test_admin_pass")
    login = client.auth.login(admin_user, admin_password)
    assert login.access_token is not None

    # 3. AI Blueprint Composition
    blueprint = client.ai.compose_blueprint(
        name="Olivelas Teste App",
        description="Aplicação de teste",
        requirements=["Autenticação JWT", "Tabela de Propostas", "App Switcher Copan"],
    )
    assert blueprint.blueprint_id is not None
    assert len(blueprint.resolved_modules) > 0

    # 4. Catalog
    components = client.catalog.list_components()
    assert len(components) > 0
    rules = client.catalog.list_rules()
    assert len(rules) > 0

    # 5. Project Registration
    project = client.projects.create_project(
        name="Olivelas Teste App",
        description="Aplicação de teste",
        template_id="tpl_loft_partner_portal",
    )
    assert project.id is not None

    # 6. Scaffolding in Temporary Directory
    with tempfile.TemporaryDirectory() as tmp_dir:
        scaffolder = ApplicationScaffolder(target_dir=tmp_dir)
        summary = scaffolder.scaffold(blueprint=blueprint, app_name="Olivelas Teste App")

        assert summary["status"] == "success"
        assert summary["files_created_count"] >= 15
        assert (Path(tmp_dir) / "backend" / "app" / "main.py").exists()
        assert (Path(tmp_dir) / "frontend" / "package.json").exists()
        assert (Path(tmp_dir) / "README.md").exists()
        assert (Path(tmp_dir) / "start_dev.sh").exists()
