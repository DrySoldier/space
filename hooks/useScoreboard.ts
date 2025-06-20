import * as api from '@/api';
import { retrieveData } from '@/utils/asyncData';
import { useState } from 'react';

export interface IScore {
    name: string;
    score: number;
    rk: number;
    createdAt: Date;
    player?: boolean;
}

export function useScoreboard() {
    const [scores, setScores] = useState<IScore[]>([]);
    const [userScore, setUserScore] = useState<IScore | undefined>();

    const getScoreByUUID = async () => {
        const deviceId = await retrieveData('UUID');
        if (deviceId) {
            const fetchedScore = await api.getScoreByUUID(deviceId);

            setUserScore(fetchedScore);
        }
    };

    /*const getScoresFromTo = async (from: number, to: number) => {
        const fetchedScores = await getScoreRange(from, to);

        setScores(fetchedScores);
    };*/

    const addNewScore = async (score: number) => {
        const deviceId = await retrieveData('UUID');

        if (deviceId) {
            const data = await api.postScore(score, deviceId);

            setScores(data);
        }
    };

    const updateName = async (name: string) => {
        const deviceId = await retrieveData('UUID');

        if (deviceId) {
            const result = await api.putName(deviceId, name);

            return result;
        }
    }

    const loadAbove = async () => {
        if (!scores.length) return;
        const beforeRank = scores[0].rk;
        const newRows = await api.getAbove(beforeRank) as IScore[];
        if (newRows && newRows.length > 0) {
            setScores(prev => [...newRows.reverse(), ...prev]);
        }
    };

    const loadBelow = async () => {
        if (!scores.length) return;
        const afterRank = scores[scores.length - 1].rk;
        const newRows = await api.getBelow(afterRank) as IScore[];
        if (newRows && newRows.length > 0) {
            setScores(prev => [...prev, ...newRows]);
        }
    };

    return {
        scores,
        userScore,
        addNewScore,
        updateName,
        loadAbove,
        loadBelow,
        getScoreByUUID
    };
}
