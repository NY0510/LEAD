import {useCallback} from 'react';
import {Keyboard} from 'react-native';

import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';

export const openBottomSheet = (ref: React.RefObject<BottomSheet | null>) => {
  if (ref && ref.current) {
    ref.current.snapToIndex(0);
  }
};

export const useRenderBackdrop = () =>
  useCallback(
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
