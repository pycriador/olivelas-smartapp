#!/usr/bin/env python3
"""
Supabase User Management CLI (`olivelas_smartapp` Isolated Schema)
==================================================================
CLI tool for managing users, roles, groups, passwords, and Global Admin
bootstrap directly in the isolated Supabase schema (`olivelas_smartapp`)
or via the local SQLAlchemy database session.

Examples:
    # 1. Check bootstrap status and list users
    python3 scripts/supabase_users_cli.py list

    # 2. Register the first user (automatically promoted to Global Admin!)
    python3 scripts/supabase_users_cli.py create \
        --name "Willian Jesus" \
        --email "willian.jesus@olivelas.com.br" \
        --username "willian.jesus" \
        --password "StrongPassword123"

    # 3. Create additional users with specific roles (Admin, Editor, Viewer)
    python3 scripts/supabase_users_cli.py create \
        --name "Maria Silva" \
        --email "maria@olivelas.com.br" \
        --password "EditorPassword123" \
        --role "Editor"

    # 4. Promote or change a user's role
    python3 scripts/supabase_users_cli.py set-role \
        --ident "maria@olivelas.com.br" \
        --role "Global Admin"

    # 5. Reset a user's password
    python3 scripts/supabase_users_cli.py reset-password \
        --ident "willian.jesus@olivelas.com.br" \
        --password "NewPassword2026"

    # 6. Verify user credentials
    python3 scripts/supabase_users_cli.py verify \
        --ident "willian.jesus@olivelas.com.br" \
        --password "NewPassword2026"

    # 7. Delete a specific user (or --all to reset for fresh Global Admin signup)
    python3 scripts/supabase_users_cli.py delete --ident "maria@olivelas.com.br"
    python3 scripts/supabase_users_cli.py delete --all
"""
from __future__ import annotations

import argparse
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "app_builder_engine"))

from sqlalchemy import delete, func, or_, select  # noqa: E402
from app.core.config import settings  # noqa: E402
from app.core.security import hash_password, verify_password  # noqa: E402
from app.db.session import SessionLocal, init_db, ISOLATED_SCHEMA  # noqa: E402
from app.models.orm_models import (  # noqa: E402
    GroupModel,
    SessionModel,
    SystemStateModel,
    UserGroupModel,
    UserModel,
)

ROLE_TO_GROUP = {
    "Global Admin": "grp_admin",
    "Admin": "grp_admin",
    "Editor": "grp_editors",
    "Viewer": "grp_viewers",
}


def find_user(session, ident: str) -> UserModel | None:
    ident_norm = ident.strip().lower()
    return session.scalar(
        select(UserModel).where(
            or_(
                func.lower(UserModel.id) == ident_norm,
                func.lower(UserModel.email) == ident_norm,
                func.lower(UserModel.username) == ident_norm,
            )
        )
    )


def cmd_list(args: argparse.Namespace) -> None:
    init_db()
    with SessionLocal() as session:
        users = session.scalars(select(UserModel).order_by(UserModel.created_at.asc())).all()
        print(f"\n=== Supabase Schema `{ISOLATED_SCHEMA}.users` ({len(users)} usuários) ===")
        if not users:
            print("  [BOOTSTRAP PRONTO] Nenhum usuário cadastrado na base.")
            print("  -> O primeiro usuário cadastrado receberá automaticamente o perfil 'Global Admin'!")
            return

        print(f"  {'ID':<18} | {'NOME':<24} | {'EMAIL':<32} | {'ROLE':<14} | {'STATUS':<8}")
        print("  " + "-" * 106)
        for u in users:
            print(f"  {u.id:<18} | {u.name[:24]:<24} | {u.email[:32]:<32} | {u.role:<14} | {u.status:<8}")


