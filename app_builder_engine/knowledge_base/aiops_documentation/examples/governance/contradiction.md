# Documentation Contradiction (Example)

## ID

`CONTRA-001`

## Statement A

Component NotifyBridge calls PaymentGateway synchronously.

## Source A

`ARCH-014` (fictional architecture overview)

## Statement B

Component NotifyBridge does not call PaymentGateway.

## Source B

`CONTRACT-088` (fictional integration contract)

## Conflict

Call relationship asserted in architecture and denied in contract.

## Impact

Impact analysis and onboarding answers may diverge.

## Recommended Resolution

Confirm runtime call graph; update non-authoritative side; link ADR if intentional.

## Owner

`notify-bridge-squad`

## Status

`OPEN`
