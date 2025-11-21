import { useSelector } from 'react-redux';
import { getTheme, ThemeColors } from '../constants/Theme';
import { RootState } from '../store';

export const useTheme = (): { theme: ThemeColors; isDarkMode: boolean } => {
  const isDarkMode = useSelector((state: RootState) => state.theme.isDarkMode);
  const theme = getTheme(isDarkMode);
  
  return { theme, isDarkMode };
};