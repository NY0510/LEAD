import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {AuthProvider} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {getToastConfig} from '@/lib/toast';
import Stacks from '@/navigations/RootStacks';

const App = () => {
  const {theme, typography, isDark} = useTheme();

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
        <AuthProvider>
          <StatusBar animated barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
          <Stacks />
        </AuthProvider>
      </SafeAreaView>
      <Toast config={getToastConfig(theme, typography)} />
    </GestureHandlerRootView>
  );
};

export default App;
