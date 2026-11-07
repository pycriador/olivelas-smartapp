"""
Project & Blueprint Services
Manages projects, blueprints, duplication, archiving and JSON exports
"""
from __future__ import annotations
import copy
import uuid
from datetime import datetime, timezone
from typing import Any
from app.core.errors import NotFoundError, ValidationError
from app.domain.entities import Project, ProjectStatus, Blueprint, AuditAction
from app.storage.database import db
from app.services.audit_service import AuditService


class ProjectService:
    def __init__(self, audit_service: AuditService | None = None):
        self.audit = audit_service or AuditService()

    def list_projects(
        self,
        status: ProjectStatus | None = None,
        search: str | None = None,
    ) -> list[Project]:
        projects = list(db.projects.values())
        if status:
            projects = [p for p in projects if p.status == status]
        if search:
            s = search.lower()
            projects = [p for p in projects if s in p.name.lower() or s in p.description.lower()]
        return sorted(projects, key=lambda x: x.updated_at, reverse=True)

    def get_by_id(self, project_id: str) -> Project:
        prj = db.projects.get(project_id)
        if not prj:
            raise NotFoundError(f"Projeto '{project_id}' não encontrado.", code="PROJECT_NOT_FOUND")
        return prj

    def create(
        self,
        name: str,
        description: str,
        owner: str = "willian.jesus@loft.com.br",
        architecture: str = "Modular Monolith",
        tags: list[str] | None = None,
    ) -> Project:
        if not name.strip():
            raise ValidationError("Nome do projeto é obrigatório.", code="NAME_REQUIRED")

        prj_id = f"prj_{uuid.uuid4().hex[:8]}"
        prj = Project(
            id=prj_id,
            name=name,
            description=description,
            status=ProjectStatus.PLANNING,
            owner=owner,
            architecture=architecture,
            tags=tags or [],
        )
        db.projects[prj.id] = prj
        self.audit.log(
            action=AuditAction.PROJECT_CREATED,
            resource="Project",
            resource_id=prj.id,
            user_email=owner,
            metadata={"name": prj.name, "architecture": prj.architecture},
        )
        return prj

    def update(
        self,
        project_id: str,
        name: str | None = None,
        description: str | None = None,
        status: ProjectStatus | None = None,
        architecture: str | None = None,
        tags: list[str] | None = None,
    ) -> Project:
        prj = self.get_by_id(project_id)
        if name is not None:
            prj.name = name
        if description is not None:
            prj.description = description
        if status is not None:
            prj.status = status
        if architecture is not None:
            prj.architecture = architecture
        if tags is not None:
            prj.tags = tags

        prj.updated_at = datetime.now(timezone.utc)
        self.audit.log(
            action=AuditAction.PROJECT_UPDATED,
            resource="Project",
            resource_id=prj.id,
            metadata={"name": prj.name, "status": prj.status},
        )
        return prj

    def archive(self, project_id: str) -> Project:
        prj = self.get_by_id(project_id)
        prj.status = ProjectStatus.ARCHIVED
        prj.updated_at = datetime.now(timezone.utc)
        db.projects[project_id] = prj
        self.audit.log(
            action=AuditAction.PROJECT_ARCHIVED,
            resource="Project",
            resource_id=prj.id,
            metadata={"status": "archived", "name": prj.name},
        )
        return prj

    def unarchive(self, project_id: str) -> Project:
        prj = self.get_by_id(project_id)
        prj.status = ProjectStatus.ACTIVE
        prj.updated_at = datetime.now(timezone.utc)
        db.projects[project_id] = prj
        self.audit.log(
            action=AuditAction.PROJECT_UPDATED,
            resource="Project",
            resource_id=prj.id,
            metadata={"status": "active", "action": "unarchived", "name": prj.name},
        )
        return prj

    def delete(self, project_id: str) -> None:
        prj = self.get_by_id(project_id)
        # Unlink any blueprints referencing this project (bidirectional cleanup)
        sync_project_to_blueprint(prj, None)
        del db.projects[project_id]
        self.audit.log(
            action=AuditAction.PROJECT_ARCHIVED,
            resource="Project",
            resource_id=project_id,
            metadata={"name": prj.name, "action": "deleted"},
        )


    def duplicate(self, project_id: str, new_name: str | None = None) -> Project:
        source = self.get_by_id(project_id)
        dup_id = f"prj_{uuid.uuid4().hex[:8]}"
        dup_name = new_name or f"{source.name} (Cópia)"

        new_prj = Project(
            id=dup_id,
            name=dup_name,
            description=source.description,
            status=ProjectStatus.PLANNING,
            owner=source.owner,
            architecture=source.architecture,
            architecture_id=source.architecture_id,
            template_id=source.template_id,
            version=source.version,
            tags=list(source.tags),
        )

        # Duplicate blueprint if exists
        if source.blueprint_id and source.blueprint_id in db.blueprints:
            src_bp = db.blueprints[source.blueprint_id]
            dup_bp_id = f"bp_{uuid.uuid4().hex[:8]}"
            dup_bp = copy.deepcopy(src_bp)
            dup_bp.id = dup_bp_id
            dup_bp.project_id = dup_id
            dup_bp.name = f"{dup_name} Blueprint"
            if isinstance(dup_bp.raw_blueprint_json, dict):
                dup_bp.raw_blueprint_json["id"] = dup_bp_id
                dup_bp.raw_blueprint_json["project_id"] = dup_id
            dup_bp.created_at = datetime.now(timezone.utc)
            dup_bp.updated_at = datetime.now(timezone.utc)
            db.blueprints[dup_bp_id] = dup_bp
            new_prj.blueprint_id = dup_bp_id

        db.projects[new_prj.id] = new_prj
        self.audit.log(
            action=AuditAction.PROJECT_DUPLICATED,
            resource="Project",
            resource_id=new_prj.id,
            metadata={"source_project_id": source.id, "new_name": new_prj.name},
        )
        return new_prj

    def get_blueprint(self, project_id: str) -> Blueprint:
        prj = self.get_by_id(project_id)
        if not prj.blueprint_id or prj.blueprint_id not in db.blueprints:
            raise NotFoundError(f"Blueprint não encontrado para o projeto '{project_id}'.", code="BLUEPRINT_NOT_FOUND")
        bp = db.blueprints[prj.blueprint_id]
        # Ensure bidirectional consistency on read if legacy record had project_id=None
        if bp.project_id != prj.id:
            bp.project_id = prj.id
            if isinstance(bp.raw_blueprint_json, dict):
                bp.raw_blueprint_json["project_id"] = prj.id
            db.blueprints[bp.id] = bp
        return bp


