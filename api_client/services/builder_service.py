"""
Project Builder Service Client (The Brain).
Compiles high-level requirements into Technical Implementation Blueprints.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from api_client.http_client import HttpClient
from api_client.models import GeneratePlanRequest, ProjectBlueprintResponse


class BuilderService:
    """Project Builder Engine service client."""

    def __init__(self, http: HttpClient) -> None:
        self.http = http

    def generate_plan(
        self,
        project_name: str,
        description: str,
        features: Optional[List[str]] = None,
        target_type: str = "fullstack",
        has_ai_capabilities: bool = True,
        has_authentication: bool = True,
        template_id: Optional[str] = None,
        architecture_id: Optional[str] = None,
    ) -> ProjectBlueprintResponse:
        """
        Submits application specifications to the Project Builder Engine
        to generate a complete blueprint with code templates, API contracts,
        agent prompts, folder trees, and implementation steps.
        """
        payload = {
            "project_name": project_name,
            "description": description,
            "target_type": target_type,
            "features": features or [],
            "has_ai_capabilities": has_ai_capabilities,
            "has_authentication": has_authentication,
            "template_id": template_id,
            "architecture_id": architecture_id,
        }
        res = self.http.post("builder/generate-plan", json_data=payload, unwrap_data=False)
        return ProjectBlueprintResponse.from_dict(res)
