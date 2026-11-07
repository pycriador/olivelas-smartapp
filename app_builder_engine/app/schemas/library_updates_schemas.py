"""
Library Updates Central Schemas
Pydantic contracts for the admin-triggered npm/PyPI registry scan, candidate
version build/test, and apply-to-disk workflow.
"""
from __future__ import annotations
from typing import Any, Literal, Optional
from pydantic import BaseModel, Field

Ecosystem = Literal["npm", "pip"]


class LibraryUpdateEntry(BaseModel):
    package: str = Field(..., examples=["react", "fastapi"])
    ecosystem: Ecosystem
    current: str = Field(..., examples=["^19.0.0", ">=0.115.0"])
    safe_update: Optional[str] = Field(
        default=None, description="Highest version within the same major as `current` — pre-selected by default."
    )
    latest_stable: Optional[str] = Field(
        default=None, description="Absolute latest stable version; may carry breaking changes."
    )
    latest_test: Optional[str] = Field(
        default=None, description="Pre-release/beta/rc version, if the package publishes one."
    )
    update_available: bool = False
    error: Optional[str] = Field(
        default=None, description="Set when this single package's registry lookup failed; never aborts the full scan."
    )


class TestCandidateRequest(BaseModel):
    ecosystem: Ecosystem
    package: str
    version: str


class TestCandidateResult(BaseModel):
    passed: bool
    step_failed: Optional[str] = Field(
        default=None, examples=["npm install", "npm run build", "pip install", "import check", "timeout"]
    )
    log_excerpt: str = ""
    vulnerabilities_found: int = 0


class ApplyUpdateRequest(BaseModel):
    ecosystem: Ecosystem
    package: str
    version: str


class StackVersionsEntry(BaseModel):
    ecosystem: Ecosystem
    current: str


class LibraryUpdatesStatus(BaseModel):
    last_scan_at: Optional[str] = None
    stack_versions: dict[str, dict[str, StackVersionsEntry]]
