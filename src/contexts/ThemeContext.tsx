import React, {createContext, useContext} from 'react';
import {useColorScheme} from 'react-native';

import {darkTheme, lightTheme} from '@/theme';
import Palette from '@/theme/types/Palette';
import TextStyles from '@/theme/types/TextStyles';
import Typography from '@/theme/typography';

const ThemeContext = createContext<{
  theme: Palette;
  isDark: boolean;
  typography: TextStyles;
}>({
  theme: lightTheme,
  isDark: false,
  typography: Typography,
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const systemTheme = useColorScheme();
  const isDark = systemTheme === 'dark';

  const theme = isDark ? darkTheme : lightTheme;

  return <ThemeContext.Provider value={{theme, isDark, typography: Typography}}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
