import axios from 'axios';

// API Configuration
const SPORTS_API_BASE = 'https://www.thesportsdb.com/api/v1/json';
const AUTH_API_BASE = 'https://dummyjson.com';

// Sports and Leagues Configuration
export const SPORTS_CONFIG = {
  soccer: {
    name: 'Soccer',
    icon: 'target',
    emoji: '⚽',
    leagues: [
      { id: '4328', name: 'English Premier League', country: 'England' },
      { id: '4329', name: 'English League Championship', country: 'England' },
      { id: '4331', name: 'German Bundesliga', country: 'Germany' },
      { id: '4332', name: 'Italian Serie A', country: 'Italy' },
      { id: '4334', name: 'French Ligue 1', country: 'France' },
      { id: '4335', name: 'Spanish La Liga', country: 'Spain' }
    ]
  },
  basketball: {
    name: 'Basketball',
    icon: 'circle',
    emoji: '🏀',
    leagues: [
      { id: '4387', name: 'NBA', country: 'USA' },
      { id: '4388', name: 'NCAA', country: 'USA' }
    ]
  },
  baseball: {
    name: 'Baseball',
    icon: 'disc',
    emoji: '⚾',
    leagues: [
      { id: '4424', name: 'MLB', country: 'USA' }
    ]
  },
  hockey: {
    name: 'Ice Hockey',
    icon: 'navigation',
    emoji: '🏒',
    leagues: [
      { id: '4380', name: 'NHL', country: 'USA/Canada' }
    ]
  },
  americanfootball: {
    name: 'American Football',
    icon: 'shield',
    emoji: '🏈',
    leagues: [
      { id: '4391', name: 'NFL', country: 'USA' }
    ]
  },
  tennis: {
    name: 'Tennis',
    icon: 'circle',
    emoji: '🎾',
    leagues: [
      { id: '4500', name: 'ATP Tour', country: 'International' },
      { id: '4501', name: 'WTA Tour', country: 'International' }
    ]
  },
  motorsport: {
    name: 'Motorsport',
    icon: 'zap',
    emoji: '🏎️',
    leagues: [
      { id: '4370', name: 'Formula 1', country: 'International' }
    ]
  },
  golf: {
    name: 'Golf',
    icon: 'target',
    emoji: '⛳',
    leagues: [
      { id: '4502', name: 'PGA Tour', country: 'USA' }
    ]
  }
};

export type SportType = keyof typeof SPORTS_CONFIG;

