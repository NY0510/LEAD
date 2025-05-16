import React, {useEffect, useState} from 'react';
import {Button, FlatList, Text, View} from 'react-native';

import sampleJson from '@/assets/sample.json';

// 실제 경로에 맞게 수정하세요

// 주어진 날짜 범위에 맞는 데이터를 배열로 반환하는 함수
export const getData = async (startDate: string, endDate: string): Promise<{trueStudiedHour: number[]; exceptionalHour: number[]; goalHour: number[]}> => {
  // 데이터 불러오는 함수
  const fetchStudyData = async (): Promise<{date: string; trueStudiedHour: number; exceptionalHour: number; goalHour: number}[] | null> => {
    try {
      // 실제 서버에서 데이터를 가져오는 예시
      // const response = await axios.get('https://example.com/api/studydata');
      // return response.data;
      return sampleJson; // 실제 서버 대신 샘플 JSON 사용
    } catch (error) {
      console.error('Failed to fetch study data:', error);
      return null;
    }
  };

  const studyData = await fetchStudyData(); // 데이터를 가져오는 비동기 함수

  if (studyData === null) {
    return {trueStudiedHour: [], exceptionalHour: [], goalHour: []}; // 데이터가 없으면 빈 배열 반환
  }

  // 날짜 범위에 맞는 데이터 필터링
  const filteredData = studyData.filter(item => item.date >= startDate && item.date <= endDate);

  if (filteredData.length === 0) {
    return {trueStudiedHour: [], exceptionalHour: [], goalHour: []}; // 범위 내에 데이터가 없으면 빈 배열 반환
  }

  // 필드에 해당하는 값만 추출하여 객체로 반환
  const trueStudiedHour = filteredData.map(item => item.trueStudiedHour);
  const exceptionalHour = filteredData.map(item => item.exceptionalHour);
  const goalHour = filteredData.map(item => item.goalHour);

  return {trueStudiedHour, exceptionalHour, goalHour};
};
