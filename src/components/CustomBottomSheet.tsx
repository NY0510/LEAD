import React, {forwardRef} from 'react';
import {StyleProp, ViewStyle} from 'react-native';

import {useTheme} from '@/contexts/ThemeContext';
import {useRenderBackdrop} from '@/lib/bottomSheetUtils';
import BottomSheet, {BottomSheetProps, BottomSheetScrollView, BottomSheetView} from '@gorhom/bottom-sheet';
import type {BottomSheetViewProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types';

export const CustomBottomSheet = forwardRef<BottomSheet, BottomSheetProps>((props, ref) => {
  const {theme} = useTheme();
  const renderBackdrop = useRenderBackdrop();
  const backgroundStyle: StyleProp<ViewStyle> = [{backgroundColor: theme.card, borderTopLeftRadius: 16, borderTopRightRadius: 16}, props.backgroundStyle];
  const handleIndicatorStyle: StyleProp<ViewStyle> = [{backgroundColor: theme.inactive}, props.handleIndicatorStyle];
  return <BottomSheet ref={ref} backdropComponent={props.backdropComponent ?? renderBackdrop} index={props.index ?? -1} enablePanDownToClose={props.enablePanDownToClose ?? true} backgroundStyle={backgroundStyle} handleIndicatorStyle={handleIndicatorStyle} {...props} />;
});

export const CustomBottomSheetView: React.FC<BottomSheetViewProps> = ({style, ...rest}) => {
  const {theme} = useTheme();
  return (
    <BottomSheetView
      style={[
        {
          padding: 24,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          gap: 16,
          backgroundColor: theme.card,
        },
        style,
      ]}
      {...rest}
    />
  );
};

export const CustomBottomSheetScrollView: React.FC<BottomSheetViewProps> = ({style, ...rest}) => {
  const {theme} = useTheme();
  return (
    <BottomSheetScrollView
      style={[
        {
          padding: 24,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          gap: 16,
          backgroundColor: theme.card,
        },
        style,
      ]}
      {...rest}
    />
  );
};
