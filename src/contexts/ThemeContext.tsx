import React, {createContext, useContext, useEffect, useState} from 'react';
import {useColorScheme} from 'react-native';

import {darkTheme, globalTheme, lightTheme} from '@/theme';
import {GlobalPalette, Palette} from '@/theme/types/Palette';
import TextStyles from '@/theme/types/TextStyles';
import Typography from '@/theme/typography';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = Palette & {global: GlobalPalette};

const ThemeContext = createContext<{
  theme: Theme;
  isDark: boolean;
  typography: TextStyles;
  toggleTheme: () => void;
}>({
  theme: {...lightTheme, global: globalTheme},
  isDark: false,
  typography: Typography,
  toggleTheme: () => {},
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => {
  const systemTheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemTheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme) {
        setIsDark(storedTheme === 'dark');
      } else {
        setIsDark(systemTheme === 'dark');
      }
    };
    loadTheme();
  }, [systemTheme]);

  // theme에 globalPalette 추가
  const theme = {...(isDark ? darkTheme : lightTheme), global: globalTheme};

  const toggleTheme = async () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    await AsyncStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  return <ThemeContext.Provider value={{theme, isDark, typography: Typography, toggleTheme}}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);
