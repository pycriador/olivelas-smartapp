"""
HTTP Client & External Source Service
Provides HTTP client execution, request collection management,
and Confluence/GitHub integration connectors.
"""
from __future__ import annotations
import base64
import html
import re
import time
import uuid
from datetime import datetime, timezone
from typing import Any

import httpx
from pydantic import BaseModel

from app.core.errors import ApplicationError, NotFoundError
from app.domain.models import (
    ApiClientSource,
    ApiSavedRequest,
    ApiExecutionRequest,
    ApiExecutionResponse,
    KnowledgeCategory,
    KnowledgeDocument,
)
from app.models.orm_models import SystemStateModel
from app.db.session import SessionLocal, init_db


class ApiClientService:
    def __init__(self) -> None:
        try:
            init_db()
            self._init_defaults_if_empty()
        except Exception:
            pass

    def _get_system_state(self, key: str, default: Any = None) -> Any:
        with SessionLocal() as s:
            item = s.get(SystemStateModel, key)
            if item and item.value is not None:
                return item.value
            return default

    def _set_system_state(self, key: str, value: Any) -> None:
        with SessionLocal() as s:
            s.merge(SystemStateModel(key=key, value=value))
            s.commit()

    def _init_defaults_if_empty(self) -> None:
        sources = self._get_system_state("api_client_sources")
        if not sources:
            default_sources = [
                {
                    "id": "src_confluence_cloud",
                    "name": "Olivelas Confluence Cloud API",
                    "base_url": "https://olivelas.atlassian.net/wiki/rest/api",
                    "auth_type": "bearer",
                    "auth_config": {"token": "CONFLUENCE_API_TOKEN_REDACTED", "email": "willian.jesus@olivelas.com.br"},
                    "default_headers": {
                        "Accept": "application/json",
                        "X-Atlassian-Token": "no-check",
                    },
                    "description": "Conector oficial para Atlassian Confluence Cloud (Espaços TECH, ARCH e OLIVELAS)",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "id": "src_github_docs",
                    "name": "Olivelas GitHub Docs API",
                    "base_url": "https://api.github.com",
                    "auth_type": "bearer",
                    "auth_config": {"token": "GITHUB_TOKEN_REDACTED"},
                    "default_headers": {
                        "Accept": "application/vnd.github.v3+json",
                        "User-Agent": "Olivelas-AppBuilder-Client/1.0",
                    },
                    "description": "Repositórios de documentação e contratos pycriador/olivelas-smartapp",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "id": "src_internal_gateway",
                    "name": "Olivelas Internal API Gateway",
                    "base_url": "http://127.0.0.1:8000/api/v1",
                    "auth_type": "none",
                    "auth_config": {},
                    "default_headers": {
                        "Content-Type": "application/json",
                    },
                    "description": "API Gateway local para testes e inspeção de endpoints internos",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
            ]
            self._set_system_state("api_client_sources", default_sources)

        saved = self._get_system_state("api_saved_requests")
        if not saved:
            default_saved = [
                {
                    "id": "req_confluence_search",
                    "source_id": "src_confluence_cloud",
                    "name": "Confluence: Listar Páginas do Espaço TECH",
                    "method": "GET",
                    "url": "https://olivelas.atlassian.net/wiki/rest/api/content",
                    "params": [
                        {"key": "spaceKey", "value": "TECH", "enabled": True, "description": "Chave do Espaço"},
                        {"key": "limit", "value": "10", "enabled": True, "description": "Número de itens"},
                        {"key": "expand", "value": "body.storage,version", "enabled": True, "description": "Campos expandidos"},
                    ],
                    "headers": [
                        {"key": "Accept", "value": "application/json", "enabled": True, "description": "Formato JSON"},
                    ],
                    "auth_type": "bearer",
                    "auth_config": {"token": "CONFLUENCE_API_TOKEN_REDACTED"},
                    "body_type": "none",
                    "body_content": None,
                    "description": "Consulta páginas com conteúdo no espaço de Engenharia da Olivelas",
                    "folder": "Confluence Cloud",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "id": "req_github_readme",
                    "source_id": "src_github_docs",
                    "name": "GitHub: Obter README do aiops-documentation",
                    "method": "GET",
                    "url": "https://api.github.com/repos/pycriador/olivelas-smartapp/readme",
                    "params": [],
                    "headers": [
                        {"key": "Accept", "value": "application/vnd.github.v3+json", "enabled": True, "description": "GitHub V3"},
                        {"key": "User-Agent", "value": "Olivelas-AppBuilder/1.0", "enabled": True, "description": "User Agent"},
                    ],
                    "auth_type": "bearer",
                    "auth_config": {"token": "GITHUB_TOKEN_REDACTED"},
                    "body_type": "none",
                    "body_content": None,
                    "description": "Busca o arquivo de documentação principal do repositório",
                    "folder": "GitHub",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
                {
                    "id": "req_internal_health",
                    "source_id": "src_internal_gateway",
                    "name": "Internal: Health Check & Metadata",
                    "method": "GET",
                    "url": "http://127.0.0.1:8000/api/v1/health",
                    "params": [],
                    "headers": [
                        {"key": "Accept", "value": "application/json", "enabled": True, "description": "Accept header"},
                    ],
                    "auth_type": "none",
                    "auth_config": {},
                    "body_type": "none",
                    "body_content": None,
                    "description": "Verifica disponibilidade e métricas do backend",
                    "folder": "Internal Core",
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "updated_at": datetime.now(timezone.utc).isoformat(),
                },
            ]
            self._set_system_state("api_saved_requests", default_saved)

    # --- Live HTTP Execution ---
    async def execute_request(self, req: ApiExecutionRequest) -> ApiExecutionResponse:
        start_time = time.perf_counter()

        headers = dict(req.headers)
        if req.auth_type == "bearer" and req.auth_token:
            headers["Authorization"] = f"Bearer {req.auth_token}"
        elif req.auth_type == "basic" and (req.auth_username or req.auth_password):
            user_pass = f"{req.auth_username or ''}:{req.auth_password or ''}"
            b64 = base64.b64encode(user_pass.encode("utf-8")).decode("utf-8")
            headers["Authorization"] = f"Basic {b64}"
        elif req.auth_type == "api_key" and req.auth_token:
            headers["X-API-Key"] = req.auth_token

        content_payload: bytes | None = None
        if req.body_type in ("json", "raw") and req.body:
            content_payload = req.body.encode("utf-8")
            if "Content-Type" not in headers and req.body_type == "json":
                headers["Content-Type"] = "application/json"

        try:
            async with httpx.AsyncClient(timeout=15.0, follow_redirects=True, verify=False) as client:
                response = await client.request(
                    method=req.method.upper(),
                    url=req.url,
                    params=req.params if req.params else None,
                    headers=headers,
                    content=content_payload,
                )
                latency_ms = int((time.perf_counter() - start_time) * 1000)
                
                resp_text = response.text
                is_json = False
                try:
                    response.json()
                    is_json = True
                except Exception:
                    pass

                resp_headers = {k: v for k, v in response.headers.items()}

                return ApiExecutionResponse(
                    status_code=response.status_code,
                    status_text=f"{response.status_code} {response.reason_phrase or 'OK'}",
                    latency_ms=latency_ms,
                    response_size_bytes=len(response.content),
                    headers=resp_headers,
                    body=resp_text,
                    is_json=is_json,
                )
        except Exception as e:
            latency_ms = int((time.perf_counter() - start_time) * 1000)
            return ApiExecutionResponse(
                status_code=502,
                status_text="502 Bad Gateway / Network Error",
                latency_ms=latency_ms,
                response_size_bytes=0,
                headers={"error": str(e)},
                body=f"Falha ao executar requisição HTTP para {req.url}: {str(e)}",
                is_json=False,
            )

    # --- API Client Sources CRUD ---
    def list_sources(self) -> list[ApiClientSource]:
        sources_raw = self._get_system_state("api_client_sources", [])
        return [ApiClientSource(**s) for s in sources_raw]

    def create_or_update_source(self, source: ApiClientSource) -> ApiClientSource:
        sources_raw = self._get_system_state("api_client_sources", [])
        existing = [s for s in sources_raw if s["id"] != source.id]
        existing.append(source.model_dump())
        self._set_system_state("api_client_sources", existing)
        return source

    def delete_source(self, source_id: str) -> bool:
        sources_raw = self._get_system_state("api_client_sources", [])
        new_sources = [s for s in sources_raw if s["id"] != source_id]
        self._set_system_state("api_client_sources", new_sources)
        return len(new_sources) < len(sources_raw)

    # --- Saved Requests CRUD ---
    def list_saved_requests(self) -> list[ApiSavedRequest]:
        reqs_raw = self._get_system_state("api_saved_requests", [])
        return [ApiSavedRequest(**r) for r in reqs_raw]

    def save_request(self, req: ApiSavedRequest) -> ApiSavedRequest:
        reqs_raw = self._get_system_state("api_saved_requests", [])
        existing = [r for r in reqs_raw if r["id"] != req.id]
        existing.append(req.model_dump())
        self._set_system_state("api_saved_requests", existing)
        return req

    def delete_saved_request(self, req_id: str) -> bool:
        reqs_raw = self._get_system_state("api_saved_requests", [])
        new_reqs = [r for r in reqs_raw if r["id"] != req_id]
        self._set_system_state("api_saved_requests", new_reqs)
        return len(new_reqs) < len(reqs_raw)

    # --- External Connectors ---
    def convert_html_or_storage_to_markdown(self, raw_html: str) -> str:
        """Converts HTML or Confluence storage format to clean Markdown."""
        text = raw_html
        # Replace headers
        text = re.sub(r"<h1[^>]*>(.*?)</h1>", r"# \1\n\n", text, flags=re.IGNORECASE | re.DOTALL)
        text = re.sub(r"<h2[^>]*>(.*?)</h2>", r"## \1\n\n", text, flags=re.IGNORECASE | re.DOTALL)
        text = re.sub(r"<h3[^>]*>(.*?)</h3>", r"### \1\n\n", text, flags=re.IGNORECASE | re.DOTALL)
        text = re.sub(r"<h4[^>]*>(.*?)</h4>", r"#### \1\n\n", text, flags=re.IGNORECASE | re.DOTALL)
        # Replace code blocks
        text = re.sub(r"<pre[^>]*><code[^>]*>(.*?)</code></pre>", r"```\n\1\n```\n\n", text, flags=re.IGNORECASE | re.DOTALL)
        text = re.sub(r"<code[^>]*>(.*?)</code>", r"`\1`", text, flags=re.IGNORECASE | re.DOTALL)
        # Replace list items
        text = re.sub(r"<li[^>]*>(.*?)</li>", r"- \1\n", text, flags=re.IGNORECASE | re.DOTALL)
        # Replace paragraphs and breaks
        text = re.sub(r"<p[^>]*>(.*?)</p>", r"\1\n\n", text, flags=re.IGNORECASE | re.DOTALL)
        text = re.sub(r"<br\s*/?>", r"\n", text, flags=re.IGNORECASE)
        # Strip other HTML tags
        text = re.sub(r"<[^>]+>", "", text)
        return html.unescape(text).strip()


api_client_service = ApiClientService()
