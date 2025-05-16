import React, {useState} from 'react';
import {Image, Text, View} from 'react-native';

import FireSvg from '@/assets/images/fire.svg';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';

const ProfileCard = () => {
  const {user} = useAuth();
  const {theme, typography} = useTheme();
  const [focusedAvg, setFocusedAvg] = useState(0);

  return (
    <View style={{backgroundColor: '#fff', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 12}}>
      <Image source={require('@/assets/images/rock.png')} style={{width: 64, height: 64}} />
      <View style={{flexShrink: 1}}>
        <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>{user?.displayName}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
          <Text style={[typography.body, {color: theme.red, fontWeight: '600'}]}>평균 집중도 {focusedAvg}%</Text>
          <FireSvg width={16} height={16} />
        </View>
      </View>
    </View>
  );
};

export default ProfileCard;
