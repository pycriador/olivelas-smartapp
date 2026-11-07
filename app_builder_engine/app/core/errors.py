"""
Application Errors and Exception Hierarchy
Follows Loft Backend Engineering System Vol II & API Specification Vol IV
"""
from __future__ import annotations
from typing import Any
from fastapi import Request, status
from fastapi.responses import JSONResponse


class ApplicationError(Exception):
    """Base application exception for all domain and service errors."""

    def __init__(
        self,
        message: str,
        code: str = "INTERNAL_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: dict[str, Any] | None = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details or {}


class NotFoundError(ApplicationError):
    def __init__(self, message: str, code: str = "RESOURCE_NOT_FOUND", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code=code, status_code=status.HTTP_404_NOT_FOUND, details=details)


class ValidationError(ApplicationError):
    def __init__(self, message: str, code: str = "VALIDATION_FAILED", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code=code, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, details=details)


class BadRequestError(ApplicationError):
    def __init__(self, message: str, code: str = "BAD_REQUEST", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code=code, status_code=status.HTTP_400_BAD_REQUEST, details=details)


class ConflictError(ApplicationError):
    def __init__(self, message: str, code: str = "CONFLICT", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code=code, status_code=status.HTTP_409_CONFLICT, details=details)


class AuthorizationError(ApplicationError):
    def __init__(self, message: str, code: str = "PERMISSION_DENIED", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code=code, status_code=status.HTTP_403_FORBIDDEN, details=details)


class AuthenticationError(ApplicationError):
    def __init__(self, message: str = "Autenticação obrigatória. Token ausente, inválido ou expirado.", code: str = "AUTHENTICATION_FAILED", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code=code, status_code=status.HTTP_401_UNAUTHORIZED, details=details)


class AccountLockedError(ApplicationError):
    def __init__(self, message: str, code: str = "ACCOUNT_LOCKED", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code=code, status_code=423, details=details)


class RateLimitError(ApplicationError):
    def __init__(self, message: str, code: str = "RATE_LIMITED", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code=code, status_code=status.HTTP_429_TOO_MANY_REQUESTS, details=details)


class AIServiceError(ApplicationError):
    def __init__(self, message: str, code: str = "AI_SERVICE_ERROR", details: dict[str, Any] | None = None) -> None:
        super().__init__(message, code=code, status_code=status.HTTP_502_BAD_GATEWAY, details=details)


import logging
import traceback
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger("app.core.errors")

HTTP_STATUS_TO_CANONICAL_CODE: dict[int, str] = {
    400: "BAD_REQUEST",
    401: "AUTHENTICATION_FAILED",
    403: "PERMISSION_DENIED",
    404: "RESOURCE_NOT_FOUND",
    409: "CONFLICT",
    422: "VALIDATION_ERROR",
    423: "ACCOUNT_LOCKED",
    429: "RATE_LIMITED",
    500: "INTERNAL_SERVER_ERROR",
    502: "UPSTREAM_ERROR",
}


async def application_error_handler(request: Request, exc: ApplicationError) -> JSONResponse:
    """Standardized Olivelas error format (rul_loft_be_api_envelope & rul_loft_be_error_codes)."""
    request_id = getattr(request.state, "request_id", "req_unknown")
    logger.warning(f"[{request_id}] ApplicationError: {exc.code} - {exc.message} on {request.url.path}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "data": None,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "request_id": request_id,
            },
            "detail": exc.message,
            "meta": {"request_id": request_id},
        },
    )


async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
    """Standardize FastAPI/Starlette HTTPException into Olivelas canonical error envelope."""
    request_id = getattr(request.state, "request_id", "req_unknown")
    code = HTTP_STATUS_TO_CANONICAL_CODE.get(exc.status_code, "APPLICATION_ERROR")
    message = exc.detail if isinstance(exc.detail, str) else str(exc.detail)
    details: dict[str, Any] = exc.detail if isinstance(exc.detail, dict) else {}
    return JSONResponse(
        status_code=exc.status_code,
        headers=getattr(exc, "headers", None),
        content={
            "data": None,
            "error": {
                "code": code,
                "message": message,
                "details": details,
                "request_id": request_id,
            },
            "detail": message,
            "meta": {"request_id": request_id},
        },
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all for unhandled exceptions (never expose stack traces)."""
    request_id = getattr(request.state, "request_id", "req_unknown")
    logger.error(f"[{request_id}] Unhandled Exception on {request.method} {request.url.path}: {exc}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "data": None,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": f"Erro interno no servidor: {str(exc)}",
                "details": {"exception": type(exc).__name__},
                "request_id": request_id,
            },
            "detail": f"Erro interno no servidor: {str(exc)}",
            "meta": {"request_id": request_id},
        },
    )

