#!/usr/bin/env python3
"""
Supabase Migration & Platform Seed CLI (`olivelas_smartapp` isolated schema)
=============================================================================
Applies SQL migrations from `supabase/migrations/` to Supabase PostgreSQL
and synchronizes platform configurations, RBAC roles/permissions/groups,
catalog components, modules, templates, rules, architectures, specifications,
and knowledge base documentation into the isolated schema `olivelas_smartapp`.

Follows the migration policy:
- Users and Projects tables remain empty (`0` rows) so the user can re-register them.
- The very first user registered on the platform is automatically promoted to
  `Global Admin` (`grp_admin`) via both PostgreSQL trigger and IAM Service.

Usage:
    python3 scripts/supabase_migrate.py --generate-sql
    python3 scripts/supabase_migrate.py --apply
    python3 scripts/supabase_migrate.py --status
    python3 scripts/supabase_migrate.py --reset-users-and-projects
"""
from __future__ import annotations

import argparse
import json
import os
import sqlite3
import sys
from pathlib import Path
from typing import Any

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "app_builder_engine"))

from app.core.config import Settings  # noqa: E402

MIGRATIONS_DIR = REPO_ROOT / "supabase" / "migrations"
SEED_MIGRATION_FILE = MIGRATIONS_DIR / "20261107000003_seed_platform_config_and_catalog.sql"
LOCAL_SQLITE_DB = REPO_ROOT / "app_builder_engine" / "app_builder.db"


def sql_literal(val: Any, is_json: bool = False, is_bool: bool = False) -> str:
    if val is None:
        return "NULL"
    if is_bool:
        return "TRUE" if bool(val) else "FALSE"
    if is_json:
        if isinstance(val, (dict, list)):
            raw = json.dumps(val, ensure_ascii=False)
        else:
            try:
                parsed = json.loads(val)
                raw = json.dumps(parsed, ensure_ascii=False)
            except Exception:
                raw = json.dumps(val, ensure_ascii=False)
        escaped = raw.replace("'", "''")
        return f"'{escaped}'::jsonb"
    escaped = str(val).replace("'", "''")
    return f"'{escaped}'"


