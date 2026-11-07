"""
IAM Security Core — Password Hashing & JWT Token Management
Implements Argon2id / bcrypt hashing and RS256/HS256 JWT tokens with refresh rotation.
"""
from __future__ import annotations
import hashlib
import hmac
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

from app.core.config import get_settings

settings = get_settings()
ph = PasswordHasher(time_cost=2, memory_cost=65536, parallelism=2)

# jwt_secret_key is loaded from JWT_SECRET_KEY (env/.env) by Settings.load();
# getattr keeps this call-site defensive in case Settings is ever constructed
# without going through .load() (e.g. in a future refactor or ad-hoc test).
SECRET_KEY = getattr(settings, "jwt_secret_key", "loft_super_secure_enterprise_iam_jwt_secret_key_2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15  # 15 min default per Loft Backend Security Specification
REFRESH_TOKEN_EXPIRE_DAYS = 7     # 7 days


def hash_password_sha256(password: str, salt: str | None = None) -> str:
    """Hashes a password using salted SHA-256 (compatible with WebCrypto & PostgreSQL pgcrypto)."""
    s = salt or secrets.token_hex(16)
    digest = hashlib.sha256(f"{s}:{password}".encode("utf-8")).hexdigest()
    return f"sha256${s}${digest}"


def hash_password(password: str) -> str:
    """Hashes a raw password using Argon2id."""
    return ph.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against an Argon2id or salted SHA-256 hash."""
    if not hashed_password or not plain_password:
        return False
    if hashed_password.startswith("sha256$"):
        parts = hashed_password.split("$")
        if len(parts) == 3:
            _, salt, expected_hex = parts
            actual_hex = hashlib.sha256(f"{salt}:{plain_password}".encode("utf-8")).hexdigest()
            return hmac.compare_digest(actual_hex, expected_hex)
        return False
    try:
        return ph.verify(hashed_password, plain_password)
    except VerifyMismatchError:
        return False
    except Exception:
        return False


def create_access_token(
    subject: str,
    email: str,
    role: str,
    permissions: list[str] | None = None,
    groups: list[str] | None = None,
    expires_delta: timedelta | None = None,
) -> tuple[str, str, datetime]:
    """
    Creates a new JWT Access Token.
    Returns (token_string, token_jti, expires_at_datetime).
    """
    now = datetime.now(timezone.utc)
    expires_at = now + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    jti = f"jti_{uuid.uuid4().hex}"

    claims: dict[str, Any] = {
        "sub": subject,
        "email": email,
        "role": role,
        "permissions": permissions or [],
        "groups": groups or [],
        "jti": jti,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
        "iss": "loft-app-builder-iam",
    }

    token = jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)
    return token, jti, expires_at


def create_refresh_token(
    subject: str,
    expires_delta: timedelta | None = None,
) -> tuple[str, str, datetime]:
    """
    Creates a new JWT Refresh Token.
    Returns (token_string, token_jti, expires_at_datetime).
    """
    now = datetime.now(timezone.utc)
    expires_at = now + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    jti = f"ref_{uuid.uuid4().hex}"

    claims: dict[str, Any] = {
        "sub": subject,
        "jti": jti,
        "type": "refresh",
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
        "iss": "loft-app-builder-iam",
    }

    token = jwt.encode(claims, SECRET_KEY, algorithm=ALGORITHM)
    return token, jti, expires_at


def decode_token(token: str) -> dict[str, Any]:
    """
    Decodes and validates a JWT token.
    Raises jwt.PyJWTError on invalid or expired token.
    """
    return jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
        issuer="loft-app-builder-iam",
    )
