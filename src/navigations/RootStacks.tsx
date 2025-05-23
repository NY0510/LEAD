import React, {Fragment, useEffect} from 'react';
import {Platform} from 'react-native';
import BootSplash from 'react-native-bootsplash';

import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import BottomTabs from '@/navigations/BottomTabs';
import CreateStudyRoom from '@/screens/CreateStudyRoom';
import JoinStudyRoom from '@/screens/JoinStudyRoom';
import Login from '@/screens/Login';
import Study from '@/screens/Study';
import DeveloperInfo from '@/screens/Tab/Myinfo/components/DeveloperInfo';
import {toDP} from '@/theme/typography';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  Login: undefined;
  Tab: undefined;
  Study: undefined;
  DeveloperInfo: undefined;
  JoinStudyRoom: {id: string};
  CreateStudyRoom: undefined;
};

const RootStacks = () => {
  const {user, initializing} = useAuth();
  const {theme, typography} = useTheme();

  useEffect(() => {
    if (!initializing) {
      BootSplash.hide({fade: true});
    }
  }, [initializing]);

  if (initializing) {
    return null;
  }

  return (
    <Stack.Navigator
      initialRouteName={user ? 'Tab' : 'Login'}
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === 'ios' ? 'slide_from_right' : 'scale_from_center',
        freezeOnBlur: true,
        cardStyle: {backgroundColor: theme.background},
        headerStatusBarHeight: 0,
        headerTitleAlign: 'left',
        headerTitleStyle: [typography.body, {color: theme.text, fontWeight: '500', fontSize: toDP(18)}],
        headerStyle: {
          backgroundColor: theme.background,
          shadowColor: 'transparent',
          borderBottomColor: theme.inactive,
          borderBottomWidth: 1,
        },
        headerLeftContainerStyle: {paddingLeft: 4},
        headerBackButtonDisplayMode: 'minimal',
        headerBackAccessibilityLabel: '뒤로가기',
      }}>
      {user ? (
        <Fragment>
          <Stack.Screen name="Tab" component={BottomTabs} />
          <Stack.Screen name="Study" component={Study} />
          <Stack.Screen name="DeveloperInfo" component={DeveloperInfo} options={{headerShown: true, title: '갈려나간 사람들'}} />
          <Stack.Screen name="JoinStudyRoom" component={JoinStudyRoom} options={{headerShown: true, title: '공부방 참여'}} />
          <Stack.Screen name="CreateStudyRoom" component={CreateStudyRoom} options={{headerShown: true, title: '공부방 만들기'}} />
        </Fragment>
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
};

export default RootStacks;
