"""
Blueprint Validation Service — Deterministic Architecture & Dependency Resolution Engine
Implements dependency graph resolution, rule enforcement, architecture compatibility,
and actionable diagnostic generation with severity categorization.
"""
from __future__ import annotations
from typing import Any
from app.domain.entities import (
    Blueprint,
    BlueprintValidationResult,
    BlueprintValidationDiagnostic,
    ValidationSeverity,
    RecommendedAction,
    EntityLifecycleStatus,
)
from app.storage.database import db


class BlueprintValidationService:
    def resolve_dependencies(
        self,
        architecture_id: str,
        module_ids: list[str],
        component_ids: list[str],
        template_ids: list[str] = [],
    ) -> dict[str, Any]:
        """
        Determines all direct and transitive dependencies for selected building blocks.
        """
        resolved_components = set(component_ids)
        resolved_modules = set(module_ids)
        resolved_rules = set()
        resolved_specs = set()
        missing_dependencies = []

        # 1. Resolve templates first so their modules are included in module resolution
        resolved_pkg_deps: set[str] = {
            "FastAPI>=0.115.0", "Pydantic>=2.8.0", "React>=19.0.0",
            "@loft/react-loft", "@loft/tokens-loft", "@loft/react-icons",
        }
        for t_id in template_ids:
            tpl = db.templates.get(t_id)
            if not tpl:
                continue
            for comp_id in tpl.components:
                resolved_components.add(comp_id)
            for mod_id in tpl.modules:
                if mod_id in db.modules:
                    resolved_modules.add(mod_id)
            for r_id in tpl.rules:
                resolved_rules.add(r_id)
            for s_id in tpl.specifications:
                resolved_specs.add(s_id)

        # 2. Resolve modules (including transitive module dependencies)
        visited_mods: set[str] = set()
        queue = list(resolved_modules)
        while queue:
            m_id = queue.pop(0)
            if m_id in visited_mods:
                continue
            visited_mods.add(m_id)
            mod = db.modules.get(m_id)
            if not mod:
                continue
            for comp_id in mod.components:
                resolved_components.add(comp_id)
            for r_id in mod.rules:
                resolved_rules.add(r_id)
            for s_id in mod.specifications:
                resolved_specs.add(s_id)
            for req_mod_id in mod.dependencies:
                if req_mod_id in db.modules:
                    if req_mod_id not in resolved_modules:
                        resolved_modules.add(req_mod_id)
                        queue.append(req_mod_id)
                        missing_dependencies.append({
                            "source": mod.name,
                            "source_id": mod.id,
                            "required_id": req_mod_id,
                            "type": "module",
                        })
                else:
                    resolved_pkg_deps.add(req_mod_id)

        # 3. Resolve components and package dependencies
        for c_id in list(resolved_components):
            comp = db.components.get(c_id)
            if not comp:
                continue
            for r_id in comp.rules:
                resolved_rules.add(r_id)
            for s_id in comp.specifications:
                resolved_specs.add(s_id)
            for dep in comp.dependencies:
                resolved_pkg_deps.add(dep)

        # 4. Resolve architecture
        arch = db.architectures.get(architecture_id) or (
            db.architectures.get("arch_loft_standard_fullstack") if architecture_id == "arch-modular-monolith" else None
        )
        if arch:
            for r_id in arch.rules:
                resolved_rules.add(r_id)
            for s_id in arch.specifications:
                resolved_specs.add(s_id)

        return {
            "resolved_components": sorted(list(resolved_components)),
            "resolved_modules": sorted(list(resolved_modules)),
            "resolved_rules": sorted(list(resolved_rules)),
            "resolved_specifications": sorted(list(resolved_specs)),
            "resolved_dependencies": sorted(list(resolved_pkg_deps)),
            "missing_dependencies": missing_dependencies,
        }

    def validate_blueprint_configuration(
        self,
        architecture_id: str,
        module_ids: list[str],
        component_ids: list[str],
        template_ids: list[str] = [],
        rule_ids: list[str] = [],
        specification_ids: list[str] = [],
        ui_library: str | None = None,
        dependencies: list[str] | dict[str, Any] | None = None,
        package_json: dict[str, Any] | None = None,
        source_files: dict[str, str] | None = None,
    ) -> BlueprintValidationResult:
        """
        Validates all dimensions of a blueprint configuration and returns categorized diagnostics.
        Distinguishes declarative manifest consistency ('declarative_manifest') from static code/dependency
        conformance inspection ('code_and_manifest_audited').
        """
        import re

        diagnostics: list[BlueprintValidationDiagnostic] = []

        # Normalize UI library & external artifacts for conformance inspection
        normalized_deps: list[str] = []
        if isinstance(dependencies, list):
            normalized_deps.extend(str(d).lower() for d in dependencies)
        elif isinstance(dependencies, dict):
            normalized_deps.extend(f"{k.lower()}@{v}" for k, v in dependencies.items())

        if isinstance(package_json, dict):
            for section in ("dependencies", "devDependencies", "peerDependencies"):
                sec_data = package_json.get(section)
                if isinstance(sec_data, dict):
                    normalized_deps.extend(str(k).lower() for k in sec_data.keys())

        detected_ui_lib = (ui_library or "").strip().lower()
        if not detected_ui_lib:
            if any("antd" in d or "@ant-design" in d for d in normalized_deps) and not any("copan" in d for d in normalized_deps):
                detected_ui_lib = "antd"
            elif any("@mui" in d for d in normalized_deps):
                detected_ui_lib = "mui"
            elif any("chakra" in d for d in normalized_deps):
                detected_ui_lib = "chakra"

        # 1. Architecture Existence & Compatibility Check
        arch = db.architectures.get(architecture_id) or (
            db.architectures.get("arch_loft_standard_fullstack") if architecture_id == "arch-modular-monolith" else None
        )
        if not arch:
            diagnostics.append(
                BlueprintValidationDiagnostic(
                    code="ARCH_NOT_FOUND",
                    severity=ValidationSeverity.CRITICAL,
                    category="ARCHITECTURE",
                    message=f"A arquitetura '{architecture_id}' não existe no catálogo.",
                    resource_id=architecture_id,
                    recommended_action=RecommendedAction(
                        action_type="SELECT_ARCHITECTURE",
                        label="Selecionar Arquitetura Válida",
                        payload={"architecture_id": "arch_loft_postgres_opsbase_fullstack"},
                    ),
                )
            )

        # 2. Module Dependencies Check
        selected_mod_set = set(module_ids)
        for m_id in module_ids:
            mod = db.modules.get(m_id)
            if not mod:
                diagnostics.append(
                    BlueprintValidationDiagnostic(
                        code="MODULE_NOT_FOUND",
                        severity=ValidationSeverity.ERROR,
                        category="DEPENDENCY",
                        message=f"Módulo de domínio '{m_id}' não encontrado no catálogo.",
                        resource_id=m_id,
                    )
                )
                continue

            # Check required inter-module dependencies (only for actual domain modules in catalog)
            for dep_id in mod.dependencies:
                if dep_id in db.modules and dep_id not in selected_mod_set:
                    target_mod = db.modules.get(dep_id)
                    target_name = target_mod.name if target_mod else dep_id
                    diagnostics.append(
                        BlueprintValidationDiagnostic(
                            code="MISSING_MODULE_DEPENDENCY",
                            severity=ValidationSeverity.ERROR,
                            category="DEPENDENCY",
                            message=f"O módulo '{mod.name}' depende do módulo '{target_name}'.",
                            resource_id=mod.id,
                            resource_type="module",
                            recommended_action=RecommendedAction(
                                action_type="ADD_DEPENDENCY",
                                label=f"Adicionar Módulo {target_name}",
                                description=f"Vincular '{target_name}' para satisfazer requisitos de '{mod.name}'",
                                payload={"resource_id": dep_id, "type": "module"},
                            ),
                        )
                    )

        # 3. Component Dependencies & Lifecycle Check
        for c_id in component_ids:
            comp = db.components.get(c_id)
            if not comp:
                diagnostics.append(
                    BlueprintValidationDiagnostic(
                        code="COMPONENT_NOT_FOUND",
                        severity=ValidationSeverity.ERROR,
                        category="DEPENDENCY",
                        message=f"Componente '{c_id}' não encontrado no catálogo.",
                        resource_id=c_id,
                    )
                )
                continue

            # Check status lifecycle
            if comp.status == EntityLifecycleStatus.DEPRECATED:
                diagnostics.append(
                    BlueprintValidationDiagnostic(
                        code="DEPRECATED_COMPONENT_USED",
                        severity=ValidationSeverity.WARNING,
                        category="VERSION",
                        message=f"O componente '{comp.name}' está marcado como DEPRECATED e não é recomendado para novas aplicações.",
                        resource_id=comp.id,
                        resource_type="component",
                        recommended_action=RecommendedAction(
                            action_type="REPLACE_COMPONENT",
                            label=f"Substituir {comp.name}",
                            description="Verifique a documentação para o componente substituto homologado.",
                        ),
                    )
                )
            elif comp.status == EntityLifecycleStatus.DRAFT:
                diagnostics.append(
                    BlueprintValidationDiagnostic(
                        code="DRAFT_COMPONENT_USED",
                        severity=ValidationSeverity.INFO,
                        category="VERSION",
                        message=f"O componente '{comp.name}' está em estágio DRAFT (não homologado).",
                        resource_id=comp.id,
                    )
                )

        # 4. Mandatory Golden Rules & Copan Conformance Check
        active_rules = set(rule_ids)
        if not active_rules:
            if arch and arch.rules:
                active_rules.update(arch.rules)
            for m_id in module_ids:
                m_obj = db.modules.get(m_id)
                if m_obj and m_obj.rules:
                    active_rules.update(m_obj.rules)
            for t_id in template_ids:
                t_obj = db.templates.get(t_id)
                if t_obj and t_obj.rules:
                    active_rules.update(t_obj.rules)
            for c_id in component_ids:
                c_obj = db.components.get(c_id)
                if c_obj and c_obj.rules:
                    active_rules.update(c_obj.rules)

        def _is_copan_ui_rule(r_id: str) -> bool:
            rl = r_id.lower()
            return "copan" in rl or "brand_orange" in rl or "tokens_only" in rl

        has_explicit_non_copan_ui = bool(
            detected_ui_lib and detected_ui_lib not in ("copan", "@loft/copan", "loft-copan", "custom", "default", "none")
        )

        # Check architecture required rules. Copan UI rules are CRITICAL unconditionally —
        # declaring a different 'ui_library' no longer downgrades them, since Copan is
        # mandatory for every Loft standard application (rul_copan_07), not an optional style.
        if arch and arch.rules:
            for req_r in arch.rules:
                if req_r not in active_rules and req_r in db.rules:
                    rule_obj = db.rules.get(req_r)
                    rule_name = rule_obj.name if rule_obj else req_r
                    diagnostics.append(
                        BlueprintValidationDiagnostic(
                            code="MISSING_ARCH_MANDATORY_RULE",
                            severity=ValidationSeverity.CRITICAL,
                            category="RULE",
                            message=(
                                f"A arquitetura '{arch.name}' exige a Golden Rule '{rule_name}' ({req_r}). "
                                + (
                                    f"O projeto declarou 'ui_library={detected_ui_lib}', mas o Copan ('@loft/react-loft') "
                                    "é obrigatório para toda aplicação padrão Loft — não há exceção por biblioteca declarada."
                                    if _is_copan_ui_rule(req_r) and has_explicit_non_copan_ui
                                    else ""
                                )
                            ).strip(),
                            resource_id=req_r,
                            resource_type="rule",
                            recommended_action=RecommendedAction(
                                action_type="ATTACH_RULE",
                                label=f"Vincular Regra {rule_name}",
                                description=f"Ativa a regra mandatória da arquitetura {arch.name}.",
                                payload={"resource_id": req_r, "type": "rule"},
                            ),
                        )
                    )

        # Check Copan Design System mandate if frontend components are present
        has_frontend = any(
            db.components.get(c)
            and (
                db.components.get(c).type.lower() == "frontend"
                or db.components.get(c).category
                in [
                    "Layout",
                    "Page Structure",
                    "Navigation",
                    "Feedback",
                    "Forms",
                    "Data Display",
                    "Actions",
                    "Filters",
                    "Search",
                    "Status",
                    "Dashboard",
                    "Domain Composition",
                    "UI Foundation",
                    "UI Components",
                ]
            )
            for c in component_ids
        )
        has_copan_rules = any(_is_copan_ui_rule(r) or "copan" in r.lower() or "brand" in r.lower() or "tokens" in r.lower() for r in active_rules)
        copan_rule_id = (
            "rul_copan_07_component_library_mandatory"
            if "rul_copan_07_component_library_mandatory" in db.rules
            else next(
                (r_id for r_id in db.rules.keys() if "copan" in r_id.lower() or "orange" in r_id.lower() or "brand" in r_id.lower()),
                "rul_copan_01_brand_orange",
            )
        )
        if has_frontend and not has_copan_rules:
            diagnostics.append(
                BlueprintValidationDiagnostic(
                    code="MISSING_COPAN_MANDATE",
                    severity=ValidationSeverity.CRITICAL,
                    category="RULE",
                    message=(
                        f"Componentes visuais exigem a Golden Rule 'Biblioteca de Componentes Obrigatória: Copan' ({copan_rule_id}). "
                        "O Copan ('@loft/react-loft' + '@loft/tokens-loft') é mandatório para toda aplicação padrão Loft — "
                        "não existe mais uma opção de declarar outra 'ui_library' (ex.: 'antd') para dispensar esta regra."
                        + (f" (ui_library declarada: '{detected_ui_lib}')" if has_explicit_non_copan_ui else "")
                    ),
                    resource_id=copan_rule_id,
                    resource_type="rule",
                    recommended_action=RecommendedAction(
                        action_type="ATTACH_RULE",
                        label="Vincular Copan Design System Rule",
                        description="Aplica os componentes e tokens reais do Copan ('@loft/react-loft', '@loft/tokens-loft').",
                        payload={"resource_id": copan_rule_id, "type": "rule"},
                    ),
                )
            )

        # 4b. Real Code & Dependency Conformance Inspection (when ui_library, dependencies, package_json, or source_files are provided)
        code_artifacts_supplied = bool(ui_library or dependencies or package_json or source_files)
        if has_copan_rules and detected_ui_lib and detected_ui_lib not in ("copan", "@loft/copan", "loft-copan"):
            diagnostics.append(
                BlueprintValidationDiagnostic(
                    code="COPAN_UI_STACK_DIVERGENCE",
                    severity=ValidationSeverity.WARNING,
                    category="RULE",
                    message=(
                        f"Divergência entre declaração e stack de UI: as regras Copan ({', '.join(sorted(r for r in active_rules if _is_copan_ui_rule(r)))}) "
                        f"foram declaradas no manifesto, mas a biblioteca de UI informada é '{detected_ui_lib}' sem pacote de tokens Copan."
                    ),
                    resource_id=copan_rule_id,
                    resource_type="rule",
                    recommended_action=RecommendedAction(
                        action_type="ALIGN_UI_STACK",
                        label="Migrar para o Copan",
                        description="Substitua a biblioteca de UI declarada por '@loft/react-loft' + '@loft/tokens-loft' — não há exceção mantendo regras Copan vinculadas.",
                        payload={"ui_library": detected_ui_lib, "rule_id": copan_rule_id},
                    ),
                )
            )

        if isinstance(source_files, dict) and source_files:
            uses_antd_imports = False
            uses_copan_components = False
            hardcoded_hex_locations: list[str] = []
            hex_pattern = re.compile(r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})\b")

            for fname, content in source_files.items():
                if not isinstance(content, str):
                    continue
                if "from 'antd'" in content or 'from "antd"' in content or "@ant-design" in content:
                    uses_antd_imports = True
                if "@loft/react-loft" in content or "@loft/tokens-loft" in content:
                    uses_copan_components = True
                for match in hex_pattern.findall(content):
                    hardcoded_hex_locations.append(f"{fname} ({match})")

            if uses_antd_imports and not uses_copan_components:
                diagnostics.append(
                    BlueprintValidationDiagnostic(
                        code="COPAN_CODE_AUDIT_MISMATCH",
                        severity=ValidationSeverity.CRITICAL,
                        category="RULE",
                        message=(
                            "Auditoria de código-fonte: os arquivos inspecionados importam 'antd'/'@ant-design' e não importam "
                            "'@loft/react-loft' ou '@loft/tokens-loft' — isso viola a Golden Rule "
                            f"'Biblioteca de Componentes Obrigatória: Copan' ({copan_rule_id}), que é mandatória, não apenas uma cor copiada do Copan."
                        ),
                        resource_id=copan_rule_id,
                        resource_type="rule",
                    )
                )
            if "rul_copan_02_tokens_only" in active_rules and hardcoded_hex_locations:
                sample_locs = ", ".join(hardcoded_hex_locations[:5])
                diagnostics.append(
                    BlueprintValidationDiagnostic(
                        code="COPAN_HARDCODED_HEX_DETECTED",
                        severity=ValidationSeverity.WARNING,
                        category="RULE",
                        message=(
                            f"Auditoria de código-fonte (rul_copan_02_tokens_only): valores hexadecimais hardcoded detectados "
                            f"em vez de tokens semânticos CSS: {sample_locs}."
                        ),
                        resource_id="rul_copan_02_tokens_only",
                        resource_type="rule",
                    )
                )

        # Check Backend / API Security rule if backend modules are present
        has_auth_or_users = any("auth" in m.lower() or "user" in m.lower() for m in selected_mod_set)
        sec_rule_id = next(
            (r_id for r_id in db.rules.keys() if "envelope" in r_id.lower() or "error" in r_id.lower() or "security" in r_id.lower()),
            "rul_loft_be_api_envelope",
        )
        if has_auth_or_users and not any("envelope" in r.lower() or "security" in r.lower() or "error" in r.lower() for r in active_rules):
            diagnostics.append(
                BlueprintValidationDiagnostic(
                    code="MISSING_SECURITY_RULE",
                    severity=ValidationSeverity.CRITICAL,
                    category="RULE",
                    message="Módulos de backend/segurança exigem a Golden Rule de Envelope e Tratamento de Erros da Loft.",
                    resource_id=sec_rule_id,
                    resource_type="rule",
                    recommended_action=RecommendedAction(
                        action_type="ATTACH_RULE",
                        label="Vincular Backend Engineering Rule",
                        description="Garante conformidade com ApiResponse e códigos canônicos.",
                        payload={"resource_id": sec_rule_id, "type": "rule"},
                    ),
                )
            )

        # 5. Mandatory Specifications Check
        active_specs = set(specification_ids)
        if not active_specs:
            if arch and arch.specifications:
                active_specs.update(arch.specifications)
            for m_id in module_ids:
                m_obj = db.modules.get(m_id)
                if m_obj and m_obj.specifications:
                    active_specs.update(m_obj.specifications)
            for t_id in template_ids:
                t_obj = db.templates.get(t_id)
                if t_obj and t_obj.specifications:
                    active_specs.update(t_obj.specifications)
            for c_id in component_ids:
                c_obj = db.components.get(c_id)
                if c_obj and c_obj.specifications:
                    active_specs.update(c_obj.specifications)
        be_spec_id = next(
            (s_id for s_id in db.specifications.keys() if "backend" in s_id.lower() or "foundation" in s_id.lower()),
            "spec_be_loft_backend_foundation",
        )
        if len(module_ids) > 0 and not any("backend" in s.lower() or "frontend" in s.lower() or "spec" in s.lower() for s in active_specs):
            diagnostics.append(
                BlueprintValidationDiagnostic(
                    code="RECOMMENDED_SPEC_MISSING",
                    severity=ValidationSeverity.INFO,
                    category="SPECIFICATION",
                    message="Recomenda-se associar uma especificação de engenharia (SDD) para conformidade com a arquitetura Loft.",
                    resource_id=be_spec_id,
                    resource_type="specification",
                    recommended_action=RecommendedAction(
                        action_type="SELECT_SPEC",
                        label="Vincular Especificação Canônica SDD",
                        payload={"resource_id": be_spec_id, "type": "specification"},
                    ),
                )
            )

        # 6. Explicit Conformance Scope Diagnostic (A15)
        if code_artifacts_supplied:
            validation_scope = "code_and_manifest_audited"
            conformance_mode = "code_audited"
            status_meaning = (
                "Declaração consistente com o catálogo e artefatos de código/dependências inspecionados "
                f"(ui_library='{detected_ui_lib or 'copan'}')."
            )
        else:
            validation_scope = "declarative_manifest"
            conformance_mode = "declarative_manifest"
            status_meaning = (
                "Declaração consistente com o catálogo (manifesto declarativo validado; não significa código-fonte auditado). "
                "Para auditar conformidade real de código/tokens e dependências, envie 'ui_library', 'dependencies', 'package_json' ou 'source_files'."
            )
            diagnostics.append(
                BlueprintValidationDiagnostic(
                    code="DECLARATIVE_VALIDATION_SCOPE",
                    severity=ValidationSeverity.INFO,
                    category="CONFORMANCE",
                    message=(
                        "O status 'ready' no modo declarativo atesta que a declaração do manifesto é consistente com o catálogo, "
                        "e não que o código-fonte foi auditado. Envie 'ui_library', 'dependencies' ou 'source_files' para auditoria de conformidade de código."
                    ),
                )
            )

        # Aggregate counts
        crit_count = sum(1 for d in diagnostics if d.severity == ValidationSeverity.CRITICAL)
        err_count = sum(1 for d in diagnostics if d.severity == ValidationSeverity.ERROR)
        warn_count = sum(1 for d in diagnostics if d.severity == ValidationSeverity.WARNING)
        info_count = sum(1 for d in diagnostics if d.severity == ValidationSeverity.INFO)

        status_result = "ready"
        if crit_count > 0 or err_count > 0:
            status_result = "error"
        elif warn_count > 0:
            status_result = "warning"

        can_publish = crit_count == 0 and err_count == 0
        error_diags = [d for d in diagnostics if d.severity in (ValidationSeverity.CRITICAL, ValidationSeverity.ERROR)]
        warn_diags = [d for d in diagnostics if d.severity == ValidationSeverity.WARNING]

        effective_ui_lib = detected_ui_lib or ("copan" if has_copan_rules else None)

        return BlueprintValidationResult(
            status=status_result,
            can_publish=can_publish,
            valid=can_publish,
            is_valid=can_publish,
            validation_scope=validation_scope,
            conformance_mode=conformance_mode,
            ui_library=effective_ui_lib,
            status_meaning=status_meaning,
            diagnostics=diagnostics,
            errors=error_diags,
            warnings=warn_diags,
            critical_count=crit_count,
            error_count=err_count,
            warning_count=warn_count,
            info_count=info_count,
        )



blueprint_validation_service = BlueprintValidationService()
