import { useEffect, useRef, useState } from 'react';

export function useOxygen(isMoving: boolean, paused: boolean, gameOver: boolean) {
  const [o2, setO2] = useState<number>(30);

  const movingRef = useRef(isMoving);
  movingRef.current = isMoving;

  useEffect(() => {
    let rafId: number;
    let last = performance.now();

    const step = (now: number) => {
      if (!paused && !gameOver) {
        const dt = (now - last) / 1000;
        last = now;

        const rate = movingRef.current ? 2.2 : 1;
        setO2(prev => Math.max(prev - dt * rate, 0));

        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [paused, gameOver]);

  const refill = (seconds: number) =>
    setO2(prev => Math.min(prev + seconds, 30));

  return {
    o2,
    refill
  };
}
