"""
Pydantic v2 Schemas for Identity and Access Management (IAM)
Provides complete request/response contracts for Authentication, Authorization, Users, Groups, Roles, Permissions, Sessions, Invitations, and Sharing.
"""
from __future__ import annotations
from datetime import datetime
from typing import Any
from pydantic import BaseModel, Field, EmailStr, model_validator


# ---------------------------------------------------------------------------
# Auth Schemas
# ---------------------------------------------------------------------------

class LoginRequest(BaseModel):
    username_or_email: str = ""
    email: str | None = None
    username: str | None = None
    password: str
    remember_me: bool = False

    @model_validator(mode="before")
    @classmethod
    def normalize_identity(cls, values: Any) -> Any:
        if isinstance(values, dict):
            identity = (
                values.get("username_or_email")
                or values.get("email")
                or values.get("username")
                or ""
            )
            values["username_or_email"] = str(identity).strip()
        return values


class UserBasicInfo(BaseModel):
    id: str
    name: str
    email: str
    username: str
    role: str
    avatar_url: str = ""
    status: str = "Active"
    must_change_password: bool = False
    permissions: list[str] = []
    groups: list[str] = []


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserBasicInfo


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str


class FirstAccessRequest(BaseModel):
    token: str
    new_password: str
    first_name: str | None = None
    last_name: str | None = None


class SignupRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    username: str = ""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    first_name: str = ""
    last_name: str = ""
    language: str = "pt-BR"
    timezone_name: str = "America/Sao_Paulo"

    @model_validator(mode="before")
    @classmethod
    def default_username(cls, values: Any) -> Any:
        if isinstance(values, dict):
            email = str(values.get("email") or "").strip()
            if not values.get("username") and email:
                values["username"] = email.split("@")[0].lower()
            if not values.get("name") and values.get("username"):
                values["name"] = str(values["username"])
        return values


class GroupMemberAddRequest(BaseModel):
    user_id: str



# ---------------------------------------------------------------------------
# User Schemas
# ---------------------------------------------------------------------------

class UserResponse(BaseModel):
    id: str
    name: str
    first_name: str
    last_name: str
    username: str
    email: str
    role: str
    status: str
    primary_group_id: str | None = None
    language: str
    timezone_name: str
    is_active: bool
    must_change_password: bool
    avatar_url: str = ""
    failed_login_attempts: int = 0
    locked_until: datetime | None = None
    last_login_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
    groups: list[str] = []
    permissions: list[str] = []


class UserCreateRequest(BaseModel):
    name: str
    first_name: str = ""
    last_name: str = ""
    username: str = ""
    email: EmailStr
    password: str
    role: str = "Viewer"
    status: str = "Active"
    primary_group_id: str | None = None
    language: str = "pt-BR"
    timezone_name: str = "America/Sao_Paulo"
    must_change_password: bool = False
    group_ids: list[str] = []

    @model_validator(mode="before")
    @classmethod
    def default_username(cls, values: Any) -> Any:
        if isinstance(values, dict):
            email = str(values.get("email") or "").strip()
            if not values.get("username") and email:
                values["username"] = email.split("@")[0].lower()
        return values


class UserUpdateRequest(BaseModel):
    name: str | None = None
    first_name: str | None = None
    last_name: str | None = None
    username: str | None = None
    email: EmailStr | None = None
    role: str | None = None
    status: str | None = None
    primary_group_id: str | None = None
    language: str | None = None
    timezone_name: str | None = None
    is_active: bool | None = None
    avatar_url: str | None = None
    group_ids: list[str] | None = None


class UserAdminResetPasswordRequest(BaseModel):
    new_password: str
    force_change_on_login: bool = True


# ---------------------------------------------------------------------------
# Group Schemas
# ---------------------------------------------------------------------------

class GroupResponse(BaseModel):
    id: str
    name: str
    slug: str
    description: str
    color: str
    icon: str
    status: str
    is_system: bool
    created_at: datetime
    updated_at: datetime
    member_count: int = 0
    role_count: int = 0
    roles: list[str] = []


