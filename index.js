import dayjs from 'dayjs';
import React from 'react';
import {AppRegistry, Platform} from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';

import {name as appName} from './app.json';
import App from '@/App';
import {useTheme} from '@/contexts/ThemeContext';
import 'dayjs/locale/ko';

global.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

const Root = ({isHeadless}) => {
  const {theme, typography} = useTheme();

  enableScreens();
  dayjs.locale('ko');

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
