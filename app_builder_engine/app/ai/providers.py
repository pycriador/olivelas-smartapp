"""
AI Provider Adapters
Follows Loft Backend AI Specification Vol V (AI-BAS)
Supports 100% Real AI execution for Google Gemini, OpenAI, Anthropic Claude, xAI (Grok), Ollama, and Custom Gateways.
Zero synthetic mock data or mock fallbacks.
"""
from __future__ import annotations
import json
import logging
from abc import ABC, abstractmethod
from typing import TypeVar, Any
import httpx
from pydantic import BaseModel
from app.core.errors import AIServiceError

T = TypeVar("T", bound=BaseModel)
logger = logging.getLogger("app-builder-engine.ai")


class BaseAIProvider(ABC):
    """Abstract interface for all AI model providers."""

    @abstractmethod
    async def generate_text(self, prompt: str, system_prompt: str | None = None, **kwargs: Any) -> str:
        """Generates unstructured text response from real provider API."""
        pass

    @abstractmethod
    async def generate_structured(
        self,
        prompt: str,
        response_model: type[T],
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> T:
        """Generates structured output validated against a Pydantic model from real provider API."""
        pass


class GeminiAIProvider(BaseAIProvider):
    """
    Google Gemini AI Provider.
    Calls Google Generative Language REST API (v1beta) using the user's configured model and API key.
    Zero mocks.
    """

    def __init__(
        self,
        api_key: str = "",
        model: str = "gemini-2.5-flash",
        temperature: float = 0.2,
        max_output_tokens: int = 4096,
        top_p: float = 0.95,
        top_k: int = 40,
        system_instruction: str | None = None,
        base_url: str = "https://generativelanguage.googleapis.com/v1beta",
    ) -> None:
        self.api_key = api_key.strip()
        self.model = model or "gemini-2.5-flash"
        self.temperature = temperature
        self.max_output_tokens = max_output_tokens
        self.top_p = top_p
        self.top_k = top_k
        self.system_instruction = system_instruction
        self.base_url = base_url.rstrip("/")

    async def generate_text(self, prompt: str, system_prompt: str | None = None, **kwargs: Any) -> str:
        if not self.api_key:
            raise AIServiceError("Chave de API do Google Gemini não está configurada. Configure sua chave em /ai/providers.")

        url = f"{self.base_url}/models/{self.model}:generateContent?key={self.api_key}"
        sys_inst = system_prompt or self.system_instruction or "Você é o assistente técnico de inteligência artificial da Loft."

        payload: dict[str, Any] = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}],
                }
            ],
            "generationConfig": {
                "temperature": kwargs.get("temperature", self.temperature),
                "maxOutputTokens": kwargs.get("max_output_tokens", self.max_output_tokens),
                "topP": kwargs.get("top_p", self.top_p),
                "topK": kwargs.get("top_k", self.top_k),
            },
            "systemInstruction": {
                "parts": [{"text": sys_inst}]
            }
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code != 200:
                logger.error(f"Gemini API Error {resp.status_code}: {resp.text}")
                error_msg = f"Google Gemini API Error (HTTP {resp.status_code})"
                try:
                    err_json = resp.json()
                    if "error" in err_json and "message" in err_json["error"]:
                        error_msg = f"Google Gemini API: {err_json['error']['message']} (HTTP {resp.status_code})"
                except Exception:
                    error_msg = f"Google Gemini API: {resp.text[:300]} (HTTP {resp.status_code})"
                raise AIServiceError(error_msg)

            data = resp.json()
            try:
                candidate = data["candidates"][0]
                text_part = candidate["content"]["parts"][0]["text"]
                return text_part
            except (KeyError, IndexError) as exc:
                logger.error(f"Failed to parse Gemini response: {data}")
                raise AIServiceError(f"Formato inesperado na resposta da API Gemini: {str(exc)}")

    async def generate_structured(
        self,
        prompt: str,
        response_model: type[T],
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> T:
        schema = response_model.model_json_schema()
        schema_instruction = (
            f"\n\nIMPORTANTE: Responda ESTRITAMENTE em formato JSON válido que siga este schema JSON:\n"
            f"```json\n{json.dumps(schema, indent=2)}\n```\n"
            f"Não inclua blocos markdown nem texto adicional fora do JSON."
        )

        full_prompt = prompt + schema_instruction
        raw_text = await self.generate_text(full_prompt, system_prompt=system_prompt, **kwargs)

        clean_json = raw_text.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]
        if clean_json.startswith("```"):
            clean_json = clean_json[3:]
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]
        clean_json = clean_json.strip()

        try:
            parsed = json.loads(clean_json)
            return response_model.model_validate(parsed)
        except Exception as exc:
            logger.error(f"Failed to parse structured JSON from Gemini: {exc}. Raw content: {raw_text[:200]}")
            raise AIServiceError(f"Falha ao validar resposta estruturada da API Gemini: {str(exc)}")


