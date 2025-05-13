import React from 'react';
import {ScrollView, View} from 'react-native';

import DailyStudy from './components/DailyStudy';
import ProfileCard from './components/ProfileCard';
import WeeklyGoal from './components/WeeklyGoal';
import WeeklyStudy from './components/WeeklyStudy';

const Analyze = () => {
  return (
    <ScrollView contentContainerStyle={{alignItems: 'center', padding: 18}}>
      <View style={{gap: 26, width: '100%'}}>
        <ProfileCard />
        <DailyStudy />
        <WeeklyStudy />
        <WeeklyGoal />
      </View>
    </ScrollView>
  );
};
export default Analyze;
