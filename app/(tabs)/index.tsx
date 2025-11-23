import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../../hooks/useTheme';
import { SportType } from '../../services/api';
import { AppDispatch, RootState } from '../../store';
import { toggleFavorite } from '../../store/slices/favoritesSlice';
import { fetchMatches, fetchPlayers, fetchTeamsBySport, setCurrentSport } from '../../store/slices/sportsSlice';

// Helper function to get team image from API data only
const getImageSource = (team: any) => {
  // Use only API provided images
  return team.strTeamBadge || team.strTeamLogo || team.strThumb || '';
};

// Helper function to get player image from API data only
const getPlayerImageSource = (player: any) => {
  // Use only API provided images
  return player.strThumb || player.strCutout || player.strFanart1 || '';
};

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

  useEffect(() => {
    console.log('Sport changed to:', currentSport);
    loadData();
  }, [currentSport]);

  const loadData = async () => {
    try {
      console.log('=== LOADING DATA ===');
      console.log('Current sport:', currentSport);
      console.log('Current league:', selectedLeague);
      console.log('Current teams count:', teams.length);
      
      // Fetch teams by current sport
      const teamResult = await dispatch(fetchTeamsBySport(currentSport));
      console.log('Team result for', currentSport, ':', teamResult);
      
      // Fetch sport-specific data
      if (currentSport === 'soccer') {
        const matchResult = await dispatch(fetchMatches(selectedLeague || 'English Premier League'));
        console.log('Match result:', matchResult);
      }
      
      // Get players from first team if available for any sport
      if (teamResult.payload && teamResult.payload.length > 0) {
        const firstTeamName = teamResult.payload[0].strTeam;
        console.log('Fetching players for team:', firstTeamName);
        const playersResult = await dispatch(fetchPlayers(firstTeamName));
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





  // Use only real API data
  const featuredTeams = teams.slice(0, 2);
  const recentMatches = matches.slice(0, 3);
  const topTeams = teams.slice(0, 4);
  
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
          <Text style={[styles.appName, { color: theme.text }]}>SportFury</Text>
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
              <Text style={styles.sportEmoji}>{sport.emoji}</Text>
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
                    uri: getPlayerImageSource(player)
                  }}
                  style={styles.playerImage}
                  imageStyle={styles.playerImageStyle}
                  defaultSource={{
                    uri: 'https://www.thesportsdb.com/images/media/player/thumb/generic.jpg'
                  }}
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
                    uri: getImageSource(team)
                  }}
                  style={styles.playerImage}
                  imageStyle={styles.playerImageStyle}
                  defaultSource={{
                    uri: 'https://www.thesportsdb.com/images/media/team/badge/generic.png'
                  }}
                  onError={(error) => {
                    console.log('Team image failed for:', team.strTeam, error.nativeEvent?.error);
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
  sportEmoji: {
    fontSize: 16,
  },
});
