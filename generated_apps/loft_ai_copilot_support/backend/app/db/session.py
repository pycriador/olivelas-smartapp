from typing import List, Dict, Any
from datetime import datetime, timezone

class InMemoryDatabase:
    """Stateless In-Memory Store for Landing Page / Presentation Mode (Zero SQL Database)."""
    def __init__(self):
        self.proposals = [
            {
                "id": "prop_loft_01",
                "title": "Apresentação Olivelas Soluções Imobiliárias",
                "client_name": "Mariana Santos",
                "client_email": "mariana.santos@exemplo.com",
                "client_document": "234.567.890-12",
                "amount": 4200.0,
                "status": "Approved",
                "category": "Fiança Aluguel",
                "risk_score": 820,
                "notes": "Score excelente, documentação validada com sucesso.",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            },
            {
                "id": "prop_loft_02",
                "title": "Demonstração Corporativa Pinheiros",
                "client_name": "Roberto Almeida",
                "client_email": "roberto.almeida@empresa.com",
                "client_document": "12.345.678/0001-90",
                "amount": 7800.0,
                "status": "Pending",
                "category": "Garantia Empresarial",
                "risk_score": 710,
                "notes": "Aguardando envio do contrato social atualizado.",
                "created_at": datetime.now(timezone.utc),
                "updated_at": datetime.now(timezone.utc),
            }
        ]
        self.audit_events = []

db_store = InMemoryDatabase()

def get_db():
    yield db_store
