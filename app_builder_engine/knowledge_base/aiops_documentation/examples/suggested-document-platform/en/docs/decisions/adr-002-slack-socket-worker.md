---
title: "ADR-002 Slack Socket worker — Northstar"
status: "ACCEPTED"
owner: "example-team"
created: "2026-08-10"
updated: "2026-08-10"
review_date: "2026-11-10"
version: "1.0"
id: "ADR-NS-002"
type: "adr"
---

# ADR-002: Slack Socket Mode as a dedicated worker

> Language: EN | [Português](../../../pt-BR/docs/decisions/adr-002-slack-socket-worker.md)
>
> Status: ACCEPTED · Owner: example-team
>
> Documentation Standard v1.0
>
> **SUGGESTED / ILLUSTRATIVE** decision record — Slack Socket Mode is **example-only**.

## Context

Northstar wants Slack DMs to reuse the same chat pipeline as the web UI. HTTP Events API webhooks require public ingress and different operational failure modes than a long-lived socket.

## Decision

Run **Slack Socket Mode** in a **dedicated worker process** that shares the API container image and calls the chat pipeline in-process.

## Consequences

| Positive | Negative |
| --- | --- |
| No public Slack webhook ingress | Sticky long-lived connection per replica |
| Same domain code as HTTP chat | Extra deploy + secrets on the worker |
| Scales independently of API replicas | Socket Mode is a vendor-specific choice |

## Alternatives considered

| Alternative | Why not (in this example) |
| --- | --- |
| HTTP Events API only | Needs public URL + verification ops |
| Embed socket loop in every API pod | Couples request scale to websocket scale |

**Classification:** Proposed (example only).

## Related

- [../application/slack-bridge.md](../application/slack-bridge.md)
- [../architecture/overview.md](../architecture/overview.md)
