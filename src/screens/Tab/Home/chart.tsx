import React from 'react';
import {Text, View} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';

import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';

const Home = () => {
  const {user, signOut} = useAuth();
  const {theme, typography} = useTheme();

  const stackData = Array.from({length: 7}, (_, i) => ({
    stacks: [
      {value: Math.floor(Math.random() * 50) + 10, color: '#EE902C'},
      {value: Math.floor(Math.random() * 50) + 10, color: '#344BFD'},
    ],
    label: ['월', '화', '수', '목', '금', '토', '일'][i],
  }));

  return (
    <View style={{flex: 1, alignItems: 'center', paddingHorizontal: 18}}>
      <View style={{backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 18, width: '100%', gap: 8}}>
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

        <BarChart
          stackData={stackData.map(item => ({
            ...item,
            stacks: item.stacks.map((stack, index) => {
              if (index === 0) {
                return {...stack, borderRadius: 0};
              }
              if (index === 1) {
                // return {...stack, marginBottom: 1};
              }
              return stack;
            }),
          }))}
          barBorderTopLeftRadius={12}
          barBorderTopRightRadius={12}
          barWidth={18}
          hideRules
          rulesType="solid"
          rulesColor={theme.inactive}
          noOfSections={3}
          // disablePress
          // hideYAxisText
          // yAxisLabelSuffix="분"
          yAxisThickness={0}
          xAxisThickness={0}
          // showValuesAsTopLabel
          xAxisColor={theme.inactive}
          xAxisLabelTextStyle={{color: theme.text}}
          disableScroll
          isAnimated
          animationDuration={200}
          yAxisExtraHeight={32}
          autoCenterTooltip
          renderTooltip={(item: any) => {
            return (
              <View
                style={{
                  backgroundColor: theme.background,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                  borderColor: theme.primary,
                }}>
                <Text
                  style={{
                    color: theme.text,
                    fontSize: 12,
                    fontWeight: '500',
                  }}>
                  {item.stacks.map((stack: any) => stack.value).reduce((a: number, b: number) => a + b, 0)} 분
                </Text>
              </View>
            );
          }}
        />

        <View style={{gap: 4, marginTop: 16}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <View style={{width: 15, height: 15, borderColor: '#344BFD', borderWidth: 3, borderRadius: 15 / 2}} />
              <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>순 공부시간</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>9시간 14분</Text>
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>55%</Text>
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

export default Home;
