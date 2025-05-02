/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {GestureResponderEvent, TouchableOpacity} from 'react-native';

import TouchableScale from '@/components/TouchableScale';
import {useTheme} from '@/contexts/ThemeContext';
import Analyze from '@/screens/Tab/Analyze';
import Home from '@/screens/Tab/Home';
import Setting from '@/screens/Tab/Setting';
import Study from '@/screens/Tab/Study';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const BottomTab = createBottomTabNavigator();

const BottomTabs = () => {
  const {theme, typography} = useTheme();

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
        headerTitleStyle: [typography.body, {color: theme.text, fontWeight: '600'}],
        headerStyle: {
          height: 48,
          backgroundColor: theme.background,
          shadowColor: 'transparent',
          borderBottomColor: theme.inactive,
          borderBottomWidth: 1,
        },
        tabBarActiveTintColor: theme.text,
        tabBarInactiveTintColor: theme.inactive,
        tabBarLabelStyle: [typography.body, {fontSize: 12, lineHeight: 15}],
        tabBarButton: props => (props.onPress ? <TabBarButton children={props.children} onPress={event => props.onPress && props.onPress(event!)} /> : null),
        tabBarIcon: props => <TabBarIcon route={route} size={20} color={props.color} />,
      })}>
      <BottomTab.Screen name="Home" component={Home} options={{title: '홈'}} />
      <BottomTab.Screen name="Analyze" component={Analyze} options={{title: '분석', headerShown: true}} />
      <BottomTab.Screen name="Study" component={Study} options={{title: '공부방'}} />
      <BottomTab.Screen name="Setting" component={Setting} options={{title: '설정'}} />
    </BottomTab.Navigator>
  );
};

const TabBarButton = ({children, onPress}: {children: React.ReactNode; onPress: (event?: GestureResponderEvent) => void}) => {
  return (
    <TouchableScale scaleTo={0.9} onPress={onPress} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity activeOpacity={0.8} style={{justifyContent: 'center', alignItems: 'center'}}>
        {children}
      </TouchableOpacity>
    </TouchableScale>
  );
};

const TabBarIcon = ({route, size, color}: {route: {name: string}; size: number; color: string}) => {
  switch (route.name) {
    case 'Home':
      return <FontAwesome6 name="house" iconStyle="solid" size={size} color={color} />;
    case 'Analyze':
      return <FontAwesome6 name="chart-simple" iconStyle="solid" size={size} color={color} />;
    case 'Study':
      return <FontAwesome6 name="book" iconStyle="solid" size={size} color={color} />;
    case 'Setting':
      return <FontAwesome6 name="gear" iconStyle="solid" size={size} color={color} />;
    default:
      return null;
  }
};

export default BottomTabs;
