import { getAllScores } from '@/api';
import { retrieveData } from '@/utils/asyncData';
import { useEffect, useRef, useState } from 'react';

export function useScoreboard(gameOver: boolean) {
    const [scores, setScores] = useState([]);

    const getScoreboard = async () => {
        const fetchedScores = await getAllScores();

        setScores(fetchedScores);
    };


    useEffect(() => {
        if (gameOver) {
            getScoreboard();
        }
    }, [gameOver]);

    const updateScore = async (score: number) => {
        const deviceId = await retrieveData('UUID');
    };

    return {
        scores,
        updateScore
    };
}
