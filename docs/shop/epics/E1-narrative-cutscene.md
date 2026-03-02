# E1 — Narrative/Cutscene System

## Goal

Implement a reusable RPG-style dialogue/cutscene system for the Space Man encounter and future narrative events.

## Scope

- Build a scene renderer with:
  - Speaker portrait/silhouette panel
  - Dialogue textbox
  - Tap/confirm to advance lines
- Create first-contact sequence triggered by progression conditions.
- Persist one-time completion flag so the encounter does not repeat unintentionally.

## Deliverables

- `components/DialogueScene/*` (or equivalent)
- Scene script data model (array of lines/beats)
- Progression stage transition integration with game flow

## Acceptance Criteria

- First Space Man encounter can be completed with deterministic line order.
- Encounter persists as complete after app restart.
- Scene system can support additional scripts without rewriting component logic.

## Dependencies

- E0 stability work completed.

## Out of Scope

- Shop catalog/purchases.
- Fireball hazard gameplay logic.
