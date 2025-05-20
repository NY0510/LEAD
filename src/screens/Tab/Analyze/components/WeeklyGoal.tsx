import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import Chart from './Chart';
import {useTheme} from '@/contexts/ThemeContext';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const WeeklyGoal = () => {
  const {theme, typography} = useTheme();

  const weeklyGoalData = Array.from({length: 7}, (_, i) => {
    const stackValue1 = Math.floor(Math.random() * 50) + 10;
    const stackValue2 = Math.floor(Math.random() * 50) + 10;
    return {
      stacks: [
        {value: stackValue1, color: '#ff7171'},
        {value: Math.max(stackValue2 - stackValue1, 0), color: '#C6CED1'},
      ],
      label: ['월', '화', '수', '목', '금', '토', '일'][i],
    };
  });

  return (
    <View style={{gap: 12}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity activeOpacity={0.65} onPress={() => {}}>
          <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
        <View style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>주간 목표 달성률</Text>
          <Text style={[typography.body, {color: theme.text}]}>2025. 03. 31 ~ 2025. 04. 07</Text>
        </View>
        <TouchableOpacity activeOpacity={0.65} onPress={() => {}}>
          <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 18, gap: 8}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View>
            <Text style={[typography.body, {color: theme.text}]}>이번주 평균 달성률</Text>
            <Text style={[typography.title, {color: theme.text}]}>95%</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={[typography.body, {color: theme.text}]}>지난주보다</Text>
            <Text style={[typography.body, {color: '#ff7171', fontWeight: 500}]}>+2.5%</Text>
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
