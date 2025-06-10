import {getGoal, getStudyByDateRange} from '@/api';

const today = new Date();
const getStartOfWeek = (date: Date) => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay() + 1);
  return start.toISOString().split('T')[0];
};

const getEndOfWeek = (date: Date) => {
  const end = new Date(date);
  end.setDate(end.getDate() - end.getDay() + 7);
  return end.toISOString().split('T')[0];
};

export const getWeekData = (uid: string, week: number) => {
  const baseDate = new Date(today);
  const modifiedDate = new Date(baseDate);
  modifiedDate.setDate(baseDate.getDate() + 7 * week);

  const newStartDate = getStartOfWeek(modifiedDate);
  const newEndDate = getEndOfWeek(new Date(modifiedDate));

  return getStudyByDateRange(uid, newStartDate, newEndDate);
};

export const getPureStudyArr = async (uid: string, week: number) => {
  const data: {pure_study: number}[] = await getWeekData(uid, week);
  const pureStudyArr = data.map(pure_arr => pure_arr.pure_study);
  return pureStudyArr;
};

export const getNonStudyArr = async (uid: string, week: number) => {
  const data: {non_study: number}[] = await getWeekData(uid, week);
  const pureNonArr = data.map(non_arr => non_arr.non_study);
  return pureNonArr;
};

export const getTotalStudyArr = async (uid: string, week: number) => {
  const data: {total: number}[] = await getWeekData(uid, week);
  const totalArr = data.map(total_arr => total_arr.total);
  return totalArr;
};

export const getGoalArr = async (uid: string, week: number): Promise<number[]> => {
  const data: {goal: number}[] = await getWeekData(uid, week);
  let goalArr = data.map(goalItem => goalItem.goal);
  let lastValue = await getGoal(uid);

  if (goalArr.every(goal => goal === 0)) {
    return Array(goalArr.length).fill(await getGoal(uid));
  }

  goalArr = goalArr.map(goal => {
    if (goal !== 0) {
      lastValue = goal;
      return goal;
    }
    return lastValue;
  });
  return goalArr;
};

export const getWeekRange = (week: number) => {
  const baseDate = new Date(today);
  const modifiedDate = new Date(baseDate);

  modifiedDate.setDate(modifiedDate.getDate() + 7 * week);

  const newStartDate = getStartOfWeek(modifiedDate);
  const newEndDate = getEndOfWeek(new Date(modifiedDate));
  return `${newStartDate} ~ ${newEndDate}`;
};

export const getWeekAvg = async (uid: string, week: number): Promise<number> => {
  const totalStudy = await getTotalStudyArr(uid, week);

  // 배열이 비어있는 경우 0 반환
  if (totalStudy.length === 0) {
    return 0;
  }

  // 배열의 값 중 null, undefined를 0으로 처리
  const validTotalStudy = totalStudy.map(val => val ?? 0);

  const arrLength = validTotalStudy.length;
  const sum = validTotalStudy.reduce((acc, val) => acc + val, 0);

  return Math.round(sum / arrLength);
};

