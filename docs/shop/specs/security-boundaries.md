# Security and Validation Boundaries

## Objective

Define realistic, rudimentary security boundaries for Shop progression without overengineering.

## Trust Model (Phase-Based)

- **Offline-only phase (E2):** client is effectively authoritative locally.
- **Sync phase (E5+):** server becomes authoritative for synced shop state.

## Client Responsibilities

- Enforce UX-level constraints (disable unaffordable/maxed purchases).
- Persist transaction intent and current local state.
- Prevent accidental duplicate actions through in-flight locks.

## Server Responsibilities (E5)

- Validate upgrade exists and requested next level is legal.
- Validate computed price matches authoritative catalog rules.
- Apply wallet deduction + level increment atomically.
- Return authoritative snapshot after mutation.

## Non-Goals

- Full anti-cheat/attestation stack.
- Impossible-to-tamper offline economy.

## Practical Safeguards

- Versioned shop state schema.
- Transaction IDs for idempotent replay handling.
- Simple anomaly logging for impossible transitions.
