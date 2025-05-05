import {PixelRatio} from 'react-native';

import TextStyles from '@/theme/types/TextStyles';

export const toDP = (px: number) => PixelRatio.roundToNearestPixel(px);

const baseTextStyle = {
  fontFamily: 'Pretendard Variable',
};

const Typography: TextStyles = {
  baseTextStyle,
  title: {
    ...baseTextStyle,
    fontSize: toDP(24),
    fontWeight: '600',
  },
  subtitle: {
    ...baseTextStyle,
    fontSize: toDP(18),
    fontWeight: '500',
  },
  body: {
    ...baseTextStyle,
    fontSize: toDP(16),
    fontWeight: '400',
  },
  caption: {
    ...baseTextStyle,
    fontSize: toDP(12),
    fontWeight: '400',
  },
};

export default Typography;
