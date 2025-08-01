import { supabase } from '../services/supabase/client';
import { DatabaseService } from '../services/database';

export async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');

  try {
    // Test 1: Check if we can connect to Supabase
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }

    console.log('✅ Database connection successful');

    // Test 2: Check if tables exist
    const tables = ['users', 'workout_plans', 'progress_logs'];
    
    for (const table of tables) {
      try {
        const { error: tableError } = await supabase.from(table).select('*').limit(1);
        if (tableError) {
          console.error(`❌ Table '${table}' does not exist or is not accessible`);
          return false;
        }
        console.log(`✅ Table '${table}' exists and is accessible`);
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err);
        return false;
      }
    }

    console.log('✅ All database tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

export async function testAuthFlow() {
  console.log('🔍 Testing authentication flow...');

  try {
    // Test 1: Check if auth is configured
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('❌ Auth configuration error:', error);
      return false;
    }

    console.log('✅ Auth configuration successful');
    console.log('👤 Current user:', user ? user.email : 'No user logged in');

    return true;

  } catch (error) {
    console.error('❌ Auth test failed:', error);
    return false;
  }
}

export async function runAllTests() {
  console.log('🚀 Running all database tests...\n');

  const dbTest = await testDatabaseConnection();
  const authTest = await testAuthFlow();

  console.log('\n📊 Test Results:');
  console.log(`Database Connection: ${dbTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Authentication: ${authTest ? '✅ PASS' : '❌ FAIL'}`);

  if (dbTest && authTest) {
    console.log('\n🎉 All tests passed! Database is ready to use.');
    return true;
  } else {
    console.log('\n⚠️  Some tests failed. Please check the setup.');
    return false;
  }
} 