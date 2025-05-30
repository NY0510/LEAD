import React, {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import Chart from './Chart';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {addSign, calcAvgPer} from '@/lib/sol';
import {getGoalArr, getTotalStudyArr, getWeekRange} from '@/lib/weekDataHandler';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const WeeklyGoal = () => {
  const {theme, typography} = useTheme();
  const {user} = useAuth();
  const [week, setWeek] = useState(0);
  const [totalStudy, setTotalStudy] = useState([0]);
  const [privTotalStudy, setPrivTotalStudy] = useState([0]);
  const [goal, setGoal] = useState([0]);
  const [privGoal, setPrivGoal] = useState([0]);

  const fetchData = async () => {
    if (!user) {
      return;
    }

    const totalStudyData = await getTotalStudyArr(user.uid, week);
    const privTotalStudyData = await getTotalStudyArr(user.uid, week - 1);
    const goalData = await getGoalArr(user.uid, week);
    const privGoalData = await getGoalArr(user.uid, week - 1);

    // 각 배열 항목에 대해 null 또는 undefined를 0으로 처리
    setTotalStudy(totalStudyData.map(item => item ?? 0)); // 배열의 각 항목 처리
    setPrivTotalStudy(privTotalStudyData.map(item => item ?? 0));
    setGoal(goalData.map(item => item ?? 0));
    setPrivGoal(privGoalData.map(item => item ?? 0));

    console.log(totalStudy, goal); // 여기서도 배열 길이를 유지하며 출력
  };

  const onLeftPressed = () => {
    setWeek(week - 1);
    fetchData();
  };
  const onRightPressed = () => {
    setWeek(week + 1);
    fetchData();
  };

  const weeklyGoalData = totalStudy.map((val, i) => ({
    stacks: [
      {value: val, color: '#FF7171'},
      {value: Math.max(goal[i] - val, 0), color: '#C6CED1'},
    ],
    label: ['월', '화', '수', '목', '금', '토', '일'][i],
  }));

  // totalStudy와 goal이 모두 0 또는 NaN인 경우를 확인하는 조건
  const isDataEmptyOrInvalid = totalStudy.every(val => val === 0 || isNaN(val)) && goal.every(val => val === 0 || isNaN(val));

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{gap: 12}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity activeOpacity={0.65} onPress={onLeftPressed}>
          <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
        <View style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>주간 목표 달성률</Text>
          <Text style={[typography.body, {color: theme.text}]}>{getWeekRange(week)}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.65} onPress={onRightPressed}>
          <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 18, gap: 8}}>
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

        {/* 삼항 연산자를 사용해 데이터가 비었거나 유효하지 않으면 다른 내용을 렌더링 */}
        {isDataEmptyOrInvalid ? (
          <Text style={{color: theme.text}}>데이터가 없습니다</Text> // 데이터가 없을 때 보여줄 메시지
        ) : (
          <Chart
            chartType="bar"
            barData={weeklyGoalData.map(item => ({
              ...item,
              stacks: item.stacks.map((stack, index) => {
                if (index === 0) {
                  if (item.stacks[1].value) {
                    return {...stack, borderRadius: 0};
                  }
                }
                return stack;
              }),
            }))}
          />
        )}
      </View>
    </View>
  );
};

export default WeeklyGoal;
