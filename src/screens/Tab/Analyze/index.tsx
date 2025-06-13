import React, {useCallback, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';

import DailyStudy from './components/DailyStudy';
import ProfileCard from './components/ProfileCard';
import WeeklyGoal from './components/WeeklyGoal';
import WeeklyStudy from './components/WeeklyStudy';
import {RefreshProvider, useRefresh} from '@/contexts/RefreshContext';
import {useTheme} from '@/contexts/ThemeContext';
import {BottomTabParamList} from '@/navigations/BottomTabs';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const AnalyzeContent = () => {
  const {theme} = useTheme();
  const {triggerRefresh} = useRefresh();
  const bottomTabNavigation = useNavigation<NavigationProp<BottomTabParamList>>();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    triggerRefresh();
    setRefreshing(false);
  }, [triggerRefresh]);
  useEffect(() => {
    const unsubscribe = bottomTabNavigation.addListener('focus', () => {
      triggerRefresh();
    });
    return unsubscribe;
  }, []);

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
