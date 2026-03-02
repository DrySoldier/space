# Dialogue/Cutscene System Spec

## Objective

Provide reusable RPG-style dialogue scenes for narrative beats, starting with first Space Man contact.

## UX Requirements

- Speaker portrait/silhouette visible per line.
- Text box with type-safe scene data source.
- Tap to advance; optional hold/skip extension later.
- End-of-scene callback to progression system.

## Proposed Scene Types

```ts
interface DialogueLine {
  id: string;
  speaker: 'space_man' | 'player' | 'system';
  text: string;
}

interface DialogueScene {
  sceneId: string;
  lines: DialogueLine[];
  skippable?: boolean;
}
```

## First Encounter Script Notes

- Build from canonical narrative:
  - acknowledgment of player climb effort
  - oxygen tank request
  - implied transactional alliance

## Integration

- Trigger from progression transition.
- Persist completion marker.
- Unlock shop on completion.
