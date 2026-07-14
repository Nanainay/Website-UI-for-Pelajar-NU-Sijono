import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htlikyvrtujtizdlmgew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0bGlreXZydHVqdGl6ZGxtZ2V3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyODM4MDUsImV4cCI6MjA5Nzg1OTgwNX0.H6q1_WQ1jPgH3kvSniPyfm9XeQAezckNsTCY_-j0viw';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
  // 1. Check tables
  const { data: roles } = await supabase.from('roles').select('*');
  console.log('Roles:', JSON.stringify(roles));

  const { data: users } = await supabase.from('users').select('*');
  console.log('Users:', JSON.stringify(users));

  // 2. Try login
  console.log('\nAttempting login as admin@example.com / password...');
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'admin@example.com',
    password: 'password',
  });

  if (loginError) {
    console.error('Login FAILED:', loginError.message, loginError.status);
  } else {
    console.log('Login SUCCESS! User ID:', loginData.user?.id);
    console.log('User metadata:', JSON.stringify(loginData.user?.user_metadata));

    // 3. Try fetching profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('id', loginData.user?.id)
      .maybeSingle();

    if (profileError) {
      console.error('Profile query error:', profileError.message);
    } else if (!profile) {
      console.log('Profile NOT FOUND in public.users (trigger did not fire)');
    } else {
      console.log('Profile found:', JSON.stringify(profile, null, 2));
    }
  }
}

diagnose();
