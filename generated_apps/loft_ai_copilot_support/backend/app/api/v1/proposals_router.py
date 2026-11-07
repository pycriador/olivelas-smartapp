from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List

from app.db.session import get_db
from app.schemas.domain_schemas import (
    ApiResponse,
    ApiListResponse,
    ApiMeta,
    ProposalResponse,
    ProposalCreate,
    ProposalUpdate,
)
from app.services.proposal_service import ProposalService
from app.core.security import get_current_user

router = APIRouter(prefix="/proposals", tags=["Propostas & Garantias"])

@router.get("", response_model=ApiListResponse[ProposalResponse])
def list_proposals(
    status: Optional[str] = None,
    search: Optional[str] = Query(None),
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    items = service.list_proposals(status=status, search=search)
    return ApiListResponse(
        data=items,
        meta=ApiMeta(page=1, page_size=len(items) or 20, total=len(items), total_pages=1),
    )

@router.get("/{proposal_id}", response_model=ApiResponse[ProposalResponse])
def get_proposal(
    proposal_id: str,
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    return ApiResponse(data=service.get_proposal(proposal_id))

@router.post("", response_model=ApiResponse[ProposalResponse], status_code=status.HTTP_201_CREATED)
def create_proposal(
    body: ProposalCreate,
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    p = service.create_proposal(body, actor=user.get("email", "system"))
    return ApiResponse(data=p)

@router.put("/{proposal_id}", response_model=ApiResponse[ProposalResponse])
def update_proposal(
    proposal_id: str,
    body: ProposalUpdate,
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    p = service.update_proposal(proposal_id, body, actor=user.get("email", "system"))
    return ApiResponse(data=p)

@router.delete("/{proposal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proposal(
    proposal_id: str,
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    service.delete_proposal(proposal_id, actor=user.get("email", "system"))
    return None
