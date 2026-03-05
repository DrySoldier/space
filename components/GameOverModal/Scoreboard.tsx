import React, {useEffect, useRef} from 'react';
import {ActivityIndicator, Animated, Text, View} from 'react-native';
import {IScore} from '@/hooks/useScoreboard';
import styles from './styles';

interface IGameOverModalScoreboard {
  scores: IScore[];
  isLoading: boolean;
  score: number;
  personalBest: number;
  isPersonalBest?: boolean;
}

const GameOverModalScoreboard = ({
  scores,
  isLoading,
  score,
  personalBest,
  isPersonalBest = false,
}: IGameOverModalScoreboard) => {
  const rankHintOpacity = useRef(new Animated.Value(1)).current;

  const playerScoreIndex = scores.findIndex(row => !!row.player);
  const snippetRows =
    playerScoreIndex >= 0
      ? [
          scores[playerScoreIndex - 1],
          scores[playerScoreIndex],
          scores[playerScoreIndex + 1],
        ].filter(Boolean)
      : scores.slice(0, 3);

  const rankHintText = (() => {
    if (isLoading) return null;
    if (isPersonalBest) return 'New Personal Best!!!';
    if (!scores.length) return null;

    const pointsToPersonalBest = personalBest - score;
    const isCloseToPBWithoutBeatingIt =
      personalBest > score && pointsToPersonalBest <= 5000;

    // Only show the milestone rank nudge when player is close to PB but didn't beat it.
    if (!isCloseToPBWithoutBeatingIt) return null;

    // Target only the immediate next rank so the hint doesn't skip levels
    const nextRankRow =
      playerScoreIndex > 0
        ? scores[playerScoreIndex - 1]
        : [...scores]
            .filter(row => row.score > score)
            .sort((a, b) => a.score - b.score)[0];

    if (!nextRankRow) return null;

    const pointsToNextRank = Math.max(1, nextRankRow.score - score + 10);
    const pointLabel = pointsToNextRank === 1 ? 'point' : 'points';

    return `${pointsToNextRank} ${pointLabel} to rank #${nextRankRow.rk}!`;
  })();

  useEffect(() => {
    rankHintOpacity.stopAnimation();
    rankHintOpacity.setValue(1);

    if (!rankHintText) return;

    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(rankHintOpacity, {
          toValue: 0.35,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(rankHintOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
      ]),
    );

    blinkAnimation.start();

    return () => {
      blinkAnimation.stop();
    };
  }, [rankHintText, rankHintOpacity]);

  const renderScoreRow = (item: IScore) => (
    <View style={styles.scoreRow}>
      <Text
        style={[styles.scoreMetaText, item.player && styles.playerScoreText]}>
        {item.rk}
      </Text>
      <Text
        style={[styles.scoreNameText, item.player && styles.playerScoreText]}>
        {item.name}
      </Text>
      <Text
        style={[styles.scoreMetaText, item.player && styles.playerScoreText]}>
        {item.score}
      </Text>
    </View>
  );

  return (
    <View style={styles.scoreboardSection}>
      {!!rankHintText && (
        <Animated.Text
          style={[styles.rankHintText, {opacity: rankHintOpacity}]}>
          {rankHintText}
        </Animated.Text>
      )}

      <View style={styles.scoreboardSnippetCard}>
        {isLoading ? (
          <View style={styles.scoreboardLoadingContainer}>
            <ActivityIndicator size="small" color="#FFFFFF" />
          </View>
        ) : snippetRows.length ? (
          snippetRows.map((item: IScore) => (
            <View key={`${item.rk}-${item.score}-${item.name}`}>
              {renderScoreRow(item)}
            </View>
          ))
        ) : (
          <Text style={styles.scoreboardPlaceholderText}>
            No leaderboard entries yet
          </Text>
        )}
      </View>
    </View>
  );
};

export default GameOverModalScoreboard;
