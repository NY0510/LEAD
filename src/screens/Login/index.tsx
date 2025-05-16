import React, {useState} from 'react';
import {Alert, Text, View} from 'react-native';

import GoogleSvg from '@/assets/images/google.svg';
import LogoDarkSvg from '@/assets/images/logo_dark.svg';
import LogoLightSvg from '@/assets/images/logo_light.svg';
import Loading from '@/components/Loading';
import TouchableScale from '@/components/TouchableScale';
import {useAuth} from '@/contexts/AuthContext';
import {useTheme} from '@/contexts/ThemeContext';

const Login = () => {
  const {signInWithGoogle} = useAuth();
  const {theme, typography, isDark} = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      Alert.alert(`로그인에 실패했어요.\n${(err as Error).message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen />;
  }

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 24, backgroundColor: theme.background}}>
      <View />
      <View>{isDark ? <LogoLightSvg /> : <LogoDarkSvg />}</View>
      <View style={{width: '100%'}}>
        <TouchableScale onPress={handleSignIn}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 18,
              marginHorizontal: 24,
              gap: 8,
              backgroundColor: theme.card,
              borderRadius: 12,
              shadowColor: theme.shadow,
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
            }}>
            <GoogleSvg width={24} height={24} />
            <Text style={[typography.subtitle, {color: theme.text}]}>Google로 계속하기</Text>
          </View>
        </TouchableScale>
      </View>
    </View>
  );
};

export default Login;
