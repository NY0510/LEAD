import React from 'react';
import {Text, View} from 'react-native';

import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';

const Home = () => {
  const {user, signOut} = useAuth();
  const {theme, typography} = useTheme();

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={[typography.title]}>홈 화면</Text>

      <Text style={[typography.body]}>{user?.email}</Text>
      <Text style={[typography.body]}>{user?.displayName}</Text>
      <Text style={[typography.body]} onPress={signOut}>
        로그아웃
      </Text>
    </View>
  );
};

export default Home;
