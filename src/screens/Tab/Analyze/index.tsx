import React from 'react';
import {Image, ScrollView, Text, View} from 'react-native';
import {BarChart, PieChart} from 'react-native-gifted-charts';

import FireSvg from '@/assets/images/fire.svg';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const Analyze = () => {
  const {user, signOut} = useAuth();
  const {theme, typography} = useTheme();

  const stackData = Array.from({length: 7}, (_, i) => ({
    stacks: [
      {value: Math.floor(Math.random() * 50) + 10, color: '#EE902C'},
      {value: Math.floor(Math.random() * 50) + 10, color: '#344BFD'},
    ],
    label: ['월', '화', '수', '목', '금', '토', '일'][i],
  }));
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

  const pieData = [
    {value: 55, color: '#EE902C'},
    {value: 45, color: '#344BFD'},
  ];

  return (
    <ScrollView contentContainerStyle={{alignItems: 'center', padding: 26}}>
      <View style={{gap: 22, width: '100%'}}>
        <View style={{backgroundColor: theme.global.white, borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', gap: 12}}>
          <Image source={require('@/assets/images/rock.png')} style={{width: 64, height: 64}} />
          <View style={{flexShrink: 1}}>
            <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>{user?.displayName}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
              <Text style={[typography.body, {color: theme.red, fontWeight: '600'}]}>평균 집중도 78%</Text>
              <FireSvg width={16} height={16} />
            </View>
          </View>
        </View>

        <View style={{gap: 12}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
            <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
            <View style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
              <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>일간 공부 시간</Text>
              <Text style={[typography.body, {color: theme.text}]}>2025. 05. 01</Text>
            </View>
            <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
          </View>
          <View style={{backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 18, gap: 8}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View>
                <Text style={[typography.body, {color: theme.text}]}>오늘 공부</Text>
                <Text style={[typography.title, {color: theme.text}]}>3시간 50분</Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text style={[typography.body, {color: theme.text}]}>어제보다</Text>
                <Text style={[typography.body, {color: theme.primary, fontWeight: 500}]}>+30분</Text>
              </View>
            </View>

            <View style={{alignItems: 'center', gap: 18}}>
              <PieChart donut innerRadius={62} data={pieData} />
            </View>

            <View style={{gap: 4, marginTop: 16}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <View style={{width: 15, height: 15, borderColor: '#344BFD', borderWidth: 3, borderRadius: 15 / 2}} />
                  <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>순 공부시간</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                  <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>1시간 20분</Text>
                  <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>55%</Text>
                </View>
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <View style={{width: 15, height: 15, borderColor: '#EE902C', borderWidth: 3, borderRadius: 15 / 2}} />
                  <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>공부 이외 시간</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
                  <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>1시간</Text>
                  <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>45%</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={{gap: 12}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
            <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
            <View style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
              <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>주간 공부 시간</Text>
              <Text style={[typography.body, {color: theme.text}]}>2025. 03. 31 ~ 2025. 04. 07</Text>
            </View>
            <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
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

            <View style={{alignItems: 'center'}}>
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
                hideYAxisText
                // yAxisLabelSuffix="분"
                yAxisThickness={0}
                xAxisThickness={0}
                initialSpacing={0}
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
            </View>

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

        <View style={{gap: 12}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
            <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
            <View style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
              <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>주간 목표 달성률</Text>
              <Text style={[typography.body, {color: theme.text}]}>2025. 03. 31 ~ 2025. 04. 07</Text>
            </View>
            <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
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

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <BarChart
                stackData={weeklyGoalData.map(item => ({
                  ...item,
                  stacks: item.stacks.map((stack, index) => {
                    if (index === 0) {
                      if (item.stacks[1].value) {
                        return {...stack, borderRadius: 0};
                      }
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
                initialSpacing={0}
                //width={200}
                rulesType="solid"
                rulesColor={theme.inactive}
                noOfSections={3}
                // disablePress
                hideYAxisText
                // yAxisLabelSuffix="분"
                yAxisThickness={0}
                xAxisThickness={0}
                // showValuesAsTopLabel
                xAxisColor={theme.inactive}
                xAxisLabelTextStyle={{color: theme.text}}
                disableScroll
                spacing={10}
                // width={200}
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
            </View>

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
      </View>
    </ScrollView>
  );
};
export default Analyze;
