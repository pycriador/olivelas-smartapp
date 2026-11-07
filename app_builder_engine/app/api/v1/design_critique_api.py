"""
Design Critique Router
Deterministic static-analysis pass over frontend source files against the "craft floor"
quality bar (Impeccable skill) — banned AI-pattern defaults, accessibility basics, hardcoded
design values. See app/services/design_critique_service.py for what is and is not covered.
"""
from __future__ import annotations
from typing import Any
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.domain.entities import ApiResponse, BlueprintValidationDiagnostic
from app.services.design_critique_service import critique_source_files
from app.api.v1.iam_api import get_current_user_claims

router = APIRouter(prefix="/design", tags=["Design Critique"])


class DesignCritiqueRequest(BaseModel):
    source_files: dict[str, str] = Field(
        ...,
        description="Mapa de caminho de arquivo -> conteúdo (TSX/CSS) a ser analisado.",
    )
    mode: str | None = Field(
        default=None,
        description="Modo da superfície (Persuade/Operate/Read/Experience) — informativo; os checks de hoje são os mesmos em todos os modos.",
    )


class DesignCritiqueResult(BaseModel):
    status: str
    finding_count: int
    diagnostics: list[BlueprintValidationDiagnostic]
    checks_performed: list[str]
    out_of_scope: list[str]
    note: str


@router.post(
    "/critique",
    response_model=ApiResponse[DesignCritiqueResult],
    summary="Critica estática determinística de qualidade visual (craft floor)",
    description=(
        "Executa checks de padrão de texto contra os arquivos de frontend enviados: cores hex/rgb "
        "hardcoded, texto em gradiente, sombra com offset duro, fonte de sistema como voz de display, "
        "emoji no lugar de ícone, ActionButton sem aria-label, imagem sem alt, padrão de "
        "kicker/eyebrow, marcadores numéricos decorativos, e animação sem guarda de "
        "prefers-reduced-motion. É um lint mecânico (craft-floor do Impeccable) — não uma "
        "renderização visual; o campo `out_of_scope` da resposta lista o que ele não vê."
    ),
)
async def critique_design(
    body: DesignCritiqueRequest,
    claims: dict[str, Any] = Depends(get_current_user_claims),
):
    result = critique_source_files(body.source_files)
    return ApiResponse(data=DesignCritiqueResult(**result))
