"""
AI Agent Gateway Service Client.
Connects to AI composition endpoints, semantic knowledge search, and building block catalogs.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from api_client.http_client import HttpClient
from api_client.models import (
    ApplicationMetaInput,
    AICompositionRequest,
    AICompositionResponse,
)


class AiAgentService:
    """AI Gateway for automated blueprint composition and intelligence retrieval."""

    def __init__(self, http: HttpClient) -> None:
        self.http = http

    def compose_blueprint(
        self,
        name: str,
        description: str = "",
        requirements: Optional[List[str]] = None,
        domain: str = "Real Estate Fintech",
        preferences: Optional[Dict[str, Any]] = None,
    ) -> AICompositionResponse:
        """
        Submits application requirements to the AI Agent Gateway to synthesize
        a complete blueprint with resolved modules, components, rules, and contracts.
        """
        payload = {
            "application": {
                "name": name,
                "description": description,
                "domain": domain,
            },
            "requirements": requirements or [],
            "preferences": preferences or {},
        }
        res = self.http.post("ai/blueprints/compose", json_data=payload)
        return AICompositionResponse.from_dict(res)

    def search_knowledge(self, query: str, category: Optional[str] = None, limit: int = 10) -> List[Dict[str, Any]]:
        """Perform semantic search across Loft engineering specifications, rules, and components."""
        payload = {"query": query, "category": category, "limit": limit}
        res = self.http.post("ai/search", json_data=payload)
        if isinstance(res, list):
            return res
        return res.get("results", []) if isinstance(res, dict) else []

    def get_components(self, category: Optional[str] = None, type_filter: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve reusable UI and backend components catalog."""
        params = {"category": category, "type": type_filter}
        res = self.http.get("ai/components", params=params)
        return res if isinstance(res, list) else []

    def get_templates(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve canonical application templates."""
        params = {"category": category}
        res = self.http.get("ai/templates", params=params)
        return res if isinstance(res, list) else []

    def get_rules(self, category: Optional[str] = None, priority: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve engineering golden rules."""
        params = {"category": category, "priority": priority}
        res = self.http.get("ai/rules", params=params)
        return res if isinstance(res, list) else []

    def get_architectures(self) -> List[Dict[str, Any]]:
        """Retrieve canonical architecture patterns."""
        res = self.http.get("ai/architectures")
        return res if isinstance(res, list) else []

    def get_specifications(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve SDD specifications."""
        params = {"category": category}
        res = self.http.get("ai/specifications", params=params)
        return res if isinstance(res, list) else []
