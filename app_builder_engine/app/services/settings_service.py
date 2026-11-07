"""
Settings & Category Service — Centralized Category Management, Persistence, and RBAC Policy Engine
Integrates with SQLite Database, live entity caches, and Audit Trail.
"""
from __future__ import annotations
import uuid
from datetime import datetime, timezone
from typing import Any, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.orm_models import SystemStateModel
from app.storage.database import db
from app.domain.entities import AuditLog, AuditAction
from app.schemas.settings_schemas import (
    CategoryItem,
    CategoryCreateRequest,
    CategoryUpdateRequest,
    CategoryRbacSettings,
    SystemSettingsResponse,
)

ENTITY_TYPE_TO_DB_MAP = {
    "components": ("components", "#F56738"),
    "modules": ("modules", "#0284C7"),
    "templates": ("templates", "#0066CC"),
    "rules": ("rules", "#805AD5"),
    "specifications": ("specifications", "#D97706"),
    "architectures": ("architectures", "#10B981"),
    "projects": ("projects", "#6366F1"),
}

DEFAULT_CATEGORIES_METADATA = {
    # Components
    ("components", "Layout"): ("Componentes de estrutura visual e grid", "#0066CC", True),
    ("components", "Forms"): ("Entradas de dados, formulários e controles", "#0284C7", True),
    ("components", "Feedback"): ("Alertas, modais, toasts e indicadores de estado", "#D97706", True),
    ("components", "Data Display"): ("Tabelas, cards, estatísticas e listagens", "#805AD5", True),
    ("components", "Navigation"): ("Menus, sidebars, breadcrumbs e cabeçalhos", "#10B981", True),
    ("components", "Actions"): ("Botões, menus de ação e gatilhos interativos", "#F56738", True),
    ("components", "Filters"): ("Barras de busca, filtros avançados e chips", "#6366F1", True),
    ("components", "Status"): ("Badges, tags e marcadores de ciclo de vida", "#EC4899", True),
    ("components", "Dashboard"): ("Widgets analíticos e cards de métricas", "#3B82F6", True),
    ("components", "Domain Composition"): ("Composições de domínio e regras de negócio", "#14B8A6", True),
    ("components", "UI Foundation"): ("Tokens base, tipografia e espaçamentos", "#64748B", True),
    # Modules
    ("modules", "Backend Security"): ("Serviços centrais de autenticação, JWT e RBAC", "#E12D39", True),
    ("modules", "Domain Feature"): ("Módulos de valor de negócio e fluxos de domínio", "#0284C7", True),
    ("modules", "Core Service"): ("Infraestrutura base, envelopes de API e logging", "#0066CC", True),
    ("modules", "Data Integration"): ("Conectores de banco de dados e APIs externas", "#805AD5", True),
    # Templates
    ("templates", "Backoffice"): ("Arquétipos para sistemas administrativos internos", "#0066CC", True),
    ("templates", "Admin Panel"): ("Painéis de controle gerenciais e dashboards", "#0284C7", True),
    ("templates", "Portal"): ("Portais e interfaces voltadas a usuários finais", "#10B981", True),
    ("templates", "Service Template"): ("Templates para microserviços e APIs headless", "#6366F1", True),
    # Rules
    ("rules", "Architecture"): ("Diretrizes arquiteturais de alto nível", "#0066CC", True),
    ("rules", "Security"): ("Requisitos mandatórios de segurança e autenticação", "#E12D39", True),
    ("rules", "Frontend"): ("Padrões Copan Design System e boas práticas UI", "#F56738", True),
    ("rules", "Backend"): ("Envelopes de API, tratamento de erros e convenções", "#0284C7", True),
    ("rules", "Database"): ("Migrações e modelos relacionais", "#805AD5", True),
    ("rules", "Compliance"): ("Auditoria, rastreabilidade e governança de dados", "#D97706", True),
    # Specifications
    ("specifications", "Frontend Architecture"): ("Especificações técnicas para camadas web", "#F56738", True),
    ("specifications", "Backend Architecture"): ("Documentação de arquitetura de serviços e APIs", "#0284C7", True),
    ("specifications", "Design System"): ("Diretrizes canônicas de design Copan", "#805AD5", True),
    ("specifications", "Security Specification"): ("Especificações de segurança, RBAC e tokens", "#E12D39", True),
    # Architectures
    ("architectures", "Standard"): ("Arquiteturas recomendadas pela governança Olivelas", "#10B981", True),
    ("architectures", "Modular"): ("Arquiteturas baseadas em módulos independentes", "#0066CC", True),
    # Projects
    ("projects", "Core Engine"): ("Engenharia e plataformas core de software", "#6366F1", True),
    ("projects", "Platform"): ("Soluções de plataforma para times de engenharia", "#0284C7", True),
    ("projects", "Analytics"): ("Projetos de inteligência de dados e automação", "#D97706", True),
}


