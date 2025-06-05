import React, {useEffect, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, View} from 'react-native';

import {getStudyRoom, getUserInfo} from '@/api';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import {useTheme} from '@/contexts/ThemeContext';
import {calcPer, sumArr} from '@/lib/sol';
import {showToast} from '@/lib/toast';
import {getPureStudyArr, getTotalStudyArr} from '@/lib/weekDataHandler';
import {RootStackParamList} from '@/navigations/RootStacks';
import {toDP} from '@/theme/typography';
import {StudyRoom as StudyRoomType, User} from '@/types/api';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

const StudyRoomDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'StudyRoomDetail'>>();
  const {theme, typography} = useTheme();
  const navigation = useNavigation();
  const id = route.params.id || null;

  const [studyRoom, setStudyRoom] = useState<StudyRoomType | null>(null);
  const [participants, setParticipants] = useState<User[]>([]);
  const [participantConcentrations, setParticipantConcentrations] = useState<{[uid: string]: number}>({});
  const [loading, setLoading] = useState(true);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (id) {
        setLoading(true);
        try {
          const r = await getStudyRoom(id);
          setStudyRoom(r);
        } catch (e) {
          showToast(`공부방 조회에 실패했어요.\n${(e as Error).message}`);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [id]);

  useEffect(() => {
    if (!studyRoom) {
      return;
    }

    navigation.setOptions({title: studyRoom.name});
  }, [navigation, studyRoom]);

  // 참가자 정보 로드
  useEffect(() => {
    if (!studyRoom || !studyRoom.participants || studyRoom.participants.length === 0) {
      return;
    }

    (async () => {
      setParticipantsLoading(true);
      try {
        const participantPromises = studyRoom.participants.map(uid => getUserInfo(uid));
        const participantData = await Promise.all(participantPromises);
        setParticipants(participantData);

        // 각 참가자의 평균 집중도 계산
        const concentrationPromises = studyRoom.participants.map(async uid => {
          try {
            const pureStudyData = await getPureStudyArr(uid, 0);
            const totalStudyData = await getTotalStudyArr(uid, 0);
            const totalStudyTime = sumArr(totalStudyData);
            const pureStudyTime = sumArr(pureStudyData);
            const concentration = totalStudyTime > 0 ? calcPer(totalStudyTime, pureStudyTime) : 0;
            return {uid, concentration};
          } catch (error) {
            console.error(`Error calculating concentration for ${uid}:`, error);
            return {uid, concentration: 0};
          }
        });

        const concentrationData = await Promise.all(concentrationPromises);
        const concentrationMap = concentrationData.reduce(
          (acc, {uid, concentration}) => {
            acc[uid] = concentration;
            return acc;
          },
          {} as {[uid: string]: number},
        );

        setParticipantConcentrations(concentrationMap);
      } catch (e) {
        showToast(`참가자 정보 조회에 실패했어요.\n${(e as Error).message}`);
      } finally {
        setParticipantsLoading(false);
      }
    })();
  }, [studyRoom]);

  if (loading) {
    return <Loading fullScreen={true} />;
  }

  if (!id || !studyRoom) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12}}>
        <FontAwesome6 name="face-frown" iconStyle="regular" size={40} color={theme.inactive} />
        <Text style={[typography.body, {color: theme.secondary}]}>비정상적인 접근이에요.</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: theme.background}}>
      <ImageBackground source={studyRoom.cover_image ? {uri: studyRoom.cover_image} : require('@/assets/images/studyroom_default.jpg')} style={{flex: 1}} resizeMode="cover">
        <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)'}} />
        <View style={{paddingHorizontal: 16, paddingVertical: 32}}>
          <Text style={[typography.title, {color: '#FFFFFF', fontSize: toDP(28), fontWeight: '700'}]}>{studyRoom.name}</Text>
          <Text style={[typography.subtitle, {color: '#F5F5F5'}]}>
            참여자 {studyRoom.participants.length}명 ⋅ 개설일 {studyRoom.created_at ? new Date(studyRoom.created_at).toLocaleDateString() : '알 수 없음'}
          </Text>
        </View>
      </ImageBackground>
      <View style={{flex: 2, backgroundColor: theme.background, borderTopLeftRadius: 16, borderTopRightRadius: 16, paddingHorizontal: 16, paddingVertical: 20, marginTop: -40}}>
        <View style={{gap: 16, flex: 1}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Text style={[typography.subtitle, {color: theme.text, fontSize: toDP(20), fontWeight: '700'}]}>참가자</Text>
            <View style={{backgroundColor: theme.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20}}>
              <Text style={[typography.body, {color: '#FFFFFF', fontSize: toDP(14), fontWeight: '600'}]}>{studyRoom.participants.length}명</Text>
            </View>
          </View>
          <ScrollView style={{flex: 1}} contentContainerStyle={{gap: 12, flexGrow: 1, paddingBottom: 20}} showsVerticalScrollIndicator={false}>
            {participantsLoading ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40}}>
                <Loading />
                <Text style={[typography.body, {color: theme.secondary, marginTop: 16, fontSize: toDP(14)}]}>참가자 정보를 불러오는 중...</Text>
              </View>
            ) : participants.length === 0 ? (
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40}}>
                <FontAwesome6 name="users" size={40} color={theme.inactive} iconStyle="solid" />
                <Text style={[typography.body, {color: theme.secondary, marginTop: 16, fontSize: toDP(14)}]}>아직 참가자가 없습니다</Text>
              </View>
            ) : (
              participants.map(participant => {
                const concentration = participantConcentrations[participant.uid] || 0;
                const concentrationColor = concentration >= 80 ? '#4CAF50' : concentration >= 60 ? '#FF9800' : '#F44336';

                return (
                  <Card key={participant.uid} title={participant.username} titleStyle={{color: theme.text, fontSize: toDP(16), fontWeight: '700'}} style={{gap: 12, backgroundColor: theme.card, borderColor: theme.border, borderRadius: 16}}>
                    <View style={{gap: 8}}>
                      {/* 집중도 표시 */}
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={[typography.body, {color: theme.secondary, fontSize: toDP(14), fontWeight: '500'}]}>주간 평균 집중도</Text>
                        <Text style={[typography.body, {color: concentrationColor, fontSize: toDP(14), fontWeight: '700'}]}>{concentration}%</Text>
                      </View>

                      {/* 일일 목표 */}
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                        <Text style={[typography.body, {color: theme.secondary, fontSize: toDP(14), fontWeight: '500'}]}>일일 목표</Text>
                        <Text style={[typography.body, {color: theme.text, fontSize: toDP(14), fontWeight: '600'}]}>{participant.current_daily_goal}분</Text>
                      </View>
                    </View>
                  </Card>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default StudyRoomDetail;
