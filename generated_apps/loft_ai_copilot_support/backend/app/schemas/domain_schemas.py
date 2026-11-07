from pydantic import BaseModel, Field, EmailStr
from typing import Generic, TypeVar, Optional, List, Any
from datetime import datetime

T = TypeVar("T")

class ApiMeta(BaseModel):
    page: int = 1
    page_size: int = 20
    total: int = 0
    total_pages: int = 1

class ApiResponse(BaseModel, Generic[T]):
    data: T
    meta: Optional[dict] = None
    error: Optional[dict] = None

class ApiListResponse(BaseModel, Generic[T]):
    data: List[T]
    meta: ApiMeta
    error: Optional[dict] = None

# Domain Schemas
class ProposalBase(BaseModel):
    title: str = Field(..., example="Locação Apto Copan 42B")
    client_name: str = Field(..., example="Willian Jesus")
    client_email: str = Field(..., example="willian.jesus@olivelas.com.br")
    client_document: str = Field(..., example="123.456.789-00")
    amount: float = Field(..., gt=0, example=3500.0)
    category: str = Field(default="Garantia Locatícia")
    notes: Optional[str] = None
    status: str = Field(default="Pending")

class ProposalCreate(ProposalBase):
    pass

class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class ProposalResponse(ProposalBase):
    id: str
    risk_score: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: dict

class ChatMessageRequest(BaseModel):
    message: str = Field(..., example="Como funciona a garantia de fiança da Olivelas?")
    history: Optional[List[dict]] = Field(default_factory=list)

class ChatMessageResponse(BaseModel):
    reply: str
    sender: str = "assistant"
    intent: str = "general_support"
    confidence: float = 0.98
    suggested_actions: List[str] = Field(default_factory=list)
