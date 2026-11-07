import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_list_proposals():
    response = client.get("/api/v1/proposals")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert isinstance(data["data"], list)

def test_create_proposal():
    payload = {
        "title": "Proposta Teste Pytest",
        "client_name": "Ana Paula",
        "client_email": "ana.paula@loft.com.br",
        "client_document": "345.678.901-23",
        "amount": 2900.0,
        "category": "Garantia Locatícia",
        "status": "Pending"
    }
    response = client.post("/api/v1/proposals", json=payload)
    assert response.status_code == 201
    assert response.json()["data"]["title"] == "Proposta Teste Pytest"

def test_chat_message():
    response = client.post("/api/v1/chat/message", json={"message": "Como funciona a fiança de aluguel?"})
    assert response.status_code == 200
    assert "data" in response.json()
    assert "reply" in response.json()["data"]
