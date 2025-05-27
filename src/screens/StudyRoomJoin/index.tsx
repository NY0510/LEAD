import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

import {useTheme} from '@/contexts/ThemeContext';
import {RootStackParamList} from '@/navigations/RootStacks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {RouteProp, useRoute} from '@react-navigation/native';

const StudyRoomJoin = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'StudyRoomJoin'>>();
  const id = route.params.id || null;

  const {theme, typography} = useTheme();

  useEffect(() => {
    (async () => {
      await AsyncStorage.removeItem('openedDeepLinkUrl');
    })();
  }, []);

  if (!id) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12}}>
        <FontAwesome6 name="face-frown" iconStyle="regular" size={40} color={theme.inactive} />
        <Text style={[typography.body, {color: theme.secondary}]}>비정상적인 접근이에요.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={[typography.title, {color: theme.text}]}>deeplink received</Text>
      <Text style={[typography.title, {color: theme.text}]}>id: {id}</Text>
    </View>
  );
};

export default StudyRoomJoin;
