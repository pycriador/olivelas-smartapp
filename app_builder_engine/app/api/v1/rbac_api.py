"""
RBAC Router — Role & Access Governance
List users, view roles, and switch active role for testing permissions
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.domain.entities import User, RoleName, ApiResponse, ApiListResponse, ApiMeta, AuditAction, AuditLog
from app.storage.database import db
from app.services.rbac_service import rbac_service, ROLE_PERMISSIONS
from app.core.security import create_access_token

router = APIRouter(prefix="/rbac", tags=["Administration & RBAC"])


class SwitchRoleRequest(BaseModel):
    role: str


class RoleDefinition(BaseModel):
    name: str
    description: str
    permissions: list[str]


class SessionTokenResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: User


def _issue_token_for_user(user: User) -> str:
    role_enum = user.role if isinstance(user.role, RoleName) else RoleName(str(user.role))
    role_str = role_enum.value if hasattr(role_enum, "value") else str(role_enum)
    perms = sorted(list(ROLE_PERMISSIONS.get(role_enum, set())))
    token, _, _ = create_access_token(
        subject=user.id,
        email=user.email,
        role=role_str,
        permissions=perms,
    )
    return token


@router.get("/users", response_model=ApiListResponse[User])
async def list_users():
    users = list(db.users.values())
    return ApiListResponse(
        data=users,
        meta=ApiMeta(page=1, page_size=len(users), total=len(users)),
    )


@router.get("/session-token", response_model=ApiResponse[SessionTokenResponse])
async def get_session_token():
    user = db.get_current_user()
    token = _issue_token_for_user(user)
    return ApiResponse(
        data=SessionTokenResponse(access_token=token, user=user),
    )


@router.get("/current-user", response_model=ApiResponse[User])
async def get_current_user():
    user = db.get_current_user()
    token = _issue_token_for_user(user)
    return ApiResponse(data=user, meta={"access_token": token})


@router.get("/roles", response_model=ApiResponse[list[RoleDefinition]])
async def list_roles():
    roles_list = [
        RoleDefinition(
            name=RoleName.GLOBAL_ADMIN.value,
            description="Acesso irrestrito ao sistema, gestão de papéis e publicação de padrões corporativos.",
            permissions=sorted(list(ROLE_PERMISSIONS[RoleName.GLOBAL_ADMIN])),
        ),
        RoleDefinition(
            name=RoleName.ADMIN.value,
            description="Administração de catálogos, aprovação de blueprints e publicação de versões.",
            permissions=sorted(list(ROLE_PERMISSIONS[RoleName.ADMIN])),
        ),
        RoleDefinition(
            name=RoleName.EDITOR.value,
            description="Criação e edição de blueprints, componentes, módulos e especificações.",
            permissions=sorted(list(ROLE_PERMISSIONS[RoleName.EDITOR])),
        ),
        RoleDefinition(
            name=RoleName.VIEWER.value,
            description="Acesso somente leitura para auditoria, consulta e visualização de catálogos.",
            permissions=sorted(list(ROLE_PERMISSIONS[RoleName.VIEWER])),
        ),
    ]
    return ApiResponse(data=roles_list)


@router.post("/switch-role", response_model=ApiResponse[User])
async def switch_active_role(body: SwitchRoleRequest):
    updated_user = rbac_service.switch_active_role(body.role)
    token = _issue_token_for_user(updated_user)
    db.audit_logs.insert(
        0,
        AuditLog(
            actor=updated_user.email,
            action=AuditAction.PERMISSION_CHANGE,
            resource="UserRole",
            resource_id=updated_user.id,
            metadata={"new_role": updated_user.role.value},
        ),
    )
    return ApiResponse(data=updated_user, meta={"access_token": token})
