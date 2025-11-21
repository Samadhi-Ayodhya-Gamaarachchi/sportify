import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetailsScreen() {
  const playerData = {
    name: 'Alexander Rossi',
    position: 'INDYCAR | ROKIT BMW M',
    category: 'Motorsport',
    image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=600&fit=crop&crop=center',
    stats: {
      height: "6'5\"",
      weight: '210 lbs',
      points: '25.3',
      assists: '7.1',
    },
    isFavorite: false,
    upcomingMatches: [
      {
        id: 1,
        homeTeam: 'Team A',
        awayTeam: 'Team B',
        date: 'Oct 29',
        time: '7:00 PM',
        homeIcon: 'https://via.placeholder.com/40x40/E53E3E/ffffff?text=A',
        awayIcon: 'https://via.placeholder.com/40x40/4A90E2/ffffff?text=B',
      }
    ]
  };

  const handleFavoriteToggle = () => {
    // Handle favorite toggle logic
  };

  const handleShare = () => {
    // Handle share logic
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Player Image */}
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{ uri: playerData.image }}
            style={styles.playerImage}
            imageStyle={styles.playerImageStyle}
          >
            <View style={styles.imageOverlay}>
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={handleFavoriteToggle}
              >
                <Ionicons 
                  name={playerData.isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={playerData.isFavorite ? "#E53E3E" : "#fff"} 
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        {/* Player Info */}
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>{playerData.name}</Text>
          <Text style={styles.playerPosition}>{playerData.position}</Text>
          <Text style={styles.playerCategory}>{playerData.category}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Bio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>News</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Height</Text>
              <Text style={styles.statValue}>{playerData.stats.height}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{playerData.stats.weight}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Points</Text>
              <Text style={styles.statValue}>{playerData.stats.points}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Assists</Text>
              <Text style={styles.statValue}>{playerData.stats.assists}</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Matches */}
        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming Matches</Text>
          {playerData.upcomingMatches.map((match) => (
            <TouchableOpacity key={match.id} style={styles.matchCard}>
              <View style={styles.matchTeams}>
                <View style={styles.teamContainer}>
                  <View style={styles.teamIcon}>
                    <Text style={styles.teamIconText}>A</Text>
                  </View>
                  <Text style={styles.teamName}>vs</Text>
                  <View style={styles.teamIcon}>
                    <Text style={styles.teamIconText}>B</Text>
                  </View>
                </View>
              </View>
              <View style={styles.matchInfo}>
                <Text style={styles.matchDate}>{match.date}</Text>
                <Text style={styles.matchTime}>{match.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
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
    color: '#fff',
    marginBottom: 8,
  },
  playerPosition: {
    fontSize: 16,
    color: '#E53E3E',
    marginBottom: 4,
  },
  playerCategory: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: '#666',
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
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  upcomingSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  matchCard: {
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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