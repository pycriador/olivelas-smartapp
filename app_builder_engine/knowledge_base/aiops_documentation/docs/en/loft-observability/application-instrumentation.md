# Application instrumentation — Datadog by language

> Language: EN | [Português (pt-BR)](../../pt-BR/loft-observability/application-instrumentation.md)
>
> Status: DRAFT
>
> Documentation Standard v1.0
>
> Authority: Verified

Kubernetes env injection ([k8s-datadog-enablement.md](k8s-datadog-enablement.md)) prepares the runtime. **Application libraries and log format** are still required for APM and log–trace correlation.

## Summary matrix

| Stack | Logs (minimum) | Traces / APM | Custom metrics |
| --- | --- | --- | --- |
| **Kotlin / JVM** | JSON Logback | `dd-java-agent.jar` + `-javaagent` | DogStatsD Java client |
| **TypeScript / Node** | JSON (`pino` preferred) | `import "dd-trace/init"` first | `dd-trace` / `hot-shots` |
| **Python** | JSON logging + trace ids | `ddtrace-run` wrapper | `datadog` DogStatsD |

Olivelas reference apps today are mostly **Python (Flask/FastAPI)** and **Node (SSR)** — see [../aiops-apps/backend-stack.md](../aiops-apps/backend-stack.md).

## Kotlin / JVM

1. Download `dd-java-agent.jar` in the Docker build stage.
2. Entrypoint:

   ```text
   java -javaagent:/app/dd-java-agent.jar -jar /app/app.jar
   ```

3. Spring Boot + Actuator: HTTP/JDBC traces often work without code changes.
4. Logs: Logback JSON (`JsonEncoder` or `logstash-logback-encoder`).
5. Custom metrics: `com.datadoghq:java-dogstatsd-client`.

## TypeScript / Node.js

1. Add dependency `dd-trace`.
2. First line of the process entrypoint (before any other import):

   ```typescript
   import "dd-trace/init";
   ```

3. Logs: JSON via `pino` (preferred) or `winston` JSON formatter.
4. Custom metrics: DogStatsD via `hot-shots` or tracer API.

Deep Insight uses Express SSR under `server/` — apply the same init-at-top rule in the Node entry file.

## Python

1. Add `ddtrace` to dependencies (`requirements.txt` or `pyproject.toml`).
2. Wrap the server command with `ddtrace-run`:

   ```dockerfile
   CMD ["ddtrace-run", "gunicorn", "-c", "gunicorn.conf.py", "run:app"]
   ```

   Or for FastAPI/uvicorn:

   ```dockerfile
   CMD ["ddtrace-run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
   ```

3. Logs: JSON via `structlog` or stdlib `logging` JSON formatter; bind `dd.trace_id` and `dd.span_id` when not using automatic injection alone.
4. Custom metrics: `datadog` Python DogStatsD library.

### As-is gap (Olivelas DataForge)

Observed entrypoint uses plain `gunicorn` without `ddtrace-run`:

File: [backend/entrypoint.sh](https://github.com/loft-br/aiops-dataforge/blob/main/backend/entrypoint.sh).

Treat APM as **Partial** or **Not Documented** until instrumentation is added and verified.

## Frontend (React / Vite)

Browser RUM is out of scope for this pack unless the squad adopts Datadog RUM explicitly (`[pending: Olivelas frontend RUM standard]`). Server-side Node SSR follows the Node.js section above.

## Verification

After deploy, confirm in Datadog:

- **APM → Services** lists the service with correct `DD_SERVICE` and `DD_ENV`.
- HTTP traces use **route templates**, not high-cardinality raw URLs.
- Logs correlate with traces ([structured-logging.md](structured-logging.md)).

Full checklist: [verification-checklist.md](verification-checklist.md).

## Related documents

- [structured-logging.md](structured-logging.md)
- [k8s-datadog-enablement.md](k8s-datadog-enablement.md)
- [documentation-prerequisites.md](documentation-prerequisites.md)
