import React, {useState} from 'react';
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
    setTotalStudy(await getTotalStudyArr(user.uid, week));
    setPrivTotalStudy(await getTotalStudyArr(user.uid, week - 1));
    setGoal(await getGoalArr(user.uid, week));
    setPrivGoal(await getGoalArr(user.uid, week - 1));
  };

  const onLeftPressed = () => {
    setWeek(week - 1);
    //fetchData();
  };
  const onRightPressed = () => {
    setWeek(week + 1);
    fetchData();
  };

  const weeklyGoalData = totalStudy.map((val, i) => ({
    stacks: [
      {value: val + 10, color: '#EE902C'},
      {value: Math.max(goal[i] - val, 0) + 10, color: '#344BFD'},
    ],
    label: ['월', '화', '수', '목', '금', '토', '일'][i],
  }));

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
            <Text style={[typography.body, {color: '#ff7171', fontWeight: 500}]}>{addSign(calcAvgPer(totalStudy, goal) - calcAvgPer(privTotalStudy, privGoal))}</Text>
          </View>
        </View>
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
      </View>
    </View>
  );
};

export default WeeklyGoal;
