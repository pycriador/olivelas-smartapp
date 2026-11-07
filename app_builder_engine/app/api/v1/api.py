"""
Main API Router v1
Includes all domain routers, RBAC, AI Agent Gateway, and AI Settings
"""
from fastapi import APIRouter
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.projects_api import router as projects_router
from app.api.v1.blueprints_api import router as blueprints_router
from app.api.v1.catalog_api import router as catalog_router
from app.api.v1.search_api import router as search_router
from app.api.v1.audit_api import router as audit_router
from app.api.v1.rbac_api import router as rbac_router
from app.api.v1.ai_agent_api import router as ai_agent_router
from app.api.v1.ai_gateway import router as ai_gateway_router
from app.api.v1.ai_settings_api import router as ai_settings_router
from app.api.v1.ai_gateway_api import router as ai_gateway_api_router
from app.api.v1.ai_agents_api import router as ai_agents_api_router
from app.api.v1.iam_api import router as iam_router
from app.api.v1.settings_api import router as settings_router
from app.api.v1.builder import router as builder_router
from app.api.v1.knowledge import router as knowledge_router
from app.api.v1.api_client_api import router as api_client_router
from app.api.v1.library_updates_api import router as library_updates_router
from app.api.v1.design_critique_api import router as design_critique_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(dashboard_router)
api_router.include_router(projects_router)
api_router.include_router(blueprints_router)
api_router.include_router(catalog_router)
api_router.include_router(search_router)
api_router.include_router(audit_router)
api_router.include_router(rbac_router)
api_router.include_router(ai_agent_router)
api_router.include_router(ai_gateway_router)
api_router.include_router(ai_gateway_api_router)
api_router.include_router(ai_agents_api_router)
api_router.include_router(ai_settings_router)
api_router.include_router(iam_router)
api_router.include_router(settings_router)
api_router.include_router(builder_router)
api_router.include_router(knowledge_router)
api_router.include_router(api_client_router)
api_router.include_router(library_updates_router)
api_router.include_router(design_critique_router)


