# infra-live — Route53 DNS (`loft-corp.com.br`)

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-infra/infra-live-route53.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

Kong alone does not publish the corporate hostname. Route53 in **[loft-br/infra-live](https://github.com/loft-br/infra-live)** CNAMEs `*.loft-corp.com.br` to the right Kong LB. Apply via Atlantis/Terrateam — not local plan/apply.

```text
Browser → Route53 (infra-live)
       → kong-{corp|external}.infrastructure.loft-prod.io
       → Kong (kong-configs)
       → <service>.cross.loft-prod.io
```

Templates: [dns-corp.terragrunt.hcl.example](examples/dns-corp.terragrunt.hcl.example), [dns-api.terragrunt.hcl.example](examples/dns-api.terragrunt.hcl.example).  
Guide: [publish-guide.md](publish-guide.md).

## AIOps records

Base: [`…/route53/records/loft-corp.com.br/`](https://github.com/loft-br/infra-live/tree/main/live/aws/infrastructure/production/_global/route53/records/loft-corp.com.br)

| Host | `kong_accessibility` |
| --- | --- |
| `aiops-*-api.loft-corp.com.br` (dataforge, deep-insight, loft-carteiras, crm-desconto) | `external` |
| Front hosts (`aiops-dataforge`, `aiops-deep-insight`, `aiops-qualidade`, `aiops-loft-carteiras`, …) | `corp` |

No `aiops-qualidade-api` DNS folder in that tree.

## Blueprint

Component `route53/kong-record` **4.2.1** ([blueprint](https://github.com/loft-br/infra-live/tree/main/blueprints/aws/route53/kong-record)): CNAME TTL 300 to `kong-{accessibility}.infrastructure.loft-prod.io` when `aws_account=infrastructure` and `environment=production`. Allowed accessibility: `internal` | `external` | `corp` | `ai-internal`.

## Practical order

1. Healthy k8s ingress (`*.cross.loft-prod.io`).
2. Kong route/service in `kong-configs`.
3. DNS:
   - **corp:** often auto-created after merge under `gateways/*/corp/**` (`sync-loft-corp-route53-records`).
   - **external:** manual `infra-live` record with `kong_accessibility = external`.
4. Confirm with `dig +short <fqdn>`.
