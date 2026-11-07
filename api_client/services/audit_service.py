"""
Universal Audit Trail Service Client.
"""
from __future__ import annotations
from typing import Any, Dict, List, Optional
from api_client.http_client import HttpClient


class AuditService:
    """Queries and registers audit log events."""

    def __init__(self, http: HttpClient) -> None:
        self.http = http

    def list_logs(
        self,
        actor: Optional[str] = None,
        action: Optional[str] = None,
        resource: Optional[str] = None,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        """List audit log events."""
        params = {"actor": actor, "action": action, "resource": resource, "limit": limit}
        res = self.http.get("audit/logs", params=params)
        return res if isinstance(res, list) else []

    def log_event(
        self,
        action: str,
        resource: str,
        resource_id: str,
        details: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Record an audit log entry."""
        payload = {
            "action": action,
            "resource": resource,
            "resource_id": resource_id,
            "actor": self.http.config.actor_email,
            "metadata_json": details or {},
        }
        return self.http.post("audit/logs", json_data=payload)
