import React from 'react';
import {StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';

import {AuthProvider} from '@/contexts/AuthContext';
import {ThemeProvider, useTheme} from '@/contexts/ThemeContext';
import Stacks from '@/navigations/RootStacks';

const App = () => {
  const {theme, isDark} = useTheme();

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <AuthProvider>
          <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
            <StatusBar animated barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <Stacks />
          </SafeAreaView>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
};

export default App;
