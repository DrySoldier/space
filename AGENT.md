# AGENT.md — Space Climb Continuity File

> This file is the single source of truth for session continuity during the Shop phase.
> If context is lost, resume from here first.

## 1) Mission Snapshot

- **Project:** Space Climb (client: `space`, server: `space-server`)
- **Current phase:** Post-MVP expansion
- **Primary initiative:** Narrative-driven **Shop** + progression loop
- **Priority rule:** The base epic plan below is canonical. New notes are additive unless they identify a blocker or critical risk.

## 2) Canonical Epic Order (Locked)

1. **E0 — Foundation Cleanup + Reducer Refactor**
2. **E1 — Narrative/Cutscene System**
3. **E2 — Shop v1 Offline-First Meta Loop**
4. **E3 — Fireball Obstacle System**
5. **E4 — Economy and Balance Pass**
6. **E5 — Server Sync + Rudimentary Validation**
7. **E6 — Polish, QA, Release Hardening**

Detailed docs live under `docs/shop/`.

## 3) Narrative Canon (Current)

- The player climbs the tower initially with no explicit narrative context.
- At the first major progression milestone, the run transitions into catastrophe (fiery meteor pressure).
- The player falls; a silhouette character (“Space Man”) contacts the player.
- Space Man asks for oxygen tanks and offers support in exchange.
- After this encounter:
  - Oxygen tanks become persistent run currency (meta-loop).
  - A new **Shop** option appears.
  - Upgrades influence future runs (oxygen, hazards, rewards, etc.).

## 4) Progression State Machine (High-Level)

`pre_contact -> milestone_hit -> catastrophe_triggered -> encounter_scene -> shop_unlocked`

- Encounter is one-time narrative unlock.
- Shop availability is gated by `shop_unlocked`.
- Meta progression persists across app restarts.

See: `docs/shop/specs/progression-state-machine.md`

## 5) Current Audit Highlights (Why E0 is first)

- `app/screens/game/index.tsx` is a large, coupled state container.
- Mutable module-level gameplay variable exists (`oxygenChance`) and should move into reducer state.
- Timer/interval behavior can drift and has score-underflow risk in one path.
- Shop/progression persistence model not yet implemented.

## 6) Working Assumptions (v1)

- Shop unlock is a one-time scripted event after milestone + encounter.
- Currency source is oxygen tanks collected in-run.
- Shop is hidden until unlock.
- Build **offline-first** first; add server sync after local loop is stable.
- Initial upgrade families:
  - Hazard pressure reduction
  - Oxygen spawn improvement
  - Tank value/earnings improvement

See: `docs/shop/decisions/assumptions.md`

## 7) File Map (Planning)

- `docs/shop/README.md`
- `docs/shop/epics/*`
- `docs/shop/specs/*`
- `docs/shop/balance/*`
- `docs/shop/decisions/*`

## 8) Immediate Next Execution Target

Start implementation with **E0**:

1. Introduce reducer-driven game state.
2. Remove module-level mutable gameplay state.
3. Normalize interval/tick lifecycle.
4. Preserve current gameplay behavior while improving determinism.

## 9) Session Quick Start

Client:

```bash
cd /Users/chris/Desktop/space
npm run lint
npx expo start
```

Server:

```bash
cd /Users/chris/Desktop/space-server
npm run dev
```

## 10) Rules for Future Agents

- Read this file first.
- Follow locked epic order unless a critical blocker is found.
- Update docs before/after major architectural decisions.
- Keep behavior changes explicit in acceptance criteria.
