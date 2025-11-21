import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import favoritesSlice from './slices/favoritesSlice';
import sportsSlice from './slices/sportsSlice';
import themeSlice from './slices/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    favorites: favoritesSlice,
    theme: themeSlice,
    sports: sportsSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;