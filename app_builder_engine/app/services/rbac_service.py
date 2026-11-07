"""
RBAC Service — Role-Based Access Control and Permission Governance
Enforces permissions on backend mutating actions for Global Admin, Admin, Editor, and Viewer
Synchronized with SQLite database tables (iam_roles, iam_permissions, iam_role_permissions).
"""
from __future__ import annotations
from typing import Any
from fastapi import Header, HTTPException, status
from sqlalchemy import select
from app.domain.entities import RoleName, User
from app.storage.database import db
from app.db.session import get_db_session
from app.models.orm_models import IamRoleModel, PermissionModel, RolePermissionModel


ROLE_PERMISSIONS: dict[RoleName, set[str]] = {
    RoleName.GLOBAL_ADMIN: {
        "*",
        "read",
        "create",
        "update",
        "delete",
        "publish",
        "deprecate",
        "archive",
        "restore",
        "validate",
        "manage_users",
        "manage_roles",
        "manage_permissions",
        "manage_settings",
        "switch_role",
    },
    RoleName.ADMIN: {
        "read",
        "create",
        "update",
        "delete",
        "publish",
        "deprecate",
        "archive",
        "restore",
        "validate",
        "manage_users",
        "manage_roles",
        "manage_settings",
        "switch_role",
    },
    RoleName.EDITOR: {
        "read",
        "create",
        "update",
        "validate",
        "switch_role",
    },
    RoleName.VIEWER: {
        "read",
        "validate",
        "switch_role",
    },
}


class RbacService:
    def get_users(self) -> list[User]:
        return list(db.users.values())

    def get_user_by_id(self, user_id: str) -> User | None:
        return db.users.get(user_id)

    def switch_active_role(self, role_name: str) -> User:
        current_user = db.get_current_user()
        for role in RoleName:
            if role.value.lower() == role_name.lower() or role.name.lower() == role_name.lower():
                current_user.role = role
                db.users[current_user.id] = current_user
                return current_user
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role name '{role_name}'. Available: {[r.value for r in RoleName]}",
        )

    def check_permission(self, required_permission: str, user_role: RoleName | str | None = None) -> bool:
        if user_role is None:
            user_role = db.get_current_user().role

        role_str = user_role.value if isinstance(user_role, RoleName) else str(user_role)
        norm_role = role_str.lower().replace("-", "_").replace(" ", "_")

        # Global Admin always has full access
        if norm_role in ("global_admin", "*"):
            return True

        # Check standard verb set
        role_enum = None
        for r in RoleName:
            if r.value.lower() == role_str.lower() or r.name.lower() == role_str.lower():
                role_enum = r
                break

        if role_enum and required_permission in ROLE_PERMISSIONS.get(role_enum, set()):
            return True

        # Check dynamic permissions from SQLite database
        try:
            with get_db_session() as session:
                role_obj = session.scalar(
                    select(IamRoleModel).where(
                        (IamRoleModel.name == role_str)
                        | (IamRoleModel.id == role_str)
                        | (IamRoleModel.slug == role_str.lower().replace(" ", "-"))
                    )
                )
                if not role_obj:
                    return False

                # Query granted permission codes for this role
                granted_codes = session.scalars(
                    select(PermissionModel.code)
                    .join(RolePermissionModel, RolePermissionModel.permission_id == PermissionModel.id)
                    .where(RolePermissionModel.role_id == role_obj.id)
                ).all()

                granted_set = set(granted_codes)
                if "*" in granted_set or required_permission in granted_set:
                    return True

                # Prefix match mapping (e.g. perm_comp_create grants create on components)
                for code in granted_set:
                    if required_permission in code or code in required_permission:
                        return True
        except Exception:
            pass

        return False

    def require_permission(self, required_permission: str, user_role: RoleName | str | None = None):
        if not self.check_permission(required_permission, user_role):
            effective_role = user_role.value if isinstance(user_role, RoleName) else (user_role or db.get_current_user().role.value)
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Acesso negado: A ação '{required_permission}' não é permitida para o perfil '{effective_role}'.",
            )


rbac_service = RbacService()
