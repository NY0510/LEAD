import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Image, Keyboard, RefreshControl, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {TimerPicker, TimerPickerRef} from 'react-native-timer-picker';

import {getGoal, getMemo, getStudyToday, setGoal, setMemo} from '@/api';
import Card from '@/components/Card';
import {CustomBottomSheet, CustomBottomSheetView} from '@/components/CustomBottomSheet';
import Loading from '@/components/Loading';
import ProgressBar from '@/components/ProgressBar';
import TouchableScale from '@/components/TouchableScale';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {openBottomSheet} from '@/lib/bottomSheetUtils';
import {formatTime} from '@/lib/timeUtils';
import {showToast} from '@/lib/toast';
import {RootStackParamList} from '@/navigations/RootStacks';
import {toDP} from '@/theme/typography';
import BottomSheet, {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const Home = () => {
  const {user} = useAuth();
  const {theme, typography} = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [goalStudyTime, setGoalStudyTime] = useState<number | null>(null); // 목표 공부 시간
  const [pureStudyTime, setPureStudyTime] = useState<number | null>(null); // 순 공부 시간
  const [nonStudyTime, setNonStudyTime] = useState<number | null>(null); // 공부 이외 시간
  const [totalStudyTime, setTotalStudyTime] = useState<number | null>(null); // 총 공부 시간
  const [achievement, setAchievement] = useState<number | null>(null); // 달성률
  const [memoState, setMemoState] = useState<string>(''); // 메모

  const [studyTimeLoading, setStudyTimeLoading] = useState(true);
  const [memoLoading, setMemoLoading] = useState(true);

  const [timePickerValue, setTimePickerValue] = useState({hours: 0, minutes: 0});
  const timerPickerRef = useRef<TimerPickerRef>(null);

  const studyTimeBottomSheetRef = useRef<BottomSheet>(null);
  const memoBottomSheetRef = useRef<BottomSheet>(null);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user?.uid) {
        return;
      }

      const {goal} = await getGoal(user.uid);
      if (goal) {
        setGoalStudyTime(goal);
      }
    })();
  }, [user?.uid]);

  const fetchTodayStudyData = useCallback(async () => {
    if (!user?.uid) {
      return;
    }

    setStudyTimeLoading(true);
    try {
      const r = await getStudyToday(user!.uid);
      setPureStudyTime(r.pure_study ?? 0);
      setNonStudyTime(r.non_study ?? 0);
      setTotalStudyTime(r.total ?? 0);

      setStudyTimeLoading(false);
    } catch (e) {
      return showToast(`오늘의 공부 기록을 가져오는데 실패했어요.\n${(e as Error).message}`);
    }
  }, [user]);

  const fetchMemo = useCallback(async () => {
    if (!user?.uid) {
      return;
    }

    setMemoLoading(true);
    try {
      const r = await getMemo(user!.uid);
      setMemoState(r.memo);
      setMemoLoading(false);
    } catch (e) {
      return showToast(`메모를 가져오는데 실패했어요.\n${(e as Error).message}`);
    }
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchTodayStudyData(), fetchMemo()]);
    setRefreshing(false);
  }, [fetchTodayStudyData, fetchMemo]);

  // 데이터 가져오기
  useEffect(() => {
    fetchTodayStudyData();
    fetchMemo();
  }, [fetchMemo, fetchTodayStudyData]);

  // 달성률 계산
  useEffect(() => setAchievement(goalStudyTime && pureStudyTime ? pureStudyTime / goalStudyTime : 0), [goalStudyTime, pureStudyTime]);

  return (
    <Fragment>
      <ScrollView contentContainerStyle={{padding: 18}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.inactive} />}>
        <View style={{gap: 22}}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
            <View style={{flexWrap: 'wrap'}}>
              <Text style={[typography.title, {color: theme.primary}]}>{user?.displayName}</Text>
              <Text style={[typography.subtitle, {color: theme.text}]}>님의 하루를 LEAD가 응원할게요!</Text>
            </View>
            <Image source={require('@/assets/images/rock.png')} style={{width: 64, height: 64}} />
          </View>

          <TouchableOpacity activeOpacity={0.65} onPress={() => openBottomSheet(memoBottomSheetRef)}>
            <View style={[{borderRadius: 16, paddingHorizontal: 14, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8}, {backgroundColor: theme.card}]}>
              <View style={[{borderLeftWidth: 15, borderRightWidth: 15, borderBottomWidth: 20, borderLeftColor: 'transparent', borderRightColor: 'transparent', position: 'absolute', top: -20, right: 20}, {borderBottomColor: theme.card}]} />
              {memoLoading || refreshing ? (
                <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                  <SkeletonPlaceholder.Item width={300} height={20} />
                </SkeletonPlaceholder>
              ) : (
                <Text style={[typography.subtitle, {color: theme.secondary}, {fontWeight: '600', flexShrink: 1}]}>{memoState || '오늘의 목표나 메모를 적어보세요!'}</Text>
              )}
              <FontAwesome6 name="pen" size={18} color={theme.secondary} iconStyle="solid" />
            </View>
          </TouchableOpacity>

          <Card title="LEAD와 공부 시작하기">
            <Fragment>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <TouchableOpacity activeOpacity={0.65} onPress={() => openBottomSheet(studyTimeBottomSheetRef)}>
                  {studyTimeLoading || refreshing ? (
                    <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                      <SkeletonPlaceholder.Item width={60} height={50} marginBottom={4} />
                      <SkeletonPlaceholder.Item width={100} height={20} />
                    </SkeletonPlaceholder>
                  ) : (
                    <View>
                      <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                        <Text style={[{fontSize: toDP(36), color: theme.text}, {fontWeight: '600'}]}>{formatTime(pureStudyTime!)}</Text>
                        <FontAwesome6 name="pen" size={18} color={theme.secondary} iconStyle="solid" />
                      </View>
                      <Text style={[typography.body, {color: theme.secondary}, {fontWeight: '600'}]}>/ {formatTime(goalStudyTime!)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.65} onPress={() => navigation.navigate('Study')}>
                  <TouchableScale>
                    <View style={[{aspectRatio: 1, padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}, {backgroundColor: theme.background}]}>
                      <FontAwesome6 name="play" size={26} color={theme.primary} iconStyle="solid" />
                    </View>
                  </TouchableScale>
                </TouchableOpacity>
              </View>
              {studyTimeLoading || refreshing ? (
                <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                  <SkeletonPlaceholder.Item flexDirection="row" alignItems="center" justifyContent="space-between" gap={12}>
                    <SkeletonPlaceholder.Item flex={1} height={12} />
                    <SkeletonPlaceholder.Item width={30} height={12} />
                  </SkeletonPlaceholder.Item>
                </SkeletonPlaceholder>
              ) : (
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12}}>
                  <ProgressBar style={{flex: 1}} segments={[{value: achievement!, color: '#344BFD'}]} height={12} borderRadius={6} />
                  <Text style={[typography.body, {color: theme.text, fontWeight: '500'}]}>{Math.round(achievement! * 100)}%</Text>
                </View>
              )}
            </Fragment>
          </Card>

          <Card title="내 공부방">
            <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12}}>
              {Array.from({length: 3}, (_, i) => (
                <TouchableOpacity key={i} activeOpacity={0.65} style={{flexGrow: 1}}>
                  <TouchableScale>
                    <View style={[{padding: 20, borderRadius: 16, alignItems: 'center', justifyContent: 'center', width: '100%'}, {backgroundColor: theme.background}]}>
                      <Text style={[typography.body, {color: theme.text}, {fontWeight: '600'}]}>공부방 {i + 1}</Text>
                    </View>
                  </TouchableScale>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <Card title="오늘의 공부">
            <View style={{gap: 8}}>
              <View style={{flexDirection: 'row', gap: 12}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <View style={{width: 15, height: 15, borderColor: '#344BFD', borderWidth: 3, borderRadius: 7.5}} />
                  <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>순 공부시간</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 4}}>
                  <View style={{width: 15, height: 15, borderColor: '#EE902C', borderWidth: 3, borderRadius: 7.5}} />
                  <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>공부 이외 시간</Text>
                </View>
              </View>

              {studyTimeLoading || refreshing ? (
                <SkeletonPlaceholder borderRadius={8} backgroundColor={theme.inactive} highlightColor={theme.background}>
                  <SkeletonPlaceholder.Item width={'100%'} height={12} />
                </SkeletonPlaceholder>
              ) : (
                <ProgressBar
                  segments={[
                    {value: (pureStudyTime ?? 0) / (totalStudyTime ?? 1), color: '#344BFD'},
                    {value: (nonStudyTime ?? 0) / (totalStudyTime ?? 1), color: '#F68D2B'},
                  ]}
                  height={12}
                  borderRadius={6}
                />
              )}
            </View>
          </Card>
        </View>
      </ScrollView>

      <CustomBottomSheet ref={studyTimeBottomSheetRef} handleComponent={null}>
        <CustomBottomSheetView>
          <View style={{gap: 4}}>
            <Text style={[typography.subtitle, {fontWeight: '700', fontSize: 20, color: theme.text}]}>목표 공부 시간 변경</Text>
            <Text style={[typography.body, {fontWeight: '400', fontSize: 16, color: theme.text}]}>공부를 시작한 이후에 변경할 시 공부 시간이 초기화돼요.</Text>
          </View>
          <View style={[{width: '100%', borderRadius: 12, paddingVertical: 8, alignItems: 'center', marginBottom: 8, backgroundColor: theme.background}]}>
            {goalStudyTime !== null ? (
              <TimerPicker
                key={goalStudyTime}
                ref={timerPickerRef}
                initialValue={{
                  hours: Math.floor(goalStudyTime / 60),
                  minutes: goalStudyTime % 60,
                }}
                onDurationChange={v => setTimePickerValue(v)}
                hourInterval={1}
                minuteInterval={10}
                hourLabel={'시간'}
                minuteLabel={'분'}
                hideSeconds
                styles={{
                  pickerItem: {...typography.baseTextStyle, fontSize: 24, fontWeight: '600', color: theme.primary},
                  pickerLabel: {...typography.baseTextStyle, fontWeight: '600', right: -12, color: theme.secondary},
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <Loading />
            )}
          </View>
          <TouchableOpacity
            activeOpacity={0.65}
            style={[{borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, alignSelf: 'stretch', alignItems: 'center'}, {backgroundColor: theme.primary}]}
            onPress={() => {
              const latestDuration = timerPickerRef.current?.latestDuration;
              const hours = latestDuration?.hours?.current || timePickerValue.hours;
              const minutes = latestDuration?.minutes?.current || timePickerValue.minutes;
              if (hours === 0 && minutes === 0) {
                return showToast('목표 공부 시간을 0으로 설정할 수 없어요.');
              }

              const newGoal = hours * 60 + minutes;
              setGoalStudyTime(newGoal);
              setGoal(user!.uid, newGoal);
              studyTimeBottomSheetRef.current?.close();
            }}>
            <Text style={[typography.body, {color: theme.card}, {fontWeight: '600'}]}>저장</Text>
          </TouchableOpacity>
        </CustomBottomSheetView>
      </CustomBottomSheet>

      <CustomBottomSheet ref={memoBottomSheetRef} handleComponent={null}>
        <CustomBottomSheetView>
          <Text style={[typography.subtitle, {color: theme.text, fontWeight: '700', fontSize: 20}]}>메모 입력</Text>
          <View style={{flex: 1, width: '100%'}}>
            <BottomSheetTextInput
              style={{
                minHeight: 80,
                borderColor: theme.inactive,
                borderWidth: 1,
                borderRadius: 8,
                padding: 12,
                color: theme.text,
                backgroundColor: theme.background,
                ...typography.body,
              }}
              multiline
              value={memoState}
              onChangeText={setMemoState}
              placeholder="오늘의 목표나 메모를 적어보세요"
              placeholderTextColor={theme.inactive}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.65}
            style={[{borderRadius: 8, paddingVertical: 12, paddingHorizontal: 32, alignSelf: 'stretch', alignItems: 'center'}, {backgroundColor: theme.primary}]}
            onPress={async () => {
              if (memoState.length > 100) {
                return showToast('메모는 100자 이내로 작성해주세요.');
              }

              setMemo(user!.uid, memoState.trim());
              Keyboard.dismiss();
              memoBottomSheetRef.current?.close();
            }}>
            <Text style={[typography.body, {color: theme.card}, {fontWeight: '600'}]}>저장</Text>
          </TouchableOpacity>
        </CustomBottomSheetView>
      </CustomBottomSheet>
    </Fragment>
  );
};

export default Home;
