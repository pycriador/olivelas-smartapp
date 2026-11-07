"""
Catalog & 360° Knowledge Graph Service Client.
Provides access to components, templates, modules, rules, architectures, specifications, and 360 relations.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from api_client.http_client import HttpClient


class CatalogService:
    """Queries and manages building block catalogs and 360 knowledge graph relations."""

    def __init__(self, http: HttpClient) -> None:
        self.http = http

    # 360 Graph
    def get_relations_360(self, entity_type: str, entity_id: str) -> Dict[str, Any]:
        """Fetch 360° Knowledge Graph relations for any entity."""
        return self.http.get(f"relations/{entity_type}/{entity_id}")

    # Components
    def list_components(
        self,
        category: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """List building block components from catalog."""
        params = {k: v for k, v in {"category": category, "status": status, "search": search}.items() if v}
        res = self.http.get("components", params=params or None)
        return res if isinstance(res, list) else []

    def get_component(self, component_id: str) -> Dict[str, Any]:
        """Get component details including props contract, preview code, and rules."""
        return self.http.get(f"components/{component_id}")

    # Templates
    def list_templates(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """List application templates."""
        params = {"category": category} if category else None
        res = self.http.get("templates", params=params)
        return res if isinstance(res, list) else []


    def get_template(self, template_id: str) -> Dict[str, Any]:
        """Get template details."""
        return self.http.get(f"templates/{template_id}")

    # Modules
    def list_modules(self) -> List[Dict[str, Any]]:
        """List domain modules."""
        res = self.http.get("modules")
        return res if isinstance(res, list) else []

    def get_module(self, module_id: str) -> Dict[str, Any]:
        """Get module details."""
        return self.http.get(f"modules/{module_id}")

    # Rules
    def list_rules(self, category: Optional[str] = None, priority: Optional[str] = None) -> List[Dict[str, Any]]:
        """List engineering golden rules with good vs bad examples."""
        params = {k: v for k, v in {"category": category, "priority": priority}.items() if v}
        res = self.http.get("rules", params=params or None)
        return res if isinstance(res, list) else []

    def get_rule(self, rule_id: str) -> Dict[str, Any]:
        """Get rule details."""
        return self.http.get(f"rules/{rule_id}")

    # Architectures
    def list_architectures(self) -> List[Dict[str, Any]]:
        """List canonical architecture patterns."""
        res = self.http.get("architectures")
        return res if isinstance(res, list) else []

    def get_architecture(self, architecture_id: str) -> Dict[str, Any]:
        """Get architecture details."""
        return self.http.get(f"architectures/{architecture_id}")

    # Specifications
    def list_specifications(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """List SDD specifications."""
        params = {"category": category} if category else None
        res = self.http.get("specifications", params=params)
        return res if isinstance(res, list) else []

    def get_specification(self, spec_id: str) -> Dict[str, Any]:
        """Get specification content."""
        return self.http.get(f"specifications/{spec_id}")

