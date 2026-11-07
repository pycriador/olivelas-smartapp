# Documentation Change (Example)

## ID

`DOCCHG-017`

## Change

Add retry semantics section to fictional NotifyBridge outbound contract

## Reason

Runtime retry budget changed from 3 to 5 attempts

## Affected Documents

- `CONTRACT-088`
- `OPS-003` runbook
- `ARCH-014` dependency notes

## Affected Components

- NotifyBridge
- DeliveryWorker

## Evidence

Config change in `configs/notify-bridge.yaml` (fictional path); deploy ticket NB-2044

## Impact

Medium — documented behavior change; no security classification change

## Reviewer

`notify-bridge-squad`

## Status

`REVIEW`
