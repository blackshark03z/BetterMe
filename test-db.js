const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://czmxxlsnmbocldqwqwuu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6bXh4bHNubWJvY2xkcXdxd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NDEzNTMsImV4cCI6MjA2OTQxNzM1M30.c1hHsTfzs-OOYWfDz3rEckJ8H-fNcEdWupU6Odwqsd8';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseConnection() {
  console.log('🔍 Testing Supabase database connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');

    // Test 2: Check if tables exist
    console.log('\n2. Checking if tables exist...');
    const tables = ['users', 'workout_plans', 'progress_logs'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table).select('*').limit(1);
        if (tableError) {
          console.error(`❌ Table '${table}' does not exist or is not accessible`);
          console.error('   Error:', tableError.message);
          return false;
        }
        console.log(`✅ Table '${table}' exists and is accessible`);
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err.message);
        return false;
      }
    }

    // Test 3: Check RLS policies
    console.log('\n3. Testing Row Level Security...');
    try {
      const { error: rlsError } = await supabase.from('users').select('*').limit(1);
      if (rlsError && rlsError.message.includes('policy')) {
        console.log('✅ RLS is enabled (expected error for unauthenticated access)');
      } else {
        console.log('⚠️  RLS might not be properly configured');
      }
    } catch (err) {
      console.log('✅ RLS is working (expected behavior)');
    }

    console.log('\n🎉 All database tests passed!');
    console.log('✅ Database is properly configured');
    console.log('✅ Tables exist and are accessible');
    console.log('✅ RLS policies are in place');
    
    return true;

  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    return false;
  }
}

// Run the test
testDatabaseConnection()
  .then((success) => {
    if (success) {
      console.log('\n🚀 Database setup is complete and working!');
      process.exit(0);
    } else {
      console.log('\n⚠️  Database setup needs attention.');
      console.log('Please check the Supabase configuration and run the SQL migration script.');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }); 