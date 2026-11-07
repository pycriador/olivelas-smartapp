import uuid
from typing import List, Optional
from datetime import datetime, timezone
from app.db.session import db_store, InMemoryDatabase
from app.models.domain_models import ProposalModel, AuditEventModel
from app.schemas.domain_schemas import ProposalCreate, ProposalUpdate
from app.core.exceptions import NotFoundError

class ProposalService:
    """Stateless / In-Memory Proposal and Presentation Service (Zero SQL Database)."""

    def __init__(self, db: InMemoryDatabase = db_store) -> None:
        self.db = db

    def list_proposals(self, status: Optional[str] = None, search: Optional[str] = None) -> List[ProposalModel]:
        items = [ProposalModel(**p) for p in self.db.proposals]
        if status and status != "All":
            items = [p for p in items if p.status == status]
        if search:
            q = search.lower()
            items = [p for p in items if q in p.title.lower() or q in p.client_name.lower()]
        return items

    def get_proposal(self, proposal_id: str) -> ProposalModel:
        for p in self.db.proposals:
            if p["id"] == proposal_id:
                return ProposalModel(**p)
        raise NotFoundError(f"Proposta {proposal_id} não encontrada")

    def create_proposal(self, data: ProposalCreate, actor: str = "system") -> ProposalModel:
        now = datetime.now(timezone.utc)
        proposal_id = f"prop_{uuid.uuid4().hex[:8]}"
        p_dict = {
            "id": proposal_id,
            "title": data.title,
            "client_name": data.client_name,
            "client_email": data.client_email,
            "client_document": data.client_document,
            "amount": data.amount,
            "category": data.category,
            "notes": data.notes,
            "status": data.status or "Pending",
            "risk_score": 780 if data.amount < 5000 else 690,
            "metadata_json": {},
            "created_at": now,
            "updated_at": now,
        }
        self.db.proposals.insert(0, p_dict)
        self.db.audit_events.append({
            "id": f"aud_{uuid.uuid4().hex[:8]}",
            "actor": actor,
            "action": "PROPOSAL_CREATED",
            "resource": "Proposal",
            "resource_id": proposal_id,
            "timestamp": now,
            "metadata_json": {"title": data.title, "amount": data.amount}
        })
        return ProposalModel(**p_dict)

    def update_proposal(self, proposal_id: str, updates: ProposalUpdate, actor: str = "system") -> ProposalModel:
        for p in self.db.proposals:
            if p["id"] == proposal_id:
                update_data = updates.model_dump(exclude_unset=True)
                p.update(update_data)
                p["updated_at"] = datetime.now(timezone.utc)
                return ProposalModel(**p)
        raise NotFoundError(f"Proposta {proposal_id} não encontrada")
