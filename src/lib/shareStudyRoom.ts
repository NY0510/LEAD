import {StudyRoom as StudyRoomType} from '@/types/api';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

export const getShareStudyRoomMessage = (user: FirebaseAuthTypes.User, studyRoom: StudyRoomType): string => {
  if (!studyRoom) {
    throw new Error('공부방 정보가 올바르지 않아요.');
  }

  const inviterName = user.displayName || '알 수 없는 사용자';
  return `📚 ${inviterName}님이 "${studyRoom.name}" 공부방에 초대했어요!

벌써 ${studyRoom.participants.length}명이 같이 공부 중이에요!
지금 바로 들어와서 같이 집중해봐요 🔥

👇 참여 링크
https://lead.ny64.kr/studyroom/join/?id=${studyRoom.room_id}
`;
};
