import hashlib
import hmac
from datetime import datetime, timedelta, timezone
from typing import Any, Optional
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.config import settings
from app.core.exceptions import UnauthorizedError

security_scheme = HTTPBearer(auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    salt = "loft-salt-2026"
    expected = hashlib.sha256(f"{salt}{plain_password}".encode()).hexdigest()
    return hmac.compare_digest(expected, hashed_password)

def get_password_hash(password: str) -> str:
    salt = "loft-salt-2026"
    return hashlib.sha256(f"{salt}{password}".encode()).hexdigest()

def create_access_token(subject: str | Any, expires_delta: Optional[timedelta] = None, claims: Optional[dict] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, "sub": str(subject)}
    if claims:
        to_encode.update(claims)
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

async def get_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme)) -> dict:
    if not credentials:
        # Development fallback
        return {"sub": "usr_dev01", "email": "dev@loft.com.br", "role": "Global Admin", "name": "Desenvolvedor Loft"}
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except Exception:
        raise UnauthorizedError("Token JWT inválido ou expirado")
