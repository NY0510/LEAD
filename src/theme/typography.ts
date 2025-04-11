import {PixelRatio} from 'react-native';

import TextStyles from '@/theme/types/TextStyles';

const toDP = (px: number) => PixelRatio.roundToNearestPixel(px);

const Typography: TextStyles = {
  title: {
    fontSize: toDP(24),
    fontWeight: 600,
  },
  subtitle: {
    fontSize: toDP(18),
    fontWeight: 500,
  },
  body: {
    fontSize: toDP(16),
    fontWeight: 400,
  },
  caption: {
    fontSize: toDP(12),
    fontWeight: 400,
  },
};

export default Typography;
