/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import {GestureResponderEvent, Linking} from 'react-native';
import TouchableScale from 'react-native-touchable-scale';

import {useTheme} from '@/contexts/ThemeContext';
import Analyze from '@/screens/Tab/Analyze';
import Home from '@/screens/Tab/Home';
import Myinfo from '@/screens/Tab/Myinfo';
import StudyRoom from '@/screens/Tab/StudyRoom';
import {toDP} from '@/theme/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export type BottomTabParamList = {
  Home: undefined;
  Analyze: undefined;
  StudyRoom: undefined;
  Myinfo: undefined;
};

const BottomTabs = () => {
  const {theme, typography} = useTheme();

  useEffect(() => {
    (async () => {
      const openedDeepLinkUrl = await AsyncStorage.getItem('openedDeepLinkUrl');
      if (openedDeepLinkUrl) {
        await AsyncStorage.removeItem('openedDeepLinkUrl');
        Linking.openURL(openedDeepLinkUrl);
      }
    })();
  }, []);

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      backBehavior="firstRoute"
      screenOptions={({route}) => ({
        headerShown: false,
        animation: 'shift',
        freezeOnBlur: true,
        sceneStyle: {backgroundColor: theme.background},
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.inactive,
          paddingBottom: 0,
          height: 60,
          borderColor: theme.inactive,
          borderTopWidth: 1,
        },
        headerStatusBarHeight: 0,
        headerTitleAlign: 'left',
        headerTitleStyle: [typography.body, {color: theme.text, fontWeight: '500', fontSize: toDP(20)}],
        headerStyle: {
          height: 48,
          backgroundColor: theme.background,
          shadowColor: 'transparent',
          borderBottomColor: theme.inactive,
          borderBottomWidth: 1,
        },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.inactive,
        tabBarLabelStyle: [typography.body, {fontSize: toDP(12), lineHeight: toDP(15)}],
        tabBarButton: props => (props.onPress ? <TabBarButton children={props.children} onPress={event => props.onPress && props.onPress(event!)} /> : null),
        tabBarIcon: props => <TabBarIcon route={route} size={20} color={props.color} />,
      })}>
      <BottomTab.Screen name="Home" component={Home} options={{title: '홈'}} />
      <BottomTab.Screen name="Analyze" component={Analyze} options={{title: '분석'}} />
      <BottomTab.Screen name="StudyRoom" component={StudyRoom} options={{title: '공부방'}} />
      <BottomTab.Screen name="Myinfo" component={Myinfo} options={{title: '내 정보'}} />
    </BottomTab.Navigator>
  );
};

const TabBarButton = ({children, onPress}: {children: React.ReactNode; onPress: (event?: GestureResponderEvent) => void}) => {
  return (
    <TouchableScale activeScale={0.95} tension={40} friction={3} onPress={onPress} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <TouchableOpacity activeOpacity={0.8} style={{justifyContent: 'center', alignItems: 'center'}}> */}
      {children}
      {/* </TouchableOpacity> */}
    </TouchableScale>
  );
};

const TabBarIcon = ({route, size, color}: {route: {name: string}; size: number; color: string}) => {
  switch (route.name) {
    case 'Home':
      return <FontAwesome6 name="house" iconStyle="solid" size={size} color={color} />;
    case 'Analyze':
      return <FontAwesome6 name="chart-simple" iconStyle="solid" size={size} color={color} />;
    case 'StudyRoom':
      return <FontAwesome6 name="book" iconStyle="solid" size={size} color={color} />;
    case 'Myinfo':
      return <FontAwesome6 name="user" iconStyle="solid" size={size} color={color} />;
    default:
      return null;
  }
};

export default BottomTabs;
