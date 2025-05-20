import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';

import DailyStudy from './components/DailyStudy';
import ProfileCard from './components/ProfileCard';
import WeeklyGoal from './components/WeeklyGoal';
import WeeklyStudy from './components/WeeklyStudy';
import {useTheme} from '@/contexts/ThemeContext';

const Analyze = () => {
  const {theme} = useTheme();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshing(false);
  }, []);

  return (
    <ScrollView contentContainerStyle={{padding: 18}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.inactive} />}>
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
