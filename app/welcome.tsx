import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=800&fit=crop&crop=center' }}
      style={styles.container}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="basketball" size={40} color="#fff" />
            </View>
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>Your Ultimate</Text>
            <Text style={styles.title}>Sports</Text>
            <Text style={styles.title}>Companion</Text>
          </View>
          
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons name="pulse" size={24} color="#fff" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Live Scores &</Text>
                <Text style={styles.featureTitle}>Updates</Text>
                <Text style={styles.featureDescription}>Real-time updates</Text>
                <Text style={styles.featureDescription}>as they happen.</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="people" size={24} color="#fff" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Follow Your</Text>
                <Text style={styles.featureTitle}>Favorite Teams</Text>
                <Text style={styles.featureDescription}>Never miss a</Text>
                <Text style={styles.featureDescription}>moment from the</Text>
                <Text style={styles.featureDescription}>teams you love.</Text>
              </View>
            </View>
            
            <View style={styles.featureItem}>
              <Ionicons name="analytics" size={24} color="#fff" />
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>In-Depth Match</Text>
                <Text style={styles.featureTitle}>Analysis</Text>
                <Text style={styles.featureDescription}>Deep dive into stats</Text>
                <Text style={styles.featureDescription}>and performance.</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.getStartedButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>Already have an account? Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
  },
  featuresContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    lineHeight: 20,
  },
  featureDescription: {
    fontSize: 14,
    color: '#rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginTop: 4,
  },
  buttonContainer: {
    gap: 20,
  },
  getStartedButton: {
    backgroundColor: '#E53E3E',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});