import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Home from 'src/screens/Home';
import Game from 'src/screens/Game';

const Stack = createStackNavigator();

const RootStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{ gestureEnabled: false, headerShown: false }}
  >
    <Stack.Screen component={Home} name="Home" />
    <Stack.Screen component={Game} name="Game" />
  </Stack.Navigator>
);

export default RootStack;
