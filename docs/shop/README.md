# Shop Phase Planning Docs

These docs are the planning source for the next major phase: **Shop + narrative progression**.

- Canonical session continuity: `AGENT.md`
- Scope owner: this repository (`space`) with follow-up backend work in `space-server`
- Priority rule: this base plan stays primary unless a critical blocker/risk forces reorder

## Locked Epic Order

1. **E0 — Foundation Cleanup + Reducer Refactor**
2. **E1 — Narrative/Cutscene System**
3. **E2 — Shop v1 Offline-First Meta Loop**
4. **E3 — Fireball Obstacle System**
5. **E4 — Economy and Balance Pass**
6. **E5 — Server Sync + Rudimentary Validation**
7. **E6 — Polish, QA, Release Hardening**

## Folder Layout

- `epics/` — one file per delivery phase with acceptance criteria
- `specs/` — feature/system designs used by epics
- `balance/` — economy curves and tuning targets
- `decisions/` — assumptions and unresolved questions

## Workflow Agreement

1. Design/update relevant spec before implementing behavior changes.
2. Keep acceptance criteria concrete and testable.
3. Record important decisions in `decisions/` to prevent re-litigating context.
4. Keep epic order stable unless a blocker is explicitly documented.
