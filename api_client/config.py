"""
Configuration models for the App Builder Engine API Client.
"""
from __future__ import annotations
import os
from dataclasses import dataclass, field


@dataclass
class ApiClientConfig:
    """Settings and credentials for connecting to the App Builder Engine API."""

    base_url: str = field(
        default_factory=lambda: os.getenv("APP_BUILDER_BASE_URL", "http://127.0.0.1:8000")
    )
    api_prefix: str = "/api/v1"
    timeout_seconds: float = 60.0
    max_retries: int = 3
    retry_backoff_factor: float = 0.5
    auth_token: str | None = field(
        default_factory=lambda: os.getenv("APP_BUILDER_AUTH_TOKEN", None)
    )
    actor_email: str = field(
        default_factory=lambda: os.getenv("APP_BUILDER_ACTOR_EMAIL", "willian.jesus@loft.com.br")
    )
    actor_role: str = field(
        default_factory=lambda: os.getenv("APP_BUILDER_ACTOR_ROLE", "Global Admin")
    )
    user_agent: str = "Loft-AppBuilderClient/1.0.0 (Python)"
    verify_ssl: bool = True

    @property
    def api_base_url(self) -> str:
        """Normalized base API endpoint URL with prefix."""
        base = self.base_url.rstrip("/")
        prefix = self.api_prefix.strip("/")
        return f"{base}/{prefix}"
