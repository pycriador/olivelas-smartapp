"""
Engineering Health Service — Real-Time Health & Governance Metrics Aggregator
"""
from __future__ import annotations
from app.domain.entities import EngineeringHealthMetrics, EntityLifecycleStatus, BlueprintStatus
from app.storage.database import db
from app.services.blueprint_validation_service import blueprint_validation_service


class EngineeringHealthService:
    def get_health_metrics(self) -> EngineeringHealthMetrics:
        # Components stats
        comp_published = sum(1 for c in db.components.values() if c.status == EntityLifecycleStatus.PUBLISHED)
        comp_deprecated = sum(1 for c in db.components.values() if c.status == EntityLifecycleStatus.DEPRECATED)

        # Blueprints stats
        bp_ready = sum(1 for b in db.blueprints.values() if b.status in [BlueprintStatus.READY, BlueprintStatus.PUBLISHED])
        bp_error = 0
        missing_deps = 0
        crit_violations = 0

        for bp in db.blueprints.values():
            val = blueprint_validation_service.validate_blueprint_configuration(
                architecture_id=bp.architecture_id,
                module_ids=bp.modules,
                component_ids=bp.components,
                template_ids=bp.templates,
                rule_ids=bp.rules,
                specification_ids=bp.specifications,
            )
            if val.critical_count > 0 or val.error_count > 0:
                bp_error += 1
            missing_deps += sum(1 for d in val.diagnostics if d.code in ["MISSING_MODULE_DEPENDENCY", "MISSING_COMPONENT_DEPENDENCY"])
            crit_violations += val.critical_count

        return EngineeringHealthMetrics(
            components_published=comp_published,
            components_deprecated=comp_deprecated,
            blueprints_ready=bp_ready,
            blueprints_validation_errors=bp_error,
            missing_dependencies_count=missing_deps,
            critical_rule_violations_count=crit_violations,
            specifications_unversioned_count=0,
            total_projects=len(db.projects),
            total_blueprints=len(db.blueprints),
            total_components=len(db.components),
            total_modules=len(db.modules),
            total_templates=len(db.templates),
            total_rules=len(db.rules),
            total_architectures=len(db.architectures),
            total_specifications=len(db.specifications),
        )


engineering_health_service = EngineeringHealthService()
