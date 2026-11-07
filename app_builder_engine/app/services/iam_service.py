"""
IAM Service — Identity and Access Management Domain Service
Implements enterprise authentication, token lifecycle, dynamic authorization, CRUDs for Users, Groups, Roles, Permissions, Sessions, Invitations, Shares, and Audit logging.
"""
from __future__ import annotations
import uuid
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any
from fastapi import HTTPException, status
from sqlalchemy import select, func, delete, or_, and_
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.orm_models import (
    UserModel,
    GroupModel,
    IamRoleModel,
    PermissionModel,
    UserGroupModel,
    GroupRoleModel,
    RolePermissionModel,
    SessionModel,
    InvitationModel,
    ShareModel,
    TokenBlacklistModel,
    AuditLogModel,
)
from app.schemas.iam_schemas import (
    LoginRequest,
    LoginResponse,
    SignupRequest,
    GroupMemberAddRequest,
    UserBasicInfo,
    UserResponse,
    UserCreateRequest,
    UserUpdateRequest,
    GroupResponse,
    GroupCreateRequest,
    GroupUpdateRequest,
    IamRoleResponse,
    IamRoleCreateRequest,
    IamRoleUpdateRequest,
    PermissionResponse,
    PermissionCreateRequest,
    PermissionMatrixItem,
    SessionResponse,
    InvitationResponse,
    InvitationCreateRequest,
    ShareResponse,
    ShareCreateRequest,
    IamDashboardStats,
)
from app.core.config import Settings
from app.core.errors import (
    AuthenticationError,
    AuthorizationError,
    AccountLockedError,
    ConflictError,
    NotFoundError,
    ValidationError,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)


