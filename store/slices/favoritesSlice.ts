import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoriteItem {
  id: string;
  type: 'team' | 'player' | 'match';
  name: string;
  image?: string;
  details?: any;
  dateAdded: string;
}

interface FavoritesState {
  items: FavoriteItem[];
  isLoading: boolean;
}

const initialState: FavoritesState = {
  items: [],
  isLoading: false,
};

// Async thunks
export const loadFavorites = createAsyncThunk(
  'favorites/load',
  async () => {
    try {
      const favoritesString = await AsyncStorage.getItem('favorites');
      return favoritesString ? JSON.parse(favoritesString) : [];
    } catch (error) {
      return [];
    }
  }
);

export const saveFavorites = createAsyncThunk(
  'favorites/save',
  async (favorites: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      return favorites;
    } catch (error) {
      throw error;
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const exists = state.items.find(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
        // Auto-save to AsyncStorage
        AsyncStorage.setItem('favorites', JSON.stringify(state.items));
      }
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      // Auto-save to AsyncStorage
      AsyncStorage.setItem('favorites', JSON.stringify(state.items));
    },
    toggleFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(action.payload);
      }
      // Auto-save to AsyncStorage
      AsyncStorage.setItem('favorites', JSON.stringify(state.items));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(saveFavorites.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;