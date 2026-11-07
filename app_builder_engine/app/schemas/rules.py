"""
Rules Engine Schemas
"""
from __future__ import annotations
from pydantic import BaseModel, Field
from app.domain.models import RuleCategory, RuleSeverity


class RuleResponse(BaseModel):
    id: str
    title: str
    category: RuleCategory
    severity: RuleSeverity
    statement: str
    rationale: str
    bad_example: str | None = None
    good_example: str | None = None
    referenced_sdd: str | None = None


class RuleValidationRequest(BaseModel):
    code_or_decision: str
    category: RuleCategory | None = None
    context: str | None = None


class RuleViolation(BaseModel):
    rule_id: str
    rule_title: str
    severity: RuleSeverity
    message: str
    recommendation: str


class RuleValidationResponse(BaseModel):
    is_compliant: bool
    violations: list[RuleViolation] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    applicable_rules_count: int
