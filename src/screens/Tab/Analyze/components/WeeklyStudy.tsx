import React, {useCallback, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import Chart from './Chart';
import Loading from '@/components/Loading';
import {useAuth} from '@/contexts/AuthContext';
import {useRefresh} from '@/contexts/RefreshContext';
import {useTheme} from '@/contexts/ThemeContext';
import {calcPer, sumArr} from '@/lib/sol';
import {formatTime} from '@/lib/timeUtils';
import {getNonStudyArr, getPureStudyArr, getTotalStudyArr, getWeekAvg, getWeekRange} from '@/lib/weekDataHandler';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const WeeklyStudy = () => {
  const {theme, typography} = useTheme();
  const {user} = useAuth();
  const {refreshTrigger} = useRefresh();

  const [week, setWeek] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pureStudy, setPureStudy] = useState([0]);
  const [nonStudy, setNonStudy] = useState([0]);
  const [totalStudy, setTotalStudy] = useState([0]);
  const [weekAvg, setWeekAvg] = useState(0);
  const [privWeekAvg, setPrivWeekAvg] = useState(0);

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      const pureStudyData = await getPureStudyArr(user.uid, week);
      const nonStudyData = await getNonStudyArr(user.uid, week);
      const totalStudyData = await getTotalStudyArr(user.uid, week);
      const weekAvgData = await getWeekAvg(user.uid, week);
      const privWeekAvgData = await getWeekAvg(user.uid, week - 1);

      setPureStudy(pureStudyData.map(item => item ?? 0));
      setNonStudy(nonStudyData.map(item => item ?? 0));
      setTotalStudy(totalStudyData.map(item => item ?? 0));
      setWeekAvg(weekAvgData ?? 0);
      setPrivWeekAvg(privWeekAvgData ?? 0);
    } catch (error) {
      console.error('Error fetching weekly study data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, week]);

  const onLeftPressed = () => {
    setWeek(week - 1);
    fetchData();
  };
  const onRightPressed = () => {
    setWeek(week + 1);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const stackData = pureStudy.map((val, i) => ({
    stacks: [
      {value: val, color: '#344BFD'},
      {value: nonStudy[i], color: '#EE902C'},
    ],
    label: ['월', '화', '수', '목', '금', '토', '일'][i],
  }));

  // 데이터가 0 또는 NaN이면 처리할 조건 추가
  const isDataEmptyOrInvalid = pureStudy.every(val => val === 0 || isNaN(val)) && nonStudy.every(val => val === 0 || isNaN(val));

  return (
    <View style={{gap: 12}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity activeOpacity={0.65} onPress={onLeftPressed} hitSlop={10}>
          <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.65} onPress={() => setWeek(0)} style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>주간 공부 시간</Text>
          <Text style={[typography.body, {color: theme.text}]}>{getWeekRange(week)}</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.65} onPress={onRightPressed} hitSlop={10}>
          <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: theme.card, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 18, gap: 8}}>
        {loading ? (
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Loading fullScreen={false} />
          </View>
        ) : (
          <>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View>
                <Text style={[typography.body, {color: theme.text}]}>이번주 평균</Text>
                <Text style={[typography.title, {color: theme.text}]}>{formatTime(weekAvg)}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={[typography.body, {color: theme.text}]}>지난주보다</Text>
                <Text style={[typography.body, {color: theme.primary, fontWeight: 500}]}>{formatTime(weekAvg - privWeekAvg)}</Text>
              </View>
            </View>

            {/* 삼항 연산자 사용하여 데이터가 없으면 다른 UI를 렌더링 */}
            {isDataEmptyOrInvalid ? (
              <Text style={{color: theme.text}}>데이터가 없습니다</Text> // 데이터가 없을 때 표시할 메시지
            ) : (
              <>
                <Chart
                  chartType="bar"
                  barData={stackData.map(item => ({
                    ...item,
                    stacks: item.stacks.map((stack, index) => {
                      // 공부 이외 시간이 0이면 순 공부시간(첫번째 스택)에 상단 둥근 모서리 적용
                      const nonStudyValue = item.stacks[1]?.value || 0;
                      if (index === 0) {
                        return {
                          ...stack,
                          borderTopLeftRadius: nonStudyValue === 0 ? 12 : 0,
                          borderTopRightRadius: nonStudyValue === 0 ? 12 : 0,
                        };
                      }
                      return stack;
                    }),
                  }))}
                />
                <View style={{gap: 4, marginTop: 16}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                      <View style={{width: 15, height: 15, borderColor: '#344BFD', borderWidth: 3, borderRadius: 15 / 2}} />
                      <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>순 공부시간</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                      <Text style={[typography.body, {color: theme.text, fontWeight: '400'}]}>{formatTime(sumArr(pureStudy))}</Text>
                      <Text style={[typography.body, {color: theme.text, fontWeight: '400'}]}>{calcPer(sumArr(totalStudy), sumArr(pureStudy)) + '%'}</Text>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                      <View style={{width: 15, height: 15, borderColor: '#EE902C', borderWidth: 3, borderRadius: 15 / 2}} />
                      <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>공부 이외 시간</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                      <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{formatTime(sumArr(nonStudy))}</Text>
                      <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{calcPer(sumArr(totalStudy), sumArr(nonStudy)) + '%'}</Text>
                    </View>
                  </View>
                </View>
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default WeeklyStudy;
