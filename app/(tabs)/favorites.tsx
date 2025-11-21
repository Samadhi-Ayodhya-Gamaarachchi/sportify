import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { AppDispatch, RootState } from '../../store';
import { loadFavorites, removeFavorite } from '../../store/slices/favoritesSlice';

export default function FavoritesScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const dispatch = useDispatch<AppDispatch>();
  const { items: favorites, isLoading } = useSelector((state: RootState) => state.favorites);
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    dispatch(loadFavorites());
  }, [dispatch]);

  const tabs = ['All', 'Teams', 'Players', 'Matches'];

  const getDisplayCategory = (type: string) => {
    switch (type) {
      case 'team': return 'Teams';
      case 'player': return 'Players'; 
      case 'match': return 'Matches';
      default: return 'Other';
    }
  };

  const filteredFavorites = activeTab === 'All' 
    ? favorites 
    : favorites.filter(item => getDisplayCategory(item.type) === activeTab);

  const handleRemoveFavorite = (id: string) => {
    dispatch(removeFavorite(id));
  };

  const handleItemPress = (item: any) => {
    router.push(`/details?id=${item.id}&type=${item.type}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My Favorites</Text>
        <TouchableOpacity>
          <Feather name="more-horizontal" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={[styles.tabsContainer, { backgroundColor: theme.surface }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: theme.primary }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[
              { color: theme.textSecondary },
              activeTab === tab && { color: '#fff' }
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredFavorites.length > 0 ? (
          filteredFavorites.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.favoriteItem, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}
              onPress={() => handleItemPress(item)}
            >
              <View style={styles.favoriteIcon}>
                {item.image ? (
                  <Image source={{ uri: item.image }} style={styles.favoriteImage} />
                ) : (
                  <>
                    {item.type === 'team' && (
                      <View style={[styles.teamIcon, { backgroundColor: theme.primary }]}>
                        <Feather name="shield" size={20} color="#fff" />
                      </View>
                    )}
                    {item.type === 'player' && (
                      <View style={[styles.playerIcon, { backgroundColor: theme.primary }]}>
                        <Feather name="user" size={20} color="#fff" />
                      </View>
                    )}
                    {item.type === 'match' && (
                      <View style={[styles.matchIcon, { backgroundColor: theme.primary }]}>
                        <Feather name="play" size={20} color="#fff" />
                      </View>
                    )}
                  </>
                )}
              </View>
              
              <View style={styles.favoriteContent}>
                <Text style={[styles.favoriteName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.favoriteSubtext, { color: theme.textSecondary }]}>{getDisplayCategory(item.type)}</Text>
                {item.details?.strLeague && (
                  <Text style={[styles.favoriteSubtext, { color: theme.textSecondary }]}>{item.details.strLeague}</Text>
                )}
                {item.details?.dateEvent && (
                  <Text style={[styles.favoriteSubtext, { color: theme.textSecondary }]}>{item.details.dateEvent}</Text>
                )}
              </View>
              
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={() => handleRemoveFavorite(item.id)}
              >
                <Feather 
                  name="heart" 
                  size={20} 
                  color={theme.primary}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Feather name="heart" size={60} color={theme.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>No Favorites Yet</Text>
            <Text style={[styles.emptyDescription, { color: theme.textSecondary }]}>
              Tap the ♡ on any team, player, or match to add it here.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 15,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  activeTab: {
    backgroundColor: '#E53E3E',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  favoriteIcon: {
    marginRight: 15,
  },
  teamIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#50C878',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteContent: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  favoriteSubtext: {
    fontSize: 12,
    color: '#666',
  },
  favoriteButton: {
    padding: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  favoriteImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});