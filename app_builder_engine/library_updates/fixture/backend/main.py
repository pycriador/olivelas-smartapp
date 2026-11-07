"""
Library Updates Guinea-Pig Backend.

Not a real service — this module exists only so `test_candidate()` can run a
genuine import-check against the platform's backend dependency ecosystem
union after a candidate version is applied to requirements.txt and pip
installed into an isolated venv. If a candidate version breaks an import
(removed module, renamed symbol, incompatible transitive dependency), this
import blows up and the candidate test correctly reports failure.
"""
import fastapi
import uvicorn
import pydantic
import pydantic_settings
import sqlalchemy
import psycopg
import psycopg2
import pymysql
import alembic
import jwt  # pyjwt
import bcrypt
import argon2  # argon2-cffi
import cryptography
import multipart  # python-multipart
import dotenv  # python-dotenv
import httpx
import pytest
import pytest_asyncio

app = fastapi.FastAPI(title="Library Updates Fixture Backend")


@app.get("/health")
def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8999)
