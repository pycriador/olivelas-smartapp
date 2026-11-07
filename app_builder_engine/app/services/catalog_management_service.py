"""
Catalog Management Service
Handles CRUD, versioning, publishing, deprecation, and 360 Knowledge Graph Relations
"""
from __future__ import annotations
import uuid
from datetime import datetime, timezone
from typing import Any
from app.core.errors import NotFoundError, ValidationError
from app.domain.entities import (
    Component,
    Template,
    Module,
    Rule,
    RuleCategory,
    RulePriority,
    Architecture,
    Specification,
    Blueprint,
    Project,
    EntityLifecycleStatus,
    AuditAction,
    Entity360Response,
)
from app.storage.database import db
from app.services.audit_service import AuditService


class CatalogManagementService:
    def __init__(self, audit_service: AuditService | None = None):
        self.audit = audit_service or AuditService()

    # -----------------------------------------------------------------------
    # 360° Knowledge Graph & Reverse Relationship Engine
    # -----------------------------------------------------------------------
    def get_entity_360_relations(self, entity_type: str, entity_id: str) -> Entity360Response:
        """Calculates the complete 360-degree knowledge graph answering the 7 core questions."""
        entity_type_lower = entity_type.lower()

        what_is_it: dict[str, Any] = {}
        what_is_it_for: dict[str, Any] = {}
        dependencies: list[dict[str, Any]] = []
        where_used: list[dict[str, Any]] = []
        associated_rules: list[dict[str, Any]] = []
        associated_specs: list[dict[str, Any]] = []
        version_lifecycle: dict[str, Any] = {}

        name = ""
        description = ""
        version = "1.0.0"
        status = "Published"
        category: str | None = None
        tags: list[str] = []

        if entity_type_lower in ["component", "comp"]:
            comp = db.components.get(entity_id)
            if not comp:
                raise NotFoundError(f"Componente '{entity_id}' não encontrado.")
            name = comp.name
            description = comp.description
            version = comp.version
            status = comp.status.value if isinstance(comp.status, EntityLifecycleStatus) else str(comp.status)
            category = comp.category
            tags = comp.tags

            what_is_it = {
                "id": comp.id,
                "name": comp.name,
                "type": "Component",
                "category": comp.category,
                "status": status,
                "version": comp.version,
                "tags": comp.tags,
            }
            what_is_it_for = {
                "description": comp.description,
                "documentation": comp.documentation,
                "interface_spec": comp.interface_spec,
                "example_usage": comp.example_usage,
                "preview_code": comp.preview_code or comp.example_usage,
                "contract": comp.props_contract or comp.interface_spec,
            }

            # Dependencies
            for dep in comp.dependencies:
                dependencies.append({"id": dep, "name": dep, "type": "Package / Dependency"})

            # Where is it used? (Modules, Templates, Blueprints)
            for mod in db.modules.values():
                if comp.id in mod.components:
                    where_used.append({"id": mod.id, "name": mod.name, "type": "Module", "relationship": "Included in Module"})
            for tpl in db.templates.values():
                if comp.id in tpl.components:
                    where_used.append({"id": tpl.id, "name": tpl.name, "type": "Template", "relationship": "Included in Template"})
            for bp in db.blueprints.values():
                if comp.id in bp.components or comp.name in bp.components:
                    where_used.append({"id": bp.id, "name": bp.name, "type": "Blueprint", "relationship": "Used in Blueprint"})

            # Associated Specs & Rules
            for spec in db.specifications.values():
                if comp.id in spec.related_components:
                    associated_specs.append({"id": spec.id, "name": spec.name, "category": spec.category})
            for rule in db.rules.values():
                if "copan" in rule.id.lower() or "frontend" in rule.category.lower() or "a11y" in rule.id.lower():
                    associated_rules.append({
                        "id": rule.id,
                        "name": rule.name,
                        "priority": rule.priority.value if hasattr(rule.priority, "value") else str(rule.priority),
                        "good_example": rule.good_example,
                        "bad_example": rule.bad_example,
                    })

        elif entity_type_lower in ["module", "mod"]:
            mod = db.modules.get(entity_id)
            if not mod:
                raise NotFoundError(f"Módulo '{entity_id}' não encontrado.")
            name = mod.name
            description = mod.description
            version = mod.version
            status = mod.status.value if isinstance(mod.status, EntityLifecycleStatus) else str(mod.status)
            category = mod.category or "Business Module"

            what_is_it = {
                "id": mod.id,
                "name": mod.name,
                "type": "Module",
                "category": category,
                "status": status,
                "version": mod.version,
                "tags": mod.tags or [],
            }
            what_is_it_for = {"description": mod.description, "apis": mod.apis}

            # Dependencies
            for c_id in mod.components:
                c = db.components.get(c_id)
                dependencies.append({"id": c_id, "name": c.name if c else c_id, "type": "Component"})
            for dep_mod_id in mod.dependencies:
                dm = db.modules.get(dep_mod_id)
                dependencies.append({"id": dep_mod_id, "name": dm.name if dm else dep_mod_id, "type": "Module Dependency"})

            # Where is it used?
            for tpl in db.templates.values():
                if mod.id in tpl.modules:
                    where_used.append({"id": tpl.id, "name": tpl.name, "type": "Template", "relationship": "Included in Template"})
            for bp in db.blueprints.values():
                if mod.id in bp.modules or mod.name in bp.modules:
                    where_used.append({"id": bp.id, "name": bp.name, "type": "Blueprint", "relationship": "Configured in Blueprint"})

            # Rules & Specs
            for r_id in mod.rules:
                r = db.rules.get(r_id)
                if r:
                    associated_rules.append({"id": r.id, "name": r.name, "priority": r.priority.value if hasattr(r.priority, "value") else str(r.priority)})
            for s_id in mod.specifications:
                s = db.specifications.get(s_id)
                if s:
                    associated_specs.append({"id": s.id, "name": s.name, "category": s.category})

        elif entity_type_lower in ["template", "tpl"]:
            tpl = db.templates.get(entity_id)
            if not tpl:
                raise NotFoundError(f"Template '{entity_id}' não encontrado.")
            name = tpl.name
            description = tpl.description
            version = tpl.version
            status = tpl.status.value if isinstance(tpl.status, EntityLifecycleStatus) else str(tpl.status)
            category = tpl.category

            what_is_it = {
                "id": tpl.id,
                "name": tpl.name,
                "type": "Template",
                "category": tpl.category,
                "status": status,
                "version": tpl.version,
                "tags": tpl.tags or [],
            }
            what_is_it_for = {"description": tpl.description, "architecture": tpl.architecture}

            # Dependencies
            for m_id in tpl.modules:
                m = db.modules.get(m_id)
                dependencies.append({"id": m_id, "name": m.name if m else m_id, "type": "Module"})
            for c_id in tpl.components:
                c = db.components.get(c_id)
                dependencies.append({"id": c_id, "name": c.name if c else c_id, "type": "Component"})

            # Where is it used?
            for bp in db.blueprints.values():
                if tpl.id in bp.templates or tpl.name in bp.templates:
                    where_used.append({"id": bp.id, "name": bp.name, "type": "Blueprint", "relationship": "Base Template for Blueprint"})

            # Rules
            for r_id in tpl.rules:
                r = db.rules.get(r_id)
                if r:
                    associated_rules.append({"id": r.id, "name": r.name, "priority": r.priority.value if hasattr(r.priority, "value") else str(r.priority)})

        elif entity_type_lower in ["rule"]:
            rule = db.rules.get(entity_id)
            if not rule:
                raise NotFoundError(f"Regra '{entity_id}' não encontrada.")
            name = rule.name
            description = rule.description
            version = rule.version
            status = rule.status.value if isinstance(rule.status, EntityLifecycleStatus) else str(rule.status)
            category = rule.category.value if hasattr(rule.category, "value") else str(rule.category)

            what_is_it = {"id": rule.id, "name": rule.name, "type": "Rule", "category": category, "priority": rule.priority.value if hasattr(rule.priority, "value") else str(rule.priority), "status": status, "version": rule.version}
            what_is_it_for = {"description": rule.description, "bad_example": rule.bad_example, "good_example": rule.good_example}

            # Where used?
            for mod in db.modules.values():
                if rule.id in mod.rules:
                    where_used.append({"id": mod.id, "name": mod.name, "type": "Module", "relationship": "Mandatory in Module"})
            for tpl in db.templates.values():
                if rule.id in tpl.rules:
                    where_used.append({"id": tpl.id, "name": tpl.name, "type": "Template", "relationship": "Mandatory in Template"})
            for bp in db.blueprints.values():
                if rule.id in bp.rules:
                    where_used.append({"id": bp.id, "name": bp.name, "type": "Blueprint", "relationship": "Enforced in Blueprint"})

            if rule.referenced_spec:
                spec = db.specifications.get(rule.referenced_spec)
                if spec:
                    associated_specs.append({"id": spec.id, "name": spec.name, "category": spec.category})

        elif entity_type_lower in ["specification", "spec"]:
            spec = db.specifications.get(entity_id)
            if not spec:
                raise NotFoundError(f"Especificação '{entity_id}' não encontrada.")
            name = spec.name
            description = spec.description
            version = spec.version
            status = spec.status.value if isinstance(spec.status, EntityLifecycleStatus) else str(spec.status)
            category = spec.category
            tags = spec.tags

            what_is_it = {"id": spec.id, "name": spec.name, "type": "Specification", "category": spec.category, "status": status, "version": spec.version, "tags": spec.tags}
            what_is_it_for = {"description": spec.description}

            for c_id in spec.related_components:
                c = db.components.get(c_id)
                dependencies.append({"id": c_id, "name": c.name if c else c_id, "type": "Component Specified"})

            for mod in db.modules.values():
                if spec.id in mod.specifications:
                    where_used.append({"id": mod.id, "name": mod.name, "type": "Module", "relationship": "Governs Module"})

            for r_id in spec.related_rules:
                r = db.rules.get(r_id)
                if r:
                    associated_rules.append({"id": r.id, "name": r.name, "priority": r.priority.value if hasattr(r.priority, "value") else str(r.priority)})

        elif entity_type_lower in ["architecture", "arch"]:
            arch = db.architectures.get(entity_id)
            if not arch:
                raise NotFoundError(f"Arquitetura '{entity_id}' não encontrada.")
            name = arch.name
            description = arch.description
            version = arch.version
            status = arch.status.value if isinstance(arch.status, EntityLifecycleStatus) else str(arch.status)
            category = "Architecture Pattern"

            what_is_it = {"id": arch.id, "name": arch.name, "type": "Architecture", "status": status, "version": arch.version}
            what_is_it_for = {"description": arch.description, "characteristics": arch.characteristics, "recommended_for": arch.recommended_for, "restrictions": arch.restrictions}

            for bp in db.blueprints.values():
                if bp.architecture_id == arch.id or bp.architecture_name == arch.name:
                    where_used.append({"id": bp.id, "name": bp.name, "type": "Blueprint", "relationship": "Target Architecture for Blueprint"})

        elif entity_type_lower in ["project", "prj"]:
            prj = db.projects.get(entity_id)
            if not prj:
                raise NotFoundError(f"Projeto '{entity_id}' não encontrado.")
            name = prj.name
            description = prj.description
            version = prj.version or "1.0.0"
            status = prj.status.value if hasattr(prj.status, "value") else str(prj.status)
            category = prj.domain
            tags = prj.tags

            what_is_it = {"id": prj.id, "name": prj.name, "type": "Project", "category": prj.domain, "status": status, "version": version, "tags": prj.tags}
            what_is_it_for = {"description": prj.description, "domain": prj.domain, "architecture": prj.architecture}

            # Dependencies
            for m_id in prj.modules:
                m = db.modules.get(m_id)
                dependencies.append({"id": m_id, "name": m.name if m else m_id, "type": "Module Included"})
            for c_id in prj.components:
                c = db.components.get(c_id)
                dependencies.append({"id": c_id, "name": c.name if c else c_id, "type": "Component Included"})

            # Where used / blueprint
            if prj.blueprint_id:
                bp = db.blueprints.get(prj.blueprint_id)
                if bp:
                    where_used.append({"id": bp.id, "name": bp.name, "type": "Blueprint", "relationship": "Target Blueprint"})

            # Rules & Specs
            for r_id in prj.rules:
                r = db.rules.get(r_id)
                if r:
                    associated_rules.append({"id": r.id, "name": r.name, "priority": r.priority.value if hasattr(r.priority, "value") else str(r.priority)})
            for s_id in prj.specifications:
                s = db.specifications.get(s_id)
                if s:
                    associated_specs.append({"id": s.id, "name": s.name, "category": s.category})

        elif entity_type_lower in ["blueprint", "bp"]:
            bp = db.blueprints.get(entity_id)
            if not bp:
                raise NotFoundError(f"Blueprint '{entity_id}' não encontrado.")
            name = bp.name
            description = bp.description
            version = bp.version or "1.0.0"
            status = bp.status.value if hasattr(bp.status, "value") else str(bp.status or "Ready")
            category = bp.architecture_name or "Architecture Blueprint"

            what_is_it = {"id": bp.id, "name": bp.name, "type": "Blueprint", "category": category, "status": status, "version": version}
            what_is_it_for = {"description": bp.description, "architecture": bp.architecture_name, "features": bp.features}

            # Dependencies
            for m_id in bp.modules:
                m = db.modules.get(m_id)
                dependencies.append({"id": m_id, "name": m.name if m else m_id, "type": "Module Included"})
            for c_id in bp.components:
                c = db.components.get(c_id)
                dependencies.append({"id": c_id, "name": c.name if c else c_id, "type": "Component Included"})
            for dep in bp.dependencies:
                dependencies.append({"id": dep, "name": dep, "type": "Package / Runtime"})

            # Project association
            if bp.project_id:
                p = db.projects.get(bp.project_id)
                if p:
                    where_used.append({"id": p.id, "name": p.name, "type": "Project", "relationship": "Attached to Project"})

            # Rules & Specs
            for r_id in bp.rules:
                r = db.rules.get(r_id)
                if r:
                    associated_rules.append({"id": r.id, "name": r.name, "priority": r.priority.value if hasattr(r.priority, "value") else str(r.priority)})
            for s_id in bp.specifications:
                s = db.specifications.get(s_id)
                if s:
                    associated_specs.append({"id": s.id, "name": s.name, "category": s.category})

        else:
            raise ValidationError(f"Tipo de entidade desconhecido: '{entity_type}'")

        version_lifecycle = {
            "version": version,
            "status": status,
            "history": [{"version": "1.0.0", "date": "2026-09-01", "note": "Versão inicial canônica"}],
            "available_transitions": ["Published", "Deprecated", "Draft"],
        }

        return Entity360Response(
            id=entity_id,
            type=entity_type.capitalize(),
            name=name,
            description=description,
            version=version,
            status=status,
            category=category,
            tags=tags,
            what_is_it=what_is_it,
            what_is_it_for=what_is_it_for,
            dependencies=dependencies,
            where_used=where_used,
            associated_rules=associated_rules,
            associated_specs=associated_specs,
            version_lifecycle=version_lifecycle,
        )

    # -----------------------------------------------------------------------
    # Components CRUD
    # -----------------------------------------------------------------------
    def list_components(
        self,
        category: str | None = None,
        status: EntityLifecycleStatus | None = None,
        search: str | None = None,
    ) -> list[Component]:
        comps = list(db.components.values())
        if category:
            comps = [c for c in comps if c.category.lower() == category.lower()]
        if status:
            comps = [c for c in comps if c.status == status]
        if search:
            s = search.lower()
            comps = [c for c in comps if s in c.name.lower() or s in c.description.lower() or any(s in t.lower() for t in c.tags)]
        return sorted(comps, key=lambda x: x.name)

    def get_component(self, component_id: str) -> Component:
        comp = db.components.get(component_id)
        if not comp:
            raise NotFoundError(f"Componente '{component_id}' não encontrado.", code="COMPONENT_NOT_FOUND")
        return comp

    def create_component(
        self,
        name: str,
        description: str,
        category: str = "UI Components",
        tags: list[str] | None = None,
        dependencies: list[str] | None = None,
        documentation: str = "",
        interface_spec: str = "",
        example_usage: str = "",
        version: str = "1.0.0",
        status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED,
    ) -> Component:
        comp_id = f"comp-{name.lower().replace(' ', '-')}"
        comp = Component(
            id=comp_id,
            name=name,
            description=description,
            category=category,
            tags=tags or [],
            dependencies=dependencies or [],
            documentation=documentation,
            interface_spec=interface_spec,
            example_usage=example_usage,
            version=version,
            status=status,
        )
        db.components[comp.id] = comp
        self.audit.log(
            action=AuditAction.COMPONENT_CREATED,
            resource="Component",
            resource_id=comp.id,
            metadata={"name": comp.name},
        )
        return comp

    def update_component(self, component_id: str, data: dict[str, Any]) -> Component:
        comp = self.get_component(component_id)
        for key, val in data.items():
            if val is not None and hasattr(comp, key):
                setattr(comp, key, val)
        comp.updated_at = datetime.now(timezone.utc)
        db.components[comp.id] = comp
        self.audit.log(action=AuditAction.COMPONENT_UPDATED, resource="Component", resource_id=comp.id)
        return comp

    def delete_component(self, component_id: str) -> None:
        comp = self.get_component(component_id)
        del db.components[component_id]
        self.audit.log(action=AuditAction.COMPONENT_DEPRECATED, resource="Component", resource_id=component_id)

    def publish_component(self, component_id: str) -> Component:
        comp = self.get_component(component_id)
        comp.status = EntityLifecycleStatus.PUBLISHED
        comp.updated_at = datetime.now(timezone.utc)
        db.components[comp.id] = comp
        self.audit.log(action=AuditAction.COMPONENT_PUBLISHED, resource="Component", resource_id=comp.id)
        return comp

    def deprecate_component(self, component_id: str) -> Component:
        comp = self.get_component(component_id)
        comp.status = EntityLifecycleStatus.DEPRECATED
        comp.updated_at = datetime.now(timezone.utc)
        db.components[comp.id] = comp
        self.audit.log(action=AuditAction.COMPONENT_DEPRECATED, resource="Component", resource_id=comp.id)
        return comp

    # -----------------------------------------------------------------------
    # Templates CRUD
    # -----------------------------------------------------------------------
    def list_templates(
        self,
        category: str | None = None,
        status: EntityLifecycleStatus | str | None = None,
        search: str | None = None,
    ) -> list[Template]:
        templates = list(db.templates.values())
        if category:
            templates = [t for t in templates if t.category.lower() == category.lower()]
        if status:
            st_val = status.value if hasattr(status, "value") else str(status)
            templates = [
                t for t in templates
                if (t.status.value if hasattr(t.status, "value") else str(t.status)).lower() == st_val.lower()
            ]
        if search:
            q = search.lower()
            templates = [
                t for t in templates
                if q in t.name.lower()
                or q in t.description.lower()
                or q in t.category.lower()
                or any(q in tag.lower() for tag in (t.tags or []))
            ]
        return sorted(templates, key=lambda x: x.name)

    def get_template(self, template_id: str) -> Template:
        tpl = db.templates.get(template_id)
        if not tpl:
            raise NotFoundError(f"Template '{template_id}' não encontrado.", code="TEMPLATE_NOT_FOUND")
        return tpl

    def create_template(
        self,
        name: str,
        category: str,
        description: str,
        architecture: str = "arch_loft_standard_fullstack",
        architecture_id: str | None = None,
        modules: list[str] | None = None,
        components: list[str] | None = None,
        rules: list[str] | None = None,
        specifications: list[str] | None = None,
        version: str = "1.0.0",
        status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED,
    ) -> Template:
        tpl_id = f"tpl_{name.lower().replace(' ', '_').replace('-', '_')[:35]}"
        tpl = Template(
            id=tpl_id,
            name=name,
            category=category,
            description=description,
            architecture=architecture,
            architecture_id=architecture_id or architecture,
            modules=modules or [],
            components=components or [],
            rules=rules or [],
            specifications=specifications or [],
            version=version,
            status=status,
        )
        db.templates[tpl.id] = tpl
        self.audit.log(action=AuditAction.TEMPLATE_CREATED, resource="Template", resource_id=tpl.id)
        return tpl

    def update_template(self, template_id: str, data: dict[str, Any]) -> Template:
        tpl = self.get_template(template_id)
        for key, val in data.items():
            if val is not None and hasattr(tpl, key):
                setattr(tpl, key, val)
        tpl.updated_at = datetime.now(timezone.utc)
        db.templates[tpl.id] = tpl
        return tpl

    def delete_template(self, template_id: str) -> None:
        tpl = self.get_template(template_id)
        del db.templates[template_id]

    # -----------------------------------------------------------------------
    # Modules CRUD
    # -----------------------------------------------------------------------
    def list_modules(
        self,
        category: str | None = None,
        status: EntityLifecycleStatus | str | None = None,
        search: str | None = None,
    ) -> list[Module]:
        mods = list(db.modules.values())
        if category:
            mods = [m for m in mods if (m.category or "").lower() == category.lower()]
        if status:
            st_val = status.value if hasattr(status, "value") else str(status)
            mods = [
                m for m in mods
                if (m.status.value if hasattr(m.status, "value") else str(m.status)).lower() == st_val.lower()
            ]
        if search:
            q = search.lower()
            mods = [
                m for m in mods
                if q in m.name.lower()
                or q in m.description.lower()
                or any(q in api.lower() for api in (m.apis or []))
                or any(q in tag.lower() for tag in (m.tags or []))
            ]
        return sorted(mods, key=lambda x: x.name)

    def get_module(self, module_id: str) -> Module:
        mod = db.modules.get(module_id)
        if not mod:
            raise NotFoundError(f"Módulo '{module_id}' não encontrado.", code="MODULE_NOT_FOUND")
        return mod

    def create_module(
        self,
        name: str,
        description: str,
        components: list[str] | None = None,
        apis: list[str] | None = None,
        rules: list[str] | None = None,
        dependencies: list[str] | None = None,
        specifications: list[str] | None = None,
        templates: list[str] | None = None,
        tags: list[str] | None = None,
        version: str = "1.0.0",
        status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED,
    ) -> Module:
        mod_id = f"mod-{name.lower().replace(' ', '-')}"
        mod = Module(
            id=mod_id,
            name=name,
            description=description,
            components=components or [],
            apis=apis or [],
            rules=rules or [],
            dependencies=dependencies or [],
            specifications=specifications or [],
            templates=templates or [],
            tags=tags or [],
            version=version,
            status=status,
        )
        db.modules[mod.id] = mod
        self.audit.log(action=AuditAction.MODULE_CREATED, resource="Module", resource_id=mod.id)
        return mod

    def update_module(self, module_id: str, data: dict[str, Any]) -> Module:
        mod = self.get_module(module_id)
        for key, val in data.items():
            if val is not None and hasattr(mod, key):
                setattr(mod, key, val)
        mod.updated_at = datetime.now(timezone.utc)
        db.modules[mod.id] = mod
        return mod

    def delete_module(self, module_id: str) -> None:
        mod = self.get_module(module_id)
        del db.modules[module_id]

    # -----------------------------------------------------------------------
    # Rules CRUD
    # -----------------------------------------------------------------------
    def list_rules(
        self,
        category: RuleCategory | str | None = None,
        priority: RulePriority | str | None = None,
        status: EntityLifecycleStatus | str | None = None,
        search: str | None = None,
    ) -> list[Rule]:
        rules = list(db.rules.values())
        if category:
            cat_val = category.value if hasattr(category, "value") else str(category)
            rules = [
                r for r in rules
                if (r.category.value if hasattr(r.category, "value") else str(r.category)).lower() == cat_val.lower()
            ]
        if priority:
            pri_val = priority.value if hasattr(priority, "value") else str(priority)
            rules = [
                r for r in rules
                if (r.priority.value if hasattr(r.priority, "value") else str(r.priority)).lower() == pri_val.lower()
            ]
        if status:
            st_val = status.value if hasattr(status, "value") else str(status)
            rules = [
                r for r in rules
                if (r.status.value if hasattr(r.status, "value") else str(r.status)).lower() == st_val.lower()
            ]
        if search:
            q = search.lower()
            rules = [
                r for r in rules
                if q in r.name.lower()
                or q in r.description.lower()
                or q in (r.scope or "").lower()
            ]
        return sorted(rules, key=lambda x: x.name)

    def get_rule(self, rule_id: str) -> Rule:
        rule = db.rules.get(rule_id)
        if not rule:
            raise NotFoundError(f"Regra '{rule_id}' não encontrada.", code="RULE_NOT_FOUND")
        return rule

    def create_rule(
        self,
        name: str,
        description: str,
        category: RuleCategory = RuleCategory.ARCHITECTURE,
        priority: RulePriority = RulePriority.REQUIRED,
        scope: str = "Global",
        bad_example: str | None = None,
        good_example: str | None = None,
        referenced_spec: str | None = None,
        version: str = "1.0.0",
        status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED,
    ) -> Rule:
        rule_id = f"rule-{name.lower().replace(' ', '-')}"
        rule = Rule(
            id=rule_id,
            name=name,
            description=description,
            category=category,
            priority=priority,
            scope=scope,
            bad_example=bad_example,
            good_example=good_example,
            referenced_spec=referenced_spec,
            version=version,
            status=status,
        )
        db.rules[rule.id] = rule
        self.audit.log(action=AuditAction.RULE_CREATED, resource="Rule", resource_id=rule.id)
        return rule

    def update_rule(self, rule_id: str, data: dict[str, Any]) -> Rule:
        rule = self.get_rule(rule_id)
        for key, val in data.items():
            if val is not None and hasattr(rule, key):
                setattr(rule, key, val)
        rule.updated_at = datetime.now(timezone.utc)
        db.rules[rule.id] = rule
        return rule

    def delete_rule(self, rule_id: str) -> None:
        rule = self.get_rule(rule_id)
        del db.rules[rule_id]

    # -----------------------------------------------------------------------
    # Architectures
    # -----------------------------------------------------------------------
    # Architectures CRUD
    # -----------------------------------------------------------------------
    def list_architectures(
        self,
        category: str | None = None,
        status: EntityLifecycleStatus | str | None = None,
        search: str | None = None,
    ) -> list[Architecture]:
        archs = list(db.architectures.values())
        if category:
            archs = [a for a in archs if (a.category or "").lower() == category.lower()]
        if status:
            st_val = status.value if hasattr(status, "value") else str(status)
            archs = [
                a for a in archs
                if (a.status.value if hasattr(a.status, "value") else str(a.status)).lower() == st_val.lower()
            ]
        if search:
            q = search.lower()
            archs = [
                a for a in archs
                if q in a.name.lower()
                or q in a.description.lower()
                or any(q in c.lower() for c in (a.characteristics or []))
            ]
        return sorted(archs, key=lambda x: x.name)

    def get_architecture(self, architecture_id: str) -> Architecture:
        arch = db.architectures.get(architecture_id)
        if not arch:
            raise NotFoundError(f"Arquitetura '{architecture_id}' não encontrada.", code="ARCHITECTURE_NOT_FOUND")
        return arch

    def create_architecture(
        self,
        name: str,
        description: str,
        category: str = "Pattern",
        characteristics: list[str] | None = None,
        recommended_for: list[str] | None = None,
        restrictions: list[str] | None = None,
        layers: list[str] | None = None,
        folder_tree: str = "",
        modules: list[str] | None = None,
        components: list[str] | None = None,
        rules: list[str] | None = None,
        specifications: list[str] | None = None,
        version: str = "1.0.0",
        status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED,
    ) -> Architecture:
        arch_id = f"arch_{name.lower().replace(' ', '_').replace('-', '_')[:35]}"
        arch = Architecture(
            id=arch_id,
            name=name,
            description=description,
            category=category,
            characteristics=characteristics or [],
            recommended_for=recommended_for or [],
            restrictions=restrictions or [],
            layers=layers or ["Presentation", "API", "Services", "Domain", "Database"],
            folder_tree=folder_tree,
            modules=modules or [],
            components=components or [],
            rules=rules or [],
            specifications=specifications or [],
            version=version,
            status=status,
        )
        db.architectures[arch.id] = arch
        self.audit.log(action=AuditAction.ARCHITECTURE_CREATED, resource="Architecture", resource_id=arch.id)
        return arch

    def update_architecture(self, architecture_id: str, data: dict[str, Any]) -> Architecture:
        arch = self.get_architecture(architecture_id)
        for key, val in data.items():
            if val is not None and hasattr(arch, key):
                setattr(arch, key, val)
        arch.updated_at = datetime.now(timezone.utc)
        db.architectures[arch.id] = arch
        return arch

    def delete_architecture(self, architecture_id: str) -> None:
        arch = self.get_architecture(architecture_id)
        del db.architectures[architecture_id]

    # -----------------------------------------------------------------------
    # Specifications CRUD
    # -----------------------------------------------------------------------
    def list_specifications(
        self,
        category: str | None = None,
        status: EntityLifecycleStatus | str | None = None,
        search: str | None = None,
    ) -> list[Specification]:
        specs = list(db.specifications.values())
        if category:
            specs = [s for s in specs if s.category.lower() == category.lower()]
        if status:
            st_val = status.value if hasattr(status, "value") else str(status)
            specs = [
                s for s in specs
                if (s.status.value if hasattr(s.status, "value") else str(s.status)).lower() == st_val.lower()
            ]
        if search:
            q = search.lower()
            specs = [
                s for s in specs
                if q in s.name.lower()
                or q in s.description.lower()
                or q in (s.content or "").lower()
                or any(q in t.lower() for t in (s.tags or []))
            ]
        return sorted(specs, key=lambda x: x.name)

    def get_specification(self, spec_id: str) -> Specification:
        spec = db.specifications.get(spec_id)
        if not spec:
            raise NotFoundError(f"Especificação '{spec_id}' não encontrada.", code="SPECIFICATION_NOT_FOUND")
        return spec

    def create_specification(
        self,
        name: str,
        description: str,
        category: str = "Frontend Specification",
        content: str = "",
        tags: list[str] | None = None,
        related_components: list[str] | None = None,
        related_rules: list[str] | None = None,
        related_templates: list[str] | None = None,
        related_architectures: list[str] | None = None,
        version: str = "1.0.0",
        status: EntityLifecycleStatus = EntityLifecycleStatus.PUBLISHED,
    ) -> Specification:
        spec_id = f"spec-{name.lower().replace(' ', '-')}"
        spec = Specification(
            id=spec_id,
            name=name,
            description=description,
            category=category,
            content=content,
            tags=tags or [],
            related_components=related_components or [],
            related_rules=related_rules or [],
            related_templates=related_templates or [],
            related_architectures=related_architectures or [],
            version=version,
            status=status,
        )
        db.specifications[spec.id] = spec
        self.audit.log(action=AuditAction.SPECIFICATION_CREATED, resource="Specification", resource_id=spec.id)
        return spec

    def update_specification(self, spec_id: str, data: dict[str, Any]) -> Specification:
        spec = self.get_specification(spec_id)
        for key, val in data.items():
            if val is not None and hasattr(spec, key):
                setattr(spec, key, val)
        spec.updated_at = datetime.now(timezone.utc)
        db.specifications[spec.id] = spec
        return spec

    def delete_specification(self, spec_id: str) -> None:
        spec = self.get_specification(spec_id)
        del db.specifications[spec_id]

    # -----------------------------------------------------------------------
    # Interactive Blueprint Workshop Builder
    # -----------------------------------------------------------------------
    def build_custom_blueprint(
        self,
        name: str,
        description: str = "",
        architecture_id: str = "arch_loft_standard_fullstack",
        module_ids: list[str] | None = None,
        component_ids: list[str] | None = None,
        template_ids: list[str] | None = None,
        project_id: str | None = None,
    ) -> Blueprint:
        arch = db.architectures.get(architecture_id) or (list(db.architectures.values())[0] if db.architectures else None)
        arch_name = arch.name if arch else "Loft Standard Fullstack (Vite React 19 + FastAPI / SQLite)"

        selected_modules = set(module_ids or [])
        selected_components = set(component_ids or [])
        selected_templates = set(template_ids or [])
        resolved_rules = set([r_id for r_id, r in db.rules.items() if r.priority in ["CRITICAL", "HIGH"]])
        resolved_specs = set(list(db.specifications.keys())[:3])
        resolved_deps = set(["FastAPI>=0.115.0", "Pydantic>=2.8.0", "SQLAlchemy>=2.0.0", "React>=19.0.0", "@loft/react-loft", "@loft/tokens-loft", "@loft/react-icons"])

        # Expand from templates
        for t_id in selected_templates:
            tpl = db.templates.get(t_id)
            if tpl:
                selected_modules.update(tpl.modules)
                selected_components.update(tpl.components)
                resolved_rules.update(tpl.rules)

        # Expand from modules
        for m_id in selected_modules:
            mod = db.modules.get(m_id)
            if mod:
                selected_components.update(mod.components)
                resolved_rules.update(mod.rules)
                resolved_specs.update(mod.specifications)
                selected_modules.update(mod.dependencies)

        # Expand dependencies from components
        for c_id in selected_components:
            comp = db.components.get(c_id)
            if comp:
                resolved_deps.update(comp.dependencies)

        folder_structure = f"""{name.lower().replace(' ', '-')}/
├── backend/
│   ├── app/core/ (security, config, logging)
│   ├── app/api/v1/ ({', '.join(sorted(selected_modules)) or 'routers'})
│   └── app/services/
└── frontend/ (Loft Copan Standard)
    ├── src/components/ ({', '.join(sorted(selected_components)) or 'Copan UI'})
    └── src/pages/"""

        bp = Blueprint(
            name=name,
            description=description,
            project_id=project_id,
            architecture_id=architecture_id,
            architecture_name=arch_name,
            modules=sorted(list(selected_modules)),
            components=sorted(list(selected_components)),
            templates=sorted(list(selected_templates)),
            rules=sorted(list(resolved_rules)),
            specifications=sorted(list(resolved_specs)),
            dependencies=sorted(list(resolved_deps)),
            folder_structure=folder_structure,
        )

        db.blueprints[bp.id] = bp

        # Attach to project if provided
        if project_id and project_id in db.projects:
            prj = db.projects[project_id]
            prj.blueprint_id = bp.id
            prj.updated_at = datetime.now(timezone.utc)

        self.audit.log(
            action=AuditAction.BLUEPRINT_CREATED,
            resource="Blueprint",
            resource_id=bp.id,
            metadata={"name": bp.name, "modules_count": len(bp.modules)},
        )
        return bp
