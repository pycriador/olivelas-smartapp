# Level 3 README pilots

Audit checklists for app repository documentation against the [3-level model](../../docs/en/aiops-team/documentation-model.md).

## dataforge (pilot)

Repo: [loft-br/aiops-dataforge](https://github.com/loft-br/aiops-dataforge).

| Contract section | Location in repo | Status |
| --- | --- | --- |
| How to run | README § Como executar localmente | **Confirmed** |
| Code structure | README § Estrutura do projeto | **Confirmed** |
| Dependencies | README § Stack tecnológica; `package.json`, `backend/requirements.txt` | **Confirmed** |
| Configuration | README § Configuração de ambiente; `backend/.env.example` | **Confirmed** |
| APIs | README § API backend; [backend/README.md](https://github.com/loft-br/aiops-dataforge/blob/main/backend/README.md) | **Confirmed** |
| Schemas | README § Layout do banco; `backend/scripts/setup.py` | **Confirmed** |
| Tests | **Unknown** — no dedicated test section in root README |
| Implementation details | [docs/pt-BR/application/](https://github.com/loft-br/aiops-dataforge/tree/main/docs/pt-BR/application) | **Confirmed** |
| App troubleshooting | README § Notas de segurança; partial via health/auth flows | **Inferred** |

**Agent action for level 3:** prefer editing `docs/` in the app repo for deep detail; only open a README PR when a contract section is missing or stale. DataForge root README already satisfies most sections — next gap is explicit **tests** documentation.

Level 2 backlinks: [docs/en/aiops-apps/dataforge.md](../../docs/en/aiops-apps/dataforge.md).
