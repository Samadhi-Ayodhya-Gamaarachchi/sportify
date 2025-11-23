import axios from 'axios';

// API Configuration
const SPORTS_API_BASE = 'https://www.thesportsdb.com/api/v1/json';
const AUTH_API_BASE = 'https://dummyjson.com';

// Sports and Leagues Configuration
export const SPORTS_CONFIG = {
  soccer: {
    name: 'Soccer',
    icon: 'target',
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
    leagues: [
      { id: '4387', name: 'NBA', country: 'USA' },
      { id: '4388', name: 'NCAA', country: 'USA' }
    ]
  },
  baseball: {
    name: 'Baseball',
    icon: 'disc',
    leagues: [
      { id: '4424', name: 'MLB', country: 'USA' }
    ]
  },
  hockey: {
    name: 'Ice Hockey',
    icon: 'navigation',
    leagues: [
      { id: '4380', name: 'NHL', country: 'USA/Canada' }
    ]
  }
};

export type SportType = keyof typeof SPORTS_CONFIG;

// Create axios instances
export const sportsAxios = axios.create({
  baseURL: SPORTS_API_BASE,
  timeout: 10000,
});

export const authAxios = axios.create({
  baseURL: AUTH_API_BASE,
  timeout: 10000,
});

// Fallback data for different sports
const getSportFallbackData = (sport: SportType) => {
  const fallbackData: { [key in SportType]: any } = {
    soccer: {
      teams: [
        { idTeam: '133604', strTeam: 'Arsenal', strTeamBadge: 'https://resources.premierleague.com/premierleague/badges/70/t3.png', strLeague: 'English Premier League', strSport: 'Soccer' },
        { idTeam: '133602', strTeam: 'Manchester United', strTeamBadge: 'https://resources.premierleague.com/premierleague/badges/70/t1.png', strLeague: 'English Premier League', strSport: 'Soccer' },
        { idTeam: '133599', strTeam: 'Liverpool', strTeamBadge: 'https://resources.premierleague.com/premierleague/badges/70/t14.png', strLeague: 'English Premier League', strSport: 'Soccer' }
      ]
    },
    basketball: {
      teams: [
        { idTeam: '134865', strTeam: 'Los Angeles Lakers', strTeamBadge: 'https://via.placeholder.com/150x150/552583/FFD700?text=Lakers', strLeague: 'NBA', strSport: 'Basketball' },
        { idTeam: '134866', strTeam: 'Boston Celtics', strTeamBadge: 'https://via.placeholder.com/150x150/007A33/ffffff?text=Celtics', strLeague: 'NBA', strSport: 'Basketball' },
        { idTeam: '134867', strTeam: 'Golden State Warriors', strTeamBadge: 'https://via.placeholder.com/150x150/1D428A/FFC72C?text=Warriors', strLeague: 'NBA', strSport: 'Basketball' }
      ]
    },
    baseball: {
      teams: [
        { idTeam: '135268', strTeam: 'New York Yankees', strTeamBadge: 'https://via.placeholder.com/150x150/132448/ffffff?text=Yankees', strLeague: 'MLB', strSport: 'Baseball' },
        { idTeam: '135269', strTeam: 'Los Angeles Dodgers', strTeamBadge: 'https://via.placeholder.com/150x150/005A9C/ffffff?text=Dodgers', strLeague: 'MLB', strSport: 'Baseball' }
      ]
    },
    hockey: {
      teams: [
        { idTeam: '134881', strTeam: 'Toronto Maple Leafs', strTeamBadge: 'https://via.placeholder.com/150x150/003E7E/ffffff?text=Leafs', strLeague: 'NHL', strSport: 'Ice Hockey' },
        { idTeam: '134882', strTeam: 'Montreal Canadiens', strTeamBadge: 'https://via.placeholder.com/150x150/AF1E2D/ffffff?text=Canadiens', strLeague: 'NHL', strSport: 'Ice Hockey' }
      ]
    }
  };
  
  return fallbackData[sport] || { teams: [] };
};

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
        
        // Team badge mapping for Premier League teams
        const teamBadges: { [key: string]: string } = {
          'Arsenal': 'https://resources.premierleague.com/premierleague/badges/70/t3.png',
          'Manchester United': 'https://resources.premierleague.com/premierleague/badges/70/t1.png',
          'Liverpool': 'https://resources.premierleague.com/premierleague/badges/70/t14.png',
          'Chelsea': 'https://resources.premierleague.com/premierleague/badges/70/t8.png',
          'Manchester City': 'https://resources.premierleague.com/premierleague/badges/70/t43.png',
          'Tottenham Hotspur': 'https://resources.premierleague.com/premierleague/badges/70/t6.png',
          'Brighton and Hove Albion': 'https://resources.premierleague.com/premierleague/badges/70/t36.png',
          'Aston Villa': 'https://resources.premierleague.com/premierleague/badges/70/t7.png',
          'Newcastle United': 'https://resources.premierleague.com/premierleague/badges/70/t4.png',
          'West Ham United': 'https://resources.premierleague.com/premierleague/badges/70/t21.png'
        };

        // Enhance teams with better image URLs and fallbacks
        const enhancedTeams = response.data.teams.map((team: any) => ({
          ...team,
          strTeamBadge: team.strTeamBadge || 
                       teamBadges[team.strTeam] ||
                       `https://via.placeholder.com/150x150/E53E3E/ffffff?text=${encodeURIComponent(team.strTeam)}`,
          strTeamLogo: team.strTeamLogo || teamBadges[team.strTeam] || team.strTeamBadge,
          strDescription: team.strDescription || `${team.strTeam} is a professional football club.`
        }));
        
        return { teams: enhancedTeams };
      }
    } catch (error) {
      console.error('Error with teams API:', error);
      console.log('Using fallback data due to API error');
    }
    
    console.log('Using fallback data as backup');
    
    // Return sample data as fallback with working image URLs
    return {
      teams: [
          {
            idTeam: '133604',
            strTeam: 'Arsenal',
            strTeamBadge: 'https://resources.premierleague.com/premierleague/badges/70/t3.png',
            strTeamLogo: 'https://resources.premierleague.com/premierleague/badges/70/t3.png',
            strLeague: 'English Premier League',
            strStadium: 'Emirates Stadium',
            strDescription: 'Arsenal Football Club is a professional football club based in Islington, London, England.'
          },
          {
            idTeam: '133602',
            strTeam: 'Manchester United', 
            strTeamBadge: 'https://resources.premierleague.com/premierleague/badges/70/t1.png',
            strTeamLogo: 'https://resources.premierleague.com/premierleague/badges/70/t1.png',
            strLeague: 'English Premier League',
            strStadium: 'Old Trafford',
            strDescription: 'Manchester United Football Club is a professional football club based in Old Trafford, Manchester, England.'
          },
          {
            idTeam: '133599',
            strTeam: 'Liverpool',
            strTeamBadge: 'https://resources.premierleague.com/premierleague/badges/70/t14.png',
            strTeamLogo: 'https://resources.premierleague.com/premierleague/badges/70/t14.png',
            strLeague: 'English Premier League',
            strStadium: 'Anfield',
            strDescription: 'Liverpool Football Club is a professional football club based in Liverpool, England.'
          },
          {
            idTeam: '133613',
            strTeam: 'Chelsea',
            strTeamBadge: 'https://resources.premierleague.com/premierleague/badges/70/t8.png',
            strTeamLogo: 'https://resources.premierleague.com/premierleague/badges/70/t8.png',
            strLeague: 'English Premier League',
            strStadium: 'Stamford Bridge',
            strDescription: 'Chelsea Football Club is a professional football club based in Fulham, London, England.'
          },
          {
            idTeam: '133616',
            strTeam: 'Manchester City',
            strTeamBadge: 'https://resources.premierleague.com/premierleague/badges/70/t43.png',
            strTeamLogo: 'https://resources.premierleague.com/premierleague/badges/70/t43.png',
            strLeague: 'English Premier League',
            strStadium: 'Etihad Stadium',
            strDescription: 'Manchester City Football Club is a professional football club based in Manchester, England.'
          },
          {
            idTeam: '133610',
            strTeam: 'Tottenham Hotspur',
            strTeamBadge: 'https://resources.premierleague.com/premierleague/badges/70/t6.png',
            strTeamLogo: 'https://resources.premierleague.com/premierleague/badges/70/t6.png',
            strLeague: 'English Premier League',
            strStadium: 'Tottenham Hotspur Stadium',
            strDescription: 'Tottenham Hotspur Football Club is a professional football club based in Tottenham, London, England.'
          }
        ]
      };
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
        
        // Enhanced badge mapping for different sports
        const enhancedTeams = response.data.teams.map((team: any) => ({
          ...team,
          strTeamBadge: team.strTeamBadge || 
                       team.strTeamLogo ||
                       `https://via.placeholder.com/150x150/E53E3E/ffffff?text=${encodeURIComponent(team.strTeam)}`,
          strSport: sport,
          strDescription: team.strDescription || `${team.strTeam} is a professional ${sport} team.`
        }));
        
        return { teams: enhancedTeams };
      }
    } catch (error) {
      console.error(`Error fetching ${sport} teams:`, error);
    }

    // Return fallback data based on sport
    return getSportFallbackData(sport);
  },

  // Get players by team
  getPlayersByTeam: async (teamName: string) => {
    try {
      console.log('Fetching players for team:', teamName);
      const response = await sportsAxios.get(`/3/searchplayers.php?t=${encodeURIComponent(teamName)}`);
      if (response.data && response.data.player) {
        console.log('API players response:', response.data.player.length, 'players');
        
        // Enhance players with better image URLs
        const enhancedPlayers = response.data.player.map((player: any) => ({
          ...player,
          strThumb: player.strThumb || player.strCutout || 
                   `https://www.thesportsdb.com/images/media/player/thumb/${player.idPlayer}.jpg` ||
                   `https://via.placeholder.com/150x150/1a1a1a/ffffff?text=${encodeURIComponent(player.strPlayer)}`,
        }));
        
        return { player: enhancedPlayers };
      }
    } catch (error) {
      console.error('Error fetching players:', error);
    }
    
    // Return sample players as fallback
    return { 
      player: [
        {
          idPlayer: '34145406',
          strPlayer: 'Bukayo Saka',
          strThumb: 'https://www.thesportsdb.com/images/media/player/thumb/34145406.jpg',
          strPosition: 'Right Winger',
          strTeam: teamName,
          strNationality: 'England',
          strHeight: '178 cm',
          strWeight: '70 kg'
        },
        {
          idPlayer: '34145407',
          strPlayer: 'Martin Odegaard',
          strThumb: 'https://www.thesportsdb.com/images/media/player/thumb/34145407.jpg',
          strPosition: 'Attacking Midfielder',
          strTeam: teamName,
          strNationality: 'Norway',
          strHeight: '178 cm',
          strWeight: '68 kg'
        },
        {
          idPlayer: '34145408',
          strPlayer: 'Gabriel Martinelli',
          strThumb: 'https://www.thesportsdb.com/images/media/player/thumb/34145408.jpg',
          strPosition: 'Left Winger',
          strTeam: teamName,
          strNationality: 'Brazil',
          strHeight: '175 cm',
          strWeight: '72 kg'
        }
      ]
    };
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
      console.log('Using fallback match data due to API error');
    }
    
    console.log('Using fallback match data as backup');
    
    // Return sample match data immediately (API endpoints returning 404)
    return {
      events: [
          {
            idEvent: '441617',
            strEvent: 'Arsenal vs Manchester United',
            strHomeTeam: 'Arsenal',
            strAwayTeam: 'Manchester United',
            intHomeScore: '3',
            intAwayScore: '1',
            dateEvent: '2024-01-20',
            strStatus: 'Match Finished'
          },
          {
            idEvent: '441618',
            strEvent: 'Liverpool vs Chelsea',
            strHomeTeam: 'Liverpool',
            strAwayTeam: 'Chelsea',
            intHomeScore: '2',
            intAwayScore: '1',
            dateEvent: '2024-01-21',
            strStatus: 'Match Finished'
          },
          {
            idEvent: '441619',
            strEvent: 'Manchester City vs Tottenham',
            strHomeTeam: 'Manchester City',
            strAwayTeam: 'Tottenham',
            intHomeScore: '4',
            intAwayScore: '0',
            dateEvent: '2024-01-22',
            strStatus: 'Match Finished'
          }
        ]
      };
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