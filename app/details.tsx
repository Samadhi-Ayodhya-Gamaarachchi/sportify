import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { AppDispatch, RootState } from '../store';
import { addFavorite, removeFavorite } from '../store/slices/favoritesSlice';

interface DetailItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  type: 'team' | 'match' | 'player';
  additionalInfo: any;
}

export default function DetailsScreen() {
  const { id, type } = useLocalSearchParams<{ id: string; type: 'team' | 'match' | 'player' }>();
  const [item, setItem] = useState<DetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const { items: favoriteItems } = useSelector((state: RootState) => state.favorites);
  const { teams, matches, players } = useSelector((state: RootState) => state.sports);

  const isFavorite = favoriteItems.some(fav => fav.id === id);

  useEffect(() => {
    loadItemDetails();
  }, [id, type]);

  const loadItemDetails = () => {
    setLoading(true);
    
    if (type === 'team') {
      const team = teams.find(t => t.idTeam === id);
      if (team) {
        setItem({
          id: team.idTeam,
          name: team.strTeam,
          subtitle: team.strLeague || 'Football Team',
          description: team.strStadium ? `Home Stadium: ${team.strStadium}` : 'Professional Football Team',
          image: team.strTeamBadge || 'https://via.placeholder.com/400x300/E53E3E/ffffff?text=' + encodeURIComponent(team.strTeam),
          type: 'team',
          additionalInfo: {
            stadium: team.strStadium,
            league: team.strLeague,
            description: team.strDescription || 'A professional football team competing at the highest level.',
          }
        });
      }
    } else if (type === 'match') {
      const match = matches.find(m => m.idEvent === id);
      if (match) {
        setItem({
          id: match.idEvent,
          name: match.strEvent,
          subtitle: match.strStatus || 'Football Match',
          description: `${match.strHomeTeam} vs ${match.strAwayTeam}`,
          image: 'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=400&h=300&fit=crop&crop=center',
          type: 'match',
          additionalInfo: {
            homeTeam: match.strHomeTeam,
            awayTeam: match.strAwayTeam,
            homeScore: match.intHomeScore,
            awayScore: match.intAwayScore,
            date: match.dateEvent,
            status: match.strStatus
          }
        });
      }
    } else if (type === 'player') {
      const player = players.find(p => p.idPlayer === id);
      if (player) {
        setItem({
          id: player.idPlayer,
          name: player.strPlayer,
          subtitle: player.strPosition || 'Football Player',
          description: `${player.strNationality || 'International'} player for ${player.strTeam || 'Professional Club'}`,
          image: player.strThumb || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
          type: 'player',
          additionalInfo: {
            position: player.strPosition,
            nationality: player.strNationality,
            team: player.strTeam,
            height: player.strHeight,
            weight: player.strWeight,
            description: `${player.strPlayer} is a professional football player known for their skills and dedication.`,
          }
        });
      }
    }
    
    setLoading(false);
  };

  const handleFavoriteToggle = () => {
    if (!item) return;
    
    const favoriteItem = {
      id: item.id,
      name: item.name,
      image: item.image,
      type: item.type,
      dateAdded: new Date().toISOString()
    };

    if (isFavorite) {
      dispatch(removeFavorite(item.id));
    } else {
      dispatch(addFavorite(favoriteItem));
    }
  };

  const handleShare = () => {
    Alert.alert('Share', `Share ${item?.name || 'this item'} with friends!`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading details...</Text>
        </View>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Details</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.text }]}>Item not found</Text>
          <TouchableOpacity 
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {item.type === 'team' ? 'Team Details' : 'Match Details'}
        </Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Feather name="share" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Item Image */}
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.playerImage}
            imageStyle={styles.playerImageStyle}
            defaultSource={{
              uri: 'https://via.placeholder.com/400x300/E53E3E/ffffff?text=' + encodeURIComponent(item.name)
            }}
          >
            <View style={styles.imageOverlay}>
              <TouchableOpacity 
                style={[styles.favoriteButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}
                onPress={handleFavoriteToggle}
              >
                <Feather 
                  name="heart" 
                  size={24} 
                  color={isFavorite ? theme.primary : "#fff"} 
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Item Info */}
        <View style={styles.playerInfo}>
          <Text style={[styles.playerName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.playerPosition, { color: theme.primary }]}>{item.subtitle}</Text>
          <Text style={[styles.playerCategory, { color: theme.textSecondary }]}>{item.description}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.primaryButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.primaryButtonText}>
              {item.type === 'team' ? 'Team Info' : 'Match Info'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.surface }]}>
            <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>
              {item.type === 'team' ? 'Players' : 'Statistics'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryButton, { backgroundColor: theme.surface }]}>
            <Text style={[styles.secondaryButtonText, { color: theme.textSecondary }]}>News</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Content Section */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {item.type === 'team' ? 'Team Details' : item.type === 'player' ? 'Player Details' : 'Match Details'}
          </Text>
          <View style={styles.statsGrid}>
            {item.type === 'team' ? (
              <>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>League</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {item.additionalInfo.league || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Stadium</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {item.additionalInfo.stadium || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Type</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>Football Club</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Status</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>Active</Text>
                </View>
              </>
            ) : (
              <>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Home Team</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {item.additionalInfo.homeTeam || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Away Team</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {item.additionalInfo.awayTeam || 'N/A'}
                  </Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Score</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {item.additionalInfo.homeScore && item.additionalInfo.awayScore 
                      ? `${item.additionalInfo.homeScore} - ${item.additionalInfo.awayScore}`
                      : 'TBD'
                    }
                  </Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Date</Text>
                  <Text style={[styles.statValue, { color: theme.text }]}>
                    {item.additionalInfo.date || 'N/A'}
                  </Text>
                </View>
              </>
            )}
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.upcomingSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {item.type === 'team' ? 'About Team' : item.type === 'player' ? 'About Player' : 'Match Details'}
          </Text>
          <View style={[styles.matchCard, { backgroundColor: theme.surface }]}>
            <Text style={[styles.descriptionText, { color: theme.text }]}>
              {item.type === 'team' 
                ? item.additionalInfo.description || `${item.name} is a professional football team competing in ${item.additionalInfo.league || 'top-level'} football.`
                : item.type === 'player'
                ? item.additionalInfo.description || `${item.name} is a ${item.additionalInfo.position || 'professional football player'} known for exceptional skills and dedication to the sport.`
                : `This match between ${item.additionalInfo.homeTeam} and ${item.additionalInfo.awayTeam} ${item.additionalInfo.status ? `is ${item.additionalInfo.status.toLowerCase()}` : 'was scheduled'} on ${item.additionalInfo.date || 'the specified date'}.`
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  shareButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  playerImage: {
    flex: 1,
  },
  playerImageStyle: {
    borderRadius: 15,
  },
  imageOverlay: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInfo: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  playerPosition: {
    fontSize: 16,
    marginBottom: 4,
  },
  playerCategory: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#E53E3E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  upcomingSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  matchCard: {
    borderRadius: 15,
    padding: 20,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  matchTeams: {
    flex: 1,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  teamIcon: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  teamName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  matchInfo: {
    alignItems: 'flex-end',
  },
  matchDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  matchTime: {
    fontSize: 12,
    color: '#666',
  },
});