"""
Knowledge Router
Endpoints for browsing, searching, creating, editing, sharing and importing specifications and documentation.
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Depends, Query
from app.domain.models import KnowledgeCategory
from app.api.v1.iam_api import get_current_user_claims
from app.schemas.knowledge import (
    KnowledgeDocumentSummary,
    KnowledgeDocumentDetail,
    KnowledgeDocumentCreate,
    KnowledgeDocumentUpdate,
    KnowledgeDocShareCreate,
    KnowledgeDocShareItem,
    KnowledgeSearchResult,
    ConfluenceImportRequest,
    GitHubImportRequest,
    RawDocImportRequest,
)
from app.schemas.common import PaginatedResponse, PaginationMeta
from app.services.knowledge_service import KnowledgeService, knowledge_service

router = APIRouter(prefix="/knowledge", tags=["Knowledge Management"])


def get_knowledge_service() -> KnowledgeService:
    return knowledge_service


@router.get("/docs", response_model=PaginatedResponse[KnowledgeDocumentSummary])
async def list_documents(
    category: KnowledgeCategory | None = None,
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """List all available specification documents (Frontend SDDs, Backend SDDs, Design System, ADRs, AI Skills, External Docs)."""
    docs = service.list_documents(category=category)
    return PaginatedResponse(
        data=docs,
        meta=PaginationMeta(
            page=1,
            page_size=len(docs) or 20,
            total_items=len(docs),
            total_pages=1,
        ),
    )


@router.post("/docs", response_model=KnowledgeDocumentDetail)
async def create_document(
    body: KnowledgeDocumentCreate,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Create a new custom knowledge document."""
    return service.create_document(body, author_email=claims.get("email", "willian.jesus@loft.com.br"))


@router.get("/docs/{doc_id}", response_model=KnowledgeDocumentDetail)
async def get_document(
    doc_id: str,
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Retrieve full content, key points and shares of a specific specification document."""
    return service.get_document_by_id(doc_id)


@router.put("/docs/{doc_id}", response_model=KnowledgeDocumentDetail)
async def update_document(
    doc_id: str,
    body: KnowledgeDocumentUpdate,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Update title, summary, content or tags of a document."""
    return service.update_document(doc_id, body)


@router.delete("/docs/{doc_id}")
async def delete_document(
    doc_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Delete a custom or imported document."""
    success = service.delete_document(doc_id)
    return {"data": {"deleted": success, "document_id": doc_id}}


# --- Sharing Endpoints ---
@router.get("/docs/{doc_id}/shares", response_model=list[KnowledgeDocShareItem])
async def list_document_shares(
    doc_id: str,
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """List all internal shares (users or groups) for this document."""
    return service.list_doc_shares(doc_id)


@router.post("/docs/{doc_id}/shares", response_model=KnowledgeDocShareItem)
async def add_document_share(
    doc_id: str,
    body: KnowledgeDocShareCreate,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Share document internally with a user or group."""
    return service.add_doc_share(doc_id, body, author_email=claims.get("email", "willian.jesus@loft.com.br"))


@router.delete("/docs/{doc_id}/shares/{share_id}")
async def remove_document_share(
    doc_id: str,
    share_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Revoke internal document share."""
    success = service.remove_doc_share(doc_id, share_id)
    return {"data": {"removed": success, "share_id": share_id}}


# --- Favorites Endpoints ---
@router.get("/favorites")
async def list_user_favorites(
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """List document IDs favorited by the logged-in user."""
    user_id = claims.get("email", "willian.jesus@loft.com.br")
    favs = service.list_user_favorites(user_id=user_id)
    return {"favorites": favs, "user_id": user_id, "total": len(favs)}


@router.post("/favorites/{doc_id}")
async def toggle_document_favorite(
    doc_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Toggle favorite status for a document for the logged-in user."""
    user_id = claims.get("email", "willian.jesus@loft.com.br")
    res = service.toggle_user_favorite(user_id=user_id, doc_id=doc_id)
    return res


# --- External Importers ---
@router.post("/import/confluence", response_model=KnowledgeDocumentDetail)
async def import_confluence(
    body: ConfluenceImportRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Import space or page documentation from Atlassian Confluence Cloud."""
    return await service.import_from_confluence(body, author_email=claims.get("email", "willian.jesus@loft.com.br"))


@router.post("/import/github", response_model=KnowledgeDocumentDetail)
async def import_github(
    body: GitHubImportRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Import documentation from a GitHub repository."""
    return await service.import_from_github(body, author_email=claims.get("email", "willian.jesus@loft.com.br"))


@router.post("/import/raw", response_model=KnowledgeDocumentDetail)
async def import_raw(
    body: RawDocImportRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Import custom Markdown or external raw URL documentation."""
    return service.import_raw_doc(body, author_email=claims.get("email", "willian.jesus@loft.com.br"))


@router.get("/search", response_model=list[KnowledgeSearchResult])
async def search_knowledge(
    q: str = Query(..., min_length=2, description="Search term or phrase"),
    category: KnowledgeCategory | None = None,
    limit: int = Query(10, ge=1, le=50),
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Search through all specification documents and extract relevant snippets."""
    return service.search(query=q, category=category, limit=limit)


@router.post("/sync/aiops-documentation")
async def sync_aiops_documentation(
    service: KnowledgeService = Depends(get_knowledge_service),
):
    """Trigger synchronization and re-indexing of loft-br/aiops-documentation repository."""
    return service.sync_aiops_documentation()
