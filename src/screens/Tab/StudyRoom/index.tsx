import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Image, RefreshControl, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Share from 'react-native-share';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {getMyStudyRooms} from '@/api';
import Card from '@/components/Card';
import {CustomBottomSheet, CustomBottomSheetView} from '@/components/CustomBottomSheet';
import FloatingActionButton from '@/components/FloatingActionButton';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {openBottomSheet} from '@/lib/bottomSheetUtils';
import {showToast} from '@/lib/toast';
import {BottomTabParamList} from '@/navigations/BottomTabs';
import {type StudyRoom as StudyRoomType} from '@/types/api';
import BottomSheet from '@gorhom/bottom-sheet';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const StudyRoom = () => {
  const {theme, typography} = useTheme();
  const {user} = useAuth();
  const bottomTabNavigation = useNavigation<NavigationProp<BottomTabParamList>>();

  const [refreshing, setRefreshing] = useState(false);
  const [studyRooms, setStudyRooms] = useState<StudyRoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudyRoom, setSelectedStudyRoom] = useState<StudyRoomType | null>(null);
  const [cachedStudyRoomLength, setCachedStudyRoomLength] = useState(0);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const fetchStudyRooms = useCallback(async () => {
    setLoading(true);
    try {
      const r = await getMyStudyRooms(user!.uid);
      setCachedStudyRoomLength(r.length);
      setStudyRooms(r);
      setLoading(false);
    } catch (e) {
      return showToast(`공부방 목록을 가져오는데 실패했어요.\n${(e as Error).message}`);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    fetchStudyRooms();
  }, [fetchStudyRooms, user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchStudyRooms()]);
    setRefreshing(false);
  }, [fetchStudyRooms]);

  // 화면이 blur될 때 bottom sheet 닫기
  useEffect(() => {
    const unsubscribe = bottomTabNavigation.addListener('blur', () => {
      bottomSheetRef.current?.close();
    });
    return unsubscribe;
  }, [bottomTabNavigation]);

  const inviteStudyRoom = (studyRoom: StudyRoomType) => {
    if (!user) {
      return;
    }

    const inviterName = user.displayName || '알 수 없는 사용자';
    const message = `📚 ${inviterName}님이 "${studyRoom.name}" 공부방에 초대했어요!

벌써 ${studyRoom.participants.length}명이 같이 공부 중이에요!
지금 바로 들어와서 같이 집중해봐요 🔥

👇 참여 링크
https://lead.ny64.kr/studyroom/join/?id=${studyRoom.room_id}
`;

    Share.open({message})
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };

  const leaveStudyRoom = (studyRoom: StudyRoomType) => {
    console.log('Leave Study Room:', studyRoom);
  };

  const reportStudyRoom = (studyRoom: StudyRoomType) => {
    console.log('Report Study Room:', studyRoom);
  };

  return (
    <Fragment>
      <ScrollView contentContainerStyle={{padding: 18, flexGrow: studyRooms.length === 0 ? 1 : 0}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.inactive} />}>
        <View style={{gap: 12, flex: 1, justifyContent: 'center'}}>
          {loading || refreshing ? (
            <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
              {Array.from({length: cachedStudyRoomLength || 5}).map((_, index) => (
                <SkeletonPlaceholder.Item key={index} flexDirection="row" marginBottom={12}>
                  <SkeletonPlaceholder.Item width={80} height={80} borderRadius={12} />
                  <SkeletonPlaceholder.Item flex={1} marginLeft={12}>
                    <SkeletonPlaceholder.Item width="60%" height={20} marginBottom={6} />
                    <SkeletonPlaceholder.Item width="40%" height={16} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder.Item>
              ))}
            </SkeletonPlaceholder>
          ) : studyRooms.length === 0 ? (
            <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12}}>
              <FontAwesome6 name="face-frown" iconStyle="regular" size={40} color={theme.inactive} />
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Text style={[typography.body, {color: theme.secondary}]}>아직 공부방이 없어요.</Text>
                <Text style={[typography.body, {color: theme.secondary}]}>공부방을 만들어보세요.</Text>
              </View>
            </View>
          ) : (
            studyRooms.map((studyRoom, index) => (
              <TouchableOpacity key={index} activeOpacity={0.65} onPress={() => console.log('Study Room Pressed')}>
                <Card style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                  <Image source={{uri: studyRoom.cover_image}} style={{width: 80, aspectRatio: 1, borderRadius: 12}} />
                  <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8}}>
                      <Text style={[typography.subtitle, {color: theme.text}]}>{studyRoom.name}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedStudyRoom(studyRoom);
                          openBottomSheet(bottomSheetRef);
                        }}
                        activeOpacity={0.65}
                        hitSlop={10}>
                        <FontAwesome6 name="ellipsis-vertical" iconStyle="solid" size={20} color={theme.secondary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={[typography.body, {color: theme.secondary}]}>{studyRoom.description}</Text>
                    <View style={{flex: 1, justifyContent: 'flex-end'}}>
                      <View style={{flexDirection: 'row', justifyContent: 'flex-end', gap: 12}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', gap: 2}}>
                          <FontAwesome6 name="user-group" iconStyle="solid" size={14} color={theme.secondary} />
                          <Text style={[typography.body, {color: theme.secondary}]}>{studyRoom.participants.length}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <CustomBottomSheet ref={bottomSheetRef} handleComponent={null} onClose={() => setSelectedStudyRoom(null)}>
        <CustomBottomSheetView>
          <View style={{gap: 16}}>
            <TouchableOpacity activeOpacity={0.65} onPress={() => inviteStudyRoom(selectedStudyRoom!)}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <FontAwesome6 name="user-plus" iconStyle="solid" size={16} color={theme.text} />
                <Text style={[typography.body, {color: theme.text}]}>초대하기</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 1, backgroundColor: theme.border}} />
            <TouchableOpacity activeOpacity={0.65} onPress={() => leaveStudyRoom(selectedStudyRoom!)}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <FontAwesome6 name="arrow-right-from-bracket" iconStyle="solid" size={16} color={theme.text} />
                <Text style={[typography.body, {color: theme.text}]}>나기기</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 1, backgroundColor: theme.border}} />
            <TouchableOpacity activeOpacity={0.65} onPress={() => reportStudyRoom(selectedStudyRoom!)}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <FontAwesome6 name="flag" iconStyle="solid" size={16} style={{minWidth: 18}} color={theme.red} />
                <Text style={[typography.body, {color: theme.red}]}>신고하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </CustomBottomSheetView>
      </CustomBottomSheet>

      <FloatingActionButton icon={<FontAwesome6 name="plus" iconStyle="solid" size={20} color={'#fff'} />} onPress={() => console.log('Floating button pressed')} style={{position: 'absolute', bottom: 16, right: 16}} />
    </Fragment>
  );
};

export default StudyRoom;