// Team Logo Mappings for popular teams
const TEAM_LOGOS: { [key: string]: string } = {
  // English Premier League
  'Arsenal': 'https://logos-world.net/wp-content/uploads/2020/06/Arsenal-Logo.png',
  'Chelsea': 'https://logos-world.net/wp-content/uploads/2020/06/Chelsea-Logo.png',
  'Liverpool': 'https://logos-world.net/wp-content/uploads/2020/06/Liverpool-Logo.png',
  'Manchester United': 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-United-Logo.png',
  'Manchester City': 'https://logos-world.net/wp-content/uploads/2020/06/Manchester-City-Logo.png',
  'Tottenham Hotspur': 'https://logos-world.net/wp-content/uploads/2020/06/Tottenham-Logo.png',
  'Leicester City': 'https://logos-world.net/wp-content/uploads/2020/06/Leicester-City-Logo.png',
  'West Ham United': 'https://logos-world.net/wp-content/uploads/2020/06/West-Ham-United-Logo.png',
  'Everton': 'https://logos-world.net/wp-content/uploads/2020/06/Everton-Logo.png',
  'Newcastle United': 'https://logos-world.net/wp-content/uploads/2020/06/Newcastle-United-Logo.png',
  
  // Spanish La Liga
  'Real Madrid': 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png',
  'FC Barcelona': 'https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png',
  'Atletico Madrid': 'https://logos-world.net/wp-content/uploads/2020/06/Atletico-Madrid-Logo.png',
  'Valencia': 'https://logos-world.net/wp-content/uploads/2020/06/Valencia-Logo.png',
  'Sevilla': 'https://logos-world.net/wp-content/uploads/2020/06/Sevilla-Logo.png',
  
  // German Bundesliga
  'Bayern Munich': 'https://logos-world.net/wp-content/uploads/2020/06/Bayern-Munich-Logo.png',
  'Borussia Dortmund': 'https://logos-world.net/wp-content/uploads/2020/06/Borussia-Dortmund-Logo.png',
  'RB Leipzig': 'https://logos-world.net/wp-content/uploads/2020/06/RB-Leipzig-Logo.png',
  'Bayer Leverkusen': 'https://logos-world.net/wp-content/uploads/2020/06/Bayer-Leverkusen-Logo.png',
  
  // Italian Serie A
  'Juventus': 'https://logos-world.net/wp-content/uploads/2020/06/Juventus-Logo.png',
  'AC Milan': 'https://logos-world.net/wp-content/uploads/2020/06/AC-Milan-Logo.png',
  'Inter Milan': 'https://logos-world.net/wp-content/uploads/2020/06/Inter-Milan-Logo.png',
  'AS Roma': 'https://logos-world.net/wp-content/uploads/2020/06/AS-Roma-Logo.png',
  'Napoli': 'https://logos-world.net/wp-content/uploads/2020/06/Napoli-Logo.png',
  
  // French Ligue 1
  'Paris Saint-Germain': 'https://logos-world.net/wp-content/uploads/2020/06/Paris-Saint-Germain-Logo.png',
  'Marseille': 'https://logos-world.net/wp-content/uploads/2020/06/Marseille-Logo.png',
  'Lyon': 'https://logos-world.net/wp-content/uploads/2020/06/Lyon-Logo.png',
  
  // NBA Teams
  'Los Angeles Lakers': 'https://logos-world.net/wp-content/uploads/2020/05/Los-Angeles-Lakers-Logo.png',
  'Golden State Warriors': 'https://logos-world.net/wp-content/uploads/2020/05/Golden-State-Warriors-Logo.png',
  'Chicago Bulls': 'https://logos-world.net/wp-content/uploads/2020/05/Chicago-Bulls-Logo.png',
  'Boston Celtics': 'https://logos-world.net/wp-content/uploads/2020/05/Boston-Celtics-Logo.png',
  'Miami Heat': 'https://logos-world.net/wp-content/uploads/2020/05/Miami-Heat-Logo.png',
  'Brooklyn Nets': 'https://logos-world.net/wp-content/uploads/2020/05/Brooklyn-Nets-Logo.png',
  
  // NFL Teams
  'New England Patriots': 'https://logos-world.net/wp-content/uploads/2020/05/New-England-Patriots-Logo.png',
  'Dallas Cowboys': 'https://logos-world.net/wp-content/uploads/2020/05/Dallas-Cowboys-Logo.png',
  'Green Bay Packers': 'https://logos-world.net/wp-content/uploads/2020/05/Green-Bay-Packers-Logo.png',
  'Pittsburgh Steelers': 'https://logos-world.net/wp-content/uploads/2020/05/Pittsburgh-Steelers-Logo.png',
  
  // MLB Teams
  'New York Yankees': 'https://logos-world.net/wp-content/uploads/2020/05/New-York-Yankees-Logo.png',
  'Los Angeles Dodgers': 'https://logos-world.net/wp-content/uploads/2020/05/Los-Angeles-Dodgers-Logo.png',
  'Boston Red Sox': 'https://logos-world.net/wp-content/uploads/2020/05/Boston-Red-Sox-Logo.png',
  
  // NHL Teams
  'Toronto Maple Leafs': 'https://logos-world.net/wp-content/uploads/2020/05/Toronto-Maple-Leafs-Logo.png',
  'Montreal Canadiens': 'https://logos-world.net/wp-content/uploads/2020/05/Montreal-Canadiens-Logo.png',
  'Boston Bruins': 'https://logos-world.net/wp-content/uploads/2020/05/Boston-Bruins-Logo.png',
};

