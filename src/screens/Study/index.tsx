import React, {useEffect} from 'react';
import {Alert, Linking, Text, TouchableOpacity, View} from 'react-native';
import {Camera, useCameraDevice, useCameraDevices} from 'react-native-vision-camera';

import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';
import {toDP} from '@/theme/typography';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';

const Study = () => {
  const {user, signOut} = useAuth();
  const {theme, typography} = useTheme();

  // 카메라 권한 확인
  useEffect(() => {
    (async () => {
      const cameraPermission = Camera.getCameraPermissionStatus();

      switch (cameraPermission) {
        case 'granted':
          console.log('Camera permission granted');
          break;
        case 'denied':
          console.log('Camera permission denied');
          Alert.alert('카메라 권한이 필요합니다.', '설정에서 카메라 권한을 허용해주세요.', [
            {text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: '설정', onPress: () => Linking.openSettings()},
          ]);
          break;
        case 'not-determined':
          const newCameraPermission = await Camera.requestCameraPermission();
          if (newCameraPermission === 'granted') {
            console.log('Camera permission granted');
          } else {
            console.log('Camera permission denied');
            Alert.alert('카메라 권한이 필요합니다.', '설정에서 카메라 권한을 허용해주세요.', [
              {text: '취소', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: '설정', onPress: () => Linking.openSettings()},
            ]);
          }
          break;
      }
    })();
  }, []);

  // const device = null;
  const device = useCameraDevice('front');

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', padding: 18, gap: 22}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 16}}>
        <View style={{flex: 1, backgroundColor: theme.card, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8}}>
          <View>
            <Text style={[typography.subtitle, {color: theme.primary, fontWeight: 700}]}>공부 시간</Text>
            <Text style={[typography.baseTextStyle, {fontSize: toDP(32), fontWeight: '600', color: theme.secondary}]}>02:00:31</Text>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={[typography.subtitle, {color: theme.primary, fontWeight: 700}]}>집중도</Text>
            <Text style={[typography.baseTextStyle, {fontSize: toDP(32), fontWeight: '600', color: theme.secondary}]}>80%</Text>
          </View>
        </View>
        <TouchableOpacity activeOpacity={0.65} onPress={() => {}}>
          <View style={{backgroundColor: theme.card, padding: 20, borderRadius: 999, aspectRatio: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <FontAwesome6 name="play" size={26} color={theme.primary} iconStyle="solid" />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{flex: 1, width: '100%', borderRadius: 24, overflow: 'hidden'}}>
        {!device ? (
          <View style={{flex: 1, backgroundColor: theme.inactive, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={[typography.body, {color: theme.text}]}>카메라를 찾을 수 없습니다.</Text>
          </View>
        ) : (
          <Camera style={{flex: 1}} device={device} isActive={true} photo={true} />
        )}
      </View>
    </View>
  );
};

export default Study;
