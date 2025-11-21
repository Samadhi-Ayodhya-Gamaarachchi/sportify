// Theme configuration for light and dark modes

export interface ThemeColors {
  primary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  notification: string;
  error: string;
  success: string;
  warning: string;
}

export const lightTheme: ThemeColors = {
  primary: '#E53E3E',
  background: '#ffffff',
  surface: '#f5f5f5',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e1e1e1',
  card: '#ffffff',
  notification: '#E53E3E',
  error: '#E53E3E',
  success: '#4CAF50',
  warning: '#FF9800',
};

export const darkTheme: ThemeColors = {
  primary: '#E53E3E',
  background: '#1a1a1a',
  surface: '#333333',
  text: '#ffffff',
  textSecondary: '#666666',
  border: '#333333',
  card: '#333333',
  notification: '#E53E3E',
  error: '#E53E3E',
  success: '#4CAF50',
  warning: '#FF9800',
};

export const getTheme = (isDarkMode: boolean): ThemeColors => {
  return isDarkMode ? darkTheme : lightTheme;
};