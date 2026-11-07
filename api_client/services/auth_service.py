"""
IAM & Authentication Service Client.
"""
from __future__ import annotations
from typing import Any, Dict, Optional
from api_client.http_client import HttpClient
from api_client.models import LoginRequest, LoginResponse, UserResponse


class AuthService:
    """Handles authentication, tokens, and current user profile."""

    def __init__(self, http: HttpClient) -> None:
        self.http = http

    def login(self, username_or_email: str, password: str) -> LoginResponse:
        """Authenticate user and store access token."""
        payload = {
            "username_or_email": username_or_email,
            "password": password,
        }
        res = self.http.post("iam/auth/login", json_data=payload)
        login_resp = LoginResponse.from_dict(res)
        # Update client auth token automatically
        self.http.config.auth_token = login_resp.access_token
        if login_resp.user.get("email"):
            self.http.config.actor_email = login_resp.user["email"]
        if login_resp.user.get("role"):
            self.http.config.actor_role = login_resp.user["role"]
        return login_resp

    def refresh_token(self, refresh_token: str) -> LoginResponse:
        """Refresh JWT session token."""
        res = self.http.post("iam/auth/refresh", json_data={"refresh_token": refresh_token})
        login_resp = LoginResponse.from_dict(res)
        self.http.config.auth_token = login_resp.access_token
        return login_resp

    def logout(self) -> Dict[str, str]:
        """Invalidate session and clear token."""
        res = self.http.post("iam/auth/logout")
        self.http.config.auth_token = None
        return res or {"message": "Logged out successfully"}

    def get_me(self) -> UserResponse:
        """Retrieve current authenticated user profile."""
        res = self.http.get("iam/auth/me")
        return UserResponse.from_dict(res)
