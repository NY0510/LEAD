import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, AppState, AppStateStatus, Linking, Text, TouchableOpacity, View} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import {Camera, useCameraDevice} from 'react-native-vision-camera';

import {getStudyToday, updateStudy} from '@/api';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {toDP} from '@/theme/typography';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

// Constants
const STUDY_CONSTANTS = {
  CAPTURE_INTERVAL: 60_000,
  INITIAL_CAPTURE_DELAY: 10_000,
  TIMER_UPDATE_INTERVAL: 1_000,
  INITIAL_TIME: '00:00:00',
} as const;

// Types
interface AnalysisResult {
  isStudying: boolean;
}

// 더미 AI 분석 함수 (실제 구현 시 서버 API로 대체)
const analyzeStudyImage = async (_imagePath: string): Promise<AnalysisResult> => {
  // 실제로는 서버로 이미지를 전송하고 AI 분석 결과를 받음
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        isStudying: Math.random() > 0.5,
      });
    }, 1000);
  });
};

// Utility functions
const formatTime = (diff: number): string => {
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

// Custom hooks
const useFocusTracking = () => {
  const [_studyCount, setStudyCount] = useState(0);
  const [_totalCount, setTotalCount] = useState(0);
  const [focusLevel, setFocusLevel] = useState(0);

  const calculateFocusLevel = useCallback((studyCount: number, totalCount: number) => {
    if (totalCount === 0) {
      return 0;
    }
    return Math.round((studyCount / totalCount) * 100);
  }, []);

  const updateFocusLevel = useCallback(
    (isCurrentlyStudying: boolean) => {
      setTotalCount(prev => {
        const newTotalCount = prev + 1;
        setStudyCount(prevStudy => {
          const newStudyCount = prevStudy + (isCurrentlyStudying ? 1 : 0);
          const newFocusLevel = calculateFocusLevel(newStudyCount, newTotalCount);
          setFocusLevel(newFocusLevel);
          console.log(`집중도 계산: ${newStudyCount}/${newTotalCount} = ${newFocusLevel}% (현재: ${isCurrentlyStudying ? '공부중' : '딴짓중'})`);
          return newStudyCount;
        });
        return newTotalCount;
      });
    },
    [calculateFocusLevel],
  );

  const resetFocusTracking = useCallback(() => {
    setStudyCount(0);
    setTotalCount(0);
    setFocusLevel(0);
  }, []);

  return {
    focusLevel,
    updateFocusLevel,
    resetFocusTracking,
  };
};

const useStudyTimer = (isStudying: boolean, studyStartTime: React.MutableRefObject<Date | null>) => {
  const [currentSessionTime, setCurrentSessionTime] = useState<string>(STUDY_CONSTANTS.INITIAL_TIME);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isStudying && studyStartTime.current) {
      timerIntervalRef.current = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - studyStartTime.current!.getTime();
        setCurrentSessionTime(formatTime(diff));
      }, STUDY_CONSTANTS.TIMER_UPDATE_INTERVAL);

      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [isStudying, studyStartTime]);

  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  return {
    currentSessionTime,
    setCurrentSessionTime,
    clearTimer,
  };
};

const useCameraPermissions = () => {
  useEffect(() => {
    const checkPermissions = async () => {
      const cameraPermission = Camera.getCameraPermissionStatus();

      const showPermissionAlert = () => {
        Alert.alert('카메라 권한이 필요합니다.', '설정에서 카메라 권한을 허용해주세요.', [
          {text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: '설정', onPress: () => Linking.openSettings()},
        ]);
      };

      switch (cameraPermission) {
        case 'granted':
          console.log('Camera permission granted');
          break;
        case 'denied':
          console.log('Camera permission denied');
          showPermissionAlert();
          break;
        case 'not-determined':
          const newCameraPermission = await Camera.requestCameraPermission();
          if (newCameraPermission === 'granted') {
            console.log('Camera permission granted');
          } else {
            console.log('Camera permission denied');
            showPermissionAlert();
          }
          break;
      }
    };

    checkPermissions();
  }, []);
};

