import React from 'react';
import {TouchableOpacity} from 'react-native';

import {useTheme} from '@/contexts/ThemeContext';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  style?: object;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({icon, onPress, style}) => {
  const {theme} = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        {
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: theme.primary,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: theme.shadow,
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.3,
          shadowRadius: 3,
          zIndex: 5,
          elevation: 5,
        },
        style,
      ]}>
      {icon}
    </TouchableOpacity>
  );
};

export default FloatingActionButton;
