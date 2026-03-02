# Persistence and Sync Strategy

## Principle

Offline-first client behavior with optional server synchronization when available.

## Phase Strategy

- **E2:** local-only persistence via AsyncStorage.
- **E5:** add server profile + transaction sync/reconciliation.

## Local Persistence Keys (proposed)

- `@SPACE:PROGRESSION_STAGE`
- `@SPACE:SHOP_STATE`
- `@SPACE:SHOP_TX_QUEUE` (reserved for sync phase)

## Sync Model (E5)

- Client writes local transaction log.
- When online, sync queued transactions.
- Server validates and applies accepted transitions.
- Client reconciles authoritative snapshot.

## Conflict Policy

- During sync phase, server snapshot is source of truth for synced accounts.
- Local queue transactions replayed against latest accepted state.
