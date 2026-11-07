"""
Robust HTTP Client Transport for App Builder Engine API.
Uses Python standard library (urllib) for zero external dependencies,
with transparent JSON encoding/decoding, retries, and Olivelas envelope unwrapping.
"""
from __future__ import annotations
import json
import logging
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Dict, List, Optional, Union

from api_client.config import ApiClientConfig
from api_client.exceptions import (
    AppBuilderApiError,
    ApiConnectionError,
    AuthenticationError,
    AuthorizationError,
    NotFoundError,
    ValidationError,
    ServerInternalError,
)

logger = logging.getLogger("AppBuilderClient.HTTP")


class HttpClient:
    """HTTP Client Transport Layer."""

    def __init__(self, config: ApiClientConfig) -> None:
        self.config = config
        self._ssl_context = ssl.create_default_context()
        if not config.verify_ssl:
            self._ssl_context.check_hostname = False
            self._ssl_context.verify_mode = ssl.CERT_NONE

    def _build_headers(self, extra_headers: Optional[Dict[str, str]] = None) -> Dict[str, str]:
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": self.config.user_agent,
            "X-Actor-Email": self.config.actor_email,
            "X-Actor-Role": self.config.actor_role,
        }
        if self.config.auth_token:
            headers["Authorization"] = f"Bearer {self.config.auth_token}"
        if extra_headers:
            headers.update(extra_headers)
        return headers

    def _build_url(self, endpoint: str, query_params: Optional[Dict[str, Any]] = None, use_root: bool = False) -> str:
        """Constructs full absolute URL."""
        if endpoint.startswith("http://") or endpoint.startswith("https://"):
            base = endpoint
        elif use_root:
            base = f"{self.config.base_url.rstrip('/')}/{endpoint.lstrip('/')}"
        else:
            base = f"{self.config.api_base_url}/{endpoint.lstrip('/')}"

        if query_params:
            filtered_params = {k: v for k, v in query_params.items() if v is not None}
            if filtered_params:
                query_string = urllib.parse.urlencode(filtered_params, doseq=True)
                separator = "&" if "?" in base else "?"
                return f"{base}{separator}{query_string}"
        return base

    def request(
        self,
        method: str,
        endpoint: str,
        params: Optional[Dict[str, Any]] = None,
        json_data: Optional[Any] = None,
        headers: Optional[Dict[str, str]] = None,
        use_root: bool = False,
        unwrap_data: bool = True,
    ) -> Any:
        """
        Executes an HTTP request with retries and converts standard envelopes.
        """
        url = self._build_url(endpoint, params, use_root=use_root)
        req_headers = self._build_headers(headers)
        
        body_bytes: Optional[bytes] = None
        if json_data is not None:
            body_bytes = json.dumps(json_data).encode("utf-8")

        method_upper = method.upper()
        logger.debug(f"HTTP {method_upper} -> {url}")

        max_attempts = self.config.max_retries if method_upper in ("GET", "HEAD", "OPTIONS") else 1
        last_exception: Optional[Exception] = None

        for attempt in range(1, max_attempts + 1):
            try:
                req = urllib.request.Request(
                    url=url,
                    data=body_bytes,
                    headers=req_headers,
                    method=method_upper,
                )
                with urllib.request.urlopen(req, timeout=self.config.timeout_seconds, context=self._ssl_context) as response:
                    status_code = response.getcode()
                    resp_body = response.read().decode("utf-8")
                    
                    if status_code == 204 or not resp_body.strip():
                        return None
                    
                    try:
                        parsed_json = json.loads(resp_body)
                    except json.JSONDecodeError:
                        return resp_body

                    if unwrap_data and isinstance(parsed_json, dict) and "data" in parsed_json:
                        # Standard Olivelas ApiResponse / ApiListResponse wrapper
                        return parsed_json["data"]
                    return parsed_json

            except urllib.error.HTTPError as http_err:
                status_code = http_err.code
                error_body = http_err.read().decode("utf-8")
                parsed_error = {}
                try:
                    parsed_error = json.loads(error_body)
                except Exception:
                    parsed_error = {"detail": error_body}

                err_msg = (
                    parsed_error.get("detail")
                    or parsed_error.get("message")
                    or parsed_error.get("error")
                    or f"HTTP error {status_code}"
                )
                err_code = parsed_error.get("code")

                if status_code == 401:
                    raise AuthenticationError(
                        message=f"Falha de autenticação: {err_msg}",
                        status_code=status_code,
                        error_code=err_code,
                        details=parsed_error,
                        raw_response=error_body,
                    ) from http_err
                elif status_code == 403:
                    raise AuthorizationError(
                        message=f"Permissão negada (403): {err_msg}",
                        status_code=status_code,
                        error_code=err_code,
                        details=parsed_error,
                        raw_response=error_body,
                    ) from http_err
                elif status_code == 404:
                    raise NotFoundError(
                        message=f"Recurso não encontrado (404): {err_msg}",
                        status_code=status_code,
                        error_code=err_code,
                        details=parsed_error,
                        raw_response=error_body,
                    ) from http_err
                elif status_code == 422:
                    raise ValidationError(
                        message=f"Erro de validação (422): {err_msg}",
                        status_code=status_code,
                        error_code=err_code,
                        details=parsed_error,
                        raw_response=error_body,
                    ) from http_err
                elif status_code >= 500:
                    if attempt < max_attempts:
                        time.sleep(self.config.retry_backoff_factor * (2 ** (attempt - 1)))
                        continue
                    raise ServerInternalError(
                        message=f"Erro interno no servidor ({status_code}): {err_msg}",
                        status_code=status_code,
                        error_code=err_code,
                        details=parsed_error,
                        raw_response=error_body,
                    ) from http_err
                else:
                    raise AppBuilderApiError(
                        message=f"Erro de API ({status_code}): {err_msg}",
                        status_code=status_code,
                        error_code=err_code,
                        details=parsed_error,
                        raw_response=error_body,
                    ) from http_err

            except urllib.error.URLError as url_err:
                last_exception = url_err
                if attempt < max_attempts:
                    time.sleep(self.config.retry_backoff_factor * (2 ** (attempt - 1)))
                    continue
                raise ApiConnectionError(
                    message=f"Não foi possível conectar ao servidor App Builder Engine em {url}: {url_err.reason}",
                    details=str(url_err),
                ) from url_err
            except TimeoutError as to_err:
                last_exception = to_err
                if attempt < max_attempts:
                    time.sleep(self.config.retry_backoff_factor * (2 ** (attempt - 1)))
                    continue
                raise ApiConnectionError(
                    message=f"Timeout na conexão com o servidor App Builder Engine ({self.config.timeout_seconds}s)",
                    details=str(to_err),
                ) from to_err

        raise ApiConnectionError(
            message=f"Falha ao executar requisição HTTP após {max_attempts} tentativas",
            details=str(last_exception),
        )

    def get(self, endpoint: str, params: Optional[Dict[str, Any]] = None, use_root: bool = False, unwrap_data: bool = True) -> Any:
        return self.request("GET", endpoint, params=params, use_root=use_root, unwrap_data=unwrap_data)

    def post(self, endpoint: str, json_data: Optional[Any] = None, params: Optional[Dict[str, Any]] = None, use_root: bool = False, unwrap_data: bool = True) -> Any:
        return self.request("POST", endpoint, params=params, json_data=json_data, use_root=use_root, unwrap_data=unwrap_data)

    def put(self, endpoint: str, json_data: Optional[Any] = None, params: Optional[Dict[str, Any]] = None, use_root: bool = False, unwrap_data: bool = True) -> Any:
        return self.request("PUT", endpoint, params=params, json_data=json_data, use_root=use_root, unwrap_data=unwrap_data)

    def delete(self, endpoint: str, params: Optional[Dict[str, Any]] = None, use_root: bool = False, unwrap_data: bool = True) -> Any:
        return self.request("DELETE", endpoint, params=params, use_root=use_root, unwrap_data=unwrap_data)
