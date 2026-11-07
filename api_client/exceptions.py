"""
Custom Exception Classes for the App Builder API Client.
"""
from __future__ import annotations
from typing import Any


class AppBuilderApiError(Exception):
    """Base exception for all App Builder API client operations."""

    def __init__(
        self,
        message: str,
        status_code: int | None = None,
        error_code: str | None = None,
        details: Any = None,
        raw_response: str | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details
        self.raw_response = raw_response

    def __str__(self) -> str:
        parts = [self.message]
        if self.status_code:
            parts.append(f"[Status {self.status_code}]")
        if self.error_code:
            parts.append(f"[Code: {self.error_code}]")
        if self.details:
            parts.append(f"[Details: {self.details}]")
        return " ".join(parts)


class ApiConnectionError(AppBuilderApiError):
    """Raised when the client cannot connect to the App Builder API server."""
    pass


class AuthenticationError(AppBuilderApiError):
    """Raised when authentication credentials are invalid or expired (401 Unauthorized)."""
    pass


class AuthorizationError(AppBuilderApiError):
    """Raised when the user does not have permission for the requested action (403 Forbidden)."""
    pass


class NotFoundError(AppBuilderApiError):
    """Raised when the requested resource is not found (404 Not Found)."""
    pass


class ValidationError(AppBuilderApiError):
    """Raised when the payload fails schema or business rule validation (422 Unprocessable Entity)."""
    pass


class ServerInternalError(AppBuilderApiError):
    """Raised when the server encounters an internal error (500/502/503/504)."""
    pass


class CompositionError(AppBuilderApiError):
    """Raised when AI blueprint composition or dependency resolution fails."""
    pass
