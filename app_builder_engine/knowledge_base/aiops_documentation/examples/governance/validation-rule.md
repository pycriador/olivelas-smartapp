# Validation Rule (Example)

## ID

`DOC-META-001`

## Name

Authoritative documents must define an owner

## Description

Manifest entries with `authority: Authoritative` require a non-empty `owner`.

## Scope

All language manifests (`docs/*/manifest.yaml`)

## Severity

`ERROR`

## Detection

`scripts/docs_lint.py` manifest check

## Expected Result

Every Authoritative entry has `owner: <team-or-role>`

## Exception Policy

Allowed with time-bounded exception record under `docs/*/exceptions/`

## Related Documents

- `docs/en/validation-rules.md`
