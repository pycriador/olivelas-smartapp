"""
Global Search Service (Command Palette Engine)
Searches across Projects, Blueprints, Components, Templates, Modules, Rules, Architectures, and Specs
"""
from __future__ import annotations
from pydantic import BaseModel, Field
from app.storage.database import db


class SearchResultItem(BaseModel):
    id: str
    type: str  # Project, Blueprint, Component, Template, Module, Rule, Architecture, Specification
    name: str
    description: str
    tags: list[str] = Field(default_factory=list)
    url_hint: str = ""


class GlobalSearchService:
    def search(self, query: str, limit: int = 20) -> list[SearchResultItem]:
        results: list[SearchResultItem] = []
        q = query.strip().lower()
        if not q:
            return results

        # 1. Projects
        for p in db.projects.values():
            if q in p.name.lower() or q in p.description.lower() or any(q in t.lower() for t in p.tags):
                results.append(
                    SearchResultItem(
                        id=p.id,
                        type="Project",
                        name=p.name,
                        description=p.description,
                        tags=p.tags,
                        url_hint=f"/projects?id={p.id}",
                    )
                )

        # 2. Blueprints
        for bp in db.blueprints.values():
            if q in bp.name.lower() or q in bp.description.lower() or any(q in f.lower() for f in bp.features):
                results.append(
                    SearchResultItem(
                        id=bp.id,
                        type="Blueprint",
                        name=bp.name,
                        description=bp.description,
                        tags=bp.features,
                        url_hint=f"/blueprints?id={bp.id}",
                    )
                )

        # 3. Components
        for c in db.components.values():
            if q in c.name.lower() or q in c.description.lower() or any(q in t.lower() for t in c.tags):
                results.append(
                    SearchResultItem(
                        id=c.id,
                        type="Component",
                        name=c.name,
                        description=c.description,
                        tags=c.tags,
                        url_hint=f"/catalog/components?id={c.id}",
                    )
                )

        # 4. Templates
        for t in db.templates.values():
            if q in t.name.lower() or q in t.description.lower() or q in t.category.lower():
                results.append(
                    SearchResultItem(
                        id=t.id,
                        type="Template",
                        name=t.name,
                        description=t.description,
                        tags=[t.category, t.architecture],
                        url_hint=f"/catalog/templates?id={t.id}",
                    )
                )

        # 5. Modules
        for m in db.modules.values():
            if q in m.name.lower() or q in m.description.lower():
                results.append(
                    SearchResultItem(
                        id=m.id,
                        type="Module",
                        name=m.name,
                        description=m.description,
                        tags=m.apis,
                        url_hint=f"/catalog/modules?id={m.id}",
                    )
                )

        # 6. Rules
        for r in db.rules.values():
            if q in r.name.lower() or q in r.description.lower() or q in r.category.value.lower():
                results.append(
                    SearchResultItem(
                        id=r.id,
                        type="Rule",
                        name=r.name,
                        description=r.description,
                        tags=[r.category.value, r.priority.value],
                        url_hint=f"/knowledge/rules?id={r.id}",
                    )
                )

        # 7. Architectures
        for a in db.architectures.values():
            if q in a.name.lower() or q in a.description.lower():
                results.append(
                    SearchResultItem(
                        id=a.id,
                        type="Architecture",
                        name=a.name,
                        description=a.description,
                        tags=a.characteristics[:2],
                        url_hint=f"/knowledge/architectures?id={a.id}",
                    )
                )

        # 8. Specifications
        for s in db.specifications.values():
            if q in s.name.lower() or q in s.description.lower() or any(q in t.lower() for t in s.tags):
                results.append(
                    SearchResultItem(
                        id=s.id,
                        type="Specification",
                        name=s.name,
                        description=s.description,
                        tags=s.tags,
                        url_hint=f"/knowledge/specifications?id={s.id}",
                    )
                )

        return results[:limit]
