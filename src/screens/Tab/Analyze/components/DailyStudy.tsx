import React, {useCallback, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import Chart from './Chart';
import {getStudyByDate} from '@/api/apiRouter';
import Loading from '@/components/Loading';
import {useAuth} from '@/contexts/AuthContext';
import {useRefresh} from '@/contexts/RefreshContext';
import {useTheme} from '@/contexts/ThemeContext';
import {addSign, calcPer} from '@/lib/sol';
import {formatTime} from '@/lib/timeUtils';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const DailyStudy = () => {
  const {user} = useAuth();
  const {theme, typography} = useTheme();
  const {refreshTrigger} = useRefresh();

  const [loading, setLoading] = useState(false);
  const [trueStudyHour, setTrueStudyHour] = useState<number>(0);
  const [exceptionalHour, setExceptionalHour] = useState<number>(0);
  const [non, setNon] = useState<number>(0);
  const [totalHour, setTotalHour] = useState<number>(0);
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [yesterday, setYesterday] = useState(() => {
    const yesterdayDate = new Date(today);
    yesterdayDate.setDate(today.getDate() - 1);
    return yesterdayDate;
  });
  const [yesterdayStudiedHour, setYesterdayHour] = useState<number>(0);

  const fetchData = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const dateString = startDate.toISOString().split('T')[0];
      const yesterdayString = yesterday.toISOString().split('T')[0];

      const data = await getStudyByDate(user.uid, dateString);
      const yesterdayData = await getStudyByDate(user.uid, yesterdayString);

      setTrueStudyHour(data?.pure_study ?? 0);
      setExceptionalHour(data?.non_study ?? 0);
      setTotalHour(data?.total ?? 0);
      setYesterdayHour(yesterdayData?.total ?? 0);
      setNon(!data?.total ? 10 : 0);
    } finally {
      setLoading(false);
    }
  }, [user, startDate, yesterday]);

  const onLeftPressed = () => {
    setStartDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() - 1);
      return newDate;
    });

    setYesterday(prev => {
      const newYesterday = new Date(prev);
      newYesterday.setDate(prev.getDate() - 1);
      return newYesterday;
    });
  };

  const onRightPressed = () => {
    setStartDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + 1);
      return newDate;
    });

    setYesterday(prev => {
      const newYesterday = new Date(prev);
      newYesterday.setDate(prev.getDate() - 1);
      return newYesterday;
    });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, startDate, refreshTrigger]);

  const pieData = [
    {value: trueStudyHour, color: '#344BFD'},
    {value: exceptionalHour, color: '#EE902C'},
    {value: non, color: '#C6CED1'},
  ];

  return (
    <View style={{gap: 12}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity activeOpacity={0.65} onPress={onLeftPressed} hitSlop={10}>
          <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.65}
          onPress={() => {
            const todayDate = new Date();
            setStartDate(todayDate);
            const yesterdayDate = new Date(todayDate);
            yesterdayDate.setDate(todayDate.getDate() - 1);
            setYesterday(yesterdayDate);
          }}
          style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>일간 공부 시간</Text>
          <Text style={[typography.body, {color: theme.text}]}>{startDate.toISOString().split('T')[0]}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.65} onPress={onRightPressed} hitSlop={10}>
          <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 18, gap: 8}}>
        <>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View>
              <Text style={[typography.body, {color: theme.text}]}>오늘 공부</Text>
              {loading ? (
                <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                  <SkeletonPlaceholder.Item width={30} height={24} marginTop={6} />
                </SkeletonPlaceholder>
              ) : (
                <>
                  <Text style={[typography.title, {color: theme.text}]}>{formatTime(totalHour)}</Text>
                </>
              )}
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <Text style={[typography.body, {color: theme.text}]}>어제보다</Text>
              {loading ? (
                <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                  <SkeletonPlaceholder.Item width={30} height={16} marginTop={4} />
                </SkeletonPlaceholder>
              ) : (
                <>
                  <Text style={[typography.body, {color: theme.primary, fontWeight: 500}]}>{addSign(totalHour - yesterdayStudiedHour)}분</Text>
                </>
              )}
            </View>
          </View>
          <Chart chartType="pie" pieData={pieData} />
          <View style={{gap: 4, marginTop: 16}}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <View style={{width: 15, height: 15, borderColor: '#344BFD', borderWidth: 3, borderRadius: 15 / 2}} />
                <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>순 공부시간</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                {loading ? (
                  <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                    <SkeletonPlaceholder.Item width={22} height={16} marginTop={0} />
                  </SkeletonPlaceholder>
                ) : (
                  <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{formatTime(trueStudyHour)}</Text>
                )}
                {loading ? (
                  <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                    <SkeletonPlaceholder.Item width={22} height={16} marginTop={0} />
                  </SkeletonPlaceholder>
                ) : (
                  <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{calcPer(totalHour, trueStudyHour)}%</Text>
                )}
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <View style={{width: 15, height: 15, borderColor: '#EE902C', borderWidth: 3, borderRadius: 15 / 2}} />
                <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>공부 이외 시간</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                {loading ? (
                  <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                    <SkeletonPlaceholder.Item width={22} height={16} marginTop={0} />
                  </SkeletonPlaceholder>
                ) : (
                  <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{formatTime(exceptionalHour)}</Text>
                )}
                {loading ? (
                  <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                    <SkeletonPlaceholder.Item width={22} height={16} marginTop={0} />
                  </SkeletonPlaceholder>
                ) : (
                  <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{calcPer(totalHour, exceptionalHour)}%</Text>
                )}
              </View>
            </View>
          </View>
        </>
      </View>
    </View>
  );
};

export default DailyStudy;
