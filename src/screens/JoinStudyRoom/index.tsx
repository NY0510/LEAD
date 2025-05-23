import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

import {useTheme} from '@/contexts/ThemeContext';
import {RootStackParamList} from '@/navigations/RootStacks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RouteProp, useRoute} from '@react-navigation/native';

const JoinStudyRoom = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'JoinStudyRoom'>>();
  const id = route.params?.id;

  const {theme, typography} = useTheme();

  useEffect(() => {
    (async () => {
      await AsyncStorage.removeItem('openedDeepLinkUrl');
    })();
  }, []);

  return (
    <View>
      <Text style={[typography.title, {color: theme.text}]}>deeplink received</Text>
      <Text style={[typography.title, {color: theme.text}]}>id: {id}</Text>
    </View>
  );
};

export default JoinStudyRoom;