// Function to get actual team logo
export const getTeamLogo = (teamName: string, fallbackLogo?: string): string => {
  // Check direct match first
  if (TEAM_LOGOS[teamName]) {
    return TEAM_LOGOS[teamName];
  }
  
  // Check for partial matches (case insensitive)
  const normalizedTeamName = teamName.toLowerCase();
  for (const [logoTeamName, logoUrl] of Object.entries(TEAM_LOGOS)) {
    if (normalizedTeamName.includes(logoTeamName.toLowerCase()) || 
        logoTeamName.toLowerCase().includes(normalizedTeamName)) {
      return logoUrl;
    }
  }
  
  // Return fallback logo from API or placeholder
  return fallbackLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName)}&size=300&background=1a1a1a&color=ffffff&bold=true`;
};

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
  // Get teams by league and sport
  getTeamsByLeague: async (league: string, sport?: SportType) => {
    console.log('Fetching teams from TheSportsDB API for league:', league, 'sport:', sport);
    
    try {
      // Use the search endpoint that works
      const response = await sportsAxios.get(`/3/search_all_teams.php?l=${encodeURIComponent(league)}`);
      if (response.data && response.data.teams) {
        console.log('API teams response:', response.data.teams.length, 'teams');
        
        // Use only API data with enhanced logos
        const enhancedTeams = response.data.teams.map((team: any) => ({
          ...team,
          strTeamBadge: getTeamLogo(team.strTeam, team.strTeamBadge),
          strDescription: team.strDescription || `${team.strTeam} is a professional football club.`
        }));
        
        return { teams: enhancedTeams };
      }
    } catch (error) {
      console.error('Error with teams API:', error);
      throw new Error(`Failed to fetch teams for league: ${league}`);
    }
    
    // Return empty if no data found
    return { teams: [] };
  },

  // Get teams by sport type
  getTeamsBySport: async (sport: SportType) => {
    console.log('Fetching teams for sport:', sport);
    
    const sportConfig = SPORTS_CONFIG[sport];
    if (!sportConfig || !sportConfig.leagues.length) {
      return { teams: [] };
    }

    try {
      // Get teams from the first league of the sport
      const primaryLeague = sportConfig.leagues[0];
      const response = await sportsAxios.get(`/3/search_all_teams.php?l=${encodeURIComponent(primaryLeague.name)}`);
      
      if (response.data && response.data.teams) {
        console.log(`API ${sport} teams response:`, response.data.teams.length, 'teams');
        
        // Use only API data with enhanced logos
        const enhancedTeams = response.data.teams.map((team: any) => ({
          ...team,
          strSport: sport,
          strTeamBadge: getTeamLogo(team.strTeam, team.strTeamBadge),
          strDescription: team.strDescription || `${team.strTeam} is a professional ${sport} team.`
        }));
        
        return { teams: enhancedTeams };
      }
    } catch (error) {
      console.error(`Error fetching ${sport} teams:`, error);
      throw new Error(`Failed to fetch teams for sport: ${sport}`);
    }

    // Return empty if no data found
    return { teams: [] };
  },

  // Get players by team
  getPlayersByTeam: async (teamName: string) => {
    try {
      console.log('Fetching players for team:', teamName);
      const response = await sportsAxios.get(`/3/searchplayers.php?t=${encodeURIComponent(teamName)}`);
      if (response.data && response.data.player) {
        console.log('API players response:', response.data.player.length, 'players');
        
        // Use only API data without modifications
        const enhancedPlayers = response.data.player;
        
        return { player: enhancedPlayers };
      }
    } catch (error) {
      console.error('Error fetching players:', error);
      throw new Error(`Failed to fetch players for team: ${teamName}`);
    }
    
    // Return empty if no data found
    return { player: [] };
  },

  // Get matches by league
  getMatchesByLeague: async (league: string) => {
    console.log('Fetching matches from TheSportsDB API for league:', league);
    
    try {
      // Use current season events - get league ID first
      const currentYear = new Date().getFullYear();
      const season = `${currentYear-1}-${currentYear}`;
      
      // For Premier League (ID: 4328)
      const response = await sportsAxios.get(`/3/eventsseason.php?id=4328&s=${season}`);
      if (response.data && response.data.events && response.data.events.length > 0) {
        console.log('API matches response:', response.data.events.length, 'matches');
        // Return only the first 10 matches to avoid too much data
        return {
          events: response.data.events.slice(0, 10)
        };
      }
    } catch (error) {
      console.error('Error with matches API:', error);
      throw new Error(`Failed to fetch matches for league: ${league}`);
    }
    
    // Return empty if no data found
    return { events: [] };
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

  // Get all available sports
  getAllSports: () => {
    return Object.entries(SPORTS_CONFIG).map(([key, config]) => ({
      id: key,
      name: config.name,
      icon: config.icon,
      emoji: config.emoji,
      leagues: config.leagues
    }));
  },

  // Get leagues by sport
  getLeaguesBySport: (sport: SportType) => {
    return SPORTS_CONFIG[sport]?.leagues || [];
  },
};

// Authentication API (using DummyJSON)
export const authAPI = {
  // Login user
  login: async (credentials: { username: string; password: string }) => {
    try {
      console.log('Attempting login with:', credentials.username);
      const response = await authAxios.post('/auth/login', credentials);
      console.log('Login successful:', response.data);
      
      // DummyJSON returns accessToken, but we need token for consistency
      return {
        ...response.data,
        token: response.data.accessToken,
        id: response.data.id
      };
    } catch (error: any) {
      console.error('Login failed:', error.response?.data || error.message);
      throw error;
    }
  },

  // Register user (simulate with DummyJSON user creation)
  register: async (userData: { 
    username: string; 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
  }) => {
    try {
      console.log('Attempting registration for:', userData.username);
      
      // Since DummyJSON doesn't have real registration, we'll simulate it
      // In a real app, this would be a proper registration endpoint
      const response = await authAxios.post('/users/add', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        image: 'https://dummyjson.com/icon/' + userData.username + '/128',
      });
      
      console.log('Registration successful:', response.data);
      
      // Add token for consistency with login response
      return {
        ...response.data,
        token: 'demo-token-' + Date.now(),
        accessToken: 'demo-token-' + Date.now(),
      };
    } catch (error: any) {
      console.error('Registration failed:', error.response?.data || error.message);
      throw error;
    }
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