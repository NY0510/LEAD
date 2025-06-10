import {StudyRecord, StudyRoom, User} from '@/types/api';

// 더미 사용자 데이터
export const DEMO_USER: User = {
  uid: 'demo_user_001',
  username: '데모 사용자',
  memo: '앱스토어 데모를 위한 샘플 사용자입니다.',
  current_daily_goal: 480, // 8시간
};

// 추가 더미 사용자들
export const DEMO_USERS: User[] = [
  DEMO_USER,
  {
    uid: 'demo_user_002',
    username: '김철수',
    memo: '토익 900점 목표로 열심히 공부 중!',
    current_daily_goal: 360, // 6시간
  },
  {
    uid: 'demo_user_003',
    username: '이영희',
    memo: '정보처리기사 자격증 취득을 위해 공부해요.',
    current_daily_goal: 420, // 7시간
  },
  {
    uid: 'demo_user_004',
    username: '박민수',
    memo: '코딩테스트 준비 중입니다.',
    current_daily_goal: 540, // 9시간
  },
  {
    uid: 'demo_user_005',
    username: '최지은',
    memo: '꾸준히 공부하는 것이 목표예요!',
    current_daily_goal: 300, // 5시간
  },
];

// 더미 공부방 데이터
export const DEMO_STUDY_ROOMS: StudyRoom[] = [
  {
    room_id: 'room_001',
    name: '토익 스터디',
    owner_uid: 'demo_user_001',
    participants: ['demo_user_001', 'demo_user_002', 'demo_user_003'],
    created_at: new Date('2024-12-01'),
    cover_image: '📚',
    description: '토익 900점 목표로 함께 공부해요!',
  },
  {
    room_id: 'room_002',
    name: '코딩테스트 준비',
    owner_uid: 'demo_user_002',
    participants: ['demo_user_001', 'demo_user_002', 'demo_user_004'],
    created_at: new Date('2024-11-15'),
    cover_image: '💻',
    description: '알고리즘과 자료구조를 함께 정복해봐요',
  },
  {
    room_id: 'room_003',
    name: '자격증 취득반',
    owner_uid: 'demo_user_003',
    participants: ['demo_user_001', 'demo_user_003', 'demo_user_005'],
    created_at: new Date('2024-10-20'),
    cover_image: '🎓',
    description: '정보처리기사 자격증 함께 따요!',
  },
];

// 더미 공부 기록 데이터 (최근 7일)
export const DEMO_STUDY_RECORDS: StudyRecord[] = [
  // 데모 사용자 (demo_user_001)
  {
    uid: 'demo_user_001',
    date: new Date(),
    goal: 480,
    pure_study: 350,
    non_study: 25,
    total: 375,
  },
  {
    uid: 'demo_user_001',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    goal: 480,
    pure_study: 420,
    non_study: 30,
    total: 450,
  },
  {
    uid: 'demo_user_001',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    goal: 480,
    pure_study: 380,
    non_study: 20,
    total: 400,
  },
  {
    uid: 'demo_user_001',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    goal: 480,
    pure_study: 465,
    non_study: 35,
    total: 500,
  },
  {
    uid: 'demo_user_001',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    goal: 480,
    pure_study: 290,
    non_study: 15,
    total: 305,
  },
  {
    uid: 'demo_user_001',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    goal: 480,
    pure_study: 510,
    non_study: 40,
    total: 550,
  },
  {
    uid: 'demo_user_001',
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    goal: 480,
    pure_study: 395,
    non_study: 25,
    total: 420,
  },
  // 김철수 (demo_user_002)
  {
    uid: 'demo_user_002',
    date: new Date(),
    goal: 360,
    pure_study: 280,
    non_study: 20,
    total: 300,
  },
  // 이영희 (demo_user_003)
  {
    uid: 'demo_user_003',
    date: new Date(),
    goal: 420,
    pure_study: 390,
    non_study: 30,
    total: 420,
  },
  // 박민수 (demo_user_004)
  {
    uid: 'demo_user_004',
    date: new Date(),
    goal: 540,
    pure_study: 480,
    non_study: 40,
    total: 520,
  },
  // 최지은 (demo_user_005)
  {
    uid: 'demo_user_005',
    date: new Date(),
    goal: 300,
    pure_study: 250,
    non_study: 15,
    total: 265,
  },
];

// 더미 공부 상태 (현재 공부 중인지)
export const DEMO_STUDY_STATUS = {
  is_studying: false,
  study_start_time: null as Date | null,
};
