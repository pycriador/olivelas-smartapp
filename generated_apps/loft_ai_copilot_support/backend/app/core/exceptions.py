from fastapi import Request, status
from fastapi.responses import JSONResponse
from typing import Any, Optional

class ApplicationError(Exception):
    """Base exception for application business errors."""
    def __init__(self, message: str, code: str = "APPLICATION_ERROR", status_code: int = 400, details: Any = None):
        super().__init__(message)
        self.message = message
        self.code = code
        self.status_code = status_code
        self.details = details

class NotFoundError(ApplicationError):
    def __init__(self, message: str = "Recurso não encontrado", code: str = "RESOURCE_NOT_FOUND", details: Any = None):
        super().__init__(message, code=code, status_code=status.HTTP_404_NOT_FOUND, details=details)

class ValidationError(ApplicationError):
    def __init__(self, message: str = "Erro de validação dos dados", code: str = "VALIDATION_ERROR", details: Any = None):
        super().__init__(message, code=code, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, details=details)

class UnauthorizedError(ApplicationError):
    def __init__(self, message: str = "Credenciais inválidas ou token expirado", code: str = "UNAUTHORIZED", details: Any = None):
        super().__init__(message, code=code, status_code=status.HTTP_401_UNAUTHORIZED, details=details)

class ForbiddenError(ApplicationError):
    def __init__(self, message: str = "Acesso negado", code: str = "FORBIDDEN", details: Any = None):
        super().__init__(message, code=code, status_code=status.HTTP_403_FORBIDDEN, details=details)

async def application_error_handler(request: Request, exc: ApplicationError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "data": None,
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
            },
            "meta": {"path": request.url.path, "status": exc.status_code}
        }
    )
