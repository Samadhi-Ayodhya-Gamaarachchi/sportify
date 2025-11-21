import { Feather } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export default function TabsLayout() {
  const { theme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          paddingBottom: 20,
          paddingTop: 12,
          height: 75,
          marginHorizontal: 40,
          marginBottom: 15,
          borderRadius: 35,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        tabBarIconStyle: {
          marginBottom: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#E53E3E' : 'transparent',
              borderRadius: focused ? 22 : 0,
              padding: focused ? 8 : 0,
              alignItems: 'center',
              justifyContent: 'center',
              width: focused ? 44 : 'auto',
              height: focused ? 44 : 'auto',
            }}>
              <Feather name="home" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#E53E3E' : 'transparent',
              borderRadius: focused ? 22 : 0,
              padding: focused ? 8 : 0,
              alignItems: 'center',
              justifyContent: 'center',
              width: focused ? 44 : 'auto',
              height: focused ? 44 : 'auto',
            }}>
              <Feather name="heart" size={size} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="../profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{
              backgroundColor: focused ? '#E53E3E' : 'transparent',
              borderRadius: focused ? 22 : 0,
              padding: focused ? 8 : 0,
              alignItems: 'center',
              justifyContent: 'center',
              width: focused ? 44 : 'auto',
              height: focused ? 44 : 'auto',
            }}>
              <Feather name="user" size={size} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}