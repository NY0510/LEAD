export interface StudyRoom {
  room_id: string;
  name: string;
  owner_uid: string;
  participants: string[];
  created_at: Date;
  cover_image?: string;
  description?: string;
}

export interface User {
  uid: string;
  username: string;
  memo?: string;
  current_daily_goal: number;
}

export interface StudyRecord {
  uid: string;
  date: Date;
  goal: number;
  pure_study: number;
  non_study: number;
  total: number;
}
