import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {AuthProvider} from '@/contexts/AuthContext';
import {ThemeProvider, useTheme} from '@/contexts/ThemeContext';
import {getToastConfig} from '@/lib/toast';
import Stacks from '@/navigations/RootStacks';

const App = () => {
  const {theme, typography, isDark} = useTheme();

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <AuthProvider>
          <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
            <StatusBar animated barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <Stacks />
          </SafeAreaView>
          <Toast config={getToastConfig(theme, typography)} />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
