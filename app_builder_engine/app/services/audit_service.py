"""
Audit Service
Records and queries immutable audit events across the platform
"""
from __future__ import annotations
from typing import Any
from app.domain.entities import AuditLog, AuditAction
from app.storage.database import db


class AuditService:
    def log(
        self,
        action: AuditAction | str,
        resource: str,
        resource_id: str,
        user_email: str = "system@olivelas.com.br",
        result: str = "SUCCESS",
        metadata: dict[str, Any] | None = None,
    ) -> AuditLog:
        meta = metadata or {}
        entry = AuditLog(
            actor=user_email,
            action=action,
            resource=resource,
            resource_id=resource_id,
            entity_type=resource,
            entity_id=resource_id,
            result=result,
            metadata=meta,
            details=meta,
        )
        db.audit_logs.insert(0, entry)
        return entry

    def list_logs(
        self,
        action: AuditAction | str | None = None,
        resource: str | None = None,
        entity_id: str | None = None,
        actor: str | None = None,
        search: str | None = None,
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[AuditLog], int]:
        logs = list(db.audit_logs)
        if action:
            act_str = action.value if hasattr(action, "value") else str(action)
            logs = [
                l for l in logs
                if (l.action.value if hasattr(l.action, "value") else str(l.action)).lower() == act_str.lower()
            ]
        if resource:
            res_str = resource.lower()
            logs = [
                l for l in logs
                if l.resource.lower() == res_str or (l.entity_type and l.entity_type.lower() == res_str)
            ]
        if entity_id:
            eid_str = entity_id.lower()
            logs = [
                l for l in logs
                if (l.entity_id and l.entity_id.lower() == eid_str)
                or (l.resource_id and l.resource_id.lower() == eid_str)
            ]
        if actor:
            actor_str = actor.lower()
            logs = [
                l for l in logs
                if actor_str in (l.actor or "").lower()
            ]
        if search:
            q = search.lower()
            logs = [
                l for l in logs
                if q in (l.actor or "").lower()
                or q in (l.action.value if hasattr(l.action, "value") else str(l.action)).lower()
                or q in (l.resource or "").lower()
                or q in (l.resource_id or "").lower()
                or q in str(l.metadata or "").lower()
            ]

        total = len(logs)
        paginated = logs[offset : offset + limit]
        return paginated, total
