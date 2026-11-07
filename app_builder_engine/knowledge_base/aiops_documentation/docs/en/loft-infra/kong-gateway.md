# Kong — corp and external exposure

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/kong-gateway.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

Repo: [loft-br/kong-configs](https://github.com/loft-br/kong-configs).

| Path | Role |
| --- | --- |
| `gateways/infra-prod/corp/cross/` | Corporate frontends (`*.loft-corp.com.br`) |
| `gateways/infra-prod/external/cross/` | Corporate APIs (often with plugins) |

Copy-paste templates: [examples/kong-*.example](examples/). Full walkthrough: [publish-guide.md](publish-guide.md).

## Front (DataForge)

- Route host: `aiops-dataforge.loft-corp.com.br`
- Service upstream: `aiops-dataforge-front.cross.loft-prod.io:443`
- Tags: `impact_level:5`, `squad:squad-ai`

Files: [front route](https://github.com/loft-br/kong-configs/blob/main/gateways/infra-prod/corp/cross/routes/aiops-dataforge-front-route.yaml), [front service](https://github.com/loft-br/kong-configs/blob/main/gateways/infra-prod/corp/cross/services/aiops-dataforge-front-service.yaml).

## API (DataForge)

- Route host: `aiops-dataforge-api.loft-corp.com.br`
- Upstream: `aiops-dataforge-api.cross.loft-prod.io:443`
- Plugin: `ip-restriction` (Netskope allowlists; `404` outside)

Same pattern exists for deep-insight and loft-carteiras APIs. Qualidade front is under corp; no `qualidade-api` pair under `external/cross` in the current tree — Qualidade Docker bake uses the internal `.cross.loft-prod.io` API host.

## Checklist for a new host

1. Create **service** + **route** under the correct gateway (`corp` vs `external`).
2. Do **not** put the SPA API on **kong-corp**: JumpCloud/Cognito ALB returns `302` on CORS `OPTIONS` and breaks the browser. Pattern: corp front, external API.
3. Open a PR on `kong-configs`; validate staging (pipeline comment with `Host` + `X-Kong-Gateway`) before merge.
4. DNS: corp often auto-syncs after `gateways/*/corp/**` merge; external needs `infra-live` with `kong_accessibility=external` — [infra-live-route53.md](infra-live-route53.md).
5. Align front bake + `CORS_ORIGINS` with final hosts.
6. Human corp access: Infosec / [central.olivelas.com.br](https://central.olivelas.com.br) (JumpCloud) — independent of the route.

Optional SPA path: `gateways/cross-prod/internal/lovable/` — `[pending: when lovable vs Node SSR front]`.

DNS for `*.loft-corp.com.br` is owned by [infra-live Route53](infra-live-route53.md), not by hand-editing generated Kong ConfigMaps in `k8s-apps`.
