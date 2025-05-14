import React, {Fragment, useCallback, useEffect, useRef, useState} from 'react';
import {Image, Keyboard, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TimerPicker, TimerPickerRef} from 'react-native-timer-picker';

import styles from './styles';
import Card from '@/components/Card';
import ProgressBar from '@/components/ProgressBar';
import TouchableScale from '@/components/TouchableScale';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {formatTime} from '@/lib/timeUtils';
import {showToast} from '@/lib/toast';
import {RootStackParamList} from '@/navigations/RootStacks';
import {toDP} from '@/theme/typography';
import BottomSheet, {BottomSheetBackdrop, BottomSheetTextInput, BottomSheetView} from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {NavigationProp, useNavigation} from '@react-navigation/native';

const Home = () => {
  const {user} = useAuth();
  const {theme, typography} = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [goalStudyTime, setGoalStudyTime] = useState(4 * 60); // 목표 공부 시간
  const [pureStudyTime, setPureStudyTime] = useState(2.5 * 60); // 순 공부 시간
  const [studyTimeOther, setStudyTimeOther] = useState(1 * 60); // 공부 이외 시간
  const [studyTimePer, setStudyTimePer] = useState(pureStudyTime / goalStudyTime); // 달성률
  const [memo, setMemo] = useState<string>(''); // 메모

  const [timePickerValue, setTimePickerValue] = useState({hours: 0, minutes: 0});
  const bottomSheetRef = useRef<BottomSheet>(null);
  const timerPickerRef = useRef<TimerPickerRef>(null);

  const memoBottomSheetRef = useRef<BottomSheet>(null);
  const [memoInput, setMemoInput] = useState('');

  // 달성률 계산
  useEffect(() => setStudyTimePer(pureStudyTime / goalStudyTime), [goalStudyTime, pureStudyTime]);

  // 메모 가져오기 (최초 1회만)
  useEffect(() => {
    (async () => {
      const storedMemo = await AsyncStorage.getItem('memo');
      if (storedMemo !== null) {
        setMemo(storedMemo);
        setMemoInput(storedMemo);
      } else {
        setMemo('');
        setMemoInput('');
      }
    })();
  }, []);

  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  const openMemoBottomSheet = () => {
    setMemoInput(memo); // 현재 메모를 입력창에 반영
    memoBottomSheetRef.current?.snapToIndex(0);
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        disappearsOnIndex={-1}
        onPress={() => {
          Keyboard.dismiss();
          if (props.onPress) {
            props.onPress();
          }
        }}
      />
    ),
    [],
  );

  return (
    <Fragment>
      <ScrollView contentContainerStyle={{padding: 18}}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <View style={styles.headerTextWrap}>
              <Text style={[typography.subtitle, styles.headerName, {color: theme.primary}]}>{user?.displayName}</Text>
              <Text style={[typography.subtitle, styles.headerSub, {color: theme.text}]}>님의 하루를 LEAD가 응원할게요!</Text>
            </View>
            <Image source={require('@/assets/images/rock.png')} style={styles.headerImage} />
          </View>

          <TouchableOpacity activeOpacity={0.7} onPress={openMemoBottomSheet}>
            <View style={[styles.memoTouchable, {backgroundColor: theme.global.white}]}>
              <View style={[styles.memoArrow, {borderBottomColor: theme.global.white}]} />
              <Text style={[typography.subtitle, {color: theme.secondary}, styles.memoText]}>{memo && memo.trim() !== '' ? memo : '오늘의 목표나 간단한 메모를 적어보세요!'}</Text>
              <FontAwesome6 name="pen" size={18} color={theme.secondary} iconStyle="solid" />
            </View>
          </TouchableOpacity>

          <Card title="LEAD와 공부 시작하기">
            <View style={styles.cardRow}>
              <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
                <View>
                  <View style={styles.studyTimeRow}>
                    <Text style={[{fontSize: toDP(36), color: theme.text}, styles.studyTimeText]}>{formatTime(pureStudyTime)}</Text>
                    <FontAwesome6 name="pen" size={18} color={theme.secondary} iconStyle="solid" />
                  </View>
                  <Text style={[typography.body, {color: theme.secondary}, styles.studyTimeSub]}>/ {formatTime(goalStudyTime)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Study')}>
                <TouchableScale>
                  <View style={[styles.playButton, {backgroundColor: theme.background}]}>
                    <FontAwesome6 name="play" size={26} color={theme.primary} iconStyle="solid" />
                  </View>
                </TouchableScale>
              </TouchableOpacity>
            </View>
            <View style={styles.progressRow}>
              <ProgressBar style={{flex: 1}} segments={[{value: studyTimePer, color: '#344BFD'}]} height={12} borderRadius={6} />
              <Text style={[typography.body, {color: theme.text}]}>{Math.round(studyTimePer * 100)}%</Text>
            </View>
          </Card>

          <Card title="내 공부방">
            <View style={styles.studyRoomRow}>
              {Array.from({length: 6}, (_, i) => (
                <TouchableOpacity key={i} activeOpacity={0.7} style={styles.studyRoomButton}>
                  <TouchableScale>
                    <View style={[styles.studyRoomInner, {backgroundColor: theme.background}]}>
                      <Text style={[typography.body, {color: theme.text}, styles.studyRoomText]}>공부방 {i + 1}</Text>
                    </View>
                  </TouchableScale>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          <Card title="오늘의 공부">
            <View style={styles.todayStudyWrap}>
              <View style={styles.todayStudyLegendRow}>
                <View style={styles.todayStudyLegendItemBlue}>
                  <View style={styles.todayStudyLegendCircleBlue} />
                  <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>순 공부시간</Text>
                </View>
                <View style={styles.todayStudyLegendItemOrange}>
                  <View style={styles.todayStudyLegendCircleOrange} />
                  <Text style={[typography.body, {color: theme.secondary, fontWeight: 600}]}>공부 이외 시간</Text>
                </View>
              </View>

              <ProgressBar
                segments={[
                  {value: pureStudyTime / goalStudyTime, color: '#344BFD'},
                  {value: studyTimeOther / goalStudyTime, color: '#F68D2B'},
                ]}
                height={12}
                borderRadius={6}
              />
            </View>
          </Card>
        </View>
      </ScrollView>

      <BottomSheet backdropComponent={renderBackdrop} ref={bottomSheetRef} index={-1} enablePanDownToClose backgroundStyle={{backgroundColor: theme.global.white, borderTopLeftRadius: 16, borderTopRightRadius: 16}} handleIndicatorStyle={{backgroundColor: theme.inactive}}>
        <BottomSheetView style={[styles.bottomSheetContent, {backgroundColor: theme.global.white}]}>
          <Text style={[typography.subtitle, {color: theme.text}, styles.bottomSheetTitle]}>목표 공부 시간 변경</Text>
          <View style={[styles.timerPickerWrap, {backgroundColor: theme.background}]}>
            <TimerPicker
              ref={timerPickerRef}
              initialValue={{hours: goalStudyTime / 60, minutes: goalStudyTime % 60}}
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
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.saveButton, {backgroundColor: theme.primary}]}
            onPress={() => {
              const latestDuration = timerPickerRef.current?.latestDuration;
              const hours = latestDuration?.hours?.current || timePickerValue.hours;
              const minutes = latestDuration?.minutes?.current || timePickerValue.minutes;
              if (hours === 0 && minutes === 0) {
                return showToast('목표 공부 시간을 0으로 설정할 수 없어요.');
              }

              setGoalStudyTime(hours * 60 + minutes);
              bottomSheetRef.current?.close();
            }}>
            <Text style={[typography.body, {color: theme.global.white}, styles.saveButtonText]}>저장</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>

      <BottomSheet backdropComponent={renderBackdrop} ref={memoBottomSheetRef} index={-1} enablePanDownToClose backgroundStyle={{backgroundColor: theme.global.white, borderTopLeftRadius: 16, borderTopRightRadius: 16}} handleIndicatorStyle={{backgroundColor: theme.inactive}}>
        <BottomSheetView style={[styles.bottomSheetContent, {backgroundColor: theme.global.white}]}>
          <Text style={[typography.subtitle, {color: theme.text}, styles.bottomSheetTitle]}>메모 입력</Text>
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
              value={memoInput}
              onChangeText={setMemoInput}
              placeholder="오늘의 목표나 메모를 적어보세요"
              placeholderTextColor={theme.inactive}
            />
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.saveButton, {backgroundColor: theme.primary}]}
            onPress={async () => {
              Keyboard.dismiss();
              setMemo(memoInput);
              await AsyncStorage.setItem('memo', memoInput);
              memoBottomSheetRef.current?.close();
            }}>
            <Text style={[typography.body, {color: theme.global.white}, styles.saveButtonText]}>저장</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </Fragment>
  );
};

export default Home;
