import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

import Chart from './Chart';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {getSingleData} from '@/lib/parseData';
import {calcPer} from '@/lib/persentage';
import {formatTime} from '@/lib/timeUtils';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const DailyStudy = () => {
  const {user} = useAuth();
  const {theme, typography} = useTheme();
  const [trueStudyHour, setTrueStudyHour] = useState<number>(10);
  const [exceptionalHour, setExceptionalHour] = useState<number>(10);
  const [totalHour, setTotalHour] = useState<number>(0);
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [yesterday, setYesterday] = useState(new Date(startDate.getDate() - 1));
  const [yesterdayStudiedHour, setYesterdayHour] = useState<number>(0);

  const fetchData = async () => {
    const data = await getSingleData(startDate.toISOString().split('T')[0], user?.uid);
    const yesterdayData = await getSingleData(yesterday.toISOString().split('T')[0], user?.uid);
    setYesterdayHour(yesterdayData.trueStudiedHour);
    setTrueStudyHour(data.trueStudiedHour);
    setExceptionalHour(data.exceptionalHour);
    setTotalHour(data.total);
  };

  const onLeftPressed = () => {
    const newDate = new Date(startDate);
    newDate.setDate(newDate.getDate() - 1);
    setStartDate(newDate);
    setYesterday(new Date(startDate.getDate() - 1));
    fetchData();
  };
  const onRightPressed = () => {
    if (startDate.toISOString() !== today.toISOString()) {
      const newDate = new Date(startDate);
      newDate.setDate(newDate.getDate() + 1);
      setStartDate(newDate);
      setYesterday(new Date(startDate.getDate() - 1));
      fetchData();
    }
  };

  const pieData = [
    {value: trueStudyHour, color: '#EE902C'},
    {value: exceptionalHour, color: '#344BFD'},
  ];

  return (
    <View style={{gap: 12}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
        <TouchableOpacity activeOpacity={0.65} onPress={onLeftPressed}>
          <FontAwesome6 name="angle-left" size={22} color={theme.text} iconStyle="solid" />
        </TouchableOpacity>
        <View style={{flexDirection: 'column', alignItems: 'center', gap: 4}}>
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: 600}]}>일간 공부 시간</Text>
          <Text style={[typography.body, {color: theme.text}]}>{startDate.toISOString().split('T')[0]}</Text>
        </View>
        <TouchableOpacity activeOpacity={0.65} onPress={onRightPressed}>
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
            <Text style={[typography.body, {color: theme.primary, fontWeight: 500}]}>{new Intl.NumberFormat('en-US', {signDisplay: 'always'}).format(totalHour - yesterdayStudiedHour)}분</Text>
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
