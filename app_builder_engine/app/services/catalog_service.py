"""
Component Catalog Service
Manages frontend and backend reusable component specs
"""
from __future__ import annotations
from app.core.errors import NotFoundError
from app.domain.models import ComponentLayer, ComponentCategory, LoftComponent
from app.schemas.components import ComponentSummaryResponse, ComponentDetailResponse
from app.storage.seed_data import SEED_COMPONENTS


class CatalogService:
    def __init__(self, components: list[LoftComponent] | None = None) -> None:
        self._components = {c.id: c for c in (components or SEED_COMPONENTS)}

    def list_components(
        self,
        layer: ComponentLayer | None = None,
        category: ComponentCategory | None = None,
        search: str | None = None,
    ) -> list[ComponentSummaryResponse]:
        results = list(self._components.values())

        if layer:
            results = [c for c in results if c.layer == layer]
        if category:
            results = [c for c in results if c.category == category]
        if search:
            s = search.lower()
            results = [c for c in results if s in c.name.lower() or s in c.description.lower()]

        return [
            ComponentSummaryResponse(
                id=c.id,
                name=c.name,
                layer=c.layer,
                category=c.category,
                description=c.description,
                dependencies=c.dependencies,
            )
            for c in results
        ]

    def get_component_by_id(self, component_id: str) -> ComponentDetailResponse:
        comp = self._components.get(component_id)
        if not comp:
            raise NotFoundError(f"Component with ID '{component_id}' not found in catalog.", code="COMPONENT_NOT_FOUND")

        return ComponentDetailResponse(
            id=comp.id,
            name=comp.name,
            layer=comp.layer,
            category=comp.category,
            description=comp.description,
            dependencies=comp.dependencies,
            responsibilities=comp.responsibilities,
            allowed_imports=comp.allowed_imports,
            forbidden_imports=comp.forbidden_imports,
            interface_spec=comp.interface_spec,
            example_usage=comp.example_usage,
            rules_of_use=comp.rules_of_use,
        )
