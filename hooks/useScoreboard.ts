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

interface IUserScore {
    id?: number;
    name?: string;
    score?: number;
}

interface IScoreByUUIDPayload {
    userScore: IUserScore | null;
    scores: IScore[];
}

export function useScoreboard() {
    const [scores, setScores] = useState<IScore[]>([]);
    const [userScore, setUserScore] = useState<IUserScore | undefined>();
    const [isFetchingScores, setIsFetchingScores] = useState(false);

    const getScoreByUUID = async () => {
        const deviceId = await retrieveData('UUID');

        if (!deviceId) {
            setUserScore(undefined);
            setScores([]);
            return;
        }

        setIsFetchingScores(true);
        try {
            const fetchedScore = await api.getScoreByUUID(deviceId) as IScoreByUUIDPayload | null;

            if (fetchedScore) {
                setUserScore(fetchedScore.userScore || undefined);
                setScores(Array.isArray(fetchedScore.scores) ? fetchedScore.scores : []);
            } else {
                setUserScore(undefined);
                setScores([]);
            }
        } finally {
            setIsFetchingScores(false);
        }
    };

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
        const newRows = await api.getAbove(beforeRank);
        if (newRows && newRows.length > 0) {
            setScores(prev => [...newRows.reverse(), ...prev]);
        }
    };

    const loadBelow = async () => {
        if (!scores.length) return;
        const afterRank = scores[scores.length - 1].rk;
        const newRows = await api.getBelow(afterRank);
        if (newRows && newRows.length > 0) {
            setScores(prev => [...prev, ...newRows]);
        }
    };

    return {
        scores,
        userScore,
        isFetchingScores,
        addNewScore,
        updateName,
        loadAbove,
        loadBelow,
        getScoreByUUID
    };
}