def cmd_create(args: argparse.Namespace) -> None:
    init_db()
    with SessionLocal() as session:
        email_norm = args.email.strip().lower()
        username_norm = (args.username or email_norm.split("@")[0]).strip().lower()

        existing = find_user(session, email_norm) or find_user(session, username_norm)
        if existing:
            print(f"[ERRO] Usuário já existe: {existing.email} (ID: {existing.id}, Role: {existing.role})")
            sys.exit(1)

        total_users = session.scalar(select(func.count(UserModel.id))) or 0
        is_first_user = total_users == 0

        role = "Global Admin" if is_first_user else (args.role or "Viewer")
        group_id = ROLE_TO_GROUP.get(role, "grp_viewers")

        user_id = f"usr_{uuid.uuid4().hex[:12]}"
        parts = args.name.strip().split()
        first_name = parts[0] if parts else username_norm
        last_name = parts[-1] if len(parts) > 1 else ""
        now = datetime.now(timezone.utc)

        user = UserModel(
            id=user_id,
            name=args.name.strip(),
            first_name=first_name,
            last_name=last_name,
            username=username_norm,
            email=email_norm,
            password_hash=hash_password(args.password),
            role=role,
            status="Active",
            primary_group_id=group_id,
            language="pt-BR",
            timezone_name="America/Sao_Paulo",
            is_active=True,
            must_change_password=False,
            avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={username_norm}",
            created_at=now,
            updated_at=now,
        )
        session.add(user)

        if session.get(GroupModel, group_id):
            session.add(
                UserGroupModel(
                    id=f"ug_{uuid.uuid4().hex[:12]}",
                    user_id=user_id,
                    group_id=group_id,
                    created_at=now,
                )
            )

        if is_first_user:
            session.merge(SystemStateModel(key="active_user_id", value={"user_id": user_id}))

        session.commit()

        if is_first_user:
            print(f"[SUCESSO - 1º CADASTRO GLOBAL ADMIN] Usuário '{user.name}' ({user.email}) criado como Global Admin!")
        else:
            print(f"[SUCESSO] Usuário '{user.name}' ({user.email}) criado com role '{user.role}' (ID: {user.id}).")


def cmd_set_role(args: argparse.Namespace) -> None:
    init_db()
    with SessionLocal() as session:
        user = find_user(session, args.ident)
        if not user:
            print(f"[ERRO] Usuário '{args.ident}' não encontrado.")
            sys.exit(1)

        old_role = user.role
        new_role = args.role
        new_group = ROLE_TO_GROUP.get(new_role, "grp_viewers")

        user.role = new_role
        user.primary_group_id = new_group
        user.updated_at = datetime.now(timezone.utc)

        session.execute(delete(UserGroupModel).where(UserGroupModel.user_id == user.id))
        session.add(
            UserGroupModel(
                id=f"ug_{uuid.uuid4().hex[:12]}",
                user_id=user.id,
                group_id=new_group,
                created_at=datetime.now(timezone.utc),
            )
        )
        session.commit()
        print(f"[SUCESSO] Role de '{user.email}' alterada de '{old_role}' para '{new_role}' (Grupo: {new_group}).")


def cmd_reset_password(args: argparse.Namespace) -> None:
    init_db()
    with SessionLocal() as session:
        user = find_user(session, args.ident)
        if not user:
            print(f"[ERRO] Usuário '{args.ident}' não encontrado.")
            sys.exit(1)

        user.password_hash = hash_password(args.password)
        user.failed_login_attempts = 0
        user.locked_until = None
        user.status = "Active"
        user.is_active = True
        user.must_change_password = bool(args.force_change)
        user.updated_at = datetime.now(timezone.utc)
        session.commit()
        print(f"[SUCESSO] Senha de '{user.email}' atualizada e conta desbloqueada.")


def cmd_verify(args: argparse.Namespace) -> None:
    init_db()
    with SessionLocal() as session:
        user = find_user(session, args.ident)
        if not user:
            print(f"[FALHA] Usuário '{args.ident}' não encontrado.")
            sys.exit(1)

        ok = verify_password(args.password, user.password_hash)
        if ok:
            print(f"[AUTENTICADO] Credenciais válidas para {user.name} <{user.email}> (Role: {user.role}).")
        else:
            print(f"[FALHA] Senha incorreta para {user.email}.")
            sys.exit(1)


