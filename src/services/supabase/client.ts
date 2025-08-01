import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from './types';

// Load environment variables with fallback
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://czmxxlsnmbocldqwqwuu.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXh4bHNubWJvY2xkcXdxd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDEzNTMsImV4cCI6MjA2OTQxNzM1M30.c1hHsTfzs-OOYWfDz3rEckJ8H-fNcEdWupU6Odwqsd8';

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing!');
  console.error('Please create a .env file with:');
  console.error('EXPO_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 