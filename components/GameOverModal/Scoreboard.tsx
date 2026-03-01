import React from 'react';
import {ActivityIndicator, Text, View} from 'react-native';
import {IScore} from '@/hooks/useScoreboard';
import styles from './styles';

interface IGameOverModalScoreboard {
  scores: IScore[];
  isLoading: boolean;
}

const GameOverModalScoreboard = ({
  scores,
  isLoading,
}: IGameOverModalScoreboard) => {
  const playerScoreIndex = scores.findIndex(row => !!row.player);
  const snippetRows =
    playerScoreIndex >= 0
      ? [
          scores[playerScoreIndex - 1],
          scores[playerScoreIndex],
          scores[playerScoreIndex + 1],
        ].filter(Boolean)
      : scores.slice(0, 3);

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
