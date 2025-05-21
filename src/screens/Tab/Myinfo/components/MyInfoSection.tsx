import React from 'react';
import {View} from 'react-native';

import Content from './Content';
import Card from '@/components/Card';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';

const MyInfoSection = () => {
  const {user} = useAuth();
  const {typography} = useTheme();

  return (
    <Card title="내 정보" titleStyle={{fontSize: typography.body.fontSize}}>
      <View style={{gap: 8, marginTop: 8}}>
        <Content title="이름" content={user?.displayName!} />
        <Content title="이메일" content={user?.email!} />
      </View>
    </Card>
  );
};

export default MyInfoSection;