class IamService:
    def __init__(self, session_factory=SessionLocal):
        self.session_factory = session_factory

    def get_session(self) -> Session:
        return self.session_factory()

    # ---------------------------------------------------------------------------
    # Audit Logging Helper
    # ---------------------------------------------------------------------------
    def log_audit(
        self,
        db: Session,
        action: str,
        resource: str,
        resource_id: str,
        actor: str,
        user_email: str,
        result: str = "SUCCESS",
        metadata: dict[str, Any] | None = None,
    ) -> None:
        now = datetime.now(timezone.utc)
        aud_id = f"aud_{uuid.uuid4().hex[:12]}"
        log_entry = AuditLogModel(
            id=aud_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            entity_type=resource,
            entity_id=resource_id,
            actor=actor,
            user_email=user_email,
            result=result,
            metadata_json=metadata or {},
            details=metadata or {},
            timestamp=now,
        )
        db.add(log_entry)

    # ---------------------------------------------------------------------------
    # 1. Authentication & Token Management
    # ---------------------------------------------------------------------------
    def login(
        self,
        body: LoginRequest,
        ip_address: str = "127.0.0.1",
        user_agent: str = "Browser",
    ) -> LoginResponse:
        with self.get_session() as db:
            ident = body.username_or_email.strip().lower()
            query = select(UserModel).where(
                or_(
                    func.lower(UserModel.email) == ident,
                    func.lower(UserModel.username) == ident,
                )
            )
            user = db.scalar(query)

            # Fallback if admin logs in with a custom LOFT_ADMIN_USER / aiops_app_builder_user from .env
            valid_admin_identities = [x.lower() for x in Settings.get_valid_admin_identities()]
            valid_admin_passwords = Settings.get_valid_admin_passwords()
            if not user and ident in valid_admin_identities:
                user = db.get(UserModel, "usr_admin01") or db.get(UserModel, "usr_admin00")

            if not user:
                raise AuthenticationError(
                    "Credenciais inválidas. Verifique seu e-mail/usuário e senha.",
                    code="AUTHENTICATION_FAILED",
                )

            is_admin_account = (
                user.id in ("usr_admin01", "usr_admin00", "usr_admin02")
                or user.role in ("Global Admin", "Admin")
                or user.email.lower() in valid_admin_identities
                or user.username.lower() in valid_admin_identities
            )
            password_ok = verify_password(body.password, user.password_hash) or (
                is_admin_account and body.password in valid_admin_passwords
            )

            # Check if user is locked (allow valid .env admin password to unlock admin account)
            now = datetime.now(timezone.utc)
            locked_until = user.locked_until
            if locked_until and locked_until.tzinfo is None:
                locked_until = locked_until.replace(tzinfo=timezone.utc)
            if locked_until and locked_until > now and not (is_admin_account and password_ok):
                mins_left = int((locked_until - now).total_seconds() / 60) + 1
                raise AccountLockedError(
                    f"Conta bloqueada por excesso de tentativas. Tente novamente em {mins_left} minutos.",
                    code="ACCOUNT_LOCKED",
                )

            if not user.is_active or user.status != "Active":
                raise AuthorizationError(
                    "Conta de usuário inativa ou suspensa. Contate o administrador.",
                    code="PERMISSION_DENIED",
                )

            # Verify password
            if not password_ok:
                user.failed_login_attempts += 1
                if user.failed_login_attempts >= 5:
                    user.locked_until = now + timedelta(minutes=15)
                    self.log_audit(
                        db, "USER_LOCKOUT", "User", user.id, user.email, user.email, "FAILURE",
                        {"reason": "5 failed login attempts", "locked_minutes": 15, "ip": ip_address}
                    )
                else:
                    self.log_audit(
                        db, "LOGIN_FAILED", "User", user.id, user.email, user.email, "FAILURE",
                        {"attempts": user.failed_login_attempts, "ip": ip_address}
                    )
                db.commit()
                raise AuthenticationError(
                    "Credenciais inválidas. Verifique seu e-mail/usuário e senha.",
                    code="AUTHENTICATION_FAILED",
                )

            # Sync admin password hash if authenticated via .env credential
            if is_admin_account and not verify_password(body.password, user.password_hash):
                user.password_hash = hash_password(body.password)

            # Reset failed login attempts on success
            user.failed_login_attempts = 0
            user.locked_until = None
            user.last_login_at = now

            # Fetch user permissions and groups
            permissions = self.get_user_permissions(db, user.id)
            groups = self.get_user_group_names(db, user.id)

            # Generate tokens. Uses the single source of truth ACCESS_TOKEN_EXPIRE_MINUTES
            # (app/core/security.py) for the default TTL, 7d with remember_me.
            # NOTE: this used to hardcode timedelta(minutes=15) here, independently of
            # ACCESS_TOKEN_EXPIRE_MINUTES=60 in security.py and of the 24h documented in
            # /iam/contract and README.md — three different values for the same concept.
            # Aligning on ACCESS_TOKEN_EXPIRE_MINUTES removes that drift.
            access_token, jti, exp = create_access_token(
                subject=user.id,
                email=user.email,
                role=user.role,
                permissions=permissions,
                groups=groups,
                expires_delta=timedelta(days=7) if body.remember_me else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            )
            refresh_token, ref_jti, ref_exp = create_refresh_token(subject=user.id)

            # Parse device and browser
            browser_name = "Chrome"
            if "Firefox" in user_agent:
                browser_name = "Firefox"
            elif "Safari" in user_agent and "Chrome" not in user_agent:
                browser_name = "Safari"
            elif "Edge" in user_agent:
                browser_name = "Edge"

            os_name = "macOS" if "Mac" in user_agent else "Windows" if "Win" in user_agent else "Linux"

            # Create session record
            session_entry = SessionModel(
                id=f"sess_{uuid.uuid4().hex[:12]}",
                user_id=user.id,
                ip_address=ip_address,
                user_agent=user_agent[:500],
                browser=browser_name,
                os_name=os_name,
                device="Desktop",
                is_active=True,
                token_jti=jti,
                last_activity=now,
                expires_at=exp,
                created_at=now,
            )
            db.add(session_entry)

            self.log_audit(
                db, "LOGIN_SUCCESS", "User", user.id, user.name, user.email, "SUCCESS",
                {"ip": ip_address, "session_id": session_entry.id, "browser": browser_name}
            )
            db.commit()

            return LoginResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer",
                expires_in=int((exp - now).total_seconds()),
                user=UserBasicInfo(
                    id=user.id,
                    name=user.name,
                    email=user.email,
                    username=user.username,
                    role=user.role,
                    avatar_url=user.avatar_url,
                    status=user.status,
                    must_change_password=user.must_change_password,
                    permissions=permissions,
                    groups=groups,
                ),
            )

    def get_bootstrap_status(self) -> dict[str, Any]:
        """Returns whether the platform has any registered users or if the next signup will become Global Admin."""
        with self.get_session() as db:
            total_users = db.scalar(select(func.count(UserModel.id))) or 0
            is_first = total_users == 0
            return {
                "total_users": total_users,
                "has_users": total_users > 0,
                "first_user_will_be_global_admin": is_first,
                "initial_role_on_signup": "Global Admin" if is_first else "Viewer",
                "initial_group_on_signup": "grp_admin" if is_first else "grp_viewers",
            }

    def signup(
        self,
        body: SignupRequest,
        ip_address: str = "127.0.0.1",
        user_agent: str = "Browser",
    ) -> LoginResponse:
        """Self-registration endpoint. First user registered on the platform automatically becomes Global Admin."""
        pw = body.password or ""
        if len(pw) < 8 or len(pw) > 128 or not any(c.isalpha() for c in pw) or not any(c.isdigit() for c in pw):
            raise ValidationError(
                "A senha deve ter entre 8 e 128 caracteres e conter letras e números.",
                code="VALIDATION_ERROR",
                details={"field": "password", "policy": "8-128 chars, letters + numbers"},
            )
        with self.get_session() as db:
            email_norm = body.email.strip().lower()
            username_norm = (body.username or email_norm.split("@")[0]).strip().lower()
            existing = db.scalar(
                select(UserModel).where(
                    or_(
                        func.lower(UserModel.email) == email_norm,
                        func.lower(UserModel.username) == username_norm,
                    )
                )
            )
            if existing:
                raise ConflictError(
                    f"Usuário ou e-mail já cadastrado ({body.email}).",
                    code="CONFLICT",
                )

            existing_users_count = db.scalar(select(func.count(UserModel.id))) or 0
            is_first_user = existing_users_count == 0
            assigned_role = "Global Admin" if is_first_user else "Viewer"
            assigned_group = "grp_admin" if is_first_user else "grp_viewers"

            now = datetime.now(timezone.utc)
            user_id = f"usr_{uuid.uuid4().hex[:12]}"
            parts = body.name.strip().split()
            first_name = body.first_name or (parts[0] if parts else username_norm)
            last_name = body.last_name or (parts[-1] if len(parts) > 1 else "")
            new_user = UserModel(
                id=user_id,
                name=body.name.strip(),
                first_name=first_name,
                last_name=last_name,
                username=username_norm,
                email=email_norm,
                password_hash=hash_password(pw),
                role=assigned_role,
                status="Active",
                primary_group_id=assigned_group,
                language=body.language,
                timezone_name=body.timezone_name,
                is_active=True,
                must_change_password=False,
                avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={username_norm}",
                created_at=now,
                updated_at=now,
            )
            db.add(new_user)
            if db.get(GroupModel, assigned_group):
                db.add(UserGroupModel(id=f"ug_{uuid.uuid4().hex[:12]}", user_id=user_id, group_id=assigned_group))
            if is_first_user:
                from app.models.orm_models import SystemStateModel
                db.merge(SystemStateModel(key="active_user_id", value={"user_id": user_id}))
            self.log_audit(
                db,
                "FIRST_USER_GLOBAL_ADMIN_SIGNUP" if is_first_user else "USER_SIGNUP",
                "User",
                user_id,
                new_user.name,
                new_user.email,
                "SUCCESS",
                {"ip": ip_address, "role": assigned_role, "is_first_user": is_first_user},
            )
            db.commit()

        return self.login(
            LoginRequest(username_or_email=body.email, password=body.password, remember_me=False),
            ip_address=ip_address,
            user_agent=user_agent,
        )


    def refresh_token(self, refresh_token_str: str) -> LoginResponse:
        try:
            payload = decode_token(refresh_token_str)
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token de atualização inválido ou expirado.",
            )

        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Tipo de token inválido para refresh.",
            )

        user_id = payload.get("sub")
        with self.get_session() as db:
            user = db.get(UserModel, user_id)
            if not user or not user.is_active:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Usuário associado ao token não encontrado ou inativo.",
                )

            permissions = self.get_user_permissions(db, user.id)
            groups = self.get_user_group_names(db, user.id)

            now = datetime.now(timezone.utc)
            access_token, jti, exp = create_access_token(
                subject=user.id,
                email=user.email,
                role=user.role,
                permissions=permissions,
                groups=groups,
            )
            new_refresh_token, _, _ = create_refresh_token(subject=user.id)

            return LoginResponse(
                access_token=access_token,
                refresh_token=new_refresh_token,
                token_type="bearer",
                expires_in=int((exp - now).total_seconds()),
                user=UserBasicInfo(
                    id=user.id,
                    name=user.name,
                    email=user.email,
                    username=user.username,
                    role=user.role,
                    avatar_url=user.avatar_url,
                    status=user.status,
                    must_change_password=user.must_change_password,
                    permissions=permissions,
                    groups=groups,
                ),
            )

    def logout(self, token_jti: str, user_id: str) -> None:
        with self.get_session() as db:
            if token_jti:
                # Blacklist token
                bl = TokenBlacklistModel(
                    id=f"bl_{uuid.uuid4().hex[:12]}",
                    token_jti=token_jti,
                    user_id=user_id,
                    reason="user_logout",
                    expires_at=datetime.now(timezone.utc) + timedelta(days=7),
                    revoked_at=datetime.now(timezone.utc),
                )
                db.add(bl)

                # Deactivate session
                sess = db.scalar(select(SessionModel).where(SessionModel.token_jti == token_jti))
                if sess:
                    sess.is_active = False

            user = db.get(UserModel, user_id)
            user_email = user.email if user else user_id
            self.log_audit(db, "LOGOUT", "User", user_id, user_email, user_email, "SUCCESS", {})
            db.commit()

    def change_password(self, user_id: str, current_password: str, new_password: str) -> None:
        with self.get_session() as db:
            user = db.get(UserModel, user_id)
            if not user:
                raise HTTPException(status_code=404, detail="Usuário não encontrado.")

            if not verify_password(current_password, user.password_hash):
                raise HTTPException(status_code=400, detail="Senha atual incorreta.")

            if len(new_password) < 8:
                raise HTTPException(status_code=400, detail="A nova senha deve ter no mínimo 8 caracteres.")

            user.password_hash = hash_password(new_password)
            user.must_change_password = False
            user.updated_at = datetime.now(timezone.utc)

            self.log_audit(db, "PASSWORD_CHANGE", "User", user.id, user.name, user.email, "SUCCESS", {})
            db.commit()

    # ---------------------------------------------------------------------------
    # Permissions & Groups Resolvers
    # ---------------------------------------------------------------------------
    def get_user_permissions(self, db: Session, user_id: str) -> list[str]:
        user = db.get(UserModel, user_id)
        if not user:
            return []

        # Global Admin has all permissions automatically
        if user.role.lower() in ["global admin", "global_admin"]:
            all_perms = db.scalars(select(PermissionModel.code)).all()
            return sorted(list(set(all_perms)))

        # Find user groups
        group_ids = db.scalars(select(UserGroupModel.group_id).where(UserGroupModel.user_id == user_id)).all()
        if user.primary_group_id and user.primary_group_id not in group_ids:
            group_ids.append(user.primary_group_id)

        # Find roles from groups
        group_role_ids = db.scalars(select(GroupRoleModel.role_id).where(GroupRoleModel.group_id.in_(group_ids))).all() if group_ids else []

        # Find direct role ID matching user.role name
        direct_role = db.scalar(select(IamRoleModel).where(func.lower(IamRoleModel.name) == func.lower(user.role)))
        role_ids = list(set(group_role_ids + ([direct_role.id] if direct_role else [])))

        # Find permissions for roles
        if not role_ids:
            return ["components:read", "modules:read", "templates:read", "rules:read", "specifications:read", "architectures:read", "blueprints:read", "projects:read"]

        perm_ids = db.scalars(select(RolePermissionModel.permission_id).where(RolePermissionModel.role_id.in_(role_ids))).all()
        perm_codes = db.scalars(select(PermissionModel.code).where(PermissionModel.id.in_(perm_ids))).all() if perm_ids else []
        return sorted(list(set(perm_codes)))

    def is_token_blacklisted(self, jti: str) -> bool:
        if not jti:
            return False
        with self.get_session() as db:
            bl = db.scalar(select(TokenBlacklistModel).where(TokenBlacklistModel.token_jti == jti))
            return bl is not None

    def get_user_group_names(self, db: Session, user_id: str) -> list[str]:
        group_ids = db.scalars(select(UserGroupModel.group_id).where(UserGroupModel.user_id == user_id)).all()
        if not group_ids:
            return []
        return list(db.scalars(select(GroupModel.name).where(GroupModel.id.in_(group_ids))).all())

    # ---------------------------------------------------------------------------
    # 2. User Management CRUD
    # ---------------------------------------------------------------------------
    def list_users(
        self,
        search: str | None = None,
        role: str | None = None,
        status_filter: str | None = None,
        group_id: str | None = None,
    ) -> list[UserResponse]:
        with self.get_session() as db:
            query = select(UserModel)
            if search:
                pattern = f"%{search.strip().lower()}%"
                query = query.where(
                    or_(
                        func.lower(UserModel.name).like(pattern),
                        func.lower(UserModel.email).like(pattern),
                        func.lower(UserModel.username).like(pattern),
                    )
                )
            if role:
                query = query.where(UserModel.role == role)
            if status_filter:
                query = query.where(UserModel.status == status_filter)
            if group_id:
                member_ids = db.scalars(select(UserGroupModel.user_id).where(UserGroupModel.group_id == group_id)).all()
                query = query.where(or_(UserModel.primary_group_id == group_id, UserModel.id.in_(member_ids or ["__none__"])))

            users = db.scalars(query.order_by(UserModel.created_at.desc())).all()
            res = []
            for u in users:
                perms = self.get_user_permissions(db, u.id)
                groups = self.get_user_group_names(db, u.id)
                res.append(
                    UserResponse(
                        id=u.id,
                        name=u.name,
                        first_name=u.first_name,
                        last_name=u.last_name,
                        username=u.username,
                        email=u.email,
                        role=u.role,
                        status=u.status,
                        primary_group_id=u.primary_group_id,
                        language=u.language,
                        timezone_name=u.timezone_name,
                        is_active=u.is_active,
                        must_change_password=u.must_change_password,
                        avatar_url=u.avatar_url,
                        failed_login_attempts=u.failed_login_attempts,
                        locked_until=u.locked_until,
                        last_login_at=u.last_login_at,
                        created_at=u.created_at,
                        updated_at=u.updated_at,
                        groups=groups,
                        permissions=perms,
                    )
                )
            return res

    def get_user(self, user_id: str) -> UserResponse:
        with self.get_session() as db:
            u = db.get(UserModel, user_id)
            if not u:
                raise HTTPException(status_code=404, detail="Usuário não encontrado.")
            perms = self.get_user_permissions(db, u.id)
            groups = self.get_user_group_names(db, u.id)
            return UserResponse(
                id=u.id,
                name=u.name,
                first_name=u.first_name,
                last_name=u.last_name,
                username=u.username,
                email=u.email,
                role=u.role,
                status=u.status,
                primary_group_id=u.primary_group_id,
                language=u.language,
                timezone_name=u.timezone_name,
                is_active=u.is_active,
                must_change_password=u.must_change_password,
                avatar_url=u.avatar_url,
                failed_login_attempts=u.failed_login_attempts,
                locked_until=u.locked_until,
                last_login_at=u.last_login_at,
                created_at=u.created_at,
                updated_at=u.updated_at,
                groups=groups,
                permissions=perms,
            )

    def create_user(self, body: UserCreateRequest, actor_email: str = "system@olivelas.com.br") -> UserResponse:
        with self.get_session() as db:
            existing = db.scalar(
                select(UserModel).where(
                    or_(
                        UserModel.email == body.email.strip().lower(),
                        UserModel.username == body.username.strip().lower(),
                    )
                )
            )
            if existing:
                raise HTTPException(
                    status_code=400,
                    detail=f"Usuário ou e-mail já cadastrado ({body.email}).",
                )

            existing_users_count = db.scalar(select(func.count(UserModel.id))) or 0
            is_first_user = existing_users_count == 0
            effective_role = "Global Admin" if is_first_user else body.role
            effective_group = "grp_admin" if is_first_user else body.primary_group_id
            effective_group_ids = list(body.group_ids or [])
            if effective_group and effective_group not in effective_group_ids:
                effective_group_ids.append(effective_group)

            user_id = f"usr_{uuid.uuid4().hex[:12]}"
            avatar = f"https://api.dicebear.com/7.x/avataaars/svg?seed={body.username}"
            new_user = UserModel(
                id=user_id,
                name=body.name,
                first_name=body.first_name or body.name.split()[0],
                last_name=body.last_name or (body.name.split()[-1] if len(body.name.split()) > 1 else ""),
                username=body.username.strip().lower(),
                email=body.email.strip().lower(),
                password_hash=hash_password(body.password),
                role=effective_role,
                status=body.status,
                primary_group_id=effective_group,
                language=body.language,
                timezone_name=body.timezone_name,
                is_active=(body.status == "Active"),
                must_change_password=body.must_change_password,
                avatar_url=avatar,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(new_user)

            # Assign groups
            for grp_id in effective_group_ids:
                db.add(UserGroupModel(id=f"ug_{uuid.uuid4().hex[:12]}", user_id=user_id, group_id=grp_id))

            if is_first_user:
                from app.models.orm_models import SystemStateModel
                db.merge(SystemStateModel(key="active_user_id", value={"user_id": user_id}))

            self.log_audit(
                db,
                "USER_CREATE",
                "User",
                user_id,
                actor_email,
                actor_email,
                "SUCCESS",
                {"email": body.email, "role": effective_role, "is_first_user": is_first_user},
            )
            db.commit()
            return self.get_user(user_id)

    def update_user(self, user_id: str, body: UserUpdateRequest, actor_email: str = "system@olivelas.com.br") -> UserResponse:
        with self.get_session() as db:
            u = db.get(UserModel, user_id)
            if not u:
                raise HTTPException(status_code=404, detail="Usuário não encontrado.")

            if body.name is not None:
                u.name = body.name
            if body.first_name is not None:
                u.first_name = body.first_name
            if body.last_name is not None:
                u.last_name = body.last_name
            if body.role is not None:
                u.role = body.role
            if body.status is not None:
                u.status = body.status
                u.is_active = (body.status == "Active")
            if body.primary_group_id is not None:
                u.primary_group_id = body.primary_group_id
            if body.language is not None:
                u.language = body.language
            if body.timezone_name is not None:
                u.timezone_name = body.timezone_name
            if body.avatar_url is not None:
                u.avatar_url = body.avatar_url
            if body.is_active is not None:
                u.is_active = body.is_active
                u.status = "Active" if body.is_active else "Inactive"

            if body.group_ids is not None:
                db.execute(delete(UserGroupModel).where(UserGroupModel.user_id == user_id))
                for gid in body.group_ids:
                    db.add(UserGroupModel(id=f"ug_{uuid.uuid4().hex[:12]}", user_id=user_id, group_id=gid))

            u.updated_at = datetime.now(timezone.utc)
            self.log_audit(db, "USER_UPDATE", "User", user_id, actor_email, actor_email, "SUCCESS", {"updated_fields": list(body.model_dump(exclude_unset=True).keys())})
            db.commit()
            return self.get_user(user_id)

    def delete_user(self, user_id: str, actor_email: str = "system@olivelas.com.br") -> None:
        with self.get_session() as db:
            u = db.get(UserModel, user_id)
            if not u:
                raise HTTPException(status_code=404, detail="Usuário não encontrado.")
            if u.role == "Global Admin" and u.email == "willian.jesus@olivelas.com.br":
                raise HTTPException(status_code=400, detail="O Administrador Global do Sistema não pode ser removido.")

            db.execute(delete(UserGroupModel).where(UserGroupModel.user_id == user_id))
            db.execute(delete(SessionModel).where(SessionModel.user_id == user_id))
            db.delete(u)
            self.log_audit(db, "USER_DELETE", "User", user_id, actor_email, actor_email, "SUCCESS", {"email": u.email})
            db.commit()

    def admin_reset_password(self, user_id: str, new_password: str, force_change: bool = True, actor_email: str = "system@olivelas.com.br") -> None:
        with self.get_session() as db:
            u = db.get(UserModel, user_id)
            if not u:
                raise HTTPException(status_code=404, detail="Usuário não encontrado.")

            u.password_hash = hash_password(new_password)
            u.must_change_password = force_change
            u.failed_login_attempts = 0
            u.locked_until = None
            u.updated_at = datetime.now(timezone.utc)

            self.log_audit(db, "USER_ADMIN_RESET_PASSWORD", "User", user_id, actor_email, actor_email, "SUCCESS", {"force_change": force_change})
            db.commit()

    def unlock_user(self, user_id: str, actor_email: str = "system@olivelas.com.br") -> None:
        with self.get_session() as db:
            u = db.get(UserModel, user_id)
            if not u:
                raise HTTPException(status_code=404, detail="Usuário não encontrado.")

            u.locked_until = None
            u.failed_login_attempts = 0
            u.updated_at = datetime.now(timezone.utc)

            self.log_audit(db, "USER_UNLOCK", "User", user_id, actor_email, actor_email, "SUCCESS", {})
            db.commit()

    # ---------------------------------------------------------------------------
    # 3. Groups CRUD
    # ---------------------------------------------------------------------------
    def list_groups(self) -> list[GroupResponse]:
        with self.get_session() as db:
            groups = db.scalars(select(GroupModel).order_by(GroupModel.name.asc())).all()
            res = []
            for g in groups:
                m_count = db.scalar(select(func.count(UserGroupModel.id)).where(UserGroupModel.group_id == g.id)) or 0
                r_ids = db.scalars(select(GroupRoleModel.role_id).where(GroupRoleModel.group_id == g.id)).all()
                r_names = list(db.scalars(select(IamRoleModel.name).where(IamRoleModel.id.in_(r_ids))).all()) if r_ids else []
                res.append(
                    GroupResponse(
                        id=g.id,
                        name=g.name,
                        slug=g.slug,
                        description=g.description,
                        color=g.color,
                        icon=g.icon,
                        status=g.status,
                        is_system=g.is_system,
                        created_at=g.created_at,
                        updated_at=g.updated_at,
                        member_count=m_count,
                        role_count=len(r_names),
                        roles=r_names,
                    )
                )
            return res

    def get_group(self, group_id: str) -> GroupResponse:
        with self.get_session() as db:
            g = db.get(GroupModel, group_id)
            if not g:
                raise HTTPException(status_code=404, detail="Grupo não encontrado.")
            m_count = db.scalar(select(func.count(UserGroupModel.id)).where(UserGroupModel.group_id == g.id)) or 0
            r_ids = db.scalars(select(GroupRoleModel.role_id).where(GroupRoleModel.group_id == g.id)).all()
            r_names = list(db.scalars(select(IamRoleModel.name).where(IamRoleModel.id.in_(r_ids))).all()) if r_ids else []
            return GroupResponse(
                id=g.id,
                name=g.name,
                slug=g.slug,
                description=g.description,
                color=g.color,
                icon=g.icon,
                status=g.status,
                is_system=g.is_system,
                created_at=g.created_at,
                updated_at=g.updated_at,
                member_count=m_count,
                role_count=len(r_names),
                roles=r_names,
            )

    def create_group(self, body: GroupCreateRequest, actor_email: str = "system@olivelas.com.br") -> GroupResponse:
        with self.get_session() as db:
            gid = f"grp_{uuid.uuid4().hex[:12]}"
            slug = body.name.lower().replace(" ", "-")
            new_grp = GroupModel(
                id=gid,
                name=body.name,
                slug=slug,
                description=body.description,
                color=body.color,
                icon=body.icon,
                status=body.status,
                is_system=False,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(new_grp)

            for rid in body.role_ids:
                db.add(GroupRoleModel(id=f"gr_{uuid.uuid4().hex[:12]}", group_id=gid, role_id=rid))

            self.log_audit(db, "GROUP_CREATE", "Group", gid, actor_email, actor_email, "SUCCESS", {"name": body.name})
            db.commit()
            return self.get_group(gid)

    def update_group(self, group_id: str, body: GroupUpdateRequest, actor_email: str = "system@olivelas.com.br") -> GroupResponse:
        with self.get_session() as db:
            g = db.get(GroupModel, group_id)
            if not g:
                raise HTTPException(status_code=404, detail="Grupo não encontrado.")

            if body.name is not None:
                g.name = body.name
                g.slug = body.name.lower().replace(" ", "-")
            if body.description is not None:
                g.description = body.description
            if body.color is not None:
                g.color = body.color
            if body.icon is not None:
                g.icon = body.icon
            if body.status is not None:
                g.status = body.status

            if body.role_ids is not None:
                db.execute(delete(GroupRoleModel).where(GroupRoleModel.group_id == group_id))
                for rid in body.role_ids:
                    db.add(GroupRoleModel(id=f"gr_{uuid.uuid4().hex[:12]}", group_id=group_id, role_id=rid))

            g.updated_at = datetime.now(timezone.utc)
            self.log_audit(db, "GROUP_UPDATE", "Group", group_id, actor_email, actor_email, "SUCCESS", {})
            db.commit()
            return self.get_group(group_id)

    def delete_group(self, group_id: str, actor_email: str = "system@olivelas.com.br") -> None:
        with self.get_session() as db:
            g = db.get(GroupModel, group_id)
            if not g:
                raise HTTPException(status_code=404, detail="Grupo não encontrado.")
            if g.is_system:
                raise HTTPException(status_code=400, detail="Grupos de sistema protegidos não podem ser excluídos.")

            db.execute(delete(UserGroupModel).where(UserGroupModel.group_id == group_id))
            db.execute(delete(GroupRoleModel).where(GroupRoleModel.group_id == group_id))
            db.delete(g)
            self.log_audit(db, "GROUP_DELETE", "Group", group_id, actor_email, actor_email, "SUCCESS", {"name": g.name})
            db.commit()

    def duplicate_group(self, group_id: str, actor_email: str = "system@olivelas.com.br") -> GroupResponse:
        with self.get_session() as db:
            g = db.get(GroupModel, group_id)
            if not g:
                raise HTTPException(status_code=404, detail="Grupo não encontrado.")

            new_gid = f"grp_{uuid.uuid4().hex[:12]}"
            new_name = f"{g.name} (Cópia)"
            new_grp = GroupModel(
                id=new_gid,
                name=new_name,
                slug=new_name.lower().replace(" ", "-"),
                description=f"Cópia de {g.name}",
                color=g.color,
                icon=g.icon,
                status="Active",
                is_system=False,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(new_grp)

            # Copy roles
            r_ids = db.scalars(select(GroupRoleModel.role_id).where(GroupRoleModel.group_id == group_id)).all()
            for rid in r_ids:
                db.add(GroupRoleModel(id=f"gr_{uuid.uuid4().hex[:12]}", group_id=new_gid, role_id=rid))

            self.log_audit(db, "GROUP_DUPLICATE", "Group", new_gid, actor_email, actor_email, "SUCCESS", {"original": group_id})
            db.commit()
            return self.get_group(new_gid)

    def list_group_members(self, group_id: str) -> list[UserResponse]:
        with self.get_session() as db:
            g = db.get(GroupModel, group_id)
            if not g:
                raise HTTPException(status_code=404, detail="Grupo não encontrado.")
        return self.list_users(group_id=group_id)

    def add_group_member(self, group_id: str, user_id: str, actor_email: str = "system@olivelas.com.br") -> dict[str, Any]:
        with self.get_session() as db:
            g = db.get(GroupModel, group_id)
            if not g:
                raise HTTPException(status_code=404, detail="Grupo não encontrado.")
            u = db.get(UserModel, user_id)
            if not u:
                raise HTTPException(status_code=404, detail="Usuário não encontrado.")

            existing = db.scalar(
                select(UserGroupModel).where(
                    UserGroupModel.group_id == group_id,
                    UserGroupModel.user_id == user_id,
                )
            )
            if not existing:
                db.add(UserGroupModel(id=f"ug_{uuid.uuid4().hex[:12]}", user_id=user_id, group_id=group_id))
            if not u.primary_group_id:
                u.primary_group_id = group_id
            u.updated_at = datetime.now(timezone.utc)
            g.updated_at = datetime.now(timezone.utc)

            self.log_audit(
                db,
                "GROUP_MEMBER_ADD",
                "Group",
                group_id,
                actor_email,
                actor_email,
                "SUCCESS",
                {"group_id": group_id, "user_id": user_id, "user_email": u.email},
            )
            db.commit()
            return {
                "group_id": group_id,
                "group_name": g.name,
                "user_id": user_id,
                "user_email": u.email,
                "status": "added",
            }

    def remove_group_member(self, group_id: str, user_id: str, actor_email: str = "system@olivelas.com.br") -> dict[str, Any]:
        with self.get_session() as db:
            g = db.get(GroupModel, group_id)
            if not g:
                raise HTTPException(status_code=404, detail="Grupo não encontrado.")
            u = db.get(UserModel, user_id)
            if not u:
                raise HTTPException(status_code=404, detail="Usuário não encontrado.")

            db.execute(
                delete(UserGroupModel).where(
                    UserGroupModel.group_id == group_id,
                    UserGroupModel.user_id == user_id,
                )
            )
            if u.primary_group_id == group_id:
                u.primary_group_id = None
            u.updated_at = datetime.now(timezone.utc)
            g.updated_at = datetime.now(timezone.utc)

            self.log_audit(
                db,
                "GROUP_MEMBER_REMOVE",
                "Group",
                group_id,
                actor_email,
                actor_email,
                "SUCCESS",
                {"group_id": group_id, "user_id": user_id, "user_email": u.email},
            )
            db.commit()
            return {
                "group_id": group_id,
                "user_id": user_id,
                "status": "removed",
            }

    def get_application_iam_contract(self) -> dict[str, Any]:
        """Returns the canonical IAM Contract for Client Applications (Gap 10)."""
        role_matrix = {
            "Global Admin": ["*"],
            "Admin": [
                "users:read", "users:write", "users:delete",
                "groups:read", "groups:write", "groups:delete", "groups:members",
                "roles:read", "roles:write",
                "permissions:read",
                "audit:read",
                "projects:read", "projects:write", "projects:delete",
                "blueprints:read", "blueprints:write",
            ],
            "Developer": [
                "users:read",
                "groups:read",
                "roles:read",
                "permissions:read",
                "audit:read",
                "projects:read", "projects:write",
                "blueprints:read", "blueprints:write",
                "components:read", "components:write",
                "modules:read", "modules:write",
                "templates:read", "templates:write",
            ],
            "Viewer": [
                "users:read",
                "groups:read",
                "roles:read",
                "permissions:read",
                "projects:read",
                "blueprints:read",
                "components:read",
                "modules:read",
                "templates:read",
                "rules:read",
                "specifications:read",
                "architectures:read",
            ],
        }
        sec_cfg = {
            "jwt_algorithm": "HS256",
            # Derived from ACCESS_TOKEN_EXPIRE_MINUTES (app/core/security.py) so this
            # contract can never drift from the value actually used to sign tokens.
            "access_token_ttl_seconds": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "refresh_token_ttl_seconds": 604800,
            "password_policy": {
                "min_length": 8,
                "hash_algorithm": "PBKDF2-HMAC-SHA256 (100,000 iterations) / bcrypt",
            },
            "account_lockout": {
                "max_failed_attempts": 5,
                "lockout_duration_minutes": 15,
                "http_status_when_locked": 423,
                "error_code": "ACCOUNT_LOCKED",
            },
            "rate_limit": {
                "login_requests_per_minute": 10,
                "api_requests_per_minute": 120,
                "http_status_when_limited": 429,
                "error_code": "RATE_LIMITED",
            },
            "browser_token_storage": "memory_or_session_storage_with_http_only_refresh_cookie",
        }
        bootstrap = self.get_bootstrap_status()
        return {
            "contract_version": "1.0.0",
            "module_id": "mod_auth_identity_be",
            "specification_id": "spec_be_loft_backend_security_specification",
            "bootstrap_status": bootstrap,
            "self_registration": {
                "enabled": True,
                "endpoints": ["/api/v1/iam/auth/signup", "/api/v1/iam/signup"],
                "first_user_role": "Global Admin",
                "first_user_group_id": "grp_admin",
                "default_role": "Viewer",
                "default_group_id": "grp_viewers",
                "status_code": 201,
                "request_schema": {
                    "name": "string (required)",
                    "email": "string (required, valid email)",
                    "username": "string (optional, defaults to email prefix)",
                    "password": "string (required, min 8 chars)",
                },
            },
            "role_permission_matrix": role_matrix,
            "role_permissions_matrix": role_matrix,
            "group_membership_endpoints": {
                "list_members": {
                    "method": "GET",
                    "path": "/api/v1/iam/groups/{group_id}/members",
                    "response_status": 200,
                },
                "add_member": {
                    "method": "POST",
                    "path": "/api/v1/iam/groups/{group_id}/members",
                    "request_body": {"user_id": "usr_..."},
                    "response_status": 201,
                },
                "remove_member": {
                    "method": "DELETE",
                    "path": "/api/v1/iam/groups/{group_id}/members/{user_id}",
                    "response_status": 200,
                },
            },
            "security_defaults": sec_cfg,
            "security_configuration": sec_cfg,
        }

    # ---------------------------------------------------------------------------
    # 4. Roles CRUD
    # ---------------------------------------------------------------------------
    def list_roles(self) -> list[IamRoleResponse]:
        with self.get_session() as db:
            roles = db.scalars(select(IamRoleModel).order_by(IamRoleModel.priority.desc())).all()
            res = []
            for r in roles:
                p_ids = db.scalars(select(RolePermissionModel.permission_id).where(RolePermissionModel.role_id == r.id)).all()
                p_codes = list(db.scalars(select(PermissionModel.code).where(PermissionModel.id.in_(p_ids))).all()) if p_ids else []
                res.append(
                    IamRoleResponse(
                        id=r.id,
                        name=r.name,
                        slug=r.slug,
                        category=r.category,
                        priority=r.priority,
                        description=r.description,
                        status=r.status,
                        is_system=r.is_system,
                        created_at=r.created_at,
                        updated_at=r.updated_at,
                        permission_count=len(p_codes),
                        permissions=p_codes,
                    )
                )
            return res

    def get_role(self, role_id: str) -> IamRoleResponse:
        with self.get_session() as db:
            r = db.get(IamRoleModel, role_id)
            if not r:
                raise HTTPException(status_code=404, detail="Role não encontrada.")
            p_ids = db.scalars(select(RolePermissionModel.permission_id).where(RolePermissionModel.role_id == r.id)).all()
            p_codes = list(db.scalars(select(PermissionModel.code).where(PermissionModel.id.in_(p_ids))).all()) if p_ids else []
            return IamRoleResponse(
                id=r.id,
                name=r.name,
                slug=r.slug,
                category=r.category,
                priority=r.priority,
                description=r.description,
                status=r.status,
                is_system=r.is_system,
                created_at=r.created_at,
                updated_at=r.updated_at,
                permission_count=len(p_codes),
                permissions=p_codes,
            )

    def create_role(self, body: IamRoleCreateRequest, actor_email: str = "system@olivelas.com.br") -> IamRoleResponse:
        with self.get_session() as db:
            rid = f"rol_{uuid.uuid4().hex[:12]}"
            slug = body.name.lower().replace(" ", "-")
            new_role = IamRoleModel(
                id=rid,
                name=body.name,
                slug=slug,
                category=body.category,
                priority=body.priority,
                description=body.description,
                status=body.status,
                is_system=False,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(new_role)

            for pid in body.permission_ids:
                db.add(RolePermissionModel(id=f"rp_{uuid.uuid4().hex[:12]}", role_id=rid, permission_id=pid))

            self.log_audit(db, "ROLE_CREATE", "Role", rid, actor_email, actor_email, "SUCCESS", {"name": body.name})
            db.commit()
            return self.get_role(rid)

    def update_role(self, role_id: str, body: IamRoleUpdateRequest, actor_email: str = "system@olivelas.com.br") -> IamRoleResponse:
        with self.get_session() as db:
            r = db.get(IamRoleModel, role_id)
            if not r:
                raise HTTPException(status_code=404, detail="Role não encontrada.")

            if body.name is not None:
                r.name = body.name
                r.slug = body.name.lower().replace(" ", "-")
            if body.category is not None:
                r.category = body.category
            if body.priority is not None:
                r.priority = body.priority
            if body.description is not None:
                r.description = body.description
            if body.status is not None:
                r.status = body.status

            if body.permission_ids is not None:
                db.execute(delete(RolePermissionModel).where(RolePermissionModel.role_id == role_id))
                for pid in body.permission_ids:
                    db.add(RolePermissionModel(id=f"rp_{uuid.uuid4().hex[:12]}", role_id=role_id, permission_id=pid))

            r.updated_at = datetime.now(timezone.utc)
            self.log_audit(db, "ROLE_UPDATE", "Role", role_id, actor_email, actor_email, "SUCCESS", {})
            db.commit()
            return self.get_role(role_id)

    def delete_role(self, role_id: str, actor_email: str = "system@olivelas.com.br") -> None:
        with self.get_session() as db:
            r = db.get(IamRoleModel, role_id)
            if not r:
                raise HTTPException(status_code=404, detail="Role não encontrada.")
            if r.is_system:
                raise HTTPException(status_code=400, detail="Papéis protegidos de sistema não podem ser removidos.")

            db.execute(delete(RolePermissionModel).where(RolePermissionModel.role_id == role_id))
            db.execute(delete(GroupRoleModel).where(GroupRoleModel.role_id == role_id))
            db.delete(r)
            self.log_audit(db, "ROLE_DELETE", "Role", role_id, actor_email, actor_email, "SUCCESS", {"name": r.name})
            db.commit()

    # ---------------------------------------------------------------------------
    # 5. Permissions & Permission Matrix
    # ---------------------------------------------------------------------------
    def list_permissions(self) -> list[PermissionResponse]:
        with self.get_session() as db:
            perms = db.scalars(select(PermissionModel).order_by(PermissionModel.module.asc(), PermissionModel.name.asc())).all()
            return [
                PermissionResponse(
                    id=p.id,
                    code=p.code,
                    name=p.name,
                    category=p.category,
                    module=p.module,
                    description=p.description,
                    created_at=p.created_at,
                )
                for p in perms
            ]

    def create_permission(self, body: PermissionCreateRequest, actor_email: str = "system@olivelas.com.br") -> PermissionResponse:
        with self.get_session() as db:
            existing = db.scalar(select(PermissionModel).where(PermissionModel.code == body.code))
            if existing:
                raise HTTPException(status_code=400, detail=f"Permissão com código '{body.code}' já existe.")

            pid = f"prm_{uuid.uuid4().hex[:12]}"
            new_perm = PermissionModel(
                id=pid,
                code=body.code,
                name=body.name,
                category=body.category,
                module=body.module,
                description=body.description,
                created_at=datetime.now(timezone.utc),
            )
            db.add(new_perm)

            # Assign to Global Admin role by default
            ga_role = db.scalar(select(IamRoleModel).where(IamRoleModel.name == "Global Admin"))
            if ga_role:
                db.add(RolePermissionModel(id=f"rp_{uuid.uuid4().hex[:12]}", role_id=ga_role.id, permission_id=pid))

            self.log_audit(db, "PERMISSION_CREATE", "Permission", pid, actor_email, actor_email, "SUCCESS", {"code": body.code})
            db.commit()
            return PermissionResponse(
                id=new_perm.id,
                code=new_perm.code,
                name=new_perm.name,
                category=new_perm.category,
                module=new_perm.module,
                description=new_perm.description,
                created_at=new_perm.created_at,
            )

    def update_permission(self, permission_id: str, body: PermissionUpdateRequest, actor_email: str = "system@olivelas.com.br") -> PermissionResponse:
        with self.get_session() as db:
            p = db.get(PermissionModel, permission_id)
            if not p:
                raise HTTPException(status_code=404, detail="Permissão não encontrada.")

            if body.name is not None:
                p.name = body.name
            if body.category is not None:
                p.category = body.category
            if body.module is not None:
                p.module = body.module
            if body.description is not None:
                p.description = body.description

            self.log_audit(db, "PERMISSION_UPDATE", "Permission", permission_id, actor_email, actor_email, "SUCCESS", {})
            db.commit()
            return PermissionResponse(
                id=p.id,
                code=p.code,
                name=p.name,
                category=p.category,
                module=p.module,
                description=p.description,
                created_at=p.created_at,
            )

    def delete_permission(self, permission_id: str, actor_email: str = "system@olivelas.com.br") -> None:
        with self.get_session() as db:
            p = db.get(PermissionModel, permission_id)
            if not p:
                raise HTTPException(status_code=404, detail="Permissão não encontrada.")

            db.execute(delete(RolePermissionModel).where(RolePermissionModel.permission_id == permission_id))
            db.delete(p)
            self.log_audit(db, "PERMISSION_DELETE", "Permission", permission_id, actor_email, actor_email, "SUCCESS", {"code": p.code})
            db.commit()

    def toggle_role_permission(self, permission_id: str, role_name: str, granted: bool, actor_email: str = "system@olivelas.com.br") -> None:
        with self.get_session() as db:
            p = db.get(PermissionModel, permission_id)
            if not p:
                raise HTTPException(status_code=404, detail="Permissão não encontrada.")

            role = db.scalar(
                select(IamRoleModel).where(
                    (IamRoleModel.name == role_name)
                    | (IamRoleModel.id == role_name)
                    | (IamRoleModel.slug == role_name)
                    | (IamRoleModel.slug == role_name.lower().replace(" ", "-"))
                )
            )
            if not role:
                raise HTTPException(status_code=404, detail=f"Role '{role_name}' não encontrada.")

            existing_rp = db.scalar(
                select(RolePermissionModel).where(
                    RolePermissionModel.role_id == role.id,
                    RolePermissionModel.permission_id == permission_id,
                )
            )

            if granted and not existing_rp:
                db.add(RolePermissionModel(id=f"rp_{uuid.uuid4().hex[:12]}", role_id=role.id, permission_id=permission_id))
            elif not granted and existing_rp:
                db.delete(existing_rp)

            self.log_audit(
                db,
                "PERMISSION_TOGGLE",
                "RolePermission",
                f"{role.id}_{permission_id}",
                actor_email,
                actor_email,
                "SUCCESS",
                {"role": role_name, "permission": p.code, "granted": granted},
            )
            db.commit()

    def get_permission_matrix(self) -> list[PermissionMatrixItem]:
        with self.get_session() as db:
            perms = db.scalars(select(PermissionModel).order_by(PermissionModel.module.asc())).all()
            all_roles = {r.id: r.name for r in db.scalars(select(IamRoleModel)).all()}
            all_groups = {g.id: g.name for g in db.scalars(select(GroupModel)).all()}

            res = []
            for p in perms:
                role_ids = db.scalars(select(RolePermissionModel.role_id).where(RolePermissionModel.permission_id == p.id)).all()
                granted_role_names = [all_roles[rid] for rid in role_ids if rid in all_roles]

                # find groups that have those roles
                group_ids = db.scalars(select(GroupRoleModel.group_id).where(GroupRoleModel.role_id.in_(role_ids))).all() if role_ids else []
                granted_group_names = [all_groups[gid] for gid in group_ids if gid in all_groups]

                res.append(
                    PermissionMatrixItem(
                        permission_id=p.id,
                        code=p.code,
                        name=p.name,
                        module=p.module,
                        category=p.category,
                        granted_roles=granted_role_names,
                        granted_groups=granted_group_names,
                    )
                )
            return res


    # ---------------------------------------------------------------------------
    # 6. Active Sessions Management
    # ---------------------------------------------------------------------------
    def list_sessions(self) -> list[SessionResponse]:
        with self.get_session() as db:
            sessions = db.scalars(select(SessionModel).order_by(SessionModel.last_activity.desc())).all()
            users_map = {u.id: u for u in db.scalars(select(UserModel)).all()}
            res = []
            for s in sessions:
                u = users_map.get(s.user_id)
                res.append(
                    SessionResponse(
                        id=s.id,
                        user_id=s.user_id,
                        user_name=u.name if u else "Desconhecido",
                        user_email=u.email if u else s.user_id,
                        ip_address=s.ip_address,
                        user_agent=s.user_agent,
                        browser=s.browser,
                        os_name=s.os_name,
                        device=s.device,
                        is_active=s.is_active,
                        last_activity=s.last_activity,
                        expires_at=s.expires_at,
                        created_at=s.created_at,
                    )
                )
            return res

    def terminate_session(self, session_id: str, actor_email: str = "system@olivelas.com.br") -> None:
        with self.get_session() as db:
            sess = db.get(SessionModel, session_id)
            if not sess:
                raise HTTPException(status_code=404, detail="Sessão não encontrada.")
            sess.is_active = False

            if sess.token_jti:
                db.add(
                    TokenBlacklistModel(
                        id=f"bl_{uuid.uuid4().hex[:12]}",
                        token_jti=sess.token_jti,
                        user_id=sess.user_id,
                        reason="admin_terminated_session",
                        expires_at=datetime.now(timezone.utc) + timedelta(days=7),
                        revoked_at=datetime.now(timezone.utc),
                    )
                )

            self.log_audit(db, "SESSION_TERMINATE", "Session", session_id, actor_email, actor_email, "SUCCESS", {"session_id": session_id})
            db.commit()

    def terminate_all_user_sessions(self, user_id: str, actor_email: str = "system@olivelas.com.br") -> None:
        with self.get_session() as db:
            sessions = db.scalars(select(SessionModel).where(SessionModel.user_id == user_id, SessionModel.is_active == True)).all()
            for s in sessions:
                s.is_active = False
                if s.token_jti:
                    db.add(
                        TokenBlacklistModel(
                            id=f"bl_{uuid.uuid4().hex[:12]}",
                            token_jti=s.token_jti,
                            user_id=s.user_id,
                            reason="logout_all_sessions",
                            expires_at=datetime.now(timezone.utc) + timedelta(days=7),
                            revoked_at=datetime.now(timezone.utc),
                        )
                    )
            self.log_audit(db, "GLOBAL_LOGOUT", "User", user_id, actor_email, actor_email, "SUCCESS", {"terminated_count": len(sessions)})
            db.commit()

    # ---------------------------------------------------------------------------
    # 7. Invitations Management
    # ---------------------------------------------------------------------------
    def list_invitations(self) -> list[InvitationResponse]:
        with self.get_session() as db:
            invites = db.scalars(select(InvitationModel).order_by(InvitationModel.created_at.desc())).all()
            roles_map = {r.id: r.name for r in db.scalars(select(IamRoleModel)).all()}
            groups_map = {g.id: g.name for g in db.scalars(select(GroupModel)).all()}
            users_map = {u.id: u.name for u in db.scalars(select(UserModel)).all()}

            return [
                InvitationResponse(
                    id=i.id,
                    email=i.email,
                    role_id=i.role_id,
                    role_name=roles_map.get(i.role_id, i.role_id),
                    group_id=i.group_id,
                    group_name=groups_map.get(i.group_id, "-") if i.group_id else "-",
                    invited_by_id=i.invited_by_id,
                    invited_by_name=users_map.get(i.invited_by_id, "Admin"),
                    token=i.token,
                    status=i.status,
                    expires_at=i.expires_at,
                    created_at=i.created_at,
                    accepted_at=i.accepted_at,
                )
                for i in invites
            ]

    def create_invitation(self, body: InvitationCreateRequest, actor_id: str, actor_email: str) -> InvitationResponse:
        with self.get_session() as db:
            token = secrets.token_urlsafe(32)
            inv_id = f"inv_{uuid.uuid4().hex[:12]}"
            inv = InvitationModel(
                id=inv_id,
                email=body.email.strip().lower(),
                role_id=body.role_id,
                group_id=body.group_id,
                invited_by_id=actor_id,
                token=token,
                status="Pending",
                expires_at=datetime.now(timezone.utc) + timedelta(days=7),
                created_at=datetime.now(timezone.utc),
            )
            db.add(inv)
            self.log_audit(db, "INVITATION_CREATE", "Invitation", inv_id, actor_email, actor_email, "SUCCESS", {"email": body.email, "role_id": body.role_id})
            db.commit()
            return self.list_invitations()[0]

    def cancel_invitation(self, invitation_id: str, actor_email: str) -> None:
        with self.get_session() as db:
            inv = db.get(InvitationModel, invitation_id)
            if not inv:
                raise HTTPException(status_code=404, detail="Convite não encontrado.")
            inv.status = "Cancelled"
            self.log_audit(db, "INVITATION_CANCEL", "Invitation", invitation_id, actor_email, actor_email, "SUCCESS", {"email": inv.email})
            db.commit()

    # ---------------------------------------------------------------------------
    # 8. Resource Sharing
    # ---------------------------------------------------------------------------
    def list_shares(self, resource_type: str | None = None, resource_id: str | None = None) -> list[ShareResponse]:
        with self.get_session() as db:
            query = select(ShareModel)
            if resource_type:
                query = query.where(ShareModel.resource_type == resource_type)
            if resource_id:
                query = query.where(ShareModel.resource_id == resource_id)

            shares = db.scalars(query.order_by(ShareModel.created_at.desc())).all()
            users_map = {u.id: u.name for u in db.scalars(select(UserModel)).all()}
            groups_map = {g.id: g.name for g in db.scalars(select(GroupModel)).all()}

            res = []
            for s in shares:
                grantor_name = users_map.get(s.grantor_id, "Admin")
                grantee_name = users_map.get(s.grantee_id) if s.grantee_type == "user" else groups_map.get(s.grantee_id)
                res.append(
                    ShareResponse(
                        id=s.id,
                        resource_type=s.resource_type,
                        resource_id=s.resource_id,
                        grantor_id=s.grantor_id,
                        grantor_name=grantor_name,
                        grantee_type=s.grantee_type,
                        grantee_id=s.grantee_id,
                        grantee_name=grantee_name or s.grantee_id,
                        permission_level=s.permission_level,
                        created_at=s.created_at,
                        updated_at=s.updated_at,
                    )
                )
            return res

    def create_share(self, body: ShareCreateRequest, actor_id: str, actor_email: str) -> ShareResponse:
        with self.get_session() as db:
            share_id = f"shr_{uuid.uuid4().hex[:12]}"
            new_share = ShareModel(
                id=share_id,
                resource_type=body.resource_type,
                resource_id=body.resource_id,
                grantor_id=actor_id,
                grantee_type=body.grantee_type,
                grantee_id=body.grantee_id,
                permission_level=body.permission_level,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            )
            db.add(new_share)
            self.log_audit(db, "SHARE_CREATE", "Share", share_id, actor_email, actor_email, "SUCCESS", body.model_dump())
            db.commit()
            return self.list_shares(resource_type=body.resource_type, resource_id=body.resource_id)[0]

    def delete_share(self, share_id: str, actor_email: str) -> None:
        with self.get_session() as db:
            s = db.get(ShareModel, share_id)
            if not s:
                raise HTTPException(status_code=404, detail="Compartilhamento não encontrado.")
            db.delete(s)
            self.log_audit(db, "SHARE_DELETE", "Share", share_id, actor_email, actor_email, "SUCCESS", {})
            db.commit()

    # ---------------------------------------------------------------------------
    # 9. IAM Dashboard Statistics
    # ---------------------------------------------------------------------------
    def get_dashboard_stats(self) -> IamDashboardStats:
        with self.get_session() as db:
            total_users = db.scalar(select(func.count(UserModel.id))) or 0
            active_users = db.scalar(select(func.count(UserModel.id)).where(UserModel.is_active == True)) or 0
            total_groups = db.scalar(select(func.count(GroupModel.id))) or 0
            total_roles = db.scalar(select(func.count(IamRoleModel.id))) or 0
            total_permissions = db.scalar(select(func.count(PermissionModel.id))) or 0
            active_sessions = db.scalar(select(func.count(SessionModel.id)).where(SessionModel.is_active == True)) or 0
            pending_invitations = db.scalar(select(func.count(InvitationModel.id)).where(InvitationModel.status == "Pending")) or 0
            total_shares = db.scalar(select(func.count(ShareModel.id))) or 0

            recent_logs = db.scalars(select(AuditLogModel).order_by(AuditLogModel.timestamp.desc()).limit(10)).all()
            logs_data = [
                {
                    "id": l.id,
                    "action": l.action,
                    "actor": l.actor,
                    "resource": l.resource,
                    "result": l.result,
                    "timestamp": l.timestamp.isoformat(),
                }
                for l in recent_logs
            ]

            return IamDashboardStats(
                total_users=total_users,
                active_users=active_users,
                total_groups=total_groups,
                total_roles=total_roles,
                total_permissions=total_permissions,
                active_sessions=active_sessions,
                pending_invitations=pending_invitations,
                total_shares=total_shares,
                recent_logs=logs_data,
            )


iam_service = IamService()
