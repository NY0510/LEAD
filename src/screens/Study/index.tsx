import React, {useEffect} from 'react';
import {Alert, Linking, Text, View} from 'react-native';
import {Camera, useCameraDevice, useCameraDevices} from 'react-native-vision-camera';

import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';

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

  const device = useCameraDevice('back');

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {!device ? <Text style={[typography.body, {color: theme.text}]}>카메라 없음</Text> : <Camera style={{width: 200, height: 200}} device={device} isActive={true} photo={true} />}
      <Text style={[typography.body, {color: theme.text}]}>카메라 권한: {Camera.getCameraPermissionStatus()}</Text>
    </View>
  );
};

export default Study;
