import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import Chart from './Chart';
import {useTheme} from '@/contexts/ThemeContext';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const WeeklyStudy = () => {
  const {theme, typography} = useTheme();

  const stackData = Array.from({length: 7}, (_, i) => ({
    stacks: [
      {value: Math.floor(Math.random() * 50) + 10, color: '#EE902C'},
      {value: Math.floor(Math.random() * 50) + 10, color: '#344BFD'},
    ],
    label: ['월', '화', '수', '목', '금', '토', '일'][i],
  }));

  return (
    <View style={{gap: 12}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
        <View style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>주간 공부 시간</Text>
          <Text style={[typography.body, {color: theme.text}]}>2025. 03. 31 ~ 2025. 04. 07</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 18, gap: 8}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View>
            <Text style={[typography.body, {color: theme.text}]}>이번주 평균</Text>
            <Text style={[typography.title, {color: theme.text}]}>3시간 50분</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={[typography.body, {color: theme.text}]}>지난주보다</Text>
            <Text style={[typography.body, {color: theme.primary, fontWeight: 500}]}>+1시간 30분</Text>
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
              <Text style={[typography.body, {color: theme.text, fontWeight: '400'}]}>9시간 14분</Text>
              <Text style={[typography.body, {color: theme.text, fontWeight: '400'}]}>55%</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <View style={{width: 15, height: 15, borderColor: '#EE902C', borderWidth: 3, borderRadius: 15 / 2}} />
              <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>공부 이외 시간</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>3시간 50분</Text>
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>45%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default WeeklyStudy;
