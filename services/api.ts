import axios from 'axios';

// API Configuration
const SPORTS_API_BASE = 'https://www.thesportsdb.com/api/v1/json';
const AUTH_API_BASE = 'https://dummyjson.com';

// Create axios instances
export const sportsAxios = axios.create({
  baseURL: SPORTS_API_BASE,
  timeout: 10000,
});

export const authAxios = axios.create({
  baseURL: AUTH_API_BASE,
  timeout: 10000,
});

// Sports API
export const sportsAPI = {
  // Get teams by league
  getTeamsByLeague: async (league: string) => {
    const response = await sportsAxios.get(`/1/search_all_teams.php?l=${encodeURIComponent(league)}`);
    return response.data;
  },

  // Get players by team
  getPlayersByTeam: async (teamName: string) => {
    const response = await sportsAxios.get(`/1/searchplayers.php?t=${encodeURIComponent(teamName)}`);
    return response.data;
  },

  // Get matches by league
  getMatchesByLeague: async (league: string) => {
    const response = await sportsAxios.get(`/1/eventsround.php?id=4328&r=38&s=2023-2024`);
    return response.data;
  },

  // Search teams
  searchTeams: async (query: string) => {
    const response = await sportsAxios.get(`/1/searchteams.php?t=${encodeURIComponent(query)}`);
    return response.data;
  },

  // Get team details
  getTeamDetails: async (teamId: string) => {
    const response = await sportsAxios.get(`/1/lookupteam.php?id=${teamId}`);
    return response.data;
  },

  // Get player details
  getPlayerDetails: async (playerId: string) => {
    const response = await sportsAxios.get(`/1/lookupplayer.php?id=${playerId}`);
    return response.data;
  },

  // Get leagues
  getAllLeagues: async () => {
    const response = await sportsAxios.get('/1/all_leagues.php');
    return response.data;
  },

  // Get next 5 events for a team
  getNextEvents: async (teamId: string) => {
    const response = await sportsAxios.get(`/1/eventsnext.php?id=${teamId}`);
    return response.data;
  },

  // Get last 5 events for a team
  getLastEvents: async (teamId: string) => {
    const response = await sportsAxios.get(`/1/eventslast.php?id=${teamId}`);
    return response.data;
  },
};

// Authentication API (using DummyJSON)
export const authAPI = {
  // Login user
  login: async (credentials: { username: string; password: string }) => {
    const response = await authAxios.post('/auth/login', credentials);
    return response.data;
  },

  // Register user (simulate with DummyJSON user creation)
  register: async (userData: { 
    username: string; 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
  }) => {
    // Since DummyJSON doesn't have real registration, we'll simulate it
    // In a real app, this would be a proper registration endpoint
    const response = await authAxios.post('/users/add', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      image: 'https://robohash.org/' + userData.username + '?set=set2&size=150x150',
    });
    
    // Add token for consistency with login response
    return {
      ...response.data,
      token: 'fake-jwt-token-' + Date.now(),
    };
  },

  // Get user profile
  getProfile: async (userId: number) => {
    const response = await authAxios.get(`/users/${userId}`);
    return response.data;
  },

  // Get all users (for testing)
  getAllUsers: async () => {
    const response = await authAxios.get('/users');
    return response.data;
  },
};