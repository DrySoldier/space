# E5 — Server Sync + Rudimentary Validation

## Goal

Introduce server-backed shop state sync and basic validation guardrails while retaining offline-first usability.

## Scope

- Add backend tables/routes/services for shop profile + transactions.
- Add client sync layer with retry/reconciliation.
- Validate upgrade costs/caps server-side for synced transactions.

## Deliverables

- `space-server` routes/service/repo for shop state
- DB migrations for shop profile + transaction history
- Client sync queue and conflict strategy

## Acceptance Criteria

- Offline purchase flow works locally.
- Online sync reconciles without data loss.
- Server rejects invalid upgrade levels/prices.

## Dependencies

- E2 stable offline model.

## Out of Scope

- Enterprise-grade anti-cheat.