class AnthropicAIProvider(BaseAIProvider):
    """
    Anthropic Claude AI Provider.
    Calls Anthropic Messages API (v1) using the user's configured model and API key.
    Zero mocks.
    """

    def __init__(
        self,
        api_key: str = "",
        model: str = "claude-3-7-sonnet-20250219",
        temperature: float = 0.2,
        max_output_tokens: int = 4096,
        top_p: float = 1.0,
        top_k: int = 50,
        anthropic_version: str = "2023-06-01",
        system_instruction: str | None = None,
        base_url: str = "https://api.anthropic.com",
    ) -> None:
        self.api_key = api_key.strip()
        self.model = model or "claude-3-7-sonnet-20250219"
        self.temperature = temperature
        self.max_output_tokens = max_output_tokens
        self.top_p = top_p
        self.top_k = top_k
        self.anthropic_version = anthropic_version or "2023-06-01"
        self.system_instruction = system_instruction
        self.base_url = base_url.rstrip("/")

    async def generate_text(self, prompt: str, system_prompt: str | None = None, **kwargs: Any) -> str:
        if not self.api_key:
            raise AIServiceError("Chave de API da Anthropic Claude não está configurada. Configure sua chave em /ai/providers.")

        endpoint = f"{self.base_url}/v1/messages" if not self.base_url.endswith("/v1") else f"{self.base_url}/messages"
        sys_inst = system_prompt or self.system_instruction or "Você é o assistente técnico de inteligência artificial da Loft."

        req_headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key,
            "anthropic-version": self.anthropic_version,
        }

        payload: dict[str, Any] = {
            "model": self.model,
            "max_tokens": kwargs.get("max_output_tokens", self.max_output_tokens),
            "temperature": kwargs.get("temperature", self.temperature),
            "system": sys_inst,
            "messages": [
                {"role": "user", "content": prompt}
            ],
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(endpoint, json=payload, headers=req_headers)
            if resp.status_code != 200:
                logger.error(f"Anthropic API Error {resp.status_code}: {resp.text}")
                error_msg = f"Anthropic Claude API Error (HTTP {resp.status_code})"
                try:
                    err_json = resp.json()
                    if "error" in err_json and "message" in err_json["error"]:
                        error_msg = f"Anthropic API: {err_json['error']['message']} (HTTP {resp.status_code})"
                except Exception:
                    error_msg = f"Anthropic API: {resp.text[:300]} (HTTP {resp.status_code})"
                raise AIServiceError(error_msg)

            data = resp.json()
            try:
                content_blocks = data.get("content", [])
                text_pieces = [b["text"] for b in content_blocks if b.get("type") == "text"]
                return "".join(text_pieces)
            except Exception as exc:
                logger.error(f"Failed to parse Anthropic response: {data}")
                raise AIServiceError(f"Formato inesperado na resposta da API Anthropic: {str(exc)}")

    async def generate_structured(
        self,
        prompt: str,
        response_model: type[T],
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> T:
        schema = response_model.model_json_schema()
        schema_instruction = (
            f"\n\nIMPORTANTE: Responda ESTRITAMENTE em formato JSON válido que siga este schema JSON:\n"
            f"```json\n{json.dumps(schema, indent=2)}\n```\n"
            f"Não inclua blocos markdown nem texto adicional fora do JSON."
        )

        full_prompt = prompt + schema_instruction
        raw_text = await self.generate_text(full_prompt, system_prompt=system_prompt, **kwargs)

        clean_json = raw_text.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]
        if clean_json.startswith("```"):
            clean_json = clean_json[3:]
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]
        clean_json = clean_json.strip()

        try:
            parsed = json.loads(clean_json)
            return response_model.model_validate(parsed)
        except Exception as exc:
            logger.error(f"Failed to parse structured JSON from Anthropic: {exc}. Raw content: {raw_text[:200]}")
            raise AIServiceError(f"Falha ao validar resposta estruturada da API Anthropic: {str(exc)}")


