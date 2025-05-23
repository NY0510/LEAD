import axios from 'axios';
import today from '@/assets/today.json'

// 오늘 공부 데이터 호출
export const getTodayData = async (uid:string|undefined): Promise<{ date: string; trueStudiedHour: number; exceptionalHour: number; goalHour: number; total: number }> => {
  try {
    //const response = await axios.get(`/user/${uid}/studies/today`);
    //const studyData = response.data;
    const studyData = today;
    return {
      date: studyData.date,
      trueStudiedHour: studyData.pure_study,
      exceptionalHour: studyData.non_study,
      goalHour: studyData.goal,
      total: studyData.total
    };
  } catch (error) {
    console.error('Failed to fetch today study data:', error);

    return {
      date: '', trueStudiedHour: 0, exceptionalHour: 0, goalHour: 0, total: 0 
    };
  }
};


// 특정 날짜 공부 데이터 호출
export const getSingleData = async (date: string, uid:string|undefined): Promise<{ date: string; trueStudiedHour: number; exceptionalHour: number; goalHour: number; total: number }> => {
  try {
    const response = await axios.get(`/user/${uid}/studies/${date}`);
    const studyData = response.data;

    // 주어진 형식에 맞게 데이터 추출
    return {
      date: studyData.date, // 날짜
      trueStudiedHour: studyData.pure_study, // pure_study를 trueStudiedHour로 사용
      exceptionalHour: studyData.non_study, // non_study를 exceptionalHour로 사용
      goalHour: studyData.goal, // goal을 goalHour로 사용
      total: studyData.total // total 시간
    };
  } catch (error) {
    console.error(`Failed to fetch study data for ${date}:`, error);
    return { date: '', trueStudiedHour: 0, exceptionalHour: 0, goalHour: 0, total: 0 }; // 데이터가 없으면 기본값 반환
  }
};

// 특정 날짜 범위 공부 데이터 호출
export const getWeekData = async (startDate: string, endDate: string|undefined , uid:string): Promise<{ date: string[]; trueStudiedHour: number[]; exceptionalHour: number[]; goalHour: number[]; total: number[] }> => {
  try {
    const response = await axios.get(`'/user/${uid}/studies/somthing`, {
      params: { startDate, endDate },
    });
    const studyData = response.data;

    // 주어진 형식에 맞게 데이터 추출
    return {
      date: studyData.map((item: any) => item.date), // 날짜
      trueStudiedHour: studyData.map((item: any) => item.pure_study), // pure_study를 trueStudiedHour로 사용
      exceptionalHour: studyData.map((item: any) => item.non_study), // non_study를 exceptionalHour로 사용
      goalHour: studyData.map((item: any) => item.goal), // goal을 goalHour로 사용
      total: studyData.map((item: any) => item.total) // total 시간
    };
  } catch (error) {
    console.error(`Failed to fetch study data for range (${startDate} to ${endDate}):`, error);
    return { date: [], trueStudiedHour: [], exceptionalHour: [], goalHour: [], total: [] }; // 데이터가 없으면 빈 배열 반환
  }
};