class GroupCreateRequest(BaseModel):
    name: str
    description: str = ""
    color: str = "#FF774A"
    icon: str = "TeamOutlined"
    status: str = "Active"
    role_ids: list[str] = []


class GroupUpdateRequest(BaseModel):
    name: str | None = None
    description: str | None = None
    color: str | None = None
    icon: str | None = None
    status: str | None = None
    role_ids: list[str] | None = None


# ---------------------------------------------------------------------------
# Role Schemas
# ---------------------------------------------------------------------------

class IamRoleResponse(BaseModel):
    id: str
    name: str
    slug: str
    category: str
    priority: int
    description: str
    status: str
    is_system: bool
    created_at: datetime
    updated_at: datetime
    permission_count: int = 0
    permissions: list[str] = []


class IamRoleCreateRequest(BaseModel):
    name: str
    category: str = "Custom"
    priority: int = 50
    description: str = ""
    status: str = "Active"
    permission_ids: list[str] = []


class IamRoleUpdateRequest(BaseModel):
    name: str | None = None
    category: str | None = None
    priority: int | None = None
    description: str | None = None
    status: str | None = None
    permission_ids: list[str] | None = None


# ---------------------------------------------------------------------------
# Permission Schemas
# ---------------------------------------------------------------------------

class PermissionResponse(BaseModel):
    id: str
    code: str
    name: str
    category: str
    module: str
    description: str
    created_at: datetime


class PermissionCreateRequest(BaseModel):
    code: str
    name: str
    category: str = "General"
    module: str = "Core"
    description: str = ""


class PermissionUpdateRequest(BaseModel):
    name: str | None = None
    category: str | None = None
    module: str | None = None
    description: str | None = None


class PermissionToggleRequest(BaseModel):
    role_name: str
    granted: bool


class PermissionMatrixItem(BaseModel):
    permission_id: str
    code: str
    name: str
    module: str
    category: str
    granted_roles: list[str] = []
    granted_groups: list[str] = []



# ---------------------------------------------------------------------------
# Session Schemas
# ---------------------------------------------------------------------------

class SessionResponse(BaseModel):
    id: str
    user_id: str
    user_name: str = ""
    user_email: str = ""
    ip_address: str
    user_agent: str
    browser: str
    os_name: str
    device: str
    is_active: bool
    last_activity: datetime
    expires_at: datetime
    created_at: datetime


# ---------------------------------------------------------------------------
# Invitation Schemas
# ---------------------------------------------------------------------------

class InvitationResponse(BaseModel):
    id: str
    email: str
    role_id: str
    role_name: str = ""
    group_id: str | None = None
    group_name: str | None = None
    invited_by_id: str
    invited_by_name: str = ""
    token: str
    status: str
    expires_at: datetime
    created_at: datetime
    accepted_at: datetime | None = None


class InvitationCreateRequest(BaseModel):
    email: EmailStr
    role_id: str
    group_id: str | None = None


# ---------------------------------------------------------------------------
# Share Schemas
# ---------------------------------------------------------------------------

class ShareResponse(BaseModel):
    id: str
    resource_type: str
    resource_id: str
    grantor_id: str
    grantor_name: str = ""
    grantee_type: str
    grantee_id: str
    grantee_name: str = ""
    permission_level: str
    created_at: datetime
    updated_at: datetime


class ShareCreateRequest(BaseModel):
    resource_type: str
    resource_id: str
    grantee_type: str # 'user' or 'group'
    grantee_id: str
    permission_level: str = "read" # 'read', 'comment', 'edit', 'admin'


# ---------------------------------------------------------------------------
# IAM Dashboard & Stats
# ---------------------------------------------------------------------------

class IamDashboardStats(BaseModel):
    total_users: int
    active_users: int
    total_groups: int
    total_roles: int
    total_permissions: int
    active_sessions: int
    pending_invitations: int
    total_shares: int
    recent_logs: list[dict[str, Any]] = []
