import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '../hooks/useTheme';
import { AppDispatch, RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { toggleTheme } from '../store/slices/themeSlice';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  const { theme, isDarkMode } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const userProfile = {
    name: user ? `${user.firstName} ${user.lastName}` : 'Guest User',
    email: user?.email || 'guest@example.com',
    avatar: user?.image || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  };

  const menuItems = [
    {
      id: 1,
      icon: 'user',
      title: 'My Profile',
      hasArrow: true,
    },
    {
      id: 2,
      icon: 'heart',
      title: 'Favorite Teams/Players',
      hasArrow: true,
      onPress: () => router.push('/(tabs)/favorites'),
    },
    {
      id: 3,
      icon: 'clock',
      title: 'My Activity',
      hasArrow: true,
    },
  ];

  const appSettings = [
    {
      id: 1,
      icon: 'bell',
      title: 'Notifications',
      hasToggle: true,
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      id: 2,
      icon: isDarkMode ? 'sun' : 'moon',
      title: 'Dark Mode',
      hasToggle: true,
      value: isDarkMode,
      onToggle: () => dispatch(toggleTheme()),
    },
  ];

  const supportItems = [
    {
      id: 1,
      icon: 'help-circle',
      title: 'Help & Support',
      hasArrow: true,
    },
    {
      id: 2,
      icon: 'info',
      title: 'About the App',
      hasArrow: true,
    },
  ];

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={[styles.content, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={[styles.profileSection, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
            <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.primary, borderColor: theme.background }]}>
              <Feather name="edit-2" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>{userProfile.name}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{userProfile.email}</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACCOUNT</Text>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.menuItem, { backgroundColor: theme.surface }]}
              onPress={item.onPress}
            >
              <Feather name={item.icon as any} size={20} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>{item.title}</Text>
              {item.hasArrow && (
                <Feather name="chevron-right" size={20} color={theme.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>APP SETTINGS</Text>
          {appSettings.map((item) => (
            <View key={item.id} style={[styles.menuItem, { backgroundColor: theme.surface }]}>
              <Feather name={item.icon as any} size={20} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>{item.title}</Text>
              {item.hasToggle && (
                <Switch
                  value={item.value}
                  onValueChange={item.onToggle}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={item.value ? '#fff' : theme.textSecondary}
                />
              )}
            </View>
          ))}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SUPPORT & LEGAL</Text>
          {supportItems.map((item) => (
            <TouchableOpacity key={item.id} style={[styles.menuItem, { backgroundColor: theme.surface }]}>
              <Feather name={item.icon as any} size={20} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>{item.title}</Text>
              {item.hasArrow && (
                <Feather name="chevron-right" size={20} color={theme.textSecondary} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: theme.surface, borderColor: theme.primary }]} 
          onPress={handleLogout}
        >
          <Feather name="log-out" size={20} color={theme.primary} />
          <Text style={[styles.logoutText, { color: theme.primary }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacing} />
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
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 15,
    letterSpacing: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  bottomSpacing: {
    height: 50,
  },
});