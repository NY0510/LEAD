import React, {useCallback, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import Chart from './Chart';
import Loading from '@/components/Loading';
import {useAuth} from '@/contexts/AuthContext';
import {useRefresh} from '@/contexts/RefreshContext';
import {useTheme} from '@/contexts/ThemeContext';
import {addSign, calcAvgPer} from '@/lib/sol';
import {getGoalArr, getTotalStudyArr, getWeekRange} from '@/lib/weekDataHandler';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const WeeklyGoal = () => {
  const {theme, typography} = useTheme();
  const {user} = useAuth();
  const {refreshTrigger} = useRefresh();

  const [week, setWeek] = useState(0);
  const [loading, setLoading] = useState(false);
  const [totalStudy, setTotalStudy] = useState([0]);
  const [privTotalStudy, setPrivTotalStudy] = useState([0]);
  const [goal, setGoal] = useState([0]);
  const [privGoal, setPrivGoal] = useState([0]);

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      const totalStudyData = await getTotalStudyArr(user.uid, week);
      const privTotalStudyData = await getTotalStudyArr(user.uid, week - 1);
      const goalData = await getGoalArr(user.uid, week);
      const privGoalData = await getGoalArr(user.uid, week - 1);

      setTotalStudy(totalStudyData.map(item => item ?? 0));
      setPrivTotalStudy(privTotalStudyData.map(item => item ?? 0));
      setGoal(goalData.map(item => item ?? 0));
      setPrivGoal(privGoalData.map(item => item ?? 0));
    } catch (error) {
      console.error('Error fetching weekly goal data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, week]);

  const onLeftPressed = () => {
    setWeek(week - 1);
  };
  const onRightPressed = () => {
    setWeek(week + 1);
  };

  const weeklyGoalData = totalStudy.map((val, i) => {
    if (val === 0) {
      return {
        stacks: [{value: goal[i], color: '#C6CED1'}],
        label: ['월', '화', '수', '목', '금', '토', '일'][i],
      };
    }

    return {
      stacks: [
        {value: val, color: '#FF7171'},
        {value: Math.max(goal[i] - val, 0), color: '#C6CED1'},
      ],
      label: ['월', '화', '수', '목', '금', '토', '일'][i],
    };
  });

  const isDataEmptyOrInvalid = totalStudy.every(val => val === 0 || isNaN(val)) && goal.every(val => val === 0 || isNaN(val));

  useEffect(() => {
    fetchData();
  }, [fetchData, week, refreshTrigger]);

  return (
    <View style={{gap: 12}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity activeOpacity={0.65} onPress={onLeftPressed} hitSlop={10}>
          <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.65} onPress={() => setWeek(0)} style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>주간 목표 달성률</Text>
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
                <Text style={[typography.body, {color: theme.text}]}>이번주 평균 달성률</Text>
                <Text style={[typography.title, {color: theme.text}]}>{calcAvgPer(totalStudy, goal) + '%'}</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={[typography.body, {color: theme.text}]}>지난주보다</Text>
                <Text style={[typography.body, {color: '#ff7171', fontWeight: 500}]}>{addSign(calcAvgPer(totalStudy, goal) - calcAvgPer(privTotalStudy, privGoal)) + '%'}</Text>
              </View>
            </View>
            {isDataEmptyOrInvalid ? (
              <Text style={{color: theme.text}}>데이터가 없습니다</Text>
            ) : (
              <Chart
                chartType="bar"
                barData={weeklyGoalData.map(item => ({
                  ...item,
                  stacks: item.stacks.map((stack, index) => {
                    if (index === 0) {
                      if (item.stacks.length > 1 && item.stacks[1].value) {
                        return {...stack, borderRadius: 0};
                      }
                    }
                    return stack;
                  }),
                }))}
              />
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default WeeklyGoal;
