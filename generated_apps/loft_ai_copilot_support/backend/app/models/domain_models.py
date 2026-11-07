from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime, timezone

class ProposalModel(BaseModel):
    id: str
    title: str
    client_name: str
    client_email: str
    client_document: str
    amount: float = 0.0
    status: str = "Pending"
    category: str = "Garantia Locatícia"
    risk_score: int = 750
    notes: Optional[str] = None
    metadata_json: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AuditEventModel(BaseModel):
    id: str
    actor: str
    action: str
    resource: str
    resource_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata_json: Dict[str, Any] = Field(default_factory=dict)
