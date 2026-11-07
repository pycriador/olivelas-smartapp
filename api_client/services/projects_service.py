"""
Projects Management Service Client.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from api_client.http_client import HttpClient
from api_client.models import ProjectCreate, ProjectResponse


class ProjectsService:
    """Manages workspace projects in the App Builder Engine."""

    def __init__(self, http: HttpClient) -> None:
        self.http = http

    def list_projects(
        self,
        status: Optional[str] = None,
        search: Optional[str] = None,
        template_id: Optional[str] = None,
    ) -> List[ProjectResponse]:
        """List all projects registered in the App Builder Engine."""
        params = {"status": status, "search": search, "template_id": template_id}
        res = self.http.get("projects", params=params)
        if isinstance(res, list):
            return [ProjectResponse.from_dict(p) for p in res]
        return []

    def get_project(self, project_id: str) -> ProjectResponse:
        """Get details of a project by ID."""
        res = self.http.get(f"projects/{project_id}")
        return ProjectResponse.from_dict(res)

    def create_project(
        self,
        name: str,
        description: str = "",
        domain: str = "Core Engineering",
        architecture: str = "Modular Monolith",
        architecture_id: str = "arch-modular-monolith",
        owner: Optional[str] = None,
        tags: Optional[List[str]] = None,
        template_id: Optional[str] = None,
    ) -> ProjectResponse:
        """Create a new project in the App Builder Engine."""
        payload = {
            "name": name,
            "description": description or "",
            "domain": domain,
            "owner": owner or self.http.config.actor_email or "willian.jesus@loft.com.br",
            "architecture": architecture,
            "architecture_id": architecture_id or "arch-modular-monolith",
            "tags": tags or ["loft-app", "automated-scaffold"],
        }
        res = self.http.post("projects", json_data=payload)
        return ProjectResponse.from_dict(res)


    def update_project(self, project_id: str, updates: Dict[str, Any]) -> ProjectResponse:
        """Update an existing project's metadata."""
        res = self.http.put(f"projects/{project_id}", json_data=updates)
        return ProjectResponse.from_dict(res)

    def archive_project(self, project_id: str) -> ProjectResponse:
        """Archive a project."""
        res = self.http.post(f"projects/{project_id}/archive")
        return ProjectResponse.from_dict(res)

    def duplicate_project(self, project_id: str) -> ProjectResponse:
        """Duplicate an existing project."""
        res = self.http.post(f"projects/{project_id}/duplicate")
        return ProjectResponse.from_dict(res)

    def delete_project(self, project_id: str) -> None:
        """Delete a project."""
        self.http.delete(f"projects/{project_id}")
