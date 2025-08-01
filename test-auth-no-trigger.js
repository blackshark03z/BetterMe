const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://czmxxlsnmbocldqwqwuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXh4bHNubWJvY2xkcXdxd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDEzNTMsImV4cCI6MjA2OTQxNzM1M30.c1hHsTfzs-OOYWfDz3rEckJ8H-fNcEdWupU6Odwqsd8';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthWithoutTrigger() {
  console.log('🔍 Testing Authentication without trigger...\n');

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
      console.error('Error details:', signUpError);
      return false;
    }

    console.log('✅ Sign up successful');
    console.log('User ID:', signUpData.user?.id);
    console.log('Session:', signUpData.session ? 'Yes' : 'No');

    if (signUpData.user && !signUpData.session) {
      console.log('⚠️ User created but needs email confirmation');
      console.log('This is normal for Supabase with email confirmation enabled');
      
      // Test manual profile creation
      console.log('\n2. Testing manual profile creation...');
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: signUpData.user.id,
          email: testEmail,
          full_name: 'Test User',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

      if (profileError) {
        console.error('❌ Manual profile creation failed:', profileError.message);
      } else {
        console.log('✅ Manual profile creation successful');
      }
      
      return true;
    }

    console.log('\n🎉 Authentication test completed!');
    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    return false;
  }
}

// Run the test
testAuthWithoutTrigger()
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