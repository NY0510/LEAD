import {DEMO_STUDY_RECORDS, DEMO_STUDY_ROOMS, DEMO_STUDY_STATUS, DEMO_USER, DEMO_USERS} from './demoData';

// 데모 모드용 API 응답을 시뮬레이션하는 함수들
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const demoAPI = {
  // 회원 가입
  signup: async (uid: string, username: string) => {
    await delay(500);
    return {success: true, user: DEMO_USER};
  },

  // 사용자 정보 조회
  getUserInfo: async (uid: string) => {
    await delay(300);
    const foundUser = DEMO_USERS.find(u => u.uid === uid);
    return foundUser || DEMO_USER;
  },

  // 메모 설정
  setMemo: async (uid: string, memo: string) => {
    await delay(400);
    DEMO_USER.memo = memo;
    return {success: true, memo};
  },

  // 메모 조회
  getMemo: async (uid: string) => {
    await delay(200);
    return {memo: DEMO_USER.memo};
  },

  // 오늘 목표 설정
  setGoal: async (uid: string, goal: number) => {
    await delay(300);
    DEMO_USER.current_daily_goal = goal;
    return {success: true, goal};
  },

  // 오늘 목표 조회
  getGoal: async (uid: string) => {
    await delay(200);
    return {goal: DEMO_USER.current_daily_goal};
  },

  // 오늘 공부 기록 조회
  getStudyToday: async (uid: string) => {
    await delay(300);
    const todayRecord = DEMO_STUDY_RECORDS.find(r => r.uid === uid && r.date.toDateString() === new Date().toDateString());

    if (todayRecord) {
      return {
        goal: todayRecord.goal,
        pure_study: todayRecord.pure_study,
        non_study: todayRecord.non_study,
        total: todayRecord.total,
        is_studying: DEMO_STUDY_STATUS.is_studying,
      };
    }

    // 해당 사용자의 오늘 기록이 없으면 빈 기록 반환
    const user = DEMO_USERS.find(u => u.uid === uid) || DEMO_USER;
    return {
      goal: user.current_daily_goal,
      pure_study: 0,
      non_study: 0,
      total: 0,
      is_studying: DEMO_STUDY_STATUS.is_studying,
    };
  },

  // 특정 날짜 공부 기록 조회
  getStudyByDate: async (uid: string, date: string) => {
    await delay(300);
    const targetDate = new Date(date);
    const record = DEMO_STUDY_RECORDS.find(r => r.uid === uid && r.date.toDateString() === targetDate.toDateString());

    if (record) {
      return {
        goal: record.goal,
        pure_study: record.pure_study,
        non_study: record.non_study,
        total: record.total,
      };
    }

    const user = DEMO_USERS.find(u => u.uid === uid) || DEMO_USER;
    return {
      goal: user.current_daily_goal,
      pure_study: 0,
      non_study: 0,
      total: 0,
    };
  },

  // 특정 날짜 범위 공부 기록 조회
  getStudyByDateRange: async (uid: string, start_date: string, end_date: string) => {
    await delay(400);
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    const filteredRecords = DEMO_STUDY_RECORDS.filter(record => {
      const recordDate = record.date;
      return record.uid === uid && recordDate >= startDate && recordDate <= endDate;
    });

    return filteredRecords.map(record => ({
      date: record.date.toISOString().split('T')[0],
      goal: record.goal,
      pure_study: record.pure_study,
      non_study: record.non_study,
      total: record.total,
    }));
  },

  // 공부 기록 업데이트
  updateStudy: async (uid: string, is_studying: boolean) => {
    await delay(500);
    DEMO_STUDY_STATUS.is_studying = is_studying;

    if (is_studying) {
      DEMO_STUDY_STATUS.study_start_time = new Date();
    } else {
      DEMO_STUDY_STATUS.study_start_time = null;
      // 공부 완료 시 오늘 기록에 시간 추가 (데모용)
      DEMO_STUDY_RECORDS[0].pure_study += Math.floor(Math.random() * 30) + 15; // 15-45분 랜덤 추가
      DEMO_STUDY_RECORDS[0].total = DEMO_STUDY_RECORDS[0].pure_study + DEMO_STUDY_RECORDS[0].non_study;
    }

    return {
      success: true,
      is_studying,
      total_today: DEMO_STUDY_RECORDS[0].total,
    };
  },

  // 특정 공부방 조회
  getStudyRoom: async (id: string) => {
    await delay(300);
    const foundRoom = DEMO_STUDY_ROOMS.find(r => r.room_id === id);
    return foundRoom || null;
  },

  // 공부방 생성
  createStudyRoom: async (uid: string, name: string, cover_image: string, description: string) => {
    await delay(600);
    const newRoom = {
      room_id: `room_${Date.now()}`,
      name,
      owner_uid: uid,
      participants: [uid],
      created_at: new Date(),
      cover_image,
      description,
    };
    DEMO_STUDY_ROOMS.push(newRoom);
    return {success: true, room: newRoom};
  },

  // 공부방 삭제
  deleteStudyRoom: async (uid: string, room_id: string) => {
    await delay(400);
    const index = DEMO_STUDY_ROOMS.findIndex(room => room.room_id === room_id);
    if (index > -1) {
      DEMO_STUDY_ROOMS.splice(index, 1);
    }
    return {success: true};
  },

  // 공부방 나가기
  leaveStudyRoom: async (uid: string, room_id: string) => {
    await delay(400);
    const targetRoom = DEMO_STUDY_ROOMS.find(r => r.room_id === room_id);
    if (targetRoom) {
      targetRoom.participants = targetRoom.participants.filter(participant => participant !== uid);
    }
    return {success: true};
  },

  // 내 공부방 목록 조회
  getMyStudyRooms: async (uid: string) => {
    await delay(400);
    const myRooms = DEMO_STUDY_ROOMS.filter(room => room.participants.includes(uid));
    return myRooms;
  },

  // 공부방 참가
  joinStudyRoom: async (uid: string, room_id: string) => {
    await delay(500);
    const targetRoom = DEMO_STUDY_ROOMS.find(r => r.room_id === room_id);
    if (targetRoom && !targetRoom.participants.includes(uid)) {
      targetRoom.participants.push(uid);
    }
    return {success: true, room: targetRoom};
  },

  // 공부방 수정
  updateStudyRoom: async (uid: string, room_id: string, name: string, cover_image: string, description: string) => {
    await delay(500);
    const targetRoom = DEMO_STUDY_ROOMS.find(r => r.room_id === room_id);
    if (targetRoom && targetRoom.owner_uid === uid) {
      targetRoom.name = name;
      targetRoom.cover_image = cover_image;
      targetRoom.description = description;
    }
    return {success: true, room: targetRoom};
  },
};
