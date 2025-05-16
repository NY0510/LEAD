import React, {Fragment} from 'react';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';

import ProfileSection from './components/ProfileSection';
import Card from '@/components/Card';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';

const Setting = () => {
  return (
    <Fragment>
      <ScrollView contentContainerStyle={{padding: 18}}>
        <View style={{gap: 22}}>
          <ProfileSection />
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default Setting;
