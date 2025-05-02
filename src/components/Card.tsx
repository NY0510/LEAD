import React from 'react';
import {Text, TextStyle, View, ViewStyle} from 'react-native';

import {useTheme} from '@/contexts/ThemeContext';

interface CardProps {
  title: string;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({title, style, titleStyle, children}) => {
  const {theme, typography} = useTheme();

  return (
    <View style={[{backgroundColor: '#fff', borderRadius: 16, padding: 16, justifyContent: 'space-between', gap: 16}, style]}>
      <View>
        <Text style={[typography.subtitle, {color: theme.primary, fontWeight: '600'}, titleStyle]}>{title}</Text>
      </View>
      {children}
    </View>
  );
};

export default Card;
