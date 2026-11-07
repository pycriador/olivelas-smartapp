"""
Blueprint Management Service Client.
Handles composing, resolving dependencies, validating, and publishing blueprints.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from api_client.http_client import HttpClient
from api_client.models import (
    BlueprintBuildRequest,
    BlueprintResponse,
    ConfigValidationRequest,
    ConfigValidationResponse,
)


class BlueprintsService:
    """Manages application blueprints, validation, and lifecycle."""

    def __init__(self, http: HttpClient) -> None:
        self.http = http

    def list_blueprints(self, status: Optional[str] = None, project_id: Optional[str] = None) -> List[BlueprintResponse]:
        """List blueprints."""
        params = {"status": status, "project_id": project_id}
        res = self.http.get("blueprints", params=params)
        if isinstance(res, list):
            return [BlueprintResponse.from_dict(b) for b in res]
        return []

    def get_blueprint(self, blueprint_id: str) -> BlueprintResponse:
        """Get a blueprint by ID."""
        res = self.http.get(f"blueprints/{blueprint_id}")
        return BlueprintResponse.from_dict(res)

    def build_blueprint(
        self,
        name: str,
        description: str,
        architecture_id: str = "arch_loft_standard_fullstack",
        project_id: Optional[str] = None,
        template_id: Optional[str] = None,
        components: Optional[List[str]] = None,
        modules: Optional[List[str]] = None,
        rules: Optional[List[str]] = None,
        specifications: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
    ) -> BlueprintResponse:
        """Build and persist a new blueprint with resolved composition tree."""
        payload = {
            "name": name,
            "description": description,
            "architecture_id": architecture_id,
            "project_id": project_id,
            "template_id": template_id,
            "components": components or [],
            "modules": modules or [],
            "rules": rules or [],
            "specifications": specifications or [],
            "tags": tags or ["automated-blueprint"],
            "version": "1.0.0",
            "status": "Draft",
        }
        res = self.http.post("blueprints/build", json_data=payload)
        return BlueprintResponse.from_dict(res)

    def validate_config(
        self,
        components: Optional[List[str]] = None,
        modules: Optional[List[str]] = None,
        rules: Optional[List[str]] = None,
        architecture_id: Optional[str] = None,
    ) -> ConfigValidationResponse:
        """Validate component dependencies, architectural rules, and compatibility."""
        payload = {
            "components": components or [],
            "modules": modules or [],
            "rules": rules or [],
            "architecture_id": architecture_id,
        }
        res = self.http.post("blueprints/validate-config", json_data=payload)
        return ConfigValidationResponse.from_dict(res)

    def resolve_dependencies(
        self,
        components: Optional[List[str]] = None,
        modules: Optional[List[str]] = None,
    ) -> Dict[str, Any]:
        """Auto-resolve all transitive dependencies for selected components and modules."""
        payload = {
            "components": components or [],
            "modules": modules or [],
        }
        return self.http.post("blueprints/resolve-dependencies", json_data=payload)

    def publish_blueprint(self, blueprint_id: str) -> BlueprintResponse:
        """Publish a blueprint making it official and locked."""
        res = self.http.post(f"blueprints/{blueprint_id}/publish")
        return BlueprintResponse.from_dict(res)

    def download_blueprint_json(self, blueprint_id: str) -> Dict[str, Any]:
        """Download full raw JSON representation of a blueprint."""
        return self.http.get(f"blueprints/{blueprint_id}/download")
