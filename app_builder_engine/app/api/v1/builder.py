"""
Project Builder Router (The Central Brain)
Generates full architectural blueprints and agent instructions from requirements
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, status
from app.schemas.builder import (
    GenerateProjectPlanRequest,
    ProjectBlueprintResponse,
)
from app.services.project_builder_service import ProjectBuilderService

router = APIRouter(prefix="/builder", tags=["Project Builder Engine"])


def get_builder_service() -> ProjectBuilderService:
    return ProjectBuilderService()


@router.post("/generate-plan", response_model=ProjectBlueprintResponse, status_code=status.HTTP_200_OK)
async def generate_project_plan(
    body: GenerateProjectPlanRequest,
    service: ProjectBuilderService = Depends(get_builder_service),
):
    """
    Compile high-level requirements into a full Technical Implementation Blueprint.
    Returns:
    - Standard architecture pattern
    - Tailored folder structure
    - Required frontend and backend components with usage specs
    - Standard REST API contracts
    - Applicable architectural rules and security checklists
    - Execution steps and system prompt for the AI Agent (Cursor, Claude, Antigravity)
    """
    return service.generate_blueprint(body)