def generate_seed_migration_sql() -> Path:
    """Generates `20261107000003_seed_platform_config_and_catalog.sql` from canonical platform config."""
    if not LOCAL_SQLITE_DB.exists():
        raise FileNotFoundError(f"Local SQLite database not found at {LOCAL_SQLITE_DB}")

    conn = sqlite3.connect(str(LOCAL_SQLITE_DB))
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    lines: list[str] = [
        "-- =============================================================================",
        "-- Migration 003: Seed Platform Configurations, RBAC Matrix, Customizations & Catalog",
        "-- Target Schema: olivelas_smartapp (Isolated Schema in Supabase PostgreSQL)",
        "-- Policy: Excludes users and projects so the first registration becomes Global Admin.",
        "-- =============================================================================",
        "",
        "SET search_path TO olivelas_smartapp, public;",
        "",
    ]

    # 1. IAM Groups (System groups)
    lines.append("-- 1. IAM Groups")
    for r in cur.execute("SELECT * FROM groups WHERE is_system = 1 ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.groups "
            "(id, name, slug, description, color, icon, status, is_system) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['name'])}, {sql_literal(r['slug'])}, "
            f"{sql_literal(r['description'])}, {sql_literal(r['color'])}, {sql_literal(r['icon'])}, "
            f"{sql_literal(r['status'])}, {sql_literal(r['is_system'], is_bool=True)}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "name = EXCLUDED.name, description = EXCLUDED.description, color = EXCLUDED.color, icon = EXCLUDED.icon;"
        )

    # 2. IAM Roles
    lines.append("\n-- 2. IAM Roles")
    for r in cur.execute("SELECT * FROM iam_roles ORDER BY priority DESC"):
        lines.append(
            "INSERT INTO olivelas_smartapp.iam_roles "
            "(id, name, slug, category, priority, description, status, is_system) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['name'])}, {sql_literal(r['slug'])}, "
            f"{sql_literal(r['category'])}, {int(r['priority'])}, {sql_literal(r['description'])}, "
            f"{sql_literal(r['status'])}, {sql_literal(r['is_system'], is_bool=True)}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "name = EXCLUDED.name, priority = EXCLUDED.priority, description = EXCLUDED.description;"
        )

    # 3. IAM Permissions
    lines.append("\n-- 3. IAM Permissions")
    for r in cur.execute("SELECT * FROM permissions ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.permissions "
            "(id, code, name, category, module, description) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['code'])}, {sql_literal(r['name'])}, "
            f"{sql_literal(r['category'])}, {sql_literal(r['module'])}, {sql_literal(r['description'])}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "code = EXCLUDED.code, name = EXCLUDED.name, description = EXCLUDED.description;"
        )

    # 4. IAM Group Roles
    lines.append("\n-- 4. IAM Group Roles")
    for r in cur.execute("SELECT * FROM group_roles ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.group_roles (id, group_id, role_id) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['group_id'])}, {sql_literal(r['role_id'])}"
            ") ON CONFLICT (id) DO NOTHING;"
        )

    # 5. IAM Role Permissions
    lines.append("\n-- 5. IAM Role Permissions")
    for r in cur.execute("SELECT * FROM role_permissions ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.role_permissions (id, role_id, permission_id) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['role_id'])}, {sql_literal(r['permission_id'])}"
            ") ON CONFLICT (id) DO NOTHING;"
        )

    # 6. Platform System States (sanitized for Git commit)
    lines.append("\n-- 6. Platform System States & Personalizations")
    for r in cur.execute("SELECT key, value FROM system_states ORDER BY key"):
        k = r["key"]
        if k in ("active_user_id", "ai_gateway_execution_logs"):
            continue
        val = json.loads(r["value"])
        if k == "ai_providers_config" and isinstance(val, dict):
            for p in val.get("providers", []):
                p["api_key"] = ""
                p["has_api_key"] = False
                p["api_key_masked"] = ""
        lines.append(
            "INSERT INTO olivelas_smartapp.system_states (key, value) VALUES ("
            f"{sql_literal(k)}, {sql_literal(val, is_json=True)}"
            ") ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;"
        )

    # 7. Canonical Architectures
    lines.append("\n-- 7. Canonical Architectures")
    for r in cur.execute("SELECT * FROM architectures ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.architectures "
            "(id, name, slug, category, description, version, status, characteristics, recommended_for, "
            "restrictions, layers, recommended_modules, canonical_folder_structure, folder_tree, "
            "modules, components, rules, specifications, versions) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['name'])}, {sql_literal(r['slug'])}, "
            f"{sql_literal(r['category'])}, {sql_literal(r['description'])}, {sql_literal(r['version'])}, "
            f"{sql_literal(r['status'])}, {sql_literal(r['characteristics'], is_json=True)}, "
            f"{sql_literal(r['recommended_for'], is_json=True)}, {sql_literal(r['restrictions'], is_json=True)}, "
            f"{sql_literal(r['layers'], is_json=True)}, {sql_literal(r['recommended_modules'], is_json=True)}, "
            f"{sql_literal(r['canonical_folder_structure'], is_json=True)}, {sql_literal(r['folder_tree'])}, "
            f"{sql_literal(r['modules'], is_json=True)}, {sql_literal(r['components'], is_json=True)}, "
            f"{sql_literal(r['rules'], is_json=True)}, {sql_literal(r['specifications'], is_json=True)}, "
            f"{sql_literal(r['versions'], is_json=True)}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "name = EXCLUDED.name, description = EXCLUDED.description, status = EXCLUDED.status;"
        )

    # 8. Golden Rules
    lines.append("\n-- 8. Golden Rules")
    for r in cur.execute("SELECT * FROM rules ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.rules "
            "(id, name, slug, category, priority, scope, description, rule_statement, applies_to, "
            "exceptions, dependencies, specifications, status, version, bad_example, good_example, "
            "referenced_spec, versions) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['name'])}, {sql_literal(r['slug'])}, "
            f"{sql_literal(r['category'])}, {sql_literal(r['priority'])}, {sql_literal(r['scope'])}, "
            f"{sql_literal(r['description'])}, {sql_literal(r['rule_statement'])}, "
            f"{sql_literal(r['applies_to'], is_json=True)}, {sql_literal(r['exceptions'], is_json=True)}, "
            f"{sql_literal(r['dependencies'], is_json=True)}, {sql_literal(r['specifications'], is_json=True)}, "
            f"{sql_literal(r['status'])}, {sql_literal(r['version'])}, {sql_literal(r['bad_example'])}, "
            f"{sql_literal(r['good_example'])}, {sql_literal(r['referenced_spec'])}, "
            f"{sql_literal(r['versions'], is_json=True)}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "name = EXCLUDED.name, description = EXCLUDED.description, rule_statement = EXCLUDED.rule_statement;"
        )

    # 9. Domain Modules
    lines.append("\n-- 9. Domain Modules")
    for r in cur.execute("SELECT * FROM modules ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.modules "
            "(id, name, slug, category, description, status, version, owner, components, apis, "
            "dependencies, rules, specifications, templates, tags, versions) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['name'])}, {sql_literal(r['slug'])}, "
            f"{sql_literal(r['category'])}, {sql_literal(r['description'])}, {sql_literal(r['status'])}, "
            f"{sql_literal(r['version'])}, {sql_literal(r['owner'])}, "
            f"{sql_literal(r['components'], is_json=True)}, {sql_literal(r['apis'], is_json=True)}, "
            f"{sql_literal(r['dependencies'], is_json=True)}, {sql_literal(r['rules'], is_json=True)}, "
            f"{sql_literal(r['specifications'], is_json=True)}, {sql_literal(r['templates'], is_json=True)}, "
            f"{sql_literal(r['tags'], is_json=True)}, {sql_literal(r['versions'], is_json=True)}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "name = EXCLUDED.name, description = EXCLUDED.description, status = EXCLUDED.status;"
        )

    # 10. Application Templates
    lines.append("\n-- 10. Application Templates")
    for r in cur.execute("SELECT * FROM templates ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.templates "
            "(id, name, slug, category, description, status, version, architecture, architecture_id, "
            "owner, modules, components, rules, specifications, composition_tree, tags, versions) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['name'])}, {sql_literal(r['slug'])}, "
            f"{sql_literal(r['category'])}, {sql_literal(r['description'])}, {sql_literal(r['status'])}, "
            f"{sql_literal(r['version'])}, {sql_literal(r['architecture'])}, {sql_literal(r['architecture_id'])}, "
            f"{sql_literal(r['owner'])}, {sql_literal(r['modules'], is_json=True)}, "
            f"{sql_literal(r['components'], is_json=True)}, {sql_literal(r['rules'], is_json=True)}, "
            f"{sql_literal(r['specifications'], is_json=True)}, {sql_literal(r['composition_tree'], is_json=True)}, "
            f"{sql_literal(r['tags'], is_json=True)}, {sql_literal(r['versions'], is_json=True)}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "name = EXCLUDED.name, description = EXCLUDED.description, status = EXCLUDED.status;"
        )

    # 11. Components Catalog
    lines.append("\n-- 11. Components Catalog")
    for r in cur.execute("SELECT * FROM components ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.components "
            "(id, name, slug, category, type, description, status, version, owner, tags, dependencies, "
            "rules, specifications, modules, templates, props_contract, preview_code, documentation, "
            "interface_spec, example_usage, versions) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['name'])}, {sql_literal(r['slug'])}, "
            f"{sql_literal(r['category'])}, {sql_literal(r['type'])}, {sql_literal(r['description'])}, "
            f"{sql_literal(r['status'])}, {sql_literal(r['version'])}, {sql_literal(r['owner'])}, "
            f"{sql_literal(r['tags'], is_json=True)}, {sql_literal(r['dependencies'], is_json=True)}, "
            f"{sql_literal(r['rules'], is_json=True)}, {sql_literal(r['specifications'], is_json=True)}, "
            f"{sql_literal(r['modules'], is_json=True)}, {sql_literal(r['templates'], is_json=True)}, "
            f"{sql_literal(r['props_contract'], is_json=True)}, {sql_literal(r['preview_code'])}, "
            f"{sql_literal(r['documentation'])}, {sql_literal(r['interface_spec'])}, "
            f"{sql_literal(r['example_usage'])}, {sql_literal(r['versions'], is_json=True)}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "name = EXCLUDED.name, description = EXCLUDED.description, preview_code = EXCLUDED.preview_code;"
        )

    # 12. Specifications
    lines.append("\n-- 12. SDD Specifications")
    for r in cur.execute("SELECT * FROM specifications ORDER BY id"):
        lines.append(
            "INSERT INTO olivelas_smartapp.specifications "
            "(id, name, title, slug, category, version, status, description, summary, content, "
            "tags, related_components, related_rules, related_templates, related_architectures, "
            "related_modules, versions) VALUES ("
            f"{sql_literal(r['id'])}, {sql_literal(r['name'])}, {sql_literal(r['title'])}, "
            f"{sql_literal(r['slug'])}, {sql_literal(r['category'])}, {sql_literal(r['version'])}, "
            f"{sql_literal(r['status'])}, {sql_literal(r['description'])}, {sql_literal(r['summary'])}, "
            f"{sql_literal(r['content'])}, {sql_literal(r['tags'], is_json=True)}, "
            f"{sql_literal(r['related_components'], is_json=True)}, {sql_literal(r['related_rules'], is_json=True)}, "
            f"{sql_literal(r['related_templates'], is_json=True)}, {sql_literal(r['related_architectures'], is_json=True)}, "
            f"{sql_literal(r['related_modules'], is_json=True)}, {sql_literal(r['versions'], is_json=True)}"
            ") ON CONFLICT (id) DO UPDATE SET "
            "title = EXCLUDED.title, summary = EXCLUDED.summary, content = EXCLUDED.content;"
        )

    conn.close()
    MIGRATIONS_DIR.mkdir(parents=True, exist_ok=True)
    SEED_MIGRATION_FILE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return SEED_MIGRATION_FILE


