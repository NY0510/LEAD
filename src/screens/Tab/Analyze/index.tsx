import React from 'react';
import {Text, View} from 'react-native';

import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import { Image } from 'react-native-svg';

const Analyze = () => {
  const {user, signOut} = useAuth();
  const {theme, typography} = useTheme();

  return (
    <View>
      <View style={{flexDirection: "row",}}>
        <Image></Image>
        <View style={{flexDirection: "column",}}>
          <Text>대충 ID</Text>
          <Text>대충 집중도</Text>
        </View>
      </View>

      <View style={{flexDirection: "column",}}>
        <View style={{flexDirection: "row",}}>
          <View></View>
          <View style={{flexDirection: "column",}}>
            <Text>일간 공부 시간</Text>
            <Text>대충 날짜</Text>
          </View>
          <View></View>
        </View>
          <View style={{flexDirection: "column",}}>
            <View>
              <View style={{flexDirection: "column",}}>
                <Text>오늘 공부</Text>
                <Text>대충 공부시간</Text>
              </View>
              <Text>어제보다 ~분</Text>
            </View>
            <View>
              <Text>그래프</Text>
            </View>
            <View style={{flexDirection: "column",}}>
              <View>
                <View></View>
                <Text>순 공부 시간</Text>
                <Text>대충 순 공부시간</Text>
                <Text>대충 순 공부시간 퍼센트</Text>
              </View>
              <View>
                <View></View>
                <Text>공부 이외의 시간</Text>
                <Text>대충 공부 이외의 시간시간</Text>
                <Text>대충 공부 이외의 시간 퍼센트</Text>
              </View>
            </View>
          </View>
      </View>
      
      <View style={{flexDirection: "column",}}>
        <View style={{flexDirection: "row",}}>
          <View></View>
          <View style={{flexDirection: "column",}}>
            <Text>주간 공부 시간</Text>
            <Text>대충 날짜 ~ 대충 날짜</Text>
          </View>
          <View></View>
        </View>
          <View style={{flexDirection: "column",}}>
            <View>
              <View style={{flexDirection: "column",}}>
                <Text>이번주 평균</Text>
                <Text>대충 이번주 공부시간</Text>
              </View>
              <Text>지난주보다 ~분</Text>
            </View>
            <View>
              <Text>그래프</Text>
            </View>
            <View style={{flexDirection: "column",}}>
              <View>
                <View></View>
                <Text>순 공부 시간</Text>
                <Text>대충 순 공부시간</Text>
                <Text>대충 순 공부시간 퍼센트</Text>
              </View>
              <View>
                <View></View>
                <Text>공부 이외의 시간</Text>
                <Text>대충 공부 이외의 시간시간</Text>
                <Text>대충 공부 이외의 시간 퍼센트</Text>
              </View>
            </View>
          </View>
      </View>
      
      <View>

      </View>
    </View>
  );
};

export default Analyze;
