import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { SPORTS_CONFIG, SportType } from '../../services/api';
import { AppDispatch, RootState } from '../../store';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { fetchMatches, fetchPlayers, fetchTeamsBySport, setCurrentSport } from '../../store/slices/sportsSlice';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { teams, matches, players, isLoading, selectedLeague, error, currentSport, availableSports } = useSelector((state: RootState) => state.sports);
  const { user } = useSelector((state: RootState) => state.auth);
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    console.log('HomeScreen mounted, loading data...');
    loadData();
  }, []);

  useEffect(() => {
    if (selectedLeague) {
      console.log('League changed to:', selectedLeague);
      loadData();
    }
  }, [selectedLeague]);

  const loadData = async () => {
    try {
      console.log('=== LOADING DATA ===');
      console.log('Current sport:', currentSport);
      console.log('Current league:', selectedLeague);
      console.log('Current teams count:', teams.length);
      
      // Fetch teams by current sport
      const teamResult = await dispatch(fetchTeamsBySport(currentSport));
      console.log('Team result for', currentSport, ':', teamResult);
      
      // Only fetch soccer matches and players for now
      if (currentSport === 'soccer') {
        const matchResult = await dispatch(fetchMatches(selectedLeague || 'English Premier League'));
        console.log('Match result:', matchResult);
        
        const playersResult = await dispatch(fetchPlayers('Arsenal'));
        console.log('Players result:', playersResult);
      }
      
      console.log('=== DATA LOADED ===');
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

  const handleSportChange = (sport: SportType) => {
    dispatch(setCurrentSport(sport));
  };

  // Fallback data for when API is loading or fails
  const fallbackTeams = [
    {
      idTeam: 'fallback1',
      strTeam: 'Manchester United',
      strTeamBadge: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=100&h=100&fit=crop',
      strLeague: 'Premier League',
      strStadium: 'Old Trafford'
    },
    {
      idTeam: 'fallback2', 
      strTeam: 'Liverpool FC',
      strTeamBadge: 'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?w=100&h=100&fit=crop',
      strLeague: 'Premier League',
      strStadium: 'Anfield'
    }
  ];

  const fallbackMatches = [
    {
      idEvent: 'match1',
      strEvent: 'Manchester United vs Liverpool',
      strStatus: 'Finished',
      intHomeScore: '2',
      intAwayScore: '1',
      dateEvent: '2024-03-15'
    }
  ];

  // Use real data or fallback to placeholder data - always show something
  const featuredTeams = teams.length > 0 ? teams.slice(0, 2) : fallbackTeams;
  const recentMatches = matches.length > 0 ? matches.slice(0, 3) : fallbackMatches;
  const topTeams = teams.length > 0 ? teams.slice(0, 4) : fallbackTeams.slice(0, 4);
  
  console.log('Rendering with:', {
    teamsCount: teams.length,
    matchesCount: matches.length,
    isLoading,
    error,
    featuredTeamsCount: featuredTeams.length
  });

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]} 
      contentContainerStyle={{ paddingBottom: 100 }}
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
        
        {/* Sport Selection */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sportsSelector}>
          {availableSports.map((sport) => (
            <TouchableOpacity
              key={sport.id}
              style={[
                styles.sportButton,
                { backgroundColor: currentSport === sport.id ? theme.primary : theme.background }
              ]}
              onPress={() => handleSportChange(sport.id as SportType)}
            >
              <Feather 
                name={sport.icon as any} 
                size={16} 
                color={currentSport === sport.id ? '#fff' : theme.text} 
              />
              <Text style={[
                styles.sportButtonText,
                { color: currentSport === sport.id ? '#fff' : theme.text }
              ]}>
                {sport.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
       
      </View>

      {/* Featured Teams */}
      <View style={styles.section}>
        
        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { color: theme.primary }]}>Error: {error}</Text>
            <TouchableOpacity onPress={loadData} style={[styles.retryButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        <Text style={[styles.debugText, { color: theme.textSecondary }]}>
          Teams: {teams.length}, Matches: {matches.length}, Loading: {isLoading ? 'Yes' : 'No'}
        </Text>
        {isLoading && teams.length === 0 && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading sports data...</Text>
          </View>
        )}
        {/* Always show content - either real data or fallback */}
        {featuredTeams.map((team) => (
            <TouchableOpacity 
              key={team.idTeam} 
              style={[styles.featuredCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
              onPress={() => router.push(`/details?id=${team.idTeam}&type=team`)}
            >
              <ImageBackground
                source={{ 
                  uri: team.strTeamBadge || `https://via.placeholder.com/400x200/E53E3E/ffffff?text=${encodeURIComponent(team.strTeam || 'Team')}`
                }}
                style={styles.featuredImage}
                imageStyle={styles.featuredImageStyle}
                onError={() => {
                  console.log('Image failed to load for team:', team.strTeam);
                }}
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
          ))}
      </View>

      {/* Recent Matches Section - Only for Soccer */}
      {currentSport === 'soccer' && (
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
      )}

      {/* Top Players Section - Only for Soccer */}
      {currentSport === 'soccer' && (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Top Players</Text>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {players.slice(0, 6).map((player) => (
              <TouchableOpacity 
                key={player.idPlayer} 
                style={[styles.playerCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={() => router.push(`/details?id=${player.idPlayer}&type=player`)}
              >
                <ImageBackground
                  source={{ 
                    uri: player.strThumb || `https://via.placeholder.com/150x150/1a1a1a/ffffff?text=${encodeURIComponent(player.strPlayer)}`
                  }}
                  style={styles.playerImage}
                  imageStyle={styles.playerImageStyle}
                  defaultSource={require('../../assets/images/react-logo.png')}
                  onError={(e) => {
                    console.log('Player image error for', player.strPlayer, ':', e.nativeEvent.error);
                  }}
                >
                  <View style={styles.playerOverlay}>
                    <Text style={styles.playerName}>{player.strPlayer}</Text>
                    <Text style={styles.playerTeam}>{player.strPosition || 'Player'}</Text>
                    <TouchableOpacity 
                      style={styles.miniHeart}
                      onPress={() => handleFavoriteToggle(player, 'player')}
                    >
                      <Feather 
                        name="heart" 
                        size={16} 
                        color={favorites.some(fav => fav.id === player.idPlayer) ? '#ff6b6b' : '#666'} 
                      />
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        </View>
      )}

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
                    uri: team.strTeamBadge || `https://via.placeholder.com/150x150/E53E3E/ffffff?text=${encodeURIComponent(team.strTeam)}`
                  }}
                  style={styles.playerImage}
                  imageStyle={styles.playerImageStyle}
                  onError={() => {
                    console.log('Team image failed for:', team.strTeam);
                  }}
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
  loadingText: {
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    marginVertical: 10,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  debugText: {
    fontSize: 12,
    padding: 10,
    textAlign: 'center',
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
  horizontalScroll: {
    paddingVertical: 10,
  },
  sportsSelector: {
    paddingVertical: 10,
  },
  sportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    gap: 6,
  },
  sportButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
