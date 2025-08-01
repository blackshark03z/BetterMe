export interface User {
  id: string;
  email: string;
  name: string;
  age?: number;
  weight?: number; // in kg
  height?: number; // in cm
  goal?: 'lose_fat' | 'gain_muscle' | 'maintain';
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  current_weight?: number;
  target_weight?: number;
  waist_measurement?: number;
  hip_measurement?: number;
  chest_measurement?: number;
  arm_measurement?: number;
  bmi?: number;
  body_fat_percentage?: number;
  daily_calorie_goal?: number;
  daily_protein_goal?: number;
  daily_carbs_goal?: number;
  daily_fat_goal?: number;
  daily_water_goal?: number; // in ml
  units_preference: 'metric' | 'imperial';
  theme_preference: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  goal?: 'lose_fat' | 'gain_muscle' | 'maintain';
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
} 