"""
Unified App Builder Engine API Client SDK.
The primary developer entrypoint for interacting with the platform.
"""
from __future__ import annotations
import logging
from typing import Any, Dict, List, Optional, Union

from api_client.config import ApiClientConfig
from api_client.http_client import HttpClient
from api_client.models import (
    AICompositionResponse,
    ProjectBlueprintResponse,
    ProjectResponse,
    BlueprintResponse,
)
from api_client.services.auth_service import AuthService
from api_client.services.ai_agent_service import AiAgentService
from api_client.services.builder_service import BuilderService
from api_client.services.projects_service import ProjectsService
from api_client.services.blueprints_service import BlueprintsService
from api_client.services.catalog_service import CatalogService
from api_client.services.audit_service import AuditService
from api_client.services.settings_service import SettingsService

logger = logging.getLogger("AppBuilderClient")


class AppBuilderClient:
    """
    Main SDK Client for Loft App Builder Engine.
    
    Example:
        ```python
        from api_client import AppBuilderClient

        client = AppBuilderClient(base_url="http://127.0.0.1:8000")
        client.health_check()
        
        # 1. Compose application blueprint via AI Gateway
        blueprint = client.ai.compose_blueprint(
            name="Loft Fiança Aluguel",
            description="Portal de locação e esteira de garantia locatícia",
            requirements=[
                "Autenticação JWT e RBAC",
                "Tabela de propostas de fiança com status e filtros",
                "Formulário de cadastro de locatário com upload de holerite",
                "Integração com esteira de risco de crédito"
            ]
        )
        
        # 2. Register project and link blueprint
        project = client.projects.create_project(
            name="Loft Fiança Aluguel",
            description="Portal de locação e esteira de garantia locatícia",
            template_id="tpl_loft_partner_portal"
        )
        ```
    """

    def __init__(
        self,
        base_url: str = "http://127.0.0.1:8000",
        auth_token: Optional[str] = None,
        actor_email: str = "willian.jesus@loft.com.br",
        actor_role: str = "Global Admin",
        timeout_seconds: float = 60.0,
        config: Optional[ApiClientConfig] = None,
    ) -> None:
        if config is None:
            config = ApiClientConfig(
                base_url=base_url,
                auth_token=auth_token,
                actor_email=actor_email,
                actor_role=actor_role,
                timeout_seconds=timeout_seconds,
            )
        self.config = config
        self.http = HttpClient(self.config)

        # Initialize sub-services
        self.auth = AuthService(self.http)
        self.ai = AiAgentService(self.http)
        self.builder = BuilderService(self.http)
        self.projects = ProjectsService(self.http)
        self.blueprints = BlueprintsService(self.http)
        self.catalog = CatalogService(self.http)
        self.audit = AuditService(self.http)
        self.settings = SettingsService(self.http)

    def health_check(self) -> Dict[str, Any]:
        """Verify API health, database connection, and catalog status."""
        return self.http.get("health", use_root=True, unwrap_data=False)

    def ping(self) -> bool:
        """Quick boolean connectivity check."""
        try:
            res = self.health_check()
            return res.get("status") == "healthy" or res.get("status") == "ok" or "version" in res
        except Exception as e:
            logger.warning(f"Health check failed: {e}")
            return False

    def generate_full_application_plan(
        self,
        name: str,
        description: str,
        features: Optional[List[str]] = None,
        has_ai: bool = True,
        has_auth: bool = True,
        template_id: Optional[str] = None,
    ) -> ProjectBlueprintResponse:
        """
        Orchestrates full application plan generation using the Project Builder Engine.
        """
        return self.builder.generate_plan(
            project_name=name,
            description=description,
            features=features or [],
            has_ai_capabilities=has_ai,
            has_authentication=has_auth,
            template_id=template_id,
        )
