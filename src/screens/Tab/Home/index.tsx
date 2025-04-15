import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import * as Progress from 'react-native-progress';

import TouchableScale from '@/components/TouchableScale';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {toDP} from '@/theme/typography';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const Home = () => {
  const {user, signOut} = useAuth();
  const {theme, typography} = useTheme();

  return (
    <View style={{alignItems: 'center', padding: 26}}>
      <View style={{gap: 22}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
          <View style={{flexWrap: 'wrap'}}>
            <Text style={[typography.subtitle, {color: theme.primary, fontWeight: 600}]}>{user?.displayName}</Text>
            <Text style={[typography.subtitle, {color: theme.text}]}>님의 하루를 LEAD가 응원할게요!</Text>
          </View>
          <Image source={require('@/assets/images/rock.png')} style={{width: 64, height: 64}} />
        </View>

        <TouchableOpacity activeOpacity={0.7}>
          <View style={{backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
            <View style={{borderLeftWidth: 15, borderRightWidth: 15, borderBottomWidth: 20, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#fff', position: 'absolute', top: -20, right: 20}} />
            <Text style={[typography.subtitle, {color: theme.secondary, fontWeight: 600, flexShrink: 1}]}>오늘의 목표나 간단한 메모를 적어보세요!</Text>
            <FontAwesome6 name="pen" size={18} color={theme.secondary} iconStyle="solid" />
          </View>
        </TouchableOpacity>

        <View style={{backgroundColor: '#fff', borderRadius: 16, padding: 16, justifyContent: 'space-between', gap: 12}}>
          <View>
            <Text style={[typography.subtitle, {color: theme.primary, fontWeight: 600}]}>LEAD와 공부 시작하기</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
              <Text style={{fontSize: toDP(36), fontWeight: 600, color: theme.secondary}}>2시간 30분</Text>
              <Text style={[typography.body, {fontWeight: 600, color: theme.secondary}]}>/ 4시간 00분</Text>
            </View>
            <TouchableScale>
              <View style={{backgroundColor: theme.background, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                <FontAwesome6 name="play" size={26} color={theme.primary} iconStyle="solid" />
              </View>
            </TouchableScale>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
            <Progress.Bar style={{flex: 1}} progress={0.4} width={null} height={8} borderWidth={0} color={theme.primary} unfilledColor={theme.background} borderRadius={4} />
            <Text style={[typography.body, {color: theme.text}]}>40%</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;
