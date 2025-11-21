import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { sportsAPI } from '../../services/api';

interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge?: string;
  strStadium?: string;
  strLeague?: string;
  strDescription?: string;
}

interface Player {
  idPlayer: string;
  strPlayer: string;
  strThumb?: string;
  strPosition?: string;
  strTeam?: string;
  strNationality?: string;
  strHeight?: string;
  strWeight?: string;
}

interface Match {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  dateEvent: string;
  strTime?: string;
  intHomeScore?: string;
  intAwayScore?: string;
  strStatus?: string;
}

interface SportsState {
  teams: Team[];
  players: Player[];
  matches: Match[];
  leagues: any[];
  isLoading: boolean;
  error: string | null;
  selectedLeague: string;
}

const initialState: SportsState = {
  teams: [],
  players: [],
  matches: [],
  leagues: [],
  isLoading: false,
  error: null,
  selectedLeague: 'English Premier League',
};

// Async thunks
export const fetchTeams = createAsyncThunk(
  'sports/fetchTeams',
  async (league: string, { rejectWithValue }) => {
    try {
      const response = await sportsAPI.getTeamsByLeague(league);
      return response.teams || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch teams');
    }
  }
);

export const fetchPlayers = createAsyncThunk(
  'sports/fetchPlayers',
  async (teamName: string, { rejectWithValue }) => {
    try {
      const response = await sportsAPI.getPlayersByTeam(teamName);
      return response.player || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch players');
    }
  }
);

export const fetchMatches = createAsyncThunk(
  'sports/fetchMatches',
  async (league: string, { rejectWithValue }) => {
    try {
      const response = await sportsAPI.getMatchesByLeague(league);
      return response.events || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch matches');
    }
  }
);

export const searchTeams = createAsyncThunk(
  'sports/searchTeams',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await sportsAPI.searchTeams(query);
      return response.teams || [];
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search teams');
    }
  }
);

const sportsSlice = createSlice({
  name: 'sports',
  initialState,
  reducers: {
    setSelectedLeague: (state, action: PayloadAction<string>) => {
      state.selectedLeague = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch teams
      .addCase(fetchTeams.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch players
      .addCase(fetchPlayers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPlayers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.players = action.payload;
      })
      .addCase(fetchPlayers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch matches
      .addCase(fetchMatches.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search teams
      .addCase(searchTeams.fulfilled, (state, action) => {
        state.teams = action.payload;
      });
  },
});

export const { setSelectedLeague, clearError } = sportsSlice.actions;
export default sportsSlice.reducer;