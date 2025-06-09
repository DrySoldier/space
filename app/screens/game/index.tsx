import React, {useState, useEffect, useRef, createRef} from 'react';
import {
  Text,
  View,
  Animated,
  TouchableOpacity,
  FlatList,
  Image,
  Easing,
  Pressable,
} from 'react-native';
import {ThrownAway, Branch, GameOverModal, OxygenMeter} from '@/components';
import {images} from '@/constants';
import {randInt} from '@/utils';

import styles from './styles';
import {useOxygen} from '@/app/hooks/useOxygen';
import Player from '@/components/Player';

type TSide = 'left' | 'right';
type TBranch = {type: number; id: number; ref: React.RefObject<any>};

const defaultBranches = [
  {type: 0, id: 7, ref: createRef()},
  {type: randInt(0, 2), id: 6, ref: createRef()},
  {type: 0, id: 5, ref: createRef()},
  {type: 0, id: 4, ref: createRef()},
  {type: 0, id: 3, ref: createRef()},
  {type: 0, id: 2, ref: createRef()},
  {type: 0, id: 1, ref: createRef()},
  {type: 0, id: 0, ref: createRef()},
];

const backgroundSize = 1600;

let timerInterval: any;

const Game = () => {
  // Current side player is on
  const [currentSide, setCurrentSide] = useState<TSide>('left');
  // 0 - no branch, 1 - left side branch, 2 - right side branch
  // The rantInts set up random branches on the top
  const [branches, setBranches] = useState<TBranch[]>(defaultBranches);
  // All the branch views
  // Array to store thrown away squares
  const [thrownAwayArr, setThrownAwayArr] = useState<React.JSX.Element[]>([]);
  const [paused, setPaused] = useState(false);

  const [disablePress, setDisablePress] = useState(false);

  const [score, setScore] = useState(-1);
  const [gameOver, setGameOver] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  // animation for the astronaut
  const [step, setStep] = useState(false);

  const {refill, o2} = useOxygen(isMoving, paused, gameOver);

  const offsetY = useRef(new Animated.Value(0)).current;

  const generateNewBranch = (lastBranch: TBranch) => {
    let nextBranch = randInt(0, 2);

    // Make empty branches a little more rare
    if (nextBranch === 0) {
      nextBranch = randInt(0, 2);
    }

    if (nextBranch === 0) {
      // 1 out of 15 chance to generate an oxygen tank in an empty branch
      const hasOxygenTank = randInt(0, 100) >= 7;

      const side = randInt(0, 1);
      if (hasOxygenTank) {
        nextBranch = 3 + side;
      }
    }

    if (lastBranch.type !== 0) {
      return 0;
    } else {
      return nextBranch;
    }
  };

  const handlePress = (side: TSide) => {
    if (disablePress) return;

    // Handle background shift
    offsetY.stopAnimation(current => {
      const target = current + 20;

      Animated.timing(offsetY, {
        toValue: target,
        duration: 5000,
        easing: Easing.bezier(0, 0.55, 0.45, 1),
        useNativeDriver: true,
      }).start();

      const wrapped = target % backgroundSize;
      if (wrapped > backgroundSize - 10) {
        offsetY.setValue(0);
      }
    });

    setCurrentSide(side);
    setStep(prevState => !prevState);

    // Handle branch animations & logic
    const lastBranch = branches[7];
    const nextBranch = branches[6];
    const lastGeneratedBranch = branches[0];

    setIsMoving(true);

    branches.forEach(b => {
      b.ref?.current.animateDown(() => {
        if (b.id === lastBranch.id) {
          setBranches(prevState => {
            const copy = [...prevState];
            copy.pop();
            copy.unshift({
              type: generateNewBranch(lastGeneratedBranch),
              id: prevState[0].id + 1,
              ref: createRef(),
            });
            return copy;
          });
          setIsMoving(false);
        }
      });
    });

    setThrownAwayArr([
      ...thrownAwayArr,
      <ThrownAway side={lastBranch.type} key={randInt(0, 999999)} />,
    ]);

    // Check to see if player is chopping tree below branch
    if (
      (side === 'left' && nextBranch.type === 1) ||
      (side === 'right' && nextBranch.type === 2)
    ) {
      setDisablePress(true);
      setGameOver(true);
      return;
    } else {
      if (side === 'left' && nextBranch.type === 3) {
        refill(8);
      } else if (side === 'right' && nextBranch.type === 4) {
        refill(8);
      }

      setScore(prevState => prevState + 100);
    }
  };

  useEffect(() => {
    if (gameOver) {
      clearInterval(timerInterval);
      timerInterval = undefined;
      setDisablePress(true);
    } else if (!gameOver) {
      timerInterval = setInterval(() => {
        setScore(prevState => prevState - 20);
      }, 1000);

      refill(31);
      setThrownAwayArr([]);
      setBranches(defaultBranches);
      setScore(0);
    }

    return () => clearInterval(timerInterval);
  }, [gameOver]);

  useEffect(() => {
    if (paused) {
      clearInterval(timerInterval);
      timerInterval = undefined;
      setDisablePress(true);
    } else {
      console.log(timerInterval);
      if (!timerInterval) {
        timerInterval = setInterval(() => {
          setScore(prevState => prevState - 20);
        }, 1000);
      }

      setDisablePress(false);
    }
  }, [paused]);

  useEffect(() => {
    if (o2 <= 0) {
      setGameOver(true);
    }
  }, [o2]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [
              {translateY: offsetY},
              {
                skewY: '2deg',
              },
            ],
          },
        ]}>
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
        <Image
          resizeMode="stretch"
          source={images.space}
          style={[styles.image]}
        />
      </Animated.View>

      <TouchableOpacity
        style={styles.leftSide}
        onPress={() => handlePress('left')}>
        <View style={styles.side} />
      </TouchableOpacity>

      <View style={styles.middle} />

      <TouchableOpacity
        style={styles.rightSide}
        onPress={() => handlePress('right')}>
        <View style={styles.side} />
      </TouchableOpacity>

      <FlatList
        pointerEvents="none"
        style={styles.branchContainer}
        contentContainerStyle={{}}
        data={branches}
        renderItem={({item, index}) => (
          <Branch side={item.type} index={index} ref={item.ref} />
        )}
        keyExtractor={item => item.id.toString()}
      />

      <Player
        gameOver={gameOver}
        setCurrentSide={setCurrentSide}
        currentSide={currentSide}
        setDisablePress={setDisablePress}
        step={step}
      />

      <View style={styles.headerContainer}>
        <Text style={styles.score}>{score}</Text>

        <Pressable
          onPress={() => setPaused(true)}
          style={{
            position: 'absolute',
            right: 25,
            paddingHorizontal: 12,
            paddingBottom: 12,
          }}>
          {!paused && !gameOver && (
            <Text style={{fontSize: 32, color: 'white'}}>{'⏸︎'}</Text>
          )}
        </Pressable>
      </View>

      <OxygenMeter o2={o2} />

      <View style={styles.ground} pointerEvents="none">
        {thrownAwayArr}
      </View>

      {paused && (
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0,0,0,.3)',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {paused && (
            <Pressable
              style={{
                position: 'absolute',
                right: 25,
                top: '8%',
                paddingHorizontal: 12,
                paddingBottom: 12,
              }}
              onPress={() => setPaused(false)}>
              <Text
                style={{
                  fontSize: 32,
                  color: 'white',
                }}>
                {'⏵︎'}
              </Text>
            </Pressable>
          )}

          <Text style={{fontSize: 26, color: 'white'}}>PAUSED</Text>
        </View>
      )}

      <GameOverModal
        visible={gameOver}
        score={score}
        resetGame={() => setGameOver(false)}
      />
    </View>
  );
};

export default Game;
