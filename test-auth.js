const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://czmxxlsnmbocldqwqwuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXh4bHNubWJvY2xkcXdxd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDEzNTMsImV4cCI6MjA2OTQxNzM1M30.c1hHsTfzs-OOYWfDz3rEckJ8H-fNcEdWupU6Odwqsd8';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log('🔍 Testing Authentication...\n');

  try {
    // Test 1: Sign up
    console.log('1. Testing sign up...');
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
        }
      }
    });

    if (signUpError) {
      console.error('❌ Sign up failed:', signUpError.message);
      return false;
    }

    console.log('✅ Sign up successful');
    console.log('User ID:', signUpData.user?.id);

    // Test 2: Create user profile
    console.log('\n2. Testing profile creation...');
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: signUpData.user.id,
        email: testEmail,
        full_name: 'Test User',
        weight: 70.5,
        height: 175.0,
        fitness_goals: ['Lose weight', 'Build muscle'],
      });

    if (profileError) {
      console.error('❌ Profile creation failed:', profileError.message);
      return false;
    }

    console.log('✅ Profile creation successful');

    // Test 3: Sign in
    console.log('\n3. Testing sign in...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword,
    });

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
      return false;
    }

    console.log('✅ Sign in successful');

    // Test 4: Get user profile
    console.log('\n4. Testing get user profile...');
    const { data: profileData, error: profileGetError } = await supabase
      .from('users')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (profileGetError) {
      console.error('❌ Get profile failed:', profileGetError.message);
      return false;
    }

    console.log('✅ Get profile successful');
    console.log('Profile:', profileData);

    // Test 5: Sign out
    console.log('\n5. Testing sign out...');
    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      console.error('❌ Sign out failed:', signOutError.message);
      return false;
    }

    console.log('✅ Sign out successful');

    console.log('\n🎉 All authentication tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Run the test
testAuth()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Authentication is working correctly!');
      process.exit(0);
    } else {
      console.log('\n⚠️ Authentication needs attention.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }); 