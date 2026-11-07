"""
Settings Schemas — System Configuration, Category Management, and RBAC Governance
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Any, Optional
from pydantic import BaseModel, Field


class CategoryItem(BaseModel):
    id: str
    name: str
    type: str  # components, modules, templates, rules, specifications, architectures, projects
    description: str = ""
    color: str = "#0066CC"
    count: int = 0
    is_system: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class CategoryCreateRequest(BaseModel):
    name: str
    type: str
    description: str = ""
    color: str = "#0066CC"


class CategoryUpdateRequest(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = None
    old_name: Optional[str] = None


class CategoryRbacSettings(BaseModel):
    roles_can_manage: list[str] = Field(default_factory=lambda: ["Global Admin", "Admin"])
    roles_can_create: list[str] = Field(default_factory=lambda: ["Global Admin", "Admin", "Editor"])
    roles_can_delete: list[str] = Field(default_factory=lambda: ["Global Admin"])


class SystemSettingsResponse(BaseModel):
    default_versioning_policy: str = "semver_strict"
    auto_audit_logging: bool = True
    golden_rules_mandate: bool = True
    rbac_settings: CategoryRbacSettings = Field(default_factory=CategoryRbacSettings)
    total_categories: int = 0
    total_custom_categories: int = 0
