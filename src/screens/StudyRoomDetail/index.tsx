import React, {useEffect, useState} from 'react';
import {Text, View} from 'react-native';

import {getStudyRoom} from '@/api';
import {useTheme} from '@/contexts/ThemeContext';
import {showToast} from '@/lib/toast';
import {RootStackParamList} from '@/navigations/RootStacks';
import {StudyRoom as StudyRoomType} from '@/types/api';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

const StudyRoomDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'StudyRoomDetail'>>();
  const {theme, typography} = useTheme();
  const navigation = useNavigation();
  const id = route.params.id || null;

  const [studyRoom, setStudyRoom] = useState<StudyRoomType | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          const r = await getStudyRoom(id);
          setStudyRoom(r);
        } catch (e) {
          showToast(`공부방 조회에 실패했어요.\n${(e as Error).message}`);
        }
      }
    })();
  }, [id]);

  useEffect(() => {
    navigation.setOptions({title: studyRoom?.name || ''});
  }, [navigation, studyRoom?.name]);

  if (!id) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12}}>
        <FontAwesome6 name="face-frown" iconStyle="regular" size={40} color={theme.inactive} />
        <Text style={[typography.body, {color: theme.secondary}]}>비정상적인 접근이에요.</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>공부방 이름: {studyRoom?.name}</Text>
      <Text>공부방 설명: {studyRoom?.description}</Text>
      <Text>공부방 방장: {studyRoom?.owner_uid}</Text>
      <Text>공부방 생성일: {new Date(studyRoom?.created_at).toString()}</Text>
      {/* <Text>공부방 커버 이미지: {studyRoom?.cover_image}</Text> */}
      <Text>공부방 참여자 수: {studyRoom?.participants.length}</Text>
      <Text>공부방 참여자 목록:</Text>
      {studyRoom?.participants.map((participant, index) => <Text key={index}>{participant}</Text>)}
    </View>
  );
};

export default StudyRoomDetail;
