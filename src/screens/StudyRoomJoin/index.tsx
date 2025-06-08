/* eslint-disable react/no-unstable-nested-components */
import React, {Fragment, useEffect, useMemo, useRef, useState} from 'react';
import {Dimensions, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {Extrapolate, interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Share from 'react-native-share';

import {getMyStudyRooms, getStudyRoom, getUserInfo, joinStudyRoom} from '@/api';
import {CustomBottomSheet, CustomBottomSheetScrollView} from '@/components/CustomBottomSheet';
import Loading from '@/components/Loading';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {getShareStudyRoomMessage} from '@/lib/shareStudyRoom';
import {showToast} from '@/lib/toast';
import {RootStackParamList} from '@/navigations/RootStacks';
import {toDP} from '@/theme/typography';
import {StudyRoom as StudyRoomType} from '@/types/api';
import BottomSheet, {BottomSheetFooter, BottomSheetFooterProps, BottomSheetHandle, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {BottomSheetBackdropProps} from '@gorhom/bottom-sheet';
import {BottomSheetHandleProps} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';

const CustomHandle: React.FC<BottomSheetHandleProps & {studyRoom: StudyRoomType}> = ({studyRoom, animatedIndex, animatedPosition}) => {
  const {theme, typography} = useTheme();
  const {user} = useAuth();
  const insets = useSafeAreaInsets();

  const bottomPadding = Platform.OS === 'ios' ? insets.bottom + 32 : Math.max(insets.bottom + 32, 50);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(animatedIndex.value, [0, 1], [1, 0], Extrapolate.CLAMP),
      transform: [{translateY: interpolate(animatedIndex.value, [0, 1], [0, -20], Extrapolate.CLAMP)}],
    };
  });

  return (
    <BottomSheetHandle animatedIndex={animatedIndex} animatedPosition={animatedPosition} style={{backgroundColor: theme.background, borderTopLeftRadius: 16, borderTopRightRadius: 16}} indicatorStyle={{backgroundColor: theme.text}}>
      <Animated.View style={[animatedStyle, {position: 'absolute', bottom: bottomPadding, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: Dimensions.get('window').width}]}>
        <View>
          <Text style={[typography.title, {color: '#FFFFFF', fontSize: toDP(28), fontWeight: '700'}]}>{studyRoom.name}</Text>
          <Text style={[typography.subtitle, {color: '#F5F5F5', fontSize: toDP(22)}]}>{studyRoom.description || '공부방 설명이 없어요.'}</Text>
        </View>
        <View>
          <TouchableOpacity
            activeOpacity={0.65}
            style={{padding: 12, backgroundColor: `${theme.text}99`, borderRadius: 999}}
            onPress={async () => {
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
              } catch (e) {
                showToast(`공부방 초대하기에 실패했어요.\n${(e as Error).message}`);
              }
            }}>
            <FontAwesome6 name="share" iconStyle="solid" size={16} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BottomSheetHandle>
  );
};

const CustomBackdrop: React.FC<BottomSheetBackdropProps & {studyRoom: StudyRoomType}> = ({animatedIndex, style, studyRoom}) => {
  const {typography} = useTheme();
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1], Extrapolate.CLAMP),
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 1], [0, 1], Extrapolate.CLAMP),
    transform: [{translateY: interpolate(animatedIndex.value, [0, 1], [20, 0], Extrapolate.CLAMP)}],
  }));

  const containerStyle = useMemo(() => [style, containerAnimatedStyle], [style, containerAnimatedStyle]);

  return (
    <Animated.View style={containerStyle}>
      <ImageBackground source={studyRoom.cover_image ? {uri: studyRoom.cover_image} : require('@/assets/images/studyroom_default.jpg')} style={StyleSheet.absoluteFillObject} resizeMode="cover">
        <View style={{...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)'}} />
        <Animated.View style={[textAnimatedStyle, {paddingHorizontal: 16, paddingVertical: 32}]}>
          <Text style={[typography.title, {color: '#FFFFFF', fontSize: toDP(28), fontWeight: '700'}]}>{studyRoom.name}</Text>
          <Text style={[typography.subtitle, {color: '#F5F5F5'}]}>
            참여자 {studyRoom.participants.length}명 ⋅ 개설일 {studyRoom.created_at ? new Date(studyRoom.created_at).toLocaleDateString() : '알 수 없음'}
          </Text>
        </Animated.View>
      </ImageBackground>
    </Animated.View>
  );
};

const CustomFooter: React.FC<BottomSheetFooterProps & {handleJoin: () => void}> = ({animatedFooterPosition, handleJoin}) => {
  const {theme, typography} = useTheme();

  return (
    <BottomSheetFooter animatedFooterPosition={animatedFooterPosition}>
      <TouchableOpacity activeOpacity={0.65} style={{padding: 16, backgroundColor: theme.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8}} onPress={handleJoin}>
        <FontAwesome6 name="user-plus" iconStyle="solid" size={16} color={theme.text} />
        <Text style={[typography.subtitle, {color: theme.text}]}>참여하기</Text>
      </TouchableOpacity>
    </BottomSheetFooter>
  );
};

