import React, { useState } from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import Chart from './Chart';
import {useTheme} from '@/contexts/ThemeContext';
import {useAuth} from '@/contexts/AuthContext';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {getPureStudyArr,getNonStudyArr,getTotalStudyArr,getWeekRange,getWeekAvg} from '@/lib/weekDataHandler'
import {formatTime} from '@/lib/timeUtils';
import { sumArr , calcPer} from '@/lib/sol';

const WeeklyStudy = () => {
  const {theme, typography} = useTheme();
  const {user} = useAuth();
  const [week, setWeek] = useState(0);
  const [pureStudy, setPureStudy] = useState([0]);
  const [nonStudy, setNonStudy] = useState([0]);
  const [totalStudy, setTotalStudy] = useState([0]);
  const [weekAvg, setWeekAvg] = useState(0);
  const [privWeekAvg, setPrivWeekAvg] = useState(0);
  const fetchData = async () => {
    if (!user) {
      return;
    }
    setPureStudy(await getPureStudyArr(user.uid,week))
    setNonStudy(await getNonStudyArr(user.uid,week))
    setTotalStudy(await getTotalStudyArr(user.uid,week))
    setWeekAvg(await getWeekAvg(user.uid,week))
    setPrivWeekAvg(await getWeekAvg(user.uid,week-1))
    };

  const onLeftPressed = () => {
    setWeek(week-1);
    fetchData();
  };
  const onRightPressed = () => {
    setWeek(week+1);
    fetchData();
  };

  const stackData = pureStudy.map((val, i) => ({
    stacks: [
      { value: val, color: '#EE902C' },
      { value: nonStudy[i], color: '#344BFD' }
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
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>주간 공부 시간</Text>
          <Text style={[typography.body, {color: theme.text}]}>{getWeekRange(week)}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.65} onPress={onRightPressed}>
          <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 18, gap: 8}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View>
            <Text style={[typography.body, {color: theme.text}]}>이번주 평균</Text>
            <Text style={[typography.title, {color: theme.text}]}>{formatTime(weekAvg)}</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={[typography.body, {color: theme.text}]}>지난주보다</Text>
            <Text style={[typography.body, {color: theme.primary, fontWeight: 500}]}>{formatTime(weekAvg-privWeekAvg)}</Text>
          </View>
        </View>
        <Chart
          chartType="bar"
          barData={stackData.map(item => ({
            ...item,
            stacks: item.stacks.map((stack, index) => {
              if (index === 0) {
                return {...stack, borderRadius: 0};
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
              <Text style={[typography.body, {color: theme.text, fontWeight: '400'}]}>{calcPer(sumArr(totalStudy),sumArr(pureStudy))}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <View style={{width: 15, height: 15, borderColor: '#EE902C', borderWidth: 3, borderRadius: 15 / 2}} />
              <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>공부 이외 시간</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{formatTime(sumArr(nonStudy))}</Text>
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{calcPer(sumArr(totalStudy),sumArr(nonStudy))}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WeeklyStudy;
