"""
Knowledge Schemas
"""
from __future__ import annotations
from pydantic import BaseModel, Field
from app.domain.models import KnowledgeCategory


class KnowledgeDocShareItem(BaseModel):
    id: str
    document_id: str
    target_type: str  # "user" | "group"
    target_id: str
    target_name: str
    role: str = "viewer"
    created_at: str
    created_by: str


class KnowledgeDocShareCreate(BaseModel):
    target_type: str = Field(..., description="'user' ou 'group'")
    target_id: str = Field(..., description="E-mail do usuário ou ID do grupo")
    target_name: str = Field(..., description="Nome de exibição do usuário ou grupo")
    role: str = Field(default="viewer", description="'viewer' ou 'editor'")


class KnowledgeDocumentSummary(BaseModel):
    id: str
    title: str
    category: KnowledgeCategory
    volume: str | None = None
    file_path: str | None = None
    summary: str
    key_points: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    author: str | None = "Loft Engineering"
    version: str | None = "1.0.0"
    updated_at: str | None = None
    is_custom: bool = False
    source_url: str | None = None
    shares_count: int = 0


class KnowledgeDocumentDetail(KnowledgeDocumentSummary):
    content: str
    shares: list[KnowledgeDocShareItem] = Field(default_factory=list)


class KnowledgeDocumentCreate(BaseModel):
    title: str = Field(..., min_length=3)
    category: KnowledgeCategory = Field(default=KnowledgeCategory.MASTER_GUIDE)
    volume: str | None = None
    summary: str = Field(..., min_length=5)
    content: str = Field(..., min_length=10)
    key_points: list[str] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    author: str | None = "Loft Engineering"
    version: str | None = "1.0.0"
    source_url: str | None = None


class KnowledgeDocumentUpdate(BaseModel):
    title: str | None = None
    category: KnowledgeCategory | None = None
    volume: str | None = None
    summary: str | None = None
    content: str | None = None
    key_points: list[str] | None = None
    tags: list[str] | None = None
    version: str | None = None


class ConfluenceImportRequest(BaseModel):
    space_key: str = Field(..., description="Chave do espaço no Confluence (ex: ENG, TECH, ARCH)")
    page_id_or_title: str | None = Field(default=None, description="ID ou Título da página específica")
    base_url: str = Field(default="https://loft.atlassian.net/wiki", description="Base URL do Confluence Cloud")
    api_token: str | None = Field(default=None, description="API Token / Personal Access Token")
    username: str | None = Field(default=None, description="E-mail do usuário Atlassian")
    target_category: KnowledgeCategory = Field(default=KnowledgeCategory.EXTERNAL_CONFLUENCE)


class GitHubImportRequest(BaseModel):
    repo_url: str = Field(..., description="URL do repositório (ex: https://github.com/loft-br/aiops-documentation)")
    branch: str = Field(default="main", description="Branch para sincronização")
    path_filter: str | None = Field(default="docs", description="Diretório ou arquivo para importar")
    github_token: str | None = Field(default=None, description="GitHub Personal Access Token (para repos privados)")
    target_category: KnowledgeCategory = Field(default=KnowledgeCategory.EXTERNAL_GITHUB)


class RawDocImportRequest(BaseModel):
    title: str
    category: KnowledgeCategory = KnowledgeCategory.EXTERNAL_CONFLUENCE
    source_url: str | None = None
    content: str
    tags: list[str] = Field(default_factory=list)


class KnowledgeSearchQuery(BaseModel):
    query: str
    category: KnowledgeCategory | None = None
    limit: int = Field(default=10, ge=1, le=50)


class KnowledgeSearchResult(BaseModel):
    document_id: str
    title: str
    category: KnowledgeCategory
    volume: str | None = None
    matched_snippet: str
    relevance_score: float
