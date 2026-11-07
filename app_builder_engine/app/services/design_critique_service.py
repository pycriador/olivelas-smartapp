"""
Design Critique Service
Deterministic, pattern-based static analysis of frontend source files against the
"craft floor" quality bar (contrast, banned AI-pattern defaults, browser-surface theming,
accessibility basics). This is a mechanical lint, not a rendered/visual review — it cannot
see layout, real contrast ratios, or animation behavior. It exists to catch the cheap,
text-pattern-detectable failures before a human (or a slower visual pass) looks at the result.
"""
from __future__ import annotations
import re
from typing import Any

from app.domain.entities import BlueprintValidationDiagnostic, ValidationSeverity, RecommendedAction

HEX_COLOR_PATTERN = re.compile(r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b")
RGB_COLOR_PATTERN = re.compile(r"\brgba?\s*\([^)]+\)")
# Covers both CSS/styled-components ("background-clip: text") and JSX inline-style
# camelCase ("backgroundClip: 'text'") — React source ships plenty of both.
GRADIENT_TEXT_PATTERN = re.compile(r"(?:background-clip|backgroundClip|-webkit-background-clip|WebkitBackgroundClip)\s*[:=]\s*['\"]?text\b", re.IGNORECASE)
HARD_OFFSET_SHADOW_PATTERN = re.compile(r"(?:box-shadow|boxShadow)\s*[:=]\s*['\"]?-?\d+px\s+-?\d+px\s+0(?:px)?\b")
SYSTEM_DISPLAY_FONT_PATTERN = re.compile(r"(?:font-family|fontFamily)\s*[:=]\s*['\"]?(Impact|Arial\s*Black)['\"]?", re.IGNORECASE)
EMOJI_PATTERN = re.compile(
    "["
    "\U0001F300-\U0001FAFF"
    "\U00002600-\U000027BF"
    "\U0001F1E6-\U0001F1FF"
    "]"
)
ICON_ONLY_BUTTON_PATTERN = re.compile(r"<ActionButton\b(?![^>]*aria-label)[^>]*>")
IMAGE_NO_ALT_PATTERN = re.compile(r"<(?:Image|img)\b(?![^>]*\balt=)[^>]*/?>")
EYEBROW_CLASS_PATTERN = re.compile(r"class(?:Name)?=[\"'][^\"']*\b(eyebrow|kicker)\b[^\"']*[\"']", re.IGNORECASE)
SECTION_NUMBER_PATTERN = re.compile(r">\s*0[1-9]\s*<")
UNICODE_SCROLLBAR_HINT = re.compile(r"::-webkit-scrollbar|scrollbar-color")
REDUCED_MOTION_HINT = re.compile(r"prefers-reduced-motion")
ANIMATION_HINT = re.compile(r"@keyframes|\btransition\s*:|\banimation\s*:")

CHECKS_PERFORMED = [
    "hardcoded_hex_rgb_color",
    "gradient_text_banned",
    "hard_offset_shadow_banned",
    "system_display_font_banned",
    "emoji_as_icon_heuristic",
    "icon_only_button_missing_aria_label",
    "image_missing_alt",
    "eyebrow_kicker_class_banned",
    "section_number_marker_heuristic",
    "motion_without_reduced_motion_guard",
]


def _add(
    diagnostics: list[BlueprintValidationDiagnostic],
    *,
    code: str,
    severity: ValidationSeverity,
    message: str,
    resource_id: str,
    action_label: str | None = None,
    action_description: str | None = None,
) -> None:
    diagnostics.append(
        BlueprintValidationDiagnostic(
            code=code,
            severity=severity,
            category="DESIGN_QUALITY",
            message=message,
            resource_id=resource_id,
            resource_type="source_file",
            recommended_action=(
                RecommendedAction(
                    action_type="FIX_SOURCE",
                    label=action_label or "Corrigir no código-fonte",
                    description=action_description or "",
                )
                if action_label
                else None
            ),
        )
    )


def critique_source_files(source_files: dict[str, Any]) -> dict[str, Any]:
    """
    Runs every deterministic check in CHECKS_PERFORMED against each (path -> content) pair.
    Returns a dict shaped like BlueprintValidationResult's diagnostics list, plus which
    checks ran, so callers never mistake "no findings" for "every quality axis was checked" —
    axes this lint cannot see (real contrast ratio, actual spacing rhythm, motion timing,
    whether a modal was truly unnecessary) are named explicitly as out of scope.
    """
    diagnostics: list[BlueprintValidationDiagnostic] = []

    project_wide_has_motion = False
    project_wide_has_reduced_motion_guard = False

    for path, content in source_files.items():
        if not isinstance(content, str):
            continue

        for match in HEX_COLOR_PATTERN.findall(content):
            _add(
                diagnostics,
                code="HARDCODED_COLOR",
                severity=ValidationSeverity.WARNING,
                message=f"Cor hexadecimal hardcoded '{match}' em {path} — usar um token de `@loft/tokens-loft` (`color.*`) em vez de hex/rgb literal.",
                resource_id=path,
                action_label="Substituir por token Copan",
                action_description="Mapear o hex para o token color.* mais próximo em @loft/tokens-loft.",
            )

        if RGB_COLOR_PATTERN.search(content):
            _add(
                diagnostics,
                code="HARDCODED_COLOR_RGB",
                severity=ValidationSeverity.WARNING,
                message=f"Valor rgb()/rgba() literal em {path} — usar tokens de cor do Copan em vez de canais RGB hardcoded.",
                resource_id=path,
            )

        if GRADIENT_TEXT_PATTERN.search(content):
            _add(
                diagnostics,
                code="GRADIENT_TEXT_BANNED",
                severity=ValidationSeverity.WARNING,
                message=f"Texto em gradiente (background-clip: text) detectado em {path} — ênfase vem de peso/tamanho da tipografia, não de gradiente.",
                resource_id=path,
            )

        if HARD_OFFSET_SHADOW_PATTERN.search(content):
            _add(
                diagnostics,
                code="HARD_OFFSET_SHADOW_BANNED",
                severity=ValidationSeverity.INFO,
                message=f"Sombra com offset duro e blur zero em {path} (ex.: '4px 4px 0') — é um traço de um mundo neobrutalista específico, não um default; confirmar que foi uma escolha deliberada.",
                resource_id=path,
            )

        if SYSTEM_DISPLAY_FONT_PATTERN.search(content):
            _add(
                diagnostics,
                code="SYSTEM_DISPLAY_FONT_BANNED",
                severity=ValidationSeverity.WARNING,
                message=f"Fonte de sistema (Impact/Arial Black) usada como voz de display em {path} — usar a tipografia real do Copan (`Typography textStyle='hero'/'h1'`), nunca a fonte de sistema mais próxima como atalho.",
                resource_id=path,
            )

        if EMOJI_PATTERN.search(content):
            _add(
                diagnostics,
                code="EMOJI_AS_ICON_HEURISTIC",
                severity=ValidationSeverity.INFO,
                message=f"Emoji detectado em {path} — se estiver substituindo um ícone de interface, usar um ícone real de '@loft/react-icons' em vez de glifo Unicode/emoji (conteúdo textual legítimo, como bandeiras de idioma, não conta).",
                resource_id=path,
            )

        for _ in ICON_ONLY_BUTTON_PATTERN.findall(content):
            _add(
                diagnostics,
                code="ICON_BUTTON_MISSING_ARIA_LABEL",
                severity=ValidationSeverity.CRITICAL,
                message=f"<ActionButton> sem 'aria-label' em {path} — é obrigatório em botões somente-ícone do Copan.",
                resource_id=path,
                action_label="Adicionar aria-label",
                action_description="Toda instância de ActionButton precisa de aria-label descrevendo a ação.",
            )

        for _ in IMAGE_NO_ALT_PATTERN.findall(content):
            _add(
                diagnostics,
                code="IMAGE_MISSING_ALT",
                severity=ValidationSeverity.WARNING,
                message=f"<Image>/<img> sem 'alt' em {path}.",
                resource_id=path,
            )

        if EYEBROW_CLASS_PATTERN.search(content):
            _add(
                diagnostics,
                code="EYEBROW_KICKER_BANNED",
                severity=ValidationSeverity.WARNING,
                message=f"Padrão de 'kicker'/'eyebrow' acima de um heading detectado em {path} — é um ban, não um default: o heading já carrega o peso; remover o rótulo.",
                resource_id=path,
            )

        if len(SECTION_NUMBER_PATTERN.findall(content)) >= 2:
            _add(
                diagnostics,
                code="SECTION_NUMBER_MARKER_HEURISTIC",
                severity=ValidationSeverity.INFO,
                message=f"Possíveis marcadores numéricos decorativos (01/02/03) em {path} — só se justificam quando a ordem em si carrega informação (um processo real, uma linha do tempo); confirmar antes de manter.",
                resource_id=path,
            )

        if ANIMATION_HINT.search(content):
            project_wide_has_motion = True
        if REDUCED_MOTION_HINT.search(content):
            project_wide_has_reduced_motion_guard = True

    if project_wide_has_motion and not project_wide_has_reduced_motion_guard:
        _add(
            diagnostics,
            code="MOTION_WITHOUT_REDUCED_MOTION_GUARD",
            severity=ValidationSeverity.WARNING,
            message="Animações/transições foram encontradas nos arquivos enviados, mas nenhum deles referencia 'prefers-reduced-motion' — todo projeto com movimento autoral deve respeitar essa preferência.",
            resource_id="(projeto)",
        )

    return {
        "status": "clean" if not diagnostics else "findings",
        "finding_count": len(diagnostics),
        "diagnostics": diagnostics,
        "checks_performed": CHECKS_PERFORMED,
        "out_of_scope": [
            "Razão de contraste real (requer renderização; isso só sinaliza hex hardcoded, não calcula contraste)",
            "Ritmo de espaçamento real (mais espaço acima do heading que abaixo)",
            "Qualidade/timing de uma animação autoral específica",
            "Se um modal era de fato desnecessário para a tarefa",
            "Cards do mesmo tamanho como estrutura de página (padrão estrutural, não detectável por regex)",
            "Escolha de tema claro/escuro pela cena de uso real",
        ],
        "note": (
            "Lint determinístico baseado em padrões de texto (craft-floor do Impeccable) — "
            "não é uma crítica visual renderizada. Zero achados não significa qualidade visual "
            "garantida, só que nenhum dos padrões mecanicamente detectáveis acima apareceu."
        ),
    }
