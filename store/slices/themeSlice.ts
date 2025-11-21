import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeState {
  isDarkMode: boolean;
  isLoading: boolean;
}

const initialState: ThemeState = {
  isDarkMode: false, // Default to light mode
  isLoading: false,
};

// Async thunks
export const loadTheme = createAsyncThunk(
  'theme/load',
  async () => {
    try {
      const themeString = await AsyncStorage.getItem('isDarkMode');
      return themeString ? JSON.parse(themeString) : false;
    } catch (error) {
      return false; // Default to light mode
    }
  }
);

export const saveTheme = createAsyncThunk(
  'theme/save',
  async (isDarkMode: boolean) => {
    try {
      await AsyncStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
      return isDarkMode;
    } catch (error) {
      throw error;
    }
  }
);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
      // Auto-save to AsyncStorage
      AsyncStorage.setItem('isDarkMode', JSON.stringify(state.isDarkMode));
    },
    setTheme: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
      // Auto-save to AsyncStorage
      AsyncStorage.setItem('isDarkMode', JSON.stringify(state.isDarkMode));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isDarkMode = action.payload;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.isDarkMode = action.payload;
      });
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;