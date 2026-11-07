"""
App Configuration using Pydantic v2
Follows Loft Backend Foundation Vol I & Engineering System Vol II
Configured with Supabase (Frontend + Backend) and isolated PostgreSQL schema (olivelas_smartapp).
"""
from __future__ import annotations

import logging
import os
from functools import lru_cache
from pathlib import Path
from urllib.parse import quote_plus
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

# Dev-only fallback used when JWT_SECRET_KEY is not present in the environment/.env.
# Never rely on this outside local development — always set JWT_SECRET_KEY in the real .env.
_DEV_FALLBACK_JWT_SECRET_KEY = "loft_super_secure_enterprise_iam_jwt_secret_key_2026"
DEFAULT_ISOLATED_SCHEMA = "olivelas_smartapp"


class Settings(BaseModel):
    PROJECT_NAME: str = Field(default="App Builder Engine")
    VERSION: str = Field(default="1.0.0")
    API_V1_STR: str = Field(default="/api/v1")
    ENVIRONMENT: str = Field(default="development")
    LOG_LEVEL: str = Field(default="INFO")

    @property
    def app_name(self) -> str:
        return self.PROJECT_NAME

    @property
    def app_version(self) -> str:
        return self.VERSION

    @property
    def environment(self) -> str:
        return self.ENVIRONMENT

    # Base paths
    BASE_DIR: Path = Field(default_factory=lambda: Path(__file__).resolve().parent.parent.parent)
    WORKSPACE_ROOT: Path = Field(default_factory=lambda: Path(__file__).resolve().parent.parent.parent.parent)

    # SDD paths relative to workspace root
    SDD_FRONTEND_DIR: Path = Field(
        default_factory=lambda: Path(__file__).resolve().parent.parent.parent.parent / "sdd-frontend"
    )
    SDD_BACKEND_DIR: Path = Field(
        default_factory=lambda: Path(__file__).resolve().parent.parent.parent.parent / "sdd-backend"
    )
    COPAN_DESIGN_DIR: Path = Field(
        default_factory=lambda: Path(__file__).resolve().parent.parent.parent.parent / "copan_design_system"
    )
    CLAUDE_MD_PATH: Path = Field(
        default_factory=lambda: Path(__file__).resolve().parent.parent.parent.parent / "CLAUDE.md"
    )

    # Supabase Frontend & API Settings
    VITE_SUPABASE_URL: str = Field(default="")
    VITE_SUPABASE_KEY: str = Field(default="")
    VITE_SUPABASE_SCHEMA: str = Field(default=DEFAULT_ISOLATED_SCHEMA)

    # Supabase PostgreSQL Backend Settings
    DB_HOST: str = Field(default="")
    DB_PORT: int = Field(default=5432)
    DB_NAME: str = Field(default="postgres")
    DB_USERNAME: str = Field(default="postgres")
    DB_PASSWORD: str = Field(default="")
    DB_SCHEMA: str = Field(default=DEFAULT_ISOLATED_SCHEMA)

    # Database Settings
    DATABASE_URL: str = Field(default="sqlite:///./app_builder.db")

    # AI Gateway Settings
    AI_DEFAULT_PROVIDER: str = Field(default="gemini")
    AI_MAX_ITERATIONS: int = Field(default=10)
    AI_TIMEOUT_SECONDS: int = Field(default=30)

    # Security & CORS
    CORS_ORIGINS: list[str] = Field(default=["*"])

    # Admin & App Builder Credentials (loaded from .env / environment)
    LOFT_ADMIN_USER: str = Field(default="willian.jesus@loft.com.br")
    LOFT_ADMIN_EMAIL: str = Field(default="willian.jesus@loft.com.br")
    LOFT_ADMIN_PASSWORD: str = Field(default="admin_dev_pass")
    AIOPS_APP_BUILDER_USER: str = Field(default="willian.jesus@loft.com.br")
    AIOPS_APP_BUILDER_PASSWORD: str = Field(default="admin_dev_pass")
    DEFAULT_ADMIN_USER: str = Field(default="admin@loft.com.br")
    DEFAULT_ADMIN_PASSWORD: str = Field(default="admin_dev_pass")

    # JWT signing secret, loaded from JWT_SECRET_KEY in the environment/.env.
    jwt_secret_key: str = Field(default=_DEV_FALLBACK_JWT_SECRET_KEY)

    @classmethod
    def load_dotenv_files(cls) -> dict[str, str]:
        base_dir = Path(__file__).resolve().parent.parent.parent
        workspace_root = base_dir.parent
        candidates = [
            workspace_root / ".env",
            workspace_root / ".env.local",
            base_dir / ".env",
            base_dir / ".env.local",
            workspace_root.parent / "aiops_crud_platform" / ".env",
            workspace_root.parent / "aiops_crud_platform" / ".env.local",
            workspace_root.parent / "aiops-stack" / ".env",
            workspace_root.parent / ".env",
        ]
        loaded: dict[str, str] = {}
        for env_path in candidates:
            try:
                if not env_path.exists():
                    continue
                for raw_line in env_path.read_text(encoding="utf-8").splitlines():
                    line = raw_line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip()
                    if (val.startswith('"') and val.endswith('"')) or (
                        val.startswith("'") and val.endswith("'")
                    ):
                        val = val[1:-1]
                    if key and val:
                        loaded[key] = val
                        if key not in os.environ:
                            os.environ[key] = val
                        if key.upper() not in os.environ:
                            os.environ[key.upper()] = val
            except (OSError, PermissionError):
                continue
        return loaded

    @classmethod
    def get_valid_admin_passwords(cls) -> list[str]:
        cls.load_dotenv_files()
        env_keys = [
            "LOFT_ADMIN_PASSWORD",
            "loft_admin_password",
            "AIOPS_APP_BUILDER_PASSWORD",
            "aiops_app_builder_password",
            "DEFAULT_ADMIN_PASSWORD",
            "default_admin_password",
            "BOOTSTRAP_ADMIN_PASSWORD",
            "bootstrap_admin_password",
            "AIOPS_OPSBASE_PASSWORD",
            "aiops_opsbase_password",
            "OPSBASE_ADMIN_PASSWORD",
            "opsbase_admin_password",
        ]
        passwords: list[str] = ["admin_dev_pass"]
        for k in env_keys:
            val = os.getenv(k, "").strip()
            if val and val not in ("your-secure-admin-password", "changeme") and val not in passwords:
                passwords.append(val)
        return passwords

    @classmethod
    def get_valid_admin_identities(cls) -> list[str]:
        cls.load_dotenv_files()
        env_keys = [
            "LOFT_ADMIN_USER",
            "LOFT_ADMIN_EMAIL",
            "AIOPS_APP_BUILDER_USER",
            "aiops_app_builder_user",
            "AIOPS_APP_BUILDER_EMAIL",
            "aiops_app_builder_email",
            "DEFAULT_ADMIN_USER",
            "BOOTSTRAP_ADMIN_EMAIL",
            "BOOTSTRAP_ADMIN_USERNAME",
        ]
        identities: list[str] = [
            "willian.jesus@loft.com.br",
            "willian.jesus",
            "admin@loft.com.br",
            "admin",
        ]
        for k in env_keys:
            val = os.getenv(k, "").strip()
            if val and val not in identities:
                identities.append(val)
        return identities

    @classmethod
    def resolve_effective_db_host_and_user(
        cls,
        db_host: str,
        db_port: int,
        db_username: str,
        supabase_url: str = "",
    ) -> tuple[str, str]:
        """
        Resolves the Supabase PostgreSQL host and username.
        If `db.<project_ref>.supabase.co` is configured (which is IPv6-only on Supabase)
        and the local machine is on an IPv4-only network, automatically falls back to the
        Supabase IPv4 Supavisor Pooler (`aws-1-us-west-2.pooler.supabase.com`) with
        tenant user `<db_username>.<project_ref>`.
        """
        import re
        import socket

        pooler_host = os.getenv("DB_POOLER_HOST") or "aws-1-us-west-2.pooler.supabase.com"
        project_ref = ""
        m = re.search(r"db\.([a-z0-9]+)\.supabase\.co", db_host)
        if m:
            project_ref = m.group(1)
        elif supabase_url:
            m2 = re.search(r"https?://([a-z0-9]+)\.supabase\.co", supabase_url)
            if m2:
                project_ref = m2.group(1)

        if db_host and "supabase.co" in db_host and "pooler.supabase.com" not in db_host:
            try:
                socket.getaddrinfo(db_host, db_port, socket.AF_INET)
                return db_host, db_username
            except OSError:
                # Host has no IPv4 A record or local network has no IPv6 routing; use IPv4 Pooler
                effective_user = (
                    f"{db_username}.{project_ref}"
                    if project_ref and "." not in db_username
                    else db_username
                )
                return pooler_host, effective_user

        if "pooler.supabase.com" in db_host and project_ref and "." not in db_username:
            return db_host, f"{db_username}.{project_ref}"

        return db_host, db_username

    @classmethod
    def build_supabase_postgres_url(
        cls,
        db_host: str,
        db_port: int | str,
        db_name: str,
        db_user: str,
        db_password: str,
        supabase_url: str = "",
    ) -> str:
        driver = "postgresql+psycopg2"
        try:
            import psycopg2  # noqa: F401
        except ImportError:
            try:
                import psycopg  # noqa: F401
                driver = "postgresql+psycopg"
            except ImportError:
                driver = "postgresql"
        eff_host, eff_user = cls.resolve_effective_db_host_and_user(
            db_host=db_host,
            db_port=int(db_port),
            db_username=db_user,
            supabase_url=supabase_url,
        )
        safe_user = quote_plus(eff_user)
        safe_pass = quote_plus(db_password)
        return f"{driver}://{safe_user}:{safe_pass}@{eff_host}:{db_port}/{db_name}?sslmode=require"

    @classmethod
    def load(cls) -> Settings:
        cls.load_dotenv_files()
        env = os.getenv("ENVIRONMENT", os.getenv("APP_ENV", "development"))
        log_level = os.getenv("LOG_LEVEL", "INFO")

        supabase_url = os.getenv("VITE_SUPABASE_URL") or os.getenv("SUPABASE_URL") or ""
        supabase_key = os.getenv("VITE_SUPABASE_KEY") or os.getenv("SUPABASE_KEY") or ""
        db_schema = (
            os.getenv("DB_SCHEMA")
            or os.getenv("db_schema")
            or os.getenv("VITE_SUPABASE_SCHEMA")
            or DEFAULT_ISOLATED_SCHEMA
        )

        db_host = os.getenv("db_host") or os.getenv("DB_HOST") or ""
        db_port_raw = os.getenv("db_port") or os.getenv("DB_PORT") or "5432"
        try:
            db_port = int(db_port_raw)
        except ValueError:
            db_port = 5432
        db_name = os.getenv("db") or os.getenv("DB") or os.getenv("DB_NAME") or "postgres"
        db_username = (
            os.getenv("db_username")
            or os.getenv("DB_USERNAME")
            or os.getenv("username")
            or os.getenv("USERNAME")
            or "postgres"
        )
        # On macOS/Unix, USERNAME env var might be the OS login user if not set in .env;
        # prefer 'postgres' if db_host is supabase and db_username wasn't explicitly set in .env
        if "supabase.co" in db_host and not (os.getenv("db_username") or os.getenv("DB_USERNAME")):
            raw_u = os.getenv("username", "postgres")
            db_username = raw_u if raw_u else "postgres"

        db_password = os.getenv("db_password") or os.getenv("DB_PASSWORD") or ""

        db_url = os.getenv("DATABASE_URL", "")
        force_sqlite = os.getenv("FORCE_SQLITE", "").lower() in ("1", "true", "yes")

        if force_sqlite:
            if not db_url or not db_url.startswith("sqlite"):
                db_url = "sqlite:///./app_builder.db"
        elif (
            db_host
            and db_password
            and db_password != "your-supabase-db-password"
            and (
                not db_url
                or db_url == "sqlite:///./app_builder.db"
                or "db.flxcgbftpwjvxetqbtzq.supabase.co" in db_url
            )
        ):
            db_url = cls.build_supabase_postgres_url(
                db_host=db_host,
                db_port=db_port,
                db_name=db_name,
                db_user=db_username,
                db_password=db_password,
                supabase_url=supabase_url,
            )
        elif not db_url:
            db_url = "sqlite:///./app_builder.db"

        admin_pw = (
            os.getenv("AIOPS_APP_BUILDER_PASSWORD")
            or os.getenv("aiops_app_builder_password")
            or os.getenv("LOFT_ADMIN_PASSWORD")
            or os.getenv("DEFAULT_ADMIN_PASSWORD")
            or "admin_dev_pass"
        )
        if admin_pw == "your-secure-admin-password":
            admin_pw = "admin_dev_pass"
        jwt_secret_key = os.getenv("JWT_SECRET_KEY") or os.getenv("jwt_secret_key")
        if not jwt_secret_key or jwt_secret_key == "your-secure-random-jwt-secret-key-min-32-chars":
            jwt_secret_key = _DEV_FALLBACK_JWT_SECRET_KEY
            logger.warning(
                "JWT_SECRET_KEY não definido (ou com valor de exemplo) no ambiente/.env; "
                "usando segredo de fallback de DESENVOLVIMENTO para assinatura de tokens JWT. "
                "Defina JWT_SECRET_KEY em app_builder_engine/.env para qualquer uso fora do ambiente local."
            )
        admin_user = (
            os.getenv("AIOPS_APP_BUILDER_USER")
            or os.getenv("aiops_app_builder_user")
            or os.getenv("LOFT_ADMIN_USER")
            or os.getenv("LOFT_ADMIN_EMAIL")
            or "willian.jesus@loft.com.br"
        )
        return cls(
            ENVIRONMENT=env,
            LOG_LEVEL=log_level,
            VITE_SUPABASE_URL=supabase_url,
            VITE_SUPABASE_KEY=supabase_key,
            VITE_SUPABASE_SCHEMA=db_schema,
            DB_HOST=db_host,
            DB_PORT=db_port,
            DB_NAME=db_name,
            DB_USERNAME=db_username,
            DB_PASSWORD=db_password,
            DB_SCHEMA=db_schema,
            DATABASE_URL=db_url,
            LOFT_ADMIN_USER=admin_user,
            LOFT_ADMIN_EMAIL=os.getenv("LOFT_ADMIN_EMAIL", admin_user),
            LOFT_ADMIN_PASSWORD=admin_pw,
            AIOPS_APP_BUILDER_USER=admin_user,
            AIOPS_APP_BUILDER_PASSWORD=admin_pw,
            DEFAULT_ADMIN_USER=os.getenv("DEFAULT_ADMIN_USER", "admin@loft.com.br"),
            DEFAULT_ADMIN_PASSWORD=admin_pw,
            jwt_secret_key=jwt_secret_key,
        )


@lru_cache
def get_settings() -> Settings:
    return Settings.load()


settings = get_settings()
