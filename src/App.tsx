import React from 'react';
import {Linking, StatusBar} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import {AuthProvider, useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {getToastConfig} from '@/lib/toast';
import Stacks, {RootStackParamList} from '@/navigations/RootStacks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinkingOptions, NavigationContainer, NavigationIndependentTree} from '@react-navigation/native';

const App = () => {
  const {theme, typography, isDark} = useTheme();
  const {user} = useAuth();

  const linkingConfig: LinkingOptions<RootStackParamList> = {
    prefixes: ['lead://', 'https://lead.ny64.kr'],
    config: {
      initialRouteName: 'Tab',
      screens: {
        StudyRoomJoin: '/studyroom/join/:id',
      },
    },
    async getInitialURL() {
      const url = await Linking.getInitialURL();

      if (url != null) {
        if (!user) {
          await AsyncStorage.setItem('openedDeepLinkUrl', url ?? '');
        }

        return url;
      }
    },
    subscribe(listener) {
      const onReceiveURL = async ({url}: {url: string}) => {
        if (!user) {
          await AsyncStorage.setItem('openedDeepLinkUrl', url ?? '');
        }

        listener(url);
      };

      const subscription = Linking.addEventListener('url', onReceiveURL);

      return () => {
        subscription.remove();
      };
    },
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{flex: 1, backgroundColor: theme.background}}>
        <AuthProvider>
          <StatusBar animated barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
          <NavigationContainer linking={linkingConfig}>
            <NavigationIndependentTree>
              <Stacks />
            </NavigationIndependentTree>
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaView>
      <Toast config={getToastConfig(theme, typography)} />
    </GestureHandlerRootView>
  );
};

export default App;
