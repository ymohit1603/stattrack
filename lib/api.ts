import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export type AppName = 'X' | 'LinkedIn';
export type SubscriptionTier = 'FREE' | 'PRO' | 'TEAM' | 'ENTERPRISE';
export type BillingInterval = 'MONTHLY' | 'ANNUAL';

export interface LanguageStats {
  name: string;
  total_seconds: number;
  percent: number;
}

export interface UserStats {
  total_coding_time: number;
  languages: string[];
  editors: string[];
  projects: string[];
}

export interface DailyStats {
  date: string;
  coding_time: number;
  languages: string[];
  projects: string[];
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  twitterId?: string;
  linkedinId?: string;
  profile_url?: string;
  app_name: AppName;
  website?: string;
  github_username?: string;
  twitter_username?: string;
  linkedin_username?: string;
  address?: string;
  isPrivate: boolean;
  editors_used_public: boolean;
  categories_used_public: boolean;
  os_used_public: boolean;
  logged_time_public: boolean;
  timezone?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionStart?: string;
  subscriptionEnd?: string;
  billingInterval?: BillingInterval;
  stripeCustomerId?: string;
  teamId?: number;
  isTeamAdmin: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaderboardResponse {
  data: {
    range: {
      start: string;
      end: string;
      range: string;
      timezone: string;
    };
    current_user: {
      rank: number;
      total_seconds: number;
      days_coded: number;
      running_total: number;
    } | null;
    language: string | null;
    page: number;
    total_pages: number;
    ranks: Array<{
      user: {
        id: number;
        username: string;
        profile_url: string | null;
      };
      rank: number;
      running_total: number;
      total_seconds: number;
      days_coded: number;
      badge: 'gold' | 'silver' | 'bronze' | null;
    }>;
  };
}

export interface ProjectStats {
  name: string;
  badge: string;
  color: string;
  clients: string[];
  has_public_url: boolean;
  human_readable_last_Heartbeat_at: string;
  url: string;
  language: string;
  progress: number;
};

export type dataType ={
  data:UserProfile
}

export type projectStats ={
  data:ProjectStats[]
}

export interface StatsResponse {
  range: {
    start: string;
    end: string;
    range: string;
    timezone: string;
  };
  summary: {
    total_seconds: number;
    prev_period_seconds: number;
    change_percentage: number;
  };
  daily_stats: Array<{
    date: string;
    total_seconds: number;
    session_count: number;
  }>;
  languages: Array<{
    language: string;
    session_count: number;
    total_seconds: number;
    percentage: number;
  }>;
  lines_per_day: Array<{
    date: string;
    total_lines: number;
  }>;
  recent_sessions: Array<{
    start_time: string;
    end_time: string;
    duration: number;
    total_lines: number;
    languages: string[];
  }>;
  goals: {
    daily_coding_time: {
      target: number;
      current: number;
      progress: number;
    };
    weekly_coding_days: {
      target: number;
      current: number;
      progress: number;
    };
  };
  leaderboard: Array<{
    id: number;
    username: string;
    profile_url: string | null;
    total_seconds: number;
    days_coded: number;
    rank: number;
  }>;
}


// Stats API
export const statsApi = {
  getUserStats: async (range: string): Promise<{ data: StatsResponse }> => {
    console.log(range);
    const response = await api.get<StatsResponse>('/users/current/stats/summary', { params: { range } });
    console.log(response)
    return { data: response.data };
  },

  getLanguageStats: async (start?: string, end?: string): Promise<LanguageStats[]> => {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);

    const { data } = await api.get<LanguageStats[]>('/users/current/stats/languages', { params });
    return data;
  },

  getDailyStats: async (start: string, end: string): Promise<{ data: DailyStats[] }> => {
    const { data } = await api.get<{ data: DailyStats[] }>('/users/current/stats/daily', {
      params: { start, end }
    });
    return data;
  },

  getHeatmapStats: async (year?: number): Promise<{ data: Array<{ date: string; total_seconds: number }> }> => {
    const response = await api.get<Array<{ date: string; total_seconds: number }>>('/users/current/stats/heatmap', { params: { year } });
    return { data: response.data };
  }
};

// User API
export const userApi = {
  getCurrentUser: async (): Promise<dataType> => {
    const { data } = await api.get<dataType>('/users/current');
    console.log(data);
    return data;
  },

  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const { data } = await api.patch<UserProfile>('/users/current', profile);
    return data;
  },

  updateAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const { data } = await api.post<{ avatarUrl: string }>('/users/current/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  toggleProfileVisibility: async (isPrivate: boolean): Promise<void> => {
    await api.post('/users/current/visibility', { isPrivate });
  }
};

// Leaderboard + Projects API
export const leaderboardApi = {
  getLeaderboard: async (timeframe: 'last_7_days' | 'last_30_days' | 'last_6_months' | 'last_year' = 'last_7_days'): Promise<LeaderboardResponse> => {
    const { data } = await api.get<LeaderboardResponse>('/users/current/leaderboards', {
      params: { range: timeframe }
    });
    return data;
  },

  getUserProjects: async (): Promise<projectStats> => {
    const { data } = await api.get<projectStats>('/users/current/projects');
    console.log(data)
    return data;
  }
};

export default api;
