import React from 'react';
import {StyleSheet, Text, View, ViewStyle} from 'react-native';

import {useTheme} from '@/contexts/ThemeContext';
import {toDP} from '@/theme/typography';

type Segment = {
  value: number;
  color: string;
  label?: string;
};

type ProgressBarProps = {
  segments: Segment[];
  height?: number;
  borderRadius?: number;
  showLabels?: boolean;
  backgroundColor?: string;
  style?: ViewStyle;
};

const ProgressBar = ({segments, height = 20, borderRadius = 8, showLabels = false, backgroundColor, style}: ProgressBarProps) => {
  const {theme, typography} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      width: '100%',
      backgroundColor: backgroundColor || theme.background,
      overflow: 'hidden',
    },
    segment: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      ...typography.baseTextStyle,
      color: theme.text,
      fontSize: toDP(14),
      fontWeight: '600',
    },
  });

  return (
    <View style={[styles.container, {height, borderRadius}, style]}>
      {segments.map((seg, idx) => (
        <View
          key={idx}
          style={[
            styles.segment,
            {
              width: `${seg.value * 100}%`,
              backgroundColor: seg.color,
              height: '100%',
            },
            idx === 0 && {borderTopLeftRadius: borderRadius, borderBottomLeftRadius: borderRadius},
            idx === segments.length - 1 && {borderTopRightRadius: borderRadius, borderBottomRightRadius: borderRadius},
          ]}>
          {showLabels && seg.label && <Text style={styles.label}>{seg.label}</Text>}
        </View>
      ))}
    </View>
  );
};

export default ProgressBar;
