# Kong — exposição corp e external

> Language: pt-BR | [English (EN)](../../en/loft-infra/kong-gateway.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Repositório

[loft-br/kong-configs](https://github.com/loft-br/kong-configs)

## Dois gateways relevantes para AIOps

| Gateway path | Uso típico AIOps | Exemplos |
| --- | --- | --- |
| `gateways/infra-prod/corp/cross/` | Frontends corporativos (`*.loft-corp.com.br`) | `aiops-dataforge-front-*`, `aiops-qualidade-front-*`, … |
| `gateways/infra-prod/external/cross/` | APIs corporativas com política adicional (ex.: IP restriction) | `aiops-dataforge-api-*`, `aiops-deep-insight-api-*`, `aiops-loft-carteiras-api-*` |

Há também artefatos sob `gateways/cross-prod/internal/lovable/` (SPA/S3) para alguns produtos (ex.: DataForge). Tratar como caminho alternativo/legado de publicação de SPA — `[pending: quando lovable vs Node SSR front]`.

## Front — corp (DataForge)

Arquivos:

- [routes/aiops-dataforge-front-route.yaml](https://github.com/loft-br/kong-configs/blob/main/gateways/infra-prod/corp/cross/routes/aiops-dataforge-front-route.yaml)
- [services/aiops-dataforge-front-service.yaml](https://github.com/loft-br/kong-configs/blob/main/gateways/infra-prod/corp/cross/services/aiops-dataforge-front-service.yaml)

### Route

```yaml
routes:
- name: aiops-dataforge-front-route
  protocols:
  - https
  hosts:
  - aiops-dataforge.loft-corp.com.br
  methods:
  - GET
  - HEAD
  - OPTIONS
  - POST
  - PUT
  - PATCH
  - DELETE
  paths:
  - /
  preserve_host: false
  strip_path: false
  service: aiops-dataforge-front-service
  tags:
  - impact_level:5
  - squad:squad-ai
```

### Service (upstream)

```yaml
services:
- name: aiops-dataforge-front-service
  protocol: https
  host: aiops-dataforge-front.cross.loft-prod.io
  port: 443
  path: /
  retries: 0
  connect_timeout: 5000
  read_timeout: 60000
  write_timeout: 60000
  tags:
  - impact_level:5
  - squad:squad-ai
```

**Padrão:** hostname corp → serviço Kong → host interno do cluster `*.cross.loft-prod.io:443` (TLS).

Outros fronts no mesmo diretório: `aiops-deep-insight-front`, `aiops-qualidade-front`, `aiops-loft-carteiras-front` (hosts `aiops-*.loft-corp.com.br`).

## API — external (DataForge)

Arquivos sob `gateways/infra-prod/external/cross/`:

- `routes/aiops-dataforge-api-route.yaml`
- `services/aiops-dataforge-api-service.yaml`

### Diferença principal vs front

A route da API adiciona plugin **`ip-restriction`** (allowlist Netskope; resposta `404 Not Found` fora da lista):

```yaml
  plugins:
    - config:
        allow:
          - 163.116.128.0/17 # Netskope
          - 162.10.0.0/17 # Netskope
        message: Not Found
        status: 404
      name: ip-restriction
```

Host público: `aiops-dataforge-api.loft-corp.com.br`  
Upstream: `aiops-dataforge-api.cross.loft-prod.io:443`

### Qualidade API

Não há pares `*-qualidade-api-*` sob `external/cross` no tree atual. O front Qualidade aponta `VITE_API_URL` / `BACKEND_URL` para `https://aiops-qualidade-api.cross.loft-prod.io` (host interno) no Dockerfile — padrão diferente de DataForge (API corp pública). Confirmar política desejada por produto antes de copiar.

## Tags

Observadas de forma consistente:

- `impact_level:5`
- `squad:squad-ai` (Kong) — note que `k8s-apps` pode usar `squad-ai-ops` / `squad-infosec` no campo `team`; os vocabulários não são idênticos.

## Checklist ao expor um host novo

1. Criar **service** com `host: <k8s-service>.cross.loft-prod.io`, porta `443`, timeouts adequados — [examples/kong-*-service.yaml.example](../../en/loft-infra/examples/).
2. Criar **route** com `hosts`, `methods`, `paths`, link para o service, tags — [examples/kong-*-route.yaml.example](../../en/loft-infra/examples/).
3. Decidir gateway: **corp** (UI) vs **external** (API + plugins).
4. **Não** colocar a API consumida pelo SPA no **kong-corp**: o ALB JumpCloud/Cognito responde `302` no preflight `OPTIONS` e quebra CORS. Padrão: front corp, API external (DataForge / Central).
5. Abrir PR em `kong-configs`; validar staging (comentário do pipeline com `Host` + `X-Kong-Gateway`) antes do merge.
6. DNS: corp costuma ser criado pelo sync após merge em `gateways/*/corp/**`; API external exige record em `infra-live` com `kong_accessibility = external` — ver [infra-live-route53.md](infra-live-route53.md).
7. Alinhar bake do front (`VITE_*` / `published-hosts.env`) e `CORS_ORIGINS` da API com os hosts finais.
8. Acesso humano ao corp: Infosec / [central.loft.com.br](https://central.loft.com.br) (JumpCloud) — independente da rota.

Guia completo: [publish-guide.md](publish-guide.md).
