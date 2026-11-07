# Contract Model

> Language: EN | [Português (pt-BR)](../pt-BR/contract-model.md)
>
> Status: ACCEPTED
>
> Documentation Standard v1.0

A **technical contract** is an explicit boundary between two or more participants that defines how they interact and which rules each side must respect for the interaction to work correctly.

A contract answers:

> How does one part of the system expect to interact with another?

It is more than an endpoint list or a payload sketch. When applicable, it covers participants, responsibilities, protocol, format, schema, semantics, validation, auth, errors, timing, retry, idempotency, ordering, delivery, versioning, and compatibility.

## Contract as Boundary

```text
Producer
    │
    │  Contract (shared expectations)
    ▼
Consumer
```

The contract belongs to the **relationship**, not only to the producer. Document expectations for both sides. Avoid producer-only narratives that leave consumer obligations and failure handling implicit.

Architecture integration:

```text
Architecture
      │
      ├── Component
      │
      └── Contract
             │
             ├── Producer
             └── Consumer
```

Architecture docs name components and relationships; contracts hold the verifiable interface detail. Prefer links from architecture to contracts over copying schemas into architecture prose. See [architecture-model.md](architecture-model.md) (Interfaces level) and [contracts/README.md](contracts/README.md).

## Participants

| Role | Meaning |
| --- | --- |
| **Producer** | Produces information, a command, an event, or a response |
| **Consumer** | Consumes or interprets that content |
| **Provider** | Exposes a capability |
| **Client** | Uses a capability exposed by a provider |
| **Sender** | Sends a message or information |
| **Receiver** | Receives a message or information |

These roles **may overlap**. The same component can be Producer of an event and Consumer of another contract. A Provider is often also a Producer of responses; a Client is often a Consumer of those responses.

### Naming guidance

- Prefer the project's established domain terms when they are clear and stable.
- Do **not** force rename of local terminology to match this vocabulary.
- When mapping local terms, state the mapping once (for example: "Gateway = Provider; Mobile app = Client").
- Always identify at least who produces/provides and who consumes/uses when both are known; mark **Unknown** when not identified.

## What a Contract Should Make Explicit

When applicable:

| Area | Question |
| --- | --- |
| Purpose | Why does this boundary exist? |
| Participants | Who interacts, and in which role? |
| Protocol / channel | How do they connect (technology-agnostic description)? |
| Input / output | What crosses the boundary? |
| Schema + semantics | Structure **and** meaning |
| Rules | Validation, authn/authz, limits |
| Behavior | Errors, retry, timeout, idempotency, ordering, delivery |
| Evolution | Version, compatibility, deprecation |

Omit sections that do not apply. Do not invent guarantees.

## Technology Stance

Contracts may be realized with any protocol or format. HTTP, RPC, queues, files, libraries, and pipelines are **implementations**, not requirements of this model.

## Related Documents

- [contract-types.md](contract-types.md)
- [contract-lifecycle.md](contract-lifecycle.md)
- [contract-ownership.md](contract-ownership.md)
- [semantic-contracts.md](semantic-contracts.md)
- [contracts/README.md](contracts/README.md)
- [templates/contract.md](templates/contract.md)
