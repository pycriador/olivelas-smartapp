"""
Template Engine Service
Renders and provides structured code templates
"""
from __future__ import annotations
from app.core.errors import NotFoundError, ValidationError
from app.domain.models import ComponentLayer, CodeTemplate
from app.schemas.templates import (
    TemplateSummaryResponse,
    TemplateDetailResponse,
    TemplateRenderResponse,
)
from app.storage.seed_data import SEED_TEMPLATES


class TemplateService:
    def __init__(self, templates: list[CodeTemplate] | None = None) -> None:
        self._templates = {t.id: t for t in (templates or SEED_TEMPLATES)}

    def list_templates(self, layer: ComponentLayer | None = None, category: str | None = None) -> list[TemplateSummaryResponse]:
        templates = list(self._templates.values())
        if layer:
            templates = [t for t in templates if t.layer == layer]
        if category:
            templates = [t for t in templates if t.category == category]

        return [
            TemplateSummaryResponse(
                id=t.id,
                name=t.name,
                category=t.category,
                layer=t.layer,
                description=t.description,
                parameters=t.parameters,
            )
            for t in templates
        ]

    def get_template_by_id(self, template_id: str) -> TemplateDetailResponse:
        tpl = self._templates.get(template_id)
        if not tpl:
            raise NotFoundError(f"Template '{template_id}' not found.", code="TEMPLATE_NOT_FOUND")

        return TemplateDetailResponse(
            id=tpl.id,
            name=tpl.name,
            category=tpl.category,
            layer=tpl.layer,
            description=tpl.description,
            parameters=tpl.parameters,
            target_path_template=tpl.target_path_template,
            content=tpl.content,
        )

    def render_template(self, template_id: str, variables: dict[str, str]) -> TemplateRenderResponse:
        tpl = self._templates.get(template_id)
        if not tpl:
            raise NotFoundError(f"Template '{template_id}' not found.", code="TEMPLATE_NOT_FOUND")

        missing_params = [p for p in tpl.parameters if p not in variables]
        if missing_params:
            raise ValidationError(
                f"Missing required template parameters: {', '.join(missing_params)}",
                code="MISSING_TEMPLATE_PARAMS",
                details={"missing": missing_params},
            )

        rendered_path = tpl.target_path_template
        rendered_content = tpl.content

        for key, val in variables.items():
            rendered_path = rendered_path.replace(f"{{{key}}}", val)
            rendered_content = rendered_content.replace(f"{{{key}}}", val)

        return TemplateRenderResponse(
            template_id=tpl.id,
            rendered_target_path=rendered_path,
            rendered_content=rendered_content,
        )