def sync_project_to_blueprint(prj: Project, new_blueprint_id: str | None) -> None:
    """
    Atomically synchronizes the bidirectional link between a Project and its Blueprint,
    persisting both sides to SQLite and cleaning up any previous links on swap or unlink.
    """
    now = datetime.now(timezone.utc)
    normalized_bp_id = (new_blueprint_id or "").strip() or None
    old_bp_id = prj.blueprint_id

    # 1. If project previously pointed to another blueprint, unlink that old blueprint
    if old_bp_id and old_bp_id != normalized_bp_id and old_bp_id in db.blueprints:
        old_bp = db.blueprints[old_bp_id]
        if old_bp.project_id == prj.id:
            old_bp.project_id = None
            if isinstance(old_bp.raw_blueprint_json, dict):
                old_bp.raw_blueprint_json["project_id"] = None
            old_bp.updated_at = now
            db.blueprints[old_bp_id] = old_bp

    # 2. Also unlink any other blueprint in the catalog that still points to prj.id
    for bp in list(db.blueprints.values()):
        if bp.project_id == prj.id and bp.id != normalized_bp_id:
            bp.project_id = None
            if isinstance(bp.raw_blueprint_json, dict):
                bp.raw_blueprint_json["project_id"] = None
            bp.updated_at = now
            db.blueprints[bp.id] = bp

    # 3. Link the new blueprint (or clear if None)
    prj.blueprint_id = normalized_bp_id
    if normalized_bp_id and normalized_bp_id in db.blueprints:
        new_bp = db.blueprints[normalized_bp_id]
        # If the target blueprint was previously linked to another project, unlink that project
        if new_bp.project_id and new_bp.project_id != prj.id and new_bp.project_id in db.projects:
            other_prj = db.projects[new_bp.project_id]
            if other_prj.blueprint_id == normalized_bp_id:
                other_prj.blueprint_id = None
                other_prj.updated_at = now
                db.projects[other_prj.id] = other_prj
        new_bp.project_id = prj.id
        if isinstance(new_bp.raw_blueprint_json, dict):
            new_bp.raw_blueprint_json["project_id"] = prj.id
        new_bp.updated_at = now
        db.blueprints[normalized_bp_id] = new_bp


