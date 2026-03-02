# E2 — Shop v1 Offline-First Meta Loop

## Goal

Deliver an offline-first Shop with persistent currency and upgrades that affect future runs.

## Scope

- Add persistent meta state:
  - unlock stage
  - wallet balance
  - purchased upgrade levels
- Add Home menu gate for Shop visibility after unlock.
- Add Shop screen grid/list with purchasable upgrade cards.
- Apply upgrade effects to runtime parameters.

## Deliverables

- `app/screens/shop/index.tsx`
- Shop catalog config (`constants/shop.ts` or similar)
- Meta persistence utilities (`AsyncStorage`-backed)

## Acceptance Criteria

- Shop appears only after narrative unlock.
- Currency + upgrades persist across app restarts (offline).
- Purchases enforce cost and max-level constraints.
- Upgrades are observable in gameplay behavior.

## Dependencies

- E0 and E1 complete.

## Out of Scope

- Server synchronization.
- Advanced anti-tamper controls.