const useAppStateHandler = (isStudying: boolean, stopStudy: (stoppedByBackground?: boolean) => Promise<void>, wasStoppedByBackground: React.MutableRefObject<boolean>) => {
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        console.log('App has come to the foreground!');

        if (wasStoppedByBackground.current) {
          Alert.alert('공부 세션 종료', '앱이 백그라운드로 이동하여 공부 세션이 자동으로 종료되었습니다.');
          wasStoppedByBackground.current = false;
        }
      } else if (nextAppState.match(/inactive|background/) && isStudying) {
        console.log('App has gone to the background! - Stopping study');
        stopStudy(true);
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [isStudying, stopStudy, wasStoppedByBackground]);
};

const Study = () => {
  const {user} = useAuth();
  const {theme, typography} = useTheme();

  // 상태 관리
  const [isStudying, setIsStudying] = useState(false);
  const [totalStudyTime, setTotalStudyTime] = useState('00:00:00');
  const [isLoading, setIsLoading] = useState(false);

  // refs
  const cameraRef = useRef<Camera>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const studyStartTime = useRef<Date | null>(null);
  const wasStoppedByBackground = useRef<boolean>(false);
  const isAlertShowing = useRef<boolean>(false);

  // 커스텀 훅 사용
  const {focusLevel, updateFocusLevel, resetFocusTracking} = useFocusTracking();
  const {currentSessionTime, clearTimer} = useStudyTimer(isStudying, studyStartTime);

  // 카메라 권한 확인
  useCameraPermissions();

  const device = useCameraDevice('front');

  // 오늘 공부 시간 로드
  const loadTodayStudyTime = useCallback(async () => {
    if (!user?.uid) {
      return;
    }

    try {
      const data = await getStudyToday(user.uid);
      setTotalStudyTime(data.total_time || '00:00:00');
    } catch (error) {
      console.error('Failed to load today study time:', error);
      Alert.alert('오류', '오늘의 공부 시간을 불러오는데 실패했습니다.');
    }
  }, [user?.uid]);

  // 공부 정지
  const stopStudy = useCallback(
    async (stoppedByBackground = false) => {
      try {
        setIsStudying(false);
        studyStartTime.current = null;
        isAlertShowing.current = false;

        if (stoppedByBackground) {
          wasStoppedByBackground.current = true;
        }

        KeepAwake.deactivate();

        // 타이머들 정리
        if (captureIntervalRef.current) {
          clearInterval(captureIntervalRef.current);
          captureIntervalRef.current = null;
        }
        clearTimer();

        await loadTodayStudyTime();

        console.log('Study session ended. Session time:', currentSessionTime);
      } catch (error) {
        console.error('Failed to stop study:', error);
        Alert.alert('오류', '공부 세션을 종료하는데 실패했습니다.');
      }
    },
    [currentSessionTime, loadTodayStudyTime, clearTimer],
  );

  // 앱 상태 변경 감지
  useAppStateHandler(isStudying, stopStudy, wasStoppedByBackground);

  // 카메라 이미지 캡처 및 분석
  const captureAndAnalyzeImage = useCallback(async () => {
    try {
      if (!cameraRef.current || !device) {
        console.warn('Camera ref or device is not available, skipping capture');
        return;
      }

      const photo = await cameraRef.current.takePhoto();
      const analysisResult = await analyzeStudyImage(photo.path);

      console.log('Image analysis result:', analysisResult);
      updateFocusLevel(analysisResult.isStudying);

      // 서버에 공부/딴짓 상태 전송
      if (user?.uid) {
        try {
          await updateStudy(user.uid, analysisResult.isStudying);
        } catch (error) {
          console.error('Failed to update study status to server:', error);
        }
      }

      // 공부하지 않는 것으로 판별되면 경고
      if (!analysisResult.isStudying && !isAlertShowing.current) {
        isAlertShowing.current = true;
        Alert.alert('집중하세요!', '공부에 집중하지 않는 것으로 감지되었습니다. 계속 하시겠습니까?', [
          {
            text: '정지',
            style: 'destructive',
            onPress: () => {
              isAlertShowing.current = false;
              stopStudy(false);
            },
          },
          {
            text: '계속',
            style: 'default',
            onPress: () => {
              isAlertShowing.current = false;
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to capture and analyze image:', error);

      // 카메라 오류 시에는 기본적으로 공부 중으로 가정
      if (user?.uid) {
        try {
          await updateStudy(user.uid, true);
        } catch (updateError) {
          console.error('Failed to update study status (fallback):', updateError);
        }
      }
    }
  }, [stopStudy, device, user?.uid, updateFocusLevel]);

  // 공부 시작
  const startStudy = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsStudying(true);
      studyStartTime.current = new Date();

      resetFocusTracking();
      KeepAwake.activate();

      setTimeout(() => {
        captureAndAnalyzeImage();
        captureIntervalRef.current = setInterval(captureAndAnalyzeImage, STUDY_CONSTANTS.CAPTURE_INTERVAL);
      }, STUDY_CONSTANTS.INITIAL_CAPTURE_DELAY);
    } catch (error) {
      console.error('Failed to start study:', error);
      Alert.alert('오류', '공부 세션을 시작하는데 실패했습니다.');
      setIsStudying(false);
    } finally {
      setIsLoading(false);
    }
  }, [captureAndAnalyzeImage, resetFocusTracking]);

  // 초기 로드
  useEffect(() => {
    loadTodayStudyTime();
  }, [loadTodayStudyTime]);

  // 컴포넌트 언마운트시 정리
  useEffect(() => {
    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
      clearTimer();
      if (isStudying) {
        KeepAwake.deactivate();
      }
    };
  }, [isStudying, clearTimer]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18, gap: 22}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 16}}>
        <View style={{flex: 1, backgroundColor: theme.card, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
          <View>
            <Text style={[typography.subtitle, {color: theme.primary, fontWeight: 700}]}>누적 공부 시간</Text>
            <Text style={[typography.baseTextStyle, {fontSize: toDP(32), fontWeight: '600', color: theme.secondary}]}>{totalStudyTime}</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={[typography.subtitle, {color: theme.primary, fontWeight: 700}]}>집중도</Text>
            <Text style={[typography.baseTextStyle, {fontSize: toDP(32), fontWeight: '600', color: theme.secondary}]}>{focusLevel}%</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.65} onPress={isStudying ? () => stopStudy(false) : startStudy} disabled={isLoading}>
          <View style={{backgroundColor: theme.card, padding: 20, borderRadius: 999, aspectRatio: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', opacity: isLoading ? 0.6 : 1}}>
            <FontAwesome6 name={isStudying ? 'stop' : 'play'} size={26} color={theme.primary} iconStyle="solid" />
          </View>
        </TouchableOpacity>
      </View>

      {isStudying && (
        <View style={{width: '100%', backgroundColor: theme.card, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 18, alignItems: 'center'}}>
          <Text style={[typography.subtitle, {color: theme.primary, fontWeight: 700}]}>현재 세션</Text>
          <Text style={[typography.baseTextStyle, {fontSize: toDP(28), fontWeight: '600', color: theme.secondary}]}>{currentSessionTime}</Text>
        </View>
      )}

      <View style={{flex: 1, width: '100%', borderRadius: 24, overflow: 'hidden'}}>
        {!device ? (
          <View style={{flex: 1, backgroundColor: theme.inactive, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[typography.body, {color: theme.text}]}>카메라를 찾을 수 없습니다.</Text>
          </View>
        ) : (
          <Camera ref={cameraRef} style={{flex: 1}} device={device} isActive={true} photo={true} />
        )}
      </View>
    </View>
  );
};

export default Study;