const StudyRoomJoin = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'StudyRoomJoin'>>();
  const {theme, typography} = useTheme();
  const {user} = useAuth();
  const navigation = useNavigation();

  const id = route.params.id || null;

  const bottomSheetRef = useRef<BottomSheet>(null);

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

  useEffect(() => {
    (async () => {
      await AsyncStorage.removeItem('openedDeepLinkUrl');
    })();
  }, []);

  const handleJoin = async () => {
    if (!studyRoom) {
      return showToast('공부방 정보가 없습니다.');
    }
    if (!user) {
      return;
    }

    try {
      showToast(`"${studyRoom.name}" 공부방에 참여했어요!`);
      const myStudyRooms = await getMyStudyRooms(user.uid);
      if (myStudyRooms.some((room: StudyRoomType) => room.room_id === studyRoom.room_id)) {
        return showToast(`이미 "${studyRoom.name}" 공부방에 참여 중이에요.`);
      }

      await joinStudyRoom(user.uid, studyRoom.room_id);
    } catch (error) {
      showToast(`공부방 참여에 실패했어요.\n${(error as Error).message}`);
    }
  };

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
    <Fragment>
      <View style={{flex: 1, backgroundColor: theme.background}}>
        <ImageBackground source={studyRoom.cover_image ? {uri: studyRoom.cover_image} : require('@/assets/images/studyroom_default.jpg')} style={{...StyleSheet.absoluteFillObject, justifyContent: 'flex-end'}} resizeMode="cover">
          <LinearGradient colors={['transparent', '#000']} style={{bottom: 0, left: 0, right: 0, position: 'absolute', height: 300, marginBottom: '20%'}} />
        </ImageBackground>
      </View>
      <CustomBottomSheet
        ref={bottomSheetRef}
        index={0}
        overDragResistanceFactor={0}
        handleComponent={props => <CustomHandle {...props} studyRoom={studyRoom} />}
        backdropComponent={props => <CustomBackdrop {...props} studyRoom={studyRoom} />}
        footerComponent={props => <CustomFooter {...props} handleJoin={handleJoin} />}
        snapPoints={['40%', '80%']}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        animateOnMount={false}>
        <CustomBottomSheetScrollView style={{backgroundColor: theme.background, flex: 1, paddingHorizontal: 16, paddingTop: 20, borderTopLeftRadius: 0, borderTopRightRadius: 0}}>
          <View style={{gap: 20, flex: 1}}>
            <View style={{gap: 16}}>
              <Text style={[typography.title, {color: theme.text, fontSize: toDP(22), fontWeight: '700'}]}>공부방 정보</Text>
              <View style={{backgroundColor: theme.card, borderRadius: 12, padding: 16, gap: 12}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <FontAwesome6 name="users" iconStyle="solid" size={16} color={theme.primary} />
                  <Text style={[typography.body, {color: theme.text, fontWeight: '600'}]}>참여자</Text>
                  <Text style={[typography.body, {color: theme.secondary, marginLeft: 'auto'}]}>{studyRoom.participants.length}명</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                  <FontAwesome6 name="calendar" iconStyle="solid" size={16} color={theme.primary} />
                  <Text style={[typography.body, {color: theme.text, fontWeight: '600'}]}>개설일</Text>
                  <Text style={[typography.body, {color: theme.secondary, marginLeft: 'auto'}]}>{studyRoom.created_at ? new Date(studyRoom.created_at).toLocaleDateString() : '알 수 없음'}</Text>
                </View>
                {studyRoom.description && (
                  <View style={{gap: 8}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                      <FontAwesome6 name="quote-left" iconStyle="solid" size={16} color={theme.primary} />
                      <Text style={[typography.body, {color: theme.text, fontWeight: '600'}]}>설명</Text>
                    </View>
                    <Text style={[typography.body, {color: theme.secondary, lineHeight: 20, marginLeft: 24}]}>{studyRoom.description}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{gap: 16, flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <Text style={[typography.title, {color: theme.text, fontSize: toDP(22), fontWeight: '700'}]}>참가자 목록</Text>
                <Text style={[typography.body, {color: theme.secondary}]}>{studyRoom.participants.length}명이 함께하고 있어요</Text>
              </View>

              {studyRoom.participants.length > 0 ? (
                <View style={{gap: 12, flex: 1}}>
                  {studyRoom.participants.map(async (participantId, index) => {
                    const participantName = await getUserInfo(participantId)
                      .then(userInfo => userInfo.username)
                      .catch(() => '알 수 없음');

                    return (
                      <View
                        key={participantId}
                        style={{
                          backgroundColor: theme.card,
                          borderRadius: 12,
                          padding: 16,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                        }}>
                        <View style={{flex: 1}}>
                          <Text style={[typography.body, {color: theme.text, fontWeight: '600', fontSize: toDP(16)}]}>{participantName}</Text>
                          <Text style={[typography.body, {color: theme.secondary, fontSize: toDP(14)}]}>함께 공부하는 멤버</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16}}>
                  <FontAwesome6 name="user-plus" iconStyle="solid" size={48} color={theme.inactive} />
                  <View style={{alignItems: 'center', gap: 4}}>
                    <Text style={[typography.body, {color: theme.text, fontWeight: '600'}]}>아직 참가자가 없어요</Text>
                    <Text style={[typography.body, {color: theme.secondary, textAlign: 'center'}]}>첫 번째 참가자가 되어주세요!</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={{backgroundColor: `${theme.primary}15`, borderRadius: 12, padding: 16, gap: 8, marginBottom: 80}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <FontAwesome6 name="circle-info" iconStyle="solid" size={16} color={theme.primary} />
                <Text style={[typography.body, {color: theme.primary, fontWeight: '600'}]}>공부방 참여 안내</Text>
              </View>
              <Text style={[typography.body, {color: theme.text, lineHeight: 20, fontSize: toDP(14)}]}>공부방에 참여하면 다른 멤버들과 함께 집중력을 기록하고 서로 동기부여를 받을 수 있어요.</Text>
            </View>
          </View>
        </CustomBottomSheetScrollView>
      </CustomBottomSheet>
    </Fragment>
  );
};

export default StudyRoomJoin;
