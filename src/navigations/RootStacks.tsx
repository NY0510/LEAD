import React from 'react';
import {Platform} from 'react-native';

import Loading from '@/components/Loading';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import BottomTabs from '@/navigations/BottomTabs';
import Login from '@/screens/Login';
import {createStaticNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

export type RootStackParamList = {
  Login: undefined;
  Tab: undefined;
};

const RootStacks = () => {
  const {user, initializing} = useAuth();
  const {theme, typography} = useTheme();

  if (initializing) {
    return <Loading fullScreen />;
  }

  const RootStack = createStackNavigator({
    initialRouteName: user ? 'Tab' : 'Login',
    screenOptions: {
      headerShown: false,
      animation: Platform.OS === 'ios' ? 'slide_from_right' : 'scale_from_center', // ios: slide_from_right, android: scale_from_center
      freezeOnBlur: true,
      cardStyle: {backgroundColor: theme.background},
      headerStatusBarHeight: 0,
      headerStyle: {
        backgroundColor: theme.background,
        shadowColor: 'transparent',
        borderBottomColor: theme.inactive,
        borderBottomWidth: 1,
      },
      headerTitleAlign: 'left',
      headerTitleStyle: [typography.body, {color: theme.text}],
      headerLeftContainerStyle: {paddingLeft: 4},
      headerBackButtonDisplayMode: 'minimal',
      headerBackAccessibilityLabel: '뒤로가기',
    },
    screens: {
      Login: Login,
      Tab: BottomTabs,
    },
  });
  const Stack = createStaticNavigation(RootStack);

  return <Stack />;
};

export default RootStacks;
