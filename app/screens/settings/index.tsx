import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import * as Crypto from 'expo-crypto';
import {useRouter} from 'expo-router';
import {images} from '../../../constants';
import {removeData, storeData} from '../../../utils/asyncData';
import {randInt} from '../../../utils';
import {useScoreboard} from '../../../hooks/useScoreboard';
import {useMusic} from '../../../context/MusicProvider';
import {IScore} from '../../../hooks/useScoreboard';

import styles from './styles';

const Settings = () => {
  const router = useRouter();
  const {
    getScoreByUUID,
    updateName,
    userScore,
    scores,
    isFetchingScores,
    hasMoreAbove,
    hasMoreBelow,
    loadAbove,
    loadBelow,
  } = useScoreboard();
  const music = useMusic();

  const [name, setName] = useState(userScore?.name || '');

  const astroPosition = useRef(new Animated.Value(0)).current;
  const astroRotate = useRef(new Animated.Value(0)).current;
  const changeNameScale = useRef(new Animated.Value(0)).current;

  const [isPagingAbove, setIsPagingAbove] = useState(false);
  const [isPagingBelow, setIsPagingBelow] = useState(false);
  const scoreboardListRef = useRef<FlatList<IScore> | null>(null);
  const hasAutoScrolledToPlayerRef = useRef(false);

  const astro360 = astroRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const xPosition = astroPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 650],
  });

  const startAstroAnimation = () => {
    const newDuration = randInt(6000, 18000);
    const newRotate = Math.random();
    astroPosition.setValue(0);

    Animated.parallel([
      Animated.timing(astroPosition, {
        toValue: 1,
        duration: newDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(astroRotate, {
        toValue: newRotate,
        duration: newDuration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => startAstroAnimation());
  };

  const pageAbove = async () => {
    if (isPagingAbove || !scores.length || !hasMoreAbove) return;
    setIsPagingAbove(true);
    await loadAbove();
    setIsPagingAbove(false);
  };

  const pageBelow = async () => {
    if (isPagingBelow || !scores.length || !hasMoreBelow) return;
    setIsPagingBelow(true);
    await loadBelow();
    setIsPagingBelow(false);
  };

  const clearAllData = async () => {
    await removeData('HISCORE');
    await removeData('CREDITS');
    await removeData('UUID');
    await removeData('MUTED');

    const uuid = Crypto.randomUUID();

    await storeData('UUID', uuid);
    router.dismissAll();
    router.replace('/');
  };

  useEffect(() => {
    startAstroAnimation();
    getScoreByUUID();

    return () => {
      astroPosition.stopAnimation();
      astroRotate.stopAnimation();
    };
  }, []);

  useEffect(() => {
    if (userScore?.name) {
      Animated.timing(changeNameScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      setName(userScore.name);
    }
  }, [userScore]);

  useEffect(() => {
    if (!scores.length || hasAutoScrolledToPlayerRef.current) return;

    const playerRowIndex = scores.findIndex(row => !!row.player);
    if (playerRowIndex < 0) return;

    requestAnimationFrame(() => {
      scoreboardListRef.current?.scrollToIndex({
        index: playerRowIndex,
        animated: true,
        viewPosition: 0.5,
      });
      hasAutoScrolledToPlayerRef.current = true;
    });
  }, [scores]);

  const renderScoreRow = (item: any) => (
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
    <ImageBackground source={images.space} style={styles.container}>
      <Animated.View
        style={{
          ...styles.astro,
          transform: [{translateX: xPosition}],
        }}>
        <Animated.Image
          style={{
            ...styles.astro,
            transform: [{rotateZ: astro360}],
          }}
          source={images['astro-right-2']}
        />
      </Animated.View>

      <SafeAreaView style={styles.content}>
        <View style={styles.topLeftBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <ImageBackground
              style={styles.backButton}
              resizeMode="stretch"
              source={images.normalButton}>
              <Text style={styles.buttonText}>Back</Text>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        <View style={styles.nameStack}>
          <ImageBackground
            resizeMode="stretch"
            source={images.panelHeader}
            style={styles.headerPanel}>
            <Text style={styles.headerText}>Settings</Text>
          </ImageBackground>
        </View>

        <Animated.View style={{transform: [{scale: changeNameScale}]}}>
          <KeyboardAvoidingView behavior="position">
            <ImageBackground
              style={styles.namePanel}
              resizeMode="stretch"
              source={images.panel}>
              <Text style={styles.panelTitle}>Pilot Name</Text>

              <TextInput
                style={styles.changeNameInput}
                defaultValue={userScore?.name || ''}
                onChangeText={setName}
                onEndEditing={() => updateName(name)}
                maxLength={16}
                value={name}
                placeholder="Enter name"
                placeholderTextColor="rgba(255,255,255,0.55)"
              />

              <View style={styles.nameActionsRow}>
                <TouchableOpacity onPress={() => music.toggle()}>
                  <ImageBackground
                    style={styles.muteButton}
                    resizeMode="stretch"
                    source={images.normalButton}>
                    <Image
                      source={music.isPlaying ? images.pause : images.play}
                      style={styles.muteIcon}
                    />
                  </ImageBackground>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Clear data?',
                      'This will reset your hi-score',
                      [
                        {text: 'Cancel', style: 'cancel'},
                        {text: 'OK', onPress: clearAllData},
                      ],
                    )
                  }>
                  <ImageBackground
                    style={styles.clearButton}
                    resizeMode="stretch"
                    source={images.normalButton}>
                    <Text style={styles.buttonText}>Clear Data</Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          </KeyboardAvoidingView>
        </Animated.View>

        <ImageBackground
          style={styles.scoreboardPanel}
          resizeMode="stretch"
          source={images.panel}>
          <Text style={styles.panelTitle}>Leaderboard</Text>

          <View style={styles.scoreboardBody}>
            <View style={styles.scoreHeaderRow}>
              <Text style={styles.scoreHeaderMetaText}>RANK</Text>
              <Text style={styles.scoreHeaderNameText}>NAME</Text>
              <Text style={styles.scoreHeaderMetaText}>SCORE</Text>
            </View>

            {isFetchingScores && !scores.length ? (
              <View style={styles.scoreboardLoadingContainer}>
                <ActivityIndicator color="#FFFFFF" />
              </View>
            ) : (
              <FlatList
                ref={scoreboardListRef}
                data={scores}
                keyExtractor={item => `${item.rk}-${item.score}-${item.name}`}
                renderItem={({item}) => renderScoreRow(item)}
                style={styles.scoreboardList}
                contentContainerStyle={styles.scoreboardListContent}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                onEndReached={pageBelow}
                onEndReachedThreshold={0.35}
                onScrollToIndexFailed={info => {
                  scoreboardListRef.current?.scrollToOffset({
                    offset: info.averageItemLength * info.index,
                    animated: false,
                  });

                  requestAnimationFrame(() => {
                    scoreboardListRef.current?.scrollToIndex({
                      index: info.index,
                      animated: true,
                      viewPosition: 0.5,
                    });
                  });
                }}
                onRefresh={pageAbove}
                refreshing={isPagingAbove}
                scrollEventThrottle={16}
                ListEmptyComponent={
                  <Text style={styles.scoreboardPlaceholderText}>
                    No leaderboard entries yet
                  </Text>
                }
              />
            )}
          </View>
        </ImageBackground>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default Settings;
