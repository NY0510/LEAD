import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Image, RefreshControl, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import Share from 'react-native-share';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {deleteStudyRoom, getMyStudyRooms, leaveStudyRoom} from '@/api';
import Card from '@/components/Card';
import {CustomBottomSheet, CustomBottomSheetView} from '@/components/CustomBottomSheet';
import FloatingActionButton from '@/components/FloatingActionButton';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {closeBottomSheet, openBottomSheet} from '@/lib/bottomSheetUtils';
import {showToast} from '@/lib/toast';
import {BottomTabParamList} from '@/navigations/BottomTabs';
import {RootStackParamList} from '@/navigations/RootStacks';
import {type StudyRoom as StudyRoomType} from '@/types/api';
import BottomSheet from '@gorhom/bottom-sheet';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const StudyRoom = () => {
  const {theme, typography} = useTheme();
  const {user} = useAuth();
  const bottomTabNavigation = useNavigation<NavigationProp<BottomTabParamList>>();
  const rootStackNavigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [refreshing, setRefreshing] = useState(false);
  const [studyRooms, setStudyRooms] = useState<StudyRoomType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudyRoom, setSelectedStudyRoom] = useState<StudyRoomType | null>(null);
  const [cachedStudyRoomLength, setCachedStudyRoomLength] = useState(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  const actionBottomSheetRef = useRef<BottomSheet>(null);

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
      actionBottomSheetRef.current?.close();
    });
    return unsubscribe;
  }, [bottomTabNavigation]);

  useEffect(() => {
    const unsubscribe = bottomTabNavigation.addListener('focus', () => {
      fetchStudyRooms();
    });
    return unsubscribe;
  }, [bottomTabNavigation, fetchStudyRooms]);

  const handleInviteStudyRoom = async (studyRoom: StudyRoomType) => {
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

    try {
      await Share.open({
        message,
        title: '공부방 초대하기',
        url: `https://lead.ny64.kr/studyroom/join/?id=${studyRoom.room_id}`,
        failOnCancel: false,
      });
      closeBottomSheet(actionBottomSheetRef);
    } catch (e) {
      showToast(`공부방 초대하기에 실패했어요.\n${(e as Error).message}`);
    }
  };

  const handleLeaveStudyRoom = async (studyRoom: StudyRoomType) => {
    if (!user) {
      return;
    }

    try {
      await leaveStudyRoom(user.uid, studyRoom.room_id);
      setStudyRooms(studyRooms.filter(room => room.room_id !== studyRoom.room_id));
      closeBottomSheet(actionBottomSheetRef);
      showToast('공부방에서 나갔어요.');
    } catch (e) {
      showToast(`공부방에서 나가는데 실패했어요.\n${(e as Error).message}`);
    }
  };

  const handleDeleteStudyRoom = async (studyRoom: StudyRoomType) => {
    if (!user) {
      return;
    }

    try {
      await deleteStudyRoom(user.uid, studyRoom.room_id);
      setStudyRooms(studyRooms.filter(room => room.room_id !== studyRoom.room_id));
      closeBottomSheet(actionBottomSheetRef);
      showToast('공부방을 삭제했어요.');
    } catch (e) {
      showToast(`공부방을 삭제하는데 실패했어요.\n${(e as Error).message}`);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(bottomSheetOpen ? 0 : 1, {duration: 200}),
      transform: [{scale: withTiming(bottomSheetOpen ? 0.9 : 1, {duration: 200})}],
    };
  }, [bottomSheetOpen]);

  return (
    <Fragment>
      <ScrollView contentContainerStyle={{padding: 18, flexGrow: loading || studyRooms.length !== 0 ? 0 : 1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.inactive} />}>
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
            studyRooms.map(studyRoom => (
              <TouchableOpacity key={studyRoom.room_id} activeOpacity={0.65} onPress={() => console.log('Study Room Pressed')}>
                <Card style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                  <Image source={studyRoom.cover_image ? {uri: studyRoom.cover_image} : require('@/assets/images/studyroom_default.jpg')} style={{width: 80, aspectRatio: 1, borderRadius: 12}} />
                  <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8}}>
                      <Text style={[typography.subtitle, {color: theme.text}]}>{studyRoom.name}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          setBottomSheetOpen(true);
                          setSelectedStudyRoom(studyRoom);
                          openBottomSheet(actionBottomSheetRef);
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

      <Animated.View style={[{position: 'absolute', bottom: 16, right: 16}, animatedStyle]}>
        <FloatingActionButton icon={<FontAwesome6 name="plus" iconStyle="solid" size={20} color={'#fff'} />} onPress={() => rootStackNavigation.navigate('CreateStudyRoom')} />
      </Animated.View>

      <CustomBottomSheet
        ref={actionBottomSheetRef}
        handleComponent={null}
        onClose={() => {
          setSelectedStudyRoom(null);
          setBottomSheetOpen(false);
        }}>
        <CustomBottomSheetView>
          <View style={{gap: 14}}>
            <TouchableOpacity activeOpacity={0.65} onPress={() => handleInviteStudyRoom(selectedStudyRoom!)}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <FontAwesome6 name="user-plus" iconStyle="solid" size={16} color={theme.text} style={{minWidth: 20}} />
                <Text style={[typography.body, {color: theme.text}]}>초대하기</Text>
              </View>
            </TouchableOpacity>
            <View style={{height: 1, backgroundColor: theme.border}} />
            {selectedStudyRoom && user && selectedStudyRoom.owner_uid === user.uid ? (
              <TouchableOpacity activeOpacity={0.65} onPress={() => handleDeleteStudyRoom(selectedStudyRoom)}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <FontAwesome6 name="trash" iconStyle="solid" size={16} color={theme.red} style={{minWidth: 20}} />
                  <Text style={[typography.body, {color: theme.red}]}>삭제하기</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity activeOpacity={0.65} onPress={() => handleLeaveStudyRoom(selectedStudyRoom!)}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <FontAwesome6 name="arrow-right-from-bracket" iconStyle="solid" size={16} color={theme.text} style={{minWidth: 20}} />
                  <Text style={[typography.body, {color: theme.text}]}>나가기</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </CustomBottomSheetView>
      </CustomBottomSheet>
    </Fragment>
  );
};

export default StudyRoom;
