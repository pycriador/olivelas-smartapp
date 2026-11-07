"""
HTTP Client Router (HTTP Client & External Source Management)
"""
from __future__ import annotations
from fastapi import APIRouter, Depends, Header
from app.domain.models import (
    ApiClientSource,
    ApiSavedRequest,
    ApiExecutionRequest,
    ApiExecutionResponse,
)
from app.services.api_client_service import ApiClientService, api_client_service

router = APIRouter(prefix="/api-client", tags=["HTTP Client & External Sources"])


def get_api_client_service() -> ApiClientService:
    return api_client_service


@router.post("/execute", response_model=ApiExecutionResponse)
async def execute_http_request(
    body: ApiExecutionRequest,
    service: ApiClientService = Depends(get_api_client_service),
):
    """Execute live HTTP request with headers, auth, parameters, and measure latency."""
    return await service.execute_request(body)


@router.get("/sources", response_model=list[ApiClientSource])
async def list_sources(
    service: ApiClientService = Depends(get_api_client_service),
):
    """List configured external API client sources (Confluence, GitHub, Swagger, etc.)."""
    return service.list_sources()


@router.post("/sources", response_model=ApiClientSource)
async def create_or_update_source(
    body: ApiClientSource,
    service: ApiClientService = Depends(get_api_client_service),
):
    """Create or update external API source credentials and base URL."""
    return service.create_or_update_source(body)


@router.delete("/sources/{source_id}")
async def delete_source(
    source_id: str,
    service: ApiClientService = Depends(get_api_client_service),
):
    """Delete an API source."""
    success = service.delete_source(source_id)
    return {"data": {"deleted": success, "source_id": source_id}}


@router.get("/requests", response_model=list[ApiSavedRequest])
async def list_saved_requests(
    service: ApiClientService = Depends(get_api_client_service),
):
    """List saved request collections."""
    return service.list_saved_requests()


@router.post("/requests", response_model=ApiSavedRequest)
async def save_request(
    body: ApiSavedRequest,
    service: ApiClientService = Depends(get_api_client_service),
):
    """Save or update a request template in the collection."""
    return service.save_request(body)


@router.delete("/requests/{req_id}")
async def delete_saved_request(
    req_id: str,
    service: ApiClientService = Depends(get_api_client_service),
):
    """Delete a saved request from the collection."""
    success = service.delete_saved_request(req_id)
    return {"data": {"deleted": success, "request_id": req_id}}
