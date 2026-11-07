"""
Dashboard Router
Metrics, Engineering Health, Recent Activities, and System Statistics
"""
from __future__ import annotations
from datetime import datetime, timezone
from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.core.config import settings
from app.domain.entities import EngineeringHealthMetrics, ApiResponse
from app.storage.database import db
from app.services.health_service import engineering_health_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


class EngineStatusResponse(BaseModel):
    status: str = "online"
    service: str
    version: str
    environment: str
    database: str = "SQLite Connected"
    active_projects: int
    active_blueprints: int
    catalog_entities: int
    timestamp: str


@router.get("/engine-status", response_model=ApiResponse[EngineStatusResponse])
async def get_engine_status():
    """Returns real-time operational status of the Loft App Builder Engine."""
    catalog_total = (
        len(db.components)
        + len(db.modules)
        + len(db.templates)
        + len(db.rules)
        + len(db.specifications)
        + len(db.architectures)
    )
    return ApiResponse(
        data=EngineStatusResponse(
            status="online",
            service=settings.app_name,
            version=settings.app_version,
            environment=settings.environment,
            database="SQLite Connected",
            active_projects=len(db.projects),
            active_blueprints=len(db.blueprints),
            catalog_entities=catalog_total,
            timestamp=datetime.now(timezone.utc).isoformat(),
        )
    )


class DashboardMetrics(BaseModel):
    projects_count: int
    blueprints_count: int
    components_count: int
    templates_count: int
    modules_count: int
    rules_count: int
    specifications_count: int
    architectures_count: int
    audit_events_count: int


class ActivityItem(BaseModel):
    id: str
    action: str
    resource: str
    resource_id: str
    user_email: str
    timestamp: str
    result: str
    summary: str


@router.get("/metrics", response_model=ApiResponse[DashboardMetrics])
async def get_dashboard_metrics():
    """Returns real-time platform metrics and counts."""
    data = DashboardMetrics(
        projects_count=len(db.projects),
        blueprints_count=len(db.blueprints),
        components_count=len(db.components),
        templates_count=len(db.templates),
        modules_count=len(db.modules),
        rules_count=len(db.rules),
        specifications_count=len(db.specifications),
        architectures_count=len(db.architectures),
        audit_events_count=len(db.audit_logs),
    )
    return ApiResponse(data=data)


@router.get("/health", response_model=ApiResponse[EngineeringHealthMetrics])
async def get_engineering_health():
    """Returns detailed engineering health & governance indicators."""
    health_metrics = engineering_health_service.get_health_metrics()
    return ApiResponse(data=health_metrics)


@router.get("/activity", response_model=ApiResponse[list[ActivityItem]])
async def get_recent_activity(limit: int = 15):
    """Returns recent platform activities for the dashboard feed."""
    activities = []
    for log in db.audit_logs[:limit]:
        action_val = log.action.value if hasattr(log.action, "value") else str(log.action)
        summary = f"{action_val} em {log.resource} ({log.resource_id})"
        if log.metadata and "name" in log.metadata:
            summary = f"{action_val}: '{log.metadata['name']}'"
        activities.append(
            ActivityItem(
                id=log.id,
                action=action_val,
                resource=log.resource,
                resource_id=log.resource_id,
                user_email=log.actor,
                timestamp=log.timestamp.isoformat(),
                result=log.result,
                summary=summary,
            )
        )
    return ApiResponse(data=activities)
