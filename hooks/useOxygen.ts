import { useEffect, useRef, useState } from 'react';

const MAX_O2 = 30;
const IDLE_DRAIN = 1;
const MOVING_DRAIN = 2.2;

export function useOxygen(
  isMoving: boolean,
  paused: boolean,
  gameOver: boolean,
  endGame: () => void,
) {
  const [o2, setO2] = useState<number>(MAX_O2);
  const drainRef = useRef(IDLE_DRAIN);
  drainRef.current = isMoving ? MOVING_DRAIN : IDLE_DRAIN;

  useEffect(() => {
    if (paused || gameOver) return;

    const id = setInterval(() => {
      setO2(prev => {
        if (prev <= 0) {
          endGame();
        }
        return Math.max(prev - drainRef.current, 0)
      });
    }, 1000);

    return () => clearInterval(id);
  }, [paused, gameOver]);

  const refill = (seconds: number) =>
    setO2(prev => Math.min(prev + seconds, MAX_O2));

  return { o2, refill };
}