def get_pg_connection():
    import psycopg2

    Settings.load_dotenv_files()
    cfg = Settings.load()
    eff_host, eff_user = Settings.resolve_effective_db_host_and_user(
        db_host=cfg.DB_HOST,
        db_port=cfg.DB_PORT,
        db_username=cfg.DB_USERNAME,
        supabase_url=cfg.VITE_SUPABASE_URL,
    )
    print(f"[Supabase Migrate] Connecting to {eff_host}:{cfg.DB_PORT} as {eff_user} (schema={cfg.DB_SCHEMA})...")
    return psycopg2.connect(
        host=eff_host,
        port=cfg.DB_PORT,
        dbname=cfg.DB_NAME,
        user=eff_user,
        password=cfg.DB_PASSWORD,
        sslmode="require",
        connect_timeout=15,
    )


def apply_migrations(sync_knowledge_docs: bool = True, reset_users_and_projects: bool = False) -> None:
    if not SEED_MIGRATION_FILE.exists():
        generate_seed_migration_sql()

    conn = get_pg_connection()
    conn.autocommit = True
    cur = conn.cursor()

    migration_files = sorted(MIGRATIONS_DIR.glob("*.sql"))
    for mf in migration_files:
        print(f"[Supabase Migrate] Applying {mf.name} ...")
        sql_text = mf.read_text(encoding="utf-8")
        cur.execute(sql_text)
        print(f"  -> OK ({mf.name})")

    # Sync knowledge_documents from local SQLite DB (401 docs)
    if sync_knowledge_docs and LOCAL_SQLITE_DB.exists():
        print("[Supabase Migrate] Synchronizing knowledge_documents (400+ docs) into olivelas_smartapp...")
        sconn = sqlite3.connect(str(LOCAL_SQLITE_DB))
        sconn.row_factory = sqlite3.Row
        scur = sconn.cursor()
        docs = scur.execute("SELECT * FROM knowledge_documents").fetchall()
        for d in docs:
            cur.execute(
                """
                INSERT INTO olivelas_smartapp.knowledge_documents
                (id, title, category, volume, file_path, summary, key_points, tags, content, author, version, source_url, is_custom)
                VALUES (%s, %s, %s, %s, %s, %s, %s::jsonb, %s::jsonb, %s, %s, %s, %s, %s)
                ON CONFLICT (id) DO UPDATE SET
                    title = EXCLUDED.title,
                    category = EXCLUDED.category,
                    summary = EXCLUDED.summary,
                    content = EXCLUDED.content
                """,
                (
                    d["id"],
                    d["title"],
                    d["category"],
                    d["volume"],
                    d["file_path"],
                    d["summary"],
                    d["key_points"] if isinstance(d["key_points"], str) else json.dumps(d["key_points"] or []),
                    d["tags"] if isinstance(d["tags"], str) else json.dumps(d["tags"] or []),
                    d["content"],
                    d["author"],
                    d["version"],
                    d["source_url"],
                    bool(d["is_custom"]),
                ),
            )
        sconn.close()
        print(f"  -> Synced {len(docs)} knowledge documents.")

    if reset_users_and_projects:
        print("[Supabase Migrate] Clearing users, sessions, projects, and blueprints for fresh start...")
        for tbl in (
            "sessions",
            "token_blacklist",
            "invitations",
            "shares",
            "user_groups",
            "users",
            "blueprints",
            "projects",
        ):
            cur.execute(f"DELETE FROM olivelas_smartapp.{tbl};")
        cur.execute("DELETE FROM olivelas_smartapp.system_states WHERE key = 'active_user_id';")
        print("  -> Cleared users & projects. Next registered user will be Global Admin!")

    cur.close()
    conn.close()


