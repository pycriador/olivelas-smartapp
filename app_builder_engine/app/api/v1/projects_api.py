"""
Projects Router
Full CRUD, Duplicate, Archive, and Blueprint linking
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Any
from fastapi import APIRouter, Depends, Query, HTTPException, status
from pydantic import BaseModel, Field
from app.domain.entities import (
    Project,
    ProjectStatus,
    Blueprint,
    VersionSnapshot,
    ApiResponse,
    ApiListResponse,
    ApiMeta,
    AuditLog,
    AuditAction,
)
from app.api.v1.iam_api import get_current_user_claims
from app.services.project_service import ProjectService, sync_project_to_blueprint
from app.services.versioning_service import versioning_service
from app.services.rbac_service import rbac_service
from app.storage.database import db

router = APIRouter(prefix="/projects", tags=["Projects"])


def get_project_service() -> ProjectService:
    return ProjectService()


class ProjectCreateRequest(BaseModel):
    name: str = Field(..., min_length=2)
    description: str = ""
    domain: str = "Core Engineering"
    owner: str = "willian.jesus@olivelas.com.br"
    architecture: str = "Olivelas Standard Fullstack Architecture"
    architecture_id: str = "arch_loft_standard_fullstack"
    blueprint_id: str | None = None
    template_id: str | None = None
    requirements: list[str] = Field(default_factory=list)
    modules: list[str] = Field(default_factory=list)
    components: list[str] = Field(default_factory=list)
    templates: list[str] = Field(default_factory=list)
    rules: list[str] = Field(default_factory=list)
    specifications: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)


class ProjectUpdateRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    domain: str | None = None
    owner: str | None = None
    version: str | None = None
    status: ProjectStatus | None = None
    architecture: str | None = None
    architecture_id: str | None = None
    blueprint_id: str | None = None
    template_id: str | None = None
    modules: list[str] | None = None
    components: list[str] | None = None
    templates: list[str] | None = None
    rules: list[str] | None = None
    specifications: list[str] | None = None
    requirements: list[str] | None = None
    tags: list[str] | None = None


class DuplicateProjectRequest(BaseModel):
    new_name: str | None = None


def _is_generated_project(p: Project) -> bool:
    tags = p.tags or []
    slug = getattr(p, "slug", "") or ""
    return bool("generated-app" in tags or p.id.startswith("prj_app") or slug.startswith("app"))


def _is_archived_project(p: Project) -> bool:
    tags = p.tags or []
    st = str(p.status.value if hasattr(p.status, "value") else p.status).lower()
    return bool(st == "archived" or "archived" in tags)


@router.get("", response_model=ApiListResponse[Project])
async def list_projects(
    status: ProjectStatus | None = None,
    search: str | None = Query(None),
    domain: str | None = Query(None),
    category: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    projects = service.list_projects(status=status, search=search)
    if domain:
        projects = [p for p in projects if getattr(p, "domain", None) == domain]
    if category == "generated":
        projects = [p for p in projects if _is_generated_project(p) and not _is_archived_project(p)]
    elif category == "corporate":
        projects = [p for p in projects if not _is_generated_project(p) and not _is_archived_project(p)]
    elif category == "archived":
        projects = [p for p in projects if _is_archived_project(p)]

    total = len(projects)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = projects[start : start + page_size]
        eff_size = page_size
    else:
        paged = projects
        eff_size = total or 20
    return ApiListResponse(
        data=paged,
        meta=ApiMeta(page=page, page_size=eff_size, total=total),
    )


@router.get("/{project_id}", response_model=ApiResponse[Project])
async def get_project(
    project_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    prj = service.get_by_id(project_id)
    return ApiResponse(data=prj)


@router.post("", response_model=ApiResponse[Project], status_code=status.HTTP_201_CREATED)
async def create_project(
    body: ProjectCreateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    rbac_service.require_permission("create", claims.get("role"))
    actor_email = claims.get("email") or body.owner or "willian.jesus@olivelas.com.br"
    arch_obj = db.architectures.get(body.architecture_id)
    arch_name = arch_obj.name if arch_obj else body.architecture

    prj = service.create(
        name=body.name,
        description=body.description,
        owner=actor_email,
        architecture=arch_name,
        tags=body.tags,
    )
    prj.domain = body.domain
    prj.architecture_id = body.architecture_id
    prj.template_id = body.template_id
    prj.requirements = body.requirements
    prj.modules = body.modules
    prj.components = body.components
    prj.templates = body.templates
    prj.rules = body.rules
    prj.specifications = body.specifications

    if body.blueprint_id:
        sync_project_to_blueprint(prj, body.blueprint_id)

    db.projects[prj.id] = prj
    return ApiResponse(data=prj)


@router.put("/{project_id}", response_model=ApiResponse[Project])
async def update_project(
    project_id: str,
    body: ProjectUpdateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    rbac_service.require_permission("update", claims.get("role"))
    prj = service.get_by_id(project_id)
    if not prj:
        raise HTTPException(status_code=404, detail=f"Projeto '{project_id}' não encontrado.")

    if body.name is not None:
        prj.name = body.name
    if body.description is not None:
        prj.description = body.description
    if body.domain is not None:
        prj.domain = body.domain
    if body.owner is not None:
        prj.owner = body.owner
    if body.version is not None:
        prj.version = body.version
    if body.status is not None:
        prj.status = body.status
    if body.architecture is not None:
        prj.architecture = body.architecture
    if body.architecture_id is not None:
        prj.architecture_id = body.architecture_id
        arch_obj = db.architectures.get(body.architecture_id)
        if arch_obj and body.architecture is None:
            prj.architecture = arch_obj.name
    if "blueprint_id" in body.model_fields_set:
        sync_project_to_blueprint(prj, body.blueprint_id)
    if "template_id" in body.model_fields_set:
        prj.template_id = body.template_id
    if body.modules is not None:
        prj.modules = body.modules
    if body.components is not None:
        prj.components = body.components
    if body.templates is not None:
        prj.templates = body.templates
    if body.rules is not None:
        prj.rules = body.rules
    if body.specifications is not None:
        prj.specifications = body.specifications
    if body.requirements is not None:
        prj.requirements = body.requirements
    if body.tags is not None:
        prj.tags = body.tags

    prj.updated_at = datetime.now(timezone.utc)
    db.projects[prj.id] = prj


    actor_email = claims.get("email", "willian.jesus@olivelas.com.br")
    db.audit_logs.insert(
        0,
        AuditLog(
            actor=actor_email,
            action=AuditAction.PROJECT_UPDATED,
            resource="Project",
            resource_id=prj.id,
            metadata={
                "name": prj.name,
                "domain": prj.domain,
                "status": prj.status,
                "blueprint_id": prj.blueprint_id,
                "architecture_id": prj.architecture_id,
            },
        ),
    )

    return ApiResponse(data=prj)


class ProjectVersionRequest(BaseModel):
    version: str
    changelog: str


class ProjectRestoreRequest(BaseModel):
    version: str


@router.post("/{project_id}/archive", response_model=ApiResponse[Project])
async def archive_project(
    project_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    rbac_service.require_permission("archive", claims.get("role"))
    prj = service.archive(project_id)
    return ApiResponse(data=prj)


@router.post("/{project_id}/unarchive", response_model=ApiResponse[Project])
async def unarchive_project(
    project_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    rbac_service.require_permission("update", claims.get("role"))
    prj = service.unarchive(project_id)
    return ApiResponse(data=prj)


@router.get("/{project_id}/versions", response_model=ApiListResponse[VersionSnapshot])
async def list_project_versions(
    project_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    prj = service.get_by_id(project_id)
    return ApiListResponse(
        data=prj.versions,
        meta=ApiMeta(page=1, page_size=len(prj.versions) or 20, total=len(prj.versions)),
    )


@router.post("/{project_id}/versions", response_model=ApiResponse[VersionSnapshot], status_code=status.HTTP_201_CREATED)
async def create_project_version(
    project_id: str,
    body: ProjectVersionRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    rbac_service.require_permission("update", claims.get("role"))
    actor_email = claims.get("email", "willian.jesus@olivelas.com.br")
    snap = versioning_service.create_version_snapshot(
        entity_type="Project",
        entity_id=project_id,
        new_version=body.version,
        changelog=body.changelog,
        actor=actor_email,
    )
    return ApiResponse(data=snap)


@router.post("/{project_id}/restore", response_model=ApiResponse[Project])
async def restore_project_version(
    project_id: str,
    body: ProjectRestoreRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    rbac_service.require_permission("restore", claims.get("role"))
    actor_email = claims.get("email", "willian.jesus@olivelas.com.br")
    restored = versioning_service.restore_version(
        entity_type="Project",
        entity_id=project_id,
        target_version=body.version,
        actor=actor_email,
    )
    return ApiResponse(data=restored)


@router.post("/{project_id}/duplicate", response_model=ApiResponse[Project], status_code=status.HTTP_201_CREATED)
async def duplicate_project(
    project_id: str,
    body: DuplicateProjectRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    rbac_service.require_permission("create", claims.get("role"))
    prj = service.duplicate(project_id, new_name=body.new_name)
    return ApiResponse(data=prj)


@router.get("/{project_id}/blueprint", response_model=ApiResponse[Blueprint])
async def get_project_blueprint(
    project_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    bp = service.get_blueprint(project_id)
    return ApiResponse(data=bp)


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: ProjectService = Depends(get_project_service),
):
    rbac_service.require_permission("delete", claims.get("role"))
    service.delete(project_id)
    return None