def sync_blueprint_to_project(bp: Blueprint, new_project_id: str | None) -> None:
    """
    Atomically synchronizes the bidirectional link from a Blueprint to a Project,
    persisting both sides to SQLite and cleaning up any previous links on swap or unlink.
    """
    now = datetime.now(timezone.utc)
    normalized_prj_id = (new_project_id or "").strip() or None
    old_prj_id = bp.project_id

    # 1. If blueprint previously pointed to another project, unlink that old project
    if old_prj_id and old_prj_id != normalized_prj_id and old_prj_id in db.projects:
        old_prj = db.projects[old_prj_id]
        if old_prj.blueprint_id == bp.id:
            old_prj.blueprint_id = None
            old_prj.updated_at = now
            db.projects[old_prj_id] = old_prj

    # 2. Also unlink any other project that still points to bp.id
    for p in list(db.projects.values()):
        if p.blueprint_id == bp.id and p.id != normalized_prj_id:
            p.blueprint_id = None
            p.updated_at = now
            db.projects[p.id] = p

    # 3. Link the new project (or clear if None)
    bp.project_id = normalized_prj_id
    if isinstance(bp.raw_blueprint_json, dict):
        bp.raw_blueprint_json["project_id"] = normalized_prj_id

    if normalized_prj_id and normalized_prj_id in db.projects:
        target_prj = db.projects[normalized_prj_id]
        # If target project was linked to another blueprint, unlink that blueprint
        if target_prj.blueprint_id and target_prj.blueprint_id != bp.id and target_prj.blueprint_id in db.blueprints:
            other_bp = db.blueprints[target_prj.blueprint_id]
            if other_bp.project_id == target_prj.id:
                other_bp.project_id = None
                if isinstance(other_bp.raw_blueprint_json, dict):
                    other_bp.raw_blueprint_json["project_id"] = None
                other_bp.updated_at = now
                db.blueprints[other_bp.id] = other_bp
        target_prj.blueprint_id = bp.id
        target_prj.updated_at = now
        db.projects[target_prj.id] = target_prj


def reconcile_all_project_blueprint_links() -> None:
    """Ensures all existing projects and blueprints in SQLite have consistent bidirectional links."""
    for prj in list(db.projects.values()):
        if prj.blueprint_id and prj.blueprint_id in db.blueprints:
            bp = db.blueprints[prj.blueprint_id]
            if bp.project_id != prj.id:
                bp.project_id = prj.id
                if isinstance(bp.raw_blueprint_json, dict):
                    bp.raw_blueprint_json["project_id"] = prj.id
                db.blueprints[bp.id] = bp
    for bp in list(db.blueprints.values()):
        if bp.project_id and bp.project_id in db.projects:
            prj = db.projects[bp.project_id]
            if not prj.blueprint_id:
                prj.blueprint_id = bp.id
                db.projects[prj.id] = prj
        elif bp.project_id and bp.project_id not in db.projects:
            bp.project_id = None
            if isinstance(bp.raw_blueprint_json, dict):
                bp.raw_blueprint_json["project_id"] = None
            db.blueprints[bp.id] = bp


class BlueprintService:
    def __init__(self, audit_service: AuditService | None = None):
        self.audit = audit_service or AuditService()

    def list_blueprints(self) -> list[Blueprint]:
        return sorted(list(db.blueprints.values()), key=lambda x: x.updated_at, reverse=True)

    def get_by_id(self, blueprint_id: str) -> Blueprint:
        bp = db.blueprints.get(blueprint_id)
        if not bp:
            raise NotFoundError(f"Blueprint '{blueprint_id}' não encontrado.", code="BLUEPRINT_NOT_FOUND")
        return bp

    def create(
        self,
        name: str,
        project_id: str | None = None,
        architecture_id: str = "arch_loft_standard_fullstack",
        features: list[str] | None = None,
        modules: list[str] | None = None,
        components: list[str] | None = None,
        templates: list[str] | None = None,
        integrations: list[str] | None = None,
        rules: list[str] | None = None,
        specifications: list[str] | None = None,
    ) -> Blueprint:
        bp_id = f"bp_{uuid.uuid4().hex[:8]}"
        arch = db.architectures.get(architecture_id)
        arch_name = arch.name if arch else "Loft Standard Fullstack Architecture"

        bp = Blueprint(
            id=bp_id,
            project_id=project_id,
            name=name,
            architecture_id=architecture_id,
            architecture_name=arch_name,
            features=features or [],
            modules=modules or [],
            components=components or [],
            templates=templates or [],
            integrations=integrations or [],
            rules=rules or [],
            specifications=specifications or [],
            raw_blueprint_json={
                "id": bp_id,
                "project_id": project_id,
                "project": name,
                "architecture": arch_name,
                "features": features or [],
                "components": components or [],
                "templates": templates or [],
                "rules": rules or [],
            },
        )
        db.blueprints[bp.id] = bp
        if project_id:
            sync_blueprint_to_project(bp, project_id)
            db.blueprints[bp.id] = bp

        self.audit.log(
            action=AuditAction.BLUEPRINT_CREATED,
            resource="Blueprint",
            resource_id=bp.id,
            metadata={"name": bp.name, "project_id": bp.project_id},
        )
        return bp