def show_status() -> None:
    conn = get_pg_connection()
    cur = conn.cursor()
    tables = [
        "users",
        "groups",
        "iam_roles",
        "permissions",
        "role_permissions",
        "group_roles",
        "components",
        "modules",
        "templates",
        "rules",
        "architectures",
        "specifications",
        "knowledge_documents",
        "system_states",
        "projects",
        "blueprints",
    ]
    print("\n=== Supabase Schema `olivelas_smartapp` Status ===")
    for t in tables:
        cur.execute(f"SELECT COUNT(*) FROM olivelas_smartapp.{t}")
        cnt = cur.fetchone()[0]
        print(f"  olivelas_smartapp.{t:<22}: {cnt} rows")
    cur.execute("SELECT COUNT(*) FROM olivelas_smartapp.users")
    u_cnt = cur.fetchone()[0]
    if u_cnt == 0:
        print("\n[BOOTSTRAP READY] 0 users registered -> Next user registered will automatically be Global Admin!")
    else:
        cur.execute("SELECT id, name, email, role FROM olivelas_smartapp.users ORDER BY created_at ASC")
        print("\nRegistered Users:")
        for r in cur.fetchall():
            print(f"  - {r[1]} <{r[2]}> (ID: {r[0]}, Role: {r[3]})")
    cur.close()
    conn.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Supabase Migration & Seed CLI for olivelas_smartapp")
    parser.add_argument("--generate-sql", action="store_true", help="Generate SQL seed migration file")
    parser.add_argument("--apply", action="store_true", help="Apply all migrations to Supabase PostgreSQL")
    parser.add_argument("--reset-users-and-projects", action="store_true", help="Reset users and projects to 0")
    parser.add_argument("--status", action="store_true", help="Show table counts in olivelas_smartapp schema")
    args = parser.parse_args()

    if args.generate_sql:
        out = generate_seed_migration_sql()
        print(f"Generated {out} ({out.stat().st_size} bytes)")
    if args.apply:
        apply_migrations(reset_users_and_projects=args.reset_users_and_projects)
        show_status()
    elif args.reset_users_and_projects:
        apply_migrations(sync_knowledge_docs=False, reset_users_and_projects=True)
        show_status()
    elif args.status:
        show_status()
    elif not args.generate_sql:
        parser.print_help()


if __name__ == "__main__":
    main()
