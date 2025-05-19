import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import Chart from './Chart';
import {useTheme} from '@/contexts/ThemeContext';
import {getData} from '@/lib/parseData';
import {calcPer} from '@/lib/persentage';
import {formatTime} from '@/lib/timeUtils';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const DailyStudy = () => {
  const {theme, typography} = useTheme();
  const [trueStudyHour, setTrueStudyHour] = useState<number>(0);
  const [exceptionalHour, setExceptionalHour] = useState<number>(0);
  const [totalHour, setTotalHour] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('250509'); // 조회할 시작 날짜
  const [endDate, setEndDate] = useState<string>('250516'); // 조회할 끝 날짜

  const fetchData = async () => {
    const data = await getData(startDate, endDate); // getData 함수에서 반환하는 데이터

    // 각 필드별 데이터를 상태로 저장
    setTrueStudyHour(data.trueStudiedHour[6]); // trueStudiedHour를 trueData에 저장
    setExceptionalHour(data.exceptionalHour[6]); // exceptionalHour를 exData에 저장
    setTotalHour(trueStudyHour + exceptionalHour);
  };

  const pieData = [
    {value: trueStudyHour, color: '#EE902C'},
    {value: exceptionalHour, color: '#344BFD'},
  ];

  return (
    <View style={{gap: 12}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
        <View style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>일간 공부 시간</Text>
          <Text style={[typography.body, {color: theme.text}]}>2025. 05. 01</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {}}>
          <FontAwesome6 name="angle-right" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
      </View>
      <View style={{backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 24, paddingVertical: 18, gap: 8}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <View>
            <Text style={[typography.body, {color: theme.text}]}>오늘 공부</Text>
            <Text style={[typography.title, {color: theme.text}]}>{formatTime(totalHour)}</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={[typography.body, {color: theme.text}]}>어제보다</Text>
            <Text style={[typography.body, {color: theme.primary, fontWeight: 500}]}>+30분</Text>
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
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{formatTime(trueStudyHour)}</Text>
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{calcPer(totalHour, trueStudyHour)}%</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <View style={{width: 15, height: 15, borderColor: '#EE902C', borderWidth: 3, borderRadius: 15 / 2}} />
              <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>공부 이외 시간</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 16}}>
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{formatTime(exceptionalHour)}</Text>
              <Text style={[typography.body, {color: theme.text, fontWeight: 400}]}>{calcPer(totalHour, exceptionalHour)}%</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default DailyStudy;
