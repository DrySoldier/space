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
    const [hasMoreAbove, setHasMoreAbove] = useState(true);
    const [hasMoreBelow, setHasMoreBelow] = useState(true);

    const getScoreByUUID = async () => {
        try {
            const deviceId = await retrieveData('UUID');

            if (!deviceId) {
                setUserScore(undefined);
                setScores([]);
                setHasMoreAbove(false);
                setHasMoreBelow(false);
                return;
            }

            setIsFetchingScores(true);
            const fetchedScore = await api.getScoreByUUID(deviceId) as IScoreByUUIDPayload | null;

            if (fetchedScore) {
                setUserScore(fetchedScore.userScore || undefined);
                setScores(Array.isArray(fetchedScore.scores) ? fetchedScore.scores : []);
                setHasMoreAbove(true);
                setHasMoreBelow(true);
            } else {
                setUserScore(undefined);
                setScores([]);
                setHasMoreAbove(false);
                setHasMoreBelow(false);
            }
        } catch (error) {
            console.log(' ::: useScoreboard.getScoreByUUID failed :::', error);
            setUserScore(undefined);
            setScores([]);
            setHasMoreAbove(false);
            setHasMoreBelow(false);
        } finally {
            setIsFetchingScores(false);
        }
    };

    const addNewScore = async (score: number) => {
        try {
            const deviceId = await retrieveData('UUID');

            if (!deviceId) {
                return null;
            }

            const data = await api.postScore(score, deviceId) as IScore[] | null;

            if (Array.isArray(data)) {
                setScores(data);
                setHasMoreAbove(true);
                setHasMoreBelow(true);
                return data;
            }

            return null;
        } catch (error) {
            console.log(' ::: useScoreboard.addNewScore failed :::', error);
            return null;
        }
    };

    const updateName = async (name: string) => {
        try {
            const deviceId = await retrieveData('UUID');

            if (!deviceId) {
                return null;
            }

            const result = await api.putName(deviceId, name);

            return result;
        } catch (error) {
            console.log(' ::: useScoreboard.updateName failed :::', error);
            return null;
        }
    };

    const loadAbove = async () => {
        try {
            if (!scores.length || !hasMoreAbove) return;

            const beforeRank = scores[0].rk;
            const newRows = await api.getAbove(beforeRank);
            if (newRows && newRows.length > 0) {
                setScores(prev => [...newRows.reverse(), ...prev]);
                return;
            }

            setHasMoreAbove(false);
        } catch (error) {
            console.log(' ::: useScoreboard.loadAbove failed :::', error);
            setHasMoreAbove(false);
        }
    };

    const loadBelow = async () => {
        try {
            if (!scores.length || !hasMoreBelow) return;

            const afterRank = scores[scores.length - 1].rk;
            const newRows = await api.getBelow(afterRank);
            if (newRows && newRows.length > 0) {
                setScores(prev => [...prev, ...newRows]);
                return;
            }

            setHasMoreBelow(false);
        } catch (error) {
            console.log(' ::: useScoreboard.loadBelow failed :::', error);
            setHasMoreBelow(false);
        }
    };

    return {
        scores,
        userScore,
        isFetchingScores,
        hasMoreAbove,
        hasMoreBelow,
        addNewScore,
        updateName,
        loadAbove,
        loadBelow,
        getScoreByUUID
    };
}
