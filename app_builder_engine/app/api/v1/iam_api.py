"""
IAM API Router v1 — Identity and Access Management Endpoints
Provides comprehensive APIs for Authentication, User Lifecycle, Group & Role Management, Permission Matrix, Sessions, Invitations, Shares, and Governance Dashboard.
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status, Query
from app.domain.entities import ApiResponse, ApiListResponse, ApiMeta
from app.core.errors import AuthenticationError
from app.schemas.iam_schemas import (
    LoginRequest,
    SignupRequest,
    LoginResponse,
    RefreshTokenRequest,
    ChangePasswordRequest,
    UserResponse,
    UserCreateRequest,
    UserUpdateRequest,
    UserAdminResetPasswordRequest,
    GroupResponse,
    GroupCreateRequest,
    GroupUpdateRequest,
    GroupMemberAddRequest,
    IamRoleResponse,
    IamRoleCreateRequest,
    IamRoleUpdateRequest,
    PermissionResponse,
    PermissionCreateRequest,
    PermissionUpdateRequest,
    PermissionToggleRequest,
    PermissionMatrixItem,
    SessionResponse,
    InvitationResponse,
    InvitationCreateRequest,
    ShareResponse,
    ShareCreateRequest,
    IamDashboardStats,
)
from app.services.iam_service import iam_service
from app.core.security import decode_token

router = APIRouter(prefix="/iam", tags=["Identity & Access Management (IAM)"])


def get_current_user_claims(
    authorization: str | None = Header(None),
) -> dict[str, Any]:
    """Strictly validates JWT Bearer token and rejects unauthenticated or forged requests with 401 AUTHENTICATION_FAILED."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise AuthenticationError(
            "Token de autenticação Bearer ausente. Envie o header Authorization: Bearer <token>."
        )
    token = authorization[7:].strip()
    if not token:
        raise AuthenticationError(
            "Token Bearer vazio. Envie um token JWT válido no header Authorization."
        )
    try:
        claims = decode_token(token)
    except Exception:
        raise AuthenticationError("Token de acesso expirado, malformado ou inválido.")

    jti = claims.get("jti", "")
    if jti and iam_service.is_token_blacklisted(jti):
        raise AuthenticationError("Token de acesso revogado (sessão encerrada).")

    return claims


