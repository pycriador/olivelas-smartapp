"""
Library Updates Central API Router
Admin-triggered endpoints to scan npm/PyPI for dependency updates, build/test a
candidate version against the guinea-pig fixture app, and apply a chosen
version to stack_versions.json. Requires the `library_updates:manage`
permission (Global Admin only by default — see app/db/seed.py).
"""
from __future__ import annotations
import asyncio
from typing import Any
from fastapi import APIRouter, Depends
from app.domain.entities import ApiResponse, ApiListResponse, ApiMeta
from app.schemas.library_updates_schemas import (
    LibraryUpdateEntry,
    TestCandidateRequest,
    TestCandidateResult,
    ApplyUpdateRequest,
    LibraryUpdatesStatus,
)
from app.services import library_updates_service
from app.services.audit_service import AuditService
from app.services.rbac_service import rbac_service
from app.api.v1.iam_api import get_current_user_claims

router = APIRouter(prefix="/library-updates", tags=["Library Updates Central"])


def get_audit_service() -> AuditService:
    return AuditService()


@router.get("/scan", response_model=ApiListResponse[LibraryUpdateEntry])
async def scan_library_updates(claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Scans the public npm/PyPI registries for the latest version of every
    library listed in stack_versions.json and classifies candidates into
    safe / latest-stable / test buckets."""
    rbac_service.require_permission("library_updates:manage", user_role=claims.get("role"))
    results = await library_updates_service.scan_registries()
    return ApiListResponse(
        data=results,
        meta=ApiMeta(page=1, page_size=len(results), total=len(results)),
    )


@router.post("/test-candidate", response_model=ApiResponse[TestCandidateResult])
async def test_library_update_candidate(
    body: TestCandidateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Installs (and, for npm, builds + audits) a candidate library version
    inside a throwaway copy of the guinea-pig fixture app. The underlying
    work (npm/pip subprocesses) is genuinely blocking and can take from a few
    seconds to a couple of minutes, so it's offloaded to a worker thread via
    asyncio.to_thread — otherwise it would freeze the event loop (and this
    server's other requests, including unrelated logins) for however long the
    install/build takes. This is a manual, deliberate admin action, not a hot
    path, so the latency itself is fine; blocking everyone else isn't."""
    rbac_service.require_permission("library_updates:manage", user_role=claims.get("role"))
    result = await asyncio.to_thread(
        library_updates_service.test_candidate, body.ecosystem, body.package, body.version
    )
    return ApiResponse(data=result)


@router.post("/apply", response_model=ApiResponse[dict])
async def apply_library_update(
    body: ApplyUpdateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    audit: AuditService = Depends(get_audit_service),
):
    """Writes the chosen candidate version into stack_versions.json on disk.
    Never touches git — committing/pushing this change to the shared `main`
    branch remains a deliberate, separate, manual step."""
    rbac_service.require_permission("library_updates:manage", user_role=claims.get("role"))
    actor = claims.get("email", "willian.jesus@olivelas.com.br")
    updated_stack = library_updates_service.apply_update(body.ecosystem, body.package, body.version)
    audit.log(
        action="LIBRARY_UPDATE_APPLIED",
        resource="LibraryUpdate",
        resource_id=f"{body.ecosystem}:{body.package}",
        user_email=actor,
        metadata={
            "ecosystem": body.ecosystem,
            "package": body.package,
            "version": body.version,
        },
    )
    return ApiResponse(data=updated_stack)


@router.get("/status", response_model=ApiResponse[LibraryUpdatesStatus])
async def get_library_updates_status(claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Returns the timestamp of the last manual scan (in-memory, process-local)
    and the current contents of stack_versions.json."""
    rbac_service.require_permission("library_updates:manage", user_role=claims.get("role"))
    status = library_updates_service.get_status()
    return ApiResponse(data=status)
