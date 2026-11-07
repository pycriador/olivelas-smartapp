# Vault — configuração de secrets nos apps Olivelas

> Language: pt-BR | [English (EN)](../../en/loft-infra/vault-secrets.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0
>
> Authority: Verified

## Modelo preferido na Olivelas

Em serviços no EKS, o caminho oficial é **HashiCorp Vault + Vault Secrets Operator**:

1. Gravar o KV no Vault (UI ou CLI).
2. Referenciar o path em `application.vaultSecrets` no `values.yaml` do serviço em `k8s-apps`.
3. O chart `web-server` cria um `VaultStaticSecret` e injeta as chaves como **variáveis de ambiente** via `envFrom` → `secretRef`.

Não colocar secrets em Git, Dockerfile, `environmentVariables` do values, nem em `.env` versionado. Localmente: `.env` / `.env.local` no `.gitignore` + `.env.example` só com nomes.

UI / API observada nos scripts dos apps: `https://vault.loft-corp.com.br`.

## Peças em `infra-live` (plataforma)

| Peça | Path observado | Função |
| --- | --- | --- |
| Engine KV v2 `cross` | `live/vault/production/engines/cross` | Mount `cross`; `secret_max_versions = 10` |
| Auth Kubernetes `cross-prod` | `live/vault/production/auths/k8s/cross` | Cluster `cross-prod` autenticando no Vault (policy read-only de secrets para o reviewer) |
| Grupo SSO Cross | `live/vault/production/groups/cross` | Grupo Azure/JumpCloud com policy admin do engine `cross` |

Quem opera o cluster (VSO / roles por namespace): `[pending: detalhe do Vault Secrets Operator e role binding por namespace]`. Para o time de app, o contrato prático é **mount + path** no values.

## Contrato no `k8s-apps` (`values.yaml`)

```yaml
application:
  vaultSecrets:
    - mount: cross
      path: ai-ops/aiops-dataforge/secrets   # exemplo DataForge
```

Schema do chart (`values.schema.json`): array de objetos com **`mount`** e **`path`** obrigatórios.

### O que o chart gera

Template `helm-charts/web-server/templates/vault-secrets.yaml`:

- CRD `VaultStaticSecret` (`secrets.hashicorp.com/v1beta1`)
- `type: kv-v2`
- `refreshAfter: 30s`
- Destination Secret Kubernetes com nome derivado de `{app}-{mount}-{path}` ( `/` → `-`, truncado a 63)
- `rolloutRestartTargets` no Deployment → restart quando o secret muda

No pod (`web-server.podTemplateSpec`):

```yaml
envFrom:
  - secretRef:
      name: <app>-<mount>-<path-com-hifens>
```

Todas as **keys** do KV viram env vars no processo. A aplicação só precisa ler `os.environ` / equivalente.

## Paths observados nos apps Olivelas

| Serviço | `mount` | `path` em `vaultSecrets` |
| --- | --- | --- |
| `aiops-dataforge-api` | `cross` | `ai-ops/aiops-dataforge/secrets` |
| `aiops-dataforge-front` | `cross` | `ai-ops/aiops-dataforge/secrets` (mesmo path da API) |
| `aiops-deep-insight-api` (+ workers) | `cross` | `ai-ops/aiops-deep-insight-api/secrets` |
| `aiops-deep-insight-front` | `cross` | `aiops-deep-insight-front/secrets` (**sem** prefixo `ai-ops/`) |
| `aiops-qualidade-api` | `cross` | `ai-ops/aiops-qualidade-api` (**sem** sufixo `/secrets`) |
| `aiops-qualidade-front` | — | sem `vaultSecrets` no values atual |
| `aiops-loft-carteiras-api` | `cross` | `ai-ops/aiops-loft-carteiras-api/secrets` |
| `aiops-loft-carteiras-front` | `cross` | `ai-ops/aiops-loft-carteiras-front/secrets` |
| `ava-prod` | `cross` | `ai-ops/ava-prod/secrets` |

**Atenção:** a convenção dominante é `ai-ops/<nome>/secrets`, mas há desvios reais (Deep Insight front, Qualidade API). O path no Vault **precisa ser exatamente** o declarado em `vaultSecrets` (CLI `vault kv put` usa `mount/path`, ex.: `cross/ai-ops/aiops-dataforge/secrets`).

## Como popular o Vault (exemplos nos repos)

### DataForge — script de push

- [`scripts/vault/push_secrets.py`](https://github.com/loft-br/aiops-dataforge/blob/main/scripts/vault/push_secrets.py)
- Default: `VAULT_ADDR=https://vault.loft-corp.com.br`, path `cross/ai-ops/aiops-dataforge/secrets`
- Lê `backend/.env` (local, não commitado), monta payload (DB, JWT, bootstrap admin, …) e executa `vault kv put`
- Suporta `--dry-run` (lista keys, não grava valores)

Pré-requisito local: CLI `vault` autenticada (token/OIDC) com permissão de escrita no path; SSO via grupo Cross quando aplicável.

### Deep Insight

- Scripts em `scripts/vault/` + exemplos `backend.secrets.example` / `frontend.secrets.example` (só nomes/placeholders)
- Comentário no example: o path da API também alimenta workers (scheduler/slack) via o mesmo `vaultSecrets`
- Push usa JSON via stdin no `vault kv put` (evita secrets na linha de comando do shell)

### Olivelas Carteira — runtime local vs EKS

[`backend/env_loader.py`](https://github.com/loft-br/aiops-loft-carteira/blob/main/backend/env_loader.py):

- Em **Kubernetes** (`KUBERNETES_SERVICE_HOST` setado): **não** chama a API do Vault — espera env já injetado pelo VSO.
- Fora do cluster: opcionalmente busca `VAULT_MOUNT` + `VAULT_SECRET_PATH` com `VAULT_TOKEN`; depois `.env` / `.env.local` sobrescrevem.
- Defaults: mount `cross`, path `ai-ops/aiops-loft-carteiras-api/secrets`.

## O que precisa prestar atenção

1. **Align path ↔ values ↔ CLI**  
   `vault kv put cross/<path>` deve usar o mesmo `<path>` de `application.vaultSecrets[].path`. Um caractere a mais/menos (`/secrets`, `ai-ops/`) quebra o sync silenciosamente até o pod subir sem env.

2. **Keys = nomes de env vars**  
   O que você grava como key no KV é o nome da variável no container. Padronize UPPER_SNAKE_CASE. Não grave blobs sensíveis sob keys que a app loga.

3. **Não misturar secret e config não-secreta sem critério**  
   Os scripts às vezes empurram também `FLASK_ENV`, `PORT`, flags. Em `k8s-apps`, vários desses já estão em `environmentVariables`. Duplicata: env explícito do values e `envFrom` — confirmar precedência no chart/Kubernetes (última fonte ganha conforme ordem do container). Prefira secrets só para credenciais; config pública no values.

4. **Front e API no mesmo path (DataForge)**  
   Compartilhar o KV implica que **todas** as keys vão para **ambos** os pods. Evite colocar secret só-da-API se o front não precisa (superfície maior). Deep Insight / Carteiras separam paths front vs API.

5. **Refresh e rollout**  
   `refreshAfter: 30s` + restart do Deployment: mudança no Vault propaga, mas há janela e restart. Planeje rotação fora de pico crítico se o app não relê env em runtime.

6. **Acesso humano**  
   Escrita típica via SSO (grupo Cross no Vault production). Não compartilhe `VAULT_TOKEN` em Slack/PR. Tokens locais só em ambiente do desenvolvedor.

7. **`.env` local**  
   Nunca commitado. Scripts de push leem `.env` → Vault. Se um `.env` vazou no Git: **rotacionar primeiro**, depois limpar histórico.

8. **Legacy**  
   `loft-br/actions/secret_kubernetes` ainda existe para repos antigos; apps Olivelas de referência usam `vaultSecrets`. Não introduzir o legado em serviço novo.

9. **Health / boot**  
   Se a app exige `DATABASE_URL` / `JWT_SECRET_KEY` no boot e o VaultStaticSecret falha (path errado, permissão, VSO), o pod crasha ou fica sem ready — checar eventos do `VaultStaticSecret` e do Secret gerado no namespace.

## Checklist rápido (Vault)

- [ ] KV criado no mount `cross` no path escolhido
- [ ] Keys alinhadas ao que o código lê
- [ ] `application.vaultSecrets` no values do(s) workload(s)
- [ ] Sem o mesmo secret em `environmentVariables`
- [ ] `.env.example` atualizado (nomes only)
- [ ] Script de push (se houver) com o mesmo path default
- [ ] Pod sobe com env presentes; App Healthy no Argo

## Relacionados

- [publish-guide.md](publish-guide.md) · [examples/](examples/README.md) · [k8s-apps.md](k8s-apps.md) · [dockerfiles.md](dockerfiles.md) · [checklist-novo-servico.md](checklist-novo-servico.md) · [overview.md](overview.md)
