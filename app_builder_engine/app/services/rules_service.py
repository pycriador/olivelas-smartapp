"""
Rules Engine Service
Validates architectural decisions, code snippets and returns rule violations
"""
from __future__ import annotations
import re
from app.core.errors import NotFoundError
from app.domain.models import RuleCategory, RuleSeverity, ArchitecturalRule
from app.schemas.rules import (
    RuleResponse,
    RuleValidationResponse,
    RuleViolation,
)
from app.storage.seed_data import SEED_RULES


class RulesService:
    def __init__(self, rules: list[ArchitecturalRule] | None = None) -> None:
        self._rules = {r.id: r for r in (rules or SEED_RULES)}

    def list_rules(self, category: RuleCategory | None = None, severity: RuleSeverity | None = None) -> list[RuleResponse]:
        rules = list(self._rules.values())
        if category:
            rules = [r for r in rules if r.category == category]
        if severity:
            rules = [r for r in rules if r.severity == severity]

        return [
            RuleResponse(
                id=r.id,
                title=r.title,
                category=r.category,
                severity=r.severity,
                statement=r.statement,
                rationale=r.rationale,
                bad_example=r.bad_example,
                good_example=r.good_example,
                referenced_sdd=r.referenced_sdd,
            )
            for r in rules
        ]

    def get_rule_by_id(self, rule_id: str) -> RuleResponse:
        rule = self._rules.get(rule_id)
        if not rule:
            raise NotFoundError(f"Rule '{rule_id}' not found.", code="RULE_NOT_FOUND")

        return RuleResponse(
            id=rule.id,
            title=rule.title,
            category=rule.category,
            severity=rule.severity,
            statement=rule.statement,
            rationale=rule.rationale,
            bad_example=rule.bad_example,
            good_example=rule.good_example,
            referenced_sdd=rule.referenced_sdd,
        )

    def validate_code_or_decision(
        self,
        text: str,
        category: RuleCategory | None = None,
        context: str | None = None,
    ) -> RuleValidationResponse:
        violations: list[RuleViolation] = []
        warnings: list[str] = []

        lower_text = text.lower()

        # 1. Check for private copan imports (@loft/*)
        if "@loft/" in lower_text or "copan-components" in lower_text:
            violations.append(
                RuleViolation(
                    rule_id="FE-001",
                    rule_title="Proibição de Dependências Privadas do Copan",
                    severity=RuleSeverity.CRITICAL,
                    message="Importação detectada de pacotes privados '@loft/*'.",
                    recommendation="Utilize Ant Design + Olivelas Tokens + Olivelas Conventions.",
                )
            )

        # 2. Check for OpenAI/Anthropic direct imports in router/controller
        if ("import openai" in lower_text or "from openai" in lower_text or "import anthropic" in lower_text) and (
            "router" in lower_text or (context and "router" in context.lower())
        ):
            violations.append(
                RuleViolation(
                    rule_id="AI-001",
                    rule_title="Isolamento de Provedores de IA via Gateway",
                    severity=RuleSeverity.CRITICAL,
                    message="Chamada direta ou importação de SDK de IA detectada em camada de Router/Controller.",
                    recommendation="Isole as chamadas de IA via AIService -> LLMGateway.",
                )
            )

        # 3. Check for tenant_id from client body/params
        if "tenant_id = request" in lower_text or "body.tenant_id" in lower_text or "params.tenant_id" in lower_text:
            violations.append(
                RuleViolation(
                    rule_id="SEC-001",
                    rule_title="Zero Trust e Isolamento Multi-Tenant",
                    severity=RuleSeverity.CRITICAL,
                    message="Uso de tenant_id fornecido pelo cliente detectado.",
                    recommendation="Derive sempre o tenant_id a partir do token JWT autenticado (current_user.tenant_id).",
                )
            )

        # 4. Check for direct fetch/useEffect for server state in React
        if "useeffect" in lower_text and "fetch(" in lower_text:
            violations.append(
                RuleViolation(
                    rule_id="FE-002",
                    rule_title="Separação de Server State e Client State",
                    severity=RuleSeverity.MUST,
                    message="Chamada direta de fetch dentro de useEffect detectada.",
                    recommendation="Utilize TanStack Query (useQuery / useMutation) para gerenciar dados de API.",
                )
            )

        # 5. Check for hardcoded secrets
        if re.search(r"(password|api_key|secret|token)\s*=\s*['\"][a-zA-Z0-9_\-]{8,}['\"]", text, re.IGNORECASE):
            violations.append(
                RuleViolation(
                    rule_id="SEC-002",
                    rule_title="Proibição de Segredos em Código",
                    severity=RuleSeverity.CRITICAL,
                    message="Possível credencial ou segredo hardcoded detectado.",
                    recommendation="Mova credenciais para variáveis de ambiente e gerencie com Pydantic Settings.",
                )
            )

        is_compliant = len(violations) == 0
        rules_checked = len(self.list_rules(category=category))

        return RuleValidationResponse(
            is_compliant=is_compliant,
            violations=violations,
            warnings=warnings,
            applicable_rules_count=rules_checked,
        )
