import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Image, RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Animated, {useAnimatedStyle, withTiming} from 'react-native-reanimated';
import Share from 'react-native-share';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

import {deleteStudyRoom, getMyStudyRooms, leaveStudyRoom} from '@/api/apiRouter';
import Card from '@/components/Card';
import {CustomBottomSheet, CustomBottomSheetView} from '@/components/CustomBottomSheet';
import FloatingActionButton from '@/components/FloatingActionButton';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {closeBottomSheet, openBottomSheet} from '@/lib/bottomSheetUtils';
import {getShareStudyRoomMessage} from '@/lib/shareStudyRoom';
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
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');

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

  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setStudyRooms(prevRooms => [...prevRooms].sort((a, b) => (sortOrder === 'asc' ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())));
  };

  const filteredStudyRooms = studyRooms.filter(room => room.name.toLowerCase().includes(searchQuery.toLowerCase()) || (room.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()));

  const handleInviteStudyRoom = async (studyRoom: StudyRoomType) => {
    if (!user) {
      return;
    }

    const message = getShareStudyRoomMessage(user, studyRoom);

    try {
      await Share.open({
        message,
        title: '공부방 초대하기',
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
      <View style={{flex: 1}}>
        <View style={{padding: 16, backgroundColor: theme.background}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14}}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8, padding: 8, borderWidth: 1, borderColor: theme.border, borderRadius: 8}}>
              <FontAwesome6 name="magnifying-glass" iconStyle="solid" size={20} color={theme.secondary} />
              <TextInput placeholder="이름 및 설명으로 검색" maxLength={30} placeholderTextColor={theme.secondary} style={[typography.body, {color: theme.text, flexShrink: 1, flex: 1, padding: 0, margin: 0}]} value={searchQuery} onChangeText={setSearchQuery} />
              {searchQuery.length > 0 && (
                <TouchableOpacity activeOpacity={0.65} onPress={() => setSearchQuery('')}>
                  <FontAwesome6 name="circle-xmark" iconStyle="solid" size={18} color={theme.secondary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={toggleSortOrder} activeOpacity={0.65} hitSlop={10}>
              <FontAwesome6 name={sortOrder === 'asc' ? 'sort-up' : 'sort-down'} iconStyle="solid" size={20} color={theme.secondary} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView style={{flex: 1, paddingHorizontal: 16}} contentContainerStyle={{flexGrow: filteredStudyRooms.length === 0 ? 1 : 0}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.secondary} />}>
          <View style={{gap: 12, flex: 1, justifyContent: 'center', marginBottom: 100}}>
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
            ) : filteredStudyRooms.length === 0 ? (
              <View style={{alignItems: 'center', justifyContent: 'center', flex: 1, gap: 12}}>
                <FontAwesome6 name="face-frown" iconStyle="regular" size={40} color={theme.inactive} />
                <View style={{alignItems: 'center', justifyContent: 'center'}}>
                  <Text style={[typography.body, {color: theme.secondary}]}>아직 공부방이 없어요.</Text>
                  <Text style={[typography.body, {color: theme.secondary}]}>공부방을 만들어보세요.</Text>
                </View>
              </View>
            ) : (
              filteredStudyRooms.map(studyRoom => (
                <TouchableOpacity key={studyRoom.room_id} activeOpacity={0.65} onPress={() => rootStackNavigation.navigate('StudyRoomDetail', {id: studyRoom.room_id})}>
                  <Card style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                    <Image source={studyRoom.cover_image ? {uri: studyRoom.cover_image} : require('@/assets/images/studyroom_default.jpg')} style={{width: 80, aspectRatio: 1, borderRadius: 12}} />
                    <View style={{flex: 1}}>
                      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8}}>
                        <Text style={[typography.subtitle, {color: theme.text, flexShrink: 1}]} numberOfLines={1} ellipsizeMode="tail">
                          {studyRoom.name}
                        </Text>
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
                      <Text style={[typography.body, {color: theme.secondary, flexShrink: 1}]} numberOfLines={2} ellipsizeMode="tail">
                        {studyRoom.description}
                      </Text>
                      <View style={{flex: 1, justifyContent: 'flex-end', marginTop: 12}}>
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
      </View>

      <Animated.View style={[{position: 'absolute', bottom: 16, right: 16}, animatedStyle]}>
        <FloatingActionButton icon={<FontAwesome6 name="plus" iconStyle="solid" size={20} color={'#fff'} />} onPress={() => rootStackNavigation.navigate('StudyRoomCreate')} />
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