class SettingsService:
    def _get_custom_categories_dict(self) -> dict[str, dict[str, Any]]:
        with SessionLocal() as s:
            state = s.get(SystemStateModel, "custom_categories")
            if state and state.value and isinstance(state.value, dict):
                return state.value
            return {}

    def _save_custom_categories_dict(self, data: dict[str, dict[str, Any]]):
        with SessionLocal() as s:
            s.merge(SystemStateModel(key="custom_categories", value=data))
            s.commit()

    def _get_rbac_settings(self) -> CategoryRbacSettings:
        with SessionLocal() as s:
            state = s.get(SystemStateModel, "category_rbac_settings")
            if state and state.value and isinstance(state.value, dict):
                return CategoryRbacSettings(**state.value)
            return CategoryRbacSettings()

    def _save_rbac_settings(self, settings: CategoryRbacSettings):
        with SessionLocal() as s:
            s.merge(SystemStateModel(key="category_rbac_settings", value=settings.model_dump()))
            s.commit()

    def check_permission(self, actor_role: str, action: str = "create"):
        rbac = self._get_rbac_settings()
        if action == "create":
            allowed = rbac.roles_can_create
        elif action == "delete":
            allowed = rbac.roles_can_delete
        else:
            allowed = rbac.roles_can_manage

        if actor_role not in allowed and "Global Admin" not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Perfil '{actor_role}' não possui permissão para '{action}' em Configurações e Categorias.",
            )

    def list_all_categories(self, entity_type: Optional[str] = None) -> list[CategoryItem]:
        """
        Lists all system and custom categories with actual item counts from the database.
        """
        custom_dict = self._get_custom_categories_dict()
        categories_map: dict[str, CategoryItem] = {}

        # 1. Gather all entity adapters
        target_types = [entity_type] if entity_type and entity_type in ENTITY_TYPE_TO_DB_MAP else list(ENTITY_TYPE_TO_DB_MAP.keys())

        # Count actual usage in entities
        usage_counts: dict[tuple[str, str], int] = {}
        for t in target_types:
            db_attr, default_color = ENTITY_TYPE_TO_DB_MAP[t]
            adapter = getattr(db, db_attr, None)
            if adapter:
                for entity in adapter.values():
                    cat = getattr(entity, "category", None)
                    if cat:
                        key = (t, str(cat))
                        usage_counts[key] = usage_counts.get(key, 0) + 1

        # 2. Add defaults & known categories
        for (t, cat_name), (desc, color, is_sys) in DEFAULT_CATEGORIES_METADATA.items():
            if t not in target_types:
                continue
            cat_id = f"cat_{t}_{cat_name.lower().replace(' ', '_')}"
            count = usage_counts.get((t, cat_name), 0)
            categories_map[cat_id] = CategoryItem(
                id=cat_id,
                name=cat_name,
                type=t,
                description=desc,
                color=color,
                count=count,
                is_system=is_sys,
            )

        # 3. Add any dynamically discovered categories from database entities that aren't in defaults
        for (t, cat_name), count in usage_counts.items():
            cat_id = f"cat_{t}_{cat_name.lower().replace(' ', '_')}"
            if cat_id not in categories_map:
                categories_map[cat_id] = CategoryItem(
                    id=cat_id,
                    name=cat_name,
                    type=t,
                    description=f"Categoria de {t.capitalize()}",
                    color=ENTITY_TYPE_TO_DB_MAP.get(t, ("", "#0066CC"))[1],
                    count=count,
                    is_system=False,
                )

        # 4. Merge custom categories registered by users
        for cat_id, custom in custom_dict.items():
            t = custom.get("type", "components")
            if t not in target_types:
                continue
            name = custom.get("name", "")
            count = usage_counts.get((t, name), 0)
            categories_map[cat_id] = CategoryItem(
                id=cat_id,
                name=name,
                type=t,
                description=custom.get("description", ""),
                color=custom.get("color", "#0066CC"),
                count=count,
                is_system=False,
                created_at=custom.get("created_at", datetime.now(timezone.utc)),
            )

        result = list(categories_map.values())
        result.sort(key=lambda x: (x.type, -x.count, x.name))
        return result

    def create_category(self, body: CategoryCreateRequest, actor_email: str = "willian.jesus@olivelas.com.br", actor_role: str = "Global Admin") -> CategoryItem:
        self.check_permission(actor_role, action="create")

        type_map = {
            "component": "components",
            "components": "components",
            "module": "modules",
            "modules": "modules",
            "template": "templates",
            "templates": "templates",
            "rule": "rules",
            "rules": "rules",
            "specification": "specifications",
            "specifications": "specifications",
            "architecture": "architectures",
            "architectures": "architectures",
            "project": "projects",
            "projects": "projects",
        }
        raw_type = body.type.lower()
        t = type_map.get(raw_type)
        if not t or t not in ENTITY_TYPE_TO_DB_MAP:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Tipo de entidade '{body.type}' inválido. Tipos permitidos: {list(ENTITY_TYPE_TO_DB_MAP.keys())}",
            )

        cat_id = f"cat_{t}_{body.name.strip().lower().replace(' ', '_')}"
        custom_dict = self._get_custom_categories_dict()

        if cat_id in custom_dict or any(c.name.lower() == body.name.strip().lower() and c.type == t for c in self.list_all_categories(t)):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Categoria '{body.name}' já existe para '{t}'.",
            )

        now = datetime.now(timezone.utc)
        cat_item = {
            "id": cat_id,
            "name": body.name.strip(),
            "type": t,
            "description": body.description,
            "color": body.color or ENTITY_TYPE_TO_DB_MAP[t][1],
            "is_system": False,
            "created_at": now.isoformat(),
            "updated_at": now.isoformat(),
        }
        custom_dict[cat_id] = cat_item
        self._save_custom_categories_dict(custom_dict)

        # Audit
        db.audit_logs.append(
            AuditLog(
                actor=actor_email,
                action=AuditAction.CREATE,
                resource="Category",
                resource_id=cat_id,
                entity_type="category",
                entity_id=cat_id,
                metadata={"name": body.name, "type": t, "color": body.color},
                details={"message": f"Nova categoria '{body.name}' cadastrada para {t}."},
            )
        )

        return CategoryItem(
            id=cat_id,
            name=body.name.strip(),
            type=t,
            description=body.description,
            color=body.color or ENTITY_TYPE_TO_DB_MAP[t][1],
            count=0,
            is_system=False,
            created_at=now,
            updated_at=now,
        )

    def update_category(
        self,
        category_id: str,
        body: CategoryUpdateRequest,
        actor_email: str = "willian.jesus@olivelas.com.br",
        actor_role: str = "Global Admin",
    ) -> CategoryItem:
        self.check_permission(actor_role, action="manage")

        custom_dict = self._get_custom_categories_dict()
        existing = next((c for c in self.list_all_categories() if c.id == category_id), None)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Categoria '{category_id}' não encontrada.",
            )

        old_name = existing.name
        new_name = body.name.strip()
        t = existing.type

        # Update in custom dictionary
        now = datetime.now(timezone.utc)
        custom_dict[category_id] = {
            "id": category_id,
            "name": new_name,
            "type": t,
            "description": body.description if body.description is not None else existing.description,
            "color": body.color or existing.color,
            "is_system": existing.is_system,
            "created_at": existing.created_at.isoformat() if hasattr(existing.created_at, "isoformat") else str(existing.created_at),
            "updated_at": now.isoformat(),
        }
        self._save_custom_categories_dict(custom_dict)

        # If renamed, propagate to all existing entities of this type
        renamed_count = 0
        if old_name != new_name:
            db_attr, _ = ENTITY_TYPE_TO_DB_MAP.get(t, ("", ""))
            adapter = getattr(db, db_attr, None)
            if adapter:
                for item_id, entity in list(adapter.items()):
                    if getattr(entity, "category", None) == old_name:
                        setattr(entity, "category", new_name)
                        adapter[item_id] = entity
                        renamed_count += 1

        # Audit
        db.audit_logs.append(
            AuditLog(
                actor=actor_email,
                action=AuditAction.UPDATE,
                resource="Category",
                resource_id=category_id,
                entity_type="category",
                entity_id=category_id,
                metadata={"old_name": old_name, "new_name": new_name, "type": t, "entities_updated": renamed_count},
                details={"message": f"Categoria atualizada de '{old_name}' para '{new_name}' ({renamed_count} itens atualizados)."},
            )
        )

        return CategoryItem(
            id=category_id,
            name=new_name,
            type=t,
            description=body.description if body.description is not None else existing.description,
            color=body.color or existing.color,
            count=existing.count,
            is_system=existing.is_system,
            created_at=existing.created_at,
            updated_at=now,
        )

    def delete_category(
        self,
        category_id: str,
        actor_email: str = "willian.jesus@olivelas.com.br",
        actor_role: str = "Global Admin",
    ):
        self.check_permission(actor_role, action="delete")

        existing = next((c for c in self.list_all_categories() if c.id == category_id), None)
        if not existing:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Categoria '{category_id}' não encontrada.",
            )

        if existing.is_system and existing.count > 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Categoria de sistema '{existing.name}' possui {existing.count} ativos vinculados e não pode ser excluída.",
            )

        custom_dict = self._get_custom_categories_dict()
        if category_id in custom_dict:
            del custom_dict[category_id]
            self._save_custom_categories_dict(custom_dict)

        # Reassign any orphaned entities to General
        db_attr, _ = ENTITY_TYPE_TO_DB_MAP.get(existing.type, ("", ""))
        adapter = getattr(db, db_attr, None)
        if adapter:
            for item_id, entity in list(adapter.items()):
                if getattr(entity, "category", None) == existing.name:
                    setattr(entity, "category", "General")
                    adapter[item_id] = entity

        db.audit_logs.append(
            AuditLog(
                actor=actor_email,
                action=AuditAction.DELETE,
                resource="Category",
                resource_id=category_id,
                entity_type="category",
                entity_id=category_id,
                metadata={"name": existing.name, "type": existing.type},
                details={"message": f"Categoria '{existing.name}' excluída."},
            )
        )

    def get_system_settings_summary(self) -> SystemSettingsResponse:
        cats = self.list_all_categories()
        custom_dict = self._get_custom_categories_dict()
        rbac = self._get_rbac_settings()
        return SystemSettingsResponse(
            default_versioning_policy="semver_strict",
            auto_audit_logging=True,
            golden_rules_mandate=True,
            rbac_settings=rbac,
            total_categories=len(cats),
            total_custom_categories=len(custom_dict),
        )

    def update_rbac_settings(self, settings: CategoryRbacSettings, actor_email: str = "willian.jesus@olivelas.com.br"):
        self._save_rbac_settings(settings)
        db.audit_logs.append(
            AuditLog(
                actor=actor_email,
                action=AuditAction.PERMISSION_CHANGE,
                resource="SettingsRBAC",
                resource_id="rbac_settings",
                entity_type="settings",
                entity_id="rbac_settings",
                metadata=settings.model_dump(),
                details={"message": "Regras de RBAC para Configurações e Categorias atualizadas."},
            )
        )
        return settings


settings_service = SettingsService()
