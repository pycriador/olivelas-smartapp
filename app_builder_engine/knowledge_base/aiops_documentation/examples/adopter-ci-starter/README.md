# Adopter CI starter (optional)

> **Suggested, not required.** Example GitHub Actions + script wiring to run the standard's `docs_lint.py` against an adopting project's `docs/` tree.
>
> This is **not** part of the normative quality gates of this repository unless you choose to copy it.
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

## What it does

- Runs documentation validation in CI for `docs/**/*.md`.
- Expects the adopting repo to vendor or submodule `scripts/docs_lint.py` from this standard, **or** invoke validation via a documented path.

## How to copy

1. Copy `.github/workflows/docs-validate.yml` into your service repo.
2. Copy or adapt `scripts/run_docs_lint.sh`.
3. Point `DOCS_ROOT` at your docs tree (`docs` or `docs/en`).
4. Adjust Python version and paths to your repo.

## Disclaimer

The Engineering Documentation Standard does **not** require GitHub Actions, this workflow file, or any specific CI product. Use whatever validation your organization supports.