class OpenAICompatibleAIProvider(BaseAIProvider):
    """
    OpenAI-Compatible AI Provider.
    Supports OpenAI, xAI (Grok), GitHub Copilot, Azure OpenAI, Ollama, and custom OpenAI-compatible gateways.
    Zero mocks.
    """

    def __init__(
        self,
        api_key: str = "",
        base_url: str = "https://api.openai.com/v1",
        model: str = "gpt-4o",
        temperature: float = 0.2,
        max_output_tokens: int = 4096,
        top_p: float = 1.0,
        headers: dict[str, str] | None = None,
        system_instruction: str | None = None,
        provider_name: str = "OpenAI",
        organization_id: str | None = None,
        project_id: str | None = None,
    ) -> None:
        self.api_key = api_key.strip()
        self.base_url = base_url.rstrip("/")
        self.model = model or "gpt-4o"
        self.temperature = temperature
        self.max_output_tokens = max_output_tokens
        self.top_p = top_p
        self.custom_headers = headers or {}
        self.system_instruction = system_instruction
        self.provider_name = provider_name
        self.organization_id = organization_id
        self.project_id = project_id

    async def generate_text(self, prompt: str, system_prompt: str | None = None, **kwargs: Any) -> str:
        is_local = "localhost" in self.base_url or "127.0.0.1" in self.base_url
        if not self.api_key and not is_local:
            raise AIServiceError(f"Chave de API de {self.provider_name} não está configurada. Configure sua chave em /ai/providers.")

        url = f"{self.base_url}/chat/completions"
        req_headers = {
            "Content-Type": "application/json",
            **self.custom_headers,
        }
        if self.api_key:
            req_headers["Authorization"] = f"Bearer {self.api_key}"
            if "azure.com" in self.base_url:
                req_headers["api-key"] = self.api_key

        if self.organization_id:
            req_headers["OpenAI-Organization"] = self.organization_id
        if self.project_id:
            req_headers["OpenAI-Project"] = self.project_id

        sys_inst = system_prompt or self.system_instruction or "Você é o assistente técnico de inteligência artificial da Loft."
        messages = [
            {"role": "system", "content": sys_inst},
            {"role": "user", "content": prompt},
        ]

        payload: dict[str, Any] = {
            "model": self.model,
            "messages": messages,
            "temperature": kwargs.get("temperature", self.temperature),
            "max_tokens": kwargs.get("max_output_tokens", self.max_output_tokens),
            "top_p": kwargs.get("top_p", self.top_p),
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            resp = await client.post(url, json=payload, headers=req_headers)
            if resp.status_code != 200:
                logger.error(f"{self.provider_name} HTTP {resp.status_code}: {resp.text}")
                error_msg = f"{self.provider_name} API Error (HTTP {resp.status_code})"
                try:
                    err_json = resp.json()
                    if "error" in err_json:
                        if isinstance(err_json["error"], dict) and "message" in err_json["error"]:
                            error_msg = f"{self.provider_name} API: {err_json['error']['message']} (HTTP {resp.status_code})"
                        elif isinstance(err_json["error"], str):
                            error_msg = f"{self.provider_name} API: {err_json['error']} (HTTP {resp.status_code})"
                except Exception:
                    error_msg = f"{self.provider_name} API: {resp.text[:300]} (HTTP {resp.status_code})"
                raise AIServiceError(error_msg)

            data = resp.json()
            try:
                return data["choices"][0]["message"]["content"]
            except (KeyError, IndexError) as exc:
                logger.error(f"Failed to parse {self.provider_name} response: {data}")
                raise AIServiceError(f"Formato inesperado na resposta da API {self.provider_name}: {str(exc)}")

    async def generate_structured(
        self,
        prompt: str,
        response_model: type[T],
        system_prompt: str | None = None,
        **kwargs: Any,
    ) -> T:
        schema = response_model.model_json_schema()
        schema_instruction = (
            f"\n\nIMPORTANTE: Responda ESTRITAMENTE em formato JSON válido que siga este schema JSON:\n"
            f"```json\n{json.dumps(schema, indent=2)}\n```\n"
            f"Não inclua blocos markdown nem texto adicional fora do JSON."
        )
        full_prompt = prompt + schema_instruction
        raw_text = await self.generate_text(full_prompt, system_prompt=system_prompt, **kwargs)

        clean_json = raw_text.strip()
        if clean_json.startswith("```json"):
            clean_json = clean_json[7:]
        if clean_json.startswith("```"):
            clean_json = clean_json[3:]
        if clean_json.endswith("```"):
            clean_json = clean_json[:-3]
        clean_json = clean_json.strip()

        try:
            parsed = json.loads(clean_json)
            return response_model.model_validate(parsed)
        except Exception as exc:
            logger.error(f"Failed to parse structured JSON from {self.provider_name}: {exc}. Raw content: {raw_text[:200]}")
            raise AIServiceError(f"Falha ao validar resposta estruturada da API {self.provider_name}: {str(exc)}")


def get_configured_ai_provider(provider_id: str | None = None, model_name: str | None = None) -> BaseAIProvider:
    """Factory creating the active AI provider based on current SQLite configuration."""
    from app.services.ai_provider_service import ai_provider_service
    raw = ai_provider_service.get_raw_settings()
    
    target_provider = provider_id
    if not target_provider and model_name:
        m_lower = model_name.lower()
        if m_lower.startswith("gemini"):
            target_provider = "gemini"
        elif m_lower.startswith("claude"):
            target_provider = "anthropic"
        elif m_lower.startswith("grok"):
            target_provider = "grok"
        elif m_lower.startswith("gpt") or m_lower.startswith("o1") or m_lower.startswith("o3"):
            target_provider = "openai"
        elif any(m_lower.startswith(prefix) for prefix in ["llama", "mistral", "deepseek", "qwen", "phi"]):
            target_provider = "ollama"

    default_provider = target_provider or raw.get("default_provider", "gemini")
    default_model = model_name or raw.get("default_model", "gemini-2.5-flash")

    providers = raw.get("providers", [])
    active_cfg = next((p for p in providers if p.get("id") == default_provider), None)

    if not active_cfg:
        active_cfg = next((p for p in providers if p.get("enabled", True)), {})

    pid = active_cfg.get("id", default_provider)
    api_key = active_cfg.get("api_key", "")
    model = model_name or active_cfg.get("default_model", default_model)
    temp = active_cfg.get("temperature", 0.2)
    max_tokens = active_cfg.get("max_output_tokens", 4096)
    top_p = active_cfg.get("top_p", 0.95)
    top_k = active_cfg.get("top_k", 40)
    sys_inst = active_cfg.get("system_instruction")
    base_url = active_cfg.get("base_url", "")
    prov_name = active_cfg.get("name", pid)
    headers = active_cfg.get("headers", {})
    org_id = active_cfg.get("organization_id")
    proj_id = active_cfg.get("project_id")
    ant_version = active_cfg.get("anthropic_version", "2023-06-01")

    if pid == "gemini":
        return GeminiAIProvider(
            api_key=api_key,
            model=model,
            temperature=temp,
            max_output_tokens=max_tokens,
            top_p=top_p,
            top_k=top_k,
            system_instruction=sys_inst,
            base_url=base_url or "https://generativelanguage.googleapis.com/v1beta",
        )

    if pid == "anthropic":
        return AnthropicAIProvider(
            api_key=api_key,
            model=model,
            temperature=temp,
            max_output_tokens=max_tokens,
            top_p=top_p,
            top_k=top_k,
            anthropic_version=ant_version,
            system_instruction=sys_inst,
            base_url=base_url or "https://api.anthropic.com",
        )

    # Default to OpenAI-compatible provider (OpenAI, xAI Grok, Ollama, Copilot, Custom)
    return OpenAICompatibleAIProvider(
        api_key=api_key,
        base_url=base_url or ("https://api.x.ai/v1" if pid == "grok" else "https://api.openai.com/v1"),
        model=model,
        temperature=temp,
        max_output_tokens=max_tokens,
        top_p=top_p,
        headers=headers,
        system_instruction=sys_inst,
        provider_name=prov_name,
        organization_id=org_id,
        project_id=proj_id,
    )
