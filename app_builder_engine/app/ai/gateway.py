"""
LLM Gateway
Single point of entry for AI operations in the backend
Follows Loft Backend AI Specification Vol V (AI-BAS)
"""
from __future__ import annotations
from typing import TypeVar, Any
from pydantic import BaseModel
from app.ai.providers import BaseAIProvider, get_configured_ai_provider
from app.core.errors import AIServiceError

T = TypeVar("T", bound=BaseModel)


class LLMGateway:
    def __init__(self, provider: BaseAIProvider | None = None) -> None:
        self._custom_provider = provider

    @property
    def provider(self) -> BaseAIProvider:
        if self._custom_provider:
            return self._custom_provider
        return get_configured_ai_provider()

    async def generate_text(self, prompt: str, system_prompt: str | None = None) -> str:
        try:
            return await self.provider.generate_text(prompt=prompt, system_prompt=system_prompt)
        except Exception as e:
            raise AIServiceError(f"AI Gateway text generation failed: {str(e)}") from e

    async def generate_structured(
        self,
        prompt: str,
        response_model: type[T],
        system_prompt: str | None = None,
    ) -> T:
        try:
            return await self.provider.generate_structured(
                prompt=prompt,
                response_model=response_model,
                system_prompt=system_prompt,
            )
        except Exception as e:
            raise AIServiceError(f"AI Gateway structured generation failed: {str(e)}") from e
