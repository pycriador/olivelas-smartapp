# Vault — secret configuration for AIOps apps

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/vault-secrets.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Preferred model

1. Store KV in Vault (UI/CLI).
2. Reference it from `application.vaultSecrets` in `k8s-apps` `values.yaml`.
3. Chart `web-server` creates `VaultStaticSecret` and injects keys as env via `envFrom` / `secretRef`.

UI used by app scripts: `https://vault.loft-corp.com.br`. Never commit secrets.

## Platform pieces (`infra-live`)

- Engine: `live/vault/production/engines/cross` (KV v2 mount `cross`)
- K8s auth: `live/vault/production/auths/k8s/cross` (`cross-prod`)
- SSO group: `live/vault/production/groups/cross`

## values contract

```yaml
application:
  vaultSecrets:
    - mount: cross
      path: ai-ops/aiops-dataforge/secrets
```

CRD refreshes every `30s` and can restart the Deployment. Pod env names = KV keys.

## Observed paths (watch inconsistencies)

| Service | path |
| --- | --- |
| DataForge API + front | `ai-ops/aiops-dataforge/secrets` (shared) |
| Deep Insight API | `ai-ops/aiops-deep-insight-api/secrets` |
| Deep Insight front | `aiops-deep-insight-front/secrets` (no `ai-ops/` prefix) |
| Qualidade API | `ai-ops/aiops-qualidade-api` (no `/secrets` suffix) |
| Qualidade front | no `vaultSecrets` |
| Loft Carteiras API/front | `ai-ops/aiops-loft-carteiras-{api\|front}/secrets` |
| AVA (`ava-prod`) | `ai-ops/ava-prod/secrets` |

App helpers: DataForge/Deep Insight `scripts/vault/push_secrets.py`; Loft Carteira `env_loader.py` skips Vault HTTP in-cluster and relies on injected env.

## Pay attention

- Exact path match between CLI/`vault kv put`, Vault UI, and `vaultSecrets`
- Shared paths expose all keys to every consumer pod
- Prefer secrets-only in Vault; non-secret config in `environmentVariables`
- Rotate if `.env` ever hit git; no tokens in PRs/Slack
- Prefer VSO over legacy `secret_kubernetes` for new services

See also: [publish-guide.md](publish-guide.md), [examples/](examples/README.md), [k8s-apps.md](k8s-apps.md), [checklist-novo-servico.md](checklist-novo-servico.md).
