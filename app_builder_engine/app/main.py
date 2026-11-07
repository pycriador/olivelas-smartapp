"""
App Builder Engine — Main Application Entrypoint
Integrates FastAPI, API Routers, Error Handlers, Middlewares, and Frontend SPA
"""
from __future__ import annotations
import os
import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from starlette.exceptions import HTTPException as StarletteHTTPException
from app.api.v1.api import api_router
from app.core.config import get_settings
from app.core.errors import (
    ApplicationError,
    application_error_handler,
    generic_exception_handler,
    http_exception_handler,
)
from app.core.logging import setup_logging

settings = get_settings()
logger = setup_logging()

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
INDEX_HTML = os.path.join(STATIC_DIR, "index.html")


from app.db.session import init_db, SessionLocal
from app.db.seed import seed_database


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.app_name} v{settings.app_version} in {settings.environment}")
    # Initialize SQLite schema and canonical database seed
    init_db()
    with SessionLocal() as session:
        seed_database(session)
    logger.info("SQLite database initialized and canonical seed verified.")
    yield
    logger.info(f"Shutting down {settings.app_name}")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Plataforma de Engenharia de Software Orientada por IA",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

# Exception Handlers
app.add_exception_handler(ApplicationError, application_error_handler)
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Middlewares
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_process_time_and_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID") or f"req_{uuid.uuid4().hex[:12]}"
    request.state.request_id = request_id
    start_time = time.perf_counter()

    response = await call_next(request)

    process_time_ms = round((time.perf_counter() - start_time) * 1000, 2)
    response.headers["X-Request-ID"] = request_id
    response.headers["X-Process-Time-Ms"] = str(process_time_ms)
    return response


# Include API Routers
app.include_router(api_router)


# Static Files & SPA Route
STATIC_DIST_DIR = os.path.join(STATIC_DIR, "dist")
ASSETS_DIR = os.path.join(STATIC_DIST_DIR, "assets")
DIST_INDEX_HTML = os.path.join(STATIC_DIST_DIR, "index.html")
GENERATED_APPS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "generated_apps"))

if os.path.exists(ASSETS_DIR):
    app.mount("/assets", StaticFiles(directory=ASSETS_DIR), name="assets")

if os.path.exists(STATIC_DIR):
    app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

if os.path.exists(GENERATED_APPS_DIR):
    app.mount("/generated_apps", StaticFiles(directory=GENERATED_APPS_DIR, html=True), name="generated_apps")


@app.get("/", include_in_schema=False)
async def serve_spa_index():
    if os.path.exists(DIST_INDEX_HTML):
        return FileResponse(DIST_INDEX_HTML)
    if os.path.exists(INDEX_HTML):
        return FileResponse(INDEX_HTML)
    return JSONResponse(
        content={
            "app": settings.app_name,
            "version": settings.app_version,
            "status": "online",
            "docs": "/docs",
        }
    )


@app.get("/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "app": settings.app_name,
        "version": settings.app_version,
        "environment": settings.environment,
    }


@app.get("/{full_path:path}", include_in_schema=False)
async def serve_spa_fallback(full_path: str):
    # Do not catch API or docs paths
    if full_path.startswith("api/") or full_path.startswith("docs") or full_path.startswith("redoc") or full_path == "openapi.json":
        return JSONResponse(
            status_code=404,
            content={"error": {"code": "NOT_FOUND", "message": f"Resource /{full_path} not found", "details": {}}},
        )
    if os.path.exists(DIST_INDEX_HTML):
        return FileResponse(DIST_INDEX_HTML)
    if os.path.exists(INDEX_HTML):
        return FileResponse(INDEX_HTML)
    return JSONResponse(
        content={
            "app": settings.app_name,
            "version": settings.app_version,
            "status": "online",
            "docs": "/docs",
        }
    )
