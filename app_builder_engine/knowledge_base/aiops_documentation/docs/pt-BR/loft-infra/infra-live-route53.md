# infra-live — DNS Route53 (`loft-corp.com.br`)

> Language: pt-BR | [English (EN)](../../en/loft-infra/infra-live-route53.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Papel no fluxo

Kong sozinho não publica o hostname na internet corporativa. O registro DNS em Route53 aponta o FQDN `*.loft-corp.com.br` para o load balancer Kong correto. Isso vive em **[loft-br/infra-live](https://github.com/loft-br/infra-live)** (Terragrunt + blueprints no Terrareg; apply via Atlantis/Terrateam — não plan/apply local).

```text
Browser → DNS (Route53 / infra-live)
       → kong-{corp|external}.infrastructure.loft-prod.io
       → Kong route/service (kong-configs)
       → <service>.cross.loft-prod.io (k8s ingress)
```

## Onde ficam os records AIOps

Base observada:

[`live/aws/infrastructure/production/_global/route53/records/loft-corp.com.br/`](https://github.com/loft-br/infra-live/tree/main/live/aws/infrastructure/production/_global/route53/records/loft-corp.com.br)

Cada hostname é uma pasta com `terragrunt.hcl`. Records AIOps presentes no tree:

| Pasta (FQDN) | `record_name` | `kong_accessibility` |
| --- | --- | --- |
| `aiops-dataforge.loft-corp.com.br` | `aiops-dataforge` | `corp` |
| `aiops-dataforge-api.loft-corp.com.br` | `aiops-dataforge-api` | `external` |
| `aiops-deep-insight.loft-corp.com.br` | `aiops-deep-insight` | `corp` |
| `aiops-deep-insight-api.loft-corp.com.br` | `aiops-deep-insight-api` | `external` |
| `aiops-loft-carteiras.loft-corp.com.br` | `aiops-loft-carteiras` | `corp` |
| `aiops-loft-carteiras-api.loft-corp.com.br` | `aiops-loft-carteiras-api` | `external` |
| `aiops-qualidade.loft-corp.com.br` | `aiops-qualidade` | `corp` |
| `aiops-crm-desconto*.loft-corp.com.br` | (crm-desconto) | corp / external |

Não há pasta `aiops-qualidade-api.loft-corp.com.br` nesse diretório — coerente com a ausência de route Kong external para a API Qualidade e com o front Qualidade usando host interno `.cross.loft-prod.io`.

## Blueprint e CNAME

Componente Terragrunt: `route53/kong-record` (versão observada nos records AIOps: **`4.2.1`**).  
Fonte do blueprint: [`blueprints/aws/route53/kong-record`](https://github.com/loft-br/infra-live/tree/main/blueprints/aws/route53/kong-record).

O blueprint cria um **CNAME** (TTL 300) cujo target é:

```text
kong-{kong_accessibility}.{aws_account}.loft-{env}.io
```

Para os records AIOps observados:

- `aws_account = "infrastructure"`
- `environment = "production"` → mapeado para `prod`
- Front (`corp`) → `kong-corp.infrastructure.loft-prod.io`
- API (`external`) → `kong-external.infrastructure.loft-prod.io`

Valores aceitos de `kong_accessibility` no blueprint (validation): `internal` | `external` | `corp` | `ai-internal`.

## Exemplo — front DataForge

Fonte: [`…/aiops-dataforge.loft-corp.com.br/terragrunt.hcl`](https://github.com/loft-br/infra-live/blob/main/live/aws/infrastructure/production/_global/route53/records/loft-corp.com.br/aiops-dataforge.loft-corp.com.br/terragrunt.hcl)

```hcl
#AUTOAPPLYME
include "root" {
  path   = find_in_parent_folders("root.hcl")
  expose = true
}

locals {
  component_name    = "route53/kong-record"
  component_version = "4.2.1"
}

terraform {
  source = "tfr://${include.root.locals.registry_host}/${local.component_name}/${include.root.locals.registry_provider}?version=${local.component_version}"
}

dependency "zone" {
  config_path = "../../../../../_global/infrastructure/route53/zones/loft-corp.com.br"
}

inputs = {
  zone_name          = dependency.zone.outputs.zone_name
  record_name        = "aiops-dataforge"
  kong_accessibility = "corp"
  aws_account        = "infrastructure"
  environment        = "production"
}
```

## Exemplo — API DataForge

Mesma estrutura; muda:

```hcl
inputs = {
  record_name        = "aiops-dataforge-api"
  kong_accessibility = "external"
  # … zone_name, aws_account, environment iguais …
}
```

## Ordem prática com Kong e k8s-apps

1. Serviço saudável no cluster (`*.cross.loft-prod.io` via ingress Kong no `k8s-apps`).
2. Route + service em `kong-configs` (corp ou external) apontando para esse upstream — [examples/](examples/README.md).
3. DNS:
   - **corp:** após merge em `gateways/*/corp/**`, o sync `sync-loft-corp-route53-records` costuma criar o record automaticamente.
   - **external:** record em `infra-live` com `kong_accessibility = external` — [dns-api.terragrunt.hcl.example](../../en/loft-infra/examples/dns-api.terragrunt.hcl.example).
4. Abrir PR em `infra-live` quando necessário e deixar Atlantis/Terrateam aplicar (`#AUTOAPPLYME`).

Sem DNS apontando para o Kong certo, o host `*.loft-corp.com.br` não funciona — mesmo com route Kong correta. Confirme com `dig +short <fqdn>`.

Templates: [dns-corp.terragrunt.hcl.example](../../en/loft-infra/examples/dns-corp.terragrunt.hcl.example), [dns-api.terragrunt.hcl.example](../../en/loft-infra/examples/dns-api.terragrunt.hcl.example).  
Guia: [publish-guide.md](publish-guide.md).

## Outros recursos AIOps em `infra-live` (fora de DNS)

Há também IaC sob contas AWS (ex.: `live/aws/cross/production/…`, RDS em `live/aws/infrastructure/production/us-east-1/aiops/…`). Escopo desta página: **DNS corp**. Detalhe de RDS/S3 por app: `[pending: inventário completo cross/aiops no infra-live]`.

## Relacionados

- [publish-guide.md](publish-guide.md) · [examples/](examples/README.md) · [kong-gateway.md](kong-gateway.md) · [overview.md](overview.md) · [checklist-novo-servico.md](checklist-novo-servico.md)
