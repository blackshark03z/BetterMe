const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://czmxxlsnmbocldqwqwuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXh4bHNubWJvY2xkcXdxd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDEzNTMsImV4cCI6MjA2OTQxNzM1M30.c1hHsTfzs-OOYWfDz3rEckJ8H-fNcEdWupU6Odwqsd8';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSimpleAuth() {
  console.log('🔍 Testing Simple Authentication...\n');

  try {
    // Test 1: Sign up without email confirmation
    console.log('1. Testing sign up...');
    const testEmail = `test${Date.now()}@example.com`;
    const testPassword = 'password123';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
        },
        emailRedirectTo: 'betterme://login'
      }
    });

    if (signUpError) {
      console.error('❌ Sign up failed:', signUpError.message);
      console.error('Error details:', signUpError);
      return false;
    }

    console.log('✅ Sign up successful');
    console.log('User ID:', signUpData.user?.id);
    console.log('Session:', signUpData.session ? 'Yes' : 'No');

    if (signUpData.user && !signUpData.session) {
      console.log('⚠️ User created but needs email confirmation');
      console.log('This is normal for Supabase with email confirmation enabled');
      return true;
    }

    // Test 2: Sign in (if session exists)
    if (signUpData.session) {
      console.log('\n2. Testing sign in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (signInError) {
        console.error('❌ Sign in failed:', signInError.message);
        return false;
      }

      console.log('✅ Sign in successful');
    }

    console.log('\n🎉 Authentication test completed!');
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Run the test
testSimpleAuth()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Authentication is working!');
      console.log('Note: Email confirmation may be required');
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