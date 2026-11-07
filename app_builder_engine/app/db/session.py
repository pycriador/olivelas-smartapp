"""
Database session and connection management with SQLAlchemy
Supports Supabase PostgreSQL (with isolated schema `olivelas_smartapp`) and SQLite fallback.
Follows Loft Backend Engineering Foundation
"""
from __future__ import annotations
from contextlib import contextmanager
import logging
import re
from typing import Generator
from sqlalchemy import create_engine, event, text
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings
from app.db.base import Base
# Import models to ensure they are registered with Base.metadata before create_all
import app.models.orm_models  # noqa: F401

logger = logging.getLogger(__name__)


def _validate_schema_name(schema_name: str) -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9_]", "_", (schema_name or "olivelas_smartapp").strip())
    return cleaned or "olivelas_smartapp"


ISOLATED_SCHEMA = _validate_schema_name(getattr(settings, "DB_SCHEMA", "olivelas_smartapp"))


def _build_engine(db_url: str):
    if db_url.startswith("sqlite"):
        return create_engine(
            db_url,
            connect_args={"check_same_thread": False},
            echo=False,
            future=True,
        )

    # PostgreSQL / Supabase engine with isolated schema (olivelas_smartapp)
    pg_engine = create_engine(
        db_url,
        connect_args={
            "options": f"-c search_path={ISOLATED_SCHEMA},public",
            "connect_timeout": 8,
        },
        execution_options={"schema_translate_map": {None: ISOLATED_SCHEMA}},
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=5,
        max_overflow=10,
        echo=False,
        future=True,
    )

    @event.listens_for(pg_engine, "connect")
    def _set_search_path(dbapi_connection, connection_record):
        cursor = dbapi_connection.cursor()
        cursor.execute(f'SET search_path TO "{ISOLATED_SCHEMA}", public')
        cursor.close()

    return pg_engine


engine = _build_engine(settings.DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    expire_on_commit=False,
)


def _switch_to_sqlite_fallback() -> None:
    """Switches to local SQLite if running in an offline/sandboxed test environment."""
    global engine
    fallback_url = "sqlite:///./app_builder.db"
    logger.warning(
        f"Conexão PostgreSQL ({settings.DB_HOST}) indisponível neste ambiente; "
        f"utilizando fallback local SQLite ({fallback_url})."
    )
    engine = _build_engine(fallback_url)
    SessionLocal.configure(bind=engine)


def get_db() -> Generator[Session, None, None]:
    """FastAPI Dependency for obtaining an isolated database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_session() -> Generator[Session, None, None]:
    """Context manager for obtaining a database session outside FastAPI dependency injection."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def init_db() -> None:
    """Creates the isolated PostgreSQL schema (if using Supabase) and all database tables."""
    global engine
    if not str(engine.url).startswith("sqlite"):
        try:
            with engine.begin() as conn:
                conn.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{ISOLATED_SCHEMA}"'))
                conn.execute(text(f'SET search_path TO "{ISOLATED_SCHEMA}", public'))
            Base.metadata.create_all(bind=engine)
            logger.info(
                f"Supabase PostgreSQL schema '{ISOLATED_SCHEMA}' inicializado com sucesso."
            )
            return
        except Exception as exc:
            logger.warning(f"Falha ao conectar ao Supabase PostgreSQL ({exc}).")
            _switch_to_sqlite_fallback()

    Base.metadata.create_all(bind=engine)
