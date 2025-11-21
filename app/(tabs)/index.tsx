import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { AppDispatch, RootState } from '../../store';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { fetchMatches, fetchTeams } from '../../store/slices/sportsSlice';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { teams, matches, isLoading, selectedLeague } = useSelector((state: RootState) => state.sports);
  const { user } = useSelector((state: RootState) => state.auth);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    loadData();
  }, [selectedLeague]);

  const loadData = async () => {
    try {
      await Promise.all([
        dispatch(fetchTeams(selectedLeague)),
        dispatch(fetchMatches(selectedLeague))
      ]);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleFavoriteToggle = (item: any, type: 'team' | 'player' | 'match') => {
    const favoriteItem = {
      id: item.idTeam || item.idPlayer || item.idEvent || item.id,
      type,
      name: item.strTeam || item.strPlayer || item.strEvent || item.name,
      image: item.strTeamBadge || item.strThumb || item.image,
      details: item,
      dateAdded: new Date().toISOString(),
    };
    dispatch(toggleFavorite(favoriteItem));
  };

  const isFavorite = (id: string) => {
    return favorites.some(fav => fav.id === id);
  };

  // Use real data or fallback to placeholder data
  const featuredTeams = teams.slice(0, 2);
  const recentMatches = matches.slice(0, 3);
  const topTeams = teams.slice(0, 4);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.primary}
        />
      }
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.appName, { color: theme.text }]}>SportsZone</Text>
          <View style={styles.headerRight}>
            {user && <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>Hello, {user.firstName}</Text>}
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Feather name="user" size={28} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.categoryContainer}>
          <TouchableOpacity style={[styles.categoryButton, { backgroundColor: theme.primary }]}>
            <Text style={[styles.categoryButtonText, { color: '#fff' }]}>Public All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.categoryButtonInactive, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <Text style={[styles.categoryButtonTextInactive, { color: theme.textSecondary }]}>sports_soccer Football</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Featured Teams */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Featured Teams</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          featuredTeams.map((team) => (
            <TouchableOpacity 
              key={team.idTeam} 
              style={[styles.featuredCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push(`/details?id=${team.idTeam}&type=team`)}
            >
              <ImageBackground
                source={{ 
                  uri: team.strTeamBadge || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=200&fit=crop'
                }}
                style={styles.featuredImage}
                imageStyle={styles.featuredImageStyle}
              >
                <View style={styles.featuredOverlay}>
                  <View style={styles.featuredContent}>
                    <Text style={styles.featuredTitle}>{team.strTeam}</Text>
                    <Text style={styles.featuredSubtitle}>{team.strLeague}</Text>
                    <Text style={styles.featuredDescription}>
                      {team.strStadium && `Stadium: ${team.strStadium}`}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.favoriteBtn}
                    onPress={() => handleFavoriteToggle(team, 'team')}
                  >
                    <Feather 
                      name="heart" 
                      size={24} 
                      color={isFavorite(team.idTeam) ? theme.primary : "#fff"} 
                    />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Recent Matches Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Matches</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : recentMatches.length > 0 ? (
          recentMatches.map((match) => (
            <TouchableOpacity 
              key={match.idEvent} 
              style={[styles.liveCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push(`/details?id=${match.idEvent}&type=match`)}
            >
              <View style={[styles.liveStatus, { backgroundColor: theme.primary }]}>
                <Text style={styles.liveText}>{match.strStatus || 'Finished'}</Text>
              </View>
              <View style={styles.liveContent}>
                <Text style={[styles.liveTitle, { color: theme.text }]}>{match.strEvent}</Text>
                <Text style={[styles.liveScore, { color: theme.textSecondary }]}>
                  {match.intHomeScore && match.intAwayScore 
                    ? `${match.intHomeScore} - ${match.intAwayScore}`
                    : match.dateEvent
                  }
                </Text>
              </View>
              <View style={styles.liveAction}>
                <TouchableOpacity onPress={() => handleFavoriteToggle(match, 'match')}>
                  <Feather 
                    name="heart" 
                    size={20} 
                    color={isFavorite(match.idEvent) ? theme.primary : theme.textSecondary} 
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={[styles.noDataText, { color: theme.textSecondary }]}>No matches available</Text>
        )}
      </View>

      {/* Top Teams Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Teams</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <View style={styles.playersContainer}>
            {topTeams.map((team) => (
              <TouchableOpacity 
                key={team.idTeam} 
                style={[styles.playerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => router.push(`/details?id=${team.idTeam}&type=team`)}
              >
                <ImageBackground
                  source={{ 
                    uri: team.strTeamBadge || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
                  }}
                  style={styles.playerImage}
                  imageStyle={styles.playerImageStyle}
                >
                  <View style={styles.playerOverlay}>
                    <Text style={styles.playerName}>{team.strTeam}</Text>
                    <Text style={styles.playerTeam}>{team.strLeague}</Text>
                    <TouchableOpacity 
                      style={styles.miniHeart}
                      onPress={() => handleFavoriteToggle(team, 'team')}
                    >
                      <Feather 
                        name="heart" 
                        size={16} 
                        color={isFavorite(team.idTeam) ? theme.primary : "#fff"} 
                      />
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  categoryButton: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  categoryButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  categoryButtonInactive: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  categoryButtonTextInactive: {
    color: '#666',
    fontSize: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  featuredCard: {
    borderRadius: 15,
    overflow: 'hidden',
    height: 200,
  },
  featuredImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredImageStyle: {
    borderRadius: 15,
  },
  featuredOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  featuredSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  featuredDescription: {
    fontSize: 12,
    color: '#ccc',
  },
  liveCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  liveStatus: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 15,
  },
  liveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  liveContent: {
    flex: 1,
  },
  liveTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  liveScore: {
    fontSize: 12,
    color: '#666',
  },
  liveAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  viewDetails: {
    fontSize: 12,
    color: '#E53E3E',
    fontWeight: '600',
  },
  playersContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  playerCard: {
    width: 120,
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
  },
  playerImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  playerImageStyle: {
    borderRadius: 10,
  },
  playerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
  },
  playerName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  playerTeam: {
    fontSize: 10,
    color: '#ccc',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  featuredContent: {
    flex: 1,
  },
  favoriteBtn: {
    padding: 5,
  },
  miniHeart: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 2,
  },
  noDataText: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
});
