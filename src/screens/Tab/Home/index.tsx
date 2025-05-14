import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import * as Progress from 'react-native-progress';

import {getUser, signup} from '@/api';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import TouchableScale from '@/components/TouchableScale';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {RootStackParamList} from '@/navigations/RootStacks';
import {toDP} from '@/theme/typography';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const Home = () => {
  const {user, signOut} = useAuth();
  const {theme, typography} = useTheme();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    (async () => {
      if (user) {
        const userData = await getUser(user.uid);
        if (!userData) {
          await signup(user.uid);
        }
      }
    })();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={{padding: 18}}>
      <View style={{gap: 22}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
          <View style={{flexWrap: 'wrap'}}>
            <Text style={[typography.subtitle, {color: theme.primary, fontWeight: 600}]}>{user?.displayName}</Text>
            <Text style={[typography.subtitle, {color: theme.text}]}>님의 하루를 LEAD가 응원할게요!</Text>
          </View>
          <Image source={require('@/assets/images/rock.png')} style={{width: 64, height: 64}} />
        </View>

        <TouchableOpacity activeOpacity={0.7}>
          <View style={{backgroundColor: theme.global.white, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
            <View style={{borderLeftWidth: 15, borderRightWidth: 15, borderBottomWidth: 20, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#fff', position: 'absolute', top: -20, right: 20}} />
            <Text style={[typography.subtitle, {color: theme.secondary, fontWeight: 600, flexShrink: 1}]}>오늘의 목표나 간단한 메모를 적어보세요!</Text>
            <FontAwesome6 name="pen" size={18} color={theme.secondary} iconStyle="solid" />
          </View>
        </TouchableOpacity>

        <Card title="LEAD와 공부 시작하기">
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <TouchableOpacity activeOpacity={0.7}>
              <View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <Text style={{fontSize: toDP(36), fontWeight: 600, color: theme.secondary}}>2시간 30분</Text>
                  <FontAwesome6 name="pen" size={18} color={theme.secondary} iconStyle="solid" />
                </View>
                <Text style={[typography.body, {fontWeight: 600, color: theme.secondary}]}>/ 4시간 00분</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Study')}>
              <TouchableScale>
                <View style={{backgroundColor: theme.background, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                  <FontAwesome6 name="play" size={26} color={theme.primary} iconStyle="solid" />
                </View>
              </TouchableScale>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
            <Progress.Bar style={{flex: 1}} progress={0.4} width={null} height={8} borderWidth={0} color={theme.primary} unfilledColor={theme.background} borderRadius={4} />
            <Text style={[typography.body, {color: theme.text}]}>40%</Text>
          </View>
        </Card>

        <Card title="내 공부방">
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', rowGap: 12}}>
            {Array.from({length: 6}, (_, i) => i + 1).map(num => (
              <TouchableOpacity key={num} activeOpacity={0.7}>
                <TouchableScale>
                  <View style={{backgroundColor: theme.background, padding: 20, borderRadius: 16, flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={[typography.body, {color: theme.text, fontWeight: 600}]}>공부방 {num}</Text>
                  </View>
                </TouchableScale>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        <Card title="오늘의 공부">
          <ProgressBar
            segments={[
              {value: 0.6, color: '#344BFD', label: '순 공부'},
              {value: 0.3, color: '#F68D2B', label: '공부 이외'},
            ]}
            height={22}
            borderRadius={10}
            showLabels={true}
          />
        </Card>
      </View>
    </ScrollView>
  );
};

export default Home;
