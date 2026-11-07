"""
Unified Settings & RBAC Service Client.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from api_client.http_client import HttpClient


class SettingsService:
    """Manages system governance, categories, and RBAC matrix."""

    def __init__(self, http: HttpClient) -> None:
        self.http = http

    def get_system_settings(self) -> Dict[str, Any]:
        """Fetch global platform settings."""
        return self.http.get("settings/system")

    def get_categories(self) -> List[Dict[str, Any]]:
        """Fetch managed categories."""
        res = self.http.get("settings/categories")
        return res if isinstance(res, list) else []

    def get_roles(self) -> List[Dict[str, Any]]:
        """Fetch IAM roles."""
        res = self.http.get("settings/roles")
        return res if isinstance(res, list) else []

    def get_permission_matrix(self) -> List[Dict[str, Any]]:
        """Fetch permission matrix."""
        res = self.http.get("settings/matrix")
        return res if isinstance(res, list) else []
