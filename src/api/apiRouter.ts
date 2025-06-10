import * as realAPI from '@/api';
import {demoAPI} from '@/lib/demoAPI';

// 데모 모드 여부를 확인하는 변수 (전역 상태)
let isDemoModeActive = false;

export const setDemoMode = (enabled: boolean) => {
  isDemoModeActive = enabled;
  console.log(`[API Router] Demo mode ${enabled ? 'enabled' : 'disabled'}`);
};

export const getDemoMode = () => isDemoModeActive;

// API 함수들을 조건부로 라우팅
export const signup = async (uid: string, username: string) => {
  return isDemoModeActive ? demoAPI.signup(uid, username) : realAPI.signup(uid, username);
};

export const getUserInfo = async (uid: string) => {
  return isDemoModeActive ? demoAPI.getUserInfo(uid) : realAPI.getUserInfo(uid);
};

export const setMemo = async (uid: string, memo: string) => {
  return isDemoModeActive ? demoAPI.setMemo(uid, memo) : realAPI.setMemo(uid, memo);
};

export const getMemo = async (uid: string) => {
  return isDemoModeActive ? demoAPI.getMemo(uid) : realAPI.getMemo(uid);
};

export const setGoal = async (uid: string, goal: number) => {
  return isDemoModeActive ? demoAPI.setGoal(uid, goal) : realAPI.setGoal(uid, goal);
};

export const getGoal = async (uid: string) => {
  return isDemoModeActive ? demoAPI.getGoal(uid) : realAPI.getGoal(uid);
};

export const getStudyToday = async (uid: string) => {
  return isDemoModeActive ? demoAPI.getStudyToday(uid) : realAPI.getStudyToday(uid);
};

export const getStudyByDate = async (uid: string, date: string) => {
  return isDemoModeActive ? demoAPI.getStudyByDate(uid, date) : realAPI.getStudyByDate(uid, date);
};

export const getStudyByDateRange = async (uid: string, start_date: string, end_date: string) => {
  return isDemoModeActive ? demoAPI.getStudyByDateRange(uid, start_date, end_date) : realAPI.getStudyByDateRange(uid, start_date, end_date);
};

export const updateStudy = async (uid: string, is_studying: boolean) => {
  return isDemoModeActive ? demoAPI.updateStudy(uid, is_studying) : realAPI.updateStudy(uid, is_studying);
};

export const getStudyRoom = async (id: string) => {
  return isDemoModeActive ? demoAPI.getStudyRoom(id) : realAPI.getStudyRoom(id);
};

export const createStudyRoom = async (uid: string, name: string, cover_image: string, description: string) => {
  return isDemoModeActive ? demoAPI.createStudyRoom(uid, name, cover_image, description) : realAPI.createStudyRoom(uid, name, cover_image, description);
};

export const deleteStudyRoom = async (uid: string, room_id: string) => {
  return isDemoModeActive ? demoAPI.deleteStudyRoom(uid, room_id) : realAPI.deleteStudyRoom(uid, room_id);
};

export const leaveStudyRoom = async (uid: string, room_id: string) => {
  return isDemoModeActive ? demoAPI.leaveStudyRoom(uid, room_id) : realAPI.leaveStudyRoom(uid, room_id);
};

export const getMyStudyRooms = async (uid: string) => {
  return isDemoModeActive ? demoAPI.getMyStudyRooms(uid) : realAPI.getMyStudyRooms(uid);
};

export const joinStudyRoom = async (uid: string, room_id: string) => {
  return isDemoModeActive ? demoAPI.joinStudyRoom(uid, room_id) : realAPI.joinStudyRoom(uid, room_id);
};

export const updateStudyRoom = async (uid: string, room_id: string, name: string, cover_image: string, description: string) => {
  return isDemoModeActive ? demoAPI.updateStudyRoom(uid, room_id, name, cover_image, description) : realAPI.updateStudyRoom(uid, room_id, name, cover_image, description);
};
