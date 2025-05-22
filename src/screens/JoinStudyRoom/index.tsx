import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

import {useTheme} from '@/contexts/ThemeContext';
import {RootStackParamList} from '@/navigations/RootStacks';
import {RouteProp, useRoute} from '@react-navigation/native';

const JoinStudyRoom = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'JoinStudyRoom'>>();
  const id = route.params?.id;

  const {theme, typography} = useTheme();

  return (
    <View>
      <Text style={[typography.title, {color: theme.text}]}>deeplink received</Text>
      <Text style={[typography.title, {color: theme.text}]}>id: {id}</Text>
    </View>
  );
};

export default JoinStudyRoom;
