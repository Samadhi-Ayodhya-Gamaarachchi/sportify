import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { loadStoredAuth } from '../store/slices/authSlice';
import { loadFavorites } from '../store/slices/favoritesSlice';
import { loadTheme } from '../store/slices/themeSlice';

interface AppStateProviderProps {
  children: React.ReactNode;
}

export function AppStateProvider({ children }: AppStateProviderProps) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Load stored data on app start
    dispatch(loadStoredAuth());
    dispatch(loadFavorites());
    dispatch(loadTheme());
  }, [dispatch]);

  return <>{children}</>;
}