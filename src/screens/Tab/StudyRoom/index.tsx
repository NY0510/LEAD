import React from 'react';
import {Text, View} from 'react-native';

import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';

const StudyRoom = () => {
  const {user, signOut} = useAuth();
  const {theme, typography} = useTheme();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={[typography.title]}>공부방 화면</Text>
    </View>
  );
};

export default StudyRoom;
