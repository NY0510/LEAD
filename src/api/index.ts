import httpClient from './httpClient';

// 회원가입
export const signup = async (uid: string) => {
  try {
    const r = await httpClient.post('/users/signup', {uid});
    return r.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

// 메모 설정
export const setMemo = async (uid: string, memo: string) => {
  try {
    const r = await httpClient.post(`/users/${uid}/memo`, {memo});
    return r.data;
  } catch (error) {
    console.error('Error during setMemo:', error);
    throw error;
  }
};

// 메모 조회
export const getMemo = async (uid: string) => {
  try {
    const r = await httpClient.get(`/users/${uid}/memo`);
    return r.data;
  } catch (error) {
    console.error('Error during getMemo:', error);
    throw error;
  }
};

// 오늘 목표 설정
export const setGoal = async (uid: string, goal: number) => {
  try {
    const r = await httpClient.post(`/users/${uid}/goal`, {goal});
    return r.data;
  } catch (error) {
    console.error('Error during setGoal:', error);
    throw error;
  }
};

// 오늘 목표 조회
export const getGoal = async (uid: string) => {
  try {
    const r = await httpClient.get(`/users/${uid}/goal`);
    return r.data;
  } catch (error) {
    console.error('Error during getGoal:', error);
    throw error;
  }
};

// 오늘 공부 기록 조회
export const getStudyToday = async (uid: string) => {
  try {
    const r = await httpClient.get(`/users/${uid}/studies/today`);
    return r.data;
  } catch (error) {
    console.error('Error during getStudyToday:', error);
    throw error;
  }
};

// 특정 날짜 공부 기록 조회
export const getStudyByDate = async (uid: string, date: string) => {
  try {
    const r = await httpClient.get(`/users/${uid}/studies/${date}`);
    return r.data;
  } catch (error) {
    console.error('Error during getStudyByDate:', error);
    throw error;
  }
};

// 특정 날짜 범위 공부 기록 조회
export const getStudyByDateRange = async (uid: string, start_date: string, end_date: string) => {
  try {
    const r = await httpClient.get(`/users/${uid}/studies`, {
      params: {start_date, end_date},
    });
    return r.data;
  } catch (error) {
    console.error('Error during getStudyByDateRange:', error);
    throw error;
  }
};

// 공부 기록 업데이트
export const updateStudy = async (uid: string, is_studying: boolean) => {
  try {
    const r = await httpClient.post(`/users/${uid}/studies/update?is_studying=${is_studying}`);
    return r.data;
  } catch (error) {
    console.error('Error during updateStudy:', error);
    throw error;
  }
};
