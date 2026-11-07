"""
AI Settings API Router
Provides endpoints to manage multi-provider AI configurations (Gemini, OpenAI, Grok, Copilot, Anthropic, Ollama, Custom),
custom provider CRUD, test connection diagnostics, and live model fetching with RBAC enforcement.
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Depends, status, Path
from app.domain.entities import ApiResponse, ApiListResponse, ApiMeta
from app.schemas.ai_settings_schemas import (
    MultiProviderSettings,
    AiProviderConfigItem,
    AiProviderUpdateRequest,
    AiCustomProviderCreateRequest,
    AiCustomProviderUpdateRequest,
    AiTestConnectionRequest,
    AiTestConnectionResponse,
    AiModelOption,
    AiFetchModelsRequest,
)
from app.services.ai_provider_service import ai_provider_service
from app.services.rbac_service import rbac_service
from app.api.v1.iam_api import get_current_user_claims

router = APIRouter(prefix="/settings/ai", tags=["AI Provider Settings"])


@router.get("", response_model=ApiResponse[MultiProviderSettings])
async def get_ai_settings(claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Returns AI multi-provider settings with masked API keys. Requires ai.providers:view."""
    user_role = claims.get("role", "Viewer")
    # Allow if has ai.providers:view or ai.gateway:view or settings:view
    if not (
        rbac_service.check_permission("ai.providers:view", user_role)
        or rbac_service.check_permission("ai.gateway:view", user_role)
        or rbac_service.check_permission("settings:view", user_role)
    ):
        rbac_service.require_permission("ai.providers:view", user_role)

    settings = ai_provider_service.get_masked_settings()
    return ApiResponse(data=settings)


@router.put("", response_model=ApiResponse[MultiProviderSettings])
async def update_ai_settings(
    body: AiProviderUpdateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Updates AI provider configuration, default model, and hyperparameters. Requires ai.providers:manage."""
    user_role = claims.get("role", "Viewer")
    rbac_service.require_permission("ai.providers:manage", user_role)

    actor = claims.get("email", "willian.jesus@olivelas.com.br")
    updated = ai_provider_service.update_settings(body, actor=actor)
    return ApiResponse(data=updated)


@router.post("/test", response_model=ApiResponse[AiTestConnectionResponse])
async def test_ai_connection(
    body: AiTestConnectionRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Tests connection to the specified AI provider and model. Requires ai.providers:test or ai.providers:manage."""
    user_role = claims.get("role", "Viewer")
    if not (
        rbac_service.check_permission("ai.providers:test", user_role)
        or rbac_service.check_permission("ai.providers:manage", user_role)
        or rbac_service.check_permission("ai.gateway:execute", user_role)
    ):
        rbac_service.require_permission("ai.providers:test", user_role)

    res = await ai_provider_service.test_connection(body)
    return ApiResponse(data=res)


@router.post("/providers", response_model=ApiResponse[AiProviderConfigItem], status_code=status.HTTP_201_CREATED)
async def create_custom_provider(
    body: AiCustomProviderCreateRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Creates a new custom OpenAI-compatible AI provider gateway. Requires ai.providers:manage."""
    user_role = claims.get("role", "Viewer")
    rbac_service.require_permission("ai.providers:manage", user_role)

    actor = claims.get("email", "willian.jesus@olivelas.com.br")
    created = ai_provider_service.create_custom_provider(body, actor=actor)
    return ApiResponse(data=created, message="Provedor customizado adicionado com sucesso.")


@router.put("/providers/{provider_id}", response_model=ApiResponse[AiProviderConfigItem])
async def update_provider_by_id(
    provider_id: str = Path(..., description="ID of the provider to update"),
    body: AiCustomProviderUpdateRequest = None,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Updates specific settings of an AI provider. Requires ai.providers:manage."""
    user_role = claims.get("role", "Viewer")
    rbac_service.require_permission("ai.providers:manage", user_role)

    actor = claims.get("email", "willian.jesus@olivelas.com.br")
    updated = ai_provider_service.update_provider_by_id(provider_id, body or AiCustomProviderUpdateRequest(), actor=actor)
    return ApiResponse(data=updated, message="Configurações do provedor atualizadas com sucesso.")


@router.delete("/providers/{provider_id}", status_code=status.HTTP_200_OK)
async def delete_provider_by_id(
    provider_id: str = Path(..., description="ID of the provider to delete/reset"),
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Deletes a custom provider or resets credentials of a built-in provider. Requires ai.providers:manage."""
    user_role = claims.get("role", "Viewer")
    rbac_service.require_permission("ai.providers:manage", user_role)

    actor = claims.get("email", "willian.jesus@olivelas.com.br")
    result = ai_provider_service.delete_provider_by_id(provider_id, actor=actor)
    return ApiResponse(data=result, message="Provedor excluído/redefinido com sucesso.")


@router.post("/providers/{provider_id}/fetch-models", response_model=ApiListResponse[AiModelOption])
async def fetch_models_for_provider(
    provider_id: str = Path(..., description="Provider ID (e.g. gemini, openai, grok, ollama, custom)"),
    body: AiFetchModelsRequest = None,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Fetches real live models directly from provider API or endpoint. Requires ai.providers:manage."""
    user_role = claims.get("role", "Viewer")
    rbac_service.require_permission("ai.providers:manage", user_role)

    api_key = body.api_key if body else None
    base_url = body.base_url if body else None
    models = await ai_provider_service.fetch_live_models_for_provider(provider_id, api_key=api_key, base_url=base_url)
    return ApiListResponse(
        data=models,
        meta=ApiMeta(page=1, page_size=len(models), total=len(models)),
        message=f"{len(models)} modelos carregados com sucesso do provedor '{provider_id}'.",
    )


@router.post("/gemini/fetch-models", response_model=ApiListResponse[AiModelOption])
async def fetch_gemini_models(
    body: AiFetchModelsRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    """Fetches real live models directly from Google Gemini API using the provided API key."""
    user_role = claims.get("role", "Viewer")
    rbac_service.require_permission("ai.providers:manage", user_role)

    models = await ai_provider_service.fetch_gemini_live_models(body.api_key)
    return ApiListResponse(
        data=models,
        meta=ApiMeta(page=1, page_size=len(models), total=len(models)),
        message=f"{len(models)} modelos carregados com sucesso diretamente da Google Generative Language API.",
    )


@router.get("/models", response_model=ApiListResponse[AiModelOption])
async def list_ai_models(claims: dict[str, Any] = Depends(get_current_user_claims)):
    """Returns full catalog of available AI models across all providers."""
    models = ai_provider_service.get_all_models()
    return ApiListResponse(
        data=models,
        meta=ApiMeta(page=1, page_size=len(models), total=len(models)),
    )
