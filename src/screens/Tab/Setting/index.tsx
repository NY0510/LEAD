import React, {Fragment} from 'react';
import {ScrollView, View} from 'react-native';

import AppInfoSection from './components/AppInfoSection';
import MyInfoCard from './components/MyInfoSection';
import ProfileSection from './components/ProfileSection';

const Setting = () => {
  return (
    <Fragment>
      <ScrollView contentContainerStyle={{padding: 18}}>
        <ProfileSection />
        <View style={{gap: 8, marginTop: 18}}>
          <MyInfoCard />
          <AppInfoSection />
        </View>
      </ScrollView>
    </Fragment>
  );
};

export default Setting;