def cmd_delete(args: argparse.Namespace) -> None:
    init_db()
    with SessionLocal() as session:
        if args.all:
            session.execute(delete(SessionModel))
            session.execute(delete(UserGroupModel))
            deleted = session.execute(delete(UserModel)).rowcount
            session.execute(delete(SystemStateModel).where(SystemStateModel.key == "active_user_id"))
            session.commit()
            print(f"[SUCESSO] Todos os {deleted} usuários foram removidos. O próximo cadastro será Global Admin!")
            return

        if not args.ident:
            print("[ERRO] Informe --ident <email|username|id> ou --all.")
            sys.exit(1)

        user = find_user(session, args.ident)
        if not user:
            print(f"[ERRO] Usuário '{args.ident}' não encontrado.")
            sys.exit(1)

        session.execute(delete(SessionModel).where(SessionModel.user_id == user.id))
        session.execute(delete(UserGroupModel).where(UserGroupModel.user_id == user.id))
        session.delete(user)
        session.commit()
        print(f"[SUCESSO] Usuário '{user.email}' ({user.id}) removido.")


def main() -> None:
    parser = argparse.ArgumentParser(
        description=f"CLI para gerenciamento de usuários no Supabase (Schema: {ISOLATED_SCHEMA})"
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # list
    p_list = sub.add_parser("list", help="Lista todos os usuários cadastrados no schema isolado")
    p_list.set_defaults(func=cmd_list)

    # create
    p_create = sub.add_parser("create", help="Cadastra um usuário (o 1º cadastro vira Global Admin automaticamente)")
    p_create.add_argument("--name", required=True, help="Nome completo")
    p_create.add_argument("--email", required=True, help="E-mail do usuário")
    p_create.add_argument("--username", required=False, help="Username (opcional, padrão: prefixo do e-mail)")
    p_create.add_argument("--password", required=True, help="Senha (mín. 8 caracteres com letras e números)")
    p_create.add_argument(
        "--role",
        default="Viewer",
        choices=["Global Admin", "Admin", "Editor", "Viewer"],
        help="Role (ignorado no 1º cadastro, que sempre recebe Global Admin)",
    )
    p_create.set_defaults(func=cmd_create)

    # set-role
    p_role = sub.add_parser("set-role", help="Altera o papel (role) de um usuário existente")
    p_role.add_argument("--ident", required=True, help="E-mail, username ou ID do usuário")
    p_role.add_argument(
        "--role",
        required=True,
        choices=["Global Admin", "Admin", "Editor", "Viewer"],
        help="Novo papel do usuário",
    )
    p_role.set_defaults(func=cmd_set_role)

    # reset-password
    p_pw = sub.add_parser("reset-password", help="Reseta a senha e desbloqueia um usuário")
    p_pw.add_argument("--ident", required=True, help="E-mail, username ou ID do usuário")
    p_pw.add_argument("--password", required=True, help="Nova senha")
    p_pw.add_argument("--force-change", action="store_true", help="Exigir troca de senha no próximo login")
    p_pw.set_defaults(func=cmd_reset_password)

    # verify
    p_ver = sub.add_parser("verify", help="Valida e-mail/username e senha contra o banco Supabase")
    p_ver.add_argument("--ident", required=True, help="E-mail, username ou ID do usuário")
    p_ver.add_argument("--password", required=True, help="Senha para testar")
    p_ver.set_defaults(func=cmd_verify)

    # delete
    p_del = sub.add_parser("delete", help="Remove um usuário ou limpa todos (--all)")
    p_del.add_argument("--ident", required=False, help="E-mail, username ou ID do usuário")
    p_del.add_argument("--all", action="store_true", help="Remove todos os usuários para reiniciar o Global Admin")
    p_del.set_defaults(func=cmd_delete)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
