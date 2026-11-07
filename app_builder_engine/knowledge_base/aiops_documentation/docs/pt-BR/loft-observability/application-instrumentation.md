# Instrumentação na aplicação — Datadog por linguagem

> Language: pt-BR | [English (EN)](../../en/loft-observability/application-instrumentation.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Injeção de env no Kubernetes ([k8s-datadog-enablement.md](k8s-datadog-enablement.md)) prepara o runtime. **Libs APM e formato de log** na aplicação ainda são necessários para APM e correlação log–trace.

## Matriz resumida

| Stack | Logs (mínimo) | Traces / APM | Métricas custom |
| --- | --- | --- | --- |
| **Kotlin / JVM** | JSON Logback | `dd-java-agent.jar` + `-javaagent` | DogStatsD Java |
| **TypeScript / Node** | JSON (`pino` preferido) | `import "dd-trace/init"` primeiro | `dd-trace` / `hot-shots` |
| **Python** | logging JSON + trace ids | wrapper `ddtrace-run` | DogStatsD `datadog` |

Apps AIOps de referência hoje são sobretudo **Python (Flask/FastAPI)** e **Node (SSR)** — [../aiops-apps/backend-stack.md](../aiops-apps/backend-stack.md).

## Kotlin / JVM

1. Baixar `dd-java-agent.jar` no build Docker.
2. Entrypoint:

   ```text
   java -javaagent:/app/dd-java-agent.jar -jar /app/app.jar
   ```

3. Spring Boot + Actuator: traces HTTP/JDBC frequentemente sem mudança de código.
4. Logs: Logback JSON (`JsonEncoder` ou `logstash-logback-encoder`).
5. Métricas custom: `com.datadoghq:java-dogstatsd-client`.

## TypeScript / Node.js

1. Dependência `dd-trace`.
2. Primeira linha do entrypoint (antes de qualquer import):

   ```typescript
   import "dd-trace/init";
   ```

3. Logs: JSON via `pino` (preferido) ou `winston` com formatter JSON.
4. Métricas custom: DogStatsD via `hot-shots` ou API do tracer.

Deep Insight usa Express SSR em `server/` — mesma regra de init no topo do entry Node.

## Python

1. Adicionar `ddtrace` às dependências (`requirements.txt` ou `pyproject.toml`).
2. Envolver o comando do servidor com `ddtrace-run`:

   ```dockerfile
   CMD ["ddtrace-run", "gunicorn", "-c", "gunicorn.conf.py", "run:app"]
   ```

   Ou FastAPI/uvicorn:

   ```dockerfile
   CMD ["ddtrace-run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
   ```

3. Logs: JSON via `structlog` ou stdlib `logging`; bind `dd.trace_id` e `dd.span_id` quando necessário.
4. Métricas custom: biblioteca DogStatsD `datadog`.

### Gap as-is (AIOps DataForge)

Entrypoint observado usa `gunicorn` sem `ddtrace-run`:

Arquivo: [backend/entrypoint.sh](https://github.com/loft-br/aiops-dataforge/blob/main/backend/entrypoint.sh).

Trate APM como **Partial** ou **Not Documented** até instrumentar e verificar.

## Frontend (React / Vite)

RUM no browser está fora deste pack salvo adoção explícita de Datadog RUM (`[pending: padrão Loft de RUM frontend]`). SSR Node segue a seção TypeScript/Node acima.

## Verificação

Após deploy, confirme no Datadog:

- **APM → Services** com `DD_SERVICE` e `DD_ENV` corretos.
- Traces HTTP com **templates de rota**, não URLs de alta cardinalidade.
- Logs correlacionados ([structured-logging.md](structured-logging.md)).

Checklist completo: [verification-checklist.md](verification-checklist.md).

## Documentos relacionados

- [structured-logging.md](structured-logging.md)
- [k8s-datadog-enablement.md](k8s-datadog-enablement.md)
- [documentation-prerequisites.md](documentation-prerequisites.md)