# ---------------------------------------------------------------------------
# 1. Authentication & Contract Endpoints
# ---------------------------------------------------------------------------
@router.post("/auth/login", response_model=ApiResponse[LoginResponse])
@router.post("/login", response_model=ApiResponse[LoginResponse])
async def login(body: LoginRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("User-Agent", "Browser")
    res = iam_service.login(body, ip_address=client_ip, user_agent=user_agent)
    return ApiResponse(data=res)


@router.post("/auth/signup", response_model=ApiResponse[LoginResponse], status_code=status.HTTP_201_CREATED)
@router.post("/signup", response_model=ApiResponse[LoginResponse], status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest, request: Request):
    client_ip = request.client.host if request.client else "127.0.0.1"
    user_agent = request.headers.get("User-Agent", "Browser")
    res = iam_service.signup(body, ip_address=client_ip, user_agent=user_agent)
    return ApiResponse(data=res)


@router.get("/contract", response_model=ApiResponse[dict[str, Any]])
@router.get("/auth/contract", response_model=ApiResponse[dict[str, Any]])
async def get_iam_contract():
    """Returns the canonical IAM Contract for Client Applications (roles, permissions, signup, and group membership routes)."""
    return ApiResponse(data=iam_service.get_application_iam_contract())


@router.get("/bootstrap-status", response_model=ApiResponse[dict[str, Any]])
@router.get("/auth/bootstrap-status", response_model=ApiResponse[dict[str, Any]])
async def get_bootstrap_status():
    """Returns whether the platform has any registered users or if the next signup will become Global Admin."""
    return ApiResponse(data=iam_service.get_bootstrap_status())


@router.post("/auth/refresh", response_model=ApiResponse[LoginResponse])
@router.post("/refresh", response_model=ApiResponse[LoginResponse])
async def refresh_token(body: RefreshTokenRequest):
    res = iam_service.refresh_token(body.refresh_token)
    return ApiResponse(data=res)


@router.post("/auth/logout", response_model=ApiResponse[dict[str, str]])
@router.post("/logout", response_model=ApiResponse[dict[str, str]])
async def logout(claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.logout(token_jti=claims.get("jti", ""), user_id=claims.get("sub", ""))
    return ApiResponse(data={"message": "Logout efetuado com sucesso."})


@router.get("/auth/me", response_model=ApiResponse[UserResponse])
@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_me(claims: dict[str, Any] = Depends(get_current_user_claims)):
    user = iam_service.get_user(claims.get("sub", ""))
    return ApiResponse(data=user)


@router.post("/auth/change-password", response_model=ApiResponse[dict[str, str]])
@router.post("/change-password", response_model=ApiResponse[dict[str, str]])
async def change_password(body: ChangePasswordRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.change_password(claims.get("sub", ""), body.current_password, body.new_password)
    return ApiResponse(data={"message": "Senha alterada com sucesso."})


# ---------------------------------------------------------------------------
# 2. Users CRUD
# ---------------------------------------------------------------------------
@router.get("/users", response_model=ApiListResponse[UserResponse])
async def list_users(
    search: str | None = Query(None),
    role: str | None = Query(None),
    status: str | None = Query(None),
    group_id: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    users = iam_service.list_users(search=search, role=role, status_filter=status, group_id=group_id)
    total = len(users)
    start = (page - 1) * page_size
    paginated = users[start : start + page_size]
    return ApiListResponse(
        data=paginated,
        meta=ApiMeta(page=page, page_size=page_size, total=total),
    )


@router.get("/users/{user_id}", response_model=ApiResponse[UserResponse])
async def get_user(user_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    u = iam_service.get_user(user_id)
    return ApiResponse(data=u)


@router.post("/users", response_model=ApiResponse[UserResponse], status_code=status.HTTP_201_CREATED)
async def create_user(body: UserCreateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    res = iam_service.create_user(body, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data=res)


@router.put("/users/{user_id}", response_model=ApiResponse[UserResponse])
async def update_user(user_id: str, body: UserUpdateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    res = iam_service.update_user(user_id, body, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data=res)


@router.delete("/users/{user_id}", response_model=ApiResponse[dict[str, str]])
async def delete_user(user_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.delete_user(user_id, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data={"message": f"Usuário {user_id} excluído com sucesso."})


@router.post("/users/{user_id}/reset-password", response_model=ApiResponse[dict[str, str]])
async def admin_reset_password(
    user_id: str,
    body: UserAdminResetPasswordRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    iam_service.admin_reset_password(
        user_id=user_id,
        new_password=body.new_password,
        force_change=body.force_change_on_login,
        actor_email=claims.get("email", "system@loft.com.br"),
    )
    return ApiResponse(data={"message": "Senha resetada pelo administrador com sucesso."})


@router.post("/users/{user_id}/unlock", response_model=ApiResponse[dict[str, str]])
async def unlock_user(user_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.unlock_user(user_id, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data={"message": "Usuário desbloqueado com sucesso."})


# ---------------------------------------------------------------------------
# 3. Groups CRUD & Membership
# ---------------------------------------------------------------------------
@router.get("/groups", response_model=ApiListResponse[GroupResponse])
async def list_groups(
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=200),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    groups = iam_service.list_groups()
    if search:
        q = search.lower()
        groups = [
            g for g in groups
            if q in g.name.lower() or q in (g.description or "").lower()
        ]
    total = len(groups)
    start = (page - 1) * page_size
    paginated = groups[start : start + page_size]
    return ApiListResponse(
        data=paginated,
        meta=ApiMeta(page=page, page_size=page_size, total=total),
    )


@router.get("/groups/{group_id}", response_model=ApiResponse[GroupResponse])
async def get_group(group_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    g = iam_service.get_group(group_id)
    return ApiResponse(data=g)


@router.post("/groups", response_model=ApiResponse[GroupResponse], status_code=status.HTTP_201_CREATED)
async def create_group(body: GroupCreateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    res = iam_service.create_group(body, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data=res)


@router.put("/groups/{group_id}", response_model=ApiResponse[GroupResponse])
async def update_group(group_id: str, body: GroupUpdateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    res = iam_service.update_group(group_id, body, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data=res)


@router.delete("/groups/{group_id}", response_model=ApiResponse[dict[str, str]])
async def delete_group(group_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.delete_group(group_id, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data={"message": f"Grupo {group_id} excluído com sucesso."})


@router.post("/groups/{group_id}/duplicate", response_model=ApiResponse[GroupResponse])
async def duplicate_group(group_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    res = iam_service.duplicate_group(group_id, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data=res)


@router.get("/groups/{group_id}/members", response_model=ApiListResponse[UserResponse])
async def list_group_members(
    group_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    members = iam_service.list_group_members(group_id)
    return ApiListResponse(
        data=members,
        meta=ApiMeta(page=1, page_size=len(members) or 50, total=len(members)),
    )


@router.post("/groups/{group_id}/members", response_model=ApiResponse[dict[str, Any]], status_code=status.HTTP_201_CREATED)
async def add_group_member(
    group_id: str,
    body: GroupMemberAddRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    res = iam_service.add_group_member(
        group_id=group_id,
        user_id=body.user_id,
        actor_email=claims.get("email", "system@loft.com.br"),
    )
    return ApiResponse(data=res)


@router.delete("/groups/{group_id}/members/{user_id}", response_model=ApiResponse[dict[str, Any]])
async def remove_group_member(
    group_id: str,
    user_id: str,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    res = iam_service.remove_group_member(
        group_id=group_id,
        user_id=user_id,
        actor_email=claims.get("email", "system@loft.com.br"),
    )
    return ApiResponse(data=res)


# ---------------------------------------------------------------------------
# 4. Roles CRUD
# ---------------------------------------------------------------------------
@router.get("/roles", response_model=ApiListResponse[IamRoleResponse])
async def list_roles(
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=200),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    roles = iam_service.list_roles()
    if search:
        q = search.lower()
        roles = [
            r for r in roles
            if q in r.name.lower() or q in (r.description or "").lower()
        ]
    total = len(roles)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = roles[start : start + page_size]
        eff_size = page_size
    else:
        paged = roles
        eff_size = total or 20
    return ApiListResponse(
        data=paged,
        meta=ApiMeta(page=page, page_size=eff_size, total=total),
    )


@router.get("/roles/{role_id}", response_model=ApiResponse[IamRoleResponse])
async def get_role(role_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    r = iam_service.get_role(role_id)
    return ApiResponse(data=r)


@router.post("/roles", response_model=ApiResponse[IamRoleResponse], status_code=status.HTTP_201_CREATED)
async def create_role(body: IamRoleCreateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    res = iam_service.create_role(body, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data=res)


@router.put("/roles/{role_id}", response_model=ApiResponse[IamRoleResponse])
async def update_role(role_id: str, body: IamRoleUpdateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    res = iam_service.update_role(role_id, body, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data=res)


@router.delete("/roles/{role_id}", response_model=ApiResponse[dict[str, str]])
async def delete_role(role_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.delete_role(role_id, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data={"message": f"Role {role_id} excluída com sucesso."})


# ---------------------------------------------------------------------------
# 5. Permissions & Matrix
# ---------------------------------------------------------------------------
@router.get("/permissions", response_model=ApiListResponse[PermissionResponse])
async def list_permissions(claims: dict[str, Any] = Depends(get_current_user_claims)):
    perms = iam_service.list_permissions()
    return ApiListResponse(
        data=perms,
        meta=ApiMeta(page=1, page_size=len(perms) or 50, total=len(perms)),
    )


@router.post("/permissions", response_model=ApiResponse[PermissionResponse], status_code=status.HTTP_201_CREATED)
async def create_permission(body: PermissionCreateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    actor_email = claims.get("email", "system@loft.com.br")
    res = iam_service.create_permission(body, actor_email=actor_email)
    return ApiResponse(data=res)


@router.put("/permissions/{permission_id}", response_model=ApiResponse[PermissionResponse])
async def update_permission(permission_id: str, body: PermissionUpdateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    actor_email = claims.get("email", "system@loft.com.br")
    res = iam_service.update_permission(permission_id, body, actor_email=actor_email)
    return ApiResponse(data=res)


@router.delete("/permissions/{permission_id}", response_model=ApiResponse[dict[str, str]])
async def delete_permission(permission_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    actor_email = claims.get("email", "system@loft.com.br")
    iam_service.delete_permission(permission_id, actor_email=actor_email)
    return ApiResponse(data={"message": f"Permissão {permission_id} excluída com sucesso."})


@router.post("/permissions/{permission_id}/toggle", response_model=ApiResponse[dict[str, str]])
async def toggle_role_permission(
    permission_id: str,
    body: PermissionToggleRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    actor_email = claims.get("email", "system@loft.com.br")
    iam_service.toggle_role_permission(permission_id, body.role_name, body.granted, actor_email=actor_email)
    return ApiResponse(data={"message": f"Permissão {permission_id} para role {body.role_name} atualizada com sucesso."})


@router.get("/permissions/matrix", response_model=ApiResponse[list[PermissionMatrixItem]])
@router.get("/matrix", response_model=ApiResponse[list[PermissionMatrixItem]])
async def get_permission_matrix(
    module: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=500),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    matrix = iam_service.get_permission_matrix()
    if module:
        matrix = [m for m in matrix if m.module.lower() == module.lower()]
    if search:
        q = search.lower()
        matrix = [
            m for m in matrix
            if q in m.code.lower()
            or q in m.module.lower()
            or q in m.action.lower()
            or q in (m.description or "").lower()
        ]
    total = len(matrix)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = matrix[start : start + page_size]
        eff_size = page_size
    else:
        paged = matrix
        eff_size = total or 50
    return ApiResponse(
        data=paged,
        meta={"page": page, "page_size": eff_size, "total": total},
    )


# ---------------------------------------------------------------------------
# 6. Sessions
# ---------------------------------------------------------------------------
@router.get("/sessions", response_model=ApiListResponse[SessionResponse])
async def list_sessions(
    search: str | None = Query(None),
    is_active: bool | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=200),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    sessions = iam_service.list_sessions()
    if is_active is not None:
        sessions = [s for s in sessions if s.is_active == is_active]
    if search:
        q = search.lower()
        sessions = [
            s for s in sessions
            if q in (s.user_email or "").lower()
            or q in (s.user_name or "").lower()
            or q in (s.ip_address or "").lower()
            or q in (s.user_agent or "").lower()
        ]
    total = len(sessions)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = sessions[start : start + page_size]
        eff_size = page_size
    else:
        paged = sessions
        eff_size = total or 20
    return ApiListResponse(
        data=paged,
        meta=ApiMeta(page=page, page_size=eff_size, total=total),
    )


@router.delete("/sessions/{session_id}", response_model=ApiResponse[dict[str, str]])
async def terminate_session(session_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.terminate_session(session_id, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data={"message": "Sessão encerrada com sucesso."})


@router.delete("/sessions/user/{user_id}/terminate-all", response_model=ApiResponse[dict[str, str]])
async def terminate_all_user_sessions(user_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.terminate_all_user_sessions(user_id, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data={"message": "Todas as sessões ativas do usuário foram encerradas."})


# ---------------------------------------------------------------------------
# 7. Invitations
# ---------------------------------------------------------------------------
@router.get("/invitations", response_model=ApiListResponse[InvitationResponse])
async def list_invitations(
    status: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=200),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    invs = iam_service.list_invitations()
    if status:
        invs = [i for i in invs if (i.status or "").lower() == status.lower()]
    if search:
        q = search.lower()
        invs = [
            i for i in invs
            if q in (i.email or "").lower()
            or q in (i.role or "").lower()
            or q in (i.invited_by_email or "").lower()
        ]
    total = len(invs)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = invs[start : start + page_size]
        eff_size = page_size
    else:
        paged = invs
        eff_size = total or 20
    return ApiListResponse(
        data=paged,
        meta=ApiMeta(page=page, page_size=eff_size, total=total),
    )


@router.post("/invitations", response_model=ApiResponse[InvitationResponse], status_code=status.HTTP_201_CREATED)
async def create_invitation(body: InvitationCreateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    inv = iam_service.create_invitation(
        body,
        actor_id=claims.get("sub", "usr_admin01"),
        actor_email=claims.get("email", "system@loft.com.br"),
    )
    return ApiResponse(data=inv)


@router.post("/invitations/{invitation_id}/cancel", response_model=ApiResponse[dict[str, str]])
@router.delete("/invitations/{invitation_id}", response_model=ApiResponse[dict[str, str]])
async def cancel_invitation(invitation_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.cancel_invitation(invitation_id, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data={"message": "Convite cancelado."})


# ---------------------------------------------------------------------------
# 8. Shares
# ---------------------------------------------------------------------------
@router.get("/shares", response_model=ApiListResponse[ShareResponse])
async def list_shares(
    resource_type: str | None = Query(None),
    resource_id: str | None = Query(None),
    search: str | None = Query(None),
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1, le=200),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    shares = iam_service.list_shares(resource_type=resource_type, resource_id=resource_id)
    if search:
        q = search.lower()
        shares = [
            s for s in shares
            if q in (s.resource_name or "").lower()
            or q in (s.resource_id or "").lower()
            or q in (s.target_name or "").lower()
            or q in (s.target_id or "").lower()
        ]
    total = len(shares)
    if page_size is not None:
        start = (page - 1) * page_size
        paged = shares[start : start + page_size]
        eff_size = page_size
    else:
        paged = shares
        eff_size = total or 20
    return ApiListResponse(
        data=paged,
        meta=ApiMeta(page=page, page_size=eff_size, total=total),
    )


@router.post("/shares", response_model=ApiResponse[ShareResponse], status_code=status.HTTP_201_CREATED)
async def create_share(body: ShareCreateRequest, claims: dict[str, Any] = Depends(get_current_user_claims)):
    share = iam_service.create_share(
        body,
        actor_id=claims.get("sub", "usr_admin01"),
        actor_email=claims.get("email", "system@loft.com.br"),
    )
    return ApiResponse(data=share)


@router.delete("/shares/{share_id}", response_model=ApiResponse[dict[str, str]])
async def delete_share(share_id: str, claims: dict[str, Any] = Depends(get_current_user_claims)):
    iam_service.delete_share(share_id, actor_email=claims.get("email", "system@loft.com.br"))
    return ApiResponse(data={"message": "Compartilhamento removido."})


# ---------------------------------------------------------------------------
# 9. IAM Dashboard Stats
# ---------------------------------------------------------------------------
@router.get("/dashboard/stats", response_model=ApiResponse[IamDashboardStats])
async def get_dashboard_stats(claims: dict[str, Any] = Depends(get_current_user_claims)):
    stats = iam_service.get_dashboard_stats()
    return ApiResponse(data=stats)
