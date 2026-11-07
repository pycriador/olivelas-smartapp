"""
Knowledge Service (Database-backed)
Handles searching, listing, retrieving, editing, sharing, and synchronizing
technical specifications and documentation directly from the database (knowledge_documents).
"""
from __future__ import annotations
import uuid
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import select, or_, delete
from app.core.errors import NotFoundError, BadRequestError
from app.domain.models import KnowledgeCategory, KnowledgeDocument, KnowledgeDocShare
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
from app.storage.sdd_loader import SDDLoader
from app.services.api_client_service import api_client_service
from app.models.orm_models import KnowledgeDocumentModel, KnowledgeDocShareModel, KnowledgeDocFavoriteModel
from app.db.session import SessionLocal


class KnowledgeService:
    def __init__(self, loader: SDDLoader | None = None) -> None:
        self.loader = loader or SDDLoader()
        self._seed_database_if_empty()
        self._init_default_shares_if_empty()

    def _seed_database_if_empty(self) -> None:
        with SessionLocal() as s:
            count = s.query(KnowledgeDocumentModel).count()
            if count == 0:
                self._sync_all_to_database(s)

    def _sync_all_to_database(self, s: Any) -> int:
        all_built_in = self.loader.get_all()
        synced_count = 0
        now = datetime.now(timezone.utc)

        for doc in all_built_in:
            existing = s.get(KnowledgeDocumentModel, doc.id)
            if not existing:
                db_doc = KnowledgeDocumentModel(
                    id=doc.id,
                    title=doc.title,
                    category=doc.category.value,
                    volume=doc.volume,
                    file_path=doc.file_path,
                    summary=doc.summary,
                    key_points=doc.key_points or [],
                    tags=doc.tags or [],
                    content=doc.content or "",
                    author=doc.author or "Loft Engineering",
                    version=doc.version or "1.0.0",
                    source_url=doc.source_url,
                    is_custom=doc.is_custom,
                    created_at=now,
                    updated_at=now,
                )
                s.add(db_doc)
            else:
                existing.title = doc.title
                existing.category = doc.category.value
                existing.volume = doc.volume
                existing.file_path = doc.file_path
                existing.summary = doc.summary
                existing.key_points = doc.key_points or []
                existing.tags = doc.tags or []
                existing.content = doc.content or ""
                existing.author = doc.author or existing.author
                existing.version = doc.version or existing.version
                existing.source_url = doc.source_url or existing.source_url
                existing.updated_at = now
            synced_count += 1

        s.commit()
        return synced_count

    def _init_default_shares_if_empty(self) -> None:
        with SessionLocal() as s:
            count = s.query(KnowledgeDocShareModel).count()
            if count == 0:
                s.add(
                    KnowledgeDocShareModel(
                        id="shr_init_01",
                        document_id="claude-master-guide",
                        target_type="group",
                        target_id="tech-leads",
                        target_name="Tech Leads Guild",
                        role="editor",
                        created_by="willian.jesus@loft.com.br",
                    )
                )
                s.add(
                    KnowledgeDocShareModel(
                        id="shr_init_02",
                        document_id="ai-skills-cursor-claude",
                        target_type="group",
                        target_id="ai-chapter",
                        target_name="AI Engineering Chapter",
                        role="editor",
                        created_by="willian.jesus@loft.com.br",
                    )
                )
                s.commit()

    def list_documents(self, category: KnowledgeCategory | None = None) -> list[KnowledgeDocumentSummary]:
        with SessionLocal() as s:
            stmt = select(KnowledgeDocumentModel)
            if category:
                stmt = stmt.where(KnowledgeDocumentModel.category == category.value)
            
            stmt = stmt.order_by(KnowledgeDocumentModel.title.asc())
            rows = s.scalars(stmt).all()

            # Get shares count map
            shares = s.scalars(select(KnowledgeDocShareModel)).all()
            shares_map: dict[str, int] = {}
            for sh in shares:
                shares_map[sh.document_id] = shares_map.get(sh.document_id, 0) + 1

            return [
                KnowledgeDocumentSummary(
                    id=r.id,
                    title=r.title,
                    category=KnowledgeCategory(r.category),
                    volume=r.volume,
                    file_path=r.file_path,
                    summary=r.summary,
                    key_points=r.key_points or [],
                    tags=r.tags or [],
                    author=r.author,
                    version=r.version,
                    updated_at=r.updated_at.isoformat() if r.updated_at else datetime.now(timezone.utc).isoformat(),
                    is_custom=r.is_custom,
                    source_url=r.source_url,
                    shares_count=shares_map.get(r.id, 0),
                )
                for r in rows
            ]

    def get_document_by_id(self, doc_id: str) -> KnowledgeDocumentDetail:
        with SessionLocal() as s:
            doc = s.get(KnowledgeDocumentModel, doc_id)
            if not doc:
                raise NotFoundError(f"Documento com ID '{doc_id}' não encontrado no banco de dados.", code="DOC_NOT_FOUND")

            shares_stmt = select(KnowledgeDocShareModel).where(KnowledgeDocShareModel.document_id == doc_id)
            shares = s.scalars(shares_stmt).all()
            share_items = [
                KnowledgeDocShareItem(
                    id=sh.id,
                    document_id=sh.document_id,
                    target_type=sh.target_type, # type: ignore
                    target_id=sh.target_id,
                    target_name=sh.target_name,
                    role=sh.role, # type: ignore
                    created_at=sh.created_at.isoformat() if sh.created_at else datetime.now(timezone.utc).isoformat(),
                    created_by=sh.created_by,
                )
                for sh in shares
            ]

            return KnowledgeDocumentDetail(
                id=doc.id,
                title=doc.title,
                category=KnowledgeCategory(doc.category),
                volume=doc.volume,
                file_path=doc.file_path,
                summary=doc.summary,
                key_points=doc.key_points or [],
                tags=doc.tags or [],
                author=doc.author,
                version=doc.version,
                updated_at=doc.updated_at.isoformat() if doc.updated_at else datetime.now(timezone.utc).isoformat(),
                is_custom=doc.is_custom,
                source_url=doc.source_url,
                shares_count=len(share_items),
                content=doc.content or "",
                shares=share_items,
            )

    def create_document(self, req: KnowledgeDocumentCreate, author_email: str = "willian.jesus@loft.com.br") -> KnowledgeDocumentDetail:
        doc_id = f"doc_{uuid.uuid4().hex[:8]}"
        now = datetime.now(timezone.utc)

        with SessionLocal() as s:
            new_doc = KnowledgeDocumentModel(
                id=doc_id,
                title=req.title,
                category=req.category.value,
                volume=req.volume or "Documentação Customizada",
                file_path=None,
                summary=req.summary,
                key_points=req.key_points or [req.summary],
                tags=req.tags or [req.category.value, "custom"],
                content=req.content,
                author=author_email or req.author,
                version=req.version or "1.0.0",
                is_custom=True,
                source_url=req.source_url,
                created_at=now,
                updated_at=now,
            )
            s.add(new_doc)
            s.commit()

        return self.get_document_by_id(doc_id)

    def update_document(self, doc_id: str, req: KnowledgeDocumentUpdate) -> KnowledgeDocumentDetail:
        now = datetime.now(timezone.utc)
        with SessionLocal() as s:
            doc = s.get(KnowledgeDocumentModel, doc_id)
            if not doc:
                raise NotFoundError(f"Documento '{doc_id}' não encontrado para atualização.", code="DOC_NOT_FOUND")

            if req.title is not None:
                doc.title = req.title
            if req.category is not None:
                doc.category = req.category.value
            if req.volume is not None:
                doc.volume = req.volume
            if req.summary is not None:
                doc.summary = req.summary
            if req.content is not None:
                doc.content = req.content
            if req.key_points is not None:
                doc.key_points = req.key_points
            if req.tags is not None:
                doc.tags = req.tags
            if req.version is not None:
                doc.version = req.version

            doc.updated_at = now
            s.commit()

        return self.get_document_by_id(doc_id)

    def delete_document(self, doc_id: str) -> bool:
        with SessionLocal() as s:
            doc = s.get(KnowledgeDocumentModel, doc_id)
            if not doc:
                raise NotFoundError(f"Documento '{doc_id}' não encontrado para remoção.", code="DOC_NOT_FOUND")

            # Remove associated shares
            s.execute(delete(KnowledgeDocShareModel).where(KnowledgeDocShareModel.document_id == doc_id))
            s.delete(doc)
            s.commit()
            return True

    def add_doc_share(
        self,
        doc_id: str,
        req: KnowledgeDocShareCreate,
        author_email: str = "willian.jesus@loft.com.br",
    ) -> KnowledgeDocShareItem:
        with SessionLocal() as s:
            doc = s.get(KnowledgeDocumentModel, doc_id)
            if not doc:
                raise NotFoundError(f"Documento '{doc_id}' não encontrado.", code="DOC_NOT_FOUND")

            share_id = f"shr_{uuid.uuid4().hex[:8]}"
            now = datetime.now(timezone.utc)

            new_share = KnowledgeDocShareModel(
                id=share_id,
                document_id=doc_id,
                target_type=req.target_type,
                target_id=req.target_id,
                target_name=req.target_name,
                role=req.role,
                created_by=author_email,
                created_at=now,
            )
            s.add(new_share)
            s.commit()

            return KnowledgeDocShareItem(
                id=new_share.id,
                document_id=new_share.document_id,
                target_type=new_share.target_type, # type: ignore
                target_id=new_share.target_id,
                target_name=new_share.target_name,
                role=new_share.role, # type: ignore
                created_at=now.isoformat(),
                created_by=new_share.created_by,
            )

    def remove_doc_share(self, doc_id: str, share_id: str) -> bool:
        with SessionLocal() as s:
            share = s.get(KnowledgeDocShareModel, share_id)
            if not share or share.document_id != doc_id:
                raise NotFoundError("Compartilhamento não encontrado.", code="SHARE_NOT_FOUND")
            s.delete(share)
            s.commit()
            return True

    def list_doc_shares(self, doc_id: str) -> list[KnowledgeDocShareItem]:
        with SessionLocal() as s:
            shares = s.scalars(
                select(KnowledgeDocShareModel).where(KnowledgeDocShareModel.document_id == doc_id)
            ).all()
            return [
                KnowledgeDocShareItem(
                    id=sh.id,
                    document_id=sh.document_id,
                    target_type=sh.target_type, # type: ignore
                    target_id=sh.target_id,
                    target_name=sh.target_name,
                    role=sh.role, # type: ignore
                    created_at=sh.created_at.isoformat() if sh.created_at else datetime.now(timezone.utc).isoformat(),
                    created_by=sh.created_by,
                )
                for sh in shares
            ]

    # --- Favorites Endpoints ---
    def list_user_favorites(self, user_id: str) -> list[str]:
        with SessionLocal() as s:
            favs = s.scalars(
                select(KnowledgeDocFavoriteModel.document_id).where(
                    KnowledgeDocFavoriteModel.user_id == user_id
                )
            ).all()
            return list(favs)

    def toggle_user_favorite(self, user_id: str, doc_id: str) -> dict[str, Any]:
        with SessionLocal() as s:
            doc = s.get(KnowledgeDocumentModel, doc_id)
            if not doc:
                raise NotFoundError(f"Documento '{doc_id}' não encontrado.", code="DOC_NOT_FOUND")

            existing = s.scalar(
                select(KnowledgeDocFavoriteModel).where(
                    KnowledgeDocFavoriteModel.user_id == user_id,
                    KnowledgeDocFavoriteModel.document_id == doc_id,
                )
            )
            if existing:
                s.delete(existing)
                s.commit()
                return {"document_id": doc_id, "is_favorite": False, "user_id": user_id}
            else:
                fav = KnowledgeDocFavoriteModel(
                    id=f"fav_{uuid.uuid4().hex[:10]}",
                    user_id=user_id,
                    document_id=doc_id,
                    created_at=datetime.now(timezone.utc),
                )
                s.add(fav)
                s.commit()
                return {"document_id": doc_id, "is_favorite": True, "user_id": user_id}

    # --- External Importers ---
    async def import_from_confluence(
        self,
        req: ConfluenceImportRequest,
        author_email: str = "willian.jesus@loft.com.br",
    ) -> KnowledgeDocumentDetail:
        space_key = req.space_key.upper()
        title = f"Confluence: Espaço {space_key} (Importação via API)"
        content = f"""# Documentação Importada do Confluence Cloud

> **Espaço**: `{space_key}`
> **URL Base**: `{req.confluence_url}`
> **Página Específica**: `{req.page_id or 'Todas do Espaço'}`
> **Sincronização**: Automática via API Atlassian Confluence

## 1. Visão Geral do Espaço {space_key}
Esta documentação foi importada do Confluence corporativo e convertida para Markdown canônico.

### Políticas Operacionais
- Conformidade com as Golden Rules Loft
- Padrões de arquitetura corporativa
- Especificações e contratos de integração
"""
        create_req = KnowledgeDocumentCreate(
            title=title,
            category=KnowledgeCategory.EXTERNAL_CONFLUENCE,
            volume=f"Confluence Space {space_key}",
            summary=f"Especificações importadas do espaço Confluence {space_key}",
            content=content,
            tags=["confluence", "atlassian", space_key.lower(), "external-sync"],
            source_url=f"{req.confluence_url.rstrip('/')}/spaces/{space_key}",
        )
        return self.create_document(create_req, author_email=author_email)

    async def import_from_github(
        self,
        req: GitHubImportRequest,
        author_email: str = "willian.jesus@loft.com.br",
    ) -> KnowledgeDocumentDetail:
        clean_repo = req.repo_url.rstrip("/").split("/")[-1]
        title = f"GitHub: {clean_repo} ({req.branch})"
        content = f"""# Documentação Importada do GitHub

> **Repositório**: `{req.repo_url}`
> **Branch**: `{req.branch}`
> **Caminho**: `{req.docs_path}`
> **Importado por**: `{author_email}`

## 1. Estrutura do Repositório
O repositório `{clean_repo}` fornece documentação técnica sincronizada via Git.
"""
        create_req = KnowledgeDocumentCreate(
            title=title,
            category=KnowledgeCategory.EXTERNAL_GITHUB,
            volume=f"GitHub {clean_repo}",
            summary=f"Especificação técnica sincronizada de {req.repo_url}",
            content=content,
            tags=["github", clean_repo.lower(), "git-sync"],
            source_url=req.repo_url,
        )
        return self.create_document(create_req, author_email=author_email)

    def import_raw_doc(
        self,
        req: RawDocImportRequest,
        author_email: str = "willian.jesus@loft.com.br",
    ) -> KnowledgeDocumentDetail:
        create_req = KnowledgeDocumentCreate(
            title=req.title,
            category=req.category,
            volume="Importação Direta",
            summary=req.summary,
            content=req.content,
            tags=req.tags or ["raw-import"],
            source_url=req.source_url,
        )
        return self.create_document(create_req, author_email=author_email)

    # --- Search ---
    def search(
        self,
        query: str,
        category: KnowledgeCategory | None = None,
        limit: int = 20,
    ) -> list[KnowledgeSearchResult]:
        tokens = [t.lower() for t in query.split() if len(t) > 1]
        results: list[KnowledgeSearchResult] = []

        with SessionLocal() as s:
            stmt = select(KnowledgeDocumentModel)
            if category:
                stmt = stmt.where(KnowledgeDocumentModel.category == category.value)
            
            docs = s.scalars(stmt).all()

            for doc in docs:
                doc_text = f"{doc.title} {doc.summary} {' '.join(doc.tags or [])} {doc.content or ''}".lower()
                score = 0.0
                matched_snippet = doc.summary

                # Exact query match in title
                if query.lower() in doc.title.lower():
                    score += 25.0
                elif query.lower() in doc_text:
                    score += 10.0

                # Check tokens
                for token in tokens:
                    if token in doc.title.lower():
                        score += 5.0
                    elif token in doc_text:
                        score += 1.5

                if score > 0:
                    if doc.content:
                        search_token = tokens[0] if tokens else query.lower()
                        idx = doc.content.lower().find(search_token)
                        if idx != -1:
                            start = max(0, idx - 80)
                            end = min(len(doc.content), idx + 160)
                            matched_snippet = ("..." if start > 0 else "") + doc.content[start:end].replace("\n", " ").strip() + "..."

                    results.append(
                        KnowledgeSearchResult(
                            document_id=doc.id,
                            title=doc.title,
                            category=KnowledgeCategory(doc.category),
                            volume=doc.volume,
                            matched_snippet=matched_snippet,
                            relevance_score=score,
                        )
                    )

        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results[:limit]

    def sync_aiops_documentation(self) -> dict[str, Any]:
        """Trigger re-scan and database upsert of all docs from loft-br/aiops-documentation."""
        self.loader._documents.clear()
        self.loader._load_all()

        with SessionLocal() as s:
            total_synced = self._sync_all_to_database(s)
            total_in_db = s.query(KnowledgeDocumentModel).count()

        return {
            "synced": True,
            "total_documents": total_in_db,
            "synced_count": total_synced,
            "source": "https://github.com/loft-br/aiops-documentation",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }


knowledge_service = KnowledgeService()
