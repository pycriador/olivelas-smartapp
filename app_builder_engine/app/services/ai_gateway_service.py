"""
AI Gateway Service
Manages routing policies, real-time metrics telemetry, prompt execution caching, and audit trails.
"""
from __future__ import annotations
import time
import re
import hashlib
import uuid
from datetime import datetime, timezone
from typing import Optional, Any
from sqlalchemy import select

from app.db.session import SessionLocal
from app.models.orm_models import SystemStateModel, AuditLogModel
from app.core.errors import AIServiceError
from app.schemas.ai_gateway_schemas import (
    AiGatewayPolicy,
    AiGatewayMetrics,
    AiGatewayExecutionLog,
    AiGatewayExecuteRequest,
    AiGatewayExecuteResponse,
)
from app.services.ai_provider_service import ai_provider_service
from app.ai.providers import GeminiAIProvider, BaseAIProvider, get_configured_ai_provider

SYSTEM_STATE_GATEWAY_POLICY_KEY = "ai_gateway_policy"
SYSTEM_STATE_GATEWAY_METRICS_KEY = "ai_gateway_metrics"
SYSTEM_STATE_GATEWAY_LOGS_KEY = "ai_gateway_execution_logs"

# In-memory LRU Semantic Cache
_SEMANTIC_CACHE: dict[str, dict[str, Any]] = {}
MAX_CACHE_SIZE = 100


class AiGatewayService:
    def __init__(self) -> None:
        pass

    def get_default_policy(self) -> dict[str, Any]:
        return AiGatewayPolicy().model_dump()

    def get_default_metrics(self) -> dict[str, Any]:
        return AiGatewayMetrics().model_dump()

    def get_policy(self) -> AiGatewayPolicy:
        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_GATEWAY_POLICY_KEY)
            )
            prov_config = ai_provider_service.get_raw_settings()
            if not row or not row.value:
                default_data = self.get_default_policy()
                default_data["primary_provider"] = prov_config.get("default_provider", "gemini")
                default_data["primary_model"] = prov_config.get("default_model", "gemini-2.5-flash")
                session.merge(SystemStateModel(key=SYSTEM_STATE_GATEWAY_POLICY_KEY, value=default_data))
                session.commit()
                return AiGatewayPolicy(**default_data)
            return AiGatewayPolicy(**row.value)

    def update_policy(self, policy_data: dict[str, Any], actor_email: str = "willian.jesus@loft.com.br") -> AiGatewayPolicy:
        validated = AiGatewayPolicy(**policy_data)
        with SessionLocal() as session:
            session.merge(SystemStateModel(key=SYSTEM_STATE_GATEWAY_POLICY_KEY, value=validated.model_dump()))
            
            # Sync with ai_providers_config in SQLite
            row_prov = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == "ai_providers_config")
            )
            if row_prov and row_prov.value:
                cur_prov = dict(row_prov.value)
                cur_prov["default_provider"] = validated.primary_provider
                cur_prov["default_model"] = validated.primary_model
                for p in cur_prov.get("providers", []):
                    p["is_default"] = (p.get("id") == validated.primary_provider)
                    if p["is_default"] and validated.primary_model:
                        p["default_model"] = validated.primary_model
                row_prov.value = cur_prov
                from sqlalchemy.orm.attributes import flag_modified
                flag_modified(row_prov, "value")

            # Audit log
            session.add(
                AuditLogModel(
                    id=f"aud_gw_pol_{uuid.uuid4().hex[:8]}",
                    action="AI_GATEWAY_POLICY_UPDATE",
                    entity_type="AiGatewayPolicy",
                    entity_id="global",
                    actor=actor_email,
                    user_email=actor_email,
                    timestamp=datetime.now(timezone.utc),
                    result="SUCCESS",
                    metadata_json=validated.model_dump(),
                )
            )
            session.commit()
        return validated

    def get_metrics(self) -> AiGatewayMetrics:
        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_GATEWAY_METRICS_KEY)
            )
            policy = self.get_policy()
            if not row or not row.value:
                metrics_data = self.get_default_metrics()
                metrics_data["active_provider"] = policy.primary_provider
                metrics_data["active_model"] = policy.primary_model
                session.merge(SystemStateModel(key=SYSTEM_STATE_GATEWAY_METRICS_KEY, value=metrics_data))
                session.commit()
                return AiGatewayMetrics(**metrics_data)
            
            data = dict(row.value)
            data["active_provider"] = policy.primary_provider
            data["active_model"] = policy.primary_model
            return AiGatewayMetrics(**data)

    def get_execution_logs(self, limit: int = 500) -> list[AiGatewayExecutionLog]:
        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_GATEWAY_LOGS_KEY)
            )
            if not row or not row.value or not isinstance(row.value, list):
                return []
            logs = [AiGatewayExecutionLog(**item) for item in row.value]
            return sorted(logs, key=lambda x: x.timestamp, reverse=True)[:limit]

    def _sanitize_pii(self, text: str) -> str:
        """Sanitizes sensitive information like emails, CPFs, and card numbers."""
        # Email
        text = re.sub(r'[\w\.-]+@[\w\.-]+\.\w+', '[EMAIL_PROTECTED]', text)
        # CPF (XXX.XXX.XXX-XX or 11 digits)
        text = re.sub(r'\b\d{3}\.\d{3}\.\d{3}-\d{2}\b', '[CPF_PROTECTED]', text)
        # Credit Card (16 digits with hyphens/spaces)
        text = re.sub(r'\b(?:\d{4}[ -]?){3}\d{4}\b', '[CARD_PROTECTED]', text)
        return text

    async def execute_prompt(
        self,
        request: AiGatewayExecuteRequest,
        actor_email: str = "willian.jesus@loft.com.br",
    ) -> AiGatewayExecuteResponse:
        policy = self.get_policy()
        prov_config = ai_provider_service.get_masked_settings()
        target_model_id = request.override_model or policy.primary_model or prov_config.default_model

        if request.override_provider:
            target_provider_id = request.override_provider
        else:
            m_lower = (target_model_id or "").lower()
            if m_lower.startswith("gemini"):
                target_provider_id = "gemini"
            elif m_lower.startswith("claude"):
                target_provider_id = "anthropic"
            elif m_lower.startswith("grok"):
                target_provider_id = "grok"
            elif m_lower.startswith(("gpt-", "o1-", "o3-", "text-embedding")):
                target_provider_id = "openai"
            elif m_lower.startswith(("llama", "mistral", "qwen", "phi")):
                target_provider_id = "ollama"
            else:
                target_provider_id = policy.primary_provider or prov_config.default_provider

        processed_prompt = request.prompt
        if policy.enable_pii_sanitization:
            processed_prompt = self._sanitize_pii(processed_prompt)

        processed_sys_prompt = request.system_prompt
        if processed_sys_prompt and policy.enable_pii_sanitization:
            processed_sys_prompt = self._sanitize_pii(processed_sys_prompt)

        # Cache check
        cache_key = hashlib.sha256(
            f"{target_provider_id}:{target_model_id}:{processed_prompt}:{processed_sys_prompt}:{request.temperature}".encode()
        ).hexdigest()

        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")

        if policy.enable_semantic_cache and cache_key in _SEMANTIC_CACHE:
            cached_data = _SEMANTIC_CACHE[cache_key]
            self._record_execution_telemetry(
                latency_ms=12,
                prompt_tokens=len(processed_prompt.split()),
                completion_tokens=len(cached_data["response"].split()),
                is_cached=True,
                is_success=True,
            )
            return AiGatewayExecuteResponse(
                response=cached_data["response"],
                provider=target_provider_id,
                model=target_model_id,
                latency_ms=12,
                prompt_tokens=len(processed_prompt.split()),
                completion_tokens=len(cached_data["response"].split()),
                cached=True,
                timestamp=now_str,
            )

        start_time = time.time()
        output_text = ""
        is_success = True

        try:
            # Execute with active configured provider
            provider_inst: BaseAIProvider = get_configured_ai_provider(
                provider_id=target_provider_id,
                model_name=target_model_id,
            )

            output_text = await provider_inst.generate_text(
                prompt=processed_prompt,
                system_prompt=processed_sys_prompt,
                temperature=request.temperature or 0.2,
                max_output_tokens=request.max_tokens or 4096,
            )
        except Exception as exc:
            # Check if fallback is configured and eligible
            fallback_prov = (policy.fallback_provider or "").strip().lower()
            fallback_model = (policy.fallback_model or "").strip()
            should_attempt_fallback = (
                policy.enable_fallback
                and fallback_prov not in ("none", "sem_configuracao", "", "disabled", "null")
                and (target_provider_id != policy.fallback_provider or target_model_id != fallback_model)
            )

            if should_attempt_fallback:
                try:
                    fallback_inst = get_configured_ai_provider(
                        provider_id=policy.fallback_provider,
                        model_name=fallback_model or None,
                    )
                    output_text = await fallback_inst.generate_text(
                        prompt=processed_prompt,
                        system_prompt=processed_sys_prompt,
                        temperature=request.temperature or 0.2,
                        max_output_tokens=request.max_tokens or 4096,
                    )
                    target_provider_id = f"{policy.fallback_provider} (failover: {fallback_model})"
                    target_model_id = fallback_model
                except Exception as fallback_exc:
                    is_success = False
                    latency_ms = max(int((time.time() - start_time) * 1000), 1)
                    self._record_execution_telemetry(
                        latency_ms=latency_ms,
                        prompt_tokens=max(len(processed_prompt.split()) * 4 // 3, 1),
                        completion_tokens=0,
                        is_cached=False,
                        is_success=False,
                    )
                    combined_err = (
                        f"Falha no modelo primário ({target_provider_id} / {target_model_id}): {str(exc)} | "
                        f"Falha no failover ({policy.fallback_provider} / {fallback_model}): {str(fallback_exc)}"
                    )
                    self._record_log(
                        prompt=processed_prompt,
                        system_prompt=processed_sys_prompt,
                        response=f"Error: {combined_err}",
                        provider=target_provider_id,
                        model=target_model_id,
                        latency_ms=latency_ms,
                        tokens_used=max(len(processed_prompt.split()) * 4 // 3, 1),
                        status="ERROR",
                        actor=actor_email,
                    )
                    raise AIServiceError(combined_err) from fallback_exc
            else:
                is_success = False
                latency_ms = max(int((time.time() - start_time) * 1000), 1)
                self._record_execution_telemetry(
                    latency_ms=latency_ms,
                    prompt_tokens=max(len(processed_prompt.split()) * 4 // 3, 1),
                    completion_tokens=0,
                    is_cached=False,
                    is_success=False,
                )
                std_err = f"Falha na inferência primária ({target_provider_id} / {target_model_id}): {str(exc)}"
                self._record_log(
                    prompt=processed_prompt,
                    system_prompt=processed_sys_prompt,
                    response=f"Error: {std_err}",
                    provider=target_provider_id,
                    model=target_model_id,
                    latency_ms=latency_ms,
                    tokens_used=max(len(processed_prompt.split()) * 4 // 3, 1),
                    status="ERROR",
                    actor=actor_email,
                )
                raise AIServiceError(std_err) from exc

        latency_ms = max(int((time.time() - start_time) * 1000), 1)
        prompt_tokens = max(len(processed_prompt.split()) * 4 // 3, 1)
        completion_tokens = max(len(output_text.split()) * 4 // 3, 1)

        # Store in cache
        if policy.enable_semantic_cache and is_success:
            if len(_SEMANTIC_CACHE) >= MAX_CACHE_SIZE:
                _SEMANTIC_CACHE.pop(next(iter(_SEMANTIC_CACHE)))
            _SEMANTIC_CACHE[cache_key] = {"response": output_text}

        # Telemetry & Audit
        self._record_execution_telemetry(
            latency_ms=latency_ms,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            is_cached=False,
            is_success=is_success,
        )

        self._record_log(
            prompt=processed_prompt,
            system_prompt=processed_sys_prompt,
            response=output_text,
            provider=target_provider_id,
            model=target_model_id,
            latency_ms=latency_ms,
            tokens_used=prompt_tokens + completion_tokens,
            status="SUCCESS" if is_success else "ERROR",
            actor=actor_email,
        )

        return AiGatewayExecuteResponse(
            response=output_text,
            provider=target_provider_id,
            model=target_model_id,
            latency_ms=latency_ms,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            cached=False,
            timestamp=now_str,
        )

    def _record_execution_telemetry(
        self,
        latency_ms: int,
        prompt_tokens: int,
        completion_tokens: int,
        is_cached: bool,
        is_success: bool,
    ) -> None:
        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_GATEWAY_METRICS_KEY)
            )
            current = row.value if row and row.value else self.get_default_metrics()
            
            total = current.get("total_requests", 0) + 1
            success = current.get("successful_requests", 0) + (1 if is_success else 0)
            failed = current.get("failed_requests", 0) + (0 if is_success else 1)
            cached = current.get("cached_requests", 0) + (1 if is_cached else 0)
            
            prev_avg = current.get("avg_latency_ms", 120)
            new_avg = int((prev_avg * (total - 1) + latency_ms) / total) if total > 0 else latency_ms

            current["total_requests"] = total
            current["successful_requests"] = success
            current["failed_requests"] = failed
            current["cached_requests"] = cached
            current["avg_latency_ms"] = new_avg
            current["total_prompt_tokens"] = current.get("total_prompt_tokens", 0) + prompt_tokens
            current["total_completion_tokens"] = current.get("total_completion_tokens", 0) + completion_tokens

            session.merge(SystemStateModel(key=SYSTEM_STATE_GATEWAY_METRICS_KEY, value=current))
            session.commit()

    def _record_log(
        self,
        prompt: str,
        system_prompt: Optional[str],
        response: str,
        provider: str,
        model: str,
        latency_ms: int,
        tokens_used: int,
        status: str,
        actor: str,
    ) -> None:
        log_entry = {
            "id": f"log_gw_{uuid.uuid4().hex[:8]}",
            "prompt_preview": prompt[:120] + ("..." if len(prompt) > 120 else ""),
            "full_prompt": prompt,
            "system_prompt": system_prompt,
            "response_preview": response[:160] + ("..." if len(response) > 160 else ""),
            "full_response": response,
            "provider": provider,
            "model": model,
            "latency_ms": latency_ms,
            "tokens_used": tokens_used,
            "status": status,
            "actor": actor,
            "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC"),
        }

        with SessionLocal() as session:
            row = session.scalar(
                select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_GATEWAY_LOGS_KEY)
            )
            logs = list(row.value) if row and row.value and isinstance(row.value, list) else []
            logs.insert(0, log_entry)
            # Keep max 50 in state
            logs = logs[:50]
            session.merge(SystemStateModel(key=SYSTEM_STATE_GATEWAY_LOGS_KEY, value=logs))

            # Also persist in AuditLogModel
            session.add(
                AuditLogModel(
                    id=f"aud_gw_{uuid.uuid4().hex[:8]}",
                    action="AI_GATEWAY_EXECUTE",
                    entity_type="AiGatewayPrompt",
                    entity_id=log_entry["id"],
                    actor=actor,
                    user_email=actor,
                    timestamp=datetime.now(timezone.utc),
                    result=status,
                    metadata_json={
                        "model": model,
                        "provider": provider,
                        "latency_ms": latency_ms,
                        "tokens_used": tokens_used,
                    },
                )
            )
            session.commit()


ai_gateway_service = AiGatewayService()
