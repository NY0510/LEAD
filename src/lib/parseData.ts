import axios from 'axios';

// import uid from 'somewhere';

const API_BASE_URL = `'/user/${uid}/studies'`;

export const getTodayData = async (): Promise<{trueStudiedHour: number[]; exceptionalHour: number[]; goalHour: number[]}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/today`);
    const studyData = response.data;

    return {
      trueStudiedHour: studyData.map((item: any) => item.trueStudiedHour),
      exceptionalHour: studyData.map((item: any) => item.exceptionalHour),
      goalHour: studyData.map((item: any) => item.goalHour),
    };
  } catch (error) {
    console.error('Failed to fetch today study data:', error);
    return {trueStudiedHour: [], exceptionalHour: [], goalHour: []};
  }
};

// 특정 날짜 공부 데이터 호출
export const getSingleData = async (date: string): Promise<{trueStudiedHour: number[]; exceptionalHour: number[]; goalHour: number[]}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/studies/${date}`);
    const studyData = response.data;

    return {
      trueStudiedHour: [studyData.trueStudiedHour],
      exceptionalHour: [studyData.exceptionalHour],
      goalHour: [studyData.goalHour],
    };
  } catch (error) {
    console.error(`Failed to fetch study data for ${date}:`, error);
    return {trueStudiedHour: [], exceptionalHour: [], goalHour: []};
  }
};

// 특정 날짜 범위 공부 데이터 호출
export const getWeekData = async (startDate: string, endDate: string): Promise<{trueStudiedHour: number[]; exceptionalHour: number[]; goalHour: number[]}> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/study-range`, {
      params: {startDate, endDate},
    });
    const studyData = response.data;

    return {
      trueStudiedHour: studyData.map((item: any) => item.trueStudiedHour),
      exceptionalHour: studyData.map((item: any) => item.exceptionalHour),
      goalHour: studyData.map((item: any) => item.goalHour),
    };
  } catch (error) {
    console.error(`Failed to fetch study data for range (${startDate} to ${endDate}):`, error);
    return {trueStudiedHour: [], exceptionalHour: [], goalHour: []};
  }
};
