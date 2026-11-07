"""
Structured JSON Logging & Observability
Follows Loft Backend Engineering System Vol II
"""
from __future__ import annotations
import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any


class JSONFormatter(logging.Formatter):
    """Formats log records into JSON according to Loft Observability standards."""

    def format(self, record: logging.LogRecord) -> str:
        log_data: dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "service": "app-builder-engine",
            "logger": record.name,
            "message": record.getMessage(),
        }

        # Extra metadata if provided
        if hasattr(record, "request_id"):
            log_data["request_id"] = record.request_id
        if hasattr(record, "extra_data") and isinstance(record.extra_data, dict):
            log_data.update(record.extra_data)

        if record.exc_info:
            log_data["exception"] = self.formatException(record.exc_info)

        return json.dumps(log_data)


def setup_logging(level: str = "INFO") -> logging.Logger:
    """Configures structured logging for the application and returns logger."""
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(level.upper())
    return logging.getLogger("app-builder-engine")
