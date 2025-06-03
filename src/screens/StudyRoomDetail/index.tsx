import React, {useEffect, useState} from 'react';
import {ImageBackground, ScrollView, StyleSheet, Text, View} from 'react-native';

import {getStudyRoom} from '@/api';
import Card from '@/components/Card';
import Loading from '@/components/Loading';
import {useTheme} from '@/contexts/ThemeContext';
import {showToast} from '@/lib/toast';
import {RootStackParamList} from '@/navigations/RootStacks';
import {toDP} from '@/theme/typography';
import {StudyRoom as StudyRoomType} from '@/types/api';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

const StudyRoomDetail = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'StudyRoomDetail'>>();
  const {theme, typography} = useTheme();
  const navigation = useNavigation();
  const id = route.params.id || null;

  const [studyRoom, setStudyRoom] = useState<StudyRoomType | null>(null);
  const [loading, setLoading] = useState(true);

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
        <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.5)'}} />
        <View style={{paddingHorizontal: 16, paddingVertical: 32}}>
          <Text style={[typography.title, {color: theme.card, fontSize: toDP(28)}]}>{studyRoom.name}</Text>
          <Text style={[typography.subtitle, {color: theme.inactive}]}>
            참여자 {studyRoom.participants.length}명 ⋅ 개설일 {studyRoom.created_at ? new Date(studyRoom.created_at).toLocaleDateString() : '알 수 없음'}
          </Text>
        </View>
      </ImageBackground>
      <View style={{flex: 2, backgroundColor: theme.background, borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 24, marginTop: -32}}>
        <ScrollView contentContainerStyle={{gap: 16}} showsVerticalScrollIndicator={false}>
          <Card title="김가온" titleStyle={{color: theme.text, fontSize: toDP(20)}} style={{gap: 8}}>
            <View>
              <Text style={[typography.body, {color: theme.text}]}>공부 시간: N/A분</Text>
              <Text style={[typography.body, {color: theme.text}]}>평균 집중도: N/A%</Text>
            </View>
          </Card>
          <Card title="김가온" titleStyle={{color: theme.text, fontSize: toDP(20)}} style={{gap: 8}}>
            <View>
              <Text style={[typography.body, {color: theme.text}]}>공부 시간: N/A분</Text>
              <Text style={[typography.body, {color: theme.text}]}>평균 집중도: N/A%</Text>
            </View>
          </Card>
          <Card title="김가온" titleStyle={{color: theme.text, fontSize: toDP(20)}} style={{gap: 8}}>
            <View>
              <Text style={[typography.body, {color: theme.text}]}>공부 시간: N/A분</Text>
              <Text style={[typography.body, {color: theme.text}]}>평균 집중도: N/A%</Text>
            </View>
          </Card>
          <Card title="김가온" titleStyle={{color: theme.text, fontSize: toDP(20)}} style={{gap: 8}}>
            <View>
              <Text style={[typography.body, {color: theme.text}]}>공부 시간: N/A분</Text>
              <Text style={[typography.body, {color: theme.text}]}>평균 집중도: N/A%</Text>
            </View>
          </Card>
          <Card title="김가온" titleStyle={{color: theme.text, fontSize: toDP(20)}} style={{gap: 8}}>
            <View>
              <Text style={[typography.body, {color: theme.text}]}>공부 시간: N/A분</Text>
              <Text style={[typography.body, {color: theme.text}]}>평균 집중도: N/A%</Text>
            </View>
          </Card>
        </ScrollView>
      </View>
    </View>
  );
};

export default StudyRoomDetail;
