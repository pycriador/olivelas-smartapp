"""
App Builder Engine Python SDK & API Client
Provides seamless integration with the Loft App Builder Engine API,
enabling 100% automated application composition, blueprint compilation,
governance validation, and fullstack scaffolding.
"""
from __future__ import annotations

from api_client.config import ApiClientConfig
from api_client.client import AppBuilderClient
from api_client.exceptions import (
    AppBuilderApiError,
    ApiConnectionError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    ServerInternalError,
    CompositionError,
)

__version__ = "1.0.0"
__all__ = [
    "AppBuilderClient",
    "ApiClientConfig",
    "AppBuilderApiError",
    "ApiConnectionError",
    "AuthenticationError",
    "AuthorizationError",
    "NotFoundError",
    "ValidationError",
    "ServerInternalError",
    "CompositionError",
]
