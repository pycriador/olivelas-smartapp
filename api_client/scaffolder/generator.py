"""
Canonical Fullstack Application Scaffolder.
Consumes Blueprint & Plan from App Builder Engine API and deterministically creates
all project folders, backend files, frontend components, configurations, and test suites.
"""
from __future__ import annotations
import functools
import json
import logging
import os
import re
import unicodedata
from pathlib import Path
from typing import Any, Dict, List, Optional

from api_client.models import ProjectBlueprintResponse, AICompositionResponse

logger = logging.getLogger("AppBuilderClient.Scaffolder")

# Single source of truth for the pinned frontend/backend library versions
# this scaffolder emits. Lives in the App Builder Engine's "Library Updates
# Central" module so a manual admin-triggered scan/apply (see
# app_builder_engine/app/services/library_updates_service.py) can keep these
# pins current without anyone having to hunt for hardcoded version strings
# scattered across this generator.
_STACK_VERSIONS_PATH = (
    Path(__file__).resolve().parents[2]
    / "app_builder_engine"
    / "library_updates"
    / "stack_versions.json"
)


@functools.lru_cache(maxsize=1)
def _load_stack_versions() -> Dict[str, Dict[str, Dict[str, str]]]:
    """Loads stack_versions.json once per process and caches the result.

    Returns a dict shaped like:
        {"frontend": {"react": {"ecosystem": "npm", "current": "^19.0.0"}, ...},
         "backend": {"fastapi": {"ecosystem": "pip", "current": ">=0.115.0"}, ...}}
    """
    try:
        with open(_STACK_VERSIONS_PATH, "r", encoding="utf-8") as fh:
            return json.load(fh)
    except Exception as exc:  # pragma: no cover - defensive fallback
        logger.warning(
            f"Could not load stack_versions.json at {_STACK_VERSIONS_PATH}: {exc}. "
            "Falling back to empty version map; scaffolded apps may miss pinned versions."
        )
        return {"frontend": {}, "backend": {}}


