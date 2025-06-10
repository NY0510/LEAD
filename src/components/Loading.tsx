import React from 'react';
import {ActivityIndicator, View} from 'react-native';

import {useTheme} from '@/contexts/ThemeContext';

interface Props {
  size?: 'small' | 'large';
  fullScreen?: boolean;
}

const Loading = ({size = 'large', fullScreen = true}: Props) => {
  const {theme} = useTheme();

  return fullScreen ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size={size} color={theme.secondary} />
    </View>
  ) : (
    <ActivityIndicator size={size} color={theme.secondary} style={{margin: 8}} />
  );
};

export default Loading;
