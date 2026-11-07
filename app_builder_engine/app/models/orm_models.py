"""
SQLAlchemy ORM Models for App Builder Engine
Provides persistent database schemas for all 10 domain entities + system states and version snapshots.
"""
from __future__ import annotations
from datetime import datetime, timezone
from typing import Any

from sqlalchemy import (
    String,
    Text,
    Boolean,
    DateTime,
    JSON,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    first_name: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    last_name: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    username: Mapped[str] = mapped_column(String(64), default="", index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(256), default="", nullable=False)
    avatar_url: Mapped[str] = mapped_column(String(256), default="", nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="Viewer", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Active", index=True, nullable=False)
    primary_group_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    language: Mapped[str] = mapped_column(String(16), default="pt-BR", nullable=False)
    timezone_name: Mapped[str] = mapped_column(String(64), default="America/Sao_Paulo", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    must_change_password: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    failed_login_attempts: Mapped[int] = mapped_column(default=0, nullable=False)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class ComponentModel(Base):
    __tablename__ = "components"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="UI", index=True, nullable=False)
    type: Mapped[str] = mapped_column(String(32), default="frontend", nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Published", index=True, nullable=False)
    version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    owner: Mapped[str] = mapped_column(String(128), default="Olivelas Frontend Guild", nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    dependencies: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    rules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    specifications: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    modules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    templates: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    props_contract: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    preview_code: Mapped[str] = mapped_column(Text, default="", nullable=False)
    documentation: Mapped[str] = mapped_column(Text, default="", nullable=False)
    interface_spec: Mapped[str] = mapped_column(Text, default="", nullable=False)
    example_usage: Mapped[str] = mapped_column(Text, default="", nullable=False)
    versions: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class TemplateModel(Base):
    __tablename__ = "templates"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Application", nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Published", index=True, nullable=False)
    version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    architecture: Mapped[str] = mapped_column(String(64), default="Modular Monolith", nullable=False)
    architecture_id: Mapped[str] = mapped_column(String(64), default="arch-modular-monolith", nullable=False)
    owner: Mapped[str] = mapped_column(String(128), default="Olivelas Core Team", nullable=False)
    modules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    components: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    rules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    specifications: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    composition_tree: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    versions: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class ModuleModel(Base):
    __tablename__ = "modules"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Core Domain", nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Published", index=True, nullable=False)
    version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    owner: Mapped[str] = mapped_column(String(128), default="Olivelas Platform Team", nullable=False)
    components: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    apis: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    dependencies: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    rules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    specifications: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    templates: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    versions: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class RuleModel(Base):
    __tablename__ = "rules"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Architecture", nullable=False)
    priority: Mapped[str] = mapped_column(String(32), default="REQUIRED", nullable=False)
    scope: Mapped[str] = mapped_column(String(64), default="Global", nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    rule_statement: Mapped[str] = mapped_column(Text, default="", nullable=False)
    applies_to: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    exceptions: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    dependencies: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    specifications: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Published", index=True, nullable=False)
    version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    bad_example: Mapped[str | None] = mapped_column(Text, nullable=True)
    good_example: Mapped[str | None] = mapped_column(Text, nullable=True)
    referenced_spec: Mapped[str | None] = mapped_column(String(128), nullable=True)
    versions: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class ArchitectureModel(Base):
    __tablename__ = "architectures"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Pattern", nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Published", nullable=False)
    characteristics: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    recommended_for: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    restrictions: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    layers: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    recommended_modules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    canonical_folder_structure: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    folder_tree: Mapped[str] = mapped_column(Text, default="", nullable=False)
    modules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    components: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    rules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    specifications: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    versions: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class SpecificationModel(Base):
    __tablename__ = "specifications"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(256), default="", nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Engineering Standard", nullable=False)
    version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Published", nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    summary: Mapped[str] = mapped_column(Text, default="", nullable=False)
    content: Mapped[str] = mapped_column(Text, default="", nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    related_components: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    related_rules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    related_templates: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    related_architectures: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    related_modules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    versions: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class ProjectModel(Base):
    __tablename__ = "projects"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    domain: Mapped[str] = mapped_column(String(64), default="Real Estate Core", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Planning", index=True, nullable=False)
    architecture: Mapped[str] = mapped_column(String(64), default="Modular Monolith", nullable=False)
    architecture_id: Mapped[str] = mapped_column(String(64), default="arch-modular-monolith", nullable=False)
    template_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    owner: Mapped[str] = mapped_column(String(128), default="Willian Jesus", nullable=False)
    blueprint_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    requirements: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    modules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    components: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    templates: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    rules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    specifications: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    versions: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class BlueprintModel(Base):
    __tablename__ = "blueprints"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    project_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    architecture_id: Mapped[str] = mapped_column(String(64), default="arch-modular-monolith", nullable=False)
    architecture_name: Mapped[str] = mapped_column(String(128), default="Modular Monolith", nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Draft", index=True, nullable=False)
    features: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    modules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    components: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    templates: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    integrations: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    rules: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    specifications: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    dependencies: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    folder_structure: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    api_contracts: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    validation: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    raw_blueprint_json: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    versions: Mapped[list[dict[str, Any]]] = mapped_column(JSON, default=list, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    action: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    resource: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    resource_id: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    entity_type: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    entity_id: Mapped[str] = mapped_column(String(64), default="", nullable=False)
    actor: Mapped[str] = mapped_column(String(128), default="System", nullable=False)
    user_email: Mapped[str] = mapped_column(String(128), default="system@olivelas.com.br", nullable=False)
    result: Mapped[str] = mapped_column(String(32), default="SUCCESS", nullable=False)
    metadata_json: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    details: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), index=True
    )


class VersionSnapshotModel(Base):
    __tablename__ = "version_snapshots"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    entity_type: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    entity_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    version: Mapped[str] = mapped_column(String(32), nullable=False)
    changelog: Mapped[str] = mapped_column(Text, default="", nullable=False)
    snapshot_data: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)
    created_by: Mapped[str] = mapped_column(String(128), default="System", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class SystemStateModel(Base):
    __tablename__ = "system_states"

    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    value: Mapped[dict[str, Any]] = mapped_column(JSON, default=dict, nullable=False)


# ---------------------------------------------------------------------------
# IAM (Identity and Access Management) ORM Models
# ---------------------------------------------------------------------------

class GroupModel(Base):
    __tablename__ = "groups"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    color: Mapped[str] = mapped_column(String(32), default="#FF774A", nullable=False)
    icon: Mapped[str] = mapped_column(String(64), default="TeamOutlined", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Active", index=True, nullable=False)
    is_system: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class IamRoleModel(Base):
    __tablename__ = "iam_roles"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(128), default="", index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="System", nullable=False)
    priority: Mapped[int] = mapped_column(default=100, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Active", index=True, nullable=False)
    is_system: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class PermissionModel(Base):
    __tablename__ = "permissions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    code: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="General", index=True, nullable=False)
    module: Mapped[str] = mapped_column(String(64), default="Core", index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, default="", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class UserGroupModel(Base):
    __tablename__ = "user_groups"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    group_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class GroupRoleModel(Base):
    __tablename__ = "group_roles"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    group_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    role_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class RolePermissionModel(Base):
    __tablename__ = "role_permissions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    role_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    permission_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class SessionModel(Base):
    __tablename__ = "sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    ip_address: Mapped[str] = mapped_column(String(64), default="127.0.0.1", nullable=False)
    user_agent: Mapped[str] = mapped_column(String(512), default="", nullable=False)
    browser: Mapped[str] = mapped_column(String(64), default="Chrome", nullable=False)
    os_name: Mapped[str] = mapped_column(String(64), default="macOS", nullable=False)
    device: Mapped[str] = mapped_column(String(64), default="Desktop", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, index=True, nullable=False)
    token_jti: Mapped[str] = mapped_column(String(64), default="", index=True, nullable=False)
    last_activity: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class InvitationModel(Base):
    __tablename__ = "invitations"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    email: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    role_id: Mapped[str] = mapped_column(String(64), default="rol_viewer", nullable=False)
    group_id: Mapped[str | None] = mapped_column(String(64), nullable=True)
    invited_by_id: Mapped[str] = mapped_column(String(64), nullable=False)
    token: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="Pending", index=True, nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    accepted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class ShareModel(Base):
    __tablename__ = "shares"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    resource_type: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    resource_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    grantor_id: Mapped[str] = mapped_column(String(64), nullable=False)
    grantee_type: Mapped[str] = mapped_column(String(32), default="user", nullable=False) # 'user' or 'group'
    grantee_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    permission_level: Mapped[str] = mapped_column(String(32), default="read", nullable=False) # 'read', 'comment', 'edit', 'admin'
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class TokenBlacklistModel(Base):
    __tablename__ = "token_blacklist"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    token_jti: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    user_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    reason: Mapped[str] = mapped_column(String(128), default="logout", nullable=False)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class KnowledgeDocumentModel(Base):
    __tablename__ = "knowledge_documents"

    id: Mapped[str] = mapped_column(String(128), primary_key=True)
    title: Mapped[str] = mapped_column(String(256), index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    volume: Mapped[str | None] = mapped_column(String(128), nullable=True)
    file_path: Mapped[str | None] = mapped_column(String(512), nullable=True)
    summary: Mapped[str] = mapped_column(Text, default="", nullable=False)
    key_points: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    tags: Mapped[list[str]] = mapped_column(JSON, default=list, nullable=False)
    content: Mapped[str] = mapped_column(Text, default="", nullable=False)
    author: Mapped[str] = mapped_column(String(128), default="Olivelas Engineering", nullable=False)
    version: Mapped[str] = mapped_column(String(32), default="1.0.0", nullable=False)
    source_url: Mapped[str | None] = mapped_column(String(512), nullable=True)
    is_custom: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )


class KnowledgeDocShareModel(Base):
    __tablename__ = "knowledge_doc_shares"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    document_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    target_type: Mapped[str] = mapped_column(String(32), default="group", nullable=False)  # 'user' | 'group'
    target_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    target_name: Mapped[str] = mapped_column(String(128), default="", nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="viewer", nullable=False)  # 'viewer' | 'editor'
    created_by: Mapped[str] = mapped_column(String(128), default="willian.jesus@olivelas.com.br", nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )


class KnowledgeDocFavoriteModel(Base):
    __tablename__ = "knowledge_doc_favorites"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    document_id: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )



