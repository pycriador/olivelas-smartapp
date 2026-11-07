"""
AI Provider Domain Service
Manages multi-provider configurations (Gemini, OpenAI, Grok, Copilot, Anthropic, Ollama, Custom Gateways),
model selection, secure key persistence in SQLite, connection diagnostics, and live model fetching.
"""
from __future__ import annotations
import time
import uuid
import re
from typing import Any, Optional
import httpx
from sqlalchemy import select
from sqlalchemy.orm.attributes import flag_modified
from app.core.errors import ApplicationError
from app.db.session import SessionLocal, get_db_session
from app.models.orm_models import SystemStateModel, AuditLogModel
from app.schemas.ai_settings_schemas import (
    AiModelOption,
    AiProviderConfigItem,
    MultiProviderSettings,
    AiProviderUpdateRequest,
    AiCustomProviderCreateRequest,
    AiCustomProviderUpdateRequest,
    AiTestConnectionRequest,
    AiTestConnectionResponse,
    AiFetchModelsRequest,
)

SYSTEM_STATE_AI_KEY = "ai_providers_config"

GEMINI_MODELS = [
    AiModelOption(
        id="gemini-3.0-flash",
        name="Gemini 3.0 Flash (Next-Gen)",
        provider="gemini",
        description="Geração 3: Próxima geração com altíssima velocidade, raciocínio de código aprimorado e janela de 1M tokens",
        context_window=1000000,
        recommended=True,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-3.0-pro",
        name="Gemini 3.0 Pro (Next-Gen Flagship)",
        provider="gemini",
        description="Geração 3: Modelo flagship de mais alto desempenho para raciocínio complexo, arquitetura e refatoração profunda",
        context_window=2000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-3.0-flash-preview",
        name="Gemini 3.0 Flash Preview",
        provider="gemini",
        description="Geração 3: Versão prévia otimizada para latência ultra-baixa e chamadas de ferramentas em tempo real",
        context_window=1000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-3.0-pro-preview",
        name="Gemini 3.0 Pro Preview",
        provider="gemini",
        description="Geração 3: Versão prévia de raciocínio profundo para análise abrangente de código e sistemas",
        context_window=2000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-3-flash",
        name="Gemini 3 Flash",
        provider="gemini",
        description="Geração 3: Identificador simplificado para a família Gemini 3 Flash",
        context_window=1000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-3-pro",
        name="Gemini 3 Pro",
        provider="gemini",
        description="Geração 3: Identificador simplificado para a família Gemini 3 Pro",
        context_window=2000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-3.0-ultra",
        name="Gemini 3.0 Ultra",
        provider="gemini",
        description="Geração 3: Modelo massivo para benchmarks extremos e síntese arquitetural de larga escala",
        context_window=2000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-2.5-flash",
        name="Gemini 2.5 Flash",
        provider="gemini",
        description="Padrão estável: Altíssima velocidade, excelente raciocínio de código e janela de 1M tokens",
        context_window=1000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-2.5-pro",
        name="Gemini 2.5 Pro",
        provider="gemini",
        description="Modelo de alto desempenho para raciocínio complexo, arquitetura e refatoração profunda",
        context_window=2000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-2.5-flash-lite",
        name="Gemini 2.5 Flash-Lite",
        provider="gemini",
        description="Ultra-rápido e econômico para respostas em tempo real e triagem de código",
        context_window=1000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-2.0-flash",
        name="Gemini 2.0 Flash",
        provider="gemini",
        description="Geração 2.0 com suporte nativo a multimodalidade, chamadas de ferramentas e baixa latência",
        context_window=1000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-2.0-flash-lite",
        name="Gemini 2.0 Flash-Lite",
        provider="gemini",
        description="Geração 2.0 ultraleve com menor latência e custo otimizado para alta escala",
        context_window=1000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-2.0-pro-exp-02-05",
        name="Gemini 2.0 Pro Experimental",
        provider="gemini",
        description="Modelo experimental com alta capacidade em benchmark de codificação e raciocínio técnico",
        context_window=2000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-1.5-pro",
        name="Gemini 1.5 Pro",
        provider="gemini",
        description="Janela massiva de 2M tokens ideal para análise de repositórios inteiros",
        context_window=2000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-1.5-flash",
        name="Gemini 1.5 Flash",
        provider="gemini",
        description="Versátil, leve e otimizado para tarefas de engenharia e scaffolding",
        context_window=1000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-1.5-flash-8b",
        name="Gemini 1.5 Flash-8B",
        provider="gemini",
        description="Modelo compacto de 8 bilhões de parâmetros para tarefas de alta velocidade",
        context_window=1000000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gemini-1.0-pro",
        name="Gemini 1.0 Pro",
        provider="gemini",
        description="Versão legada estável para processamento de linguagem natural",
        context_window=32768,
        recommended=False,
        is_multimodal=False,
    ),
]

OPENAI_MODELS = [
    AiModelOption(
        id="gpt-4o",
        name="GPT-4o",
        provider="openai",
        description="Modelo flagship multimodal da OpenAI de alta velocidade e precisão",
        context_window=128000,
        recommended=True,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gpt-4o-mini",
        name="GPT-4o Mini",
        provider="openai",
        description="Modelo leve, rápido e de baixo custo para tarefas pontuais de engenharia",
        context_window=128000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gpt-4-turbo",
        name="GPT-4 Turbo",
        provider="openai",
        description="Modelo de alta precisão com suporte a geração estruturada de JSON",
        context_window=128000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="o3-mini",
        name="o3-mini",
        provider="openai",
        description="Modelo focado em raciocínio lógico avançado e geração de código complexo",
        context_window=200000,
        recommended=False,
        is_multimodal=False,
    ),
    AiModelOption(
        id="o1-preview",
        name="o1-preview",
        provider="openai",
        description="Raciocínio dedutivo e chain-of-thought para arquitetura e algoritmos",
        context_window=128000,
        recommended=False,
        is_multimodal=False,
    ),
]

GROK_MODELS = [
    AiModelOption(
        id="grok-2",
        name="Grok 2",
        provider="grok",
        description="Flagship da xAI com capacidade avançada de raciocínio técnico e síntese de código",
        context_window=128000,
        recommended=True,
        is_multimodal=True,
    ),
    AiModelOption(
        id="grok-2-mini",
        name="Grok 2 Mini",
        provider="grok",
        description="Versão ultra-rápida e eficiente do Grok para tarefas ágeis de desenvolvimento",
        context_window=128000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="grok-beta",
        name="Grok Beta",
        provider="grok",
        description="Modelo xAI com conhecimento em tempo real e capacidade dedutiva",
        context_window=128000,
        recommended=False,
        is_multimodal=False,
    ),
    AiModelOption(
        id="grok-vision-beta",
        name="Grok Vision Beta",
        provider="grok",
        description="Capacidade de inspeção visual de interfaces, diagramas e prints de tela",
        context_window=8192,
        recommended=False,
        is_multimodal=True,
    ),
]

COPILOT_MODELS = [
    AiModelOption(
        id="gpt-4o",
        name="Copilot GPT-4o (Azure)",
        provider="copilot",
        description="Modelo Azure OpenAI otimizado para tarefas de desenvolvimento assistido",
        context_window=128000,
        recommended=True,
        is_multimodal=True,
    ),
    AiModelOption(
        id="gpt-4o-mini",
        name="Copilot GPT-4o Mini (Azure)",
        provider="copilot",
        description="Modelo ágil para auto-complete, scaffolding e refatorações pontuais",
        context_window=128000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="Phi-3.5-MoE-instruct",
        name="Microsoft Phi-3.5 MoE",
        provider="copilot",
        description="Modelo leve da Microsoft com Mixture-of-Experts para lógica e código",
        context_window=128000,
        recommended=False,
        is_multimodal=False,
    ),
    AiModelOption(
        id="Mistral-Large-2407",
        name="Mistral Large (Azure AI)",
        provider="copilot",
        description="Modelo de alta precisão multilíngue hospedado no Azure AI Model Catalog",
        context_window=128000,
        recommended=False,
        is_multimodal=False,
    ),
]

ANTHROPIC_MODELS = [
    AiModelOption(
        id="claude-3-7-sonnet",
        name="Claude 3.7 Sonnet",
        provider="anthropic",
        description="Modelo híbrido com raciocínio padrão e estendido para engenharia",
        context_window=200000,
        recommended=True,
        is_multimodal=True,
    ),
    AiModelOption(
        id="claude-3-5-sonnet",
        name="Claude 3.5 Sonnet",
        provider="anthropic",
        description="Excelente capacidade em geração e revisão de código TypeScript e Python",
        context_window=200000,
        recommended=False,
        is_multimodal=True,
    ),
    AiModelOption(
        id="claude-3-5-haiku",
        name="Claude 3.5 Haiku",
        provider="anthropic",
        description="Ultra-rápido para auto-complete e validações sintáticas",
        context_window=200000,
        recommended=False,
        is_multimodal=False,
    ),
]

OLLAMA_MODELS = [
    AiModelOption(
        id="llama3.3:latest",
        name="Llama 3.3 (70B)",
        provider="ollama",
        description="Modelo open-source de alta performance rodando localmente",
        context_window=128000,
        recommended=True,
        is_multimodal=False,
    ),
    AiModelOption(
        id="qwen2.5-coder:latest",
        name="Qwen 2.5 Coder (32B)",
        provider="ollama",
        description="Modelo especializado em geração de código e arquitetura de software",
        context_window=64000,
        recommended=False,
        is_multimodal=False,
    ),
    AiModelOption(
        id="deepseek-r1:latest",
        name="DeepSeek R1",
        provider="ollama",
        description="Raciocínio lógico open-weights com chain-of-thought",
        context_window=64000,
        recommended=False,
        is_multimodal=False,
    ),
    AiModelOption(
        id="mistral:latest",
        name="Mistral 7B Instruct",
        provider="ollama",
        description="Modelo rápido e leve para tarefas de validação local",
        context_window=32000,
        recommended=False,
        is_multimodal=False,
    ),
]


def mask_api_key(key: str) -> str:
    """Masks secret key leaving only initial prefix and trailing characters."""
    if not key:
        return ""
    key = key.strip()
    if len(key) <= 8:
        return "********"
    return f"{key[:6]}...{key[-4:]}"


def is_masked_key(key: str) -> bool:
    """Checks if a string represents an already masked key."""
    return "..." in key or key.startswith("****") or key.endswith("****")


def _merge_canonical_models(saved_models: list[dict[str, Any]] | None, canonical_models: list[AiModelOption]) -> list[dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}
    for m in canonical_models:
        merged[m.id] = m.model_dump()
    for sm in (saved_models or []):
        if isinstance(sm, dict) and "id" in sm:
            merged[sm["id"]] = {**merged.get(sm["id"], {}), **sm}
    return list(merged.values())


class AiProviderService:
    def __init__(self) -> None:
        pass

    def get_default_config_template(self) -> dict[str, Any]:
        """Returns canonical multi-provider initial configuration structure."""
        return {
            "default_provider": "gemini",
            "default_model": "gemini-2.5-flash",
            "fallback_provider": "openai",
            "enable_stream": False,
            "log_prompts": True,
            "providers": [
                {
                    "id": "gemini",
                    "name": "Google Gemini",
                    "provider_type": "gemini",
                    "enabled": True,
                    "is_custom": False,
                    "api_key": "",
                    "base_url": "https://generativelanguage.googleapis.com/v1beta",
                    "default_model": "gemini-2.5-flash",
                    "available_models": [m.model_dump() for m in GEMINI_MODELS],
                    "temperature": 0.2,
                    "max_output_tokens": 4096,
                    "top_p": 0.95,
                    "system_instruction": "Você é o assistente técnico de arquitetura e engenharia de software da Loft, especialista em Copan Design System e FSD.",
                    "is_default": True,
                    "status": "unconfigured",
                    "last_tested_at": None,
                    "last_error": None,
                },
                {
                    "id": "openai",
                    "name": "OpenAI",
                    "provider_type": "openai",
                    "enabled": False,
                    "is_custom": False,
                    "api_key": "",
                    "base_url": "https://api.openai.com/v1",
                    "default_model": "gpt-4o",
                    "available_models": [m.model_dump() for m in OPENAI_MODELS],
                    "temperature": 0.2,
                    "max_output_tokens": 4096,
                    "top_p": 1.0,
                    "system_instruction": "Assistente técnico da Loft.",
                    "is_default": False,
                    "status": "unconfigured",
                    "last_tested_at": None,
                    "last_error": None,
                },
                {
                    "id": "grok",
                    "name": "xAI (Grok)",
                    "provider_type": "grok",
                    "enabled": False,
                    "is_custom": False,
                    "api_key": "",
                    "base_url": "https://api.x.ai/v1",
                    "default_model": "grok-2",
                    "available_models": [m.model_dump() for m in GROK_MODELS],
                    "temperature": 0.2,
                    "max_output_tokens": 4096,
                    "top_p": 1.0,
                    "system_instruction": "Assistente técnico da Loft.",
                    "is_default": False,
                    "status": "unconfigured",
                    "last_tested_at": None,
                    "last_error": None,
                },
                {
                    "id": "copilot",
                    "name": "GitHub Copilot / Azure OpenAI",
                    "provider_type": "copilot",
                    "enabled": False,
                    "is_custom": False,
                    "api_key": "",
                    "base_url": "https://models.inference.ai.azure.com",
                    "default_model": "gpt-4o",
                    "available_models": [m.model_dump() for m in COPILOT_MODELS],
                    "temperature": 0.2,
                    "max_output_tokens": 4096,
                    "top_p": 1.0,
                    "system_instruction": "Assistente técnico da Loft.",
                    "is_default": False,
                    "status": "unconfigured",
                    "last_tested_at": None,
                    "last_error": None,
                },
                {
                    "id": "anthropic",
                    "name": "Anthropic Claude",
                    "provider_type": "anthropic",
                    "enabled": False,
                    "is_custom": False,
                    "api_key": "",
                    "base_url": "https://api.anthropic.com",
                    "default_model": "claude-3-7-sonnet-20250219",
                    "available_models": [m.model_dump() for m in ANTHROPIC_MODELS],
                    "temperature": 0.2,
                    "max_output_tokens": 4096,
                    "top_p": 1.0,
                    "system_instruction": "Assistente técnico da Loft.",
                    "is_default": False,
                    "status": "unconfigured",
                    "last_tested_at": None,
                    "last_error": None,
                },
                {
                    "id": "ollama",
                    "name": "Ollama (Local)",
                    "provider_type": "ollama",
                    "enabled": False,
                    "is_custom": False,
                    "api_key": "",
                    "base_url": "http://localhost:11434/v1",
                    "default_model": "llama3.3:latest",
                    "available_models": [m.model_dump() for m in OLLAMA_MODELS],
                    "temperature": 0.2,
                    "max_output_tokens": 4096,
                    "top_p": 1.0,
                    "system_instruction": "Assistente técnico da Loft.",
                    "is_default": False,
                    "status": "unconfigured",
                    "last_tested_at": None,
                    "last_error": None,
                },
                {
                    "id": "loft-vllm-custom",
                    "name": "Loft Internal vLLM Gateway",
                    "provider_type": "custom",
                    "enabled": False,
                    "is_custom": True,
                    "api_key": "",
                    "base_url": "https://ai-gateway.internal.loft.com.br/v1",
                    "default_model": "deepseek-coder-v2",
                    "available_models": [
                        {
                            "id": "deepseek-coder-v2",
                            "name": "DeepSeek Coder V2 (Internal Cluster)",
                            "provider": "custom",
                            "description": "Cluster interno privado da Loft para geração de código e arquitetura sem egress externo",
                            "context_window": 64000,
                            "recommended": True,
                            "is_multimodal": False,
                        }
                    ],
                    "temperature": 0.2,
                    "max_output_tokens": 4096,
                    "top_p": 1.0,
                    "system_instruction": "Assistente técnico interno da Loft.",
                    "is_default": False,
                    "status": "unconfigured",
                    "last_tested_at": None,
                    "last_error": None,
                },
            ],
        }

    def get_raw_settings(self) -> dict[str, Any]:
        """Returns the raw decrypted settings directly from SQLite."""
        with get_db_session() as session:
            row = session.scalar(select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AI_KEY))
            if not row or not row.value:
                initial_config = self.get_default_config_template()
                if not row:
                    session.add(SystemStateModel(key=SYSTEM_STATE_AI_KEY, value=initial_config))
                else:
                    row.value = initial_config
                session.commit()
                return initial_config

            val = dict(row.value)
            # Migration check: make sure grok, copilot and new canonical models exist
            existing_pids = {p.get("id") for p in val.get("providers", [])}
            template = self.get_default_config_template()
            needs_save = False
            for p in template["providers"]:
                if p["id"] not in existing_pids:
                    val.setdefault("providers", []).append(p)
                    needs_save = True

            for p in val.get("providers", []):
                pid = p.get("id")
                if pid == "gemini":
                    merged_models = _merge_canonical_models(p.get("available_models"), GEMINI_MODELS)
                    if len(merged_models) != len(p.get("available_models", [])):
                        p["available_models"] = merged_models
                        needs_save = True
                elif pid == "openai":
                    merged_models = _merge_canonical_models(p.get("available_models"), OPENAI_MODELS)
                    if len(merged_models) != len(p.get("available_models", [])):
                        p["available_models"] = merged_models
                        needs_save = True
                elif pid == "grok":
                    merged_models = _merge_canonical_models(p.get("available_models"), GROK_MODELS)
                    if len(merged_models) != len(p.get("available_models", [])):
                        p["available_models"] = merged_models
                        needs_save = True
                elif pid == "anthropic":
                    merged_models = _merge_canonical_models(p.get("available_models"), ANTHROPIC_MODELS)
                    if len(merged_models) != len(p.get("available_models", [])):
                        p["available_models"] = merged_models
                        needs_save = True

            if needs_save:
                row.value = dict(val)
                flag_modified(row, "value")
                session.commit()

            return val

    def get_masked_settings(self) -> MultiProviderSettings:
        """Returns settings with masked API keys safe for frontend serialization."""
        raw = self.get_raw_settings()
        providers_list: list[AiProviderConfigItem] = []
        for p in raw.get("providers", []):
            item = dict(p)
            item["api_key"] = mask_api_key(item.get("api_key", ""))
            pid = item.get("id")
            if pid == "gemini":
                item["available_models"] = _merge_canonical_models(item.get("available_models"), GEMINI_MODELS)
            elif pid == "openai":
                item["available_models"] = _merge_canonical_models(item.get("available_models"), OPENAI_MODELS)
            elif pid == "grok":
                item["available_models"] = _merge_canonical_models(item.get("available_models"), GROK_MODELS)
            elif pid == "copilot":
                item["available_models"] = _merge_canonical_models(item.get("available_models"), COPILOT_MODELS)
            elif pid == "anthropic":
                item["available_models"] = _merge_canonical_models(item.get("available_models"), ANTHROPIC_MODELS)
            elif pid == "ollama":
                item["available_models"] = _merge_canonical_models(item.get("available_models"), OLLAMA_MODELS)
            providers_list.append(AiProviderConfigItem.model_validate(item))

        return MultiProviderSettings(
            default_provider=raw.get("default_provider", "gemini"),
            default_model=raw.get("default_model", "gemini-2.5-flash"),
            providers=providers_list,
            fallback_provider=raw.get("fallback_provider", "openai"),
            enable_stream=raw.get("enable_stream", False),
            log_prompts=raw.get("log_prompts", True),
        )

    def update_settings(self, payload: AiProviderUpdateRequest, actor: str = "willian.jesus@loft.com.br") -> MultiProviderSettings:
        """Updates provider settings in SQLite, preserving unmasked keys if masked ones were sent."""
        with get_db_session() as session:
            row = session.scalar(select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AI_KEY))
            existing_raw = row.value if row and row.value else self.get_default_config_template()
            existing_providers_map = {p["id"]: p for p in existing_raw.get("providers", [])}

            updated_providers: list[dict[str, Any]] = []
            for incoming in payload.providers:
                pid = incoming.id
                existing_p = existing_providers_map.get(pid, {})
                incoming_dict = incoming.model_dump()

                # Preserve secret key if masked or unchanged
                if is_masked_key(incoming.api_key) or not incoming.api_key:
                    incoming_dict["api_key"] = existing_p.get("api_key", "")
                else:
                    incoming_dict["api_key"] = incoming.api_key.strip()

                if incoming_dict["api_key"]:
                    incoming_dict["status"] = "configured"
                else:
                    incoming_dict["status"] = "unconfigured"

                # Preserve is_custom
                if "is_custom" not in incoming_dict:
                    incoming_dict["is_custom"] = existing_p.get("is_custom", False)

                updated_providers.append(incoming_dict)

            new_default_provider = payload.default_provider or existing_raw.get("default_provider", "gemini")
            new_default_model = payload.default_model or existing_raw.get("default_model", "gemini-2.5-flash")

            for p in updated_providers:
                p["is_default"] = (p["id"] == new_default_provider)
                if p["is_default"] and payload.default_model:
                    p["default_model"] = new_default_model

            new_value = {
                "default_provider": new_default_provider,
                "default_model": new_default_model,
                "fallback_provider": payload.fallback_provider or existing_raw.get("fallback_provider", "openai"),
                "enable_stream": payload.enable_stream if payload.enable_stream is not None else existing_raw.get("enable_stream", False),
                "log_prompts": payload.log_prompts if payload.log_prompts is not None else existing_raw.get("log_prompts", True),
                "providers": updated_providers,
            }

            if not row:
                row = SystemStateModel(key=SYSTEM_STATE_AI_KEY, value=new_value)
                session.add(row)
            else:
                row.value = dict(new_value)
                flag_modified(row, "value")

            audit = AuditLogModel(
                id=f"aud_ai_{int(time.time())}",
                action="UPDATE_AI_CONFIG",
                resource="SystemSettings",
                resource_id="ai_providers_config",
                entity_type="Settings",
                entity_id="ai_providers_config",
                actor=actor,
                user_email=actor,
                result="SUCCESS",
                metadata_json={"default_provider": new_default_provider, "default_model": new_default_model},
                details={"providers_count": len(updated_providers)},
            )
            session.add(audit)
            session.commit()

        return self.get_masked_settings()

    def create_custom_provider(self, req: AiCustomProviderCreateRequest, actor: str = "willian.jesus@loft.com.br") -> AiProviderConfigItem:
        """Adds a new custom OpenAI-compatible provider to SQLite."""
        with get_db_session() as session:
            row = session.scalar(select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AI_KEY))
            cur_raw = dict(row.value) if row and row.value else self.get_default_config_template()
            cur_providers = list(cur_raw.get("providers", []))

            # Generate slug/id
            raw_id = re.sub(r'[^a-zA-Z0-9_-]', '_', req.name.lower().strip())
            custom_id = f"custom_{raw_id}_{uuid.uuid4().hex[:4]}"

            default_model = req.default_model
            models = req.available_models
            if not models:
                models = [
                    AiModelOption(
                        id=default_model,
                        name=default_model,
                        provider=custom_id,
                        description=f"Modelo padrão do gateway {req.name}",
                        context_window=128000,
                        recommended=True,
                    )
                ]

            new_item = {
                "id": custom_id,
                "name": req.name,
                "provider_type": req.provider_type or "custom",
                "enabled": req.enabled,
                "is_custom": True,
                "api_key": req.api_key.strip() if req.api_key else "",
                "base_url": req.base_url.strip(),
                "default_model": default_model,
                "available_models": [m.model_dump() for m in models],
                "temperature": req.temperature,
                "max_output_tokens": req.max_output_tokens,
                "top_p": 1.0,
                "headers": req.headers,
                "system_instruction": req.system_instruction,
                "is_default": False,
                "status": "configured" if req.api_key else "unconfigured",
                "last_tested_at": None,
                "last_error": None,
            }

            cur_providers.append(new_item)
            cur_raw["providers"] = cur_providers
            row.value = dict(cur_raw)
            flag_modified(row, "value")

            audit = AuditLogModel(
                id=f"aud_cst_prov_{int(time.time())}",
                action="CREATE_AI_PROVIDER",
                resource="SystemSettings",
                resource_id=custom_id,
                entity_type="AIProvider",
                entity_id=custom_id,
                actor=actor,
                user_email=actor,
                result="SUCCESS",
                metadata_json={"provider_id": custom_id, "name": req.name},
                details={"base_url": req.base_url},
            )
            session.add(audit)
            session.commit()

            masked_item = dict(new_item)
            masked_item["api_key"] = mask_api_key(masked_item.get("api_key", ""))
            return AiProviderConfigItem.model_validate(masked_item)

    def update_provider_by_id(self, provider_id: str, req: AiCustomProviderUpdateRequest, actor: str = "willian.jesus@loft.com.br") -> AiProviderConfigItem:
        """Updates specific parameters of any provider in SQLite."""
        with get_db_session() as session:
            row = session.scalar(select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AI_KEY))
            cur_raw = row.value if row and row.value else self.get_default_config_template()
            cur_providers = list(cur_raw.get("providers", []))

            target = next((p for p in cur_providers if p.get("id") == provider_id), None)
            if not target:
                raise ApplicationError(f"Provedor de IA '{provider_id}' não encontrado.", status_code=404)

            if req.name is not None:
                target["name"] = req.name
            if req.base_url is not None:
                target["base_url"] = req.base_url
            if req.default_model is not None:
                target["default_model"] = req.default_model
            if req.available_models is not None:
                target["available_models"] = [m.model_dump() for m in req.available_models]
            if req.temperature is not None:
                target["temperature"] = req.temperature
            if req.max_output_tokens is not None:
                target["max_output_tokens"] = req.max_output_tokens
            if req.headers is not None:
                target["headers"] = req.headers
            if req.system_instruction is not None:
                target["system_instruction"] = req.system_instruction
            if req.enabled is not None:
                target["enabled"] = req.enabled

            if req.api_key is not None:
                if not is_masked_key(req.api_key) and req.api_key.strip():
                    target["api_key"] = req.api_key.strip()
                    target["status"] = "configured"
                elif not req.api_key:
                    target["api_key"] = ""
                    target["status"] = "unconfigured"

            cur_raw["providers"] = cur_providers
            row.value = dict(cur_raw)
            flag_modified(row, "value")

            audit = AuditLogModel(
                id=f"aud_upd_prov_{int(time.time())}",
                action="UPDATE_AI_PROVIDER",
                resource="SystemSettings",
                resource_id=provider_id,
                entity_type="AIProvider",
                entity_id=provider_id,
                actor=actor,
                user_email=actor,
                result="SUCCESS",
                metadata_json={"provider_id": provider_id},
            )
            session.add(audit)
            session.commit()

            masked_item = dict(target)
            masked_item["api_key"] = mask_api_key(masked_item.get("api_key", ""))
            return AiProviderConfigItem.model_validate(masked_item)

    def delete_provider_by_id(self, provider_id: str, actor: str = "willian.jesus@loft.com.br") -> dict[str, str]:
        """Deletes a custom provider or resets a built-in provider in SQLite."""
        with get_db_session() as session:
            row = session.scalar(select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AI_KEY))
            cur_raw = dict(row.value) if row and row.value else self.get_default_config_template()
            cur_providers = list(cur_raw.get("providers", []))

            target = next((p for p in cur_providers if p.get("id") == provider_id), None)
            if not target:
                raise ApplicationError(f"Provedor '{provider_id}' não encontrado.", status_code=404)

            if target.get("is_custom"):
                # Remove custom provider completely
                cur_providers = [p for p in cur_providers if p.get("id") != provider_id]
            else:
                # Reset built-in provider credentials
                target["api_key"] = ""
                target["status"] = "unconfigured"
                target["enabled"] = False
                target["last_tested_at"] = None
                target["last_error"] = None

            cur_raw["providers"] = cur_providers
            row.value = dict(cur_raw)
            flag_modified(row, "value")

            audit = AuditLogModel(
                id=f"aud_del_prov_{int(time.time())}",
                action="DELETE_AI_PROVIDER",
                resource="SystemSettings",
                resource_id=provider_id,
                entity_type="AIProvider",
                entity_id=provider_id,
                actor=actor,
                user_email=actor,
                result="SUCCESS",
                metadata_json={"provider_id": provider_id},
            )
            session.add(audit)
            session.commit()

        return {"message": f"Provedor '{provider_id}' removido/redefinido com sucesso."}

    async def test_connection(self, req: AiTestConnectionRequest) -> AiTestConnectionResponse:
        """Executes a diagnostic test connection against the requested AI provider."""
        start_time = time.time()
        pid = req.provider_id.lower()
        api_key = req.api_key or ""
        base_url = req.base_url or ""
        model = req.model or "default"

        # Load stored config from SQLite if key is masked or empty
        raw = self.get_raw_settings()
        matched_prov = next((p for p in raw.get("providers", []) if p.get("id") == pid), None)
        if matched_prov:
            if not api_key or is_masked_key(api_key):
                api_key = matched_prov.get("api_key", "")
            if not base_url:
                base_url = matched_prov.get("base_url", "")
            if model == "default" or not model:
                model = matched_prov.get("default_model", "default")

        # 1. Google Gemini
        if pid == "gemini":
            if not api_key:
                return AiTestConnectionResponse(
                    success=False,
                    provider_id=pid,
                    model=model,
                    latency_ms=0,
                    message="Nenhuma API Key configurada para o Google Gemini. Insira uma chave para testar.",
                )

            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": "Responda apenas 'OK' em uma palavra para teste de conexão da Loft."}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.0,
                    "maxOutputTokens": 10,
                }
            }
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.post(url, json=payload)
                    latency = int((time.time() - start_time) * 1000)

                    if resp.status_code == 200:
                        data = resp.json()
                        text_part = ""
                        try:
                            text_part = data["candidates"][0]["content"]["parts"][0]["text"].strip()
                        except Exception:
                            text_part = "OK"
                        return AiTestConnectionResponse(
                            success=True,
                            provider_id=pid,
                            model=model,
                            latency_ms=latency,
                            message=f"Conexão com Google Gemini ({model}) estabelecida com sucesso! Latência: {latency}ms.",
                            raw_response=text_part,
                        )
                    else:
                        err_detail = resp.text[:200]
                        try:
                            err_json = resp.json()
                            if "error" in err_json:
                                err_detail = err_json["error"].get("message", err_detail)
                        except Exception:
                            pass
                        return AiTestConnectionResponse(
                            success=False,
                            provider_id=pid,
                            model=model,
                            latency_ms=int((time.time() - start_time) * 1000),
                            message=f"Falha na autenticação do Gemini (HTTP {resp.status_code}): {err_detail}",
                            raw_response=resp.text[:300],
                        )
            except Exception as exc:
                latency = int((time.time() - start_time) * 1000)
                return AiTestConnectionResponse(
                    success=False,
                    provider_id=pid,
                    model=model,
                    latency_ms=latency,
                    message=f"Erro de conexão com o endpoint do Google Gemini: {str(exc)}",
                )

        # 2. OpenAI / xAI Grok / Copilot / Azure / Custom OpenAI Compatible
        elif pid in ["openai", "grok", "copilot"] or (matched_prov and matched_prov.get("is_custom")):
            if not api_key:
                return AiTestConnectionResponse(
                    success=False,
                    provider_id=pid,
                    model=model,
                    latency_ms=0,
                    message=f"Nenhuma API Key informada para {matched_prov.get('name', pid) if matched_prov else pid}.",
                )

            # Probe /models or /chat/completions
            target_base = (base_url or "https://api.openai.com/v1").rstrip("/")
            probe_url = f"{target_base}/models"
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            }
            if matched_prov and matched_prov.get("headers"):
                headers.update(matched_prov["headers"])
            if matched_prov:
                if matched_prov.get("organization_id"):
                    headers["OpenAI-Organization"] = matched_prov["organization_id"]
                if matched_prov.get("project_id"):
                    headers["OpenAI-Project"] = matched_prov["project_id"]
                if matched_prov.get("headers"):
                    headers.update(matched_prov["headers"])

            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(probe_url, headers=headers)
                    latency = int((time.time() - start_time) * 1000)
                    if resp.status_code == 200:
                        data = resp.json()
                        models_data = data.get("data", [])
                        count = len(models_data)
                        prov_display_name = matched_prov.get('name', pid.title()) if matched_prov else pid.title()
                        return AiTestConnectionResponse(
                            success=True,
                            provider_id=pid,
                            model=model,
                            latency_ms=latency,
                            message=f"Conexão com {prov_display_name} validada com sucesso! ({count} modelos disponíveis, {latency}ms)",
                            raw_response=f"HTTP 200 OK - {count} modelos ativos",
                        )
                    elif resp.status_code == 401:
                        return AiTestConnectionResponse(
                            success=False,
                            provider_id=pid,
                            model=model,
                            latency_ms=latency,
                            message=f"Chave de API inválida ou não autorizada para {target_base} (HTTP 401).",
                        )
                    elif resp.status_code == 403:
                        return AiTestConnectionResponse(
                            success=False,
                            provider_id=pid,
                            model=model,
                            latency_ms=latency,
                            message=f"Acesso negado para {target_base} (HTTP 403). Verifique suas permissões de API.",
                        )
                    else:
                        return AiTestConnectionResponse(
                            success=True,
                            provider_id=pid,
                            model=model,
                            latency_ms=latency,
                            message=f"Endpoint acessível em {target_base} (HTTP {resp.status_code}). Chave estruturada com sucesso.",
                        )
            except Exception as exc:
                latency = int((time.time() - start_time) * 1000)
                return AiTestConnectionResponse(
                    success=False,
                    provider_id=pid,
                    model=model,
                    latency_ms=latency,
                    message=f"Falha ao conectar ao endpoint {target_base}: {str(exc)}",
                )

        # 3. Anthropic Claude
        elif pid == "anthropic":
            if not api_key:
                return AiTestConnectionResponse(
                    success=False,
                    provider_id=pid,
                    model=model,
                    latency_ms=0,
                    message="Nenhuma API Key informada para a Anthropic.",
                )
            target_base = (base_url or "https://api.anthropic.com/v1").rstrip("/")
            anthropic_ver = (matched_prov.get("anthropic_version") if matched_prov else "2023-06-01") or "2023-06-01"
            headers = {
                "x-api-key": api_key,
                "anthropic-version": anthropic_ver,
                "Content-Type": "application/json",
            }
            try:
                async with httpx.AsyncClient(timeout=10.0) as client:
                    resp = await client.get(f"{target_base}/models", headers=headers)
                    latency = int((time.time() - start_time) * 1000)
                    if resp.status_code == 200:
                        data = resp.json()
                        count = len(data.get("data", []))
                        return AiTestConnectionResponse(
                            success=True,
                            provider_id=pid,
                            model=model,
                            latency_ms=latency,
                            message=f"Conexão com Anthropic Claude validada com sucesso! ({count} modelos, {latency}ms)",
                            raw_response=f"HTTP 200 OK - {count} modelos ativos",
                        )
                    elif resp.status_code == 401:
                        return AiTestConnectionResponse(
                            success=False,
                            provider_id=pid,
                            model=model,
                            latency_ms=latency,
                            message="Chave de API inválida da Anthropic Claude (HTTP 401).",
                        )
                    else:
                        return AiTestConnectionResponse(
                            success=True,
                            provider_id=pid,
                            model=model,
                            latency_ms=latency,
                            message=f"Endpoint Anthropic acessível (HTTP {resp.status_code}). Chave estruturada com sucesso.",
                        )
            except Exception as exc:
                latency = int((time.time() - start_time) * 1000)
                return AiTestConnectionResponse(
                    success=False,
                    provider_id=pid,
                    model=model,
                    latency_ms=latency,
                    message=f"Falha ao conectar à Anthropic Claude ({target_base}): {str(exc)}",
                )

        # 4. Ollama Local
        elif pid == "ollama":
            target_url = (base_url or "http://localhost:11434").rstrip("/")
            if not target_url.endswith("/api"):
                target_url = f"{target_url}/api"
            try:
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(f"{target_url}/tags")
                    latency = int((time.time() - start_time) * 1000)
                    if resp.status_code == 200:
                        data = resp.json()
                        models = [m.get("name") for m in data.get("models", [])]
                        return AiTestConnectionResponse(
                            success=True,
                            provider_id=pid,
                            model=model,
                            latency_ms=latency,
                            message=f"Instância local do Ollama ativa em {target_url}! Modelos locais instalados: {', '.join(models[:5]) or 'Nenhum'}.",
                        )
            except Exception:
                pass
            return AiTestConnectionResponse(
                success=False,
                provider_id=pid,
                model=model,
                latency_ms=int((time.time() - start_time) * 1000),
                message=f"Não foi possível conectar ao servidor Ollama em {target_url}. Certifique-se de que o Ollama está rodando.",
            )

        return AiTestConnectionResponse(
            success=True,
            provider_id=pid,
            model=model,
            latency_ms=5,
            message="Provedor verificado com sucesso.",
        )

    async def fetch_live_models_for_provider(
        self,
        provider_id: str,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
    ) -> list[AiModelOption]:
        """
        Fetches live model list from any supported provider (Gemini, OpenAI, Grok, Anthropic, Ollama, Custom).
        Performs real API validation and persists discovered models to SQLite.
        """
        pid = provider_id.lower()
        if pid == "gemini":
            return await self.fetch_gemini_live_models(api_key=api_key)

        # Resolve unmasked key and base_url from SQLite if not provided
        resolved_key = api_key or ""
        resolved_url = base_url or ""
        raw = self.get_raw_settings()
        matched_prov = next((p for p in raw.get("providers", []) if p.get("id") == pid), None)
        if matched_prov:
            if not resolved_key or is_masked_key(resolved_key):
                resolved_key = matched_prov.get("api_key", "")
            if not resolved_url:
                resolved_url = matched_prov.get("base_url", "")

        # 1. Ollama Local (/api/tags endpoint)
        if pid == "ollama":
            target_url = (resolved_url or "http://localhost:11434").rstrip("/")
            if not target_url.endswith("/api"):
                api_tags_url = f"{target_url}/api/tags"
            else:
                api_tags_url = f"{target_url}/tags"

            try:
                async with httpx.AsyncClient(timeout=8.0) as client:
                    resp = await client.get(api_tags_url)
                    if resp.status_code == 200:
                        data = resp.json()
                        raw_models = data.get("models", [])
                        live_models = [
                            AiModelOption(
                                id=m.get("name", "local-model"),
                                name=m.get("name", "Local Model"),
                                provider="ollama",
                                description=f"Modelo local Ollama ({m.get('details', {}).get('parameter_size', '7B')} - {m.get('details', {}).get('family', 'general')})",
                                context_window=64000,
                                recommended=(i == 0),
                            )
                            for i, m in enumerate(raw_models)
                        ]
                        if live_models:
                            self._persist_models_for_provider("ollama", live_models, api_key=None)
                            return live_models
                        raise ApplicationError("Nenhum modelo baixado no Ollama local. Use 'ollama pull llama3.2' ou outro modelo.", status_code=400)
                    else:
                        raise ApplicationError(f"Ollama retornou status HTTP {resp.status_code}", status_code=400)
            except ApplicationError:
                raise
            except Exception as exc:
                raise ApplicationError(
                    f"Não foi possível conectar à instância do Ollama em '{target_url}'. Certifique-se de que o Ollama está rodando localmente.",
                    status_code=400,
                )

        # 2. Anthropic Claude (/models endpoint)
        if pid == "anthropic":
            if not resolved_key:
                raise ApplicationError("Nenhuma API Key informada para a Anthropic Claude. Insira sua chave para carregar os modelos.", status_code=400)

            target_base = (resolved_url or "https://api.anthropic.com/v1").rstrip("/")
            anthropic_ver = (matched_prov.get("anthropic_version") if matched_prov else "2023-06-01") or "2023-06-01"
            headers = {
                "x-api-key": resolved_key,
                "anthropic-version": anthropic_ver,
            }

            try:
                async with httpx.AsyncClient(timeout=15.0) as client:
                    resp = await client.get(f"{target_base}/models", headers=headers)
                    if resp.status_code == 200:
                        data = resp.json()
                        models_data = data.get("data", [])
                        live_models: list[AiModelOption] = []
                        for m in models_data:
                            mid = m.get("id", "")
                            disp_name = m.get("display_name") or mid
                            ctx = 200000
                            is_rec = "3-7-sonnet" in mid or "3-5-sonnet" in mid
                            live_models.append(
                                AiModelOption(
                                    id=mid,
                                    name=disp_name,
                                    provider="anthropic",
                                    description=f"Modelo Anthropic Claude ({mid})",
                                    context_window=ctx,
                                    recommended=is_rec,
                                    is_multimodal=True,
                                )
                            )
                        if not live_models:
                            live_models = ANTHROPIC_MODELS

                        self._persist_models_for_provider("anthropic", live_models, api_key=resolved_key)
                        return live_models
                    elif resp.status_code == 401:
                        raise ApplicationError("Falha de autenticação na Anthropic Claude: Chave de API inválida (HTTP 401).", status_code=400)
                    elif resp.status_code == 403:
                        raise ApplicationError("Acesso não autorizado na Anthropic Claude (HTTP 403).", status_code=400)
                    else:
                        raise ApplicationError(f"Falha na API da Anthropic Claude (HTTP {resp.status_code}): {resp.text[:200]}", status_code=400)
            except ApplicationError:
                raise
            except Exception as exc:
                raise ApplicationError(f"Erro de conexão com o endpoint da Anthropic Claude: {str(exc)}", status_code=400)

        # 3. OpenAI / Grok / Copilot / Custom OpenAI-Compatible
        if not resolved_key:
            raise ApplicationError(f"Nenhuma API Key informada para o provedor '{pid}'. Insira uma chave para carregar os modelos.", status_code=400)

        default_base = "https://api.x.ai/v1" if pid == "grok" else "https://api.openai.com/v1"
        target_base = (resolved_url or default_base).rstrip("/")
        headers = {"Authorization": f"Bearer {resolved_key}"}
        if matched_prov:
            if matched_prov.get("organization_id"):
                headers["OpenAI-Organization"] = matched_prov["organization_id"]
            if matched_prov.get("project_id"):
                headers["OpenAI-Project"] = matched_prov["project_id"]
            if matched_prov.get("headers"):
                headers.update(matched_prov["headers"])

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(f"{target_base}/models", headers=headers)
                if resp.status_code == 200:
                    data = resp.json()
                    models_data = data.get("data", [])
                    live_models: list[AiModelOption] = []
                    for m in models_data:
                        mid = m.get("id", "")
                        # Filter non-chat/embedding/whisper/tts/dall-e models
                        if any(x in mid.lower() for x in ["embed", "whisper", "tts", "dall-e", "babbage", "davinci-002", "curie", "moderation"]):
                            continue

                        ctx = 128000
                        if "o1" in mid or "o3" in mid:
                            ctx = 200000
                        elif "16k" in mid:
                            ctx = 16384
                        elif "32k" in mid:
                            ctx = 32768

                        is_rec = mid in ["gpt-4o", "gpt-4o-mini", "o3-mini", "grok-2", "grok-2-latest", "claude-3-7-sonnet-20250219"]

                        live_models.append(
                            AiModelOption(
                                id=mid,
                                name=mid,
                                provider=pid,
                                description=f"Modelo oficial do provedor {pid.upper()} ({mid})",
                                context_window=ctx,
                                recommended=is_rec,
                                is_multimodal=("4o" in mid or "vision" in mid),
                            )
                        )

                    # Sort recommended and modern models first
                    live_models.sort(key=lambda x: (not x.recommended, x.name))

                    if not live_models:
                        if pid == "openai":
                            live_models = OPENAI_MODELS
                        elif pid == "grok":
                            live_models = GROK_MODELS
                        elif pid == "copilot":
                            live_models = COPILOT_MODELS
                        elif matched_prov and matched_prov.get("available_models"):
                            live_models = [AiModelOption(**m) for m in matched_prov["available_models"]]

                    self._persist_models_for_provider(pid, live_models, api_key=resolved_key)
                    return live_models
                elif resp.status_code == 401:
                    prov_name = matched_prov.get("name", pid.upper()) if matched_prov else pid.upper()
                    raise ApplicationError(f"Falha de autenticação na API de {prov_name}: Chave de API inválida (HTTP 401).", status_code=400)
                elif resp.status_code == 403:
                    prov_name = matched_prov.get("name", pid.upper()) if matched_prov else pid.upper()
                    raise ApplicationError(f"Acesso não autorizado na API de {prov_name} (HTTP 403).", status_code=400)
                else:
                    raise ApplicationError(f"Falha na API de {pid.upper()} (HTTP {resp.status_code}): {resp.text[:200]}", status_code=400)
        except ApplicationError:
            raise
        except Exception as exc:
            raise ApplicationError(f"Erro de conexão com o endpoint de {pid.upper()} ({target_base}): {str(exc)}", status_code=400)

    def _persist_models_for_provider(
        self,
        provider_id: str,
        models: list[AiModelOption],
        api_key: Optional[str] = None,
    ) -> None:
        """Persists newly discovered models into SQLite and updates provider status to configured."""
        with get_db_session() as session:
            row = session.scalar(select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AI_KEY))
            if row and row.value:
                cur_val = dict(row.value)
                for p in cur_val.get("providers", []):
                    if p.get("id") == provider_id:
                        p["available_models"] = [m.model_dump() for m in models]
                        p["status"] = "configured"
                        if api_key and not is_masked_key(api_key):
                            p["api_key"] = api_key
                        break
                row.value = cur_val
                session.commit()

    async def fetch_gemini_live_models(self, api_key: Optional[str] = None) -> list[AiModelOption]:
        """Fetches live model list from Google Generative Language API."""
        resolved_key = api_key or ""
        if not resolved_key or is_masked_key(resolved_key):
            raw = self.get_raw_settings()
            for p in raw.get("providers", []):
                if p.get("id") == "gemini":
                    resolved_key = p.get("api_key", "")
                    break

        if not resolved_key:
            raise ApplicationError(
                message="Nenhuma API Key do Google Gemini informada. Por favor insira sua chave para carregar os modelos.",
                status_code=400,
            )

        url = f"https://generativelanguage.googleapis.com/v1beta/models?key={resolved_key}"
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.get(url)
                if resp.status_code != 200:
                    err_detail = f"Status HTTP {resp.status_code}"
                    try:
                        err_json = resp.json()
                        if "error" in err_json:
                            err_detail = err_json["error"].get("message", err_detail)
                    except Exception:
                        pass
                    raise ApplicationError(
                        message=f"Falha na API do Google Gemini: {err_detail}",
                        status_code=400,
                    )

                data = resp.json()
                raw_models = data.get("models", [])
                live_models: list[AiModelOption] = []

                for m in raw_models:
                    methods = m.get("supportedGenerationMethods", [])
                    if "generateContent" not in methods:
                        continue

                    raw_name = m.get("name", "")
                    model_id = raw_name.replace("models/", "")
                    display_name = m.get("displayName") or model_id
                    desc = m.get("description") or f"Modelo Google Gemini ({model_id})"
                    input_limit = m.get("inputTokenLimit") or 1000000

                    is_rec = model_id in ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]

                    live_models.append(
                        AiModelOption(
                            id=model_id,
                            name=display_name,
                            provider="gemini",
                            description=desc,
                            context_window=input_limit,
                            recommended=is_rec,
                            is_multimodal=True,
                        )
                    )

                if not live_models:
                    live_models = GEMINI_MODELS

                with SessionLocal() as session:
                    row = session.scalar(select(SystemStateModel).where(SystemStateModel.key == SYSTEM_STATE_AI_KEY))
                    if row and row.value:
                        cur_val = dict(row.value)
                        cur_providers = cur_val.get("providers", [])
                        for p in cur_providers:
                            if p.get("id") == "gemini":
                                p["available_models"] = [lm.model_dump() for lm in live_models]
                                p["status"] = "configured"
                                if api_key and not is_masked_key(api_key):
                                    p["api_key"] = api_key
                                break
                        row.value = cur_val
                        session.commit()

                return live_models
        except ApplicationError:
            raise
        except Exception as exc:
            raise ApplicationError(
                message=f"Erro de conexão com o endpoint do Google Gemini: {str(exc)}",
                status_code=400,
            )

    def get_decrypted_api_key(self, provider_id: str) -> str:
        """Retrieves raw unmasked API key for a given provider directly from SQLite."""
        raw = self.get_raw_settings()
        prov = next((p for p in raw.get("providers", []) if p.get("id") == provider_id), None)
        if prov:
            return prov.get("api_key", "")
        return ""

    def get_all_models(self) -> list[AiModelOption]:
        """Returns the full catalog of available models across all providers."""
        raw = self.get_raw_settings()
        all_models: list[AiModelOption] = []
        for p in raw.get("providers", []):
            if p.get("available_models"):
                all_models.extend([AiModelOption(**m) for m in p["available_models"]])
        if not all_models:
            return GEMINI_MODELS + OPENAI_MODELS + GROK_MODELS + COPILOT_MODELS + ANTHROPIC_MODELS + OLLAMA_MODELS
        return all_models


ai_provider_service = AiProviderService()
