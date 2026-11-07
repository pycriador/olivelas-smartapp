# Exemplos — publicação na infra Loft

> Language: pt-BR | [English (EN)](../../../en/loft-infra/examples/README.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Informational

Templates com o **mínimo** para publicar um app AIOps no EKS da Loft (`cross` / `ai-ops` / `linux/arm64`).  
Nem todo repositório tem front e API — copie só o que se aplica.

Os arquivos `.example` ficam em [docs/en/loft-infra/examples/](../../../en/loft-infra/examples/) (fonte única; evita divergência EN/pt-BR).

**Guia completo:** [../publish-guide.md](../publish-guide.md)  
**Checklist:** [../checklist-novo-servico.md](../checklist-novo-servico.md)

| Exemplo | Copiar para (típico) | Quando |
| --- | --- | --- |
| `prod-k8s-deployment-front.yml.example` | `.github/workflows/prod-k8s-deployment-front.yml` | Front Node/Vite (ou similar) |
| `prod-k8s-deployment-api.yml.example` | `.github/workflows/prod-k8s-deployment-api.yml` | API Python/FastAPI (ou similar) |
| `Dockerfile.front.example` | `Dockerfile` (raiz) | Imagem do front |
| `docker-entrypoint.sh.example` | `docker/entrypoint.sh` | Entrypoint do front |
| `Dockerfile.api.example` | `backend/Dockerfile` ou `Dockerfile` na raiz | Imagem da API |
| `published-hosts.env.example` | `deploy/published-hosts.env` | Fonte única de URLs corp/Cross |
| `push_secrets.py.example` | stub para `scripts/vault/push_secrets.py` | Push `.env` local → Vault Cross |
| `k8s-apps-*.example` | `loft-br/k8s-apps` | Values Helm + Application Argo |
| `kong-front-*.example` | `kong-configs` gateway **corp** | Exposição do front |
| `kong-api-*.example` | `kong-configs` gateway **external** | API + `ip-restriction` Netskope |
| `dns-corp` / `dns-api` `.terragrunt.hcl.example` | `infra-live` Route53 | CNAMEs corp / external |
| `cors-origins.env.example` | Vault `CORS_ORIGINS` | Origins dos fronts publicados |

## Placeholders

| Placeholder | Exemplo |
| --- | --- |
| `<namespace>` | `aiops-dataforge`, `aiops-central` |
| `<front-name>` | `aiops-dataforge-front` |
| `<api-name>` | `aiops-dataforge-api` |
| `<app>` | label corp sem `-front` (ex.: `aiops-dataforge`) |
| `<squad>` | tag Kong, ex.: `squad-ai` |

## Adopters de referência

- [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge)
- [loft-br/aiops-central](https://github.com/loft-br/aiops-central) (runbook que originou este pacote)
