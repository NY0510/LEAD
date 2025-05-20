import React from 'react';
import {Easing, Image, Text, TouchableOpacity, View} from 'react-native';

import TouchableScale from '@/components/TouchableScale';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {showToast} from '@/lib/toast';
import {toDP} from '@/theme/typography';

const ProfileSection = () => {
  const {user, signOut} = useAuth();
  const {theme, typography} = useTheme();

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', gap: 12}}>
      <Image source={{uri: user?.photoURL!, cache: 'force-cache'}} style={{width: 120, height: 120, backgroundColor: theme.border}} borderRadius={120 / 2} />
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{color: theme.text, fontWeight: '700', fontSize: toDP(24)}}>{user ? user.displayName : '게스트'}</Text>
        <Text style={{color: theme.secondary, fontWeight: '500', fontSize: toDP(16)}}>{user ? user.email : '로그인해 주세요'}</Text>
      </View>

      <View style={{width: '100%'}}>
        <TouchableScale
          style={{flex: 1}}
          pressInEasing={Easing.elastic(0.5)}
          pressOutEasing={Easing.elastic(0.5)}
          pressInDuration={100}
          pressOutDuration={100}
          scaleTo={0.98}
          onPress={() => {
            signOut()
              .then(() => showToast('로그아웃 완료'))
              .catch(error => showToast(`로그아웃에 실패했어요:\n${error.message}`));
          }}>
          <TouchableOpacity style={{flex: 1}}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.border,
                paddingVertical: 12,
              }}>
              <Text style={{color: theme.text, fontWeight: '700', fontSize: toDP(Number(typography.body.fontSize))}}>로그아웃</Text>
            </View>
          </TouchableOpacity>
        </TouchableScale>
      </View>
    </View>
  );
};

export default ProfileSection;
