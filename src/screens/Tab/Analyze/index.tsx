import React, {useCallback, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';

import DailyStudy from './components/DailyStudy';
import ProfileCard from './components/ProfileCard';
import WeeklyGoal from './components/WeeklyGoal';
import WeeklyStudy from './components/WeeklyStudy';
import {RefreshProvider, useRefresh} from '@/contexts/RefreshContext';
import {useTheme} from '@/contexts/ThemeContext';

const AnalyzeContent = () => {
  const {theme} = useTheme();
  const {triggerRefresh} = useRefresh();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    triggerRefresh(); // 컴포넌트들에게 새로고침 신호 전달
    setRefreshing(false);
  }, [triggerRefresh]);

  return (
    <ScrollView contentContainerStyle={{padding: 18}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.secondary} />}>
      <View style={{gap: 26, width: '100%'}}>
        <ProfileCard />
        <DailyStudy />
        <WeeklyStudy />
        <WeeklyGoal />
      </View>
    </ScrollView>
  );
};

const Analyze = () => {
  return (
    <RefreshProvider>
      <AnalyzeContent />
    </RefreshProvider>
  );
};
export default Analyze;
