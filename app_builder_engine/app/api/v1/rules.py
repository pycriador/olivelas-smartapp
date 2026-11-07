"""
Rules Engine Router
Endpoints for querying architectural rules and validating code compliance
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, status
from app.domain.models import RuleCategory, RuleSeverity
from app.schemas.rules import (
    RuleResponse,
    RuleValidationRequest,
    RuleValidationResponse,
)
from app.schemas.common import PaginatedResponse, PaginationMeta
from app.services.rules_service import RulesService

router = APIRouter(prefix="/rules", tags=["Rules Engine"])


def get_rules_service() -> RulesService:
    return RulesService()


@router.get("", response_model=PaginatedResponse[RuleResponse])
async def list_rules(
    category: RuleCategory | None = None,
    severity: RuleSeverity | None = None,
    service: RulesService = Depends(get_rules_service),
):
    """List architectural and security rules defined across the Loft SDDs."""
    rules = service.list_rules(category=category, severity=severity)
    return PaginatedResponse(
        data=rules,
        meta=PaginationMeta(
            page=1,
            page_size=len(rules) or 20,
            total_items=len(rules),
            total_pages=1,
        ),
    )


@router.get("/{rule_id}", response_model=RuleResponse)
async def get_rule(
    rule_id: str,
    service: RulesService = Depends(get_rules_service),
):
    """Get complete details, good/bad examples, and rationale for an architectural rule."""
    return service.get_rule_by_id(rule_id)


@router.post("/validate", response_model=RuleValidationResponse, status_code=status.HTTP_200_OK)
async def validate_code(
    body: RuleValidationRequest,
    service: RulesService = Depends(get_rules_service),
):
    """Validate a code snippet or architectural decision against Loft Golden Rules."""
    return service.validate_code_or_decision(
        text=body.code_or_decision,
        category=body.category,
        context=body.context,
    )
