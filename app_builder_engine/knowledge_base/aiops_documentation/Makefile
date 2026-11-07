# Engineering Documentation Standard — local automation helpers
# Documentation Standard v1.8

PYTHON ?= python3
LINT := $(PYTHON) scripts/docs_lint.py
DOCS_SYNC_CONFIG ?= config.pt-BR.yaml

.PHONY: docs-lint docs-validate docs-check-links docs-check-manifest docs-health docs-report docs-index docs-sync-validate docs-sync-plan docs-sync-pt-br-plan docs-sync-pt-br-dry docs-sync-pt-br docs-sync-pt-br-status docs-sync-pt-br-audit docs-sync-pt-br-repair docs-sync-pt-br-cleanup-dry docs-sync-aiops-team-status docs-sync-aiops-team-plan docs-sync-aiops-team docs-sync-aiops-app-plan docs-sync-aiops-app

docs-lint docs-validate:
	$(LINT) validate

docs-sync-validate:
	cd docs-sync && uv run docs-sync validate --config $(DOCS_SYNC_CONFIG)

docs-sync-plan:
	cd docs-sync && uv run docs-sync plan --config $(DOCS_SYNC_CONFIG) --fake

docs-sync-pt-br-status:
	cd docs-sync && uv run docs-sync status --config config.pt-BR.yaml

docs-sync-pt-br-audit:
	cd docs-sync && uv run docs-sync audit --config config.pt-BR.yaml

docs-sync-pt-br-repair:
	cd docs-sync && uv run docs-sync sync --config config.pt-BR.yaml --force --relink

docs-sync-pt-br-plan:
	cd docs-sync && uv run docs-sync plan --config config.pt-BR.yaml --changes-only

docs-sync-pt-br-dry:
	cd docs-sync && uv run docs-sync sync --config config.pt-BR.yaml --dry-run

docs-sync-pt-br:
	cd docs-sync && uv run docs-sync sync --config config.pt-BR.yaml

docs-sync-pt-br-cleanup-dry:
	cd docs-sync && uv run docs-sync cleanup --config config.pt-BR.yaml \
		--title "Olivelas Docs" --match prefix --dry-run \
		--protect 6086460456 --protect 6090391603 --protect 6090358809 --protect 6091309071

# Scoped Olivelas hub sync (level 1 — aiops-team/)
docs-sync-aiops-team-status:
	cd docs-sync && uv run docs-sync status --config aiops-config/documentacao-inicial.pt-BR.yaml \
		--docs ../../docs/pt-BR/aiops-team --changes-only

docs-sync-aiops-team-plan:
	cd docs-sync && uv run docs-sync plan --config aiops-config/documentacao-inicial.pt-BR.yaml \
		--docs ../../docs/pt-BR/aiops-team --changes-only

docs-sync-aiops-team:
	cd docs-sync && uv run docs-sync sync --config aiops-config/documentacao-inicial.pt-BR.yaml \
		--docs ../../docs/pt-BR/aiops-team --changes-only --relink

# Scoped app page sync (level 2) — usage: make docs-sync-aiops-app APP=dataforge.md
# Single target: aiops-apps.pt-BR.yaml (Olivelas - Stack). Confluence enforces
# page-title uniqueness per space, not per parent, so these pages cannot
# also be published under documentacao-inicial.pt-BR.yaml (excluded there).
APP ?= dataforge.md

docs-sync-aiops-app-plan:
	cd docs-sync && uv run docs-sync plan --config aiops-config/aiops-apps.pt-BR.yaml \
		--only $(APP) --changes-only

docs-sync-aiops-app:
	cd docs-sync && uv run docs-sync sync --config aiops-config/aiops-apps.pt-BR.yaml \
		--only $(APP) --changes-only --relink

docs-check-links:
	$(LINT) check-links

docs-check-manifest:
	$(LINT) check-manifest

docs-health:
	$(LINT) health

docs-report:
	$(LINT) report

docs-index:
	$(LINT) index
