"""
Versioning and Lifecycle Management Service
Implements SemVer version bumps, snapshot creation, history comparison, and restore capabilities.
"""
from __future__ import annotations
from typing import Any
from datetime import datetime, timezone
from fastapi import HTTPException, status
from app.domain.entities import VersionSnapshot, EntityLifecycleStatus, AuditAction, AuditLog
from app.storage.database import db


class VersioningService:
    def create_version_snapshot(
        self,
        entity_type: str,
        entity_id: str,
        new_version: str,
        changelog: str,
        actor: str = "willian.jesus@loft.com.br",
    ) -> VersionSnapshot:
        entity = self._get_entity(entity_type, entity_id)
        if not entity:
            raise HTTPException(status_code=404, detail=f"{entity_type} '{entity_id}' not found.")

        # Create snapshot of current data before version update
        dump = entity.model_dump()
        dump.pop("versions", None)
        snapshot = VersionSnapshot(
            version=new_version,
            changelog=changelog,
            created_at=datetime.now(timezone.utc),
            created_by=actor,
            snapshot_data=dump,
        )

        entity.version = new_version
        entity.updated_at = datetime.now(timezone.utc)
        # Avoid duplicate versions in snapshot list
        entity.versions = [v for v in entity.versions if v.version != new_version]
        entity.versions.insert(0, snapshot)

        self._save_entity(entity_type, entity_id, entity)

        # Audit
        db.audit_logs.insert(
            0,
            AuditLog(
                actor=actor,
                action=AuditAction.VERSION_CREATED,
                resource=entity_type.capitalize(),
                resource_id=entity_id,
                metadata={"version": new_version, "changelog": changelog},
            ),
        )

        return snapshot

    def restore_version(
        self,
        entity_type: str,
        entity_id: str,
        target_version: str,
        actor: str = "willian.jesus@loft.com.br",
    ) -> Any:
        entity = self._get_entity(entity_type, entity_id)
        if not entity:
            raise HTTPException(status_code=404, detail=f"{entity_type} '{entity_id}' not found.")

        target_snapshot = next((v for v in entity.versions if v.version == target_version), None)
        if not target_snapshot:
            raise HTTPException(status_code=404, detail=f"Version '{target_version}' not found in history.")

        # Restore properties from snapshot data
        for key, val in target_snapshot.snapshot_data.items():
            if hasattr(entity, key) and key not in ["id", "created_at", "versions"]:
                try:
                    setattr(entity, key, val)
                except Exception:
                    pass

        entity.version = target_version
        entity.updated_at = datetime.now(timezone.utc)
        self._save_entity(entity_type, entity_id, entity)

        db.audit_logs.insert(
            0,
            AuditLog(
                actor=actor,
                action=AuditAction.RESTORE,
                resource=entity_type,
                resource_id=entity_id,
                metadata={"restored_to_version": target_version},
            ),
        )

        return entity

    def transition_lifecycle(
        self,
        entity_type: str,
        entity_id: str,
        new_status: EntityLifecycleStatus,
        actor: str = "willian.jesus@loft.com.br",
    ) -> Any:
        entity = self._get_entity(entity_type, entity_id)
        if not entity:
            raise HTTPException(status_code=404, detail=f"{entity_type} '{entity_id}' not found.")

        old_status = getattr(entity, "status", None)
        entity.status = new_status
        entity.updated_at = datetime.now(timezone.utc)
        self._save_entity(entity_type, entity_id, entity)

        action_map = {
            EntityLifecycleStatus.PUBLISHED: AuditAction.PUBLISH,
            EntityLifecycleStatus.DEPRECATED: AuditAction.DEPRECATE,
            EntityLifecycleStatus.ARCHIVED: AuditAction.ARCHIVE,
            EntityLifecycleStatus.DRAFT: AuditAction.UPDATE,
        }

        db.audit_logs.insert(
            0,
            AuditLog(
                actor=actor,
                action=action_map.get(new_status, AuditAction.UPDATE),
                resource=entity_type,
                resource_id=entity_id,
                metadata={"from_status": str(old_status), "to_status": str(new_status)},
            ),
        )

        return entity

    def _get_entity(self, entity_type: str, entity_id: str) -> Any:
        t = entity_type.lower()
        if "comp" in t:
            return db.components.get(entity_id)
        elif "mod" in t:
            return db.modules.get(entity_id)
        elif "temp" in t:
            return db.templates.get(entity_id)
        elif "rule" in t:
            return db.rules.get(entity_id)
        elif "arch" in t:
            return db.architectures.get(entity_id)
        elif "spec" in t:
            return db.specifications.get(entity_id)
        elif "blue" in t:
            return db.blueprints.get(entity_id)
        elif "proj" in t:
            return db.projects.get(entity_id)
        return None

    def _save_entity(self, entity_type: str, entity_id: str, entity: Any) -> None:
        t = entity_type.lower()
        if "comp" in t:
            db.components[entity_id] = entity
        elif "mod" in t:
            db.modules[entity_id] = entity
        elif "temp" in t:
            db.templates[entity_id] = entity
        elif "rule" in t:
            db.rules[entity_id] = entity
        elif "arch" in t:
            db.architectures[entity_id] = entity
        elif "spec" in t:
            db.specifications[entity_id] = entity
        elif "blue" in t:
            db.blueprints[entity_id] = entity
        elif "proj" in t:
            db.projects[entity_id] = entity


versioning_service = VersioningService()
