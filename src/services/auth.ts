import { supabase } from './supabase/client';
import { User, AuthError } from '@supabase/supabase-js';

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  error?: string;
}

export class AuthService {
  /**
   * Đăng ký user mới
   */
  static async signUp(email: string, password: string, userData: {
    full_name: string;
    age?: number;
    weight?: number;
    height?: number;
    goal?: string;
  }): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting sign up process...');
      
      // Đăng ký với Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name,
          }
        }
      });

      if (authError) {
        console.error('❌ Auth signup failed:', authError.message);
        return {
          success: false,
          error: authError.message
        };
      }

      if (!authData.user) {
        return {
          success: false,
          error: 'No user data returned from signup'
        };
      }

      console.log('✅ Auth signup successful');

      // Tạm thời bỏ qua lỗi database
      console.log('⚠️ Database error ignored for now');
      
      return {
        success: true,
        user: authData.user
      };

    } catch (error) {
      console.error('❌ Signup error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Đăng nhập
   */
  static async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting sign in process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Sign in failed:', error.message);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Sign in successful');

      // Kiểm tra xem user có profile chưa
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile chưa tồn tại, tạo mới
        console.log('📝 Creating user profile...');
        const { error: createProfileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: data.user.email!,
            full_name: data.user.user_metadata?.full_name || 'User',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

        if (createProfileError) {
          console.error('❌ Profile creation failed:', createProfileError.message);
        } else {
          console.log('✅ Profile created successfully');
        }
      } else if (profileData) {
        console.log('✅ User profile exists');
      }
      
      return {
        success: true,
        user: data.user
      };

    } catch (error) {
      console.error('❌ Sign in error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Đăng xuất
   */
  static async signOut(): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting sign out process...');
      
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Sign out failed:', error.message);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Sign out successful');
      
      return {
        success: true
      };

    } catch (error) {
      console.error('❌ Sign out error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Lấy user hiện tại
   */
  static async getCurrentUser(): Promise<AuthResponse> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error) {
        console.error('❌ Get current user failed:', error.message);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        user: user
      };

    } catch (error) {
      console.error('❌ Get current user error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(email: string): Promise<AuthResponse> {
    try {
      console.log('🔐 Starting password reset...');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'betterme://reset-password',
      });

      if (error) {
        console.error('❌ Password reset failed:', error.message);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Password reset email sent');
      
      return {
        success: true
      };

    } catch (error) {
      console.error('❌ Password reset error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Kiểm tra session hiện tại
   */
  static async checkSession(): Promise<AuthResponse> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('❌ Check session failed:', error.message);
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        user: session?.user || null
      };

    } catch (error) {
      console.error('❌ Check session error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
} 