"""
Architecture Pattern Service
Provides architectural blueprints and constraints
"""
from __future__ import annotations
from app.core.errors import NotFoundError
from app.domain.models import ArchitecturePattern
from app.schemas.architectures import ArchitectureResponse
from app.storage.seed_data import SEED_ARCHITECTURES


class ArchitectureService:
    def __init__(self, architectures: list[ArchitecturePattern] | None = None) -> None:
        self._architectures = {a.id: a for a in (architectures or SEED_ARCHITECTURES)}

    def list_architectures(self) -> list[ArchitectureResponse]:
        return [
            ArchitectureResponse(
                id=a.id,
                name=a.name,
                description=a.description,
                folder_structure=a.folder_structure,
                core_layers=a.core_layers,
                data_flow=a.data_flow,
                best_for=a.best_for,
                constraints=a.constraints,
            )
            for a in self._architectures.values()
        ]

    def get_architecture_by_id(self, arch_id: str) -> ArchitectureResponse:
        arch = self._architectures.get(arch_id)
        if not arch:
            raise NotFoundError(f"Architecture pattern '{arch_id}' not found.", code="ARCH_NOT_FOUND")

        return ArchitectureResponse(
            id=arch.id,
            name=arch.name,
            description=arch.description,
            folder_structure=arch.folder_structure,
            core_layers=arch.core_layers,
            data_flow=arch.data_flow,
            best_for=arch.best_for,
            constraints=arch.constraints,
        )
