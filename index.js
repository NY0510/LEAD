import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {AppRegistry, Platform, Text, TextInput} from 'react-native';
import {setCustomImage, setCustomText, setCustomTouchableOpacity} from 'react-native-global-props';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';

import {name as appName} from './app.json';
import App from '@/App';
import {useTheme} from '@/contexts/ThemeContext';
// import {theme} from '@/styles/theme';
import 'dayjs/locale/ko';

global.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

const Root = ({isHeadless}) => {
  const {theme, typography} = useTheme();

  enableScreens();
  dayjs.locale('ko');
  setCustomText({style: {fontFamily: 'Pretendard Variable', color: theme.text}});
  setCustomImage({resizeMode: 'cover'});
  setCustomTouchableOpacity({
    activeOpacity: 0.85,
    hitSlop: {top: 10, bottom: 10, left: 10, right: 10},
  });

  if (Platform.OS === 'android') {
    changeNavigationBarColor('transparent', true);
  }

  if (isHeadless) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
};

AppRegistry.registerComponent(appName, () => Root);