class ApplicationScaffolder:
    """Generates complete, production-grade applications from App Builder API blueprints."""

    def __init__(self, target_dir: str | Path) -> None:
        self.target_dir = Path(target_dir).resolve()
        stack_versions = _load_stack_versions()
        self._fe_versions: Dict[str, str] = {
            pkg: info.get("current", "") for pkg, info in stack_versions.get("frontend", {}).items()
        }

    def _fe_version(self, package: str, fallback: str) -> str:
        """Returns the pinned version for a frontend package from stack_versions.json,
        falling back to a hardcoded default only if the catalog entry is missing."""
        return self._fe_versions.get(package) or fallback

    def _ensure_dir(self, rel_path: str) -> Path:
        p = self.target_dir / rel_path
        p.mkdir(parents=True, exist_ok=True)
        return p

    def _write_file(self, rel_path: str, content: str) -> Path:
        file_path = self.target_dir / rel_path
        file_path.parent.mkdir(parents=True, exist_ok=True)
        file_path.write_text(content.strip() + "\n", encoding="utf-8")
        logger.info(f"Created file: {rel_path}")
        return file_path

    def scaffold(
        self,
        blueprint: ProjectBlueprintResponse | AICompositionResponse | Dict[str, Any],
        app_name: Optional[str] = None,
        description: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Executes 100% automated fullstack project creation on disk.
        """
        if isinstance(blueprint, ProjectBlueprintResponse):
            bp_dict = blueprint.data or {}
            name = app_name or blueprint.project_name
            desc = description or bp_dict.get("description", "Aplicações corporativas Loft")
            api_contracts = blueprint.api_contracts
            frontend_components = blueprint.frontend_components
            backend_components = blueprint.backend_components
            rules = blueprint.rules
            folder_structure = blueprint.folder_structure
        elif isinstance(blueprint, AICompositionResponse):
            bp_dict = blueprint.data or {}
            name = app_name or blueprint.name
            desc = description or blueprint.description
            api_contracts = blueprint.api_contracts
            frontend_components = [
                c for c in blueprint.resolved_components
                if (isinstance(c, dict) and c.get("type") != "backend") or (isinstance(c, str) and "be" not in c)
            ]
            backend_components = [
                c for c in blueprint.resolved_components
                if (isinstance(c, dict) and c.get("type") == "backend") or (isinstance(c, str) and ("be" in c or "audit" in c))
            ]
            rules = blueprint.resolved_rules
            folder_structure = []

        else:
            bp_dict = blueprint
            name = app_name or bp_dict.get("name") or bp_dict.get("project_name") or "LoftApp"
            desc = description or bp_dict.get("description", "Aplicações corporativas Loft")
            api_contracts = bp_dict.get("api_contracts", [])
            frontend_components = bp_dict.get("frontend_components", [])
            backend_components = bp_dict.get("backend_components", [])
            rules = bp_dict.get("rules", [])
            folder_structure = bp_dict.get("folder_structure", [])

        clean_name = unicodedata.normalize('NFKD', name).encode('ascii', 'ignore').decode('utf-8')
        slug = re.sub(r'[^a-zA-Z0-9]+', '-', clean_name).lower().strip('-')
        logger.info(f"Scaffolding application '{name}' at {self.target_dir}")

        is_static = (
            bp_dict.get("is_static", False) or
            bp_dict.get("raw_blueprint_json", {}).get("is_static", False) or
            "arch_static_landing_page" in str(bp_dict) or
            "sem banco de dados" in str(desc).lower() or
            "sem banco de dados" in str(bp_dict).lower()
        )

        created_files: List[str] = []

        # 1. Blueprint Metadata Document
        created_files.append(str(self._write_file("BLUEPRINT.json", json.dumps(bp_dict, indent=2))))

        # 2. Root Files & Orchestration
        created_files.append(str(self._generate_readme(name, desc, slug)))
        created_files.append(str(self._generate_docker_compose(slug)))
        created_files.append(str(self._generate_start_script()))
        created_files.append(str(self._generate_gitignore()))
        created_files.append(str(self._generate_dependabot()))

        # 3. Backend Generation
        created_files.extend(self._generate_backend(name, slug, api_contracts, backend_components, is_static=is_static))

        # 4. Frontend Generation (React 19 + TypeScript + Vite + Ant Design + FSD)
        created_files.extend(self._generate_frontend(name, slug, api_contracts, frontend_components))

        summary = {
            "application_name": name,
            "slug": slug,
            "target_directory": str(self.target_dir),
            "files_created_count": len(created_files),
            "created_files": [os.path.relpath(f, self.target_dir) for f in created_files],
            "status": "success",
        }
        return summary

    # --------------------------------------------------------------------------
    # Root Configurations
    # --------------------------------------------------------------------------
    def _generate_readme(self, name: str, desc: str, slug: str) -> Path:
        content = f"""# 🏢 {name}

> {desc}  
> Desenvolvido e governado através do **Loft App Builder Engine** e **Copan Design System**.

---

## 🛠️ Stack Tecnológica & Arquitetura
- **Design System:** Copan Design System (Ant Design v5 + Loft Brand Tokens `#F56738`)
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query
- **Backend:** FastAPI (Python 3.11+) + Pydantic v2 + SQLite / SQLAlchemy 2.x
- **Governança:** Zero Trust, RBAC, Rate Limiting, Audit Trail e Contratos OpenAPI

---

## 🚀 Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+

### Execução Simplificada
```bash
./start_dev.sh
```

### Execução Manual
```bash
# Backend (Porta 8001)
cd backend
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload

# Frontend (Porta 5173)
cd frontend
npm install
npm run dev
```
Acesse a aplicação em: [http://localhost:5173](http://localhost:5173)

---

## 🧪 Testes Automatizados
```bash
# Testes de Backend
cd backend && pytest tests/ -v

# Testes de Frontend
cd frontend && npm run test
```
"""
        return self._write_file("README.md", content)

    def _generate_docker_compose(self, slug: str) -> Path:
        content = f"""version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: {slug}-backend
    ports:
      - "8001:8000"
    environment:
      - APP_ENV=production
      - DATABASE_URL=sqlite:///./app_data.db
      - SECRET_KEY=loft-production-secret-key-2026
    volumes:
      - ./backend/data:/app/data

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: {slug}-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
"""
        return self._write_file("docker-compose.yml", content)

    def _generate_start_script(self) -> Path:
        content = """#!/usr/bin/env bash
set -e

echo "🚀 Iniciando ambiente de desenvolvimento Loft..."

# 1. Setup Backend
if [ -d "backend" ]; then
    echo "📦 Preparando Backend FastAPI na porta 8001..."
    cd backend
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    source venv/bin/activate
    pip install -q -r requirements.txt
    python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload &
    BACKEND_PID=$!
    cd ..
fi

# 2. Setup Frontend
if [ -d "frontend" ]; then
    echo "⚛️ Preparando Frontend React 19 na porta 5173..."
    cd frontend
    if [ ! -d "node_modules" ]; then
        npm install --silent
    fi
    npm run dev &
    FRONTEND_PID=$!
    cd ..
fi

echo "✅ Aplicação iniciada com sucesso!"
echo "👉 Backend API Docs: http://127.0.0.1:8001/docs"
echo "👉 Frontend App: http://127.0.0.1:5173"

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
"""
        p = self._write_file("start_dev.sh", content)
        try:
            os.chmod(p, 0o755)
        except Exception:
            pass
        return p


    def _generate_gitignore(self) -> Path:
        content = """# Python
__pycache__/
*.py[cod]
*$py.class
venv/
.env
*.db
*.sqlite3

# Node / Frontend
node_modules/
dist/
.DS_Store
*.log
.coverage
"""
        return self._write_file(".gitignore", content)

    def _generate_dependabot(self) -> Path:
        """
        Generates .github/dependabot.yml so every scaffolded app starts
        auto-updating its own dependencies (npm frontend + pip backend) from
        its first commit, independent of when this generator's own pinned
        versions are next refreshed.
        """
        content = """version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
  - package-ecosystem: "pip"
    directory: "/backend"
    schedule:
      interval: "weekly"
"""
        return self._write_file(".github/dependabot.yml", content)

    # --------------------------------------------------------------------------
    # Backend Generation
    # --------------------------------------------------------------------------
    def _generate_backend(
        self,
        name: str,
        slug: str,
        api_contracts: List[Dict[str, Any]],
        backend_components: List[Dict[str, Any]],
        is_static: bool = False,
    ) -> List[Path]:
        files: List[Path] = []

        # backend/requirements.txt
        if is_static:
            reqs = """fastapi>=0.115.0
uvicorn[standard]>=0.30.0
pydantic>=2.8.0
pydantic-settings>=2.4.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.9
pytest>=8.3.0
httpx>=0.27.0
"""
        else:
            reqs = """fastapi>=0.115.0
uvicorn[standard]>=0.30.0
pydantic>=2.8.0
pydantic-settings>=2.4.0
sqlalchemy>=2.0.30
aiosqlite>=0.20.0
python-jose[cryptography]>=3.3.0
passlib[bcrypt]>=1.7.4
python-multipart>=0.0.9
pytest>=8.3.0
httpx>=0.27.0
"""
        files.append(self._write_file("backend/requirements.txt", reqs))

        # backend/Dockerfile
        dockerfile = """FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
"""
        files.append(self._write_file("backend/Dockerfile", dockerfile))

        # backend/app/core/config.py
        config_py = f"""from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "{name}"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "loft-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    DATABASE_URL: str = "sqlite:///./app_data.db"
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
"""
        files.append(self._write_file("backend/app/core/config.py", config_py))

        # backend/app/core/exceptions.py (rul_loft_be_error_codes & rul_loft_be_api_envelope)
        exceptions_py = """from fastapi import Request, status
from fastapi.responses import JSONResponse
from typing import Any, Optional

class ApplicationError(Exception):
    \"\"\"Base exception for application business errors.\"\"\"
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
"""
        files.append(self._write_file("backend/app/core/exceptions.py", exceptions_py))

        # backend/app/core/security.py (rul_sec_02_jwt_auth_bearer)
        security_py = """import hashlib
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
"""
        files.append(self._write_file("backend/app/core/security.py", security_py))


        if is_static:
            # In-Memory Database Session (Stateless / Zero SQL Database)
            session_py = """from typing import List, Dict, Any
from datetime import datetime, timezone

class InMemoryDatabase:
    \"\"\"Stateless In-Memory Store for Landing Page / Presentation Mode (Zero SQL Database).\"\"\"
    def __init__(self):
        self.proposals = [
            {
                "id": "prop_loft_01",
                "title": "Apresentação Loft Soluções Imobiliárias",
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
"""
            files.append(self._write_file("backend/app/db/session.py", session_py))

            # Domain Models (Pydantic In-Memory)
            models_py = """from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime, timezone

class ProposalModel(BaseModel):
    id: str
    title: str
    client_name: str
    client_email: str
    client_document: str
    amount: float = 0.0
    status: str = "Pending"
    category: str = "Garantia Locatícia"
    risk_score: int = 750
    notes: Optional[str] = None
    metadata_json: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AuditEventModel(BaseModel):
    id: str
    actor: str
    action: str
    resource: str
    resource_id: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    metadata_json: Dict[str, Any] = Field(default_factory=dict)
"""
            files.append(self._write_file("backend/app/models/domain_models.py", models_py))

        else:
            # backend/app/db/session.py
            session_py = """from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
"""
            files.append(self._write_file("backend/app/db/session.py", session_py))

            # backend/app/models/domain_models.py
            models_py = """from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON
from datetime import datetime, timezone
from app.db.session import Base

class ProposalModel(Base):
    __tablename__ = "proposals"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    client_name = Column(String(255), nullable=False)
    client_email = Column(String(255), nullable=False)
    client_document = Column(String(32), nullable=False)
    amount = Column(Float, nullable=False, default=0.0)
    status = Column(String(32), default="Pending", index=True)
    category = Column(String(64), default="Garantia Locatícia")
    risk_score = Column(Integer, default=750)
    notes = Column(Text, nullable=True)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

class AuditEventModel(Base):
    __tablename__ = "audit_events"

    id = Column(String(64), primary_key=True, index=True)
    actor = Column(String(255), nullable=False)
    action = Column(String(64), nullable=False)
    resource = Column(String(64), nullable=False)
    resource_id = Column(String(64), nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    metadata_json = Column(JSON, default=dict)
"""
            files.append(self._write_file("backend/app/models/domain_models.py", models_py))

        # backend/app/schemas/domain_schemas.py (rul_arch_03_contract_first_pydantic & rul_loft_be_api_envelope)
        schemas_py = """from pydantic import BaseModel, Field, EmailStr
from typing import Generic, TypeVar, Optional, List, Any
from datetime import datetime

T = TypeVar("T")

class ApiMeta(BaseModel):
    page: int = 1
    page_size: int = 20
    total: int = 0
    total_pages: int = 1

class ApiResponse(BaseModel, Generic[T]):
    data: T
    meta: Optional[dict] = None
    error: Optional[dict] = None

class ApiListResponse(BaseModel, Generic[T]):
    data: List[T]
    meta: ApiMeta
    error: Optional[dict] = None

# Domain Schemas
class ProposalBase(BaseModel):
    title: str = Field(..., example="Locação Apto Copan 42B")
    client_name: str = Field(..., example="Willian Jesus")
    client_email: str = Field(..., example="willian.jesus@loft.com.br")
    client_document: str = Field(..., example="123.456.789-00")
    amount: float = Field(..., gt=0, example=3500.0)
    category: str = Field(default="Garantia Locatícia")
    notes: Optional[str] = None
    status: str = Field(default="Pending")

class ProposalCreate(ProposalBase):
    pass

class ProposalUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    status: Optional[str] = None
    notes: Optional[str] = None

class ProposalResponse(ProposalBase):
    id: str
    risk_score: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "Bearer"
    user: dict

class ChatMessageRequest(BaseModel):
    message: str = Field(..., example="Como funciona a garantia de fiança da Loft?")
    history: Optional[List[dict]] = Field(default_factory=list)

class ChatMessageResponse(BaseModel):
    reply: str
    sender: str = "assistant"
    intent: str = "general_support"
    confidence: float = 0.98
    suggested_actions: List[str] = Field(default_factory=list)
"""
        files.append(self._write_file("backend/app/schemas/domain_schemas.py", schemas_py))

        # backend/app/services/proposal_service.py (rul_arch_01_layered_separation)
        if is_static:
            service_py = """import uuid
from typing import List, Optional
from datetime import datetime, timezone
from app.db.session import db_store, InMemoryDatabase
from app.models.domain_models import ProposalModel, AuditEventModel
from app.schemas.domain_schemas import ProposalCreate, ProposalUpdate
from app.core.exceptions import NotFoundError

class ProposalService:
    \"\"\"Stateless / In-Memory Proposal and Presentation Service (Zero SQL Database).\"\"\"

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
"""
        else:
            service_py = """import uuid
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.domain_models import ProposalModel, AuditEventModel
from app.schemas.domain_schemas import ProposalCreate, ProposalUpdate
from app.core.exceptions import NotFoundError

class ProposalService:
    \"\"\"Handles business logic and persistence for Proposals and Credit Analysis.\"\"\"

    def __init__(self, db: Session) -> None:
        self.db = db

    def list_proposals(self, status: Optional[str] = None, search: Optional[str] = None) -> List[ProposalModel]:
        q = self.db.query(ProposalModel)
        if status:
            q = q.filter(ProposalModel.status == status)
        if search:
            q = q.filter(ProposalModel.title.ilike(f"%{search}%") | ProposalModel.client_name.ilike(f"%{search}%"))
        return q.order_by(ProposalModel.created_at.desc()).all()

    def get_proposal(self, proposal_id: str) -> ProposalModel:
        p = self.db.query(ProposalModel).filter(ProposalModel.id == proposal_id).first()
        if not p:
            raise NotFoundError(f"Proposta {proposal_id} não encontrada")
        return p

    def create_proposal(self, data: ProposalCreate, actor: str = "system") -> ProposalModel:
        proposal_id = f"prop_{uuid.uuid4().hex[:8]}"
        p = ProposalModel(
            id=proposal_id,
            title=data.title,
            client_name=data.client_name,
            client_email=data.client_email,
            client_document=data.client_document,
            amount=data.amount,
            category=data.category,
            notes=data.notes,
            status=data.status,
            risk_score=780 if data.amount < 5000 else 690,
        )
        self.db.add(p)
        
        # Record Audit Trail (rul_sec_04_audit_trail_logging)
        audit = AuditEventModel(
            id=f"aud_{uuid.uuid4().hex[:8]}",
            actor=actor,
            action="PROPOSAL_CREATED",
            resource="Proposal",
            resource_id=proposal_id,
            metadata_json={"title": data.title, "amount": data.amount}
        )
        self.db.add(audit)
        self.db.commit()
        self.db.refresh(p)
        return p

    def update_proposal(self, proposal_id: str, updates: ProposalUpdate, actor: str = "system") -> ProposalModel:
        p = self.get_proposal(proposal_id)
        update_data = updates.model_dump(exclude_unset=True)
        for k, v in update_data.items():
            setattr(p, k, v)
        self.db.commit()
        self.db.refresh(p)
        return p

    def delete_proposal(self, proposal_id: str, actor: str = "system") -> None:
        p = self.get_proposal(proposal_id)
        self.db.delete(p)
        self.db.commit()
"""
        files.append(self._write_file("backend/app/services/proposal_service.py", service_py))

        # backend/app/api/v1/proposals_router.py
        router_py = """from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from typing import Optional, List

from app.db.session import get_db
from app.schemas.domain_schemas import (
    ApiResponse,
    ApiListResponse,
    ApiMeta,
    ProposalResponse,
    ProposalCreate,
    ProposalUpdate,
)
from app.services.proposal_service import ProposalService
from app.core.security import get_current_user

router = APIRouter(prefix="/proposals", tags=["Propostas & Garantias"])

@router.get("", response_model=ApiListResponse[ProposalResponse])
def list_proposals(
    status: Optional[str] = None,
    search: Optional[str] = Query(None),
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    items = service.list_proposals(status=status, search=search)
    return ApiListResponse(
        data=items,
        meta=ApiMeta(page=1, page_size=len(items) or 20, total=len(items), total_pages=1),
    )

@router.get("/{proposal_id}", response_model=ApiResponse[ProposalResponse])
def get_proposal(
    proposal_id: str,
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    return ApiResponse(data=service.get_proposal(proposal_id))

@router.post("", response_model=ApiResponse[ProposalResponse], status_code=status.HTTP_201_CREATED)
def create_proposal(
    body: ProposalCreate,
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    p = service.create_proposal(body, actor=user.get("email", "system"))
    return ApiResponse(data=p)

@router.put("/{proposal_id}", response_model=ApiResponse[ProposalResponse])
def update_proposal(
    proposal_id: str,
    body: ProposalUpdate,
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    p = service.update_proposal(proposal_id, body, actor=user.get("email", "system"))
    return ApiResponse(data=p)

@router.delete("/{proposal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_proposal(
    proposal_id: str,
    db = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    service = ProposalService(db)
    service.delete_proposal(proposal_id, actor=user.get("email", "system"))
    return None
"""
        files.append(self._write_file("backend/app/api/v1/proposals_router.py", router_py))

        # backend/app/api/v1/chat_router.py
        chat_router_py = """from fastapi import APIRouter
from app.schemas.domain_schemas import ApiResponse, ChatMessageRequest, ChatMessageResponse

router = APIRouter(prefix="/chat", tags=["Chatbot & AI Copilot"])

KNOWLEDGE_BASE = [
    {
        "keywords": ["fiança", "fianca", "garantia", "aluguel", "locação", "locacao"],
        "reply": "A Fiança Aluguel Loft substitui fiador e caução com aprovação 100% digital em até 15 minutos. Cobre inadimplência de aluguel, condomínio, IPTU e danos ao imóvel com segurança jurídica integral.",
        "intent": "fianca_aluguel",
        "actions": ["Simular taxa de fiança", "Ver documentos necessários", "Falar com consultor"]
    },
    {
        "keywords": ["documento", "documentos", "comprovante", "requisito", "requisitos"],
        "reply": "Para análise de crédito instantânea, são necessários apenas: Documento oficial com foto (RG ou CNH), CPF, e Comprovante de Renda recente (Holerite, Extrato Bancário ou IRPF).",
        "intent": "documentacao_requisitos",
        "actions": ["Enviar documentos", "Consultar status de aprovação", "Dúvidas sobre renda conjunta"]
    },
    {
        "keywords": ["api", "integrar", "integracao", "integração", "desenvolvedor", "webhook", "endpoint"],
        "reply": "A Loft disponibiliza API REST e Webhooks para imobiliárias e parceiros emitirem garantias diretamente em seus CRMs ou ERPs com autenticação JWT e contratos OpenAPI 3.1.",
        "intent": "api_developer",
        "actions": ["Acessar Swagger API", "Gerar API Key", "Ver documentação técnica"]
    },
    {
        "keywords": ["prazo", "tempo", "demora", "taxa", "custo", "preco", "preço", "valor"],
        "reply": "Nossa taxa média varia de 8% a 10% do valor do aluguel anual, com parcelamento em até 12x no cartão de crédito ou boleto. A resposta de aprovação do crédito ocorre em média em menos de 15 minutos.",
        "intent": "taxas_e_prazos",
        "actions": ["Calcular orçamento", "Ver opções de pagamento", "Contratar online"]
    }
]

@router.post("/message", response_model=ApiResponse[ChatMessageResponse])
def send_chat_message(payload: ChatMessageRequest):
    msg_lower = payload.message.lower()
    matched = None
    for item in KNOWLEDGE_BASE:
        if any(kw in msg_lower for kw in item["keywords"]):
            matched = item
            break

    if matched:
        reply_text = matched["reply"]
        intent = matched["intent"]
        actions = matched["actions"]
    else:
        reply_text = f"Olá! Sou o Assistente Inteligente Loft Copan. Recebi sua mensagem: '{payload.message}'. Posso te ajudar com contratação de Fiança Aluguel, análise de crédito, envio de propostas ou integração com nossa API."
        intent = "general_support"
        actions = ["Como funciona a Fiança?", "Quais documentos preciso?", "Falar com suporte humano"]

    return ApiResponse(
        data=ChatMessageResponse(
            reply=reply_text,
            sender="assistant",
            intent=intent,
            confidence=0.98,
            suggested_actions=actions
        )
    )
"""
        files.append(self._write_file("backend/app/api/v1/chat_router.py", chat_router_py))

        # backend/app/main.py
        if is_static:
            main_py = f"""from contextlib import asynccontextmanager
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import ApplicationError, application_error_handler
from app.api.v1.proposals_router import router as proposals_router
from app.api.v1.chat_router import router as chat_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logging.info("Starting stateless chatbot and landing page backend service (Zero SQL Database).")
    yield

app = FastAPI(
    title="{name}",
    description="API stateless desenvolvida e orquestrada via Loft App Builder Engine.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(ApplicationError, application_error_handler)

# Routers
app.include_router(proposals_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
def health_check():
    return {{"status": "healthy", "service": "{name}", "version": "1.0.0", "mode": "stateless-landing-page"}}
"""
        else:
            main_py = f"""import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import ApplicationError, application_error_handler
from app.db.session import engine, Base, SessionLocal
from app.api.v1.proposals_router import router as proposals_router
from app.api.v1.chat_router import router as chat_router
from app.models.domain_models import ProposalModel, AuditEventModel

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables & seed initial proposal if empty
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if db.query(ProposalModel).count() == 0:
            p1 = ProposalModel(
                id="prop_loft_01",
                title="Locação Residencial Jardins - Loft Fiança",
                client_name="Mariana Santos",
                client_email="mariana.santos@exemplo.com",
                client_document="234.567.890-12",
                amount=4200.0,
                status="Approved",
                category="Fiança Aluguel",
                risk_score=820,
                notes="Score excelente, documentação validada com sucesso.",
            )
            p2 = ProposalModel(
                id="prop_loft_02",
                title="Locação Comercial Pinheiros",
                client_name="Roberto Almeida",
                client_email="roberto.almeida@empresa.com",
                client_document="12.345.678/0001-90",
                amount=7800.0,
                status="Pending",
                category="Garantia Empresarial",
                risk_score=710,
                notes="Aguardando envio do contrato social atualizado.",
            )
            db.add_all([p1, p2])
            db.commit()
    yield

app = FastAPI(
    title="{name}",
    description="API canônica desenvolvida e orquestrada via Loft App Builder Engine.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(ApplicationError, application_error_handler)

# Routers
app.include_router(proposals_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health"])
def health_check():
    return {{"status": "healthy", "service": "{name}", "version": "1.0.0"}}
"""
        files.append(self._write_file("backend/app/main.py", main_py))

        # backend/tests/test_api.py
        if is_static:
            test_py = """import pytest
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
"""
        else:
            test_py = """import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import Base, engine

# Ensure tables exist for test suite
Base.metadata.create_all(bind=engine)

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
"""
        files.append(self._write_file("backend/tests/test_api.py", test_py))

        return files

    # --------------------------------------------------------------------------
    # Frontend Generation
    # --------------------------------------------------------------------------
    def _generate_frontend(
        self,
        name: str,
        slug: str,
        api_contracts: List[Dict[str, Any]],
        frontend_components: List[Dict[str, Any]],
    ) -> List[Path]:
        files: List[Path] = []

        # frontend/package.json
        # Dependency versions are loaded from the Library Updates Central's
        # stack_versions.json (see self._fe_version / _load_stack_versions above)
        # instead of being hardcoded here, so a manual scan+apply through that
        # module is the single place these pins get refreshed.
        v = self._fe_version
        pkg_json = f"""{{
  "name": "{slug}-frontend",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {{
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }},
  "dependencies": {{
    "@ant-design/icons": "{v('@ant-design/icons', '^5.4.0')}",
    "@ant-design/v5-patch-for-react-19": "{v('@ant-design/v5-patch-for-react-19', '^1.0.3')}",
    "@tanstack/react-query": "{v('@tanstack/react-query', '^5.51.0')}",
    "antd": "{v('antd', '^5.24.0')}",
    "axios": "{v('axios', '^1.20.0')}",
    "lucide-react": "{v('lucide-react', '^0.428.0')}",
    "react": "{v('react', '^19.0.0')}",
    "react-dom": "{v('react-dom', '^19.0.0')}"
  }},
  "devDependencies": {{
    "@tailwindcss/postcss": "{v('@tailwindcss/postcss', '^4.3.3')}",
    "@types/node": "{v('@types/node', '^20.14.0')}",
    "@types/react": "{v('@types/react', '^19.0.0')}",
    "@types/react-dom": "{v('@types/react-dom', '^19.0.0')}",
    "@vitejs/plugin-react": "{v('@vitejs/plugin-react', '^4.3.4')}",
    "postcss": "{v('postcss', '^8.4.38')}",
    "tailwindcss": "{v('tailwindcss', '^4.3.3')}",
    "typescript": "{v('typescript', '^5.5.3')}",
    "vite": "{v('vite', '^6.4.4')}"
  }}
}}
"""
        files.append(self._write_file("frontend/package.json", pkg_json))

        # frontend/vite.config.ts
        vite_config = """import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: true,
      },
    },
  },
});
"""
        files.append(self._write_file("frontend/vite.config.ts", vite_config))

        # frontend/tsconfig.json
        tsconfig = """{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
"""
        files.append(self._write_file("frontend/tsconfig.json", tsconfig))

        # frontend/postcss.config.js
        # Tailwind v4: the PostCSS plugin moved to its own package and
        # autoprefixer is no longer needed (handled internally by Lightning CSS).
        postcss_config = """export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
"""
        files.append(self._write_file("frontend/postcss.config.js", postcss_config))

        # frontend/index.html
        index_html = f"""<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="https://assets.loft.com.br/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{name} — Loft Engineering</title>
  </head>
  <body class="bg-[#F2F4F8] text-[#121619] antialiased">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
"""
        files.append(self._write_file("frontend/index.html", index_html))

        # frontend/src/theme/colors.ts
        colors_ts = """export const colors = {
  primary: '#F56738', // Loft Brand Orange (Copan)
  primaryHover: '#D94616',
  primaryActive: '#B83207',
  primaryBg: '#FFF2EC',
  primaryBorder: '#FDC4B2',

  neutralDark: '#121619',
  neutralText: '#2D3748',
  neutralMuted: '#627D98',
  neutralBorder: '#E1E9EF',
  neutralSurface: '#FFFFFF',
  neutralBg: '#F2F4F8',

  success: '#20A483',
  successBg: '#E8F8F5',
  successBorder: '#8CE0CC',

  warning: '#E9A23B',
  warningBg: '#FEF8EE',
  warningBorder: '#F9D89C',

  error: '#CE4242',
  errorBg: '#FDF2F2',
  errorBorder: '#F8B4B4',

  info: '#2B6CB0',
  infoBg: '#EBF8FF',
  infoBorder: '#90CDF4',
  brandGreen: '#0B6B4F',
};
"""
        files.append(self._write_file("frontend/src/theme/colors.ts", colors_ts))

        # frontend/src/theme/antd-theme.ts
        antd_theme_ts = """import type { ThemeConfig } from 'antd';
import { colors } from './colors';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorPrimaryHover: colors.primaryHover,
    colorPrimaryActive: colors.primaryActive,
    colorPrimaryBg: colors.primaryBg,
    colorPrimaryBorder: colors.primaryBorder,

    colorText: colors.neutralDark,
    colorTextSecondary: colors.neutralMuted,
    colorBorder: colors.neutralBorder,
    colorBorderSecondary: '#EEF2F6',
    colorBgLayout: colors.neutralBg,
    colorBgContainer: colors.neutralSurface,

    colorSuccess: colors.success,
    colorSuccessBg: colors.successBg,
    colorSuccessBorder: colors.successBorder,

    colorWarning: colors.warning,
    colorWarningBg: colors.warningBg,
    colorWarningBorder: colors.warningBorder,

    colorError: colors.error,
    colorErrorBg: colors.errorBg,
    colorErrorBorder: colors.errorBorder,

    colorInfo: colors.info,
    colorInfoBg: colors.infoBg,
    colorInfoBorder: colors.infoBorder,

    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 4,

    controlHeight: 38,
    controlHeightLG: 44,
    controlHeightSM: 30,
  },
  components: {
    Button: {
      primaryColor: '#FFFFFF',
      fontWeight: 600,
      borderRadius: 8,
      controlHeight: 38,
      defaultBorderColor: colors.neutralBorder,
      defaultColor: colors.neutralDark,
      defaultGhostBorderColor: colors.neutralBorder,
    },
    Card: {
      borderRadiusLG: 12,
      colorBorderSecondary: colors.neutralBorder,
      boxShadowSecondary: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
      headerFontSize: 16,
    },
    Table: {
      headerBg: '#FAFBFD',
      headerColor: colors.neutralMuted,
      headerSplitColor: 'transparent',
      borderColor: colors.neutralBorder,
      rowHoverBg: '#FFF9F6',
      borderRadius: 12,
    },
    Modal: {
      borderRadiusLG: 12,
      headerBg: colors.neutralSurface,
      titleFontSize: 18,
    },
    Tag: {
      borderRadiusSM: 4,
      defaultBg: '#F0F4F8',
      defaultColor: '#334E68',
    },
    Tabs: {
      itemSelectedColor: colors.primary,
      itemHoverColor: colors.primaryHover,
      inkBarColor: colors.primary,
      titleFontSize: 14,
    },
    Input: {
      borderRadius: 8,
      activeBorderColor: colors.primary,
      hoverBorderColor: colors.primaryBorder,
    },
    Select: {
      borderRadius: 8,
    },
    Menu: {
      itemSelectedBg: colors.primaryBg,
      itemSelectedColor: colors.primary,
      itemHoverBg: '#F8FAFC',
      itemHoverColor: colors.neutralDark,
      itemBorderRadius: 6,
    },
  },
};
"""
        files.append(self._write_file("frontend/src/theme/antd-theme.ts", antd_theme_ts))

        # frontend/src/theme/tokens.ts
        theme_tokens = """import { antdTheme } from './antd-theme';
import { colors } from './colors';

export const loftTheme = antdTheme;
export { colors };
"""
        files.append(self._write_file("frontend/src/theme/tokens.ts", theme_tokens))

        # frontend/src/types/domain.types.ts
        domain_types = """export interface Proposal {
  id: string;
  title: string;
  client_name: string;
  client_email: string;
  client_document: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'In Review' | 'Rejected';
  category: string;
  risk_score: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: string;
  suggestedActions?: string[];
}

export interface ChatMessageResult {
  reply: string;
  sender: string;
  intent: string;
  confidence: number;
  suggested_actions: string[];
}

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ApiListResponse<T> {
  data: T[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}
"""
        files.append(self._write_file("frontend/src/types/domain.types.ts", domain_types))

        # frontend/src/services/api.ts
        api_service = """import axios from 'axios';
import { Proposal, ApiResponse, ApiListResponse, ChatMessageResult } from '../types/domain.types';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const proposalApi = {
  list: async (status?: string, search?: string): Promise<Proposal[]> => {
    const res = await apiClient.get<ApiListResponse<Proposal>>('/proposals', {
      params: { status, search },
    });
    return res.data.data;
  },

  getById: async (id: string): Promise<Proposal> => {
    const res = await apiClient.get<ApiResponse<Proposal>>(`/proposals/${id}`);
    return res.data.data;
  },

  create: async (payload: Partial<Proposal>): Promise<Proposal> => {
    const res = await apiClient.post<ApiResponse<Proposal>>('/proposals', payload);
    return res.data.data;
  },

  update: async (id: string, updates: Partial<Proposal>): Promise<Proposal> => {
    const res = await apiClient.put<ApiResponse<Proposal>>(`/proposals/${id}`, updates);
    return res.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/proposals/${id}`);
  },
};

export const chatApi = {
  sendMessage: async (message: string, history: any[] = []): Promise<ChatMessageResult> => {
    try {
      const res = await apiClient.post<ApiResponse<ChatMessageResult>>('/chat/message', {
        message,
        history,
      });
      return res.data.data;
    } catch (e) {
      return {
        reply: `Olá! Sou o Assistente Copilot Loft. Entendi sua mensagem sobre "${message}". No momento estou operando em modo mock autônomo. Posso te ajudar com Fiança Aluguel, documentação, ou suporte técnico!`,
        sender: 'assistant',
        intent: 'fallback_mock',
        confidence: 0.95,
        suggested_actions: ['Como funciona a Fiança?', 'Ver requisitos de crédito', 'Falar com especialista'],
      };
    }
  },
};
"""
        files.append(self._write_file("frontend/src/services/api.ts", api_service))

        # frontend/src/components/layout/AppSwitcher.tsx (Waffle 9-dots modal)
        app_switcher = """import React from 'react';
import { Modal, Tag } from 'antd';
import {
  SafetyCertificateOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  LineChartOutlined,
  AppstoreOutlined,
  BankOutlined,
} from '@ant-design/icons';

interface AppSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppSwitcher: React.FC<AppSwitcherProps> = ({ isOpen, onClose }) => {
  const apps = [
    {
      id: 'fianca',
      title: 'Fiança Aluguel',
      subtitle: 'Esteira de Locação & Garantias',
      icon: <SafetyCertificateOutlined className="text-xl text-[#0B6B4F]" />,
      bg: 'bg-[#EAF9EF] border-[#B7EB8F]',
      badge: 'Ativo',
    },
    {
      id: 'crm',
      title: 'CRM 360',
      subtitle: 'Gestão de Clientes & Vendas',
      icon: <UsergroupAddOutlined className="text-xl text-[#F56738]" />,
      bg: 'bg-[#FFF2EC] border-[#FDC4B2]',
    },
    {
      id: 'motor-risco',
      title: 'Motor de Risco',
      subtitle: 'Decisão de Crédito em < 60s',
      icon: <LineChartOutlined className="text-xl text-[#2B6CB0]" />,
      bg: 'bg-[#EBF8FF] border-[#90CDF4]',
    },
    {
      id: 'adm-imoveis',
      title: 'Adm de Imóveis',
      subtitle: 'Portal de Repasses & Contratos',
      icon: <HomeOutlined className="text-xl text-[#805AD5]" />,
      bg: 'bg-[#FAF5FF] border-[#D6BCFA]',
    },
    {
      id: 'financiamento',
      title: 'Financiamento Imobiliário',
      subtitle: 'Simulações & Análise Bancária',
      icon: <BankOutlined className="text-xl text-[#D69E2E]" />,
      bg: 'bg-[#FEFCBF] border-[#F6E05E]',
    },
    {
      id: 'engine',
      title: 'App Builder Engine',
      subtitle: 'Plataforma & Governança SDD',
      icon: <AppstoreOutlined className="text-xl text-[#121619]" />,
      bg: 'bg-[#F2F4F8] border-[#E1E9EF]',
    },
  ];

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={600}
      title={
        <div className="flex items-center gap-2 pb-2 border-b border-[#E1E9EF]">
          <AppstoreOutlined className="text-[#F56738] text-lg" />
          <span className="font-bold text-base text-[#121619]">Ecossistema de Aplicações Loft</span>
        </div>
      }
    >
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {apps.map((app) => (
          <div
            key={app.id}
            onClick={onClose}
            className={`p-3.5 rounded-xl border transition cursor-pointer hover:shadow-md flex items-start gap-3 ${app.bg}`}
          >
            <div className="p-2 bg-white rounded-lg shadow-sm">{app.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#121619]">{app.title}</span>
                {app.badge && <Tag color="success">{app.badge}</Tag>}
              </div>
              <p className="text-xs text-[#627D98] mt-0.5 truncate">{app.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};
"""
        files.append(self._write_file("frontend/src/components/layout/AppSwitcher.tsx", app_switcher))

        # frontend/src/components/layout/AppHeader.tsx
        app_header = """import React, { useState } from 'react';
import { Button, Avatar, Dropdown, MenuProps, Tooltip } from 'antd';
import {
  AppstoreOutlined,
  SearchOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  RobotOutlined,
  FundProjectionScreenOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { AppSwitcher } from './AppSwitcher';

interface AppHeaderProps {
  activeView: 'chat' | 'landing' | 'dashboard';
  onViewChange: (view: 'chat' | 'landing' | 'dashboard') => void;
  appName: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  activeView,
  onViewChange,
  appName,
}) => {
  const [switcherOpen, setSwitcherOpen] = useState(false);

  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', icon: <UserOutlined />, label: 'Meu Perfil' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Configurações' },
    { type: 'divider' },
    { key: 'logout', icon: <LogoutOutlined />, danger: true, label: 'Sair da Conta' },
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E1E9EF] px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Waffle Button */}
        <button
          onClick={() => setSwitcherOpen(true)}
          className="p-2 rounded-lg text-[#627D98] hover:text-[#121619] hover:bg-[#F2F4F8] transition cursor-pointer"
          title="Loft App Switcher (Menu Waffle 9-dots)"
        >
          <AppstoreOutlined className="text-lg" />
        </button>

        <AppSwitcher isOpen={switcherOpen} onClose={() => setSwitcherOpen(false)} />

        {/* Brand Logo */}
        <div className="flex items-center gap-2 select-none cursor-pointer" onClick={() => onViewChange(activeView)}>
          <span className="text-xl font-black text-[#121619] tracking-tight">loft</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#F56738]" />
          <span className="font-semibold text-sm text-[#334E68] tracking-normal truncate max-w-xs">
            {appName}
          </span>
          <span className="text-[11px] bg-[#FFF2EC] text-[#F56738] border border-[#FDC4B2] font-semibold px-2 py-0.5 rounded-full hidden sm:inline-block">
            Copan DS
          </span>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center bg-[#F2F4F8] p-1 rounded-lg border border-[#E1E9EF] gap-1">
        <button
          onClick={() => onViewChange('chat')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeView === 'chat'
              ? 'bg-white text-[#F56738] shadow-sm'
              : 'text-[#627D98] hover:text-[#121619]'
          }`}
        >
          <RobotOutlined />
          <span>Chatbot & Copiloto</span>
        </button>
        <button
          onClick={() => onViewChange('landing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeView === 'landing'
              ? 'bg-white text-[#F56738] shadow-sm'
              : 'text-[#627D98] hover:text-[#121619]'
          }`}
        >
          <FundProjectionScreenOutlined />
          <span>Apresentação Institucional</span>
        </button>
        <button
          onClick={() => onViewChange('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
            activeView === 'dashboard'
              ? 'bg-white text-[#F56738] shadow-sm'
              : 'text-[#627D98] hover:text-[#121619]'
          }`}
        >
          <TableOutlined />
          <span>Painel de Gestão</span>
        </button>
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-3">
        <Tooltip title="Buscar (⌘K)">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F2F4F8] border border-[#E1E9EF] rounded-lg text-xs text-[#627D98] cursor-pointer hover:bg-[#E8EDF5]">
            <SearchOutlined />
            <span>Buscar...</span>
            <kbd className="bg-white border border-[#CBD2D9] px-1 py-0.2 rounded text-[10px] font-mono">⌘K</kbd>
          </div>
        </Tooltip>

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
            <Avatar style={{ backgroundColor: '#F56738' }} size="small" className="font-bold">
              WJ
            </Avatar>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-semibold text-[#121619] leading-tight">Willian Jesus</span>
              <span className="text-[11px] text-[#627D98] leading-tight">willian.jesus@loft.com.br</span>
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};
"""
        files.append(self._write_file("frontend/src/components/layout/AppHeader.tsx", app_header))

        # frontend/src/components/layout/Sidebar.tsx
        sidebar_tsx = """import React from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  RobotOutlined,
  FundProjectionScreenOutlined,
  TableOutlined,
  AppstoreOutlined,
  LineChartOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

interface SidebarProps {
  activeView: 'chat' | 'landing' | 'dashboard';
  onViewChange: (view: 'chat' | 'landing' | 'dashboard') => void;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const items: MenuItem[] = [
    getItem('NAVEGAÇÃO PRINCIPAL', 'grp_main', null, [
      getItem('Chatbot & Copiloto', 'chat', <RobotOutlined className={activeView === 'chat' ? 'text-[#F56738]' : ''} />),
      getItem('Apresentação Clientes', 'landing', <FundProjectionScreenOutlined className={activeView === 'landing' ? 'text-[#F56738]' : ''} />),
      getItem('Painel de Gestão', 'dashboard', <TableOutlined className={activeView === 'dashboard' ? 'text-[#F56738]' : ''} />),
    ], 'group'),

    getItem('SERVIÇOS & CATÁLOGO', 'grp_services', null, [
      getItem('Soluções & Produtos', 'solutions', <AppstoreOutlined />),
      getItem('Métricas & Performance', 'metrics', <LineChartOutlined />),
      getItem('Segurança & Compliance', 'security', <SafetyCertificateOutlined />),
    ], 'group'),

    getItem('SISTEMA', 'grp_system', null, [
      getItem('Configurações', 'settings', <SettingOutlined />),
      getItem('Central de Ajuda', 'help', <QuestionCircleOutlined />),
    ], 'group'),
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'chat' || e.key === 'landing' || e.key === 'dashboard') {
      onViewChange(e.key);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-[#E1E9EF] flex flex-col shrink-0 min-h-[calc(100vh-64px)] select-none">
      <div className="py-3 flex-1 overflow-y-auto">
        <Menu
          mode="inline"
          selectedKeys={[activeView]}
          onClick={handleMenuClick}
          items={items}
          className="border-none text-sm font-medium"
        />
      </div>

      <div className="p-4 border-t border-[#E1E9EF] bg-[#FAFBFD] text-xs text-[#627D98]">
        <div className="flex items-center justify-between font-medium">
          <span>Copan Engine</span>
          <span className="text-[#20A483] flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#20A483]" /> v1.0.0 Ready
          </span>
        </div>
        <div className="mt-1 text-[11px] text-[#829AB1]">
          Loft Design Tokens enforced
        </div>
      </div>
    </aside>
  );
};
"""
        files.append(self._write_file("frontend/src/components/layout/Sidebar.tsx", sidebar_tsx))

        # frontend/src/components/layout/AppLayout.tsx
        app_layout_tsx = """import React from 'react';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  activeView: 'chat' | 'landing' | 'dashboard';
  onViewChange: (view: 'chat' | 'landing' | 'dashboard') => void;
  appName: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeView,
  onViewChange,
  appName,
}) => {
  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col">
      <AppHeader
        activeView={activeView}
        onViewChange={onViewChange}
        appName={appName}
      />
      <div className="flex flex-1">
        <Sidebar activeView={activeView} onViewChange={onViewChange} />
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
"""
        files.append(self._write_file("frontend/src/components/layout/AppLayout.tsx", app_layout_tsx))

        # frontend/src/components/ui/PageHeader.tsx
        page_header_tsx = """import React from 'react';
import { Breadcrumb } from 'antd';

interface BreadcrumbItem {
  title: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  badge,
}) => {
  return (
    <div className="bg-white border-b border-[#E1E9EF] px-8 py-5 mb-6 -mx-8 -mt-8 shadow-sm">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="mb-2">
          <Breadcrumb
            items={breadcrumbs.map((b) => ({
              title: b.onClick ? (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    b.onClick?.();
                  }}
                >
                  {b.title}
                </a>
              ) : (
                b.title
              ),
            }))}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[#121619] tracking-tight">{title}</h1>
            {badge}
          </div>
          {subtitle && <p className="text-sm text-[#627D98] mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-3 flex-wrap">{actions}</div>}
      </div>
    </div>
  );
};
"""
        files.append(self._write_file("frontend/src/components/ui/PageHeader.tsx", page_header_tsx))

        # frontend/src/features/landing/LandingPage.tsx (Landing Page & Apresentação Institucional)
        landing_page_tsx = """import React, { useState } from 'react';
import { Card, Button, Row, Col, Statistic, Tag, Modal, Form, Input, message } from 'antd';
import {
  SafetyCertificateOutlined,
  ThunderboltOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  UsergroupAddOutlined,
  HomeOutlined,
  LineChartOutlined,
  ArrowRightOutlined,
  ApiOutlined,
  CloudServerOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { PageHeader } from '../../components/ui/PageHeader';

interface LandingPageProps {
  appName: string;
  onExploreDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ appName, onExploreDashboard }) => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [form] = Form.useForm();

  const products = [
    {
      id: 'fianca',
      name: 'Fiança Aluguel Digital',
      category: 'Garantia Locatícia',
      description: 'Locação residencial e comercial sem fiador e sem depósito caução. Análise instantânea em menos de 60 segundos com score preditivo.',
      icon: <SafetyCertificateOutlined className="text-2xl text-[#0B6B4F]" />,
      stats: 'Aprovação em < 60s',
      highlightColor: 'border-l-4 border-l-[#0B6B4F]',
      tagColor: 'green',
      features: ['Análise automática de crédito via IA', 'Zero custo de adesão para a imobiliária', 'Garantia de pagamento pontual do aluguel'],
    },
    {
      id: 'crm',
      name: 'CRM 360 & Gestão de Leads',
      category: 'Vendas & Negociações',
      description: 'Pipeline integrado para corretores e imobiliárias gerenciarem propostas, contratos, visitas e esteiras de atendimento de ponta a ponta.',
      icon: <UsergroupAddOutlined className="text-2xl text-[#F56738]" />,
      stats: '+42% Conversão',
      highlightColor: 'border-l-4 border-l-[#F56738]',
      tagColor: 'orange',
      features: ['Distribuição inteligente de leads', 'Assinatura digital integrada', 'Dashboard analítico em tempo real'],
    },
    {
      id: 'risco',
      name: 'Motor de Risco & Decisão',
      category: 'Inteligência Financeira',
      description: 'Modelos de machine learning que cruzam birôs de crédito e histórico transacional para oferecer a máxima segurança jurídica e zero inadimplência.',
      icon: <LineChartOutlined className="text-2xl text-[#2B6CB0]" />,
      stats: '99.4% Assertividade',
      highlightColor: 'border-l-4 border-l-[#2B6CB0]',
      tagColor: 'blue',
      features: ['Antifraude biométrico e validação KYC', 'Score preditivo de inadimplência', 'Políticas customizáveis por região'],
    },
    {
      id: 'portal',
      name: 'Portal Imobiliário & Repasses',
      category: 'Gestão Operacional',
      description: 'Central de autoatendimento para proprietários, inquilinos e imobiliárias com controle de extratos, boletos e repasses automáticos via Pix.',
      icon: <HomeOutlined className="text-2xl text-[#805AD5]" />,
      stats: 'Pix Instantâneo',
      highlightColor: 'border-l-4 border-l-[#805AD5]',
      tagColor: 'purple',
      features: ['Emissão automatizada de boletos', 'Divisão inteligente de repasse (Split)', 'Extrato financeiro 100% transparente'],
    },
  ];

  const handleContactSubmit = (values: any) => {
    message.success(`Obrigado, ${values.name}! Nossa equipe de consultores entrará em contato em instantes.`);
    setDemoModalOpen(false);
    form.resetFields();
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <PageHeader
        title={appName}
        subtitle="Apresentação institucional completa de produtos, garantias e soluções digitais Loft."
        badge={
          <span className="bg-[#FFF2EC] text-[#F56738] border border-[#FDC4B2] text-xs font-bold px-2.5 py-1 rounded-full">
            Loft Copan Design System
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <Button onClick={() => setDemoModalOpen(true)}>
              Agendar Demonstração
            </Button>
            <Button
              type="primary"
              icon={<ArrowRightOutlined />}
              onClick={onExploreDashboard}
              className="bg-[#F56738] hover:bg-[#D94616]"
            >
              Acessar Painel de Gestão
            </Button>
          </div>
        }
      />

      {/* 1. HERO SECTION */}
      <div className="bg-gradient-to-br from-white via-[#FFF9F6] to-[#FFF2EC] border border-[#FDC4B2] rounded-2xl p-8 md:p-12 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFEDE6] text-[#F56738] rounded-full text-xs font-bold uppercase tracking-wider">
            <RocketOutlined /> Soluções Imobiliárias Enterprise
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#121619] tracking-tight leading-tight">
            Tecnologia e Segurança para <span className="text-[#F56738]">Transformar</span> o Mercado Imobiliário
          </h1>
          <p className="text-base md:text-lg text-[#627D98] leading-relaxed">
            Oferecemos uma suíte completa de produtos integrados para locação, análise de crédito, CRM e repasses financeiros com a confiabilidade e padrão de qualidade Loft.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Button
              type="primary"
              size="large"
              icon={<ThunderboltOutlined />}
              onClick={() => setDemoModalOpen(true)}
              className="bg-[#F56738] hover:bg-[#D94616] font-semibold h-12 px-6"
            >
              Falar com um Consultor
            </Button>
            <Button
              size="large"
              onClick={onExploreDashboard}
              className="font-semibold h-12 px-6 border-[#E1E9EF] hover:border-[#F56738] hover:text-[#F56738]"
            >
              Ver Painel Operacional
            </Button>
          </div>
        </div>
      </div>

      {/* 2. KPI / METRICS STATS SECTION */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Volume Transacionado</span>}
              value="R$ 4.8B+"
              valueStyle={{ color: '#F56738', fontWeight: 800 }}
              prefix={<LineChartOutlined />}
            />
            <div className="text-xs text-[#20A483] font-medium mt-1">▲ +35% no último ano fiscal</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Tempo de Análise</span>}
              value="< 60 seg"
              valueStyle={{ color: '#0B6B4F', fontWeight: 800 }}
              prefix={<ThunderboltOutlined />}
            />
            <div className="text-xs text-[#627D98] font-medium mt-1">Decisão preditiva em tempo real</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Imobiliárias Parceiras</span>}
              value="3.500+"
              valueStyle={{ color: '#121619', fontWeight: 800 }}
              prefix={<HomeOutlined />}
            />
            <div className="text-xs text-[#627D98] font-medium mt-1">Em todas as capitais do Brasil</div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Índice de Confiança</span>}
              value="99.8%"
              valueStyle={{ color: '#20A483', fontWeight: 800 }}
              prefix={<SafetyCertificateOutlined />}
            />
            <div className="text-xs text-[#627D98] font-medium mt-1">Zero inadimplência repassada</div>
          </Card>
        </Col>
      </Row>

      {/* 3. SHOWCASE DE PRODUTOS & SOLUÇÕES */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-[#121619]">Soluções em Destaque</h2>
          <p className="text-sm text-[#627D98]">Conheça os produtos do ecossistema Loft projetados para maximizar a sua operação.</p>
        </div>

        <Row gutter={[16, 16]}>
          {products.map((p) => (
            <Col xs={24} md={12} key={p.id}>
              <Card
                bordered={false}
                className={`h-full shadow-sm rounded-xl bg-white border border-[#E1E9EF] transition-all hover:shadow-md ${p.highlightColor}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#F2F4F8] rounded-xl">{p.icon}</div>
                    <div>
                      <h3 className="font-bold text-base text-[#121619]">{p.name}</h3>
                      <Tag color={p.tagColor} className="mt-0.5">{p.category}</Tag>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 bg-[#F2F4F8] text-[#334E68] rounded-md">
                    {p.stats}
                  </span>
                </div>

                <p className="text-sm text-[#627D98] mt-4 leading-relaxed">
                  {p.description}
                </p>

                <div className="mt-4 pt-4 border-t border-[#E1E9EF] space-y-2">
                  {p.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-[#334E68]">
                      <CheckCircleOutlined className="text-[#20A483]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-end">
                  <Button
                    type="link"
                    icon={<ArrowRightOutlined />}
                    onClick={() => {
                      setSelectedProduct(p);
                    }}
                    className="text-[#F56738] p-0 font-semibold"
                  >
                    Ver Especificações
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 4. PILARES DE ENGENHARIA & COMPLIANCE */}
      <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
        <h2 className="text-lg font-bold text-[#121619] mb-4">Padrão Arquitetural & Segurança Enterprise</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E1E9EF] space-y-2">
              <div className="flex items-center gap-2 text-[#0B6B4F] font-bold text-sm">
                <LockOutlined /> Zero Trust & LGPD
              </div>
              <p className="text-xs text-[#627D98]">
                Isolamento multi-tenant rigoroso, mascaramento de dados sensíveis (PII) e controle de acesso RBAC granular.
              </p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E1E9EF] space-y-2">
              <div className="flex items-center gap-2 text-[#F56738] font-bold text-sm">
                <CloudServerOutlined /> API First & Clean Arch
              </div>
              <p className="text-xs text-[#627D98]">
                Contratos tipados com FastAPI e Pydantic v2, envelope padronizado de responses e arquitetura modular.
              </p>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="p-4 rounded-xl bg-[#FAFBFD] border border-[#E1E9EF] space-y-2">
              <div className="flex items-center gap-2 text-[#2B6CB0] font-bold text-sm">
                <ApiOutlined /> Observabilidade 360°
              </div>
              <p className="text-xs text-[#627D98]">
                Trilhas de auditoria imutáveis, tracing de requisições e métricas de desempenho prontas para produção.
              </p>
            </div>
          </Col>
        </Row>
      </Card>

      {/* 5. MODAL DE AGENDAMENTO / CONTATO */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <RocketOutlined className="text-[#F56738]" />
            <span>Solicitar Apresentação Executiva</span>
          </div>
        }
        open={demoModalOpen}
        onCancel={() => setDemoModalOpen(false)}
        onOk={() => form.submit()}
        okText="Enviar Solicitação"
        cancelText="Cancelar"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleContactSubmit} className="pt-2">
          <Form.Item name="name" label="Nome Completo" rules={[{ required: true, message: 'Informe seu nome' }]}>
            <Input placeholder="Ex: Rodrigo Albuquerque" />
          </Form.Item>
          <Form.Item name="email" label="E-mail Corporativo" rules={[{ required: true, type: 'email', message: 'E-mail inválido' }]}>
            <Input placeholder="Ex: rodrigo@imobiliaria.com.br" />
          </Form.Item>
          <Form.Item name="company" label="Empresa / Imobiliária" rules={[{ required: true, message: 'Informe sua empresa' }]}>
            <Input placeholder="Ex: Prime Imóveis SP" />
          </Form.Item>
          <Form.Item name="phone" label="Telefone / WhatsApp" rules={[{ required: true, message: 'Informe seu telefone' }]}>
            <Input placeholder="Ex: (11) 98765-4321" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 6. MODAL DE DETALHES DO PRODUTO */}
      <Modal
        title={selectedProduct?.name}
        open={!!selectedProduct}
        onCancel={() => setSelectedProduct(null)}
        footer={[
          <Button key="close" onClick={() => setSelectedProduct(null)}>
            Fechar
          </Button>,
          <Button
            key="demo"
            type="primary"
            className="bg-[#F56738] hover:bg-[#D94616]"
            onClick={() => {
              setSelectedProduct(null);
              setDemoModalOpen(true);
            }}
          >
            Quero Contratar
          </Button>,
        ]}
        centered
      >
        {selectedProduct && (
          <div className="space-y-4 py-2">
            <Tag color={selectedProduct.tagColor}>{selectedProduct.category}</Tag>
            <p className="text-sm text-[#121619]">{selectedProduct.description}</p>
            <div className="p-3 bg-[#F2F4F8] rounded-lg">
              <span className="text-xs font-bold text-[#627D98] uppercase">Principais Recursos</span>
              <ul className="mt-2 space-y-1.5 text-xs text-[#334E68]">
                {selectedProduct.features.map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircleOutlined className="text-[#20A483]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
"""
        files.append(self._write_file("frontend/src/features/landing/LandingPage.tsx", landing_page_tsx))

        # frontend/src/features/proposals/ProposalsDashboard.tsx (Painel de Gestão)
        dashboard_tsx = """import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Input, Select, Modal, Form, InputNumber, Popconfirm, message, Card, Statistic, Row, Col } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { Proposal } from '../../types/domain.types';
import { proposalApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';

interface ProposalsDashboardProps {
  appName: string;
}

export const ProposalsDashboard: React.FC<ProposalsDashboardProps> = ({ appName }) => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await proposalApi.list(statusFilter, search);
      setProposals(data);
    } catch (err) {
      message.error('Erro ao carregar propostas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleCreate = async (values: any) => {
    try {
      await proposalApi.create(values);
      message.success('Proposta criada com sucesso!');
      setModalOpen(false);
      form.resetFields();
      loadData();
    } catch (err) {
      message.error('Falha ao criar proposta');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await proposalApi.delete(id);
      message.success('Proposta excluída com sucesso');
      loadData();
    } catch (err) {
      message.error('Falha ao excluir proposta');
    }
  };

  const totalValue = proposals.reduce((acc, p) => acc + (p.amount || 0), 0);
  const approvedCount = proposals.filter((p) => p.status === 'Approved').length;

  const columns = [
    {
      title: 'Proposta / Título',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Proposal) => (
        <div>
          <div className="font-semibold text-[#121619]">{text}</div>
          <div className="text-xs text-[#627D98]">{record.client_name} • {record.client_document}</div>
        </div>
      ),
    },
    {
      title: 'Modalidade',
      dataIndex: 'category',
      key: 'category',
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Valor Locação',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <span className="font-semibold text-[#121619]">
          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
        </span>
      ),
    },
    {
      title: 'Score de Risco',
      dataIndex: 'risk_score',
      key: 'risk_score',
      render: (score: number) => (
        <Tag color={score >= 750 ? '#0B6B4F' : score >= 600 ? '#FA8C16' : '#CE4242'}>
          {score} pts
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (st: string) => {
        const map: Record<string, { color: string; label: string }> = {
          Approved: { color: 'success', label: 'Aprovada' },
          Pending: { color: 'warning', label: 'Em Análise' },
          Rejected: { color: 'error', label: 'Recusada' },
        };
        const conf = map[st] || { color: 'default', label: st };
        return <Tag color={conf.color}>{conf.label}</Tag>;
      },
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: Proposal) => (
        <Popconfirm
          title="Excluir proposta?"
          description="Esta ação removerá o registro permanentemente."
          onConfirm={() => handleDelete(record.id)}
          okButtonProps={{ danger: true }}
        >
          <Button danger type="text" icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Painel de Propostas & Garantias"
        subtitle={`Gerenciamento operacional de esteiras e garantias da aplicação ${appName}.`}
        breadcrumbs={[
          { title: 'Home' },
          { title: appName },
          { title: 'Propostas' },
        ]}
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            className="bg-[#F56738] hover:bg-[#D94616] font-semibold"
          >
            Nova Proposta
          </Button>
        }
      />

      {/* Top Metrics Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Total de Propostas</span>}
              value={proposals.length}
              prefix={<ClockCircleOutlined className="text-[#F56738]" />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Volume Total sob Garantia</span>}
              value={totalValue}
              precision={2}
              prefix={<DollarOutlined className="text-[#0B6B4F]" />}
              formatter={(val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val))}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
            <Statistic
              title={<span className="text-xs font-bold text-[#627D98] uppercase">Propostas Aprovadas</span>}
              value={approvedCount}
              valueStyle={{ color: '#0B6B4F' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Table Card */}
      <Card bordered={false} className="shadow-sm rounded-xl bg-white border border-[#E1E9EF]">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1">
            <Input
              placeholder="Buscar por título ou cliente..."
              prefix={<SearchOutlined className="text-[#627D98]" />}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onPressEnter={loadData}
              className="max-w-md"
            />
            <Select
              placeholder="Filtrar por Status"
              allowClear
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              className="w-44"
              options={[
                { label: 'Aprovada', value: 'Approved' },
                { label: 'Em Análise', value: 'Pending' },
                { label: 'Recusada', value: 'Rejected' },
              ]}
            />
            <Button icon={<ReloadOutlined />} onClick={loadData} />
          </div>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalOpen(true)}
            className="bg-[#F56738] hover:bg-[#D94616] font-semibold"
          >
            Nova Proposta
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={proposals}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* Centered Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-[#F56738]" />
            <span>Cadastrar Nova Proposta de Garantia</span>
          </div>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        okText="Criar Proposta"
        cancelText="Cancelar"
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleCreate} className="pt-2">
          <Form.Item name="title" label="Título da Proposta" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="Ex: Locação Apartamento Bela Vista 302" />
          </Form.Item>
          <Form.Item name="client_name" label="Nome do Proponente / Locatário" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="Ex: Fernanda Lima" />
          </Form.Item>
          <Form.Item name="client_email" label="E-mail de Contato" rules={[{ required: true, type: 'email', message: 'E-mail inválido' }]}>
            <Input placeholder="Ex: fernanda.lima@exemplo.com" />
          </Form.Item>
          <Form.Item name="client_document" label="CPF / CNPJ" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <Input placeholder="Ex: 123.456.789-00" />
          </Form.Item>
          <Form.Item name="amount" label="Valor Mensal do Aluguel (R$)" rules={[{ required: true, message: 'Campo obrigatório' }]}>
            <InputNumber className="w-full" min={100} placeholder="Ex: 3500.00" />
          </Form.Item>
          <Form.Item name="category" label="Modalidade" initialValue="Fiança Aluguel">
            <Select
              options={[
                { label: 'Fiança Aluguel', value: 'Fiança Aluguel' },
                { label: 'Garantia Empresarial', value: 'Garantia Empresarial' },
                { label: 'Depósito Caução Assistido', value: 'Depósito Caução Assistido' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
"""
        files.append(self._write_file("frontend/src/features/proposals/ProposalsDashboard.tsx", dashboard_tsx))

        # frontend/src/features/chat/ChatbotPage.tsx
        chatbot_tsx = """import React, { useState, useRef, useEffect } from 'react';
import { Button, Input, Tag, Card, Avatar, Tooltip, message, Badge } from 'antd';
import {
  SendOutlined,
  RobotOutlined,
  UserOutlined,
  ClearOutlined,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  ApiOutlined,
  FileProtectOutlined,
} from '@ant-design/icons';
import { ChatMessage } from '../../types/domain.types';
import { chatApi } from '../../services/api';
import { PageHeader } from '../../components/ui/PageHeader';

interface ChatbotPageProps {
  appName: string;
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({ appName }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: 'Olá! Eu sou o Assistente Inteligente Loft Copan. Como posso ajudar você hoje com fiança locatícia, análise de crédito ou soluções imobiliárias?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedActions: [
        'Como funciona a Fiança Aluguel?',
        'Quais documentos necessários?',
        'Qual a taxa e tempo de aprovação?',
        'Como integrar via API?',
      ],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || loading) return;

    const userMessage: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      sender: 'user',
      text: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setLoading(true);

    try {
      const response = await chatApi.sendMessage(messageContent);
      const assistantMessage: ChatMessage = {
        id: `msg_asst_${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent,
        suggestedActions: response.suggested_actions,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      message.error('Erro ao processar mensagem com o assistente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([
      {
        id: 'msg_welcome_reset',
        sender: 'assistant',
        text: 'Histórico limpo! Em que posso te apoiar agora?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          'Como funciona a Fiança Aluguel?',
          'Quais documentos necessários?',
        ],
      },
    ]);
  };

  const quickPrompts = [
    {
      title: 'Fiança Aluguel',
      desc: 'Como funciona a garantia locatícia sem fiador',
      icon: <SafetyCertificateOutlined className="text-[#F56738]" />,
      query: 'Como funciona a Fiança Aluguel da Loft?',
    },
    {
      title: 'Documentação & KYC',
      desc: 'Quais documentos são exigidos para aprovação',
      icon: <FileProtectOutlined className="text-[#0B6B4F]" />,
      query: 'Quais documentos necessários para análise de crédito?',
    },
    {
      title: 'Taxas & Prazos',
      desc: 'Valores, prazos de aprovação e parcelamento',
      icon: <ThunderboltOutlined className="text-[#D69E2E]" />,
      query: 'Qual a taxa média da fiança e o tempo de resposta?',
    },
    {
      title: 'Integração API',
      desc: 'Endpoints REST e webhooks para imobiliárias',
      icon: <ApiOutlined className="text-[#2B6CB0]" />,
      query: 'Como integrar a API da Loft no meu sistema?',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <PageHeader
        title={`${appName} — AI Copilot Assistant`}
        subtitle="Assistente cognitivo conversacional com tokens do Design System Loft Copan e inferência ágil."
        badge={<Badge status="processing" color="#20A483" text="Copilot Ativo (Clean Architecture Mock)" />}
        actions={
          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            className="text-[#627D98] hover:text-[#121619]"
          >
            Limpar Conversa
          </Button>
        }
      />

      {/* Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickPrompts.map((p, idx) => (
          <div
            key={idx}
            onClick={() => handleSend(p.query)}
            className="p-3 bg-white rounded-xl border border-[#E1E9EF] hover:border-[#F56738] hover:shadow-md transition cursor-pointer flex items-start gap-2.5"
          >
            <div className="p-2 bg-[#FFF2EC] rounded-lg text-base shrink-0">{p.icon}</div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-[#121619] block truncate">{p.title}</span>
              <span className="text-[11px] text-[#627D98] block truncate">{p.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Container Card */}
      <Card
        className="rounded-2xl border-[#E1E9EF] shadow-sm flex flex-col overflow-hidden"
        bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', height: '520px' }}
      >
        {/* Messages Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#FAFBFD]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${
                m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar
                size="default"
                style={{
                  backgroundColor: m.sender === 'user' ? '#121619' : '#F56738',
                  color: '#FFFFFF',
                }}
                icon={m.sender === 'user' ? <UserOutlined /> : <RobotOutlined />}
                className="shrink-0 shadow-sm"
              />

              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-[#121619] text-white rounded-tr-none'
                    : 'bg-white border border-[#E1E9EF] text-[#121619] rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-4 mb-1">
                  <span
                    className={`text-[11px] font-bold ${
                      m.sender === 'user' ? 'text-[#CBD2D9]' : 'text-[#F56738]'
                    }`}
                  >
                    {m.sender === 'user' ? 'Você' : 'Loft Copilot'}
                  </span>
                  <span
                    className={`text-[10px] ${
                      m.sender === 'user' ? 'text-[#9FB3C8]' : 'text-[#829AB1]'
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>

                <p className="whitespace-pre-line leading-relaxed text-[13px]">{m.text}</p>

                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#EEF2F6] flex flex-wrap gap-1.5">
                    {m.suggestedActions.map((action, i) => (
                      <Tag
                        key={i}
                        color="orange"
                        onClick={() => handleSend(action)}
                        className="cursor-pointer hover:opacity-80 text-[11px] font-medium py-0.5 px-2 rounded-md border-[#FDC4B2] bg-[#FFF2EC] text-[#F56738]"
                      >
                        ⚡ {action}
                      </Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <Avatar
                size="default"
                style={{ backgroundColor: '#F56738', color: '#FFFFFF' }}
                icon={<RobotOutlined />}
                className="shrink-0 shadow-sm"
              />
              <div className="bg-white border border-[#E1E9EF] rounded-2xl rounded-tl-none px-4 py-3 text-xs text-[#627D98] flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#F56738] animate-ping" />
                <span>Loft Copilot digitando resposta...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 bg-white border-t border-[#E1E9EF] flex items-center gap-2">
          <Input.TextArea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Digite sua dúvida sobre fiança, contratos ou serviços Loft (pressione Enter para enviar)..."
            autoSize={{ minRows: 1, maxRows: 3 }}
            className="resize-none rounded-xl border-[#CBD2D9] focus:border-[#F56738]"
            disabled={loading}
          />
          <Tooltip title="Enviar Mensagem (Enter)">
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={() => handleSend()}
              loading={loading}
              className="bg-[#F56738] hover:bg-[#D94616] h-10 px-5 rounded-xl font-semibold shadow-sm shrink-0"
            >
              Enviar
            </Button>
          </Tooltip>
        </div>
      </Card>
    </div>
  );
};
"""
        files.append(self._write_file("frontend/src/features/chat/ChatbotPage.tsx", chatbot_tsx))

        # frontend/src/App.tsx
        app_tsx = """import React, { useState } from 'react';
import { ConfigProvider } from 'antd';
import ptBR from 'antd/locale/pt_BR';
import { antdTheme } from './theme/antd-theme';
import { AppLayout } from './components/layout/AppLayout';
import { ChatbotPage } from './features/chat/ChatbotPage';
import { LandingPage } from './features/landing/LandingPage';
import { ProposalsDashboard } from './features/proposals/ProposalsDashboard';

export const App: React.FC = () => {
  const appName = "__APP_NAME__";
  const isChatbotApp = appName.toLowerCase().includes('chat') || appName.toLowerCase().includes('copilot') || appName.toLowerCase().includes('assistente');
  const [activeView, setActiveView] = useState<'chat' | 'landing' | 'dashboard'>(isChatbotApp ? 'chat' : 'landing');

  return (
    <ConfigProvider theme={antdTheme} locale={ptBR}>
      <AppLayout
        activeView={activeView}
        onViewChange={setActiveView}
        appName={appName}
      >
        {activeView === 'chat' ? (
          <ChatbotPage appName={appName} />
        ) : activeView === 'landing' ? (
          <LandingPage
            appName={appName}
            onExploreDashboard={() => setActiveView('dashboard')}
          />
        ) : (
          <ProposalsDashboard appName={appName} />
        )}
      </AppLayout>
    </ConfigProvider>
  );
};

export default App;
""".replace("__APP_NAME__", name)
        files.append(self._write_file("frontend/src/App.tsx", app_tsx))

        # frontend/src/main.tsx
        # NOTE: @ant-design/v5-patch-for-react-19 must be imported before any
        # antd component renders. antd v5's static methods (message, Modal.confirm,
        # notification) rely on the legacy ReactDOM.render API that React 19
        # removed; this patch restores that behavior until antd v6 (which drops
        # the need for it) is adopted.
        main_tsx = """import '@ant-design/v5-patch-for-react-19';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
"""
        files.append(self._write_file("frontend/src/main.tsx", main_tsx))

        # frontend/src/index.css
        # Tailwind v4: no tailwind.config.js — theme customization (colors
        # previously under theme.extend.colors.loft, and the custom `shadow-xs`)
        # lives directly in CSS via @theme. Palette values are unchanged.
        index_css = """@import 'tailwindcss';

@theme {
  --color-loft-orange: #F56738;
  --color-loft-orangeHover: #D94616;
  --color-loft-green: #0B6B4F;
  --color-loft-dark: #121619;
  --color-loft-surface: #FFFFFF;
  --color-loft-bg: #F2F4F8;
  --color-loft-border: #E1E9EF;
  --color-loft-muted: #627D98;

  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

body {
  margin: 0;
  background-color: #F2F4F8;
  color: #121619;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
"""
        files.append(self._write_file("frontend/src/index.css", index_css))

        return files

